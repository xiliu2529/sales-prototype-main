import request from 'umi-request';
import {HttpUrlStr} from "@/utils/request";
import {ChangePassModel} from "@/pages/AccountSettings/data";

const commonUrlStr: string = `${HttpUrlStr  }/personalSet/`;

export async function queryCurrent(params: ChangePassModel) {
  const urlStr:string = `${commonUrlStr}initPersonalInfo`;
  return request(urlStr,
    {method: 'POST',
      // @ts-ignore
      data: params,}
  );
}

export async function changePassWord(params: ChangePassModel) {
  const urlStr:string = `${commonUrlStr}updateMyUser`;
  return request(urlStr,
    {method: 'POST',
      // @ts-ignore
      data: params,}
  );
}

export async function changeEmail(params: ChangePassModel) {
  const urlStr:string = `${commonUrlStr}submitEmail`;
  return request(urlStr,
    {method: 'POST',
      // @ts-ignore
      data: params,}
  );
}
export async function changeDspYear(params: ChangePassModel) {
  const urlStr:string = `${commonUrlStr}updateYear`;
  return request(urlStr,
    {method: 'POST',
      // @ts-ignore
      data: params,}
  );
}


export async function queryCurrentMain() {
  return request('/api/currentUser');
}

export async function queryProvince() {
  return request('/api/geographic/province');
}

export async function queryCity(province: string) {
  return request(`/api/geographic/city/${province}`);
}

export async function query() {
  return request('/api/users');
}
