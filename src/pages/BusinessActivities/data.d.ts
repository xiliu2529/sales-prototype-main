import {CurrentUser} from "@/models/user";
import {AllEndUserType} from "@/pages/FormAdvancedForm/data";

export interface ArrayType {
  key:number;
  value: string;
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

export interface UserType {
  userCd: string;
  userNm: string;
  userEmail:string;
}
export interface OptionType {
  value: string;
}
export interface BusActInfoSearchParamType{
  // @ApiModelProperty(value="言語(EN_US,ZH_CN,JA,FRA)")
  language:string;
  // @ApiModelProperty(value="ユーザコード")
  userCdList:string[];
  // @ApiModelProperty(value="顧客名称")
  cstmrNm:string;
  // @ApiModelProperty(value="案件名称")
  caseNm:string;
  // @ApiModelProperty(value="組織コード")
  userOrgCdList:string[];
  // @ApiModelProperty(value="FROMに日付")
  fromDate:string;
  // @ApiModelProperty(value="TOに日付")
  toDate:string;
}
export interface BusActInfoModifyParamType {
  busActIds: string[];
}
export interface BusActInfoDeleteParamType {
  busActId: string;
  busActDtlIds:string[];
}


export interface CaseType {
  cstmrCd: number;
  caseNm: string;
  caseNo: string;
}

export interface EndUserType {
  endUserCd: string;
  endUserNm: string;
  endUserShrtNm: string;
}

export interface CodeValueType {
  cdVal: string;
  cdNm: string;
}
export interface BusActHedDtlDataType {
  subList: [];
  // @ApiModelProperty(value=" 'Staff Cd'")
  userCd: string;
  // @ApiModelProperty(value=" 'Staff名称'")
  userNm: string;
  // @ApiModelProperty(value=" '営業活動ID'")
  busActId:string;
  // @ApiModelProperty(value=" '顧客名称' ")
  cstmrNm:string;
  // @ApiModelProperty(value=" '案件名称' ")
  caseNm:string;
  // @ApiModelProperty(value=" '営業活動明細作成日時' ")
  createdDt:string;
  // @ApiModelProperty(value=" '営業者ユーザID' ")
  busUserCd:string;
  // @ApiModelProperty(value="'営業活動明細ID' ")
  busActDtlId:string;
  // @ApiModelProperty(value=" '上位営業活動ID' ")
  parBusActDtlId:string;
  // @ApiModelProperty(value=" '営業活動詳細' ")
  busActDtl:string;
  // @ApiModelProperty(value=" '添付ファイル1' ")
  addFileUrl1:string;
  // @ApiModelProperty(value=" '添付ファイル2' ")
  addFileUrl2:string;
  // @ApiModelProperty(value=" '添付ファイル3' ")
  addFileUrl3:string;
  // @ApiModelProperty(value=" '添付ファイル4' ")
  addFileUrl4:string;
  // @ApiModelProperty(value=" '添付ファイル5' ")
  addFileUrl5:string;
  // @ApiModelProperty(value=" '添付ファイル6' ")
  addFileUrl6:string;
  // @ApiModelProperty(value=" '添付ファイル7' ")
  addFileUrl7:string;
  // @ApiModelProperty(value=" '添付ファイル8' ")
  addFileUrl8:string;
  // @ApiModelProperty(value=" '添付ファイル9' ")
  addFileUrl9:string;
  // @ApiModelProperty(value=" '添付ファイル10' ")
  addFileUrl10:string;
  // @ApiModelProperty(value=" '添付ファイル名称1' ")
  addFileNm1:string;
  // @ApiModelProperty(value=" '添付ファイル名称2' ")
  addFileNm2:string;
  // @ApiModelProperty(value=" '添付ファイル名称3' ")
  addFileNm3:string;
  // @ApiModelProperty(value=" '添付ファイル名称4' ")
  addFileNm4:string;
  // @ApiModelProperty(value=" '添付ファイル名称5' ")
  addFileNm5:string;
  // @ApiModelProperty(value=" '添付ファイル名称6' ")
  addFileNm6:string;
  // @ApiModelProperty(value=" '添付ファイル名称7' ")
  addFileNm7:string;
  // @ApiModelProperty(value=" '添付ファイル名称8' ")
  addFileNm8:string;
  // @ApiModelProperty(value=" '添付ファイル名称9' ")
  addFileNm9:string;
  // @ApiModelProperty(value=" '添付ファイル10' ")
  addFileNm10:string;
  // @ApiModelProperty(value=" '階層' ")
  levels:string;
  // @ApiModelProperty(value=" 'パス' ")
  paths:string;
  // @ApiModelProperty(value=" '組織グループコード' ")
  orgGroupId:string;
}

export interface DBusActHeadDataType {
  // @ApiModelProperty(value = " '営業活動ID'")
  isCreate: false;
  dtlDataList: BusActHedDtlDataType[];
  busActId: string;
  // @ApiModelProperty(value = " '顧客名称' ")
  cstmrNm: string;
  // @ApiModelProperty(value = " 'END_USER名称' ")
  endUserNm: string;
  // @ApiModelProperty(value = " '案件名称' ")
  caseNm: string;
  strCaseCreatedDt: string;
  // @ApiModelProperty(value = " '案件作成日' ")
  caseCreatedDt: string;
  // @ApiModelProperty(value = " '状態コード' ")
  busActStsCd: string;
  // @ApiModelProperty(value = " '状態名称' ")
  cdNm: string;
  // @ApiModelProperty(value = " '組織グループコード' ")
  orgGroupId: string;
  userNm:string;
  userCd:string;
}

export interface BusActInfoUpdateParamType {
  busActId: string;
  busActDtlId: string;
  busActDtl: string;
  addFileUrl1: string;
  addFileUrl2: string;
  addFileUrl3: string;
  addFileUrl4: string;
  addFileUrl5: string;
  addFileUrl6: string;
  addFileUrl7: string;
  addFileUrl8: string;
  addFileUrl9: string;
  addFileUrl10: string;
  // @ApiModelProperty(value=" '添付ファイル名称1' ")
  addFileNm1:string;
  // @ApiModelProperty(value=" '添付ファイル名称2' ")
  addFileNm2:string;
  // @ApiModelProperty(value=" '添付ファイル名称3' ")
  addFileNm3:string;
  // @ApiModelProperty(value=" '添付ファイル名称4' ")
  addFileNm4:string;
  // @ApiModelProperty(value=" '添付ファイル名称5' ")
  addFileNm5:string;
  // @ApiModelProperty(value=" '添付ファイル名称6' ")
  addFileNm6:string;
  // @ApiModelProperty(value=" '添付ファイル名称7' ")
  addFileNm7:string;
  // @ApiModelProperty(value=" '添付ファイル名称8' ")
  addFileNm8:string;
  // @ApiModelProperty(value=" '添付ファイル名称9' ")
  addFileNm9:string;
  // @ApiModelProperty(value=" '添付ファイル10' ")
  addFileNm10:string;
}

export interface BusActDtlInsertDataType {
  //@ApiModelProperty(value="'営業活動ID'")
  busActId:string;
  //@ApiModelProperty(value="'営業活動明細ID' ")
  busActDtlId:string;
  //@ApiModelProperty(value=" '上位営業活動ID' ")
  parBusActDtlId:string;
  //@ApiModelProperty(value="'営業活動詳細' ")
  busActDtl:string;
  //@ApiModelProperty(value="'添付ファイル1' ")
  addFileUrl1:string;
  //@ApiModelProperty(value="'添付ファイル2' ")
  addFileUrl2:string;
  //@ApiModelProperty(value="'添付ファイル3' ")
  addFileUrl3:string;
  //@ApiModelProperty(value="'添付ファイル4' ")
  addFileUrl4:string;
  //@ApiModelProperty(value="'添付ファイル5' ")
  addFileUrl5:string;
  //@ApiModelProperty(value="'添付ファイル6' ")
  addFileUrl6:string;
  //@ApiModelProperty(value="'添付ファイル7' ")
  addFileUrl7:string;
  //@ApiModelProperty(value="'添付ファイル8' ")
  addFileUrl8:string;
  //@ApiModelProperty(value="'添付ファイル9' ")
  addFileUrl9:string;
  //@ApiModelProperty(value="'添付ファイル10' ")
  addFileUrl10:string;
  // @ApiModelProperty(value=" '添付ファイル名称1' ")
  addFileNm1:string;
  // @ApiModelProperty(value=" '添付ファイル名称2' ")
  addFileNm2:string;
  // @ApiModelProperty(value=" '添付ファイル名称3' ")
  addFileNm3:string;
  // @ApiModelProperty(value=" '添付ファイル名称4' ")
  addFileNm4:string;
  // @ApiModelProperty(value=" '添付ファイル名称5' ")
  addFileNm5:string;
  // @ApiModelProperty(value=" '添付ファイル名称6' ")
  addFileNm6:string;
  // @ApiModelProperty(value=" '添付ファイル名称7' ")
  addFileNm7:string;
  // @ApiModelProperty(value=" '添付ファイル名称8' ")
  addFileNm8:string;
  // @ApiModelProperty(value=" '添付ファイル名称9' ")
  addFileNm9:string;
  // @ApiModelProperty(value=" '添付ファイル10' ")
  addFileNm10:string;
  //@ApiModelProperty(value="'階層' ")
  levels:string;
  //@ApiModelProperty(value="'営業者ユーザID' ")
  busUserCd:string;
}

export interface MessageType {
  data: string;
  errcode: string;
  message: string;
}

export interface BusActData {
  customerList: CustomerType[];
  allCustomerList: AllCustomerType[];
  searchCustomerList:CustomerType[];
  userList: UserType[];
  inputUserList: UserType[];
  BusActInfoModify:BusActInfoModifyParamType;
  BusActInfoDelete:BusActInfoDeleteParamType;
  caseList: CaseType[];
  caseListEditCreate:CaseType[];
  endUserList:EndUserType[];
  allEndUserList:AllEndUserType[];
  codeValueList:CodeValueType[];
  businessActivitiesList:BusActHedDtlDataType[];
  bBusActHeadDataList:DBusActHeadDataType[];
  editDBusActHeadDataList:DBusActHeadDataType[];
  BusActInfoUpdateData:BusActInfoUpdateParamType;
  messageData: MessageType;
  busActDtlInsertDataType:BusActDtlInsertDataType;
  businessActivityDtlList:BusActHedDtlDataType[];
  userOrgInfo:CurrentUser;
  orgGroupIds:string[];
  resultFlag:boolean;
  updateCaseNmFlag:boolean;
}



