import request  from '@/utils/request';
import { HttpUrlStr }  from '@/utils/request';

import {FetchCaseType} from "./data";

// const commonUrlStr: string = 'http://localhost:1310/';
const commonUrlStr: string = HttpUrlStr + '/';
// const commonUrlStr: string = '/v1-api/';

export async function getReportFormat(params: FetchCaseType) {
  const urlStr = `${commonUrlStr}report/getReportFormat`;
  return request(urlStr, {
    method: 'POST',
    // @ts-ignore
    data: params,
  });
}

export async function getReportHeaderFormat(params: FetchCaseType) {
  const urlStr = `${commonUrlStr}report/getReportHeaderFormat`;
  return request(urlStr, {
    method: 'POST',
    // @ts-ignore
    data: params,
  });
}
