import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RoleDTO } from 'src/app/core/model/roles-management';
import { LocalStorageService } from 'src/app/core/services';
import { PrimeImportsModule } from 'src/app/shared/moduleResources/prime-imports';

@Component({
  selector: 'app-role-selector',
  standalone: true,
  imports: [PrimeImportsModule, CommonModule, FormsModule],
  templateUrl: './role-selector.component.html',
  styleUrl: './role-selector.component.scss'
})
export class RoleSelectorComponent {
 private localstorage = inject(LocalStorageService)

  @Input() roles: RoleDTO[] |undefined = [];
  @Input() selectedRole: RoleDTO | undefined;
  @Output() selectedRoleChange = new EventEmitter<any>();

  roleChanged(event: any) {
     this.localstorage.set("sr", this.selectedRole?.roleID as number)
    this.selectedRoleChange.emit(this.selectedRole);
  }
}
