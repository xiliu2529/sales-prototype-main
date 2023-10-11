export interface FetchCustomerType {
  language?: string;
  runYear?: string;
  orgGroupId?: string;
  authOrgCd?: string;
  inputUserCd?: string;
}

export interface FetchCaseType {
  caseYear?: string;
  authOrgCd?: string;
}

export interface FetchRunCaseDataType {
  language?: string;
  runYear?: string;
  inputUserCd?: string;
}

export interface CustomerType {
  cstmrNm: string;
}

export interface CaseType {
  cstmrCd: number;
  caseNm: string;
  caseNo: string;
}

export interface RunningCaseDateType {
  runId: string;
  No: string;
  runYear?: string;
  language?: string;

  busUserCd?: string;
  busUserNm?: string;
  caseDiviCd: string;
  caseDiviNm: string;
  startYm: string;
  cstmrNm: string;
  caseIndstyCd: string;
  caseIndstyNm: string;
  caseNm: string;
  estdAmt: string;
  estdCurryCd: string;
  estdCurryNm: string;
  effort: string;
  effortUnitCd: string;
  effortUnitNm: string;
  orderMoth: string;
  runRankCd: string;
  runRankNm: string;
  memo: string;
  lastEditedUser: string;
  editable: boolean;
}

export interface SearchLoadingType {
  searchLoading: boolean;
}

export interface RunningCaseData {
  runCaseData: RunningCaseDateType[];
  customerLst: CustomerType[];
  caseLst: CaseType[];
  divisionLst: IndustryType[];

  setSearchLoading: SearchLoadingType;
};
