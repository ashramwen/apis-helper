interface RequestErrorConfig {
    error?: any;
    config?: any;
    response?: any;
    isCancelled?: any;
}
declare class ExtendableError extends Error {
    constructor(message: any);
}
/**
 * RequestError: Axios請求失敗時，callApi回傳的物件
 */
export declare class RequestError {
    error: any;
    config: any;
    response: any;
    isCancelled: any;
    constructor({ error, config, response, isCancelled }: RequestErrorConfig);
}
/**
 * ServerNoResponseError 沒有收到伺服器的response
 * @class
 */
export declare class ServerNoResponseError extends ExtendableError {
}
/**
 * NoAuthTokenError sessionStorage中並沒有發現token物件
 * @class
 */
export declare class NoAuthTokenError extends ExtendableError {
}
/**
 * AuthTokenExpiredError 儲存於sessionStorage中的Token已經過期
 * @class
 */
export declare class AuthTokenExpiredError extends ExtendableError {
}
/**
 * BEResponseError HTTP請求成功，但是後端回傳的payload中，status不為200或code不為CM000000
 * @class
 */
export declare class BEResponseError extends ExtendableError {
}
export {};
