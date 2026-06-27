import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  BehaviorSubject,
  Subject,
  takeUntil,
} from 'rxjs';

import { PrimeImportsModule } from '@shared/moduleResources/prime-imports';
import { SelectTableComponent } from '@shared/popup/select-table/select-table.component';

import {
  DialogService,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';

import {
  Pagination,
  ResponseResult,
} from '@core/model/common';

import {
  AccountDimensionDetailDTO,
  AccountDimensionSearchDTO,
  SearchAccountDimensionParamQuery,
} from '@core/model/account-dimension-permission';

import { DropdownOptionDto } from '@core/model/roles-management';

@Component({
  selector: 'app-account-dimension-permissions',
  standalone: true,
  providers: [DialogService],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    PrimeImportsModule,
  ],
  templateUrl: './account-dimension-permissions.component.html',
  styleUrl: './account-dimension-permissions.component.scss',
})
export class AccountDimensionPermissionsComponent
  implements OnInit, OnChanges, OnDestroy
{
  @Input() formGroup!: FormGroup;
  @Input() formSubmitted!: boolean;

  @Input() roleId = 0;
  @Input() entityOptions: DropdownOptionDto[] = [];
  @Input() categoryOptions: DropdownOptionDto[] = [];

  private destroySubject = new Subject<void>();

  private dataList$ =
    new BehaviorSubject<AccountDimensionDetailDTO[]>([]);

  private totalRecord$ =
    new BehaviorSubject<number>(0);

  totalRecords = 0;

  accountDimensionPagination: AccountDimensionDetailDTO[] = [];

  constructor(
    private dialogService: DialogService,
  ) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['entityOptions'] && this.entityOptions.length) {
      this.autoAssignEntity();
    }
  }

  private autoAssignEntity(): void {
    if (this.entityOptions.length !== 1) {
      return;
    }

    const entityId = this.entityOptions[0].value;

    const updatedRows = this.selectedAccountDimensions.map(row => ({
      ...row,
      entityProfileID: entityId
    }));

    this.f['selectedAccountDimensions'].setValue(updatedRows);
  }

  private onError(error: unknown): void {
    console.error(error);

    this.dataList$.next([]);
    this.totalRecord$.next(0);
  }

  get f() {
    return this.formGroup.controls;
  }

  get selectedAccountDimensions(): AccountDimensionDetailDTO[] {
    return this.f['selectedAccountDimensions']?.value ?? [];
  }

  trackByFn(
    index: number,
    item: AccountDimensionDetailDTO
  ): number {
    return item.entityProfileID;
  }

  ngOnDestroy(): void {
    this.destroySubject.next();
    this.destroySubject.complete();
  }
}