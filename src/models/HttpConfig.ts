interface HttpConfig {
  /**
   * API base url
   */
  baseURL?: string;

  /**
   * API domain url
   */
  apiURL: string;

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
}
