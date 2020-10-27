import axios from 'axios';
import { pick } from 'lodash';
import { LOGOUT_LOCK_TIME, PATHS_WHITELIST } from './constants';
import { isTokenExpired, getStoredToken } from './token';
import {
  RequestError,
  ServerNoResponseError,
  NoAuthTokenError,
  AuthTokenExpiredError,
  BEResponseError,
} from './Exception';
import { logDebug } from './logDebug';

export default class HttpHelper {
  DEBUG = false;

  /**
   * axios instance
   */
  private instance;

  /**
   * loading ui count
   */
  private loadingCount = 0;

  /**
   * refresh time period
   */
  private refreshTime = -1;

  /**
   * Timer for refresh timer
   */
  private timer = 0;

  /**
   * log out timer
   */
  private logoutTimeout?: number;

  private config: HttpConfig = {
    apiURL: '',
  };

  constructor(config: HttpConfig) {
    const self = this;

    this.config = { ...this.config, ...config };

    this.instance = axios.create({ baseURL: this.config.baseURL });

    /**
     * AXIOS middleware for HTTP request
     */
    this.instance.interceptors.request.use(
      (config: any) => {
        const { ignoreExpiration, loading, withoutAuth } = config;

        loading && this.turnOnLoading();

        if (!withoutAuth) {
          // `config.withoutAuth`不為`true`，代表此Request需要帶token給後端。
          // 此處將從sessionStorage中取得token，並且在Request正式發出前，自動在HTTP request header
          // 中補上`Access-Token`欄位。若發生以下情況則拋出例外：
          //    1. 如果sessionStorage中不存在token物件，拋出`NoAuthTokenError`
          //    2. 如果token已經過期 (`tokenObject.expireAt`小於當前時間timestamp)，拋出`AuthTokenExpiredError`
          const tokenObject = getStoredToken();

          if (tokenObject === null) {
            return Promise.reject({
              config,
              requestInterceptorError: new NoAuthTokenError('No access token'),
            });
          } else if (!ignoreExpiration && isTokenExpired(tokenObject)) {
            return Promise.reject({
              config,
              requestInterceptorError: new AuthTokenExpiredError(
                'Token is already expired'
              ),
            });
          }

          config.headers['Authorization'] = `bearer ${tokenObject.token}`;
        }

        return config;
      },
      (error) => {
        Promise.reject(error);
      }
    );

    /**
     * AXIOS middleware for HTTP response
     */
    this.instance.interceptors.response.use(
      /**
       * onFulfilled
       */
      (axiosResponse) => {
        this.turnOffLoading();
        return Promise.resolve(axiosResponse);

        // if (axiosResponse.status === 200) {
        //   return Promise.resolve(axiosResponse.data);
        // }

        // const { config, data } = axiosResponse;

        // const { code, status, message } = data;

        // const errorMessage =
        //   message || `Server Error with code/status: ${code || status}`;

        // const requestError = new RequestError({
        //   error: new BEResponseError(errorMessage),
        //   config,
        //   response: axiosResponse,
        // });
        // return Promise.reject(requestError);
      },
      /**
       * onReject
       */
      (error) => {
        this.turnOffLoading();

        // The request is been cancelled
        if (axios.isCancel(error)) {
          const requestError = new RequestError({
            config: error.config,
            isCancelled: true,
          });
          return Promise.reject(requestError);
        }
        // The request is marked as `authentication needed`, but there is not access-token been
        // stored in local storage. Force user to log out and reject the request
        else if (error.requestInterceptorError instanceof NoAuthTokenError) {
          // logout
          this.logout();

          // reject this request
          const requestError = new RequestError({
            error: error.requestInterceptorError,
            config: error.config,
            response: error.response,
          });
          return Promise.reject(requestError);
        }
        // The server responded with a status code 401 or `error.exception` is
        // an instance of AuthTokenExpiredError
        else if (
          error.response?.status === 401 ||
          error.requestInterceptorError instanceof AuthTokenExpiredError
        ) {
          if (error.config.retried) {
            // 如果已經是retried，還得到AuthTokenExpiredError或HTTP Status 401,
            // 強勢使用者登出。
            this.logout();
            const requestError = new RequestError({
              error: new AuthTokenExpiredError(
                'The request have been retried, but still receive unauthorized error'
              ),
              config: error.config,
              response: error.response,
            });
            return Promise.reject(requestError);
          }

          // waiting for token refreshing and retry
          return new Promise(async function (resolve, reject) {
            try {
              typeof self.config.refreshToken === 'function' &&
                (await self.config.refreshToken());
              error.config.retried = true;
              resolve(self.instance(error.config));
            } catch (error) {
              const requestError = new RequestError({
                error,
                config: error.config,
                response: error.response,
              });
              reject(requestError);
            }
          });
        }
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        else if (error.response) {
          const requestError = new RequestError({
            error: new Error(
              'Server responded with a status code that is out of range of 2xx'
            ),
            config: error.config,
            response: error.response,
          });
          return Promise.reject(requestError);
        }
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        else if (error.request) {
          const requestError = new RequestError({
            error: new ServerNoResponseError('Server no response.'),
            config: error.config,
          });
          return Promise.reject(requestError);
        }
        // Something happened in setting up the request that triggered an Error
        else {
          const requestError = new RequestError({
            error: new Error(error.message),
            config: error.config,
          });
          return Promise.reject(requestError);
        }
      }
    );
  }

