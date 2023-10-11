import { Effect, Reducer } from 'umi';

// eslint-disable-next-line import/named
import {
  budgetOrHistData, customerData,
  custOrEndUserData, endUserData,
  gaugeData, graphData,
  mainGraphLeft,

   memberData,
  salesData, settingData, settingRefreshData
} from './service';


export interface EchartsState {
  analysisData?: [];
  graphData?:[]
  mainGraphLeft?:[];
  augeDataList?:[];
  budgetOrHistDataList?:[];
  customerDataList?:undefined|[];
  endUserDataList?:[];
  memberDataList?:[];
  transferDataList?:[];
  settingData?:[];
}
export interface ModelType {
  namespace: string;
  state: EchartsState;
  effects: {
    fetch: Effect;
    fetchMainGraphLeft:Effect;


    fetchBudgetOrHistData:Effect;
    fetchCustomerData:Effect;
    fetchGraph:Effect;
    fetchSettingData:Effect;
    fetchSettingRefreshData:Effect;
    fetchEndUserData:Effect;
    fetchMemberData:Effect;

  };
  reducers: {
    save: Reducer<EchartsState>;
    clear: Reducer<EchartsState>;
  };
}

const initState={
  analysisData: undefined,
  graphData:undefined,
  mainGraphLeft:undefined,
  augeDataList: undefined,
  budgetOrHistDataList:undefined,
  customerDataList:undefined,
  endUserDataList:undefined,
  memberDataList:undefined,
  transferDataList:undefined,
}
const Model: ModelType = {
  namespace: 'homePage',

  state: initState,

  effects: {
    * fetch({ payload }, { call, put }) {
      const response = yield call(salesData,payload);
      yield put({
        type: 'save',
        payload: { 
          analysisData: response.data,
        },
      });
    },
    * fetchGraph({ payload }, { call, put }) {
      const response = yield call(graphData,payload);
      yield put({
        type: 'save',
        payload: {
          graphData: response.data,
        },
      });
    },
    * fetchSettingData({ payload }, { call, put }) {
      const response = yield call(settingData,payload);
      yield put({
        type: 'save',
        payload: {
          settingData: response.data,
        },
      });
    },
    * fetchSettingRefreshData({ payload }, { call, put }) {
      const response = yield call(settingRefreshData,payload);
      yield put({
        type: 'save',
        payload: {
          settingRefreshData: response,
        },
      });
    },
    // eslint-disable-next-line consistent-return
    *fetchMainGraphLeft({ payload }, { call, put }) { 
      const response = yield call(mainGraphLeft,payload);
      yield put({
        type: 'save',
        payload: {
          mainGraphLeft: response.data,
        },
      });
    },
   
    *fetchBudgetOrHistData({ payload }, { call, put }) {
      const response = yield call(budgetOrHistData,payload);
      yield put({
        type: 'save',
        payload: {
          budgetOrHistDataList: response.data,
        },
      });

    },
    *fetchCustomerData({ payload }, { call, put }) {
      const response = yield call(customerData,payload);
      yield put({
        type: 'save',
        payload: {
          customerDataList: response.data,
        },
      });
    },
    *fetchEndUserData({ payload }, { call, put }) {
      const response = yield call(endUserData,payload);
      yield put({
        type: 'save',
        payload: {
          endUserDataList: response.data,
        },
      });
    },
    *fetchMemberData({ payload }, { call, put }) {
      const response = yield call(memberData,payload);
      yield put({
        type: 'save',
        payload: {
          memberDataList: response.data,
        },
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
    clear() {
      return initState;
    },
  },
};

export default Model;
