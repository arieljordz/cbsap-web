export class ResultObject<T> {
  isSuccess: boolean;
  data?: T | null;
  errorMessage?: string;

  constructor(isSuccess: boolean, data?: T, errorMessage?: string) {
    this.isSuccess = isSuccess;
    this.data = data;
    this.errorMessage = errorMessage;
  }
}
