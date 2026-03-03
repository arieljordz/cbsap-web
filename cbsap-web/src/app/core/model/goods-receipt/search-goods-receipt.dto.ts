export interface SearchGoodsReceiptLookupDto {
  goodsReceiptID: number | null;
  entity: string | null;
  supplier: string | null;
  goodsReceiptNumber: string | null;
  deliveryNote: string | null;
  active: boolean | string | null;
  deliveryDate: string | null;
}
