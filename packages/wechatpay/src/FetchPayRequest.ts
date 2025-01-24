
import { Output } from './types-v2';
import { IPayRequest } from './PayRequest';

export class FetchPayRequest implements IPayRequest {
  async upload(url: string, params: Record<string, any>, headers: Record<string, any>): Promise<Output> {
    try {
      const formData = new FormData();
      formData.append('file', new Blob([params.pic_buffer], { type: 'image/jpg' }), '72fe0092be0cf9dd8420579cc954fb4e.jpg');
      formData.append('meta', JSON.stringify(params.fileinfo));

      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: formData,
      });

      const data = await response.json();

      return {
        status: response.status,
        data: data,
      };
    } catch (error) {
      const err = JSON.parse(JSON.stringify(error));
      return {
        status: err.status as number,
        errRaw: err,
        error: err?.response?.text,
      };
    }
  }

  async post(url: string, params: Record<string, any>, headers: Record<string, any>): Promise<Output> {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: JSON.stringify(params),
      });

      const data = await response.json();

      return {
        status: response.status,
        data: data,
      };
    } catch (error) {
      const err = JSON.parse(JSON.stringify(error));
      return {
        status: err.status as number,
        errRaw: err,
        error: err?.response?.text,
      };
    }
  }

  async get(url: string, headers: Record<string, any>): Promise<Output> {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: headers,
      });

      let data: any = {};
      if (response.headers.get('content-type')?.includes('text/plain')) {
        data = {
          status: response.status,
          data: await response.text(),
        };
      } else {
        data = {
          status: response.status,
          data: await response.json(),
        };
      }

      return data;
    } catch (error) {
      const err = JSON.parse(JSON.stringify(error));
      return {
        status: err.status,
        errRaw: err,
        error: err?.response?.text,
      };
    }
  }
}
