import { NgForOf, NgIf } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormArray, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlowStatus, InvoiceStatusEnum } from '@core/enums';
import {
  createInvInfoRoutingLevelForm,
  createInvRoutingFlowLevelFormGroup,
  InvInfoRoutingFlowFormGroup,
  InvInfoRoutingLevelFormGroup,
} from '@core/model/invoicing/invoice/invoice-routing-levels.form';
import {
  InvoiceRoutingFlowSelectTableDto,
  SearchInvRoutingFlowDto,
  SearchInvRoutingFlowQuery,
  SearchInvRoutingModel,
} from '@core/model/invoicing/invoicing.index';
import {
  GridService,
  InvoiceDetailService,
  InvRoutingFlowService,
  LookupOptionsService
} from '@core/services';
import { PrimeImportsModule } from '@shared/moduleResources/prime-imports';
import { RoutingflowRoleSelectorComponent } from '@shared/popup/routingflow-role-selector/routingflow-role-selector.component';
import { SelectTableComponent } from '@shared/popup/select-table/select-table.component';
import { SelectItem } from 'primeng/api';
import {
  DialogService,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { BehaviorSubject, combineLatest, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-invoice-routing-flow',
  standalone: true,
  providers: [DialogService],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    PrimeImportsModule,
    NgIf,
    NgForOf,
  ],
  templateUrl: './invoice-routing-flow.component.html',
  styleUrl: './invoice-routing-flow.component.scss',
})
export class InvoiceRoutingFlowComponent
  implements OnInit, OnDestroy, OnChanges
{
  private destroySubject: Subject<void> = new Subject();
  private dataList$ = new BehaviorSubject<any[]>([]);
  private totalRecord$ = new BehaviorSubject<number>(0);
  totalRecords = 0;
  selectedRoutingFlow?: InvoiceRoutingFlowSelectTableDto;
  invoiceRoutingFlowData: InvoiceRoutingFlowSelectTableDto[] = [];
  rolesOptions?: SelectItem[] = [];
  public FlowStatus = FlowStatus;

  // new implementation
  invInfoRoutingLevelForm!: InvInfoRoutingFlowFormGroup;
  @Input() invoiceID: number = 0;
  @Input() keywordID: number | null = null;
  @Input() supplierInfoID: number | null = null;
  @Input() invoiceStatus?: InvoiceStatusEnum | null;

  currentLevelIndex: number | null = null;

  constructor(
    private dialogService: DialogService,
    private gridService: GridService,
    private invRoutingFlowService: InvRoutingFlowService,
    private lookUpOptionService: LookupOptionsService,
    private invDetailService: InvoiceDetailService
  ) {
    this.invInfoRoutingLevelForm = createInvInfoRoutingLevelForm();
  }


  readonly roleOptions$ = this.lookUpOptionService.rolesLookUpOptions$;
  ngOnInit(): void {
    this.roleOptions$
      .pipe(takeUntil(this.destroySubject))
      .subscribe((options) => {
        this.rolesOptions = options;
      });
    //this.loadInvRoutingLevel(this.invoiceID,this.supplierInfoID??0,this.keywordID??0);
  }

  ngOnChanges(changes: SimpleChanges): void {
    // if (changes['invoiceID']){
    //   this.invoiceID = Number(changes['invoiceID'].currentValue ?? 0);
    // }
    // if (changes['supplierInfoID']){
    //   this.supplierInfoID = Number(changes['supplierInfoID'].currentValue ?? 0);
    // }
    // if (changes['keywordID']){
    //   this.keywordID = Number(changes['keywordID'].currentValue ?? 0);
    // }

    // this.loadInvRoutingLevel(this.invoiceID,this.supplierInfoID??0,this.keywordID??0);
  }

  loadInvoiceRoutingFlow(){
    this.loadInvRoutingLevel(this.invoiceID,this.supplierInfoID??0,this.keywordID??0);
  }

  assignRoutingFlow() {
    const ref: DynamicDialogRef = this.dialogService.open(
      SelectTableComponent,
      {
        header: 'Select Routing Flow',
        contentStyle: { overflow: 'auto' },
        baseZIndex: 10000,
        width: '50vw',
        modal: true,
        closable: true,
        data: {
          multiple: false,
          columns: this.gridService.invoiceRoutingFlowSelectTableGridColumn(),
          data$: this.dataList$,
          totalRecords$: this.totalRecord$,
          selectedRows: this.selectedRoutingFlow
            ? [this.selectedRoutingFlow]
            : [],
          onSearch: (filters: any) => {
            const query: SearchInvRoutingFlowQuery = {
              ...filters,
            };
            this.searchInvRoutingFlow(query);
          },
        },
      }
    );

    ref.onClose.subscribe((selected) => {
      if (selected && selected.length > 0) {
        this.selectedRoutingFlow = selected[0];
      }
    });
  }

  searchInvRoutingFlow(query: SearchInvRoutingFlowQuery) {
    this.invRoutingFlowService
      .searchInvRoutingFlow(query)
      .pipe(takeUntil(this.destroySubject))
      .subscribe({
        next: (res) => {
          if (res.isSuccess && res.responseData?.data) {
            this.invoiceRoutingFlowData = res.responseData.data.map(
              (
                sirf: SearchInvRoutingFlowDto
              ): InvoiceRoutingFlowSelectTableDto => ({
                invRoutingFlowID: sirf.invRoutingFlowID,
                EntityName: sirf.entity,
                InvRoutingFlowName: sirf.invoiceRoutingFlowName,
                LinkSupplier: sirf.suppliersLinked,
                MatchReference: sirf.matchReference,
              })
            );
            this.totalRecords = res.responseData.totalCount;

            // Push new data to the modal table
            this.dataList$.next(this.invoiceRoutingFlowData);
            this.totalRecord$.next(this.totalRecords);
          }
        },
        error: () => {},
      });
  }

  private loadInvRoutingLevel(invoiceID: number,supplierInfoID:number | null,keywordID:number | null) {
    combineLatest([
      this.invDetailService.getInvoiceRoutingLevels(invoiceID,supplierInfoID,keywordID),
    ]).pipe(takeUntil(this.destroySubject))
    .subscribe(([res]) => {
      if (res.isSuccess) {
        const routingLevels = res.responseData ?? [];

        // Sort by level ascending
        routingLevels.sort((a, b) => (a.level ?? 0) - (b.level ?? 0));

        this.routingFlowLevels.clear();

        routingLevels.forEach((level) => {
          this.routingFlowLevels.push(createInvRoutingFlowLevelFormGroup(level));
        });

        // Ensure levels in FormArray are sequential (1,2,3,...)
        this.updateLevels();
      }
    });
  }

  //forms
  get routingFlowLevels(): FormArray<InvInfoRoutingLevelFormGroup> {
    return this.invInfoRoutingLevelForm.get(
      'invInfoRoutingLevels'
    ) as FormArray<InvInfoRoutingLevelFormGroup>;
  }

  get f() {
    return this.invInfoRoutingLevelForm.controls;
  }

  getRoleName(roleID: number): string {
    return this.rolesOptions?.find((r) => r.value === roleID)?.label || '';
  }
  ngOnDestroy(): void {
    this.destroySubject.next();
    this.destroySubject.complete();
  }

  addLevel(selectedRole: number) {
    //  const selectedRole = this.f['selectedRoleID'].value;
    //  if (!selectedRole) return;

    // const isLast = this.rolesOptions?.find((r) => r.value === 1);
    // if (!isLast) return;

    const exists = this.routingFlowLevels.controls.some(
      (level) => level.value.roleID === selectedRole
    );
    if (exists) return;

    if (this.routingFlowLevels.length >= 10) return;

    const newLevel = createInvRoutingFlowLevelFormGroup({
      roleID: selectedRole,
      level: this.routingFlowLevels.length + 1,
    });
    this.routingFlowLevels.push(newLevel);
  }

  removeLevel(index: number) {
    const levelFormGroup = this.routingFlowLevels.at(index);
    const { roleID, level } = levelFormGroup.value;

    if (!roleID || !level) {
      // If not yet saved in backend, just remove locally
      this.removeLevelLocally(index);
      return;
    }

    // Prepare command for backend
    const removeCommand = {
      invoiceID: this.invoiceID,
      roleID,
      level,
    };

    // Call backend to remove level
    this.invRoutingFlowService
      .removeAssignedRole(removeCommand)
      .pipe(takeUntil(this.destroySubject))
      .subscribe({
        next: (res) => {
          if (res.isSuccess) {
            this.removeLevelLocally(index);
          } else {
            console.error('Failed to delete level from backend', res);
          }
        },
        error: (err) => {
          console.error('Error deleting level from backend', err);
        },
      });
  }

  private removeLevelLocally(index: number) {
    this.routingFlowLevels.removeAt(index);
    this.updateLevels();
  }

  searchRole(index?: number) {
    const roles = this.routingFlowLevels.getRawValue();
    const ref = this.dialogService.open(RoutingflowRoleSelectorComponent, {
      header: 'Add Level : Select Role ',
      modal: true,
      closable: true,
      width: '40rem',

      data: {
        excludesSelectedRoleIds: roles.map((r) => r.roleID),
        invoiceID: this.invoiceID,
        keywordID: this.keywordID,
        supplierInfoID: this.supplierInfoID,
        level: index !== undefined ? index + 1 : roles.length + 1,
      },
      style: { minHeight: '200px' },
      dismissableMask: true,
      baseZIndex: 1200,
    });

    ref.onClose.subscribe((result: number) => {
      if (result !== undefined) {
        const position = index ?? roles.length; // insert at position or end

        // create new level with temporary level = 0
        const newLevel = createInvRoutingFlowLevelFormGroup({
          roleID: result,
          level: 0,
        });

        // insert at desired position
        this.routingFlowLevels.insert(position, newLevel);

        this.updateLevels();

        this.routingFlowLevels.markAsTouched();
      }
    });
  }

  updateLevels() {
    this.routingFlowLevels.controls.forEach((group, i) => {
      group.get('level')?.setValue(i + 1, { emitEvent: false });
    });
  }

  confirmRoleSelction() {}

  disableAddRole(){
    const permissions = localStorage.getItem('user_permissions');
    const _permissions = permissions ? JSON.parse(permissions) : [];
    // console.log(_permissions.includes('CanModifyInvFlow'));
    return !_permissions.includes('CanModifyInvFlow');
  }

  isRestrictedLockedStatus(): boolean {
    return [
      InvoiceStatusEnum.ReadyForExport,
      InvoiceStatusEnum.Exported,
      InvoiceStatusEnum.Approved,
      InvoiceStatusEnum.Archived
    ].includes(this.invoiceStatus!);
  }

  isRestrictedMidEditStatus(): boolean {
    return [
      InvoiceStatusEnum.ForApproval,
      InvoiceStatusEnum.ApprovalOnHold,
      InvoiceStatusEnum.Exception,
      InvoiceStatusEnum.ExceptionOnHold
    ].includes(this.invoiceStatus!);
  }

  private readonly blockedFlowStatuses = new Set<FlowStatus>([
    FlowStatus.Submitted,
    FlowStatus.Assigned
  ]);

  private isSingleRoleLevel(): boolean {
    return this.routingFlowLevels.length === 1;
  }

  canRemoveLevel(index: number): boolean {
    const level = this.routingFlowLevels.at(index).value;

    if (level.flowStatus == null) return false;

    if (this.isSingleRoleLevel()) return true;

    if (this.blockedFlowStatuses.has(level.flowStatus)) return false;

    if (this.isRestrictedLockedStatus()) return false;

    if (this.isRestrictedMidEditStatus()) {
      return index === this.routingFlowLevels.length - 1;
    }
    
    return true;
  }

  canAddLevel(index: number): boolean {
    const level = this.routingFlowLevels.at(index).value;

    if (level.flowStatus == null) return false;
    
    if (this.isSingleRoleLevel()) return true;

    if (this.blockedFlowStatuses.has(level.flowStatus)) return false;

    if (this.isRestrictedLockedStatus()) return false;

    if (this.isRestrictedMidEditStatus()) {
      return index === this.routingFlowLevels.length - 1;
    }

    return true;
  }

}
