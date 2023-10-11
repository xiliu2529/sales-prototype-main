export interface FetchCaseType {
  language?: string;
  caseYear?: string;
  orgGroupId?: string;
  loginUserCd: string;
  authOrgCd: string;
  selectedOrgCd: string;
}

export interface ReportInfoModel {
  layCd: string;
  budgetYear: string;
  orgGroupId: string;
  authPro: string;
  authOrgCd: string;
  selectedOrgCd: string;
  loginUserCd: string;
}

export interface DataModal {
  '0': string;
  '1': string;
  '2': string;
  '3': string;
  '4': string;
  '5': string;
  '6': string;
  '7': string;
  '8': string;
}

export interface FormatNameType {
  layCd: string;
  layNm: string;
  authPro: string;
}

export interface SearchLoadingType {
  searchLoading: boolean;
}

export interface ReportData {
  formatNameData: FormatNameType[];
  resultData: any[];
  setSearchLoading: SearchLoadingType;
}
