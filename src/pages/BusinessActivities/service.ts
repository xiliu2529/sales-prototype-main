import request  from '@/utils/request';
import { HttpUrlStr }  from '@/utils/request';

import {
  BusActInfoDeleteParamType,
  BusActInfoModifyParamType,
  BusActInfoSearchParamType, BusActInfoUpdateParamType, DBusActHeadDataType,
} from '@/pages/BusinessActivities/data';


const commonUrlStr: string = HttpUrlStr + '/BusinessActivities';

/**
 * ustomer info 取得
 * @param request
 * @param busActInfoSearchModel
 * @return
 * @throws IOException
 */
export async function getCustomerData(params: BusActInfoSearchParamType) {
  const urlStr = `${commonUrlStr}/getCustomerData`;
  return request(urlStr, {
    method: 'POST',
    // @ts-ignore
    data: params,
  });
}

export async function getAllCustomerData(params: BusActInfoSearchParamType) {
  const urlStr = `${commonUrlStr}/getAllCustomerData`;
  return request(urlStr, {
    method: 'POST',
    // @ts-ignore
    data: params,
  });
}

/**
 * 検索エリアのcustomerリスト取得
 * @param request
 * @param busActInfoSearchModel
 * @return
 * @throws IOException
 */
export async function getSearchCustomerData(params: BusActInfoSearchParamType) {
  const urlStr = `${commonUrlStr}/getSearchCustomerData`;
  return request(urlStr, {
    method: 'POST',
    // @ts-ignore
    data: params,
  });
}

/**
 * case情報条件によってデータを取得
 * @param request
 * @param busActInfoSearchModel
 * @return
 * @throws IOException
 */
export async function getCaseData(params: BusActInfoSearchParamType) {
  const urlStr = `${commonUrlStr}/getCaseData`;
  return request(urlStr, {
    method: 'POST',
    // @ts-ignore
    data: params,
  });
}

/**
 * 営業活動における修正中の作成中の項目取得
 * @param request
 * @param busActInfoSearchModel
 * @return
 * @throws IOException
 */
export async function getCaseListEditCreate(params: BusActInfoSearchParamType) {
  const urlStr = `${commonUrlStr}/getCaseListEditCreate`;
  return request(urlStr, {
    method: 'POST',
    // @ts-ignore
    data: params,
  });
}

/**
 *'9.案件名更新
 */
export async function updateCaseNm(payload:string,payload1:string,payload2:String) {

  let loginUseCd = '';
  // @ts-ignore
  // eslint-disable-next-line guard-for-in,no-restricted-syntax
  for (const key in payload) {
    loginUseCd = payload[key];
  }

  let caseNm = '';
  // @ts-ignore
  // eslint-disable-next-line guard-for-in,no-restricted-syntax
  for (const key in payload1) {
    // eslint-disable-next-line no-param-reassign
    caseNm = payload1[key];
  }
  let busActId = '';
  // @ts-ignore
  // eslint-disable-next-line guard-for-in,no-restricted-syntax
  for (const key in payload2) {
    // eslint-disable-next-line no-param-reassign
    busActId = payload2[key];
  }

  const urlStr = `${commonUrlStr}/updateCaseNm?&loginUseCd=${ loginUseCd}&caseNm=${ caseNm}&busActId=${ busActId}`;
  return request(urlStr, {
    method: 'GET',
  });
}

/**
 * END_USER情報を取得する。
 * @param request
 * @return
 * @throws IOException
 */
export async function getEndUsers(params: BusActInfoSearchParamType) {
  const urlStr = `${commonUrlStr}/getEndUsers`;
  return request(urlStr, {
    method: 'POST',
    // @ts-ignore
    data: params,
  });
}

export async function getAllEndUsers(params: BusActInfoSearchParamType) {
  const urlStr = `${commonUrlStr}/getAllEndUsers`;
  return request(urlStr, {
    method: 'POST',
    // @ts-ignore
    data: params,
  });
}

/**
 * 物理コード名別にコードマスタ取得。
 * @param request
 * @return
 * @throws IOException
 */
