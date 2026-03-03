import { Injectable, TemplateRef } from '@angular/core';
import { TableColumn } from '../../model/common/grid-column';
import { DynamicGridColumn } from '@core/model/dynamic-grid/grid.config';

@Injectable({
  providedIn: 'root',
})
export class GridService {
  constructor() {}

  /** user search management grid */
  userSearchManagementColGrid(): TableColumn[] {
    return [
      { field: 'userID', header: 'Username', sort: true, isSearchFilter: true },
      { field: 'fullName', header: 'Name', sort: true, isSearchFilter: true },
      {
        field: 'isActive',
        header: 'Active Status',
        sort: true,
        isSearchFilter: true,
      },
      {
        field: 'lastLoginDateTime',
        header: 'Last log-in date',
        sort: true,
        isSearchFilter: false,
      },
      {
        field: 'countOfAssignedRoles',
        header: 'Count of Assigned Roles',
        sort: true,
        isSearchFilter: false,
      },
    ];
  }

  /**  search user role assignment */
  assignRoleColGrid(): TableColumn[] {
    return [
      {
        field: 'roleName',
        header: 'Role Name',
        sort: true,
        isSearchFilter: true,
      },
    ];
  }

  roleManagementSearchColGrid(): TableColumn[] {
    return [
      {
        field: 'entity',
        header: 'Entity',
        sort: false,
        isSearchFilter: true,
      },
      {
        field: 'roleName',
        header: 'Role Name',
        sort: true,
        isSearchFilter: true,
      },
      {
        field: 'roleManager1',
        header: 'Role Manager 1',
        sort: true,
        isSearchFilter: true,
      },
      {
        field: 'roleManager2',
        header: 'Role Manager 2',
        sort: true,
        isSearchFilter: true,
      },
      {
        field: 'authorisationLimit',
        header: 'Limit Amount',
        sort: true,
        isSearchFilter: true,
      },
      {
        field: 'permissionGroups',
        header: 'Permission Groups ',
        sort: false,
        isSearchFilter: true,
      },
      {
        field: 'isActive',
        header: 'Active Status',
        sort: true,
        isSearchFilter: true,
      },
    ];
  }

  rolePermissionGroupGrid(): TableColumn[] {
    return [
      {
        field: 'permissionName',
        header: 'Permission Name',
        sort: true,
        isSearchFilter: true,
      },
    ];
  }

  assignRoleManager(): TableColumn[] {
    return [
      {
        field: 'roleName',
        header: 'Role Name',
        sort: true,
        isSearchFilter: true,
      },
      {
        field: 'users',
        header: 'Users',
        sort: true,
        isSearchFilter: true,
      },
    ];
  }

  /** Permission Management Grid Column */
  permissionManagementColumn(): TableColumn[] {
    return [
      {
        field: 'permissionID',
        header: 'Permission Group ID ',
        sort: true,
        isSearchFilter: true,
      },
      {
        field: 'permissionGroupName',
        header: 'Permission Group Name',
        sort: true,
        isSearchFilter: true,
      },
      {
        field: 'countofRoles',
        header: 'Count of Assigned Roles',
        sort: true,
        isSearchFilter: true,
      },
      {
        field: 'countofUsers',
        header: 'Count of Users',
        sort: true,
        isSearchFilter: true,
      },
      {
        field: 'isActive',
        header: 'Active Status',
        sort: true,
        isSearchFilter: true,
      },
    ];
  }

  /** Assigned Invoice Grid Column */
  assignedInvoiceColumn(): TableColumn[] {
    return [
      {
        field: 'queue',
        header: 'Queue',
        sort: false,
        isSearchFilter: false,
      },
      {
        field: 'supplierName',
        header: 'Supplier Name',
        sort: false,
        isSearchFilter: false,
      },
      {
        field: 'invoiceDate',
        header: 'Invoice Date',
        sort: false,
        isSearchFilter: false,
        dataType: 'date',
      },
      {
        field: 'invoiceNumber',
        header: 'Invoice Number',
        sort: false,
        isSearchFilter: false,        
      },
      {
        field: 'amount',
        header: 'Gross Amount',
        sort: false,
        isSearchFilter: false,
        dataType: 'decimal',
      },
      {
        field: 'dueDate',
        header: 'Due Date',
        sort: false,
        isSearchFilter: false,
        dataType: 'date',
      },
      {
        field: 'assignedRole',
        header: 'Assigned role',
        sort: false,
        isSearchFilter: false,
      },
    ];
  }

