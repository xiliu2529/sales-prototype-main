import { Subscription, Reducer, Effect } from 'umi';

import { NoticeIconData } from '@/components/NoticeIcon';
import {
  deleteMessageBox,
  deleteSendMessageBox,
  queryCurrent,
  queryNotices,
  queryOrgInfo,
  readNotices
} from '@/services/user';

import {
  queryCustomerInfo,
} from '@/services/cust';

import { ConnectState } from './connect.d';
import { message } from "antd";
import "@/utils/messageConfig";

export interface NoticeItem extends NoticeIconData {
  id: string;
  type: string;
  status: string;
}
export interface SelectMenuItem {
  selectedKeys: string;
  selectedIndex: string;
  selectedName: string;
  selectMenuData: object;
  path: string;
  pathParam: string,
  selectChildrenMenuData: SelectMenuItem[];
}
export interface SelectUserNmItem {
  userCd?: string;
  userNm?: string;
  custCstmrCd: string;
  custCstmrNm: string;
}
export interface SelectCupNmItem {
  custCstmrCd: string;
  custCstmrNm: string;
}


export interface GlobalModelState {
  oncust: boolean;
  collapsed: boolean;
  selectCollapsed: boolean;
  selectLeftMenu: boolean;
  baseMenuFlag: boolean;
  notices: NoticeItem[];
  /* Menu 控制用   */
  selectMenu: SelectMenuItem[];
  homePageMenu: SelectMenuItem[];
  orgInfoList: [];
  userInfoList: [];
  userOrgInfoList: {};
  customerList: [];
  selectCupName: SelectCupNmItem[];
  selectUserName: SelectUserNmItem[];
  selectKey: string;
  dialogBoxFlag: boolean;
  dialogBoxModeShowFlag: boolean;
  inForceFlag: boolean;
  newCloseFlag: boolean;
  disableButton: boolean;
  saveButtonFlag: boolean;
  editorMarkDownFlag: boolean;
  uploadFileFlag: boolean;
  editAddFlag: boolean;
  topVisible: boolean;
}

export interface GlobalModelType {
  namespace: 'global';
  state: GlobalModelState;
  effects: {
    fetchNotices: Effect;
    clearNotices: Effect;
    changeNoticeReadState: Effect;
    fetchOrgData: Effect;
    fetchUserData: Effect;
    fetchRead: Effect;
    deleteSendMessageBox: Effect;
    deleteMessageBox: Effect;
    fetchCustomerData: Effect;
  };
  reducers: {
    changeSelectStatus: Reducer<GlobalModelState>;
    changeLayoutCollapsed: Reducer<GlobalModelState>;
    changeSelectCollapseOrg: Reducer<GlobalModelState>;
    saveNotices: Reducer<GlobalModelState>;
    saveMenus: Reducer<GlobalModelState>;
    saveClearedNotices: Reducer<GlobalModelState>;
    changeSelectMenu: Reducer<GlobalModelState>;
    selectUserNameMenu: Reducer<GlobalModelState>;
    saveOrgInfo: Reducer<GlobalModelState>;
    saveCustomerInfo: Reducer<GlobalModelState>;
    saveUserInfo: Reducer<GlobalModelState>;
    setUserOrgInfoList: Reducer<GlobalModelState>;
    saveCustomerInfoList: Reducer<GlobalModelState> 
    displayBaseMenuFlag: Reducer<GlobalModelState>;
    readNotices: Reducer<GlobalModelState>;
    selectHomePageMenu: Reducer<GlobalModelState>
    dialogBoxFlag: Reducer<GlobalModelState>;
    dialogBoxModeShowFlag: Reducer<GlobalModelState>;
    inForceFlag: Reducer<GlobalModelState>;
    newCloseFlag: Reducer<GlobalModelState>;
    disableButton: Reducer<GlobalModelState>;
    saveButtonFlag: Reducer<GlobalModelState>;
    editorMarkDownFlag: Reducer<GlobalModelState>;
    uploadFileFlag: Reducer<GlobalModelState>;
    topVisible: Reducer<GlobalModelState>;
    editAddFlag: Reducer<GlobalModelState>
  };
  subscriptions: { setup: Subscription };
}

