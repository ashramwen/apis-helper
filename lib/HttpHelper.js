"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var lodash_1 = require("lodash");
var constants_1 = require("./constants");
var token_1 = require("./token");
var Exception_1 = require("./Exception");
var logDebug_1 = require("./logDebug");
var HttpHelper = /** @class */ (function () {
    function HttpHelper(config) {
        var _this = this;
        this.DEBUG = false;
        /**
         * for loading ui counting
         */
        this.loadingCount = 0;
        this.config = {
            loading: function (on) { },
            apiUrl: '',
            productApiUrl: '',
            refreshToken: function () { },
        };
        this.invokeLoading = function (on) {
            typeof _this.config.loading === 'function' && _this.config.loading(on);
        };
        this.turnOnLoading = function () {
            _this.loadingCount++;
            _this.invokeLoading(true);
        };
        this.turnOffLoading = function () {
            _this.loadingCount > 0 && _this.loadingCount--;
            if (_this.loadingCount === 0) {
                _this.invokeLoading(false);
            }
        };
        this.instance = axios_1.default.create();
        this.config = __assign(__assign({}, this.config), config);
        var self = this;
        /**
         * AXIOS middleware for HTTP request
         */
        this.instance.interceptors.request.use(function (config) {
            var loading = config.loading, withoutAuth = config.withoutAuth;
            loading && _this.turnOnLoading();
            if (!withoutAuth) {
                // `config.withoutAuth`不為`true`，代表此Request需要帶token給後端。
                // 此處將從sessionStorage中取得token，並且在Request正式發出前，自動在HTTP request header
                // 中補上`Access-Token`欄位。若發生以下情況則拋出例外：
                //    1. 如果sessionStorage中不存在token物件，拋出`NoAuthTokenError`
                //    2. 如果token已經過期 (`tokenObject.expireAt`小於當前時間timestamp)，拋出`AuthTokenExpiredError`
                var tokenObject = token_1.getStoredToken();
                if (tokenObject === null) {
                    return Promise.reject({
                        config: config,
                        requestInterceptorError: new Exception_1.NoAuthTokenError('No access token'),
                    });
                }
                else if (token_1.isTokenExpired(tokenObject)) {
                    return Promise.reject({
                        config: config,
                        requestInterceptorError: new Exception_1.AuthTokenExpiredError('Token is already expired'),
                    });
                }
                config.headers['Authorization'] = "bearer " + tokenObject.token;
            }
            return config;
        }, function (error) {
            Promise.reject(error);
        });
        /**
         * AXIOS middleware for HTTP response
         */
        this.instance.interceptors.response.use(
        /**
         * onFulfilled
         */
        function (axiosResponse) {
            _this.turnOffLoading();
            var config = axiosResponse.config, data = axiosResponse.data;
            if (data && data.status === 200) {
                return Promise.resolve(axiosResponse);
            }
            var code = data.code, status = data.status, message = data.message;
            var errorMessage = message || "Server Error with code/status: " + (code || status);
            var requestError = new Exception_1.RequestError({
                error: new Exception_1.BEResponseError(errorMessage),
                config: config,
                response: axiosResponse,
            });
            return Promise.reject(requestError);
        }, 
        /**
         * onReject
         */
        function (error) {
            var _a;
            _this.turnOffLoading();
            // The request is been cancelled
            if (axios_1.default.isCancel(error)) {
                var requestError = new Exception_1.RequestError({
                    config: error.config,
                    isCancelled: true,
                });
                return Promise.reject(requestError);
            }
            // The request is marked as `authentication needed`, but there is not access-token been
            // stored in local storage. Force user to log out and reject the request
            else if (error.requestInterceptorError instanceof Exception_1.NoAuthTokenError) {
                // logout
                _this.logout();
                // reject this request
                var requestError = new Exception_1.RequestError({
                    error: error.requestInterceptorError,
                    config: error.config,
                    response: error.response,
                });
                return Promise.reject(requestError);
            }
            // The server responded with a status code 401 or `error.exception` is
            // an instance of AuthTokenExpiredError
            else if (((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) === 401 ||
                error.requestInterceptorError instanceof Exception_1.AuthTokenExpiredError) {
                if (error.config.retried) {
                    // 如果已經是retried，還得到AuthTokenExpiredError或HTTP Status 401,
                    // 強勢使用者登出。
                    _this.logout();
                    var requestError = new Exception_1.RequestError({
                        error: new Exception_1.AuthTokenExpiredError('The request have been retried, but still receive unauthorized error'),
                        config: error.config,
                        response: error.response,
                    });
                    return Promise.reject(requestError);
                }
                // waiting for token refreshing and retry
                return new Promise(function (resolve, reject) {
                    return __awaiter(this, void 0, void 0, function () {
                        var error_1, requestError;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, self.config.refreshToken()];
                                case 1:
                                    _a.sent();
                                    error.config.retried = true;
                                    resolve(self.instance(error.config));
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_1 = _a.sent();
                                    requestError = new Exception_1.RequestError({
                                        error: error_1,
                                        config: error_1.config,
                                        response: error_1.response,
                                    });
                                    reject(requestError);
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    });
                });
            }
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            else if (error.response) {
                var requestError = new Exception_1.RequestError({
                    error: new Error('Server responded with a status code that is out of range of 2xx'),
                    config: error.config,
                    response: error.response,
                });
                return Promise.reject(requestError);
            }
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            else if (error.request) {
                var requestError = new Exception_1.RequestError({
                    error: new Exception_1.ServerNoResponseError('Server no response.'),
                    config: error.config,
                });
                return Promise.reject(requestError);
            }
            // Something happened in setting up the request that triggered an Error
            else {
                var requestError = new Exception_1.RequestError({
                    error: new Error(error.message),
                    config: error.config,
                });
                return Promise.reject(requestError);
            }
        });
    }
    /**
     * _callApi
     * @private
     */
    HttpHelper.prototype._callApi = function (config) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, domain, endpoint, _c, method, body, _d, loading, configs, apiConfig, resp, requestError_1;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 2, , 3]);
                        _a = lodash_1.pick(config, constants_1.PATHS_WHITELIST), _b = _a.domain, domain = _b === void 0 ? this.config.apiUrl : _b, endpoint = _a.endpoint, _c = _a.method, method = _c === void 0 ? 'get' : _c, body = _a.body, _d = _a.loading, loading = _d === void 0 ? true : _d, configs = __rest(_a, ["domain", "endpoint", "method", "body", "loading"]);
                        apiConfig = __assign({ url: "" + domain + endpoint, method: method, data: body, loading: loading }, configs);
                        return [4 /*yield*/, this.instance(apiConfig)];
                    case 1:
                        resp = _e.sent();
                        logDebug_1.logDebug('[callApi] ... SUCCESS', resp);
                        return [2 /*return*/, resp.data];
                    case 2:
                        requestError_1 = _e.sent();
                        logDebug_1.logDebug('[callApi] ... FAIL');
                        logDebug_1.logDebug(requestError_1);
                        return [2 /*return*/, requestError_1];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * callApi
     * @public
     * @param {RequestConfig} config
     * @return {Promise<CallApiResultObject|RequestError>} result
     */
    HttpHelper.prototype.callApi = function (config) {
        return this._callApi(config);
    };
    /**
     * call product Api
     * @public
     * @param {RequestConfig} config
     * @return {Promise<CallApiResultObject|RequestError>} result
     */
    HttpHelper.prototype.callProductApi = function (config) {
        return this._callApi(__assign(__assign({}, config), { domain: this.config.productApiUrl }));
    };
    HttpHelper.prototype.logout = function () {
        var self = this;
        if (!this.logoutTimeout) {
            self.logoutTimeout = window.setTimeout(function () {
                self.logoutTimeout = undefined;
            }, constants_1.LOGOUT_LOCK_TIME);
            // 從sessionStorage中，移除token
            sessionStorage.removeItem('token');
            // 將頁面導向root page
            window.location.href = '/';
        }
    };
    return HttpHelper;
}());
exports.default = HttpHelper;
