import request  from '@/utils/request';
import { HttpUrlStr }  from '@/utils/request';

import { SendMessageModel} from "./data";

// const commonUrlStr: string = 'http://localhost:1310/';
const commonUrlStr: string = `${HttpUrlStr  }/sendMessage/`;


export async function getSendMessageInfo(params: SendMessageModel) {
  const urlStr = `${commonUrlStr}getSendMessageInfo`;
  return request(urlStr, {
    method: 'POST',
    // @ts-ignore
    data: params,
  });
}
export async function sendMessage(params: SendMessageModel) {
  const urlStr = `${commonUrlStr}insertMessage`;
  return request(urlStr, {
    method: 'POST',
    // @ts-ignore
    data: params,
  });
}
