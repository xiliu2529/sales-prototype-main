import request from 'umi-request';
import { HomeRankOrderModel, HomeRankSettingModel } from "@/pages/HomePage/data";
import { HttpUrlStr } from "@/utils/request";
import { log } from '@/components/DBTable/config';


//const commonUrlStr:string = "http://localhost:1301/homePage/";
const commonUrlStr: string = `${HttpUrlStr}/homePage/`;

export async function salesData(params: HomeRankOrderModel) {
  const urlStr: string = `${commonUrlStr}getCircleInfo`;


  return request(urlStr,
    {
      method: 'POST',
      // @ts-ignore
      data: params,
    }
  );
}
export async function graphData(params: HomeRankOrderModel) {
  const urlStr: string = `${commonUrlStr}getGraphInfo`;

  return request(urlStr,
    {
      method: 'POST',
      // @ts-ignore
      data: params,
    }
  );
}

export async function settingData(params: HomeRankSettingModel) {
  const urlStr: string = `${commonUrlStr}getSettingInfo`;

  return request(urlStr,
    {
      method: 'POST',
      // @ts-ignore
      data: params,
    }
  );
}
export async function settingRefreshData(params: HomeRankSettingModel) {
  const urlStr: string = `${commonUrlStr}getSettingRefreshInfo`;

  return request(urlStr,
    {
      method: 'POST',
      // @ts-ignore
      data: params,
    }
  );
}
export async function mainGraphLeft(params: HomeRankOrderModel) {
  const urlStr: string = `${commonUrlStr}getSalesInfo`;
  return request(urlStr,
    {
      method: 'POST',
      // @ts-ignore
      data: params,
    }
  );
}





export async function budgetOrHistData(params: HomeRankOrderModel) {
  const urlStr: string = `${commonUrlStr}getMonthSalesInfo`;

  return request(urlStr,
    {
      method: 'POST',
      // @ts-ignore
      data: params,
    }
  );
}
export async function customerData(params: HomeRankOrderModel) {
  const urlStr: string = `${commonUrlStr}getCustomerInfo`;


  return request(urlStr,
    {
      method: 'POST',
      // @ts-ignore
      data: params,
    }
  );
}
export async function endUserData(params: HomeRankOrderModel) {
  const urlStr: string = `${commonUrlStr}getEndUserInfo`;


  return request(urlStr,
    {
      method: 'POST',
      // @ts-ignore
      data: params,
    }
  );
}
export async function memberData(params: HomeRankOrderModel) {
  const urlStr: string = `${commonUrlStr}getMemberInfo`;


  return request(urlStr,
    {
      method: 'POST',
      // @ts-ignore
      data: params,
    }
  );
}
