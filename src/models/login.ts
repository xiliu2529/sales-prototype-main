import { stringify } from 'querystring';
import { history, Reducer, Effect } from 'umi';

import { fakeAccountLogin, fakeAccountLogout, getSystemMessage } from '@/services/login';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import {SystemMessageType} from "@/pages/user/login/components/SystemMessage/data";

export interface StateType {
  status?: 'true' | 'false';
  type?: string;
  currentAuthority?: 'user' | 'busUser' | 'sysAdmin';
  access_token?: string;
  refresh_token?: string;
  dspYear?: string;
  dspLang?: string;
  dspCurrCd?: string;
  userCode?: string;
  role:string;
}

export interface LoginModelType {
  namespace: string;
  state: StateType;
  effects: {
    login: Effect;
    logout: Effect;
    getSysMessage: Effect;
  };
  reducers: {
    changeLoginStatus: Reducer<StateType>;
    putSysMessage: Reducer<any>;
  };
}

const Model: LoginModelType = {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *getSysMessage(_, { call, put }) {
      const response = yield call(getSystemMessage);
      yield  put({
        type: 'putSysMessage',
        payload: response,
      });
    },
    *login({ payload }, { call, put }) {
      const response = yield call(fakeAccountLogin, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      // Login successfully
      if (response.status === 'true') {

        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params as { redirect: string };
        console.log('redirect是否存在redirect：',redirect);
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            console.log('跳转地址redirect：',redirect);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
              console.log('取特使符号后跳转地址redirect：',redirect);
            }
          } else {
            window.location.href = '/';
            return;
          }
        }
        history.replace(redirect || '/');
      }
    },

    *logout({ payload }, { call, put }) {
      const response = yield call(fakeAccountLogout, payload);
      yield put({
        type: 'changeLoginStatus',
        // payload: response,
        payload: {
          userInfo: response,
        },
      });
      // localStorage.setItem('access_token',"");
      sessionStorage.setItem('access_token',"");
      sessionStorage.setItem('currentYearFlag',"");
      localStorage.setItem('refresh_token',"");
      localStorage.setItem('useCd',"");
      localStorage.setItem('antd-pro-authority',"");
      const { redirect } = getPageQuery();
      // Note: There may be security issues, please note
      if (window.location.pathname !== '/user/login' && !redirect) {
        history.replace({
          pathname: '/',
          search: stringify({
            redirect: window.location.href,
          }),
        });
        history.replace({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        });
      }
    },
  },

  reducers: {
    putSysMessage(state, action) {
      const msgList : SystemMessageType[] = action.payload.data.sysMessageList;
      return {
        ...state,
        msgList,
      };
    },
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
        access_token: payload.access_token,
        refresh_token: payload.refresh_token,
        dspYear: payload.dspYear,
        dspLang: payload.dspLang,
        userCode: payload.userCode,
        dspCurrCd: payload.dspCurrCd,
        role:payload.role,
      };
    },
  },
};

export default Model;