const GlobalModel: GlobalModelType = {
  namespace: 'global',

  state: {
    orgInfoList: [],
    selectCollapsed: false,
    oncust: false,
    collapsed: false,
    baseMenuFlag: false,
    selectLeftMenu: false,
    notices: [],
    selectMenu: [],
    saveUserInfo: [],
    selectUserName: [],
    homePageMenu: [],
    dialogBoxFlag: false,
    dialogBoxModeShowFlag: false,
    inForceFlag: false,
    newCloseFlag: false,
    disableButton: false,
    saveButtonFlag: false,
    editorMarkDownFlag: false,
    uploadFileFlag: false,
    editAddFlag: false,
    topVisible: false,
  },

  effects: {
    *fetchNotices({ payload }, { call, put, select }) {
      /*    yield put({
            type: 'saveNotices',
            payload: [],
          }); */
      const data = yield call(queryNotices, payload);
      yield put({  
        type: 'saveNotices',  
        payload: data.data,   
      });
       /* const unreadCount: number = yield select(
        (state: ConnectState) => state.global.notices.filter((item) => !item.read).length,
      );
      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: data.length,
          unreadCount,
        },
      }); */
    
    },
    *fetchRead({ payload }, { call, put }) {
      const data = yield call(readNotices, payload);
      yield put({
        type: 'readNotices',
        payload: data,
      });
      if (data.result === false) {
        message.info(data.message.replace(/\{|}/g, ''));
      }
    },
    *deleteSendMessageBox({ payload }, { call, put }) {
      const data = yield call(deleteSendMessageBox, payload);
      yield put({
        type: 'readNotices',
        payload: data,
      });
      if (data.result === false) {
        message.info(data.message.replace(/\{|}/g, ''));
      }
    },
    *deleteMessageBox({ payload }, { call, put }) {
      const data = yield call(deleteMessageBox, payload);
      yield put({
        type: 'readNotices',
        payload: data,
      });
      if (data.result === false) {
        message.info(data.message.replace(/\{|}/g, ''));
      }
    },

    *clearNotices({ payload }, { put, select }) {
      yield put({
        type: 'saveClearedNotices',
        payload,
      });
      const count: number = yield select((state: ConnectState) => state.global.notices.length);
      const unreadCount: number = yield select(
        (state: ConnectState) => state.global.notices.filter((item) => !item.read).length,
      );
      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: count,
          unreadCount,
        },
      });
    },
    *changeNoticeReadState({ payload }, { put, select }) {
      const notices: NoticeItem[] = yield select((state: ConnectState) =>
        state.global.notices.map((item) => {
          const notice = { ...item };
          if (notice.id === payload) {
            notice.read = true;
          }
          return notice;
        }),
      );

      yield put({
        type: 'saveNotices',
        payload: notices,
      });

      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: notices.length,
          unreadCount: notices.filter((item) => !item.read).length,
        },
      });
    },
    /**
     *  組織コードを取得
     * @param payload
     * @param call
     * @param put
     * @param select
     */
    *fetchOrgData({ payload, displayDate }, { call, put, select }) {
      const data = yield call(queryOrgInfo, payload, displayDate);
      yield put({
        type: 'saveOrgInfo',
        payload: data.data,
      });
    },
    /**
     *  userを取得
     * @param payload
     * @param call
     * @param put
     * @param select
     */
    *fetchUserData({ }, { call, put, select }) {
      const data = yield call(queryCurrent);
      console.log('global是否调用fetchUserData',);
      yield put({
        type: 'saveUserInfo',
        payload: data.data,
      });
    },

    *fetchCustomerData({ }, { call, put, select }) {
      const data = yield call(queryCustomerInfo);
      yield put({
        type: 'saveCustomerInfo',
        payload: data.data,
      });
    }
  },


  reducers: {
    clear(state, action) {
      return {
        ...state,
        selectMenu: [],
      };
    },
    changeSelectStatus(state = { notices: [], selectMenu: [], selectUserName: [], collapsed: true, oncust: false }, { payload }): GlobalModelState {
      return {
        ...state, 
        oncust: payload,
      };
    },


    changeSelectCollapseOrg(state = { notices: [], selectMenu: [], selectUserName: [], collapsed: true, selectCollapsed: false }, { payload }): GlobalModelState {
      return {
        ...state,
        selectCollapsed: payload,
      };
    },
   
    changeLayoutCollapsed(state = { notices: [], selectMenu: [], selectUserName: [], collapsed: true, selectCollapsed: false }, { payload }): GlobalModelState {
      return {
        ...state,
        collapsed: payload,
      };
    },
    changeSelectMenu(state = { notices: [], selectMenu: [], selectUserName: [], collapsed: true, selectCollapsed: false }, { payload }): GlobalModelState {
      return {
        ...state,
        selectMenu: payload,
      };
    },
    selectUserNameMenu(state = { notices: [], selectMenu: [], selectUserName: [], collapsed: true, selectCollapsed: false }, { payload }): GlobalModelState {
      return {
        ...state,
        selectUserName: payload,
      };
    },
    selectHomePageMenu(state = { notices: [], selectMenu: [], selectUserName: [], homePageMenu: [], collapsed: true, selectCollapsed: false }, { payload }): GlobalModelState {
      return {
        ...state,
        homePageMenu: payload,
      };
    },
    dialogBoxFlag(state = { notices: [], selectMenu: [], selectUserName: [], homePageMenu: [], collapsed: true, selectCollapsed: false, dialogBoxFlag: false }, { payload }): GlobalModelState {
      return {
        ...state,
        dialogBoxFlag: payload,
      };
    },
    dialogBoxModeShowFlag(state = { notices: [], selectMenu: [], selectUserName: [], homePageMenu: [], collapsed: true, selectCollapsed: false, dialogBoxFlag: false, dialogBoxModeShowFlag: false }, { payload }): GlobalModelState {
      return {
        ...state,
        dialogBoxModeShowFlag: payload,
      };
    },
    
    saveNotices(state, { payload }): GlobalModelState {
      return {
        ...state,
        /*   collapsed: false,
           selectCollapsed: false, */
        notices: payload,
      };
    },

    readNotices(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },

    saveMenus(state, { payload }): GlobalModelState {
      return {
        collapsed: false,
        selectCollapsed: false,
        ...state,
        selectMenu: payload,
      };
    },
    saveClearedNotices(state = { notices: [], selectMenu: [], collapsed: true, selectCollapsed: false }, { payload }): GlobalModelState {
      return {
        ...state,
        collapsed: false,
        notices: state.notices.filter((item): boolean => item.type !== payload),
      };
    },

    displayBaseMenuFlag(state = { notices: [], selectMenu: [], collapsed: true, selectCollapsed: false, baseMenuFlag: false, inForceFlag: false, newCloseFlag: false, disableButton: false, saveButtonFlag: false, uploadFileFlag: false, editorMarkDownFlag: false }, { payload }): GlobalModelState {
      return {
        ...state,
        baseMenuFlag: payload,
      };
    },
    inForceFlag(state = { notices: [], selectMenu: [], collapsed: true, selectCollapsed: false, baseMenuFlag: false, inForceFlag: false, newCloseFlag: false, disableButton: false, saveButtonFlag: false, uploadFileFlag: false, editorMarkDownFlag: false }, { payload }): GlobalModelState {
      return {
        ...state,
        inForceFlag: payload,
      };
    },
    newCloseFlag(state = { notices: [], selectMenu: [], collapsed: true, selectCollapsed: false, baseMenuFlag: false, inForceFlag: false, newCloseFlag: false, disableButton: false, saveButtonFlag: false, uploadFileFlag: false, editorMarkDownFlag: false }, { payload }): GlobalModelState {
      return {
        ...state,
        newCloseFlag: payload,
      };
    },
    disableButton(state = { notices: [], selectMenu: [], collapsed: true, selectCollapsed: false, baseMenuFlag: false, inForceFlag: false, newCloseFlag: false, disableButton: false, saveButtonFlag: false, uploadFileFlag: false, editorMarkDownFlag: false }, { payload }): GlobalModelState {
      debugger
      return {
        ...state,
        disableButton: payload,
      };
    },

    saveButtonFlag(state = { notices: [], selectMenu: [], collapsed: true, selectCollapsed: false, baseMenuFlag: false, inForceFlag: false, newCloseFlag: false, disableButton: false, saveButtonFlag: false, uploadFileFlag: false, editorMarkDownFlag: false }, { payload }): GlobalModelState {
      return {
        ...state,
        saveButtonFlag: payload,
      };
    },
    uploadFileFlag(state = { notices: [], selectMenu: [], collapsed: true, selectCollapsed: false, baseMenuFlag: false, inForceFlag: false, newCloseFlag: false, disableButton: false, saveButtonFlag: false, uploadFileFlag: false, editorMarkDownFlag: false }, { payload }): GlobalModelState {
      return {
        ...state,
        uploadFileFlag: payload,
      };
    },
    editorMarkDownFlag(state = { notices: [], selectMenu: [], collapsed: true, selectCollapsed: false, baseMenuFlag: false, inForceFlag: false, newCloseFlag: false, disableButton: false, saveButtonFlag: false, uploadFileFlag: false, editorMarkDownFlag: false }, { payload }): GlobalModelState {
      return {
        ...state,
        editorMarkDownFlag: payload,
      };
    },
    editAddFlag(state = { notices: [], selectMenu: [], collapsed: true, selectCollapsed: false, baseMenuFlag: false, inForceFlag: false, newCloseFlag: false, disableButton: false, saveButtonFlag: false, uploadFileFlag: false, editorMarkDownFlag: false, editAddFlag: false }, { payload }): GlobalModelState {
      return {
        ...state,
        editAddFlag: payload,
      };
    },
    topVisible(state = { notices: [], selectMenu: [], collapsed: true, selectCollapsed: false, baseMenuFlag: false, inForceFlag: false, newCloseFlag: false, disableButton: false, saveButtonFlag: false, uploadFileFlag: false, editorMarkDownFlag: false, topVisible: false }, { payload }): GlobalModelState {
      return {
        ...state,
        topVisible: payload,
      };
    },
    /**
     *
     * @param state
     * @param action
     */
    saveOrgInfo(state, action) {
      return {
        ...state,
        // @ts-ignore
        ...state.orgInfoList,
        orgInfoList: action.payload,
      };
    },
    /**
         *
         * @param state
         * @param action
         */
    saveCustomerInfo(state, action) {
      return {
        ...state,
        // @ts-ignore
        ...state.customerList,
        customerList: action.payload,
      };
    },

    /**
     *
     * @param state
     * @param action
     */
    saveUserInfo(state, action) {
      return {
        ...state,
        // @ts-ignore
        ...state.userInfoList,
        userInfoList: action.payload,
      };
      return {
        ...state,
        userInfoList: action.payload || {},
      };
    },
    /**
     *
     * @param state
     * @param action
     */
    setUserOrgInfoList(state, action) {
      return {
        ...state,
        userOrgInfoList: action.payload || {},
      };
    },

    /**
     * lzt
     * @param state 
     * @param action 
     * @returns 
     */
    saveCustomerInfoList(state, action) {
      return {
        ...state,
        customerList: action.payload || {},
      };
    },

  },

  subscriptions: {
    setup({ history }): void {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      history.listen(({ pathname, search }): void => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },
  },
};

export default GlobalModel;
