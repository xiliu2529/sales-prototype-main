import {BusActHead} from "@/pages/FormAdvancedForm/components/SearchActualityForecast/data";

export interface ArrayType {
  key: number;
  value: string;
}

export interface OptionType {
  value: string;
}

export interface CodeValueType {
  cdVal: string;
  cdNm: string;
}

export interface CustomerOptionType {
  lable: string;
  value: string;
  key: string;
  title: string;
}

export interface CustomerType {
  cstmrCd: number;
  cstmrNm: string;
  cstmrShrtNm: string;
}

export interface AllCustomerType {
  cstmrCd: number;
  cstmrNmDft: string;
  cstmrNmJp: string;
  cstmrNmEn: string;
  cstmrNmCn: string;
  cstmrNmFra: string;
  cstmrShrtNmJp: string;
  cstmrShrtNmEn: string;
  cstmrShrtNmCn: string;
  cstmrShrtNmFra: string;
  cstmrNm: string;
}

export interface IndustryType {
  cdVal: number;
  cdNm: string;
  cdExchVal: string;
}

export interface UserType {
  userCd: string;
  userNm: string;
}

export interface AuthOrgType {
  orgCd: string;
  orgNm: string;
}

export interface FetchUserType {
  caseYear?: string;
  authOrgCd?: string;
}

export interface FetchCaseType {
  language?: string;
  caseYear?: string;
  orgGroupId?: string;
  authOrgCd?: string;
  inputUserCd?: string;
  caseNm: string;
}

export interface FetchOrgCdType {
  language?: string;
  dspUserOrgCd?: string;
}

export interface FetchCaseNoType {
  language?: string;
  caseYear?: string;
  inputUserCd?: string;
  caseNm: string;
}

export interface CaseType {
  cstmrCd: number;
  caseNm: string;
  caseNo: string;
}
export interface SearchCaseType {
  relatedNo: string;
  caseNm: string;
  caseNo: string;
}





export interface EndUserType {
  endUserCd: string;
  endUserNm: string;
  endUserShrtNm: string;
}

export interface AllEndUserType {
  endUserCd: string;

  endUserNmDft: string;
  endUserNmJp: string;
  endUserNmEn: string;
  endUserNmCn: string;
  endUserNmFra: string;
  endUserShrtNmJp: string;
  endUserShrtNmEn: string;
  endUserShrtNmCn: string;
  endUserShrtNmFra: string;
  endUserNm: string;
}

export interface ExchType {
  exchTypes: string;
}

export interface AddCustomerType {
  language: string;
  cstmrCd: string;
  cstmrNm: string;
  loginUserCd: string;
}
export interface AddEndUserType {
  language: string;
  endUserCd: string;
  endUserNm: string;
  loginUserCd: string;
}

export interface FetchMonthNoType {
  orgGroupId?: string;
  orgId?: string;
}

export interface MonthNoType {
  monthNo: number;
}

export interface FetchBatchAddDataType {
  language?: string;
  actForYear?: string;
  periodFrom: string;
  periodTo: string;
  orgGroupId?: string;

  countOrgCd: string;
  countOrgNm: string;
  busUserCd?: string;
  busUserNm?: string;
  cstmrCd: string;
  cstmrNm: string;
  caseIndstyCd: string;
  caseIndstyNm: string;
  caseNm: string;
  caseNo: string;
  actForRankCd: string;
  actForRankNm: string;
  cntrcCurrCd: string;
  cntrcCurrNm: string;
  effortUnitCd: string;
  effortUnitNm: string;
  endUserCd: string;
  endUserNm: string;
  memo: string;
  bugtId: string;
  busActId: string;
  // relatedNo: string;
  midDataModel: midDataModel;
}

export  interface DbusActHeadDtlModel {
  key: string;
  busActId: string;
  cstmrNm: string;
  endUserNm: string;
  caseNm: string;
  caseCreatedDt: string;
  busActStsCd: string;
  cdNm: string;
  userNm: string;
}

export interface FetchBudgetDtlType {
  language?: string;
  inputUserCd?: string;
  caseYear?: string;
}

export interface RunCaseToActTopDataType {
  busUserCd?: string;
  busUserNm?: string;
  cstmrCd: string;
  cstmrNm: string;
  caseIndstyCd: string;
  caseIndstyNm: string;
  caseNm: string;
  actForRankCd: string;
  actForRankNm: string;
  aomount: string;
  cntrcCurrCd: string;
  cntrcCurrNm: string;
  effort: string;
  effortUnitCd: string;
  effortUnitNm: string;
}

export interface FetchBottomDataType {
  actForYear?: string;
  actForMoth: string;
  inputUserCd?: string;
  language?: string;
}

export interface FetchBatchEditDataType {
  actForYear?: string;
  currCdTo?: string;
  relatedNo?: string;
}

export interface FetchBatchExchRtType {
  actForYear?: string;
  currCdFroms?:[];
  actForMonths?:[];
}

