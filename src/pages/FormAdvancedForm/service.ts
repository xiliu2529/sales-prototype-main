import request  from '@/utils/request';
import { HttpUrlStr }  from '@/utils/request';

import {
  CopyBottomDataParamType,
  DeleteBottomDataParamType,
  FetchBatchAddDataType,
  FetchBottomDataType,
  FetchCaseType,
  UpdateBottomDataParamType,
  AddCustomerType,
  AddEndUserType,
  FetchMonthNoType,
  FetchBatchExchRtType,
  ActForBatchEditModel,
  FetchBudgetDtlType,
  DBusActDtl,
  FetchBatchSaveDateType,
  FetchActForeCaseMonthSummaryType,
} from '@/pages/FormAdvancedForm/data';
import {HomeRankOrderModel} from "@/pages/HomePage/data";

// const commonUrlStr: string = 'http://localhost:1310/';
const commonUrlStr: string = HttpUrlStr + '/';
// const commonUrlStr: string = '/v1-api/';

export async function getAuthOrgCdLst(params: FetchCaseType) {
  const urlStr = `${commonUrlStr}actualityForecast/getOrgCdInfo`;
  return request(urlStr, {
    method: 'POST',
    // @ts-ignore
    data: params,
  });
}

export async function getCustomerLst(params: FetchCaseType) {
  const urlStr = `${commonUrlStr}actualityForecast/getCustomerInfo`;
  return request(urlStr, {
    method: 'POST',
    // @ts-ignore
    data: params,
  });
}

export async function getAllCustomerLst(params: FetchCaseType) {
  const urlStr = `${commonUrlStr}actualityForecast/getAllCustomerInfo`;
  return request(urlStr, {
    method: 'POST',
    // @ts-ignore
    data: params,
  });
}

export async function getIndustryLst(params: string) {
  let param = '';
  // @ts-ignore
  // eslint-disable-next-line guard-for-in,no-restricted-syntax
  for (const key in params) {
    param = params[key];
  }
  const urlStr = `${commonUrlStr}actualityForecast/getCaseIndstyInfo?year=${param}`;
  return request(urlStr, {
    method: 'GET',
  });
}

export async function getCaseLst(params: FetchCaseType) {
  const urlStr = `${commonUrlStr}actualityForecast/getCaseInfo`;
  return request(urlStr, {
    method: 'POST',
    // @ts-ignore
    data: params,
  });
}

export async function getCaseNumberLst(params: FetchCaseType) {
  const urlStr = `${commonUrlStr}actualityForecast/getCaseNumberInfo`;
  return request(urlStr, {
    method: 'POST',
    // @ts-ignore
    data: params,
  });
}

export async function getProbabilityLst(params: string) {
  let param = '';
  // @ts-ignore
  // eslint-disable-next-line guard-for-in,no-restricted-syntax
  for (const key in params) {
    param = params[key];
  }
  const urlStr = `${commonUrlStr}actualityForecast/getActForRankInfo?year=${param}`;
  return request(urlStr, {
    method: 'GET',
  });
}

export async function getCurrencyLst(params: string) {
  let param = '';
  // @ts-ignore
  // eslint-disable-next-line guard-for-in,no-restricted-syntax
  for (const key in params) {
    param = params[key];
  }
  const urlStr = `${commonUrlStr}actualityForecast/getCurrencyInfo?year=${param}`;
  return request(urlStr, {
    method: 'GET',
  });
}

export async function getEffortUnitLst(params: string) {
  let param = '';
  // @ts-ignore
  // eslint-disable-next-line guard-for-in,no-restricted-syntax
  for (const key in params) {
    param = params[key];
  }
  const urlStr = `${commonUrlStr}actualityForecast/getEffortUnitInfo?year=${param}`;
  return request(urlStr, {
    method: 'GET',
  });
}

export async function getEndUserLst(params: FetchCaseType) {
  const urlStr = `${commonUrlStr}actualityForecast/getEndUserInfo`;
  return request(urlStr, {
    method: 'POST',
    // @ts-ignore
    data: params,
  });
}

export async function getAllEndUserLst(params: FetchCaseType) {
  const urlStr = `${commonUrlStr}actualityForecast/getAllEndUserInfo`;
  return request(urlStr, {
    method: 'POST',
    // @ts-ignore
    data: params,
  });
}

