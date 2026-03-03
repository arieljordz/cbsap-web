export interface ConfirmOptions {
  message: string;
  header?: string;
  icon?: string;
  acceptLabel?: string;
  rejectLabel?: string;
  closable?:boolean;
  acceptButtonStyleClass?: string;
  rejectButtonStyleClass?: string;
  accept?: () => void;
  reject?: () => void;
}