export interface UpdateBottomDataParamType {
  actForIds: string;
  language?: string;
  actForYear?: string;
  actForMoth: string;
  orgGroupId?: string;

  countOrgCd: string;
  countOrgNm: string;
  busUserCd?: string;
  busUserNm?: string;
  cstmrCd: string;
  cstmrNm: string;
  actForRankCd: string;
  actForRankNm: string;
  caseIndstyCd: string;
  caseIndstyNm: string;
  caseNm: string;
  caseNo: string;
  orderAmt: string;
  cntrcCurrCd: string;
  cntrcCurrNm: string;
  effort: string;
  effortUnitCd: string;
  effortUnitNm: string;
  endUserCd: string;
  endUserNm: string;
  memo: string;
  no: string;
  relatedNo: string;
  bugtId: string;
  busActId: string;
}

export interface DeleteBottomDataParamType {
  actForIds: string[];
}

export interface CopyBottomDataParamType {
  actForInfoModelList: UpdateBottomDataParamType[];
  periodFrom: string;
  periodTo: string;
}

export interface midDataModel {
  amount1: string;
  effort1: string;
  amount2: string;
  effort2: string;
  amount3: string;
  effort3: string;
  amount4: string;
  effort4: string;
  amount5: string;
  effort5: string;
  amount6: string;
  effort6: string;
  amount7: string;
  effort7: string;
  amount8: string;
  effort8: string;
  amount9: string;
  effort9: string;
  amount10: string;
  effort10: string;
  amount11: string;
  effort11: string;
  amount12: string;
  effort12: string;
  totalAmount: string;
  totalEffort: string;
}

export interface ActBottomDataType {
  No: string;
  editable: boolean;
  checked: boolean;
  actForId: string;
  actForYear?: string;
  actForMoth: string;
  language?: string;
  lastEditedUser?: string;

  countOrgCd: string;
  countOrgNm: string;
  busUserCd?: string;
  busUserNm?: string;
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

export interface BatchEditTableData
{
  actForYear: string;
  countOrgCd: string;
  countOrgNm: string;
  busUserCd: string;
  busUserNm: string;
  cstmrCd: string;
  cstmrNm: string;
  caseIndstyCd: string;
  caseIndstyNm: string;
  caseNm: string;
  caseNo: string;
  endUserCd: string;
  endUserNm: string;
  relatedNo: string;
  bugtId: string;
  busActId: string;
  totalAmount: string;
  valideCount: string;
  totalEffort: string;
  totalAmountUnit: string;
  totalEffortUnit: string;
  // editable: boolean;
  actForBatchEditSalesVoList:SalesDataModel[],
  exchRtInfoVoList:ExchRtModel[],
}

export interface ExchRtModel {
  exchRt: string;
  currCdFrom: string;
  currCdTo: string;
  actvStartDt: string;
  actvEndDt: string;
}


export interface SalesDataModel {
  actForId: string;
  actForMothTitle: string;
  actForMoth: string;
  actForRankCd: string;
  actForRankNm: string;
  orderAmt: string;
  cdExchValFrom: string;
  cdExchValTo: string;
  cntrcCurrCd: string;
  cntrcCurrNm: string;
  changedOrderAmt: string;
  changedCntrcCurrCd: string;
  changedCntrcCurrNm: string;
  effort: string;
  effortUnitCd: string;
  effortUnitNm: string;
  exchRt: string;
  memo: string;
}

export interface MessageType {
  data: string;
  result: string;
  errcode: string;
  message: string;
}
export interface DBudgetDtlType {
  key:string;
  bugtId:string;
  bugtYear:string;
  busUserCd:string;
  userNm:string;
  rak:string;
  newOld:string;
  saleDes:string;
  ankName:string;
  countOrgCd:string;
  projId:string;
  currCd:string;
  price:string;
  effortUnitCd:string;
  effort1:string;
  amt1:string;
  effort2:string;
  amt2:string;
  effort3:string;
  amt3:string;
  effort4:string;
  amt4:string;
  effort5:string;
  amt5:string;
  effort6:string;
  amt6:string;
  effort7:string;
  amt7:string;
  effort8:string;
  amt8:string;
  effort9:string;
  amt9:string;
  effort10:string;
  amt10:string;
  effort11:string;
  amt11:string;
  effort12:string;
  amt12:string;
  defaultChecked: boolean;
}
export interface DBusActDtl {
  key:number;
  checked:boolean;
  editable:boolean;
  busActId:string;
  cstmrNm:string;
  endUserNm:string;
  caseNm:string;
  strCaseCreatedDt:string;
  caseCreatedDt:string;
  busActStsCd:string;
  busUserCd:string;
  cdNm:string;
  userNm:string;
}

export interface ActualityForecastBatchAddStates {
  current: number;
  clickable:boolean;
  bugtId: string;
  busActId: string;
  btnStatus: boolean,
  // eslint-disable-next-line react/no-unused-state
  countOrgCd: string;
  countOrgNm: string;
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
  cntrcCurrCd: string;
  cntrcCurrNm: string;
  effortUnitCd: string;
  effortUnitNm: string;
  endUserCd: string;
  endUserNm: string;
  memo: string;

