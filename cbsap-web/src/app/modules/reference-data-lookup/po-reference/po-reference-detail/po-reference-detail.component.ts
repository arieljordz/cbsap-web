import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PO_CONSTANT } from '@core/constants/purchase-order/purchase-order.constants';
import { Pagination } from '@core/model/common';
import { ResponseResult } from '@core/model/common/responseResult';
import { GridConfig } from '@core/model/dynamic-grid/grid.config';
import { batchListPurchaseOrderDto, poDetailDto, poDetailListDto } from '@core/model/purchase-order/po-detail.dto';
import { POSearchQuery, PurchaseOrderListSearchQuery } from '@core/model/purchase-order/po.query';
import { createPurchaseHeaderForm, PurchaseOrderDetailHeaderFormGroup } from '@core/model/reference-data-lookup/PO/purchase-header.form';
import { GridService } from '@core/services';
import { PurchaseOrderService } from '@core/services/purchase-order/purchase-order.service';
import { DynamicGridService } from '@core/services/shared/dynamic-grid.service';
import { DynamicGridComponent } from '@shared/grid/dynamic-grid/dynamic-grid.component';
import { PrimeImportsModule } from '@shared/moduleResources/prime-imports';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-po-reference-detail',
  standalone: true,
    imports: [FormsModule,
      ReactiveFormsModule,
      PrimeImportsModule,
      CommonModule,  
      DynamicGridComponent],
  templateUrl: './po-reference-detail.component.html',
  styleUrl: './po-reference-detail.component.scss'
})
export class PoReferenceDetailComponent {
  //This PO Primary ID
  Id: number = 0;
  formGroupData!: PurchaseOrderDetailHeaderFormGroup;
  Status: string = '';

  private destroy$ = new Subject<void>();
  gridConfig: GridConfig<poDetailListDto> | null = null;
  totalRecords: number = 0;
  pageNumber: number = 0;
  pageSize: number = 10;

  batchListPurchaseOrderDto: batchListPurchaseOrderDto[] = [];
  //Paging
  currentIndex? : number;
  currentPageSelected? : number;
  currentPageSize? : number;
  currentTotalPage? : number;

  clickStatus ={
    Previous : 1,
    Next : 2
  }
  
  constructor(
    private activeRoute: ActivatedRoute,
    private gridService: GridService,
    private purchaseOrderService: PurchaseOrderService,
    private dynamicGridService: DynamicGridService<poDetailListDto>,
    private router: Router,
  ) {
    this.Id = Number(
      this.activeRoute.snapshot.params['id'] ?? 0
    );

    this.formGroupData = createPurchaseHeaderForm();
  }

  ngOnInit(): void {

    if (this.Id > 0) {
      this.loadPurchaseOrderDetail(this.Id);
      this.initializeDynamicGrid();
      this.BatchListPurchaseOrder(0);
    }
  }

  private initializeDynamicGrid() {
    const columns = this.gridService.purchaseOrderDetailLineColumn();

    this.dynamicGridService.setConfig({
      columns,
      data: [],
      totalRecords: 0,
      pageSize: 10,
      pageNumber: 1,
      sortField: '',
      sortOrder: -1,
      loading: false,
      rowClick: [
        {
          allow: false,
        },
      ],
    });
  }

  //prepared the initial list for next and previous
  private BatchListPurchaseOrder(currentPage?: number,clickStatus? : number) {

    const stored = localStorage.getItem(PO_CONSTANT.SEARCH_FILTER_LOCALSTORAGE.PURCHASEORDER);
  
    let query: POSearchQuery | null = stored ? JSON.parse(stored) : null;
  
    // If nothing in localStorage, create a default query
    if (!query) {
      query = {
        PageNumber: 1,
        PageSize: 10,
        TotalPage: 1
      };
    }
  
    // Determine current page
    this.currentPageSelected = currentPage === 0
      ? query.PageNumber
      : currentPage ?? query.PageNumber;
  
    this.currentPageSize = query.PageSize;
    this.currentTotalPage = query.TotalPage!;
  
    // Update query
    query.PageNumber = this.currentPageSelected;
  
    this.poBatchListPurchaseOrder(query,clickStatus);
  }