  /** Tax Code Grid Column */
  taxCodeManagementColumn(): TableColumn[] {
    return [
      {
        field: 'entityName',
        header: 'Entity',
        sort: true,
        isSearchFilter: false,
      },
      {
        field: 'taxCodeName',
        header: 'Tax Code Name',
        sort: true,
        isSearchFilter: false,
      },
      {
        field: 'code',
        header: 'Tax Code',
        sort: true,
        isSearchFilter: false,
      },
      {
        field: 'taxRate',
        header: 'Tax Rate',
        sort: true,
        isSearchFilter: false,
      },
    ];
  }

  /** Keyword Grid Column */
  keywordManagementColumn(): TableColumn[] {
    return [
      {
        field: 'keywordName',
        header: 'Keyword',
        sort: true,
        isSearchFilter: false,
      },
      {
        field: 'entityName',
        header: 'Entity',
        sort: true,
        isSearchFilter: false,
      },
      {
        field: 'invoiceRoutingFlowName',
        header: 'Invoice Routing Flow',
        sort: true,
        isSearchFilter: false,
      },
      {
        field: 'isActive',
        header: 'Active',
        sort: true,
        isSearchFilter: false,
        dataType: 'boolean',
      },
    ];
  }

  /** Goods Receipt Grid Column */
  goodsReceiptManagementColumn(): TableColumn[] {
    return [
      {
        field: 'entity',
        header: 'Entity',
        sort: true,
        isSearchFilter: false,
      },
      {
        field: 'supplier',
        header: 'Supplier',
        sort: true,
        isSearchFilter: false,
      },
      {
        field: 'goodsReceiptNumber',
        header: 'Goods Receipt Number',
        sort: true,
        isSearchFilter: false,
      },
      {
        field: 'deliveryNote',
        header: 'Delivery Note',
        sort: true,
        isSearchFilter: false,
      },
      {
        field: 'active',
        header: 'Active Status',
        sort: true,
        isSearchFilter: false,
        dataType: 'tag',
      },
      {
        field: 'deliveryDate',
        header: 'Delivery Date',
        sort: true,
        isSearchFilter: false,
        dataType: 'date',
      },
    ];
  }

  keywordSelectTableGrid(): DynamicGridColumn[] {
    return [
      {
        field: 'keywordName',
        header: 'Keyword',
        sort: true,
        isSearchFilter: true,
        type: 'text',
      },
      {
        field: 'invoiceRoutingFlowName',
        header: 'Invoice Routing Flow',
        sort: true,
        isSearchFilter: true,
        type: 'text',
      },
      {
        field: 'isActive',
        header: 'Active',
        sort: true,
        isSearchFilter: true,
        type: 'tag',
        filterType: 'boolean',
      },
    ];
  }

  /** Entity Management Grid Column */
  entityGridColumn(): TableColumn[] {
    return [
      {
        field: 'entityName',
        header: 'Entity Name ',
        sort: true,
        isSearchFilter: true,
      },

      {
        field: 'entityCode',
        header: 'Entity Code',
        sort: true,
        isSearchFilter: true,
      },
      {
        field: 'taxID',
        header: 'Tax ID',
        sort: true,
        isSearchFilter: true,
      },
      {
        field: 'emailAddress',
        header: 'Email Address',
        sort: true,
        isSearchFilter: true,
      },
    ];
  }

