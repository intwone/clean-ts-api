export interface HttpResponseProtocol {
  statusCode: number;
  body: any;
}

export interface HttpRequestProtocol {
  body?: any;
  headers?: any;
}
