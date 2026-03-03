import { Injectable } from '@angular/core';
import { TableColumn } from 'src/app/core/model/common/grid-column';

@Injectable({
  providedIn: 'root'
})
export class RoleGridService {

  constructor() { }

  roleEntityGridColumns(): TableColumn[] {
    return [
      {
        field: 'entityName',
        header: 'Entity Name',
        sort: true,
        isSearchFilter: true,
      },
      {
        field: 'entityCode',
        header: 'Entity Code',
        sort: true,
        isSearchFilter: true,
      }
    ];
  }

  rolePermissionGridColumns(): TableColumn[] {
    return [
      {
        field: 'permissionGroup',
        header: 'Permission Group Name',
        sort: true,
        isSearchFilter: true,
      },
    ];
  }

  roleUserGridColumns(): TableColumn[] {
    return [
      {
        field: 'userName',
        header: 'User Name',
        sort: true,
        isSearchFilter: true,
      },
    ];
  }
}
