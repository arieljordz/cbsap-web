
export class ResponseResult<T> {
    statusCode: number;
    responseData?: T | null;
    isSuccess: boolean;
    messages?: string[];
  
    constructor( statusCode: number,  isSuccess: boolean, responseData?: T, messages?: string[]) {
      this.statusCode = statusCode
      this.responseData = responseData;
      this.isSuccess = isSuccess;
      this.messages = messages;
    }

    static success<T>(statusCode: number, data: T, messages: string[]): ResponseResult<T> {
      return new ResponseResult<T>(statusCode, true, data,  messages);
    }
  
    static failure<T>(statusCode: number, data?: T, messages?: string[]): ResponseResult<T> {
  
      return new ResponseResult<T>(statusCode, false, data,  messages );
    }
  }
  