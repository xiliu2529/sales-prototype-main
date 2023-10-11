import request  from '@/utils/request';
import { HttpUrlStr }  from '@/utils/request';

import {FetchCaseType, FetchCustomerType,RunningCaseDateType, FetchRunCaseDataType} from "./data";

// const commonUrlStr: string = 'http://localhost:1310/';
const commonUrlStr: string = HttpUrlStr + '/';
// const commonUrlStr: string = '/v1-api/';

export async function getCustomerLst(params: FetchCustomerType) {
  const urlStr = `${commonUrlStr}runningCase/getCustomerInfo`;
  return request(urlStr, {
    method: 'POST',
    // @ts-ignore
    data: params,
  });
}

export async function getAllCustomerLst(params: FetchCustomerType) {
  const urlStr = `${commonUrlStr}runningCase/getAllCustomerInfo`;
  return request(urlStr, {
    method: 'POST',
    // @ts-ignore
    data: params,
  });
}

export async function getCaseLst(params: FetchCaseType) {
  const urlStr = `${commonUrlStr}runningCase/getCaseInfo`;
  return request(urlStr, {
    method: 'POST',
    // @ts-ignore
    data: params,
  });
}

export async function getRunCaseData(params: FetchRunCaseDataType) {
  const urlStr = `${commonUrlStr}runningCase/getDataInfo`;
  return request(urlStr, {
    method: 'POST',
    // @ts-ignore
    data: params,
  });
}

export async function getDivisionLst(params: string) {
  let param = '';
  // @ts-ignore
  // eslint-disable-next-line guard-for-in,no-restricted-syntax
  for (const key in params) {
    param = params[key];
  }
  const urlStr: string = `${commonUrlStr}runningCase/getDivisionInfo?year=${param}`;
  return request(urlStr, {
    method: 'GET',
  });
}

export async function insertRunCaseData(params: RunningCaseDateType) {
  const urlStr = `${commonUrlStr}runningCase/addOneDataInfo
`;
  return request(urlStr, {
    method: 'POST',
    // @ts-ignore
    data: params,
  });
}

export async function deleteRunCaseData(params: string) {
  let param = '';
  // @ts-ignore
  // eslint-disable-next-line guard-for-in,no-restricted-syntax
  for (const key in params) {
    param = params[key];
  }
  const urlStr = `${commonUrlStr}runningCase/deleteDataInfo?runId=${param}`;
  return request(urlStr, {
    method: 'GET',
  });
}

export async function updateRunCaseData(params: RunningCaseDateType) {
  const urlStr = `${commonUrlStr}runningCase/updateDataInfo`;
  return request(urlStr, {
    method: 'POST',
    // @ts-ignore
    data: params,
  });
}
