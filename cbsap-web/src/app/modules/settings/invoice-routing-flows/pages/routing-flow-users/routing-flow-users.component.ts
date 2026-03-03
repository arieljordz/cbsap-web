import { Component, OnInit } from '@angular/core';
import { GridConfig } from '@core/model/dynamic-grid/grid.config';
import {
  SearchInvRoutingFlowByUserQuery,
  SearchInvRoutingFlowUserDto,
} from '@core/model/invoicing/invoicing.index';
import { GridService, InvRoutingFlowService } from '@core/services';
import { DynamicGridService } from '@core/services/shared/dynamic-grid.service';
import { DynamicGridComponent } from '@shared/grid/dynamic-grid/dynamic-grid.component';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-routing-flow-users',
  standalone: true,
  imports: [DynamicGridComponent],
  providers: [DynamicGridService],
  templateUrl: './routing-flow-users.component.html',
  styleUrl: './routing-flow-users.component.scss',
})
export class RoutingFlowUsersComponent implements OnInit {
  gridConfig: GridConfig<SearchInvRoutingFlowUserDto> | null = null;
  invRoutingFlowID!: number;
  constructor(
    private dynamicGridService: DynamicGridService<SearchInvRoutingFlowUserDto>,
    private invRoutingFlowService: InvRoutingFlowService,
    private gridService: GridService,
    public dialogconfig: DynamicDialogConfig
  ) {}
  ngOnInit(): void {
    this.initializeDynamicGrid();
  }

  private initializeDynamicGrid() {
    const columns = this.gridService.invRoutingFlowUserGridColumn();
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
    const query: SearchInvRoutingFlowByUserQuery = {
      invRoutingFlowID: this.invRoutingFlowID,
      PageNumber: pageNumber,
      PageSize: rows,
      SortField: sortField,
      SortOrder: sortOrder,
    };

    this.dynamicGridService.setLoading(true);

    this.searchRoutingFlowByUser(query);
  }

  private searchRoutingFlowByUser(query: SearchInvRoutingFlowByUserQuery) {
    this.invRoutingFlowService.searchInvRoutingFlowByUser(query).subscribe({
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
