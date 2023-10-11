import { Reducer, Effect } from 'umi';
import {ActForecastData, SearchActForDataType, SearchLoadingType, CollapseData, CompareData} from './data';
import {getAuthOrgCdLst} from "@/pages/FormAdvancedForm/service";
import {getCompareData, searchActForData} from "./service";
import {message} from "antd";
import {AuthOrgType} from "@/pages/FormAdvancedForm/data";
import "@/utils/messageConfig";
import {GlobalModelState, NoticeItem, SelectMenuItem, SelectUserNmItem} from "@/models/global";
import {updateCaseNm} from "@/pages/BusinessActivities/service";

export interface ModelType {
  namespace: string;
  state: ActForecastData;
  effects: {
    fetchAuthOrgCdLst: Effect;
    searchActForData: Effect;
    getCompareData: Effect;
  };
  reducers: {
    AuthOrgCdLst: Reducer<AuthOrgType>;
    SearchActForData: Reducer<SearchActForDataType>;
    GetCompareData: Reducer<CompareData>;

    SetSearchLoadingTrue: Reducer<SearchLoadingType>;
    SetSearchLoadingFalse: Reducer<SearchLoadingType>;
    clear: Reducer<ActForecastData>;
    changeSelectCollapse: Reducer<ActForecastData>;
    changeMonthSummaryModelCollapsed: Reducer<ActForecastData>;
  };
}



const initState = {
  selectCollapsed: false,
  monthSummaryModelCollapsed: false,
  collapsed: false,
  authOrgCdLst: [],
  actForData: [],
  compareData:[],
  setSearchLoading: {
    searchLoading: true,
  },
};

const Model: ModelType = {
  namespace: 'searchActForData',

  state: initState,

  effects: {
    *fetchAuthOrgCdLst({ payload }, { call, put }) {
      const response = yield call(getAuthOrgCdLst, payload);
      yield put({
        type: 'AuthOrgCdLst',
        payload: response,
      });

      yield put({
        type: 'SetSearchLoadingFalse',
      });
    },

    *searchActForData({ payload }, { call, put }) {
      yield put({
        type: 'SetSearchLoadingTrue',
      });

      const response = yield call(searchActForData, payload);
      yield put({
        type: 'SearchActForData',
        payload: response,
      });
      if(response.result === false){
        message.error(response.message);
      }

      yield put({
        type: 'SetSearchLoadingFalse',
      });
    },

    *getCompareData({ payload,payload1,payload2}, { call, put }) {
      const response = yield call(getCompareData, payload,payload1,payload2);
      yield put({
        type: 'GetCompareData',
        payload: response,
      });
    },

  },

  reducers: {
    AuthOrgCdLst(state, action) {
      return {
        ...state,
        // @ts-ignore
        ...state.authOrgCdLst,
        authOrgCdLst: action.payload.data,
      };
    },

    SearchActForData(state, action) {
      return {
        ...state,
        // @ts-ignore
        ...state.actForData,
        actForData: action.payload.data,
      };
    },

    GetCompareData(state, action) {
      return {
        ...state,
        // @ts-ignore
        ...state.compareData,
        compareData: action.payload.data,
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

  
    
    changeSelectCollapseOrg(state = { collapsed: true ,selectCollapsed:false}, { payload }): ActForecastData {
      return {
        ...state,
        selectCollapsed: payload,
      };
    },


    changeMonthSummaryModelCollapsed(state = { collapsed: true ,monthSummaryModelCollapsed:false}, { payload }): ActForecastData {
      return {
        ...state,
        monthSummaryModelCollapsed: payload,
      };
    },
  },
};

export default Model;
