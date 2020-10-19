"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.BEResponseError = exports.AuthTokenExpiredError = exports.NoAuthTokenError = exports.ServerNoResponseError = exports.RequestError = void 0;
var ExtendableError = /** @class */ (function (_super) {
    __extends(ExtendableError, _super);
    function ExtendableError(message) {
        var _this = _super.call(this, message) || this;
        _this.name = _this.constructor.name;
        _this.stack = new Error(message).stack;
        return _this;
    }
    return ExtendableError;
}(Error));
/**
 * RequestError: Axios請求失敗時，callApi回傳的物件
 */
var RequestError = /** @class */ (function () {
    function RequestError(_a) {
        var error = _a.error, config = _a.config, response = _a.response, isCancelled = _a.isCancelled;
        this.error = error;
        this.config = config;
        this.response = response;
        this.isCancelled = isCancelled;
    }
    return RequestError;
}());
exports.RequestError = RequestError;
/**
 * ServerNoResponseError 沒有收到伺服器的response
 * @class
 */
var ServerNoResponseError = /** @class */ (function (_super) {
    __extends(ServerNoResponseError, _super);
    function ServerNoResponseError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ServerNoResponseError;
}(ExtendableError));
exports.ServerNoResponseError = ServerNoResponseError;
/**
 * NoAuthTokenError sessionStorage中並沒有發現token物件
 * @class
 */
var NoAuthTokenError = /** @class */ (function (_super) {
    __extends(NoAuthTokenError, _super);
    function NoAuthTokenError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return NoAuthTokenError;
}(ExtendableError));
exports.NoAuthTokenError = NoAuthTokenError;
/**
 * AuthTokenExpiredError 儲存於sessionStorage中的Token已經過期
 * @class
 */
var AuthTokenExpiredError = /** @class */ (function (_super) {
    __extends(AuthTokenExpiredError, _super);
    function AuthTokenExpiredError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return AuthTokenExpiredError;
}(ExtendableError));
exports.AuthTokenExpiredError = AuthTokenExpiredError;
/**
 * BEResponseError HTTP請求成功，但是後端回傳的payload中，status不為200或code不為CM000000
 * @class
 */
var BEResponseError = /** @class */ (function (_super) {
    __extends(BEResponseError, _super);
    function BEResponseError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return BEResponseError;
}(ExtendableError));
exports.BEResponseError = BEResponseError;
