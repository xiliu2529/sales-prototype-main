import { Reducer, Effect } from 'umi';
import {
  FormatNameType,
  ReportData
} from './data';
import {
  getReportFormat, getReportHeaderFormat

} from "./service";
import {message} from "antd";
import {SearchLoadingType} from "@/pages/FormAdvancedForm/components/SearchRunningCases/data";
import "@/utils/messageConfig";

export interface ModelType {
  namespace: string;
  state: ReportData;
  effects: {
    getFormatNameData: Effect;
    getFormatHeaderNameData: Effect;

  };
  reducers: {
    GetFormatNameData: Reducer<FormatNameType>;
    GetReportHeaderFormat: Reducer<any>;

    SetSearchLoadingTrue: Reducer<SearchLoadingType>;
    SetSearchLoadingFalse: Reducer<SearchLoadingType>;
    clear: Reducer<ReportData>;
  };
}

const initState = {
  formatNameData: [],
  resultData: [],
  setSearchLoading: {
    searchLoading: true,
  },
};

const Model: ModelType = {
  namespace: 'reportData',

  state: initState,

  effects: {
    *getFormatNameData({ payload }, { call, put }) {
      yield put({
        type: 'SetSearchLoadingTrue',
      });

      const response = yield call(getReportFormat, payload);
      yield put({
        type: 'GetFormatNameData',
        payload: response,
      });
      if(response.result === false){
        message.error(response.message);
      }

      yield put({
        type: 'SetSearchLoadingFalse',
      });
    },

    *getFormatHeaderNameData({ payload }, { call, put }) {
      yield put({
        type: 'SetSearchLoadingTrue',
      });

      const response = yield call(getReportHeaderFormat, payload);
      yield put({
        type: 'GetReportHeaderFormat',
        payload: response,
      });
      if(response.result === false){
        message.error(response.message);
      }

      yield put({
        type: 'SetSearchLoadingFalse',
      });
    },

   },

  reducers: {
    GetFormatNameData(state, action) {
      return {
        ...state,
        // @ts-ignore
        ...state.formatNameData,
        formatNameData: action.payload.data,
      };
    },
    GetReportHeaderFormat(state, action) {
      return {
        ...state,
        // @ts-ignore
        ...state.resultData,
        resultData: action.payload.data,
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
