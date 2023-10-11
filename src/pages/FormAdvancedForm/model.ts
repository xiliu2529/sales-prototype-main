import { Reducer, Effect } from 'umi';
import { message } from 'antd';
import {
  ActBottomDataType,
  ActForecastTopData, AllCustomerType, AllEndUserType,
  AuthOrgType, BatchEditTableData,
  CaseType,
  CustomerType,
  EndUserType, ExchType,
  IndustryType,
  MessageType,
  ModelVisibleType, MonthNoType, SearchLoadingType, DBudgetDtlType,
  UserType,
  DBusActDtl, BusActHead, SearchCaseType, ParOrgType,FetchActForeCaseMonthSummaryType,
} from './data.d';
import {
  getCustomerLst,
  getIndustryLst,
  getCaseLst,
  getCaseNumberLst,
  getProbabilityLst,
  getCurrencyLst,
  getEffortUnitLst,
  getEndUserLst,
  getActForecastBottomData,
  insertActForecastBottomData,
  insertActForecastBusinessData,
  updateActForecastBottomData,
  deleteActForecastBottomData,
  copyActForecastBottomData,
  moveActForecastBottomData,
  batchAddActData,
  addCustomerDataInfo,
  addEndUserDataInfo,
  getUserLst,
  getAuthOrgCdLst,
  searchUserLst,
  getMonthNo,
  budgetOrHistData,
  batchEditTableData,
  getExchLst,
  saveSaleData,
  getBudgetDtl,
  budgetIdUpdate,
  businessActivitiesIdUpdate,
  getDBusActDtl,
  onBottomLineUpdateYes, onBottomLineUpdateNo, getAllCustomerLst, getAllEndUserLst,
  getCodeValues, getBudActFlg,
  getSearchBatchButtonData,
  getBusActHead,
  getParOrgs,
  getActForeCaseMonthSummaryLst,
} from './service';
import {formatMessage} from "@@/plugin-locale/localeExports";
import "@/utils/messageConfig";
import {CodeValueType} from "@/pages/BusinessActivities/data";

export interface ModelType {
  namespace: string;
  state: ActForecastTopData;
  effects: {
    searchUserLst: Effect;
    fetchAuthOrgCdLst: Effect;
    fetchCustomerLst: Effect;
    fetchAllCustomerLst: Effect;
    fetchIndustryLst: Effect;
    fetchCaseLst: Effect;
    fetchCaseNumberLst: Effect;
    fetchProbabilityLst: Effect;
    fetchCurrencyLst: Effect;
    fetchEffortUnitLst: Effect;
    fetchEndUserLst: Effect;
    fetchAllEndUserLst: Effect;
    fetchCodeValueList: Effect;
    fetchRemarksLst: Effect;
    fetchActForecastBottomData: Effect;
    insertActForecastBottomData: Effect;
    insertActForecastBusinessData: Effect;
    updateActForecastBottomData: Effect;
    deleteActForecastBottomData: Effect;
    copyActForecastBottomData: Effect;
    onBottomLineUpdateYes: Effect;
    onBottomLineUpdateNo: Effect;
    moveActForecastBottomData: Effect;
    batchAddActData: Effect;
    addTopCustomerDataInfo: Effect;
    addTopEndUserDataInfo: Effect;
    addTopCustomerAndEndUserDataInfo: Effect;
    addEditCustomerDataInfo: Effect;
    addEditEndUserDataInfo: Effect;
    addEditCustomerAndEndUserDataInfo: Effect;
    addCustomerDataInfo: Effect;
    addEndUserDataInfo: Effect;

    addCustomerAndEndUserDataInfo: Effect;
    fetchUserLst: Effect;
    changeTopModelVisible: Effect;
    changeBatchEditVisible:Effect;
    changeBottomModelVisible: Effect;
    fetchMonthNo: Effect
    fetchBudgetOrHistData:Effect;
    fetchBatchEditTableData:Effect;
    searchBatchFetchExch:Effect;
    fetchSaveSaleData:Effect;
    fetchBudgetDtl:Effect;
    fetchBatchSaveDate:Effect;
    fetchDBusActDtl: Effect;
    fetchBudActFlg: Effect;
    searchBatchButtonData:Effect;
    businessActivitiesIdUpdate:Effect;
    budgetIdUpdate:Effect;
    getBusActHead: Effect;
    fetchParOrgs: Effect;
    fetchActForeCaseMonthSummaryLst:Effect;
  };
  reducers: {
    SearchUserLst: Reducer<UserType>;
    AuthOrgCdLst: Reducer<AuthOrgType>;
    CustomerLst: Reducer<CustomerType>;
    AllCustomerLst: Reducer<AllCustomerType>;
    IndustryLst: Reducer<IndustryType>;
    CaseLst: Reducer<CaseType>;
    CaseNumberLst: Reducer<CaseType>;
    ProbabilityLst: Reducer<IndustryType>;
    CurrencyLst: Reducer<IndustryType>;
    EffortUnitLst: Reducer<IndustryType>;
    EndUserLst: Reducer<EndUserType>;
    AllEndUserLst:Reducer<AllEndUserType>;
    CodeValueList:Reducer<CodeValueType>;
    ExchLst: Reducer<ExchType>;
    RemarksLst: Reducer<IndustryType>;
    ActForecastBottomData: Reducer<ActBottomDataType>;
    BatchAddActData: Reducer<MessageType>;
    InsertActForecastBottomData: Reducer<MessageType>;
    InsertActForecastBusinessData: Reducer<MessageType>;
    UpdateActForecastBottomData: Reducer<MessageType>;
    OnBottomLineUpdateYes: Reducer<MessageType>;
    OnBottomLineUpdateNo: Reducer<MessageType>;
    AddCustomerDataInfo: Reducer<MessageType>;
    AddEndUserDataInfo: Reducer<MessageType>;
    UserLst: Reducer<UserType>;
    TopModelVisible: Reducer<ModelVisibleType>;
    BatchEditVisible: Reducer<ModelVisibleType>;
    BottomModelVisible: Reducer<ModelVisibleType>;

    SetSearchLoadingTrue: Reducer<SearchLoadingType>;
    SetSearchLoadingFalse: Reducer<SearchLoadingType>;
    GetMonthNo: Reducer<MonthNoType>;
    clear: Reducer<ActForecastTopData>;
    getBudgetOrHistData: Reducer<ActForecastTopData>;
    batchEditTableData: Reducer<BatchEditTableData>;
    GetBudgetDtl:Reducer<DBudgetDtlType>;
    BatchSaveDate: Reducer<MessageType>;
    GetDBusActDtl:Reducer<DBusActDtl>;
    copyModelVisible: Reducer<ActBottomDataType>;
    moveModelVisible: Reducer<ActBottomDataType>;
    getBudActFlg: Reducer<ActBottomDataType>;
    GetBusActHead: Reducer<BusActHead>;
    searchBatchData:Reducer<SearchCaseType>;
    ActForeCaseMonthSummaryLst:Reducer<FetchActForeCaseMonthSummaryType>;
  };
}

