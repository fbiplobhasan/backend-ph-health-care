export interface IUpdateSpecialtyPayload {
  title: string;
  description: string;
  icon: string;
}

export interface IResponseData<T> {
  httpStatusCode: number;
  success: boolean;
  message: string;
  data: T;
}
