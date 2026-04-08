import { NgForOf, NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageSeverity } from '@core/constants';
import { ResponseResult } from '@core/model/common';
import {
  createInvRoutingFlowForm,
  createRoutingFlowLevelFormGroup,
  InvoiceRoutingFlowDto,
  InvRoutingFlowGroup,
  RoutingFlowLevelFormGroup,
} from '@core/model/invoicing/invoicing.index';
import { RoleDTO } from '@core/model/roles-management';
import { Keyword, KeywordGridQuery } from '@core/model/keyword-management';
import { SelectTableComponent } from '@shared/popup/select-table/select-table.component';
import {
  AlertService,
  InvRoutingFlowService,
  LookupOptionsService,
  ValidationService,
} from '@core/services/index';
import {
  GridService,
  KeywordService
} from '@core/services';
import { getErrorMessage } from '@core/utils';
import { CharacterFocusTrackerDirective } from '@shared/directives/character-focus-tracker.directive';
import { PrimeImportsModule } from '@shared/moduleResources/prime-imports';
import { CharacterLengthPipe } from '@shared/pipes/character-length.pipe';
import { RoutingflowRoleSelectorComponent } from '@shared/popup/routingflow-role-selector/routingflow-role-selector.component';
import { ConfirmationService, SelectItem } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { combineLatest, Subject, takeUntil,BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-routing-flow-detail',
  standalone: true,
  providers: [DialogService, AlertService, ConfirmationService],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    PrimeImportsModule,
    CharacterFocusTrackerDirective,
    CharacterLengthPipe,
    NgIf,
    NgForOf,
  ],
  templateUrl: './routing-flow-detail.component.html',
  styleUrl: './routing-flow-detail.component.scss',
})
export class RoutingFlowDetailComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  invRoutingFlowForm!: InvRoutingFlowGroup;
  pagelabel: string = 'Add Invoice Routing Flow ';
  focusStates: { [key: string]: boolean } = {};
  invRoutingFlowID: number = 0;
  isFormSaved: boolean = false;

  entityOptions?: SelectItem[] = [];
  supplierOptions?: SelectItem[] = [];
  rolesOptions?: SelectItem[] = [];
  selectedRole: RoleDTO[] = [];
  private destroySubject: Subject<void> = new Subject();
  private keywordDataList$ = new BehaviorSubject<Keyword[]>([]);
  private keywordTotalRecord$ = new BehaviorSubject<number>(0);
  keywordTotalRecords = 0;
  keywordData: Keyword[] = [];
  selectedKeyword?: Keyword;
  currentLevelIndex: number | null = null;

  constructor(
    private validationService: ValidationService,
    private lookUpOptionService: LookupOptionsService,
    private invRoutingFlowService: InvRoutingFlowService,
    private confirmationService: ConfirmationService,
    private message: AlertService,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private dialogService: DialogService,
    private keywordService: KeywordService,
    private gridService: GridService,
  ) {
    this.invRoutingFlowForm = createInvRoutingFlowForm();
    this.invRoutingFlowID = Number(
      this.activeRoute.snapshot.params['invRoutingFlowID'] ?? 0
    );
  }

  readonly entityOptions$ = this.lookUpOptionService.entityOptions$;
  readonly supplierOptions$ = this.lookUpOptionService.supplierLookUpOptions$;
  readonly roleOptions$ = this.lookUpOptionService.rolesLookUpOptions$;

  ngOnInit(): void {
    this.initiliazeDropdown();
    if (this.invRoutingFlowID != 0) {
      this.pagelabel = 'Edit Invoice Routing Flow';
      this.loadEntityForEdit(this.invRoutingFlowID);
    }
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /** actions */
  onSubmit() {
    const formValue: InvoiceRoutingFlowDto =
      this.invRoutingFlowForm.getRawValue() as InvoiceRoutingFlowDto;
    if (this.invRoutingFlowForm.valid) {
      if (this.invRoutingFlowID != 0) {
        this.updateNewRoutingFlow(formValue);
      } else {
        this.addNewRoutingFlow(formValue);
      }
    }
  }
  private addNewRoutingFlow(formValue: InvoiceRoutingFlowDto) {
    this.invRoutingFlowService.createInvRoutingFlow(formValue).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.isFormSaved = true;
          this.message.showToast(
            MessageSeverity.success.toString(),
            'Invoice Routing Flow Creation',
            'Your Invoice Routing Flow has been successfully created',
            2000
          );
        }
      },
      error: (error: ResponseResult<boolean>) => {
        this.message.showToast(
          MessageSeverity.error.toString(),
          'Invoice Routing Flow Creation',
          error.messages?.[0],
          2000
        );
      },
      complete: () => {
        this.closeDialog();
      },
    });
  }
  private updateNewRoutingFlow(formValue: InvoiceRoutingFlowDto) {
    this.invRoutingFlowService.updateInvRoutingFlow(formValue).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.isFormSaved = true;
          this.message.showToast(
            MessageSeverity.success.toString(),
            'Invoice Routing Flow Update',
            'Update successfully saved',
            2000
          );
        }
      },
      error: (error: ResponseResult<boolean>) => {
        this.message.showToast(
          MessageSeverity.error.toString(),
          'Invoice Routing Flow Creation',
          error.messages?.[0],
          2000
        );
      },
      complete: () => {
        this.closeDialog();
      },
    });
  }

  private loadEntityForEdit(invRoutingFlowID: number) {
    combineLatest([
      this.entityOptions$,
      this.supplierOptions$,
      this.invRoutingFlowService.getInvRoutingFlowByID(invRoutingFlowID),
    ]).subscribe(([entityOptions, supplierOptions, response]) => {
      this.entityOptions = entityOptions;
      this.supplierOptions = supplierOptions;
      if (response.isSuccess) {
        const invRoutingFlowData = response.responseData;

        this.invRoutingFlowForm.patchValue({
          ...invRoutingFlowData,
        });

        invRoutingFlowData?.invRoutingFlowLevels.forEach((level) => {
          this.routingFlowLevels.push(createRoutingFlowLevelFormGroup(level)); // formarray
        });
      }
    });
  }
  closeDialog() {
    this.router.navigate(['/inv-routing-flow-management']);
  }
  deleteRoutingFlow() {
    this.confirmationService.confirm({
      message:
        'Are you sure you want to delete Invoice Routing Flow : ' +
        this.f['invRoutingFlowName'].value +
        '?',
      header: 'Confirm Deletion',
      accept: () => {
        this.invRoutingFlowService
          .deletetInvRoutingFlow(this.invRoutingFlowID)
          .subscribe({
            next: (response) =>{
                if(response.isSuccess){
                  this.message.showToast(
                  MessageSeverity.success.toString(),
                  'Routing Flow Deletion',
                  'Routing Flow has been successfully deleted',
                  2000
                );
              }
            },
            error:(error: ResponseResult<boolean>) => {
              this.message.showToast(
                MessageSeverity.error.toString(),
                'Error on Routing Flow deletion',
                error.messages?.[0],
                2000
              );
            },
            complete: () => {
              this.closeDialog();
            }
          });
      },
    });
  }
  cancel(event: Event) {
    if (this.invRoutingFlowForm.touched && !this.isFormSaved) {
      this.confirmUnsavedChanges(event);
    } else {
      this.closeDialog();
    }
  }
  private confirmUnsavedChanges(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      header: 'Save Changes',
      message:
        'You have unsaved changes. Are you sure you want to leave this page?',
      accept: () => {
        this.closeDialog();
      },
      reject: () => {},
    });
  }

  /** form initialization */
  private initiliazeDropdown() {
    this.entityOptions$.pipe(takeUntil(this.destroy$)).subscribe((options) => {
      this.entityOptions = options;
    });
    this.supplierOptions$
      .pipe(takeUntil(this.destroy$))
      .subscribe((options) => {
        this.supplierOptions = options;
      });
    this.roleOptions$.pipe(takeUntil(this.destroy$)).subscribe((options) => {
      this.rolesOptions = options;
    });
  }
  /** form relataed action */
  get f() {
    return this.invRoutingFlowForm.controls;
  }

  get routingFlowLevels(): FormArray<RoutingFlowLevelFormGroup> {
    return this.invRoutingFlowForm.get(
      'invRoutingFlowLevels'
    ) as FormArray<RoutingFlowLevelFormGroup>;
  }

  /** Add Levels Function */
  addLevel() {
    const selectedRole = this.f['selectedRoleID'].value;
    if (!selectedRole) return;

    const isLast = this.rolesOptions?.find((r) => r.value === selectedRole);
    if (!isLast) return;

    const exists = this.routingFlowLevels.controls.some(
      (level) => level.value.roleID === selectedRole
    );
    if (exists) return;

    if (this.routingFlowLevels.length >= 10) return;

    const newLevel = createRoutingFlowLevelFormGroup({
      roleID: selectedRole,
      level: this.routingFlowLevels.length + 1,
    });
    this.routingFlowLevels.push(newLevel);
    this.selectedRole = [];
  }

  removeLevel(index: number) {
    this.routingFlowLevels.removeAt(index);

    this.routingFlowLevels.controls.forEach((ctrl, idx) =>
      ctrl.get('level')?.setValue(idx + 1)
    );
    this.routingFlowLevels.markAsTouched();
  }
  getRoleName(roleID: number): string {
    return this.rolesOptions?.find((r) => r.value === roleID)?.label || '';
  }

  readonly getErrorMessage = (
    control: AbstractControl | null,
    fieldName: string
  ): string | null =>
    getErrorMessage(this.validationService, control, fieldName);

  onFocusChange(field: string, isFocused: boolean) {
    this.focusStates[field] = isFocused;
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
      },
      style: { minHeight: '200px' },
      dismissableMask: true,
      baseZIndex: 1200,
    });

    ref.onClose.subscribe((result: number) => {
      if (result !== undefined) {
        const newLevel = createRoutingFlowLevelFormGroup({
          roleID: result,
          level: 0,
        });
        const position = index ?? roles.length;
        this.routingFlowLevels.insert(position, newLevel);

        this.updateLevels();
        this.routingFlowLevels.markAsTouched();
      }
    });
  }

    private buildKeywordGridQuery(filters: any = {}): KeywordGridQuery {
      const normalizedActive =
        filters.isActive === undefined || filters.isActive === null
          ? null
          : filters.isActive;
  
      return {
        keywordName: filters.keywordName?.trim() ?? '',
        entityName: filters.entityName?.trim() ?? '',
        invoiceRoutingFlowName: filters.invoiceRoutingFlowName?.trim() ?? '',
        isActive: normalizedActive,
        pageNumber: filters.pageNumber ?? 1,
        pageSize: filters.pageSize ?? 10,
        sortField: filters.sortField,
        sortOrder: filters.sortOrder,
      };
    }


    private searchKeyword(searchQuery: KeywordGridQuery): void {
      this.keywordService
        .getKeywords(searchQuery)
        .pipe(takeUntil(this.destroySubject))
        .subscribe({
          next: (res) => {
            if (!res.isSuccess || !res.responseData) {
              return;
            }
            this.keywordData = res.responseData.data ?? [];
            this.keywordTotalRecords = res.responseData.totalCount ?? 0;
            this.keywordDataList$.next(this.keywordData);
            this.keywordTotalRecord$.next(this.keywordTotalRecords);
          },
          error: () => {},
        });
    }    


    assignKeyword(): void {
      const initialQuery = this.buildKeywordGridQuery({
        pageNumber: 1,
        pageSize: 5,
      });
      this.searchKeyword(initialQuery);
  
      const ref: DynamicDialogRef = this.dialogService.open(
        SelectTableComponent,
        {
          header: 'Keyword Lookup',
          contentStyle: { overflow: 'auto' },
          baseZIndex: 10000,
          modal: true,
          closable: true,
          data: {
            multiple: false,
            columns: this.gridService.keywordSelectTableGrid(),
            data$: this.keywordDataList$,
            totalRecords$: this.keywordTotalRecord$,
            selectedRows: this.selectedKeyword ? [this.selectedKeyword] : [],
            rowDisablePredicate: (row: Keyword) => !row?.isActive,
            onSearch: (filters: any) => {
              const query = this.buildKeywordGridQuery(filters);
              this.searchKeyword(query);
            },
          },
        }
      );
  
      ref.onClose.subscribe((selected) => {
        const keyword = Array.isArray(selected) ? selected?.[0] : selected;
        if (!keyword) {
          return;
        }
        this.selectedKeyword = keyword;
        this.f['matchReference'].setValue(keyword.keywordName);
        //this.f['keywordID'].setValue(keyword.keywordID);
      });
    }

  updateLevels() {
    this.routingFlowLevels.controls.forEach((group, i) => {
      group.get('level')?.setValue(i + 1, { emitEvent: false });
    });
  }
}
