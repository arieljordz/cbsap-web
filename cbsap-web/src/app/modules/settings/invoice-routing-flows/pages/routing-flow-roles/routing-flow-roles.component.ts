import { Component, OnInit } from '@angular/core';
import { GridConfig } from '@core/model/dynamic-grid/grid.config';
import {
  SearchInvRoutingFlowByRolesQuery,
  SearchInvRoutingFlowRolesDto,
} from '@core/model/invoicing/invoicing.index';
import { GridService, InvRoutingFlowService } from '@core/services';
import { DynamicGridService } from '@core/services/shared/dynamic-grid.service';
import { DynamicGridComponent } from '@shared/grid/dynamic-grid/dynamic-grid.component';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-routing-flow-roles',
  standalone: true,
  imports: [DynamicGridComponent],
  providers: [DynamicGridService],
  templateUrl: './routing-flow-roles.component.html',
  styleUrl: './routing-flow-roles.component.scss',
})
export class RoutingFlowRolesComponent implements OnInit {
  gridConfig: GridConfig<SearchInvRoutingFlowRolesDto> | null = null;
  invRoutingFlowID!: number;
  constructor(
    private dynamicGridService: DynamicGridService<SearchInvRoutingFlowRolesDto>,
    private invRoutingFlowService: InvRoutingFlowService,
    private gridService: GridService,
    public dialogconfig: DynamicDialogConfig
  ) {}
  ngOnInit(): void {
    this.initializeDynamicGrid();
  }

  private initializeDynamicGrid() {
    const columns = this.gridService.invRoutingFlowRolesGridColumn();
    this.invRoutingFlowID = this.dialogconfig.data?.invRoutingFlowID;
    this.dynamicGridService.setConfig({
      columns,
      data: [],
      totalRecords: 0,
      loading: false,
      rowClick: [
        {
          allow: false,
        },
      ],
    });
  }

  onLazyLoad(event: any): void {
    const pageNumber = event.pageNumber;
    const rows = event.pageSize ?? 10;
    const sortField = event.sortField || '';
    const sortOrder = event.sortOrder ?? -1;
    const query: SearchInvRoutingFlowByRolesQuery = {
      invRoutingFlowID: this.invRoutingFlowID,
      PageNumber: pageNumber,
      PageSize: rows,
      SortField: sortField,
      SortOrder: sortOrder,
    };

    this.dynamicGridService.setLoading(true);
    this.searchInvRoutingFlowByRoles(query);
  }

  private searchInvRoutingFlowByRoles(query: SearchInvRoutingFlowByRolesQuery) {
    this.invRoutingFlowService.searchInvRoutingFlowByRoles(query).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.dynamicGridService.updateData(
            res.responseData?.data ?? [],
            res.responseData?.totalCount ?? 0
          );
        }
      },
      error: () => {
        this.dynamicGridService.setLoading(false);
      },
    });
  }
}
