import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Pagination, ResponseResult } from '@core/model/common';
import { RoleEntitiyDto } from '@core/model/roles-management';
import { SearchEntityQuery } from '@core/model/system-settings/entity/entity-search.query';
import { EntitySearchDto } from '@core/model/system-settings/entity/entity-searchDto';
import { EntityService, GridService } from '@core/services';
import { PrimeImportsModule } from '@shared/moduleResources/prime-imports';
import { SelectTableComponent } from '@shared/popup/select-table/select-table.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-role-entities',
  standalone: true,
  providers: [DialogService],
  imports: [ReactiveFormsModule, FormsModule, PrimeImportsModule],
  templateUrl: './role-entities.component.html',
  styleUrl: './role-entities.component.scss',
})
export class RoleEntitiesComponent implements OnInit, OnDestroy {
  @Input() formGroup!: FormGroup;
  @Input() formSubmitted!: Boolean;

  private destroySubject: Subject<void> = new Subject();
  private dataList$ = new BehaviorSubject<any[]>([]);
  private totalRecord$ = new BehaviorSubject<number>(0);
  totalRecords = 0;
  entitypagination: RoleEntitiyDto[] = [];

  constructor(
    private dialogService: DialogService,
    private entityService: EntityService,
    private gridService: GridService
  ) {}

  ngOnInit(): void {}

  assignEntities(): void {
    const ref: DynamicDialogRef = this.dialogService.open(
      SelectTableComponent,
      {
        header: 'Select Entity',
        contentStyle: { 'max-height': '500px', overflow: 'auto' },
        baseZIndex: 10000,
        modal: true,
        closable: true,
        data: {
          multiple: true,
          columns: this.gridService.entitySelectGridColumn(),
          data$: this.dataList$,
          totalRecords$: this.totalRecord$,
          selectedRows: this.f?.['selectedEntities']?.value || [],
          onSearch: (filters: any) => {
            const query: SearchEntityQuery = {
              ...filters,
            };
            this.searchEntities(query);
          },
        },
      }
    );

    ref.onClose.subscribe((selected) => {
      if (selected) {
        this.formGroup.patchValue({
          selectedEntities: selected,
        });
      }
    });
  }

  searchEntities(query: SearchEntityQuery) {
    this.entityService
      .searchEntity(query)
      .pipe(takeUntil(this.destroySubject))
      .subscribe({
        next: (result: ResponseResult<Pagination<EntitySearchDto>>) => {
          if (result.isSuccess && result.responseData?.data) {
            this.entitypagination = result.responseData.data.map(
              (entity: EntitySearchDto): RoleEntitiyDto => ({
                entityProfileID: entity.entityProfileID,
                entityName: entity.entityName,
                entityCode: entity.entityCode,
              })
            );
            this.totalRecords = result.responseData.totalCount;

            this.dataList$.next(this.entitypagination);
            this.totalRecord$.next(this.totalRecords);
          }
        },
        error: (error) => this.onError(error),
      });
  }

  onError(error: any) {
    this.dataList$.next([]);
  }

  onRowDelete(entityToDelete: any): void {
    const currentEntities = this.f['selectedEntities']?.value || [];

    const updatedEntities = currentEntities.filter(
      (entity: any) => entity !== entityToDelete
    );

    this.f['selectedEntities'].setValue(updatedEntities);
  }

  get f() {
    return this.formGroup.controls;
  }

  get selectedEntities(): any[] {
    return this.f['selectedEntities']?.value || [];
  }

  trackByFn(index: number, item: any): any {
    return item.field;
  }

  ngOnDestroy(): void {
    this.destroySubject.next();
    this.destroySubject.complete();
  }
}
