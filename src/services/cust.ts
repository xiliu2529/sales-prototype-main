import request from '@/utils/request';
import { HttpUrlStr } from '@/utils/request';
import { SendMessageModel } from "@/components/SendMessageInfo/data";

const commonUrlStr: string = HttpUrlStr + "/getCustomerInfo/";

export async function query(): Promise<any> {
  return request('/api/customers');
}

/**
 * 
 * @param languageParm 
 * @param setYearParm 
 * @returns 
 */
export async function queryCustomerInfo(languageParm: string, setYearParm: string) {

  let language = '';
  for (const key in languageParm) {
    language = languageParm[key];
  }

  let setYear = '';
  for (const key in setYearParm) {
    setYear = setYearParm[key];
  }

  
  const urlStr = `${commonUrlStr}getTreeCustomerInfo?language=${language}&displayDate=${setYear}`;
  return request(urlStr, {
    method: 'GET',
  });
}
