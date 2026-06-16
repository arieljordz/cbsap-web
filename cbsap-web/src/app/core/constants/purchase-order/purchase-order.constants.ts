const purchaseorder_endpoint = `v1/purchaseorder`;

/** */
export const PO_ENDPOINT = {
  /**SEARCH PO */
  GET_POLINES_SEARCH: `${purchaseorder_endpoint}/searchpolines?`,
  SAVE_PO_MATCHING: `${purchaseorder_endpoint}/savePOMatching`,
  RECALCULATE_POLINES: `${purchaseorder_endpoint}/recalculatePOLine`,
  UPDATE_PO_MATCHING: `${purchaseorder_endpoint}/updatepomatching`,
  GET_PO_MATCHING_BY_INVID: (poNo: string, InvoiceID: Number) =>
    `${purchaseorder_endpoint}/${poNo}/${InvoiceID}/getPOMatchingByID`,
  GET_PURCHASE_ORDERLINE_USAGE: (purchaseOrderLineID: number) =>
    `${purchaseorder_endpoint}/${purchaseOrderLineID}/usage`,
  PO_SEARCH: `${purchaseorder_endpoint}/searchpo/paged`,
  EXPORT_SEARCH: `${purchaseorder_endpoint}/export/download?`,
  GET_PURCHASE_ORDER_LINE_LIST_BY_ID: `${purchaseorder_endpoint}/GetPurchaseOrderListByID/paged`,
  BATCH_LIST_PURCHASEORDER: `${purchaseorder_endpoint}/BatchListPurchaseOrder/paged`,
  GET_PURCHASE_ORDER_BY_ID: (purchaseOrderId: number) =>
  `${purchaseorder_endpoint}/GetPurchaseOrderByID/${purchaseOrderId}`,
};

export const PO_CONSTANT = {
    SEARCH_FILTER_LOCALSTORAGE : {
        PURCHASEORDER : 'po-local-storage-filter'
    }
}
