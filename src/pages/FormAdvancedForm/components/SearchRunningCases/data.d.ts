export interface UserType {
  userCd: string;
  userNm: string;
}

export interface FetchCaseType {
  language: string;
  caseYear: string;
  inputUserCd?: string;
  loginUserCd: string;
  caseNm: string;
}

export interface FetchRunCaseDataType {
  language?: string;
  runYear?: string;
  busUserCd?: string;
}

export interface SearchRunCaseDataType {
  No: string;
  runYear: string;

  busUserCd: string;
  busUserNm: string;
  caseDiviCd: string;
  caseDiviNm: string;
  startYm: string;
  cstmrCd: string;
  cstmrNm: string;
  caseIndstyCd: string;
  caseIndstyNm: string;
  caseNm: string;
  estdAmt: string;
  estdCurryCd: string;
  estdCurryNm: string;
  changedEstdAmt: string;
  changedEstdCurryCd: string;
  changedEstdCurryNm: string;
  effort: string;
  effortUnitCd: string;
  effortUnitNm: string;
  orderMoth: string;
  runRankCd: string;
  runRankNm: string;
  memo: string;
}

export interface SearchLoadingType {
  searchLoading: boolean;
}

export interface RunCaseData {
  runCaseData: SearchRunCaseDataType[];
  setSearchLoading: SearchLoadingType;
}
