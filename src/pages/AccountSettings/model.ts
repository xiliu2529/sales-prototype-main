import { Effect, Reducer } from 'umi';
import { CurrentUser, Customer, GeographicItemType } from './data.d';
import {
  queryCity,
  queryCurrent,
  queryProvince,
  query as queryUsers,
  queryCurrentMain,
  changePassWord,
  changeEmail, changeDspYear
} from './service';
import {message} from "antd";
import {SendMessageModelState} from "@/models/sendmessage";
import "@/utils/messageConfig";

export interface ModalState {
  customer?: Partial<Customer>;
  currentUser?: Partial<CurrentUser>;
  province?: GeographicItemType[];
  city?: GeographicItemType[];
  isLoading?: boolean;
  updateYear?:[];
  dspYearFlag:boolean;
}

export interface ModelType {
  namespace: string;
  state: ModalState;
  effects: {
    fetchCurrentInfo: Effect;
    fetchChangePass:Effect;
    fetchChangeEmail:Effect;
    fetchChangeDspYear:Effect;
    fetch: Effect;
    fetchProvince: Effect;
    fetchCity: Effect;
    fetchCurrentMain:Effect;
  };
  reducers: {
    save:Reducer<ModalState>;
    saveCurrentUser: Reducer<ModalState>;
    changeNotifyCount: Reducer<ModalState>;
    setProvince: Reducer<ModalState>;
    setCity: Reducer<ModalState>;
    changeLoading: Reducer<ModalState>;
    effectDspYearFlag: Reducer<ModalState>;
  };
}


const Model: ModelType = {
  namespace: 'accountSettings',

  state: {
    customer: {},
    currentUser: {},
    province: [],
    city: [],
    isLoading: false,
    updateYear:[],
    dspYearFlag:false,
  },
// @ts-ignore
  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    // 个人设定中的信息取得
    *fetchCurrentInfo({ payload }, { call, put }) {
      const response = yield call(queryCurrent,payload);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },
    // 修改密码
    *fetchChangePass({ payload }, { call, put }) {
      const response = yield call(changePassWord,payload);
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
    // 修改email
    *fetchChangeEmail({ payload }, { call, put }) {
      const response = yield call(changeEmail,payload);
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
    // 修改表示年
    *fetchChangeDspYear({ payload }, { call, put }) {
      const response = yield call(changeDspYear,payload);
      yield put({
        type: 'save',
        payload:
          { dspYearFlag: response}
      });
      if (response.result === true) {
        message.info(response.message.replace(/\{|}/g,''));
        yield put({
          type: 'effectDspYearFlag',
          payload: true
        });
      }else{
        message.info(response.message.replace(/\{|}/g,''));
        yield put({
          type: 'effectDspYearFlag',
          payload: false
        });
      }
    },

    *fetchProvince(_, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryProvince);
      yield put({
        type: 'setProvince',
        payload: response,
      });
    },
    *fetchCity({ payload }, { call, put }) {
      const response = yield call(queryCity, payload);
      yield put({
        type: 'setCity',
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
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload.data || {},
      };
    },
    changeNotifyCount(state = {}, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
    setProvince(state, action) {
      return {
        ...state,
        province: action.payload,
      };
    },
    setCity(state, action) {
      return {
        ...state,
        city: action.payload,
      };
    },
    changeLoading(state, action) {
      return {
        ...state,
        isLoading: action.payload,
      };
    },
    effectDspYearFlag(state = { currentUser: [], province: [], city:[], isLoading:false,updateYear:[],dspYearFlag:false}, { payload }): ModalState {
      return {
        ...state,
        dspYearFlag: payload,
      };
    },

  },
};

export default Model;
