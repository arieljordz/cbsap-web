export interface poDetailDto{
    PurchaseOrderId: number;
    Entity: string | null;
    SupplierName: string | null;
    SupplieNo: string | null;
    PurchaseOrderNo: string | null;
    PurchaseDate: string | null;
    GoodsReceiptNo: string | null;
    GoodsReceiptDate: string | null;
    Currency: string | null;
    Keyword1: string | null;
    Keyword2: string | null;
    FreeField1: string | null;
    FreeField2: string | null;
    FreeField3: string | null;
    Status: string | null;
    OrderNotes: string | null;

  }

  export interface poDetailListDto {
    purchaseOrderLineID: number;
    purchaseNumber: string | null;
    lineNumber?: number | null;
    item: string | null;
    description: string | null;
    poOrderQuantity: number | null;
    goodsReceiptNo: string | null;
    grReceiptedQuantity: number | null;
    grReceiptDate: string | null;
    varianceQuantity: number | null;
    unitType: string | null;
    unitPrice: number | null;
    poOrderAmount: number | null;
    poReceiptedAmount: number | null;
    varianceAmount: number | null;
    lineCurrency: string | null;
    goodReceiptedStatus: string | null;
    invoiceMatchStatus: string | null;
    grReceiptDateDisplayString : string | null;
  }

  export interface batchListPurchaseOrderDto {
    indexId: number;
    purchaseOrderID : number;
    poNo: string;
    entityName: string;
    supplierName: string;
    supplierTaxID : string;
    currency: string;
    netAmount: number;
    isActive: boolean;
  }