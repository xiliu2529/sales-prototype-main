import { Reducer, Effect } from 'umi';
import {CaseType, CustomerType, RunningCaseData, RunningCaseDateType,SearchLoadingType} from './data';
import {
  getCaseLst,
  getCustomerLst,
  getDivisionLst,
  getRunCaseData,
  deleteRunCaseData,
  insertRunCaseData,
  updateRunCaseData,
  getAllCustomerLst
} from "./service";
import {message} from "antd";
import {IndustryType, MessageType, } from "@/pages/FormAdvancedForm/data";
import "@/utils/messageConfig";

export interface ModelType {
  namespace: string;
  state: RunningCaseData;
  effects: {
    fetchCustomerLst: Effect;
    fetchAllCustomerLst: Effect;
    fetchCaseLst: Effect;
    fetchDivisionLst: Effect;
    getRunCaseData: Effect;
    insertRunCaseData: Effect
    deleteRunCaseData: Effect;
    updateRunCaseData: Effect;
  };
  reducers: {
    CustomerLst: Reducer<CustomerType>;
    AllCustomerLst: Reducer<CustomerType>;
    CaseLst: Reducer<CaseType>;
    DivisionLst: Reducer<IndustryType>;
    RunCaseData: Reducer<RunningCaseDateType>;
    InsertRunCaseData: Reducer<MessageType>;
    UpdateRunCaseData: Reducer<MessageType>;

    SetSearchLoadingTrue: Reducer<SearchLoadingType>;
    SetSearchLoadingFalse: Reducer<SearchLoadingType>;

    clear: Reducer<RunningCaseData>;
  };
}

const initState = {
  runCaseData: [],
  customerLst: [],
  AllCustomerLst: [],
  caseLst: [],
  divisionLst: [],

  setSearchLoading: {
    searchLoading: true,
  },
};

const Model: ModelType = {
  namespace: 'runCaseData',

  state: initState,

  effects: {
    *fetchCustomerLst({ payload }, { call, put }) {
      const response = yield call(getCustomerLst, payload);
      yield put({
        type: 'CustomerLst',
        payload: response,
      });
      if(response.result === false){
        message.error(response.message);
      }

      yield put({
        type: 'SetSearchLoadingFalse',
      });
    },

    *fetchAllCustomerLst({ payload }, { call, put }) {
      const response = yield call(getAllCustomerLst, payload);
      yield put({
        type: 'AllCustomerLst',
        payload: response,
      });
      if(response.result === false){
        message.error(response.message);
      }

      yield put({
        type: 'SetSearchLoadingFalse',
      });
    },

    *fetchCaseLst({ payload }, { call, put }) {
      const response = yield call(getCaseLst, payload);
      yield put({
        type: 'CaseLst',
        payload: response,
      });
      if(response.result === false){
        message.error(response.message);
      }

      yield put({
        type: 'SetSearchLoadingFalse',
      });
    },

    *fetchDivisionLst({ payload }, { call, put }) {
      const response = yield call(getDivisionLst, payload);
      yield put({
        type: 'DivisionLst',
        payload: response,
      });

      yield put({
        type: 'SetSearchLoadingFalse',
      });
    },

    *getRunCaseData({ payload }, { call, put }) {

      yield put({
        type: 'SetSearchLoadingTrue',
      });

      const response = yield call(getRunCaseData, payload);
      yield put({
        type: 'RunCaseData',
        payload: response,
      });
      if(response.result === false){
        message.error(response.message);
      }

      yield put({
        type: 'SetSearchLoadingFalse',
      });
    },

    *deleteRunCaseData({ payload, payload1 }, { call, put }) {
      yield put({
        type: 'SetSearchLoadingTrue',
      });

      const response = yield call(deleteRunCaseData, payload);
      yield put({
        type: 'DeleteRunCaseData',
        payload: response,
      });
      const response1 = yield call(getRunCaseData, payload1);
      yield put({
        type: 'RunCaseData',
        payload: response1,
      });
      if (response.result === true) {
        message.info(response.message);
      }else{
        message.error(response.message);
      }

      yield put({
        type: 'SetSearchLoadingFalse',
      });
    },

    *insertRunCaseData({ payload, payload1 }, { call, put }) {
      yield put({
        type: 'SetSearchLoadingTrue',
      });

      const response = yield call(insertRunCaseData, payload);
      yield put({
        type: 'InsertRunCaseData',
        payload: response,
      });
      const response1 = yield call(getRunCaseData, payload1);
      yield put({
        type: 'RunCaseData',
        payload: response1,
      });
      if (response.result === true) {
        message.info(response.message);
      }else{
        message.error(response.message);
      }

      yield put({
        type: 'SetSearchLoadingFalse',
      });
    },

    *updateRunCaseData({ payload, payload1 }, { call, put }) {
      yield put({
        type: 'SetSearchLoadingTrue',
      });

      const response = yield call(updateRunCaseData, payload);
      yield put({
        type: 'UpdateRunCaseData',
        payload: response,
      });
      const response1 = yield call(getRunCaseData, payload1);
      yield put({
        type: 'RunCaseData',
        payload: response1,
      });
      if (response.result === true) {
        message.info(response.message);
      }else{
        message.error(response.message);
      }

      yield put({
        type: 'SetSearchLoadingFalse',
      });
    },


  },

  reducers: {
    CustomerLst(state, action) {
      return {
        ...state,
        // @ts-ignore
        ...state.customerLst,
        customerLst: action.payload.data,
      };
    },

    AllCustomerLst(state, action) {
      return {
        ...state,
        // @ts-ignore
        ...state.allCustomerLst,
        allCustomerLst: action.payload.data,
      };
    },

    CaseLst(state, action) {
      return {
        ...state,
        // @ts-ignore
        ...state.caseLst,
        caseLst: action.payload.data,
      };
    },
    DivisionLst(state, action) {
      return {
        ...state,
        // @ts-ignore
        ...state.divisionLst,
        divisionLst: action.payload.data,
      };
    },
    RunCaseData(state, action) {
      return {
        ...state,
        // @ts-ignore
        ...state.runCaseData,
        runCaseData: action.payload.data,
      };
    },
    InsertRunCaseData(state, action) {
      const { data } = action.payload;
      const { errcode } = action.payload;
      const msg = action.payload.message;
      const messageData: MessageType = {
        data,
        errcode,
        message: msg,
      };
      return {
        ...state,
        // @ts-ignore
        ...state.messageData,
        messageData,
      };
    },
    UpdateRunCaseData(state, action) {
      const { data } = action.payload;
      const { errcode } = action.payload;
      const msg = action.payload.message;
      const messageData: MessageType = {
        data,
        errcode,
        message: msg,
      };
      return {
        ...state,
        // @ts-ignore
        ...state.messageData,
        messageData,
      };
    },

    SetSearchLoadingTrue(state) {
      const searchLoading = true;
      const setSearchLoading: SearchLoadingType = {
        searchLoading,
      } ;
      return{
        ...state,
        // @ts-ignore
        ...state.setSearchLoading,
        setSearchLoading,
      }
    },

    SetSearchLoadingFalse(state) {
      const searchLoading = false;
      const setSearchLoading: SearchLoadingType = {
        searchLoading,
      } ;
      return{
        ...state,
        // @ts-ignore
        ...state.setSearchLoading,
        setSearchLoading,
      }
    },

    clear() {
      return initState;
    },
  },
};

export default Model;
