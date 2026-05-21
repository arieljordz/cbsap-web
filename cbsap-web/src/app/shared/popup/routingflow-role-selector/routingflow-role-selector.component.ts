import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InvRoutingFlowService, LookupOptionsService } from '@core/services';
import { PrimeImportsModule } from '@shared/moduleResources/prime-imports';
import { SelectItem } from 'primeng/api';
import {
  DynamicDialogConfig,
  DynamicDialogRef,
  DialogService,
} from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-routingflow-role-selector',
  standalone: true,
  providers: [DialogService],
  imports: [CommonModule, ReactiveFormsModule, PrimeImportsModule],
  templateUrl: './routingflow-role-selector.component.html',
  styleUrl: './routingflow-role-selector.component.scss',
})
export class RoutingflowRoleSelectorComponent implements OnInit, OnDestroy {
  roleSelectorForm!: FormGroup;
  private destroy$ = new Subject<void>();

  rolesOptions: SelectItem[] = [];

  excludesSelectedRoleIds: number[] = [];

  constructor(
    private lookUpOptionService: LookupOptionsService,
    private dialogRef: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private invRoutingFlowService: InvRoutingFlowService,
  ) {
    this.excludesSelectedRoleIds =
      (this.config.data?.excludesSelectedRoleIds as number[]) ?? [];
  }

  ngOnInit(): void {
    this.roleSelectorForm = new FormGroup({
      selectedRoleID: new FormControl(null, Validators.required),
    });

    const entityId = this.config.data?.entityProfileID;

    if (!entityId) {
      console.error('Entity ID is missing');
      return;
    }

    this.lookUpOptionService
      .getRolesByEntityIDLookUpOptions(entityId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((options) => {
        if (options.length > 0) {
          options[0].label = '-- Please Select --';
        }

        this.rolesOptions = options.filter(
          (roleID) => !this.excludesSelectedRoleIds.includes(roleID.value!),
        );
      });
  }

  get f() {
    return this.roleSelectorForm.controls;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  submit() {
    if (this.roleSelectorForm.invalid) return;

    const assignRoleCommand = {
      roleID: this.f['selectedRoleID'].value,
      invoiceID: this.config.data?.invoiceID,
      level: this.config.data?.level,
    };

    this.invRoutingFlowService.assignRole(assignRoleCommand).subscribe({
      next: () => {
        this.dialogRef.close(assignRoleCommand.roleID);
      },
      error: (err) => {
        console.error('Failed to assign role', err);
      },
    });
  }
}