  supplierGridColumn(): TableColumn[] {
    return [
      {
        field: 'entity',
        header: 'Entity',
        sort: true,
        isSearchFilter: true,
      },
      {
        field: 'supplierID',
        header: 'Supplier ID ',
        sort: true,
        isSearchFilter: true,
      },

      {
        field: 'supplierName',
        header: 'Supplier Name',
        sort: true,
        isSearchFilter: true,
      },
      {
        field: 'supplierTaxID',
        header: 'Supplier Tax ID',
        sort: true,
        isSearchFilter: true,
      },
      {
        field: 'bankAccount',
        header: 'Bank Account',
        sort: true,
        isSearchFilter: true,
      },
      {
        field: 'paymentTerms',
        header: 'Payment Terms',
        sort: true,
        isSearchFilter: true,
      },
      {
        field: 'invRoutingFlowName',
        header: 'Invoice Routing Flow',
        sort: true,
        isSearchFilter: true,
      },

      {
        field: 'isActive',
        header: 'Active Status',
        sort: true,
        isSearchFilter: true,
      },
    ];
  }

  entitySelectGridColumn(): TableColumn[] {
    return [
      {
        field: 'entityName',
        header: 'Entity Name ',
        sort: true,
        isSearchFilter: true,
      },

      {
        field: 'entityCode',
        header: 'Entity Code',
        sort: true,
        isSearchFilter: true,
      },
    ];
  }

  permissionSelectGridColumn(): TableColumn[] {
    return [
      {
        field: 'permissionName',
        header: 'Permission Name ',
        sort: true,
        isSearchFilter: true,
      },
    ];
  }

  userSelectGridColumn(): TableColumn[] {
    return [
      {
        field: 'fullName',
        header: 'Full Name',
        sort: true,
        isSearchFilter: true,
      },

      {
        field: 'userID',
        header: 'User Id',
        sort: true,
        isSearchFilter: true,
      },
    ];
  }

  invRoutingFlowGridColumn(
    rolesTemplate: TemplateRef<any>,
    usersTemplate: TemplateRef<any>
  ): DynamicGridColumn[] {
    return [
      {
        field: 'entity',
        header: 'Entity',
        sort: true,
        isSearchFilter: true,
      },
      {
        field: 'invoiceRoutingFlowName',
        header: 'Invoice Routing Flow Name ',
        sort: true,
        isSearchFilter: true,
      },

      {
        field: 'suppliersLinked',
        header: 'Suppliers Linked',
        sort: true,
        isSearchFilter: true,
      },
      {
        field: 'Roles',
        header: 'Roles',
        sort: false,
        isSearchFilter: false,
        type: 'custom',
        customTemplate: rolesTemplate,
      },
      {
        field: 'Users',
        header: 'Users',
        sort: false,
        isSearchFilter: false,
        type: 'custom',
        customTemplate: usersTemplate,
      },
      {
        field: 'matchReference',
        header: 'Keyword',
        sort: true,
        isSearchFilter: true,
      },
    ];
  }

  invRoutingFlowUserGridColumn(): TableColumn[] {
    return [
      {
        field: 'userID',
        header: 'User ID',
        sort: true,
        isSearchFilter: true,
      },
    ];
  }

  invRoutingFlowRolesGridColumn(): TableColumn[] {
    return [
      {
        field: 'roleName',
        header: 'Role Name',
        sort: true,
        isSearchFilter: true,
      },
    ];
  }

  invoiceRoutingFlowSelectTableGridColumn(): TableColumn[] {
    return [
      {
        field: 'EntityName',
        header: 'Entity Name',
        sortField: 'entity',
        sort: true,
        isSearchFilter: true,
      },
      {
        field: 'InvRoutingFlowName',
        sortField: 'invoiceRoutingFlowName',
        header: 'Routing Flow Name',
        sort: true,
        isSearchFilter: true,
      },
      {
        field: 'LinkSupplier',
        sortField: 'suppliersLinked',
        header: 'Suppliers Linked',
        sort: true,
        isSearchFilter: true,
      },
      {
        field: 'MatchReference',
        sortField: 'matchReference',
        header: 'Match Reference',
        sort: true,
        isSearchFilter: true,
      },
    ];
  }

