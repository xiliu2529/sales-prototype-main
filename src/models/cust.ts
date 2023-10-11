import { Effect, Reducer } from 'umi';
import {queryCustomerInfo} from '@/services/cust';
import "@/utils/messageConfig";

//顧客データ
export interface Customer{
  custTreeData?: [];
  authOrgCds?: [];
}

export interface CustomerModelState {
    customer?: Customer;
}

export interface CustomerModelType {
  namespace: 'cust';
  state: CustomerModelState;
  effects: {
    fetch: Effect;
    fetchCustomer: Effect;
  };
  reducers: {
    saveCustomerInfo: Reducer<CustomerModelState>;
  };
}

const CustomerModel: CustomerModelType = {
  namespace: 'cust',

  state: {
    customer: {},
  },

  effects: {
    *fetchCustomer(_, { call, put }) {
      const response = yield call(queryCustomerInfo);
      yield put({
        type: 'saveCustomerInfo',
        payload: response.data,
      });
    },
  },

  reducers: {
    clear(state, action) {
      return {
        ...state,
        customer:  {},
      };
    },
    saveCustomerInfo(state, action) {
      return {
        ...state,
        customer: action.payload || {},
      };
    },

  },
};

export default CustomerModel;
