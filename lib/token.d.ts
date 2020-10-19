/**
 * store token
 */
export declare const storeToken: (data: any) => void;
/**
 * Get access-token that stored at local storage
 * @return {object|null} token
 */
export declare const getStoredToken: () => any;
/**
 * isTokenExpired - 判斷sessionStorage的token物件是否已經過期
 * @param {object} tokenObject
 */
export declare const isTokenExpired: (tokenObject: any) => boolean;
