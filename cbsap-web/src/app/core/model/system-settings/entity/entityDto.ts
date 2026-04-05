import { EntityMatchingConfigDto } from "./entity-matchingConfigDTO";

export interface EntityProfileDto   {
    entityProfileID: number ;
    entityName: string;
    entityCode: string;
    emailAddress: string;
    taxID: string;
    erpFinanceSystem: string;
    defaultInvoiceDueInDays: number | null;
    invAllowPresetAmount: boolean | null;
    invAllowPresetDimension: boolean | null;
    taxDollarAmt: number | null;
    taxPercentageAmt: number | null;
    matchingConfigs: EntityMatchingConfigDto[] | null;
   
}