export async function getExchLst(params: FetchBatchExchRtType) {
  const urlStr = `${commonUrlStr}actualityForecast/searchBatchFetchExch`;
  return request(urlStr, {
    method: 'POST',
    // @ts-ignore
    data: params,
  });
}

export async function getActForecastBottomData(params: FetchBottomDataType) {
  const urlStr = `${commonUrlStr}actualityForecast/getDataInfo`;
  return request(urlStr, {
    method: 'POST',
    // @ts-ignore
    data: params,
  });
}

export async function insertActForecastBottomData(params: UpdateBottomDataParamType) {
  const urlStr = `${commonUrlStr}actualityForecast/addOneDataInfo`;
  return request(urlStr, {
    method: 'POST',
    // @ts-ignore
    data: params,
  });
}

export async function insertActForecastBusinessData(params: DBusActDtl) {
  const urlStr = `${commonUrlStr}actualityForecast/addDBusActHead`;
  return request(urlStr, {
    method: 'POST',
    // @ts-ignore
    data: params,
  });
}

export async function updateActForecastBottomData(params: UpdateBottomDataParamType) {
  const urlStr = `${commonUrlStr}actualityForecast/updateDataInfo`;
  return request(urlStr, {
    method: 'POST',
    // @ts-ignore
    data: params,
  });
}

export async function onBottomLineUpdateYes(params: UpdateBottomDataParamType) {
  const urlStr = `${commonUrlStr}actualityForecast/bottomLineUpdateYes`;
  return request(urlStr, {
    method: 'POST',
    // @ts-ignore
    data: params,
  });
}

export async function onBottomLineUpdateNo(params: UpdateBottomDataParamType) {
  const urlStr = `${commonUrlStr}actualityForecast/bottomLineUpdateNo`;
  return request(urlStr, {
    method: 'POST',
    // @ts-ignore
    data: params,
  });
}



export async function deleteActForecastBottomData(params: DeleteBottomDataParamType) {
  const urlStr = `${commonUrlStr}actualityForecast/deleteDataInfo`;
  return request(urlStr, {
    method: 'POST',
    // @ts-ignore
    data: params,
  });
}

export async function copyActForecastBottomData(params: CopyBottomDataParamType) {
  const urlStr = `${commonUrlStr}actualityForecast/copyDataInfo`;
  return request(urlStr, {
    method: 'POST',
    // @ts-ignore
    data: params,
  });
}

export async function moveActForecastBottomData(params: CopyBottomDataParamType) {
  const urlStr = `${commonUrlStr}actualityForecast/moveDataInfo`;
  return request(urlStr, {
    method: 'POST',
    // @ts-ignore
    data: params,
  });
}

export async function batchAddActData(params: FetchBatchAddDataType) {
  const urlStr = `${commonUrlStr}actualityForecast/addBatchDataInfo`;
  return request(urlStr, {
    method: 'POST',
    // @ts-ignore
    data: params,
  });
}

export async function addCustomerDataInfo(params: AddCustomerType) {
  const urlStr = `${commonUrlStr}actualityForecast/addCustomerDataInfo`;
  return request(urlStr, {
    method: 'POST',
    // @ts-ignore
    data: params,
  });
}

export async function addEndUserDataInfo(params: AddEndUserType) {
  const urlStr = `${commonUrlStr}actualityForecast/addEndUserDataInfo`;
  return request(urlStr, {
    method: 'POST',
    // @ts-ignore
    data: params,
  });
}

export async function getUserLst(params: FetchCaseType) {
  const urlStr = `${commonUrlStr}actualityForecast/getBusUserInfo`;
  return request(urlStr, {
    method: 'POST',
    // @ts-ignore
    data: params,
  });
}

export async function searchUserLst(params: FetchCaseType) {
  const urlStr = `${commonUrlStr}actualityForecast/searchBusUserInfo`;
  return request(urlStr, {
    method: 'POST',
    // @ts-ignore
    data: params,
  });
}

export async function batchEditTableData(params: FetchCaseType) {
  const urlStr = `${commonUrlStr}actualityForecast/searchBatchEditTableData`;
  return request(urlStr, {
    method: 'POST',
    // @ts-ignore
    data: params,
  });
}