  invAllocationItemGridColumn(data: any[]): DynamicGridColumn[] {
    const staticCols: DynamicGridColumn[] = [
      {
        field: 'lineNo',
        header: 'Line No',
        sort: true,
        isSearchFilter: true,
      },
      {
        field: 'poNo',
        header: 'PO No',
        sort: true,
        isSearchFilter: true,
      },
      {
        field: 'poLineNo',
        header: 'PO Line No',
        sort: true,
        isSearchFilter: true,
      },
      {
        field: 'account',
        header: 'Account',
        sort: true,
        isSearchFilter: true,
      },
      {
        field: 'dimension1',
        header: 'Dimension 1',
        sort: true,
        isSearchFilter: true,
      },
      {
        field: 'dimension2',
        header: 'Dimension 2',
        sort: true,
        isSearchFilter: true,
      },
      {
        field: 'dimension3',
        header: 'Dimension 3',
        sort: true,
        isSearchFilter: true,
      },
      {
        field: 'dimension4',
        header: 'Dimension 4',
        sort: true,
        isSearchFilter: true,
      },
      {
        field: 'lineDescription',
        header: 'Line Description',
        sort: true,
        isSearchFilter: true,
      },
      {
        field: 'unit',
        header: 'Unit',
        sort: true,
        isSearchFilter: true,
      },
      {
        field: 'qty',
        header: 'Qty',
        sort: true,
        isSearchFilter: true,
      },
      {
        field: 'lineNetAmount',
        header: 'Line Net Amount',
        sort: true,
        isSearchFilter: true,
      },
      {
        field: 'lineTaxAmount',
        header: 'Line Tax Amount',
        sort: true,
        isSearchFilter: true,
      },
      {
        field: 'lineAmount',
        header: 'Line Amount',
        sort: true,
        isSearchFilter: true,
      },
      {
        field: 'currency',
        header: 'Currency',
        sort: true,
        isSearchFilter: true,
      },

      {
        field: 'taxCodeLine',
        header: 'Tax Code Line',
        sort: true,
        isSearchFilter: true,
      },
      {
        field: 'Note',
        header: 'Note',
        sort: true,
        isSearchFilter: true,
      },
    ];
    const staticFieldNames = staticCols.map((col) => col.field.toLowerCase());
    const dynamicFields = Array.from(
      new Set(
        data.flatMap((row) =>
          Object.keys(row).filter(
            (key) =>
              !staticFieldNames.includes(key.toLowerCase()) &&
              typeof row[key] !== 'object' && // exclude nested objects/arrays
              row[key] !== null &&
              row[key] !== undefined
          )
        )
      )
    );

    const dynamicCols: DynamicGridColumn[] = dynamicFields.map((field) => ({
      field,
      header: this.formatHeader(field),
      sort: true,
      isSearchFilter: true,
    }));

    return [...staticCols, ...dynamicCols];
  }

  invSupplierSearchLookUpGridColumn(): DynamicGridColumn[] {
    return [
      {
        field: 'supplierID',
        header: 'Supplier No ',
        sort: true,
        isSearchFilter: true,
      },
      {
        field: 'supplierName',
        header: 'Supplier Name',
        sort: true,
        isSearchFilter: true,
      },
      {
        field: 'supplierTaxID',
        header: 'Supplier Tax ID',
        sort: true,
        isSearchFilter: true,
      },

      {
        field: 'entity',
        header: 'Entity',
        sort: true,
        isSearchFilter: true,
      },

      {
        field: 'isActive',
        header: 'Active Status',
        sort: true,
        isSearchFilter: true,
      },
    ];
  }

