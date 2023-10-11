import {AuthOrgType} from "@/pages/FormAdvancedForm/data";

export interface UserType {
  userCd: string;
  userNm: string;
}

export interface FetchActForDataType {
  language?: string;
  actForYear?: string;
  setDate?: string;
  busUserCd?: string;
  authOrgCds?:string;
}

export interface SearchActForDataType {
  No: string;
  actForYear: string;
  actForMoth: string;

  countOrgCd: string,
  countOrgNm: string,
  busUserCd: string;
  busUserNm: string;
  cstmrCd: string;
  cstmrNm: string;
  caseIndstyCd: string;
  caseIndstyNm: string;
  caseNm: string;
  caseNo: string;
  actForRankCd: string;
  actForRankNm: string;
  orderAmt: string;
  cntrcCurrCd: string;
  cntrcCurrNm: string;
  changedOrderAmt: string;
  changedCntrcCurrCd: string;
  changedCntrcCurrNm: string;
  effort: string;
  effortUnitCd: string;
  effortUnitNm: string;
  endUserCd: string;
  endUserNm: string;
  memo: string;
  relatedNo: string;
  bugtId: string;
  busActId: string;
}

export interface SearchLoadingType {
  searchLoading: boolean;
}

export interface ActForecastData {
  actForData: SearchActForDataType[];
  authOrgCdLst: AuthOrgType [];
  selectCollapsed: boolean;
  collapsed: boolean;
  setSearchLoading: SearchLoadingType;
  compareData:CompareData;
  monthSummaryModelCollapsed: boolean;
}

export interface RightLineContent {
  title: string;
  amountBuget: string;
  amountSales: string;
  amountAch: string;
  effortBuget: string;
  effortSales: string;
  effortAch: string;
}

export interface CompareData {
  amount: string;
  effort: string;
  actAmt: string;
  actEffort: string;
  currConcat: string;
}

