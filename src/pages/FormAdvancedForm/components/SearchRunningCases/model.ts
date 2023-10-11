import { Reducer, Effect } from 'umi';
import {RunCaseData, SearchRunCaseDataType,SearchLoadingType} from './data';
import {searchRunCaseData} from "./service";
import {message} from "antd";
import "@/utils/messageConfig";

export interface ModelType {
  namespace: string;
  state: RunCaseData;
  effects: {
    searchRunCaseData: Effect;

  };
  reducers: {
    SearchRunCaseData: Reducer<SearchRunCaseDataType>;

    SetSearchLoadingTrue: Reducer<SearchLoadingType>;
    SetSearchLoadingFalse: Reducer<SearchLoadingType>;
    clear: Reducer<RunCaseData>;
  };
}

const initState = {
  runCaseData: [],
  setSearchLoading: {
    searchLoading: true,
  },
};

const Model: ModelType = {
  namespace: 'searchRunCase',

  state: initState,

  effects: {
    *searchRunCaseData({ payload }, { call, put }) {
      yield put({
        type: 'SetSearchLoadingTrue',
      });

      const response = yield call(searchRunCaseData, payload);
      yield put({
        type: 'SearchRunCaseData',
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
    SearchRunCaseData(state, action) {
      return {
        ...state,
        // @ts-ignore
        ...state.runCaseData,
        runCaseData: action.payload.data,
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