  supplierSelectTableGrid(): DynamicGridColumn[] {
    return [
      {
        field: 'supplierID',
        header: 'Supplier No ',
        sort: true,
        isSearchFilter: true,
      },
      {
        field: 'supplierName',
        header: 'Supplier Name',
        sort: true,
        isSearchFilter: true,
      },
      {
        field: 'supplierTaxID',
        header: 'Supplier Tax ID',
        sort: true,
        isSearchFilter: false,
      },

      {
        field: 'entity',
        header: 'Entity',
        sort: true,
        isSearchFilter: false,
      },
      {
        field: 'isActive',
        header: 'Active Status',
        sort: true,
        isSearchFilter: false,
        type: 'tag',
        filterType: 'boolean',
      },
    ];
  }

  poSelectTableGrid(): DynamicGridColumn[] {
    return [
      {
        field: 'poNo',
        header: 'PO Number',
        sort: true,
        isSearchFilter: true,
      },
      {
        field: 'supplierTaxID',
        header: 'Supplier Tax ID',
        sort: true,
        isSearchFilter: false,
      },
      {
        field: 'supplierName',
        header: 'Supplier Name',
        sort: true,
        isSearchFilter: true,
      },
      {
        field: 'netAmount',
        header: 'Net Amount',
        sort: true,
        isSearchFilter: false,
      },
      {
        field: 'isActive',
        header: 'Active',
        sort: true,
        isSearchFilter: true,
        type: 'tag',
        pipe: 'yesno',
        filterType: 'boolean',
      },
    ];
  }

  myInvoiceSearchColumn(
    selectInvoiceTemplate: TemplateRef<any>
  ): DynamicGridColumn[] {
    return [
      // {
      //   field: 'entity',
      //   header: 'Entity',
      //   sort: true,
      //   isSearchFilter: true,
      // },
      {
        field: 'suppName',
        header: 'Supplier Name',
        sort: true,
        isSearchFilter: true,
      },
      {
        field: 'invoiceDate',
        header: 'Invoice Date',
        sort: true,
        isSearchFilter: true,
      },
      {
        field: 'invoiceNo',
        header: 'Invoice Number',
        sort: true,
        isSearchFilter: true,
      },
      {
        field: 'poNo',
        header: 'PO Number',
        sort: true,
        isSearchFilter: true,
      },
      {
        field: 'dueDate',
        header: 'Due Date',
        sort: true,
        isSearchFilter: true,
      },
      {
        field: 'grossAmount',
        header: 'Gross Amount',
        sort: true,
        isSearchFilter: true,
      },
      {
        field: 'nextRole',
        header: 'Next Role',
        sort: true,
        isSearchFilter: true,
      },
      {
        field: 'exceptionReason',
        header: 'Exception Reason',
        wrap: true,
        sort: true,
        isSearchFilter: true,
      },
      {
        field: 'isSelected',
        header: 'Select Invoice',
        sort: false,
        isSearchFilter: false,
        type: 'custom',
        customTemplate: selectInvoiceTemplate,
      },
    ];
  }
  rejectQueueSearchColumn(): DynamicGridColumn[] {
    return [
      //  {
      //   field: 'entity',
      //   header: 'Entity',
      //   sort: true,
      //   isSearchFilter: true,
      // },
      {
        field: 'suppName',
        header: 'Supplier Name',
        sort: true,
        isSearchFilter: true,
      },
      {
        field: 'invoiceDate',
        header: 'Invoice Date',
        sort: true,
        isSearchFilter: true,
      },
      {
        field: 'invoiceNo',
        header: 'Invoice Number',
        sort: true,
        isSearchFilter: true,
      },
      {
        field: 'poNo',
        header: 'PO Number',
        sort: true,
        isSearchFilter: true,
      },
      {
        field: 'dueDate',
        header: 'Due Date',
        sort: true,
        isSearchFilter: true,
      },
      {
        field: 'grossAmount',
        header: 'Gross Amount',
        sort: true,
        isSearchFilter: true,
      },
      
      // {
      //   field: 'nextRole',
      //   header: 'Next Role',
      //   sort: true,
      //   isSearchFilter: true,
      // },
    ];
  }

