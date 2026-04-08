import { NgIf } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Avatar } from 'primeng/avatar';
import { Menu } from 'primeng/menu';
import { SelectModule } from 'primeng/select';
import { ResponseResult } from 'src/app/core/model/common';
import { RoleDTO } from 'src/app/core/model/roles-management';
import { AuthService, MenuService, RoleService } from 'src/app/core/services';
import { LayoutService } from '../service/app.layout.service';
import { LocalStorageService } from './../../core/services/common/local-storage.service';
import { RoleSelectorComponent } from './role-selector/role-selector.component';
import { GetThumbnailInfoQuery } from 'src/app/core/model/auth/auth.thumbnail.query';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
  standalone: true,
  imports: [
    RouterLink,
    Menu,
    Avatar,
    SelectModule,
    FormsModule,
    NgIf,
    RoleSelectorComponent,
  ],
})
export class TopbarComponent implements OnInit {
  @Input() hasSideMenu: boolean = true;
  userRoles: RoleDTO[] | undefined;
  userName: string = '';
  menuItem: MenuItem[] = [];
  selectedUserRoles: RoleDTO | undefined;
  thumbnailName? : string |null = ''; 

  @ViewChild('menubutton') menuButton!: ElementRef;
  @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;
  @ViewChild('topbarmenu') menu!: ElementRef;

  constructor(
    public layoutService: LayoutService,
    public authService: AuthService,
    private roleService: RoleService,
    private localStorageService: LocalStorageService,
    private menuService: MenuService,
    private router: Router
  ) {
    this.userName = this.localStorageService.get('username');
  }
  menuItems = [
    { label: 'Logout', icon: 'pi pi-sign-out', command: () => this.Logout() },
  ];

  ngOnInit(): void {
    this.loadUserRole();
    this.userThumbnail();
  }

  loadUserRole() {
    const roleselectd = this.localStorageService.get('sr') as number;
    this.roleService.getRolesByUserName(this.userName).subscribe({
      next: (result: ResponseResult<RoleDTO[]>) => {
        if (result.isSuccess) {
          this.userRoles = result.responseData?.map((role) => {
            return role;
          });
          this.selectedUserRoles = roleselectd
            ? this.userRoles?.find((r) => r.roleID == roleselectd) ??
              this.userRoles?.[0]
            : this.userRoles?.[0];
          this.menuService.setRole(this.selectedUserRoles!.roleID);    
        }
      },

      //error: (error) => this.onError(error),
    });
  }
  onRoleChange(role: RoleDTO) {
    const roleselectd = this.localStorageService.get('sr') as number;
    this.selectedUserRoles = role;
    this.menuService.setRole(role.roleID);
   
    this.router.navigate(['/home']);

    this.authService.switchRole(role.roleID).subscribe({
          next: (response) => {
             
          }
        });
  }

    Logout(){
      this.authService.logout();
      this.router.navigate(['/auth/login'],{ replaceUrl: true });
    }

   userThumbnail() {

    const query: GetThumbnailInfoQuery = {
      userName: this.userName,
    };
    this.authService.setUserThumbnail(query).subscribe({
      next: (result: ResponseResult<string>) => {
        if (result.isSuccess) {
          this.thumbnailName = result.responseData;
        }
      },
      
    });
  }
}
