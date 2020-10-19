/**
 * store token
 */
export const storeToken = (data: any) => {
  sessionStorage.setItem('token', JSON.stringify(data));
};

/**
 * Get access-token that stored at local storage
 * @return {object|null} token
 */
export const getStoredToken = () => {
  try {
    const sessionStorageToken = sessionStorage.getItem('token');
    const parsedToken = JSON.parse(sessionStorageToken ?? '');

    // 依照前人的設計，token取出來應該可以正常被parse為一般javascript object
    if (typeof parsedToken === 'object') return parsedToken;
  } catch (error) {
    return null;
  }
  // 否則，就回傳null
  return null;
};

/**
 * isTokenExpired - 判斷sessionStorage的token物件是否已經過期
 * @param {object} tokenObject
 */
export const isTokenExpired = (tokenObject: any) => {
  const tokenExpiredAt = tokenObject?.expireAt ?? 0;
  return tokenExpiredAt < Date.now();
};
