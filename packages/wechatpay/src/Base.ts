import { Output } from './types-v2';

export class Base {
  protected userAgent = '127.0.0.1'; // User-Agent

  /**
   * get 请求参数处理
   * @param object query 请求参数
   * @param exclude 需要排除的字段
   * @returns
   */
  protected objectToQueryString(object: Record<string, any>, exclude: string[] = []): string {
    let str = Object.keys(object)
      .filter((key) => !exclude.includes(key))
      .map((key) => {
        return encodeURIComponent(key) + '=' + encodeURIComponent(object[key]);
      })
      .join('&');
    if (str) str = '?' + str;
    return str || '';
  }

  /**
   * 获取请求头
   * @param authorization
   */
  protected getHeaders(authorization: string, headers = {}) {
    return {
      ...headers,
      Accept: 'application/json',
      'User-Agent': this.userAgent,
      Authorization: authorization,
      'Accept-Encoding': 'gzip',
    };
  }

  /**
   * post 请求
   * @param url  请求接口
   * @param params 请求参数
   * @deprecated 弃用
   */
  protected async postRequest(url: string, params: Record<string, any>, authorization: string): Promise<Record<string, any>> {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': this.userAgent,
          Authorization: authorization,
          'Accept-Encoding': 'gzip',
        },
        body: JSON.stringify(params),
      });

      const data = await response.json();
      return {
        status: response.status,
        ...data,
      };
    } catch (error) {
      const err = JSON.parse(JSON.stringify(error));
      return {
        status: err.status,
        errRaw: err,
        ...(err?.response?.text && JSON.parse(err?.response?.text)),
      };
    }
  }

  /**
   * post 请求 V2
   * @param url  请求接口
   * @param params 请求参数
   * @deprecated 弃用
   */
  protected async postRequestV2(url: string, params: Record<string, any>, authorization: string, headers = {}): Promise<Output> {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          ...headers,
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': this.userAgent,
          Authorization: authorization,
          'Accept-Encoding': 'gzip',
        },
        body: JSON.stringify(params),
      });

      const data = await response.json();
      return {
        status: response.status,
        data,
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

  /**
   * get 请求
   * @param url  请求接口
   * @param query 请求参数
   * @deprecated 弃用
   */
  protected async getRequest(url: string, authorization: string, query: Record<string, any> = {}): Promise<Record<string, any>> {
    try {
      const queryString = this.objectToQueryString(query);
      const response = await fetch(`${url}${queryString}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'User-Agent': this.userAgent,
          Authorization: authorization,
          'Accept-Encoding': 'gzip',
        },
      });

      let data = {};
      const contentType = response.headers.get('Content-Type');
      if (contentType?.includes('application/json')) {
        data = {
          status: response.status,
          ...(await response.json()),
        };
      } else if (contentType?.includes('text/plain')) {
        data = {
          status: response.status,
          data: await response.text(),
        };
      } else if (contentType?.includes('application/x-gzip')) {
        data = {
          status: response.status,
          data: await response.arrayBuffer(),
        };
      } else {
        data = {
          status: response.status,
          ...(await response.json()),
        };
      }
      return data;
    } catch (error) {
      const err = JSON.parse(JSON.stringify(error));
      return {
        status: err.status,
        errRaw: err,
        ...(err?.response?.text && JSON.parse(err?.response?.text)),
      };
    }
  }

  /**
   * get 请求 v2
   * @param url  请求接口
   * @param query 请求参数
   * @deprecated 弃用
   */
  protected async getRequestV2(url: string, authorization: string, query: Record<string, any> = {}): Promise<Output> {
    try {
      const queryString = this.objectToQueryString(query);
      const response = await fetch(`${url}${queryString}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'User-Agent': this.userAgent,
          Authorization: authorization,
          'Accept-Encoding': 'gzip',
        },
      });

      let data: any = {};
      const contentType = response.headers.get('Content-Type');
      if (contentType?.includes('text/plain')) {
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
