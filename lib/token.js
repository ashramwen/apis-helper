"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTokenExpired = exports.getStoredToken = exports.storeToken = void 0;
/**
 * store token
 */
exports.storeToken = function (data) {
    sessionStorage.setItem('token', JSON.stringify(data));
};
/**
 * Get access-token that stored at local storage
 * @return {object|null} token
 */
exports.getStoredToken = function () {
    try {
        var sessionStorageToken = sessionStorage.getItem('token');
        var parsedToken = JSON.parse(sessionStorageToken !== null && sessionStorageToken !== void 0 ? sessionStorageToken : '');
        // 依照前人的設計，token取出來應該可以正常被parse為一般javascript object
        if (typeof parsedToken === 'object')
            return parsedToken;
    }
    catch (error) {
        return null;
    }
    // 否則，就回傳null
    return null;
};
/**
 * isTokenExpired - 判斷sessionStorage的token物件是否已經過期
 * @param {object} tokenObject
 */
exports.isTokenExpired = function (tokenObject) {
    var _a;
    var tokenExpiredAt = (_a = tokenObject === null || tokenObject === void 0 ? void 0 : tokenObject.expireAt) !== null && _a !== void 0 ? _a : 0;
    return tokenExpiredAt < Date.now();
};
