import request  from '@/utils/request';
import { HttpUrlStr }  from '@/utils/request';

import {FetchCaseType, LoadDataType} from "./data";

// const commonUrlStr: string = 'http://localhost:1310/';
const commonUrlStr: string = HttpUrlStr + '/';
// const commonUrlStr: string = '/v1-api/';

export async function getFormatNameData(params: FetchCaseType) {
  const urlStr = `${commonUrlStr}uploadExcel/getFormatName`;
  return request(urlStr, {
    method: 'POST',
    // @ts-ignore
    data: params,
  });
}

export async function getFormatHeaderData(params: FetchCaseType) {
  const urlStr = `${commonUrlStr}uploadExcel/getFormatHeader`;
  return request(urlStr, {
    method: 'POST',
    // @ts-ignore
    data: params,
  });
}

export async function getFormatBudgetData(params: FetchCaseType) {
  const urlStr = `${commonUrlStr}uploadExcel/getFormatBudget`;
  return request(urlStr, {
    method: 'POST',
    // @ts-ignore
    data: params,
  });
}

export async function getSheetUserData(params: FetchCaseType) {
  const urlStr = `${commonUrlStr}uploadExcel/getUserInfo`;
  return request(urlStr, {
    method: 'POST',
    // @ts-ignore
    data: params,
  });
}

export async function loadData(params: LoadDataType) {
  const urlStr = `${commonUrlStr}uploadExcel/loadData`;
  return request(urlStr, {
    method: 'POST',
    // @ts-ignore
    data: params,
  });
}

export async function clearAndLoadData(params: LoadDataType) {
  const urlStr = `${commonUrlStr}uploadExcel/clearAndLoadData`;
  return request(urlStr, {
    method: 'POST',
    // @ts-ignore
    data: params,
  });
}
