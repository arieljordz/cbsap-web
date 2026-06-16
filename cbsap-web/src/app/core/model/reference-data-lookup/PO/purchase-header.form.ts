import { FormControl, FormGroup } from "@angular/forms";

export type PurchaseOrderDetailHeaderFormGroup = FormGroup<{
    PurchaseOrderId: FormControl<number | null>;
    Entity: FormControl<string | null>;
    SupplierName: FormControl<string | null>;
    SupplierNo: FormControl<string | null>;
    PurchaseOrderNo: FormControl<string | null>;
    PurchaseDate: FormControl<string | null>;
    GoodsReceiptNo: FormControl<string | null>;
    GoodsReceiptDate: FormControl<string | null>;
    Currency: FormControl<string | null>;
    Keyword1: FormControl<string | null>;
    Keyword2: FormControl<string | null>;
    FreeField1: FormControl<string | null>;
    FreeField2: FormControl<string | null>;
    FreeField3: FormControl<string | null>;
    Status: FormControl<string | null>;
    OrderNotes: FormControl<string | null>;

  }>;

  export function createPurchaseHeaderForm(): PurchaseOrderDetailHeaderFormGroup {
    return new FormGroup({
      PurchaseOrderId: new FormControl<number | null>(0),
      Entity: new FormControl<string | null>(''),
      SupplierName: new FormControl<string | null>(''),
      SupplierNo: new FormControl<string | null>(''),
      PurchaseOrderNo: new FormControl<string | null>(''),
      PurchaseDate: new FormControl<string | null>(''),
      GoodsReceiptNo:new FormControl<string | null>(''),
      GoodsReceiptDate:new FormControl<string | null>(''),
      Currency:new FormControl<string | null>(''),
      Keyword1:new FormControl<string | null>(''),
      Keyword2:new FormControl<string | null>(''),
      FreeField1:new FormControl<string | null>(''),
      FreeField2:new FormControl<string | null>(''),
      FreeField3:new FormControl<string | null>(''),
      Status:new FormControl<string | null>(''),
      OrderNotes:new FormControl<string | null>(''),
    });
  }
