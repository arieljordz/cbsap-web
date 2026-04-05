export interface EntityMatchingConfigDto  {
    matchingConfigID: number;
    entityProfileID: number;
    configType: 'POMT' |'PO' | 'GR';
    matchingLevel: string | null;
    invoiceMatchBasis: string | null;

    dollarAmt: number | null;
    percentageAmt: number | null;
   
}