  poBatchListPurchaseOrder(query: POSearchQuery, clickStatus? : number) {
    this.purchaseOrderService
      .BatchListPurchaseOrder(query)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res.isSuccess) {

            if( res.responseData != null)
            {

              this.batchListPurchaseOrderDto = res.responseData.data!;

              const firstRow = this.batchListPurchaseOrderDto.at(0);
              const lastRow  = this.batchListPurchaseOrderDto.at(-1);

              if(clickStatus == this.clickStatus.Next)
              {
                this.Id = firstRow?.purchaseOrderID!;
                this.currentIndex = firstRow?.indexId;
                this.loadPurchaseOrderDetail(this.Id);
              }
              else if(clickStatus == this.clickStatus.Previous)
              {
                this.Id = lastRow?.purchaseOrderID!;
                this.currentIndex = lastRow?.indexId;
                this.loadPurchaseOrderDetail(this.Id);
              }
              else
              {
                var currentRow =  this.batchListPurchaseOrderDto.find(x => x.purchaseOrderID == this.Id);
                this.Id = currentRow!.purchaseOrderID!;
                this.currentIndex = currentRow!.indexId;
                this.loadPurchaseOrderDetail(this.Id);
              }
            }

    
           
          }
        },
      });
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  onClickPrevious(){

    if(this.currentIndex! == 1 && this.currentPageSelected == 1)
    {
      return;
    }

    if(this.currentIndex == 1 && this.currentPageSelected! > 1)
    {
      this.currentPageSelected! -=1;
      this.BatchListPurchaseOrder(this.currentPageSelected,this.clickStatus.Previous);
    }
    else
    {
      this.currentIndex! -=1;

      const poId = this.batchListPurchaseOrderDto
      .find(p => p.indexId === this.currentIndex);
    
      this.Id = poId?.purchaseOrderID!;
  
      this.loadPurchaseOrderDetail(this.Id);
    }

    this.loadData(0);

  }
  public onClickNext(){
    var getLastIndex = this.batchListPurchaseOrderDto.at(-1);

    if(this.currentIndex! == getLastIndex?.indexId  && this.currentPageSelected == this.currentTotalPage)
    {
      return;
    }

    if(this.currentIndex! == getLastIndex?.indexId! && this.currentPageSelected! >= 1)
    {
      this.currentPageSelected! +=1;
      this.BatchListPurchaseOrder(this.currentPageSelected,this.clickStatus.Next);
    }
    else
    {
      this.currentIndex! +=1;

      const poId = this.batchListPurchaseOrderDto
      .find(p => p.indexId === this.currentIndex);
    
      this.Id = poId?.purchaseOrderID!;
  
      this.loadPurchaseOrderDetail(this.Id);
    }

    this.loadData(0);
  }

  onClickCancel(){
    setTimeout(() => {
      this.router.navigate(['/reference-data-lookup','purchase-orders']);
    }, 1000);
  }

  


  private loadPurchaseOrderDetail(purchaseOrderId: number) {
    this.purchaseOrderService
    .purchaseHeaderGetById(purchaseOrderId)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (results: ResponseResult<poDetailDto>) => {
        if (results.isSuccess && results.responseData) {
          this.patchFormValues(results.responseData);
        }
      },
      error: (error) => console.log(error),
    });
  }

  loadData(pageNum: number) {
    const pageNumber = pageNum;
    const rows =  10;
    const sortField =  '';
    const sortOrder = -1;

    const query: PurchaseOrderListSearchQuery = {
      PurchaseOrderId: this.Id,
      PageNumber: pageNumber,
      PageSize: rows,
      SortField: sortField,
      SortOrder: sortOrder,
    };

    this.dynamicGridService.setLoading(true);
    this.searchPoDetailLine(query);
  }

  private patchFormValues(data: poDetailDto): void {
    const pascalData = this.convertKeysToPascal(data);
    this.Status = pascalData.Status! || '';
    this.formGroupData.patchValue(pascalData);
  }

 toPascalCase(str: string) {
    return str
      .replace(/(^\w|_\w)/g, (match) => match.replace('_', '').toUpperCase());
  }
  
 convertKeysToPascal(obj: any) {
    const newObj: any = {};
    for (const key in obj) {
      const pascalKey = this.toPascalCase(key);
      newObj[pascalKey] = obj[key];
    }
    return newObj;
  }

  onChangeColorStatus(){
    return (this.Status == "Active") ? "p-button-success" : "p-button-danger";
  }

  //List

  
  onLazyLoad(event: any): void {
    const pageNumber = event.pageNumber;
    const rows = event.pageSize ?? 10;
    const sortField = event.sortField || '';
    const sortOrder = event.sortOrder ?? -1;

    const query: PurchaseOrderListSearchQuery = {
      PurchaseOrderId: this.Id,
      PageNumber: pageNumber,
      PageSize: rows,
      SortField: sortField,
      SortOrder: sortOrder,
    };
    this.dynamicGridService.setLoading(true);

    this.searchPoDetailLine(query);
  }

  searchPoDetailLine(query: PurchaseOrderListSearchQuery) {

    this.purchaseOrderService
      .purchaseHeaderDetailLineListGetById(query)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
      
          if (res.isSuccess) {
        
            this.dynamicGridService.updateData(
              res.responseData?.data ?? [],
              res.responseData?.totalCount ?? 0,
              query.PageSize
            );

            this.totalRecords = res.responseData?.totalCount ?? 0;
          }
        },
        error: () => {
          this.dynamicGridService.setLoading(false);
        },
      });
  }
  

}
