import { ControllerProtocol, HttpRequestProtocol } from '@/presentation/protocols';
import { Request, Response } from 'express';

export const adaptRoute = (controller: ControllerProtocol) => {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequestProtocol = {
      body: req.body,
      params: req.params,
      accountId: req.accountId,
    };
    const httpResponse = await controller.handle(httpRequest);
    if (httpResponse.statusCode >= 200 && httpResponse.statusCode <= 299) {
      return res.status(httpResponse.statusCode).json(httpResponse.body);
    }
    return res.status(httpResponse.statusCode).json({ error: httpResponse.body.message });
  };
};