  private invokeLoading = (on: boolean) => {
    typeof this.config.load === 'function' && this.config.load(on);
  };

  private turnOnLoading = () => {
    this.loadingCount++;
    this.invokeLoading(true);
  };

  private turnOffLoading = () => {
    this.loadingCount > 0 && this.loadingCount--;
    if (this.loadingCount === 0) {
      this.invokeLoading(false);
    }
  };

  /**
   * _callApi
   * @private
   */
  private async _callApi(config: any) {
    try {
      const {
        domain = this.config.apiURL,
        endpoint = '',
        method = 'get',
        body,
        loading = true,
        ...configs
      } = pick(config, PATHS_WHITELIST);

      const apiConfig = {
        url: `${domain}${endpoint}`,
        method,
        data: body,
        loading,
        ...configs,
      };

      const resp = await this.instance(apiConfig);

      logDebug('[callApi] ... SUCCESS', resp);
      return resp;
    } catch (requestError) {
      logDebug('[callApi] ... FAIL');
      logDebug(requestError);

      return requestError;
    }
  }

  /**
   * callApi
   * @public
   * @param {RequestConfig} config
   * @return {Promise<CallApiResultObject|RequestError>} result
   */
  callApi(config: any) {
    return this._callApi(config);
  }

  /**
   * call product Api
   * @public
   * @param {RequestConfig} config
   * @return {Promise<CallApiResultObject|RequestError>} result
   */
  callProductApi(config: any) {
    return this._callApi({ ...config, domain: this.config.productApiURL });
  }

  private refresh() {
    const self = this;
    if (typeof this.config.refreshToken === 'function') {
      window.setTimeout(async () => {
        typeof self.config.refreshToken === 'function' &&
          (await self.config.refreshToken());
        this.refreshTime > 0 && self.refresh();
      }, this.refreshTime);
    }
  }

  /**
   * Refresh routine
   * @param timeout Time period
   */
  set refreshTimer(timeout: number) {
    if (timeout > 0) {
      this.refreshTime = timeout;
      this.refresh();
    } else if (this.timer > -1) {
      clearTimeout(this.timer);
    }
  }

  /**
   * Log out
   */
  logout() {
    const self = this;
    if (!this.logoutTimeout) {
      self.logoutTimeout = window.setTimeout(() => {
        self.logoutTimeout = undefined;
      }, LOGOUT_LOCK_TIME);

      // 從sessionStorage中，移除token
      sessionStorage.removeItem('token');

      // 將頁面導向root page
      window.location.href = '/';
    }
  }
}
