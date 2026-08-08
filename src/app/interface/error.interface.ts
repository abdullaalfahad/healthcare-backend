export interface IErrorSource {
  path: string;
  message: string;
}

export interface IErrorResponse {
  success: boolean;
  message: string;
  errorSource: IErrorSource[];
  error?: any;
  stack?: string;
}
