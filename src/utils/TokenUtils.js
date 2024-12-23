/* eslint-disable */
import AES from 'crypto-js/aes';
import Utf8 from 'crypto-js/enc-utf8';
import Base64 from 'crypto-js/enc-base64';
import AESConfig from '../AESConfig';

export class TokenUtils {
  static setToken(token) {
    if (!token) {
      throw Error('Bad token received');
    }
    const cryptedToken = AES.encrypt(token, AESConfig.AESKey);
    localStorage.token = cryptedToken;
    return localStorage.token;
  }

  static getToken() {
    return AES.decrypt(localStorage.token, AESConfig.AESKey).toString(Utf8);
  }

  static createAuthHeaders() {
    let jwt = '';
    jwt = this.getToken();
    jwt = TokenUtils.tokenToBase64Str(jwt);
    const headers = { Authorization: `Bearer ${jwt}` };
    return headers;
  }

  static tokenToBase64Str(token) {
    if (!token) {
      throw Error('Invalid token string');
    }
    const tokenWords = Utf8.parse(token);
    return Base64.stringify(tokenWords);
  }

  static getJwtData() {
    try {
      const jwt = AES.decrypt(localStorage.token, AESConfig.AESKey).toString(Utf8);
      const jwtParts = jwt.split('.');
      const jwtDataStr = Base64.parse(jwtParts[1]).toString(Utf8);
      return JSON.parse(jwtDataStr);
    } catch (e) {
      return null;
    }
  }

  static clear() {
    localStorage.removeItem('token');
  }

  static hasToken() {
    return !!localStorage.getItem('token');
  }
}
