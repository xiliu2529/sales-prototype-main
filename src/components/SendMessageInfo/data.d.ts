export interface SendMessageModel {
  to: string;
  toName:string;
  customerName: string;
  caseNm:string;
  from:string;
  loginUserCd:string;
  message:string;
  msgId:string;
  email:string;
  orgGroupId:string;
  caseYear:string;
  inputUserCd:string;
  authOrgCd:string;
}
export interface SendMessageInfo {
  toList: ToList[],
  customerList:[],
  caseList:[],
}

export interface visibleModel {
  sendMessageFlag1:boolean;
}

export interface ToList {
  userCd: string;
  userNm: string;
  userEmail: string;
}
