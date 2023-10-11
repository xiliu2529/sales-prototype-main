import { Reducer, Effect } from 'umi';
import {
  FormatBudgetDataType,
  FormatHeaderDataType,
  FormatNameType,
  UploadExcelData,
  UserType,
  MessageType, ModelVisibleType,
  SearchLoadingType, LoadDataLoadingType
} from './data';
import {
  clearAndLoadData,
  getFormatBudgetData,
  getFormatHeaderData,
  getFormatNameData,
  getSheetUserData,
  loadData,
} from "./service";
import {message} from "antd";
import "@/utils/messageConfig";

export interface ModelType {
  namespace: string;
  state: UploadExcelData;
  effects: {
    getFormatNameData: Effect;
    getFormatHeaderData: Effect;
    getFormatBudgetData: Effect;
    getSheetUserData: Effect;
    loadData: Effect;
    clearAndLoadData: Effect;
    changeModelVisible: Effect;
    setSearchLoadingFalse: Effect;

  };
  reducers: {
    GetFormatNameData: Reducer<FormatNameType>;
    GetFormatHeaderData: Reducer<FormatHeaderDataType>;
    GetFormatBudgetData: Reducer<FormatBudgetDataType>;
    GetSheetUserData: Reducer<UserType>;
    LoadData: Reducer<MessageType>;
    Visible: Reducer<ModelVisibleType>;

    SetSearchLoadingTrue: Reducer<SearchLoadingType>;
    SetSearchLoadingFalse: Reducer<SearchLoadingType>;

    SetLoadDataLoadingTrue: Reducer<LoadDataLoadingType>;
    SetLoadDataLoadingFalse: Reducer<LoadDataLoadingType>;
    clear: Reducer<UploadExcelData>;
  };
}

const initState = {
  formatNameData: [],
  formatHeaderData: [],
  formatBudgetData: [],
  sheetUserData:[],
  messageData: {
    data: '',
    errcode: '',
    message: '',
  },
  modelVisible: {
    visible: false,
  },
  setSearchLoading: {
    searchLoading: true,
  },
  setLoadDataLoading: {
    loadDataLoading: false,
  },
};

const Model: ModelType = {
  namespace: 'uploadExcel',

  state: initState,

  effects: {
    *getFormatNameData({ payload }, { call, put }) {
      const response = yield call(getFormatNameData, payload);
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

    *getFormatHeaderData({ payload }, { call, put }) {
      const response = yield call(getFormatHeaderData, payload);
      yield put({
        type: 'GetFormatHeaderData',
        payload: response,
      });
      if(response.result === false){
        message.error(response.message);
      }

      yield put({
        type: 'SetSearchLoadingFalse',
      });
    },

    *getFormatBudgetData({ payload }, { call, put }) {
      const response = yield call(getFormatBudgetData, payload);
      yield put({
        type: 'GetFormatBudgetData',
        payload: response,
      });
      if(response.result === false){
        message.error(response.message);
      }

      yield put({
        type: 'SetSearchLoadingFalse',
      });
    },

    *getSheetUserData({ payload }, { call, put }) {
      yield put({
        type: 'SetSearchLoadingTrue',
      });

      const response = yield call(getSheetUserData, payload);
      yield put({
        type: 'GetSheetUserData',
        payload: response,
      });
      if(response.result === false){
        message.error(response.message);
      }
    },

    *loadData({ payload }, { call, put }) {
      yield put({
        type: 'SetLoadDataLoadingTrue',
      });

      const response = yield call(loadData, payload);
      yield put({
        type: 'LoadData',
        payload: response,
      });
      const payload1 = true;
      if(response.result === true){
        message.info(response.message);
      }else if(response.result === false && response.data === 'deleteData'){
        yield put({
          type: 'Visible',
          payload1,
        });
      }else if(response.message.indexOf(';') === -1){
          message.error(response.message);
        }else{
          const msg: string | any[][] = response.message.split(';');
          if(msg.length>0){
            for(let i =0;i<msg.length;i+=1){
              message.error(msg[i]);
            }
          }
        }

      yield put({
        type: 'SetLoadDataLoadingFalse',
      });
    },

    *clearAndLoadData({ payload }, { call, put }) {
      yield put({
        type: 'SetLoadDataLoadingTrue',
      });

      const response = yield call(clearAndLoadData, payload);
      yield put({
        type: 'ClearAndLoadData',
        payload: response,
      });
      if(response.result === false){
        message.error(response.message);
      }else{
        message.info(response.message);
      }

      yield put({
        type: 'SetLoadDataLoadingFalse',
      });
    },

    *changeModelVisible({ payload1 }, { put }) {
      yield put({
        type: 'Visible',
        payload1,
      });
    },

    *setSearchLoadingFalse({ put }) {
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

    GetFormatHeaderData(state, action) {
      return {
        ...state,
        // @ts-ignore
        ...state.formatHeaderData,
        formatHeaderData: action.payload.data,
      };
    },

    GetFormatBudgetData(state, action) {
      return {
        ...state,
        // @ts-ignore
        ...state.formatBudgetData,
        formatBudgetData: action.payload.data,
      };
    },

    GetSheetUserData(state, action) {
      return {
        ...state,
        // @ts-ignore
        ...state.sheetUserData,
        sheetUserData: action.payload.data,
      };
    },
    LoadData(state, action) {
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

    Visible(state, action) {
      const visible = action.payload1;
      const modelVisible: ModelVisibleType = {
        visible,
      } ;
      return{
        ...state,
        // @ts-ignore
        ...state.modelVisible,
        modelVisible,
      }
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

    SetLoadDataLoadingTrue(state) {
      const loadDataLoading = true;
      const setLoadDataLoading: LoadDataLoadingType = {
        loadDataLoading,
      } ;
      return{
        ...state,
        // @ts-ignore
        ...state.setLoadDataLoading,
        setLoadDataLoading,
      }
    },

    SetLoadDataLoadingFalse(state) {
      const loadDataLoading = false;
      const setLoadDataLoading: LoadDataLoadingType = {
        loadDataLoading,
      } ;
      return{
        ...state,
        // @ts-ignore
        ...state.setLoadDataLoading,
        setLoadDataLoading,
      }
    },

    clear() {
      return initState;
    },
  },
};

export default Model;