  exceptionQueueSearchColumn(
    selectInvoiceTemplate: TemplateRef<any>
  ): DynamicGridColumn[] {
    return [
      // {
      //   field: 'entity',
      //   header: 'Entity',
      //   sort: true,
      //   isSearchFilter: true,
      // },
      {
        field: 'suppName',
        header: 'Supplier Name',
        sort: true,
        isSearchFilter: true,
      },
      {
        field: 'invoiceDate',
        header: 'Invoice Date',
        sort: true,
        isSearchFilter: true,
      },
      {
        field: 'invoiceNo',
        header: 'Invoice Number',
        sort: true,
        isSearchFilter: true,
      },
      {
        field: 'poNo',
        header: 'PO Number',
        sort: true,
        isSearchFilter: true,
      },
      {
        field: 'dueDate',
        header: 'Due Date',
        sort: true,
        isSearchFilter: true,
      },
      {
        field: 'grossAmount',
        header: 'Gross Amount',
        sort: true,
        isSearchFilter: true,
      },
      {
        field: 'exceptionReason',
        header: 'Exception Reason',
        wrap: true,
        sort: true,
        isSearchFilter: true,
      },
      {
        field: 'isSelected',
        header: 'Select Invoice',
        sort: false,
        isSearchFilter: false,
        type: 'custom',
        customTemplate: selectInvoiceTemplate,
      },
    ];
  }

  archiveQueueSearchColumn(
    selectInvoiceTemplate: TemplateRef<any>
  ): DynamicGridColumn[] {
    return [
      // {
      //   field: 'entity',
      //   header: 'Entity',
      //   sort: true,
      //   isSearchFilter: true,
      // },
      {
        field: 'suppName',
        header: 'Supplier Name',
        sort: true,
        isSearchFilter: true,
      },
      {
        field: 'invoiceDate',
        header: 'Invoice Date',
        sort: true,
        isSearchFilter: true,
      },
      {
        field: 'invoiceNo',
        header: 'Invoice Number',
        sort: true,
        isSearchFilter: true,
      },
      {
        field: 'poNo',
        header: 'PO Number',
        sort: true,
        isSearchFilter: true,
      },
      {
        field: 'dueDate',
        header: 'Due Date',
        sort: true,
        isSearchFilter: true,
      },
      {
        field: 'grossAmount',
        header: 'Gross Amount',
        sort: true,
        isSearchFilter: true,
      },
       {
        field: 'isSelected',
        header: 'Select Invoice',
        sort: false,
        isSearchFilter: false,
        type: 'custom',
        customTemplate: selectInvoiceTemplate,
      },
      // {
      //   field: 'exceptionReason',
      //   header: 'Exception Reason',
      //   sort: true,
      //   isSearchFilter: true,
      // },
    ];
  }

  loadInvoiceCommentsColumn(): DynamicGridColumn[] {
    return [
      {
        field: 'createdDate',
        header: 'Created Date',
        sort: true,
        isSearchFilter: true,
      },
      {
        field: 'comment',
        header: 'Comment',
        sort: true,
        isSearchFilter: true,
      },
      {
        field: 'createdBy',
        header: 'Created By',
        sort: true,
        isSearchFilter: true,
      },
    ];
  }

