import { Reducer, Effect } from 'umi';
import {getSendMessageInfo, sendMessage} from "@/services/sendmessage";
import {message} from "antd";
import "@/utils/messageConfig";
import {IndustryType} from "@/pages/FormAdvancedForm/data";
import {getCurrencyLst} from "@/pages/FormAdvancedForm/service";

export interface ToList {
  userCd: string;
  userNm: string;
  userEmail: string;
}

export interface SendMessageModelState {
  msgInfo: [],
  sendMessageFlag:boolean;
  currencyLst:[],

  formadvancedformFlag:boolean;
  formadvancedformEditActFlag:boolean;
  reportFlag:boolean;
  uploadExcelFlag:boolean;
  accountSettingsBaseFlag:boolean;
  accountSettingsSecurityFlag:boolean;

}

export interface MoneyModal  {
  JPY: moneyInnerModal;
  CNY: moneyInnerModal;
  USD: moneyInnerModal;
}

export interface moneyInnerModal  {
  lang:string;
  label:string;
  icon:string;
  title:string;
}


export interface SendMessageModelType {
  namespace: string;
  state: SendMessageModelState;
  effects: {
    fetchGetSendMessageInfo: Effect;
    fetchCloseSendMessageInfo: Effect;
    fetchCurrencyLst:Effect;
  };
  reducers: {
    /* changeSendMessageFlag1:Reducer<visibleModel>; */
    save:Reducer<SendMessageModelState>;
    changeSendMessageFlag:Reducer<SendMessageModelState>;
    getcurrencyLst:Reducer<IndustryType>;
    changeRightMenu:Reducer<SendMessageModelState>;
  };
}


// @ts-ignore
const SendMessageModel: SendMessageModelType = {
  namespace: 'message',

  state: {
    msgInfo:[],
    sendMessageFlag:false,

    formadvancedformFlag:false,
    formadvancedformEditActFlag:false,
    reportFlag:false,
    uploadExcelFlag:false,
    accountSettingsBaseFlag:false,
    accountSettingsSecurityFlag:false,
  },

  effects: {
    *fetchGetSendMessageInfo({ payload }, { call, put }) {
      const response = yield call(getSendMessageInfo, payload);
      yield put({
        type: 'save',
        payload:
          {msgInfo:response.data,},
      });

    },

    *fetchCloseSendMessageInfo({ payload }, { call,put }) {
      const response = yield call(sendMessage, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (response.result === true) {
        message.info(response.message.replace(/\{|}/g,''));
      }else{
        message.info(response.message.replace(/\{|}/g,''));
      }
    },
    *fetchCurrencyLst({ payload }, { call, put }) {
      const response = yield call(getCurrencyLst, payload);
      yield put({
        type: 'getcurrencyLst',
        payload: response,
      });
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  changeSendMessageFlag(state = { toList: [], customerList: [], caseList:[], sendMessageFlag:false}, { payload }): SendMessageModelState {
    return {
      ...state,
      sendMessageFlag: payload,
    };
  },
    changeRightMenu(state, { payload1,payload2,payload3,payload4,payload5,payload6 }){
      return {
        ...state,
        formadvancedformFlag:payload1.parma1,
        formadvancedformEditActFlag:payload2.parma2,
        reportFlag:payload3.parma3,
        uploadExcelFlag:payload4.parma4,
        accountSettingsBaseFlag:payload5.parma5,
        accountSettingsSecurityFlag:payload6.parma6,

      };
    },
    getcurrencyLst(state, action) {
      return {
        ...state,
        // @ts-ignore
        ...state.currencyLst,
        currencyLst: action.payload.data,
      };
    },
 }
};

export default SendMessageModel;
