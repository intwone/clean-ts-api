import { HttpRequestProtocol, HttpResponseProtocol } from './http';

export interface MiddlewareProtocol {
  handle: (httpRequest: HttpRequestProtocol) => Promise<HttpResponseProtocol>;
}