export async function getMonthNo(params: FetchMonthNoType) {
  const urlStr = `${commonUrlStr}actualityForecast/getMonthNo`;
  return request(urlStr, {
    method: 'POST',
    // @ts-ignore
    data: params,
  });
}

export async function budgetOrHistData(params: HomeRankOrderModel) {
  const urlStr:string = `${commonUrlStr}actualityForecast/getMonthSalesInfo`;
  return request(urlStr,
    {method: 'POST',
      // @ts-ignore
      data: params,}
  );
}
export async function saveSaleData(params: ActForBatchEditModel) {
  const urlStr:string = `${commonUrlStr}actualityForecast/saveSaleData`;
  return request(urlStr,
    {method: 'POST',
      // @ts-ignore
      data: params,}
  );
}
export async function getBudgetDtl(params: FetchBudgetDtlType) {
  const urlStr:string = `${commonUrlStr}actualityForecast/getBudgetDtl`;
  return request(urlStr,
    {method: 'POST',
      // @ts-ignore
      data: params,}
  );
}
export async function budgetIdUpdate(params: FetchBatchSaveDateType) {
  const urlStr:string = `${commonUrlStr}actualityForecast/budgetIdUpdate`;
  return request(urlStr,
    {method: 'POST',
      // @ts-ignore
      data: params,}
  );
}
export async function businessActivitiesIdUpdate(params: FetchBatchSaveDateType) {
  const urlStr:string = `${commonUrlStr}actualityForecast/businessActivitiesIdUpdate`;
  return request(urlStr,
    {method: 'POST',
      // @ts-ignore
      data: params,}
  );
}

export async function getDBusActDtl(params: FetchBudgetDtlType) {
  const urlStr:string = `${commonUrlStr}actualityForecast/getDBusActDtl`;
  return request(urlStr,
    {method: 'POST',
      // @ts-ignore
      data: params,}
  );
}

/**
 * 物理コード名別にコードマスタ取得。
 * @param request
 * @return
 * @throws IOException
 */
export async function getCodeValues() {
  const urlStr = `${commonUrlStr}actualityForecast/getCodeValues`;
  return request(urlStr, {
    method: 'GET'
  });
}

/**
 * 予算実績フラグを取得する
 * @param request
 * @return
 * @throws IOException
 */
export async function getBudActFlg(params: FetchCaseType) {
  const urlStr = `${commonUrlStr}actualityForecast/getBudActFlg`;
  return request(urlStr, {
    method: 'POST',
    // @ts-ignore
    data: params,
  });
}
export async function getSearchBatchButtonData(params1:any,params2:any) {
  const param:string = params1.actForYear;
  const param1:string = params2.inputUserCd;
  const urlStr = `${commonUrlStr}actualityForecast/searchBatchButtonData?&actForYear=${param}&inputUserCd=${param1}`;
  return request(urlStr, {
    method: 'GET',
  });
}

/**
 *営業活動ヘッダ取得
 * @param busActId
 */
export async function getBusActHead(busActId:string) {
  const urlStr = `${commonUrlStr}actualityForecast/getBusActHead?&busActId=${ busActId}`;
  return request(urlStr, {
    method: 'GET',
  });
}

export async function getParOrgs(userCdParm: string, setYearParm: string) {
  let userCd = '';
  // @ts-ignore
  // eslint-disable-next-line guard-for-in,no-restricted-syntax
  for (const key in userCdParm) {
    userCd = userCdParm[key];
  }

  let setYear = '';
  // @ts-ignore
  // eslint-disable-next-line guard-for-in,no-restricted-syntax
  for (const key in setYearParm) {
    setYear = setYearParm[key];
  }
  const urlStr = `${commonUrlStr}actualityForecast/getOrgInfo?userCd=${userCd}&displayDate=${setYear}`;
  return request(urlStr, {
    method: 'GET',
  });
}

export async function getActForeCaseMonthSummaryLst(params: FetchActForeCaseMonthSummaryType) {
  const urlStr = `${commonUrlStr}actualityForecast/getActMonthSummaryInfo`;
  return request(urlStr, {
    method: 'POST',
    // @ts-ignore
    data: params.fetchActForeCaseMonthSummaryType,
  });
}