  formatHeader(field: string): string {
    // Optional: Format camelCase or custom header labels
    return field
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (s) => s.toUpperCase());
  }

  searchPOlinesColumn(): TableColumn[] {
    return [
      {
        field: 'lineNo',
        header: 'Line Number ',
        sort: true,
        isSearchFilter: true,
      },
      {
        field: 'poNo',
        header: 'Purchase Order',
        sort: true,
        isSearchFilter: true,
      },
      {
        field: 'supplierNo',
        header: 'Supplier No',
        sort: true,
        isSearchFilter: true,
      },
      {
        field: 'description',
        header: 'Description',
        sort: true,
        isSearchFilter: true,
      },
      {
        field: 'accountName',
        header: 'Account',
        sort: true,
        isSearchFilter: true,
      },

      {
        field: 'originalQty',
        header: 'Original Qty',
        sort: true,
        isSearchFilter: true,
      },
      {
        field: 'remainingQty',
        header: 'Remaining Qty',
        sort: true,
        isSearchFilter: true,
      },
      // {
      //   field: 'baseRemainingQty',
      //   header: 'Base Remaining in DB or UI',
      //   sort: true,
      //   isSearchFilter: true,
      // },
      // {
      //   field: 'totalMatchedQty',
      //   header: 'Total Matched Qty DB',
      //   sort: true,
      //   isSearchFilter: true,
      // },
      // {
      //   field: 'storedRemainingQty',
      //   header: 'local Stored Remaining Qty',
      //   sort: true,
      //   isSearchFilter: true,
      // },
      // {
      //   field: 'totalMatchedQtyUI',
      //   header: 'Total Matched Qty UI',
      //   sort: true,
      //   isSearchFilter: true,
      // },
      {
        field: 'qty',
        header: 'Matchable Qty',
        sort: true,
        isSearchFilter: true,
        editable: true,
      },
      {
        field: 'price',
        header: 'Unit Price',
        sort: true,
        isSearchFilter: true,
      },
      {
        field: 'amount',
        header: 'Amount',
        sort: true,
        isSearchFilter: true,
      },
    ];
  }
  POMatchingLineColumn(): TableColumn[] {
    return [
      {
        field: 'lineNo',
        header: 'Line Number ',
        sort: true,
        isSearchFilter: true,
      },
      {
        field: 'poNo',
        header: 'Purchase Order',
        sort: true,
        isSearchFilter: true,
      },
      {
        field: 'supplierNo',
        header: 'Supplier No',
        sort: true,
        isSearchFilter: true,
      },
      {
        field: 'description',
        header: 'Description',
        sort: true,
        isSearchFilter: true,
      },
      {
        field: 'accountName',
        header: 'Account',
        sort: true,
        isSearchFilter: true,
      },
      {
        field: 'qty',
        header: 'Quantity',
        sort: true,
        isSearchFilter: true,
        editable: true,
      },

      {
        field: 'price',
        header: 'Unit Price',
        sort: true,
        isSearchFilter: true,
      },
      {
        field: 'amount',
        header: 'Amount',
        sort: true,
        isSearchFilter: true,
      },
      {
        field: 'status',
        header: 'Status',
        sort: true,
        isSearchFilter: true,
      },
    ];
  }
  POSearchColumn(): DynamicGridColumn[] {
    return [
      {
        field: 'entityName',
        header: 'Entity',
        sort: true,
        isSearchFilter: true,
      },

      {
        field: 'poNo',
        header: 'PO Number',
        sort: true,
        isSearchFilter: true,
      },
      {
        field: 'supplierName',
        header: 'Supplier Name',
        sort: true,
        isSearchFilter: true,
      },
      {
        field: 'supplierTaxID',
        header: 'Supplier Tax ID',
        sort: true,
        isSearchFilter: true,
      },
      {
        field: 'currency',
        header: 'Currency',
        sort: true,
        isSearchFilter: true,
      },
      {
        field: 'netAmount',
        header: 'Net Amount',
        sort: true,
        isSearchFilter: true,
      },
      {
        field: 'isActive',
        header: 'Active',
        sort: true,
        type: 'tag',
        pipe: 'yesno',
        isSearchFilter: true,
      },
    ];
  }

  accountSearchLookUpGridColumn(): DynamicGridColumn[] {
    return [
      {
        field: 'accountID',
        header: 'Account ID ',
        sort: true,
        isSearchFilter: true,
      },
      {
        field: 'accountName',
        header: 'Account Name',
        sort: true,
        isSearchFilter: true,
      },
      {
        field: 'entityName',
        header: 'Entity Name',
        sort: true,
        isSearchFilter: true,
      },
      {
        field: 'active',
        header: 'Active',
        sort: true,

        isSearchFilter: true,
      },
    ];
  }
}