export async function getCodeValues() {
  const urlStr = `${commonUrlStr}/getCodeValues`;
  return request(urlStr, {
    method: 'GET'
  });
}

/**
 * 営業担当リスト取得
 * @return
 * @throws IOException
 * @param params
 */
export async function getBusUserInfo(params: BusActInfoSearchParamType) {
  const urlStr = `${commonUrlStr}/getBusUserInfo`;
  return request(urlStr, {
    method: 'POST',
    // @ts-ignore
    data: params,
  });
}

/**
 * 営業活動情報を取得する。
 */
export async function getBusinessActivities(params: BusActInfoSearchParamType) {
  const urlStr = `${commonUrlStr}/getBusinessActivities`;
  return request(urlStr, {
    method: 'POST',
    // @ts-ignore
    data: params,
  });
}

/**
 * 営業活動ヘッダ情報取得する。
 */
export async function getBusinessActivityHeaders(params: BusActInfoSearchParamType) {
  const urlStr = `${commonUrlStr}/getBusinessActivityHeaders`;
  return request(urlStr, {
    method: 'POST',
    // @ts-ignore
    data: params,
  });
}

/**
 * 営業活動明細情報取得。
 */
export async function getBusinessActivityDtls(params: BusActInfoDeleteParamType) {
  const urlStr = `${commonUrlStr}/getBusinessActivityDtl`;
  return request(urlStr, {
    method: 'POST',
    // @ts-ignore
    data: params,
  });
}

/**
 * 営業活動削除。
 */
export async function deleteBusinessActivity(params: BusActInfoModifyParamType) {
  const urlStr = `${commonUrlStr}/deleteBusinessActivity`;
  return request(urlStr, {
    method: 'delete',
    // @ts-ignore
    data: params,
  });
}

/**
 * 営業活動削除。
 */
export async function deleteBusinessActivityFile(params: BusActInfoModifyParamType) {
  const urlStr = `${commonUrlStr}/deleteBusinessActivityFile`;
  return request(urlStr, {
    method: 'delete',
    // @ts-ignore
    data: params,
  });
}

/**
 * 営業活動明細情報更新
 */
export async function updateBusinessActivityDtl(params: BusActInfoUpdateParamType) {
  const urlStr = `${commonUrlStr}/updateBusinessActivityDtl`;
  return request(urlStr, {
    method: 'POST',
    // @ts-ignore
    data: params,
  });
}


/**
 * 営業活動情報挿入
 */
export async function insertBusinessActivityDtl(params: BusActInfoUpdateParamType) {
  const urlStr = `${commonUrlStr}/insertBusinessActivityDtl`;
  return request(urlStr, {
    method: 'POST',
    // @ts-ignore
    data: params,
  });
}

/**
 * 営業活動head情報更新
 */
export async function updateBusinessActivityHead(params: DBusActHeadDataType) {
  const urlStr = `${commonUrlStr}/updateBusinessActivityHead`;
  return request(urlStr, {
    method: 'POST',
    // @ts-ignore
    data: params,
  });
}


/**
 * 営業活動報情報挿入
 */
export async function insertBusinessActivity(params: DBusActHeadDataType) {
  const urlStr = `${commonUrlStr}/insertBusinessActivity`;
  return request(urlStr, {
    method: 'POST',
    // @ts-ignore
    data: params,
  });
}

/**
 * 用户权限信息取得
 */
export async function getUserInfo(param:string) {
  const urlStr = `${commonUrlStr}/getUserInfo?&useCd=`+ param;
  return request(urlStr, {
    method: 'GET',
  });
}

/**
 * 組織グループコード情報取得
 * @param request
 * @param busActInfoSearchModel
 * @return
 * @throws IOException
 */
export async function getOrgGroupIds(params: BusActInfoSearchParamType) {
  const urlStr = `${commonUrlStr}/getOrgGroupIds`;
  return request(urlStr, {
    method: 'POST',
    // @ts-ignore
    data: params,
  });
}


