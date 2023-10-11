import request  from '@/utils/request';
import { HttpUrlStr }  from '@/utils/request';

import {FetchRunCaseDataType} from "./data";

// const commonUrlStr: string = 'http://localhost:1310/';
const commonUrlStr: string = HttpUrlStr + '/';
// const commonUrlStr: string = '/v1-api/';

export async function searchRunCaseData(params: FetchRunCaseDataType) {
  const urlStr = `${commonUrlStr}runningCase/searchDataInfo`;
  return request(urlStr, {
    method: 'POST',
    // @ts-ignore
    data: params,
  });
}

