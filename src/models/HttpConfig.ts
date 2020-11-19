import { AxiosRequestConfig } from 'axios';

export interface HttpConfig extends AxiosRequestConfig {
  /**
   * API domain url
   */
  apiURL?: string;

  /**
   * Product API domain url
   */
  productApiURL?: string;

  /**
   * refresh time period
   */
  refreshTime?: number;

  /**
   * Loading function
   */
  load?: Function;

  /**
   * Refresh token function
   */
  refreshToken?: Function;

  /**
   * Log out function
   */
  // logout?: Function;

  domain?: any;
  endpoint?: any;
  method?: any;
  body?: any;
  cancelToken?: any;
  withoutAuth?: any;
  headers?: any;
  loading?: any;
  ignoreExpiration?: any;
}
