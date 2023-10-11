import request  from '@/utils/request';
import { HttpUrlStr }  from '@/utils/request';
import {HomeRankOrderModel} from "@/pages/HomePage/data";
import {SendMessageModel} from "@/components/SendMessageInfo/data";
import {LoginParamsType} from "@/services/login";

const commonUrlStr:string = HttpUrlStr + "/homePageBarner/";

export async function query(): Promise<any> {
  return request('/api/users');
}

export async function queryCurrent(): Promise<any> {
  // return request('/api/currentUser');
  let useCd = null === localStorage.getItem('useCd')|| undefined === localStorage.getItem('useCd')?"":localStorage.getItem('useCd');
  let access_token =  null === localStorage.getItem('access_token') || undefined === localStorage.getItem('access_token')?"":localStorage.getItem('access_token');
  const currenYearFlag =sessionStorage.getItem('currentYearFlag');
  const urlStr = `${commonUrlStr}getUserInfo?&useCd=`+ useCd+`&access_token=`+ access_token+`&currenYearFlag=`+ currenYearFlag;
  return request(urlStr, {
    method: 'GET',
  });
}


export async function fakeAccountForgetPass(params: string) {
  //let useCd = null === localStorage.getItem('useCd')|| undefined === localStorage.getItem('useCd')?"":localStorage.getItem('useCd');
  console.log("useCd"+params);
  const param =params.replaceAll("&","/")

  const urlStr = `${commonUrlStr}getDefaultPass?&useCd=`+ param;
  return request(urlStr, {
    method: 'POST',
    data:null,
  });
}



export async function queryNotices(params: SendMessageModel): Promise<any> {

  const urlStr:string = `${HttpUrlStr}/sendMessage/getMessageBox`;
  return request(urlStr,
    {method: 'POST',
      // @ts-ignore
      data: params,}
  );
  //return request('/api/notices');
}

/**
 *readMessage
 */
export async function readNotices(params: SendMessageModel): Promise<any> {
  const urlStr:string = `${HttpUrlStr}/sendMessage/readMessageBox`;
  return request(urlStr,
    {method: 'POST',
      // @ts-ignore
      data: params,}
  );
  //return request('/api/notices');
}

/**
 *deleteSendMessageBox
 */
export async function deleteSendMessageBox(params: SendMessageModel): Promise<any> {
  const urlStr:string = `${HttpUrlStr}/sendMessage/deleteMessageBoxSend`;
  return request(urlStr,
    {method: 'POST',
      // @ts-ignore
      data: params,}
  );
  //return request('/api/notices');
}
/**
 *deleteAllMessageBox
 */
export async function deleteMessageBox(params: SendMessageModel): Promise<any> {
  const urlStr:string = `${HttpUrlStr}/sendMessage/deleteMessageBox`;
  return request(urlStr,
    {method: 'POST',
      // @ts-ignore
      data: params,}
  );
  //return request('/api/notices');
}


/**
 *組織コードを取得
 */
export async function queryOrgInfo(languageParm: string, setYearParm: string) {
  let language = '';
  // @ts-ignore
  // eslint-disable-next-line guard-for-in,no-restricted-syntax
  for (const key in languageParm) {
    language = languageParm[key];
  }

  let setYear = '';
  // @ts-ignore
  // eslint-disable-next-line guard-for-in,no-restricted-syntax
  for (const key in setYearParm) {
    setYear = setYearParm[key];
  }
  console.log("setYear1",setYear);
  const urlStr = `${commonUrlStr}getOrgInfo?language=${language}&displayDate=${setYear}`;
  return request(urlStr, {
    method: 'GET',
  });
}