const initState = {
  userLst: [],
  searchUserLst: [],
  authOrgCdLst: [],
  customerLst: [],
  industryLst: [],
  allCustomerLst: [],
  codeValueList:[],
  caseLst: [],
  caseNumberLst: [],
  probabilityLst: [],
  currencyLst: [],
  effortUnitLst: [],
  endUserLst: [],
  allEndUserLst: [],
  ExchLst: [],
  remarksLst: [],
  budgetOrHistDataList:[],
  ActBottomData: [],
  messageData: {
    data: '',
    errcode: '',
    message: '',
  },
  modelVisible: {
    topModelVisible: false,
    bottomModelVisible: false,
    runModelVisible: false,
    batchEditVisible: false,
  },

  setSearchLoading: {
    searchLoading: true,
  },
  getMonthNo:{
    monthNo: 0,
  },
  batchEditTableData:[],
  dBudgetDtlDataList:[],
  copyModelVisible: false,
  moveModelVisible: false,
  budActFlg: '',
  busActHead:{},
};

// @ts-ignore
const Model: ModelType = {
  namespace: 'ActForecastData',

  state: initState,

  effects: {
    *searchUserLst({ payload }, { call, put }) {
      const response = yield call(searchUserLst, payload);
      yield put({
        type: 'SearchUserLst',
        payload: response,
      });

      yield put({
        type: 'SetSearchLoadingFalse',
      });
    },
    *fetchBatchEditTableData({ payload }, { call, put }) {

      yield put({
        type: 'SetSearchLoadingTrue',
      });

      const response = yield call(batchEditTableData, payload);
      yield put({
        type: 'batchEditTableData',
        payload: response,
      });

      yield put({
        type: 'SetSearchLoadingFalse',
      });
    },

    *fetchSaveSaleData({ payload ,payload1,payload2}, { call, put }) {

      yield put({
        type: 'SetSearchLoadingTrue',
      });

      const response = yield call(saveSaleData, payload);
      yield put({
        type: 'SaveSaleData',
        payload: response,
      });
      if(response.data !== '' && response.data !== null &&
        (response.data === 'topCustomer' || response.data === 'topEndUser' || response.data === 'topCustomer+topEndUser')){
        yield put({
          type: 'BatchEditVisible',
          payload: true,
        });
      }else if(response.result === false){
        message.error(response.message);
      } else {
        const response2 = yield call(getCaseLst, payload2);
        yield put({
          type: 'CaseLst',
          payload: response2,
        });
        const response1 = yield call(getActForecastBottomData, payload1);
        yield put({
          type: 'ActForecastBottomData',
          payload: response1,
        });
      }
      if (response.result === true) {
        message.info(response.message);
      }
      yield put({
        type: 'SetSearchLoadingFalse',
      });
    },


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
    *fetchCustomerLst({ payload }, { call, put }) {
      const response = yield call(getCustomerLst, payload);
      yield put({
        type: 'CustomerLst',
        payload: response,
      });

      yield put({
        type: 'SetSearchLoadingFalse',
      });
    },

    *fetchAllCustomerLst({ payload }, { call, put }) {
      const response = yield call(getAllCustomerLst, payload);
      yield put({
        type: 'AllCustomerLst',
        payload: response,
      });

      yield put({
        type: 'SetSearchLoadingFalse',
      });
    },

    *fetchIndustryLst({ payload }, { call, put }) {
      const response = yield call(getIndustryLst, payload);
      yield put({
        type: 'IndustryLst',
        payload: response,
      });

      yield put({
        type: 'SetSearchLoadingFalse',
      });
    },

    *fetchCaseLst({ payload }, { call, put }) {
      const response = yield call(getCaseLst, payload);
      yield put({
        type: 'CaseLst',
        payload: response,
      });

      yield put({
        type: 'SetSearchLoadingFalse',
      });
    },

    *fetchCaseNumberLst({ payload }, { call, put }) {
      const response = yield call(getCaseNumberLst, payload);
      yield put({
        type: 'CaseNumberLst',
        payload: response,
      });

      yield put({
        type: 'SetSearchLoadingFalse',
      });
    },

    *fetchProbabilityLst({ payload }, { call, put }) {
      const response = yield call(getProbabilityLst, payload);
      yield put({
        type: 'ProbabilityLst',
        payload: response,
      });

      yield put({
        type: 'SetSearchLoadingFalse',
      });
    },

    *fetchCurrencyLst({ payload }, { call, put }) {
      const response = yield call(getCurrencyLst, payload);
      yield put({
        type: 'CurrencyLst',
        payload: response,
      });

      yield put({
        type: 'SetSearchLoadingFalse',
      });
    },

    *fetchEffortUnitLst({ payload }, { call, put }) {
      const response = yield call(getEffortUnitLst, payload);
      yield put({
        type: 'EffortUnitLst',
        payload: response,
      });

      yield put({
        type: 'SetSearchLoadingFalse',
      });
    },

    *fetchEndUserLst({ payload }, { call, put }) {
      const response = yield call(getEndUserLst, payload);
      yield put({
        type: 'EndUserLst',
        payload: response,
      });

      yield put({
        type: 'SetSearchLoadingFalse',
      });
    },

    *fetchAllEndUserLst({ payload }, { call, put }) {
      const response = yield call(getAllEndUserLst, payload);
      yield put({
        type: 'AllEndUserLst',
        payload: response,
      });

      yield put({
        type: 'SetSearchLoadingFalse',
      });
    },


    *searchBatchFetchExch({ payload }, { call, put }) {
      yield put({
        type: 'SetSearchLoadingTrue',
      });
      const response = yield call(getExchLst, payload);
      yield put({
        type: 'ExchLst',
        payload: response,
      });

      yield put({
        type: 'SetSearchLoadingFalse',
      });
    },



    *fetchRemarksLst({ payload }, { call, put }) {
      const response = yield call(getEndUserLst, payload);
      yield put({
        type: 'RemarksLst',
        payload: response,
      });

      yield put({
        type: 'SetSearchLoadingFalse',
      });
    },

    *fetchActForecastBottomData({ payload }, { call, put }) {
      // 先にデータを入れてloadingを設定します
      // （解決画面のリフレッシュは古いデータの問題がありますが、loadingの表示に影響します。一時的に設定します。）
      const response = yield call(getActForecastBottomData, payload);
      yield put({
        type: 'ActForecastBottomData',
        payload: response,
      });

      yield put({
        type: 'SetSearchLoadingTrue',
      });

      if(response.result === false){
        message.error(response.message);
      }

      yield put({
        type: 'SetSearchLoadingFalse',
      });
    },

    *insertActForecastBottomData({ payload, payload1 , payload2}, { call, put }) {

      yield put({
        type: 'SetSearchLoadingTrue',
      });

      const response = yield call(insertActForecastBottomData, payload);
      if(response.result === true){
        response.data = null;
      }
      yield put({
        type: 'InsertActForecastBottomData',
        payload: response,
      });
      if(response.data !== '' && response.data !== null &&
        (response.data === 'customer' || response.data === 'endUser' || response.data === 'customer+endUser')){
        yield put({
          type: 'BottomModelVisible',
          payload: true,
        });
      }else if(response.result === false){
        message.error(response.message);
      }
      const response2 = yield call(getCaseLst, payload2);
      yield put({
        type: 'CaseLst',
        payload: response2,
      });
      const response1 = yield call(getActForecastBottomData, payload1);
      yield put({
        type: 'ActForecastBottomData',
        payload: response1,
      });
      if (response.result === true) {
        message.info(response.message);
      }

      yield put({
        type: 'SetSearchLoadingFalse',
      });
    },

    *insertActForecastBusinessData({ payload}, { call, put }) {

      yield put({
        type: 'SetSearchLoadingTrue',
      });

      const response = yield call(insertActForecastBusinessData, payload);
      if(response.result === true){
        response.data = null;
      }
      yield put({
        type: 'InsertActForecastBusinessData',
        payload: response,
      });
      yield put({
        type: 'SetSearchLoadingFalse',
      });
    },

    *onBottomLineUpdateYes({ payload, payload1 , payload2}, { call, put }) {

      yield put({
        type: 'SetSearchLoadingTrue',
      });

      const response = yield call(onBottomLineUpdateYes, payload);
      if(response.result === true){
        response.data = null;
      }
      yield put({
        type: 'OnBottomLineUpdateYes',
        payload: response,
      });
      if(response.data !== '' && response.data !== null &&
        (response.data === 'customer' || response.data === 'endUser' || response.data === 'customer+endUser')){
        yield put({
          type: 'BottomModelVisible',
          payload: true,
        });
      }else if(response.result === false){
        message.error(response.message);
      }
      const response2 = yield call(getCaseLst, payload2);
      yield put({
        type: 'CaseLst',
        payload: response2,
      });

      const response1 = yield call(getActForecastBottomData, payload1);
      yield put({
        type: 'ActForecastBottomData',
        payload: response1,
      });
      if (response.result === true) {
        message.info(response.message);
      }

      yield put({
        type: 'SetSearchLoadingFalse',
      });
    },

    *onBottomLineUpdateNo({ payload, payload1 , payload2}, { call, put }) {

      yield put({
        type: 'SetSearchLoadingTrue',
      });

      const response = yield call(onBottomLineUpdateNo, payload);
      if(response.result === true){
        response.data = null;
      }
      yield put({
        type: 'OnBottomLineUpdateNo',
        payload: response,
      });
      if(response.data !== '' && response.data !== null &&
        (response.data === 'customer' || response.data === 'endUser' || response.data === 'customer+endUser')){
        yield put({
          type: 'BottomModelVisible',
          payload: true,
        });
      }else if(response.result === false){
        message.error(response.message);
      }
      const response2 = yield call(getCaseLst, payload2);
      yield put({
        type: 'CaseLst',
        payload: response2,
      });

      const response1 = yield call(getActForecastBottomData, payload1);
      yield put({
        type: 'ActForecastBottomData',
        payload: response1,
      });
      if (response.result === true) {
        message.info(response.message);
      }

      yield put({
        type: 'SetSearchLoadingFalse',
      });
    },

    *updateActForecastBottomData({ payload, payload1 , payload2}, { call, put }) {

      yield put({
        type: 'SetSearchLoadingTrue',
      });

      const response = yield call(updateActForecastBottomData, payload);
      if(response.result === true){
        response.data = null;
      }
      yield put({
        type: 'UpdateActForecastBottomData',
        payload: response,
      });
      if(response.data !== '' && response.data !== null &&
        (response.data === 'customer' || response.data === 'endUser' || response.data === 'customer+endUser')){
        yield put({
          type: 'BottomModelVisible',
          payload: true,
        });
      }else if(response.result === false){
        message.error(response.message);
      }
      const response2 = yield call(getCaseLst, payload2);
      yield put({
        type: 'CaseLst',
        payload: response2,
      });

      const response1 = yield call(getActForecastBottomData, payload1);
      yield put({
        type: 'ActForecastBottomData',
        payload: response1,
      });
      if (response.result === true) {
        message.info(response.message);
      }

      yield put({
        type: 'SetSearchLoadingFalse',
      });
    },

    *deleteActForecastBottomData({ payload, payload1 }, { call, put }) {

      yield put({
        type: 'SetSearchLoadingTrue',
      });

      const response = yield call(deleteActForecastBottomData, payload);
      yield put({
        type: 'DeleteActForecastBottomData',
        payload: response,
      });
      const response1 = yield call(getActForecastBottomData, payload1);
      yield put({
        type: 'ActForecastBottomData',
        payload: response1,
      });
      if (response.result === true) {
        message.info(response.message);
      }else{
        message.error(response.message);
      }

      yield put({
        type: 'SetSearchLoadingFalse',
      });
    },

    *copyActForecastBottomData({ payload, payload1 }, { call, put }) {

      yield put({
        type: 'SetSearchLoadingTrue',
      });

      const response = yield call(copyActForecastBottomData, payload);
      yield put({
        type: 'CopyActForecastBottomData',
        payload: response,
      });
      if (response.result === true) {
        // copyモデルを閉じる
        yield put({
          type: 'copyModelVisible',
          payload: false,
        });

        const response1 = yield call(getActForecastBottomData, payload1);
        yield put({
          type: 'ActForecastBottomData',
          payload: response1,
        });

        message.info(formatMessage({ id: 'common.message.copySuccess' }));
      }else{
        // copyモデルを閉じない
        yield put({
          type: 'copyModelVisible',
          payload: true,
        });

        message.error({
          content: response.message,
          style: {
            whiteSpace: 'pre-wrap',
          },
        });
      }

      yield put({
        type: 'SetSearchLoadingFalse',
      });
    },

    *moveActForecastBottomData({ payload, payload1 }, { call, put }) {

      yield put({
        type: 'SetSearchLoadingTrue',
      });

      const response = yield call(moveActForecastBottomData, payload);
      yield put({
        type: 'MoveActForecastBottomData',
        payload: response,
      });

      if (response.result === true) {
        // copyモデルを閉じる
        yield put({
          type: 'moveModelVisible',
          payload: false,
        });

        const response1 = yield call(getActForecastBottomData, payload1);
        yield put({
          type: 'ActForecastBottomData',
          payload: response1,
        });

        message.info(formatMessage({ id: 'common.message.moveSuccess' }));
      }else{
        // copyモデルを閉じない
        yield put({
          type: 'moveModelVisible',
          payload: true,
        });

        message.error({
          content: response.message,
          style: {
            whiteSpace: 'pre-wrap',
          },
        });
      }

      yield put({
        type: 'SetSearchLoadingFalse',
      });
    },

    *batchAddActData({ payload, payload1 , payload2}, { call, put }) {

      yield put({
        type: 'SetSearchLoadingTrue',
      });

      const response = yield call(batchAddActData, payload);
      yield put({
        type: 'BatchAddActData',
        payload: response,
      });
      if(response.data !== '' && response.data !== null &&
        (response.data === 'topCustomer' || response.data === 'topEndUser' || response.data === 'topCustomer+topEndUser')){
        yield put({
          type: 'TopModelVisible',
          payload: true,
        });
      }else if(response.result === false){
        message.error(response.message);
      } else {
        const response2 = yield call(getCaseLst, payload2);
        yield put({
          type: 'CaseLst',
          payload: response2,
        });
        const response1 = yield call(getActForecastBottomData, payload1);
        yield put({
          type: 'ActForecastBottomData',
          payload: response1,
        });
      }
      if (response.result === true) {
        message.info(response.message);
      }

      yield put({
        type: 'SetSearchLoadingFalse',
      });
    },

    *addTopCustomerDataInfo({ payload, payload1, payload2, payload3 , payload4}, { call, put }) {

      yield put({
        type: 'SetSearchLoadingTrue',
      });

      const response = yield call(addCustomerDataInfo, payload);
      yield put({
        type: 'AddCustomerDataInfo',
        payload: response,
      });

      // 顧客を挿入した結果
      if (response.result === true) {
        message.info(response.message);
      }else{
        message.error(response.message);
      }

      const response1 = yield call(getCustomerLst, payload1);
      yield put({
        type: 'CustomerLst',
        payload: response1,
      });

      const response8 = yield call(getAllCustomerLst, payload1);
      yield put({
        type: 'AllCustomerLst',
        payload: response8,
      });

      const response2 = yield call(batchAddActData, payload2);
      yield put({
        type: 'BatchAddActData',
        payload: response2,
      });

      // 一括挿入データの結果
      if (response2.result === true) {
        message.info(response2.message);
      }else{
        message.error(response2.message);
      }

      const response4 = yield call(getCaseLst, payload4);
      yield put({
        type: 'CaseLst',
        payload: response4,
      });

      const response3 = yield call(getActForecastBottomData, payload3);
      yield put({
        type: 'ActForecastBottomData',
        payload: response3,
      });

      yield put({
        type: 'SetSearchLoadingFalse',
      });
    },

    *addTopEndUserDataInfo({ payload, payload1, payload2, payload3 , payload4}, { call, put }) {

      yield put({
        type: 'SetSearchLoadingTrue',
      });

      const response = yield call(addEndUserDataInfo, payload);
      yield put({
        type: 'AddEndUserDataInfo',
        payload: response,
      });

      // END_USERを挿入した結果
      if (response.result === true) {
        message.info(response.message);
      }else{
        message.error(response.message);
      }

      const response1 = yield call(getEndUserLst, payload1);
      yield put({
        type: 'EndUserLst',
        payload: response1,
      });

      const response4 = yield call(getAllEndUserLst, payload1);
      yield put({
        type: 'AllEndUserLst',
        payload: response4,
      });

      const response2 = yield call(batchAddActData, payload2);
      yield put({
        type: 'BatchAddActData',
        payload: response2,
      });

      // 一括挿入データの結果
      if (response2.result === true) {
        message.info(response2.message);
      }else{
        message.error(response2.message);
      }

      const response5 = yield call(getCaseLst, payload4);
      yield put({
        type: 'CaseLst',
        payload: response5,
      });

      const response3 = yield call(getActForecastBottomData, payload3);
      yield put({
        type: 'ActForecastBottomData',
        payload: response3,
      });

      yield put({
        type: 'SetSearchLoadingFalse',
      });
    },

    *addTopCustomerAndEndUserDataInfo({ payload, payload1, payload2, payload3, payload4, payload5}, { call, put }) {

      yield put({
        type: 'SetSearchLoadingTrue',
      });

      const response = yield call(addCustomerDataInfo, payload);
      yield put({
        type: 'AddCustomerDataInfo',
        payload: response,
      });

      // 顧客を挿入した結果
      if (response.result === true) {
        message.info(response.message);
      }else{
        message.error(response.message);
      }

      // 顧客挿入成功
      if(response.result === true){
        const response2 = yield call(getCustomerLst, payload2);
        yield put({
          type: 'CustomerLst',
          payload: response2,
        });

        const response8 = yield call(getAllCustomerLst, payload2);
        yield put({
          type: 'AllCustomerLst',
          payload: response8,
        });

        const response1 = yield call(addEndUserDataInfo, payload1);
        yield put({
          type: 'AddEndUserDataInfo',
          payload: response1,
        });

        // END_USERを挿入した結果
        if (response1.result === true) {
          message.info(response1.message);
        }else{
          message.error(response1.message);
        }

        // END_USER挿入成功
        if(response1.result === true){

          const response3 = yield call(getEndUserLst, payload2);
          yield put({
            type: 'EndUserLst',
            payload: response3,
          });

          const response7 = yield call(getAllEndUserLst, payload2);
          yield put({
            type: 'AllEndUserLst',
            payload: response7,
          });

          const response4 = yield call(batchAddActData, payload3);
          yield put({
            type: 'BatchAddActData',
            payload: response4,
          });

          // 一括挿入データの結果
          if (response4.result === true) {
            message.info(response4.message);
          }else{
            message.error(response4.message);
          }

          const response5 = yield call(getCaseLst, payload5);
          yield put({
            type: 'CaseLst',
            payload: response5,
          });

          const response6 = yield call(getActForecastBottomData, payload4);
          yield put({
            type: 'ActForecastBottomData',
            payload: response6,
          });
        }
      }

      yield put({
        type: 'SetSearchLoadingFalse',
      });
    },

    *addCustomerDataInfo({ payload, payload1, payload2, payload3, payload4, payload5, payload6 , payload7, payload8 }, { call, put }) {

      yield put({
        type: 'SetSearchLoadingTrue',
      });

      const response = yield call(addCustomerDataInfo, payload);
      yield put({
        type: 'AddCustomerDataInfo',
        payload: response,
      });

      // 顧客を挿入した結果
      if (response.result === true) {
        message.info(response.message);
      }else{
        message.error(response.message);
      }

      // 顧客挿入成功
      if (response.result === true) {
        const response1 = yield call(getCustomerLst, payload1);
        yield put({
          type: 'CustomerLst',
          payload: response1,
        });

        const response8 = yield call(getAllCustomerLst, payload1);
        yield put({
          type: 'AllCustomerLst',
          payload: response8,
        });

        // 插入操作
        if(payload4.insertFlag === true){
          const response2 = yield call(insertActForecastBottomData, payload2);

          // 挿入データの結果
          if(response2.result === true){
            message.info(response2.message);
            response2.data = null;
          }else{
            message.error(response2.message);
          }

          yield put({
            type: 'InsertActForecastBottomData',
            payload: response2,
          });

          const response6 = yield call(getCaseLst, payload6);
          yield put({
            type: 'CaseLst',
            payload: response6,
          });

          const response3 = yield call(getActForecastBottomData, payload3);
          yield put({
            type: 'ActForecastBottomData',
            payload: response3,
          });
        }
        // 更新操作
        if(payload5.updateFlag === true){
          const response2 = yield call(updateActForecastBottomData, payload2);

          // 更新データの結果
          if(response2.result === true){
            message.info(response2.message);
            response2.data = null;
          }else{
            message.error(response2.message);
          }

          yield put({
            type: 'UpdateActForecastBottomData',
            payload: response2,
          });
          const response6 = yield call(getCaseLst, payload6);
          yield put({
            type: 'CaseLst',
            payload: response6,
          });
          const response3 = yield call(getActForecastBottomData, payload3);
          yield put({
            type: 'ActForecastBottomData',
            payload: response3,
          });
        }
        if(payload7.updateBottomLineYesFlag === true){
          const response2 = yield call(onBottomLineUpdateYes, payload2);

          // 更新データの結果
          if(response2.result === true){
            message.info(response2.message);
            response2.data = null;
          }else{
            message.error(response2.message);
          }

          yield put({
            type: 'UpdateActForecastBottomData',
            payload: response2,
          });
          const response6 = yield call(getCaseLst, payload6);
          yield put({
            type: 'CaseLst',
            payload: response6,
          });
          const response3 = yield call(getActForecastBottomData, payload3);
          yield put({
            type: 'ActForecastBottomData',
            payload: response3,
          });
        }
        if(payload8.updateBottomLineNoFlag === true){
          const response2 = yield call(onBottomLineUpdateNo, payload2);

          // 更新データの結果
          if(response2.result === true){
            message.info(response2.message);
            response2.data = null;
          }else{
            message.error(response2.message);
          }

          yield put({
            type: 'UpdateActForecastBottomData',
            payload: response2,
          });
          const response6 = yield call(getCaseLst, payload6);
          yield put({
            type: 'CaseLst',
            payload: response6,
          });
          const response3 = yield call(getActForecastBottomData, payload3);
          yield put({
            type: 'ActForecastBottomData',
            payload: response3,
          });
        }
      }

      yield put({
        type: 'SetSearchLoadingFalse',
      });
    },

    *addEndUserDataInfo({ payload, payload1, payload2, payload3, payload4, payload5, payload6, payload7, payload8 }, { call, put }) {

      yield put({
        type: 'SetSearchLoadingTrue',
      });

      const response = yield call(addEndUserDataInfo,  payload);
      yield put({
        type: 'AddEndUserDataInfo',
        payload: response,
      });

      // END_USERを挿入した結果
      if (response.result === true) {
        message.info(response.message);
      }else{
        message.error(response.message);
      }

      // END_USER挿入成功
      if (response.result === true) {
        const response1 = yield call(getEndUserLst, payload1);
        yield put({
          type: 'EndUserLst',
          payload: response1,
        });

        const response7 = yield call(getAllEndUserLst, payload1);
        yield put({
          type: 'AllEndUserLst',
          payload: response7,
        });

        // 插入操作
        if(payload4.insertFlag === true){
          const response2 = yield call(insertActForecastBottomData, payload2);

          // 挿入データの結果
          if(response2.result === true){
            message.info(response2.message);
            response2.data = null;
          }else{
            message.error(response2.message);
          }

          yield put({
            type: 'InsertActForecastBottomData',
            payload: response2,
          });

          const response6 = yield call(getCaseLst, payload6);
          yield put({
            type: 'CaseLst',
            payload: response6,
          });


          const response3 = yield call(getActForecastBottomData, payload3);
          yield put({
            type: 'ActForecastBottomData',
            payload: response3,
          });
        }
        // 更新操作
        if(payload5.updateFlag === true){
          const response2 = yield call(updateActForecastBottomData, payload2);

          // 更新データの結果
          if(response2.result === true){
            message.info(response2.message);
            response2.data = null;
          }else{
            message.error(response2.message);
          }

          yield put({
            type: 'UpdateActForecastBottomData',
            payload: response2,
          });

          const response6 = yield call(getCaseLst, payload6);
          yield put({
            type: 'CaseLst',
            payload: response6,
          });

          const response3 = yield call(getActForecastBottomData, payload3);
          yield put({
            type: 'ActForecastBottomData',
            payload: response3,
          });
        }
        // 更新操作
        if(payload7.updateBottomLineYesFlag === true){
          const response2 = yield call(onBottomLineUpdateYes, payload2);

          // 更新データの結果
          if(response2.result === true){
            message.info(response2.message);
            response2.data = null;
          }else{
            message.error(response2.message);
          }

          yield put({
            type: 'UpdateActForecastBottomData',
            payload: response2,
          });

          const response6 = yield call(getCaseLst, payload6);
          yield put({
            type: 'CaseLst',
            payload: response6,
          });

          const response3 = yield call(getActForecastBottomData, payload3);
          yield put({
            type: 'ActForecastBottomData',
            payload: response3,
          });
        }
        // 更新操作
        if(payload8.updateBottomLineNoFlag === true){
          const response2 = yield call(onBottomLineUpdateNo, payload2);

          // 更新データの結果
          if(response2.result === true){
            message.info(response2.message);
            response2.data = null;
          }else{
            message.error(response2.message);
          }

          yield put({
            type: 'UpdateActForecastBottomData',
            payload: response2,
          });

          const response6 = yield call(getCaseLst, payload6);
          yield put({
            type: 'CaseLst',
            payload: response6,
          });

          const response3 = yield call(getActForecastBottomData, payload3);
          yield put({
            type: 'ActForecastBottomData',
            payload: response3,
          });
        }
      }

      yield put({
        type: 'SetSearchLoadingFalse',
      });
    },

    *addCustomerAndEndUserDataInfo({ payload, payload1, payload2, payload3, payload4, payload5, payload6 , payload7, payload8 , payload9}, { call, put }) {

      yield put({
        type: 'SetSearchLoadingTrue',
      });

      const response = yield call(addCustomerDataInfo, payload);
      yield put({
        type: 'AddCustomerDataInfo',
        payload: response,
      });

      // 顧客を挿入した結果
      if (response.result === true) {
        message.info(response.message);
      }else{
        message.error(response.message);
      }

      // 顧客挿入成功
      if (response.result === true) {
        const response3 = yield call(getCustomerLst, payload2);
        yield put({
          type: 'CustomerLst',
          payload: response3,
        });

        const response8 = yield call(getAllCustomerLst, payload2);
        yield put({
          type: 'AllCustomerLst',
          payload: response8,
        });

        const response1 = yield call(addEndUserDataInfo, payload1);
        yield put({
          type: 'AddEndUserDataInfo',
          payload: response1,
        });

        // END_USERを挿入した結果
        if (response1.result === true) {
          message.info(response1.message);
        }else{
          message.error(response1.message);
        }

        // END_USER挿入成功
        if (response1.result === true) {
          const response4 = yield call(getEndUserLst, payload2);
          yield put({
            type: 'EndUserLst',
            payload: response4,
          });

          const response7 = yield call(getAllEndUserLst, payload2);
          yield put({
            type: 'AllEndUserLst',
            payload: response7,
          });

          // 插入操作
          if(payload5.insertFlag){
            const response5 = yield call(insertActForecastBottomData, payload3);

            // 挿入データの結果
            if(response5.result === true){
              message.info(response5.message);
              response5.data = null;
            }else{
              message.error(response5.message);
            }

            yield put({
              type: 'InsertActForecastBottomData',
              payload: response5,
            });

            const response7 = yield call(getCaseLst, payload7);
            yield put({
              type: 'CaseLst',
              payload: response7,
            });

            const response6 = yield call(getActForecastBottomData, payload4);
            yield put({
              type: 'ActForecastBottomData',
              payload: response6,
            });
          }
          // 更新操作
          if(payload6.updateFlag){
            const response5 = yield call(updateActForecastBottomData, payload3);

            // 更新データの結果
            if(response5.result === true){
              message.info(response5.message);
              response5.data = null;
            }else{
              message.error(response5.message);
            }

            yield put({
              type: 'UpdateActForecastBottomData',
              payload: response5,
            });

            const response7 = yield call(getCaseLst, payload7);
            yield put({
              type: 'CaseLst',
              payload: response7,
            });

            const response6 = yield call(getActForecastBottomData, payload4);
            yield put({
              type: 'ActForecastBottomData',
              payload: response6,
            });
          }
          // 插入操作
          if(payload8.updateBottomLineYesFlag){
            const response5 = yield call(onBottomLineUpdateYes, payload3);

            // 挿入データの結果
            if(response5.result === true){
              message.info(response5.message);
              response5.data = null;
            }else{
              message.error(response5.message);
            }

            yield put({
              type: 'InsertActForecastBottomData',
              payload: response5,
            });

            const response7 = yield call(getCaseLst, payload7);
            yield put({
              type: 'CaseLst',
              payload: response7,
            });

            const response6 = yield call(getActForecastBottomData, payload4);
            yield put({
              type: 'ActForecastBottomData',
              payload: response6,
            });
          }
          // 插入操作
          if(payload9.updateBottomLineNoFlag){
            const response5 = yield call(onBottomLineUpdateNo, payload3);

            // 挿入データの結果
            if(response5.result === true){
              message.info(response5.message);
              response5.data = null;
            }else{
              message.error(response5.message);
            }

            yield put({
              type: 'InsertActForecastBottomData',
              payload: response5,
            });

            const response7 = yield call(getCaseLst, payload7);
            yield put({
              type: 'CaseLst',
              payload: response7,
            });

            const response6 = yield call(getActForecastBottomData, payload4);
            yield put({
              type: 'ActForecastBottomData',
              payload: response6,
            });
          }
        }
      }

      yield put({
        type: 'SetSearchLoadingFalse',
      });
    },

    *fetchUserLst({ payload }, { call, put }) {
      const response = yield call(getUserLst, payload);
      yield put({
        type: 'UserLst',
        payload: response,
      });

      yield put({
        type: 'SetSearchLoadingFalse',
      });
    },

    *changeTopModelVisible({ payload }, {  put }) {
      yield put({
        type: 'TopModelVisible',
        payload: payload.visible,
      });

      yield put({
        type: 'SetSearchLoadingFalse',
      });
    },

    *changeBatchEditVisible({ payload }, {  put }) {
      yield put({
        type: 'BatchEditVisible',
        payload: payload.visible,
      });

      yield put({
        type: 'SetSearchLoadingFalse',
      });
    },

    *changeBottomModelVisible({ payload }, {  put }) {
      yield put({
        type: 'BottomModelVisible',
        payload,
      });

      yield put({
        type: 'SetSearchLoadingFalse',
      });
    },

    *fetchMonthNo({ payload }, { call, put }) {
      const response = yield call(getMonthNo, payload);
      yield put({
        type: 'GetMonthNo',
        payload: response,
      });

      yield put({
        type: 'SetSearchLoadingFalse',
      });
    },

    *fetchBudgetOrHistData({ payload }, { call, put }) {
      const response = yield call(budgetOrHistData,payload);
      yield put({
        type: 'getBudgetOrHistData',
        payload: {
          budgetOrHistDataList: response.data,
        },
        // payload: response,
      });

    },
    *addEditCustomerDataInfo({ payload, payload1, payload2, payload3 , payload4}, { call, put }) {

      yield put({
        type: 'SetSearchLoadingTrue',
      });

      const response = yield call(addCustomerDataInfo, payload);
      yield put({
        type: 'AddCustomerDataInfo',
        payload: response,
      });

      // 顧客を挿入した結果
      if (response.result === true) {
        message.info(response.message);
      }else{
        message.error(response.message);
      }

      const response1 = yield call(getCustomerLst, payload1);
      yield put({
        type: 'CustomerLst',
        payload: response1,
      });

      const response8 = yield call(getAllCustomerLst, payload1);
      yield put({
        type: 'AllCustomerLst',
        payload: response8,
      });

      const response2 = yield call(saveSaleData, payload2);
      yield put({
        type: 'SaveSaleData',
        payload: response2,
      });

      // 一括挿入データの結果
      if (response2.result === true) {
        message.info(response2.message);
      }else{
        message.error(response2.message);
      }

      const response4 = yield call(getCaseLst, payload4);
      yield put({
        type: 'CaseLst',
        payload: response4,
      });

      const response3 = yield call(getActForecastBottomData, payload3);
      yield put({
        type: 'ActForecastBottomData',
        payload: response3,
      });

      yield put({
        type: 'SetSearchLoadingFalse',
      });
    },

    *addEditEndUserDataInfo({ payload, payload1, payload2, payload3 , payload4}, { call, put }) {

      yield put({
        type: 'SetSearchLoadingTrue',
      });

      const response = yield call(addEndUserDataInfo, payload);
      yield put({
        type: 'AddEndUserDataInfo',
        payload: response,
      });

      // END_USERを挿入した結果
      if (response.result === true) {
        message.info(response.message);
      }else{
        message.error(response.message);
      }

      const response1 = yield call(getEndUserLst, payload1);
      yield put({
        type: 'EndUserLst',
        payload: response1,
      });

      const response7 = yield call(getAllEndUserLst, payload1);
      yield put({
        type: 'AllEndUserLst',
        payload: response7,
      });

      const response2 = yield call(saveSaleData, payload2);
      yield put({
        type: 'SaveSaleData',
        payload: response2,
      });

      // 一括挿入データの結果
      if (response2.result === true) {
        message.info(response2.message);
      }else{
        message.error(response2.message);
      }

      const response5 = yield call(getCaseLst, payload4);
      yield put({
        type: 'CaseLst',
        payload: response5,
      });

      const response3 = yield call(getActForecastBottomData, payload3);
      yield put({
        type: 'ActForecastBottomData',
        payload: response3,
      });

      yield put({
        type: 'SetSearchLoadingFalse',
      });
    },

    *addEditCustomerAndEndUserDataInfo({ payload, payload1, payload2, payload3, payload4, payload5}, { call, put }) {

      yield put({
        type: 'SetSearchLoadingTrue',
      });

      const response = yield call(addCustomerDataInfo, payload);
      yield put({
        type: 'AddCustomerDataInfo',
        payload: response,
      });

      // 顧客を挿入した結果
      if (response.result === true) {
        message.info(response.message);
      }else{
        message.error(response.message);
      }

      // 顧客挿入成功
      if(response.result === true){
        const response2 = yield call(getCustomerLst, payload2);
        yield put({
          type: 'CustomerLst',
          payload: response2,
        });

        const response8 = yield call(getAllCustomerLst, payload2);
        yield put({
          type: 'AllCustomerLst',
          payload: response8,
        });

        const response1 = yield call(addEndUserDataInfo, payload1);
        yield put({
          type: 'AddEndUserDataInfo',
          payload: response1,
        });

        // END_USERを挿入した結果
        if (response1.result === true) {
          message.info(response1.message);
        }else{
          message.error(response1.message);
        }

        // END_USER挿入成功
        if(response1.result === true){

          const response3 = yield call(getEndUserLst, payload2);
          yield put({
            type: 'EndUserLst',
            payload: response3,
          });

          const response7 = yield call(getAllEndUserLst, payload2);
          yield put({
            type: 'AllEndUserLst',
            payload: response7,
          });

          const response4 = yield call(saveSaleData, payload3);
          yield put({
            type: 'SaveSaleData',
            payload: response4,
          });

          // 一括挿入データの結果
          if (response4.result === true) {
            message.info(response4.message);
          }else{
            message.error(response4.message);
          }

          const response5 = yield call(getCaseLst, payload5);
          yield put({
            type: 'CaseLst',
            payload: response5,
          });

          const response6 = yield call(getActForecastBottomData, payload4);
          yield put({
            type: 'ActForecastBottomData',
            payload: response6,
          });
        }
      }

      yield put({
        type: 'SetSearchLoadingFalse',
      });
    },

    *fetchBudgetDtl({ payload }, { call, put }) {
      yield put({
        type: 'SetSearchLoadingTrue',
      });
      const response = yield call(getBudgetDtl, payload);
      yield put({
        type: 'GetBudgetDtl',
        payload: response,
      });
      yield put({
        type: 'SetSearchLoadingFalse',
      });
    },

    *budgetIdUpdate({ payload, payload1 , payload2 },{call, put})  {

      yield put({
        type: 'SetSearchLoadingTrue',
      });

      const response = yield call(budgetIdUpdate, payload);
      yield put({
        type: 'BatchSaveDate',
        payload: response,
      });
      if(response.result === false){
        message.error(response.message);
      } else {

        const response2 = yield call(getCaseLst, payload2);
        yield put({
          type: 'CaseLst',
          payload: response2,
        });
        const response1 = yield call(getActForecastBottomData, payload1);
        yield put({
          type: 'ActForecastBottomData',
          payload: response1,
        });
      }
      if (response.result === true) {
        message.info(response.message);
      }

      yield put({
        type: 'SetSearchLoadingFalse',
      });
    },

    *businessActivitiesIdUpdate({ payload, payload1 , payload2 },{call, put})  {

      yield put({
        type: 'SetSearchLoadingTrue',
      });

      const response = yield call(businessActivitiesIdUpdate, payload);
      yield put({
        type: 'BatchSaveDate',
        payload: response,
      });
      if(response.result === false){
        message.error(response.message);
      } else {
        const response2 = yield call(getCaseLst, payload2);
        yield put({
          type: 'CaseLst',
          payload: response2,
        });
        const response1 = yield call(getActForecastBottomData, payload1);
        yield put({
          type: 'ActForecastBottomData',
          payload: response1,
        });
      }
      if (response.result === true) {
        message.info(response.message);
      }
      yield put({
        type: 'SetSearchLoadingFalse',
      });
    },

    *fetchDBusActDtl({ payload }, { call, put }) {
      yield put({
        type: 'SetSearchLoadingTrue',
      });
      const response = yield call(getDBusActDtl, payload);
      yield put({
        type: 'GetDBusActDtl',
        payload: response,
      });
      if(response.result === false){
        message.error(response.message);
      }
      yield put({
        type: 'SetSearchLoadingFalse',
      });
    },

    *fetchCodeValueList({ payload }, { call, put }) {
      const response = yield call(getCodeValues, payload);
      yield put({
        type: 'CodeValueList',
        payload: response,
      });
    },
    *fetchBudActFlg({ payload }, { call, put }) {
      const response = yield call(getBudActFlg, payload);
      yield put({
        type: 'getBudActFlg',
        payload: response,
      });
    },
    *searchBatchButtonData({ payload,payload1 }, { call, put }) {
      const response = yield call(getSearchBatchButtonData, payload,payload1);
      yield put({
        type: 'searchBatchData',
        payload: response,
      });
    },

    *getBusActHead({ payload}, { call, put }) {
      const response = yield call(getBusActHead, payload);
      yield put({
        type: 'GetBusActHead',
        payload: response,
      });
    },

    *fetchParOrgs({ payload,payload1 },  { call, put, select }) {
      const response = yield call(getParOrgs,payload,payload1);
      yield put({
        type: 'ParOrgType',
        payload: response,
      });
    },
    *fetchActForeCaseMonthSummaryLst({ payload }, { call, put }) {
      const response = yield call(getActForeCaseMonthSummaryLst, payload);
      yield put({
        type: 'ActForeCaseMonthSummaryLst',
        payload: response,
      });

      yield put({
        type: 'SetSearchLoadingFalse',
      });
    },
  },

  reducers: {
    SearchUserLst(state, action) {
      return {
        ...state,
        // @ts-ignore
        ...state.searchUserLst,
        searchUserLst: action.payload.data,
      };
    },
    searchBatchData(state, action) {
      return {
        ...state,
        // @ts-ignore
        ...state.searchBatchData,
        searchBatchData: action.payload.data,
      };
    },
    batchEditTableData(state, action) {
      return {
        ...state,
        // @ts-ignore
        ...state.batchEditTableData,
        batchEditTableData: action.payload.data,
      };
    },
    UserLst(state, action) {
      return {
        ...state,
        // @ts-ignore
        ...state.userLst,
        userLst: action.payload.data,
      };
    },
    AuthOrgCdLst(state, action) {
      return {
        ...state,
        // @ts-ignore
        ...state.authOrgCdLst,
        authOrgCdLst: action.payload.data,
      };
    },
    ParOrgType(state, action) {
      return {
        ...state,
        // @ts-ignore
        ...state.parOrgCdLst,
        parOrgCdLst: action.payload.data,
      };
    },
    CustomerLst(state, action) {
      return {
        ...state,
        // @ts-ignore
        ...state.customerLst,
        customerLst: action.payload.data,
      };
    },
    AllCustomerLst(state, action) {
      return {
        ...state,
        // @ts-ignore
        ...state.allCustomerLst,
        allCustomerLst: action.payload.data,
      };
    },
    IndustryLst(state, action) {
      return {
        ...state,
        // @ts-ignore
        ...state.industryLst,
        industryLst: action.payload.data,
      };
    },

    CaseLst(state, action) {
      return {
        ...state,
        // @ts-ignore
        ...state.caseLst,
        caseLst: action.payload.data,
      };
    },
    CaseNumberLst(state, action) {
      return {
        ...state,
        // @ts-ignore
        ...state.caseNumberLst,
        caseNumberLst: action.payload.data,
      };
    },
    ProbabilityLst(state, action) {
      return {
        ...state,
        // @ts-ignore
        ...state.probabilityLst,
        probabilityLst: action.payload.data,
      };
    },
    CurrencyLst(state, action) {
      return {
        ...state,
        // @ts-ignore
        ...state.currencyLst,
        currencyLst: action.payload.data,
      };
    },
    EffortUnitLst(state, action) {
      return {
        ...state,
        // @ts-ignore
        ...state.effortUnitLst,
        effortUnitLst: action.payload.data,
      };
    },
    EndUserLst(state, action) {
      return {
        ...state,
        // @ts-ignore
        ...state.endUserLst,
        endUserLst: action.payload.data,
      };
    },
    AllEndUserLst(state, action) {
      return {
        ...state,
        // @ts-ignore
        ...state.allEndUserLst,
        allEndUserLst: action.payload.data,
      };
    },
    ExchLst(state, action) {
      return {
        ...state,
        // @ts-ignore
        ...state.endUserLst,
        ExchLst: action.payload.data,
      };
    },
    RemarksLst(state, action) {
      return {
        ...state,
        // @ts-ignore
        ...state.remarksLst,
        remarksLst: action.payload.data,
      };
    },
    ActForecastBottomData(state, action) {

      return {
        ...state,
        // @ts-ignore
        ...state.ActBottomData,
        ActBottomData: action.payload.data,
      };
    },
    InsertActForecastBottomData(state, action) {
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

    InsertActForecastBusinessData(state, action) {
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
    UpdateActForecastBottomData(state, action) {
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
    OnBottomLineUpdateNo(state, action) {
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
    OnBottomLineUpdateYes(state, action) {
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

    BatchAddActData(state, action) {
      const { data } = action.payload;
      const { result } = action.payload;
      const { errcode } = action.payload;
      const msg = action.payload.message;
      const messageData: MessageType = {
        data,
        result,
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
    AddCustomerDataInfo(state, action) {
      const data = '';
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
    AddEndUserDataInfo(state, action) {
      const data = '';
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
    TopModelVisible(state, action) {
      const topModelVisible = action.payload;
      const bottomModelVisible = false;
      const runModelVisible = false;
      const batchEditVisible =false;
      const modelVisible: ModelVisibleType = {
        topModelVisible,
        bottomModelVisible,
        runModelVisible,
        batchEditVisible,
      } ;
      return{
        ...state,
        // @ts-ignore
        ...state.modelVisible,
        modelVisible,
      }
    },
    BatchEditVisible(state, action) {
      const batchEditVisible = action.payload;
      const bottomModelVisible = false;
      const runModelVisible = false;
      const topModelVisible =false;
      const modelVisible: ModelVisibleType = {
        topModelVisible,
        bottomModelVisible,
        runModelVisible,
        batchEditVisible,
      } ;
      return{
        ...state,
        // @ts-ignore
        ...state.modelVisible,
        modelVisible,
      }
    },
    BottomModelVisible(state, action) {
      const topModelVisible = false;
      const bottomModelVisible = action.payload;
      const runModelVisible = false;
      const batchEditVisible = false;
      const modelVisible: ModelVisibleType = {
        topModelVisible,
        bottomModelVisible,
        runModelVisible,
        batchEditVisible,
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

    GetMonthNo(state, action) {
      const monthNo = action.payload.data;
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const getMonthNo: MonthNoType = {
        monthNo,
      } ;
      return{
        ...state,
        // @ts-ignore
        ...state.getMonthNo,
        getMonthNo,
      }
    },
    getBudgetOrHistData(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    SaveSaleData(state, action) {
      const { data } = action.payload;
      const { result } = action.payload;
      const { errcode } = action.payload;
      const msg = action.payload.message;
      const messageData: MessageType = {
        data,
        result,
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

    GetBudgetDtl(state, action) {
      return {
        ...state,
        // @ts-ignore
        ...state.dBudgetDtlDataList,
        dBudgetDtlDataList: action.payload.data,
      };
    },

    GetDBusActDtl(state, action) {
      return {
        ...state,
        // @ts-ignore
        ...state.dBusActDtlList,
        dBusActDtlList: action.payload.data,
      };
    },
    CodeValueList(state, action) {
      console.log("CodeValueList");
      console.log(action.payload.data);
      return {
        ...state,
        // @ts-ignore
        ...state.codeValueList,
        codeValueList: action.payload.data,
      };
    },
    copyModelVisible(state, action) {
      return {
        ...state,
        // @ts-ignore
        ...state.copyModelVisible,
        copyModelVisible: action.payload,
      };
    },
    moveModelVisible(state, action) {
      return {
        ...state,
        // @ts-ignore
        ...state.moveModelVisible,
        moveModelVisible: action.payload,
      };
    },

    getBudActFlg(state, action) {
      return {
        ...state,
        // @ts-ignore
        ...state.budActFlg,
        budActFlg: action.payload.data,
      };
    },

    BatchSaveDate(state, action) {
      const data = '';
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

    GetBusActHead(state, action) {
      return {
        ...state,
        // @ts-ignore
        ...state.busActHead,
        busActHead: action.payload.data,
      };
    },

    ActForeCaseMonthSummaryLst(state, action) {
      return {
        ...state,
        // @ts-ignore
        ...state.actForMonthSummaryVo,
        actForMonthSummaryVo: action.payload.data,
      };
    },

    clear() {
      return initState;
    },
  },
};

export default Model;
