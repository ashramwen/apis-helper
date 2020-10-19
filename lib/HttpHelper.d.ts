export default class HttpHelper {
    DEBUG: boolean;
    /**
     * axios instance
     */
    private instance;
    /**
     * for loading ui counting
     */
    private loadingCount;
    private config;
    constructor(config: any);
    private invokeLoading;
    private turnOnLoading;
    private turnOffLoading;
    /**
     * _callApi
     * @private
     */
    private _callApi;
    /**
     * callApi
     * @public
     * @param {RequestConfig} config
     * @return {Promise<CallApiResultObject|RequestError>} result
     */
    callApi(config: any): Promise<any>;
    /**
     * call product Api
     * @public
     * @param {RequestConfig} config
     * @return {Promise<CallApiResultObject|RequestError>} result
     */
    callProductApi(config: any): Promise<any>;
    private logoutTimeout?;
    logout(): void;
}
