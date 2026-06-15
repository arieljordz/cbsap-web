export const INV_ROUTINGFLOW = 'v1/invoiceroutingflow';

const inv_base_endpoint = `v1/invoice`;
export const INV_ENPOINT = {
  GET_BY_INVID: (InvoiceID: number) => `${inv_base_endpoint}/${InvoiceID}`,
  ALLOC_LINES: (InvoiceID: number) =>
    `${inv_base_endpoint}/${InvoiceID}/allocationlines`,
  GET_INV_STATUS: (InvoiceID: number) =>
    `${inv_base_endpoint}/${InvoiceID}/getstatus`,
  GET_NEXT_INVOICE: (InvoiceID: number) =>
    `${inv_base_endpoint}/${InvoiceID}/next`,
  GET_PREVIOUS_INVOICE: (InvoiceID: number) =>
    `${inv_base_endpoint}/${InvoiceID}/previous`,

  GET_INV_ACTIVITY_LOG: (InvoiceID: number) =>
    `${inv_base_endpoint}/${InvoiceID}/invoiceActivityLog`,

  GET_INV_ALLOCATION_QUERY: `${inv_base_endpoint}/invallocationline/paged?`,
  UPDATE_INVOICE: `${inv_base_endpoint}/update`,
  GET_INV_MYINVOICE_SEARCH: `${inv_base_endpoint}/myInvoiceSearch/paged?`,
  GET_INV_REJECTED_SEARCH: `${inv_base_endpoint}/rejectQueueSearch/paged?`,
  GET_INV_EXCEPTION_SEARCH: `${inv_base_endpoint}/exceptionQueueSearch/paged?`,
  GET_INV_ARCHIVE_SEARCH: `${inv_base_endpoint}/archiveQueueSearch/paged?`,
  LOAD_INV_COMMENTS: `${inv_base_endpoint}/loadinvoicecomments/paged?`,
  EXPORT_TO_EXCEL: `${inv_base_endpoint}/myinvoice/download?`,
  REJECT_EXPORT_TO_EXCEL: `${inv_base_endpoint}/rejectedinvoice/download?`,
  EXCEPTION_EXPORT_TO_EXCEL: `${inv_base_endpoint}/exceptioninvoice/download?`,
  ARCHIVE_EXPORT_TO_EXCEL: `${inv_base_endpoint}/archiveinvoice/download?`,
  FOR_APPROVAL: `${inv_base_endpoint}/forapproval`,
  FOR_REJECT: `${inv_base_endpoint}/forreject`,
  FOR_REACTIVATE: `${inv_base_endpoint}/reactivate`,
  FOR_FORCETOSUBMIT: `${inv_base_endpoint}/forcetosubmit`,
  SUBMIT_INVOICE: `${inv_base_endpoint}/submit`,
  VALIDATE_INVOICE: `${inv_base_endpoint}/validate`,
  ROUTE_TO_EXCEPTION: `${inv_base_endpoint}/routeToException`,
  FOR_HOLD: `${inv_base_endpoint}/forhold`,
  ADD_COMMENTS: `${inv_base_endpoint}/addinvoicecomment`,
  UPLOAD_ATTACHMENT: `${inv_base_endpoint}/upload`,
  DOWNLOAD_ATTACHMENT: (InvoiceAttachnmentID: number) =>
    `${inv_base_endpoint}/${InvoiceAttachnmentID}/downloadattachment`,
  GETALL_ATTACHMENT: (InvoiceID: number) =>
    `${inv_base_endpoint}/getAllattachment/${InvoiceID}`,
  GET_IMAGE: (InvoiceID: number) => `${inv_base_endpoint}/${InvoiceID}/image`,

  GET_ROUTINGLEVEL: (invoiceId: number,supplierInfoId:number | null,keywordId:number | null) =>
    `${inv_base_endpoint}/invoiceInfoLinkedRoutingLevels?InvoiceID=${invoiceId}&SupplierInfoID=${supplierInfoId}&KeywordID=${keywordId}`,
};
