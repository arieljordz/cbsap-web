import { POMatchingStatus } from '@core/enums/po-matching.enum';

export const StatusDescriptions: Record<any, string> = {
  [POMatchingStatus.FullyMatched]: 'Fully Matched',
  [POMatchingStatus.PartialMatched]: 'Partial Matched',
  [POMatchingStatus.Unmatched]: 'Unmatched',
};
