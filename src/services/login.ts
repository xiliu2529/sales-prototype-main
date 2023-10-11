import request from '@/utils/request';
import { HttpUrlStr }  from '@/utils/request';
import CryptoJs from 'crypto-js'


// const commonUrlStr: string = 'http://192.168.25.193:1311';
const commonUrlStr: string = HttpUrlStr;
export interface LoginParamsType {
  userName: string;
  password: string;
  mobile: string;
  captcha: string;
}

export interface LoginPostType {
  username: string;
  password: string;
  grant_type: string;
  client_id: string;
  client_secret: string;
}

export async function fakeAccountLogin(params: LoginParamsType) {
  const password =  CryptoJs.MD5(params.password).toString();

  const loginInfo:LoginPostType = {
    username: params.userName,
    password,
    grant_type: 'password',
    client_id: 'lzt',
    client_secret: 'lzt',
  }

  const urlStr:string = `${commonUrlStr}/api/login `;
  return request(urlStr, {
    method: 'POST',
    data: loginInfo,
  });
}

export async function fakeAccountLogout() {
  const urlStr:string = `${commonUrlStr}/api/logout` ;
  return request(urlStr, {
    method: 'POST',
    data: null,
  });
}

export async function getFakeCaptcha(mobile: string) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}

/**
 * システムメッセージ取得
 */
export async function getSystemMessage(): Promise<any> {
  const urlStr:string = `${HttpUrlStr}/sysMessage/getMessage`;
  return request(urlStr,
    {method: 'GET',
    });
}