  periodFrom: string;
  periodTo: string;
  optionValue: string;
  amount: string;
  effort: string;

  // eslint-disable-next-line react/no-unused-state
  MidDataModel: ActForecastMidDataModel,

  runToActDataUpdate: boolean,

  searchLoading: boolean,
  notEnterTip: string;
  caseNumsValue: CaseType[],
  // selectedRowKeys: [],
}

export interface ActForecastMidDataModel {
  amount1: string;
  effort1: string;
  amount2: string;
  effort2: string;
  amount3: string;
  effort3: string;
  amount4: string;
  effort4: string;
  amount5: string;
  effort5: string;
  amount6: string;
  effort6: string;
  amount7: string;
  effort7: string;
  amount8: string;
  effort8: string;
  amount9: string;
  effort9: string;
  amount10: string;
  effort10: string;
  amount11: string;
  effort11: string;
  amount12: string;
  effort12: string;
  totalAmount: string;
  totalEffort: string;
}

export interface ActForecastTopData {
  userLst: UserType[];
  searchUserLst: UserType[];
  authOrgCdLst: AuthOrgType[];
  customerLst: CustomerType[];
  allCustomerLst: AllCustomerType[];
  industryLst: IndustryType[];
  caseLst: [];
  ExchLst: [],
  caseNumberLst: CaseType[];
  probabilityLst: IndustryType[];
  currencyLst: IndustryType[];
  effortUnitLst: IndustryType[];
  endUserLst: EndUserType[];
  codeValueList: CodeValueType[];
  allEndUserLst: AllEndUserType[];
  remarksLst: ArrayType[];
  ActBottomData: ActBottomDataType[];
  messageData: MessageType;
  modelVisible: ModelVisibleType;

  setSearchLoading: SearchLoadingType;
  getMonthNo: MonthNoType;
  budgetOrHistDataList: [];
  batchEditTableData: BatchEditTableData;
  periodFrom: string;
  copyModelVisible: boolean;
  moveModelVisible: boolean;
  dBudgetDtlDataList: DBudgetDtlType[];
  dBusActDtlList: DBusActDtl[];
  budActFlg: string;
  busActHead:BusActHead;
  searchBatchData:SearchCaseType[];
  parOrgCdLst: ParOrgType[];
  actForMonthSummaryVo: ActForMonthSummaryVo;
}

export interface ParOrgType {
  orgCd: string;
  userCd: string;
  parOrgCd: string;
}

export interface SearchLoadingType {
  searchLoading: boolean;
}

export interface ModelVisibleType {
  topModelVisible: boolean;
  bottomModelVisible: boolean;
  runModelVisible: boolean;
  batchEditVisible: boolean;
}
export interface ActForBatchEditModel {
  actForYear: string;
  busUserCd: string;
  busUserNm: string;
  caseIndstyCd: string;
  caseIndstyNm: string;
  caseNm: string;
  caseNo: string;
  countOrgCd: string;
  countOrgNm: string;
  cstmrCd: string;
  cstmrNm: string;
  endUserCd: string;
  endUserNm: string;
  orgGroupId: string;
  relatedNo: string;
  actForBatchEditSalesModelList: ActForBatchEditSalesModel[];
}
export interface ActForMonthSummarySalesVo{
  actForMoth: string;
  amount: string;
  effort: string;
}
export interface ActForMonthSummaryVo {
  cntrcCurrCd: string;
  cntrcCurrNm: string;
  effortUnitCd: string;
  effortUnitNm: string;
  title: string;
  totalAmount: string;
  totalEffort: string;
  salesVos: ActForMonthSummarySalesVo[];
}

export interface ActForBatchEditSalesModel {
  changedOrderAmt: string;
  effort: string;
  orderAmt: string;
  exchRt: string;
  actForId: string;
  actForMoth: string;
  actForRankCd: string;
  actForRankNm: string;
  cdExchValFrom: string;
  cdExchValTo: string;
  changedCntrcCurrCd: string;
  changedCntrcCurrNm: string;
  cntrcCurrCd: string;
  cntrcCurrNm: string;
  effortUnitCd: string;
  effortUnitNm: string;
  memo: string;
}

export interface FetchBatchSaveDateType {
  relatedNo: string;
  bugtId: string;
  busActId: string;
}

export interface BusActHead {
  cstmrNm: string;
  caseNm: string;
  caseCreatedDt: string;
  busUserCd: string;
  busUserNm: string;
}

export interface FetchActForeCaseMonthSummaryType {
  actForYear: string;
  cntrcCurrCd: string;
  cstmrCd?: string;
  endUserCd?: string;
  oncust:boolean;

}