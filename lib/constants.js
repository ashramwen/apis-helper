"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PATHS_WHITELIST = exports.LOGOUT_LOCK_TIME = exports.DEBUG_TOKEN_EXPIRED_AFTER_10_SEC = exports.DEBUG = void 0;
// the flag to enable logging debug message of NewCallApi
exports.DEBUG = false;
// A flag to override property `expireAt` after refreshing token api is called
exports.DEBUG_TOKEN_EXPIRED_AFTER_10_SEC = false;
// The millisecond that UnauthorizedManager.logout can be triggered again
exports.LOGOUT_LOCK_TIME = 1000;
// The whitelist of paths while using callApi
exports.PATHS_WHITELIST = [
    'domain',
    'endpoint',
    'method',
    'body',
    'cancelToken',
    'withoutAuth',
    'enableNativeNotification',
    'headers',
    'loading',
];
