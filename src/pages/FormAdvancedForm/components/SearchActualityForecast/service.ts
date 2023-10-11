import request  from '@/utils/request';
import { HttpUrlStr }  from '@/utils/request';

import {FetchActForDataType} from "./data";

// const commonUrlStr: string = 'http://localhost:1310/';
const commonUrlStr: string = HttpUrlStr + '/';
// const commonUrlStr: string = '/v1-api/';

export async function searchActForData(params: FetchActForDataType) {
  const urlStr = `${commonUrlStr}actualityForecast/searchDataInfo`;
  return request(urlStr, {
    method: 'POST',
    // @ts-ignore
    data: params,
  });
}
/**
 *'予実比較データ取得
 */
export async function getCompareData(year:any,relatedNo:any,budgetId:any) {
const param:string = year.param;
  const param1:string = relatedNo.param1;
  const param2:string = budgetId.param2;
  const urlStr = `${commonUrlStr}actualityForecast/getCompareInfo?&year=${ param}&relatedNo=${ param1}&budgetId=${param2}`;
  return request(urlStr, {
    method: 'GET',
  });
}
