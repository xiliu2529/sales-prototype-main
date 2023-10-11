export interface FetchCaseType {
  language?: string;
  caseYear?: string;
  orgGroupId?: string;
  loginUserCd: string;
}

export interface LoadDataType {
  year: string;
  orgGroupId?: string;
  nowBusUser: string;
  busUserList: string[];
  loadDataList: any[];
}

export interface FormatNameType {
  layCd: string;
  layNm: string;
}

export interface FormatHeaderDataType {
  effDataTit: string;
  effortUnitCd: string;
  amtRt: number;
  titSta: number;
  titEnd: number;
  strdPro: string;
}

export interface FormatBudgetDataType {
  seq: string;
  title: string;
  fieldClm: string;
  groupNo: string;
  editType: string;
  width: string;
  hissuflg: string;
}

export interface UserType {
  userCd: string;
  userNmDeft: string;
  userNmJp: string;
  userNmEn: string;
  userNmCn: string;
  userNmFra: string;
}

export interface MessageType {
  data: string;
  errcode: string;
  message: string;
}

export interface ModelVisibleType {
  visible: boolean;
}

export interface SearchLoadingType {
  searchLoading: boolean;
}

export interface LoadDataLoadingType {
  loadDataLoading: boolean;
}

export interface UploadExcelData {
  formatNameData: FormatNameType[];
  formatHeaderData: FormatHeaderDataType[];
  formatBudgetData: FormatBudgetDataType[];
  sheetUserData: UserType[];
  messageData: MessageType;
  modelVisible: ModelVisibleType;

  setSearchLoading: SearchLoadingType;

  setLoadDataLoading: LoadDataLoadingType;
}
