import { Effect, Reducer } from 'umi';

import {queryCurrent, query as queryUsers, fakeAccountForgetPass} from '@/services/user';
import {message} from "antd";
import "@/utils/messageConfig";


export interface CurrentUser {
  avatar?: string;
  name?: string;
  title?: string;
  group?: string;
  signature?: string;
  tags?: {
    key: string;
    label: string;
  }[];
  userid?: string;
  unreadCount?: number;
  access_token?: string;
  dspCurrCd?: string;
  userDiv?: string;
  dspLang?: string;
  dspYear?: string;
  authOrgCds?: string;
  dspUserOrgCd?: string;
  orgVos?:[];
  orgGroupId?: string;
  inputUserCds: string;
  role:string;
  currentUserOrgCd:string;
  menuInfoVos?:MenuInfo[];
}

export interface MenuInfo {
  menuCd?: string;
  menuNm?: string;
  menuIcon?: string;
  levels?: string;
  parMenuCd?: string;
  menuDspSeq?: string;
}

export interface UserModelState {
  currentUser?: CurrentUser;
}

export interface UserModelType {
  namespace: 'user';
  state: UserModelState;
  effects: {
    fetch: Effect;
    fetchCurrent: Effect;
    forgetPassWord:Effect;
  };
  reducers: {
    saveCurrentUser: Reducer<UserModelState>;
    changeNotifyCount: Reducer<UserModelState>;
  };
}

const UserModel: UserModelType = {
  namespace: 'user',

  state: {
    currentUser: {},
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        payload: response.data,
      });
    },
    * forgetPassWord({payload}, {call, put}) {
      const response = yield call(fakeAccountForgetPass, payload);
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
  },

  reducers: {
    clear(state, action) {
      return {
        ...state,
        currentUser:  {},
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    changeNotifyCount(
      state = {
        currentUser: {},
      },
      action,
    ) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};

export default UserModel;
