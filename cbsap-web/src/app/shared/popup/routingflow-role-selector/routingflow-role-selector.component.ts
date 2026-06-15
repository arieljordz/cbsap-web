import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LookupOptionsService } from '@core/services';
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
  rolesOptions?: SelectItem[] = [];
  readonly roleOptions$ = this.lookUpOptionService.rolesLookUpOptions$;

  excludesSelectedRoleIds: number[] = [];

  constructor(
    private lookUpOptionService: LookupOptionsService,
    private dialogRef: DynamicDialogRef,
    private config: DynamicDialogConfig
  ) {
    this.excludesSelectedRoleIds =
      (this.config.data?.excludesSelectedRoleIds as number[]) ?? null;
  }
  ngOnInit(): void {
    this.roleSelectorForm = new FormGroup({
      selectedRoleID: new FormControl(null, Validators.required),
    });

    this.roleOptions$.pipe(takeUntil(this.destroy$)).subscribe((options) => {
      options[0].label = '-- Please Select --';
      this.rolesOptions = options.filter(
        (roleID) => !this.excludesSelectedRoleIds.includes(roleID.value!)
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
    this.dialogRef.close(this.f['selectedRoleID'].value);
  }
}
