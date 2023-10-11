import { Reducer, Effect } from 'umi';
import {AllEndUserType, MessageType} from "@/pages/FormAdvancedForm/data";
import {message} from "antd";
import {CurrentUser} from "@/models/user";
import {
  getCustomerData,
  getCaseData,
  getEndUsers,
  getCodeValues,
  getBusUserInfo,
  getBusinessActivities,
  getBusinessActivityHeaders,
  getBusinessActivityDtls,
  deleteBusinessActivity,
  deleteBusinessActivityFile,
  updateBusinessActivityDtl,
  insertBusinessActivityDtl,
  updateBusinessActivityHead,
  insertBusinessActivity,
  getUserInfo, getCaseListEditCreate, updateCaseNm, getSearchCustomerData, getAllCustomerData, getAllEndUsers,
} from './service';
import {
  AllCustomerType,
  BusActData,
  BusActHedDtlDataType,
  CaseType,
  CodeValueType,
  CustomerType,
  DBusActHeadDataType,
  EndUserType,
  UserType,
} from './data.d';
import "@/utils/messageConfig";

export interface ModelType {
  namespace: string;
  state: BusActData;
  effects: {
    fetchCustomerList: Effect;
    fetchAllCustomerList: Effect;
    fetchSearchCustomerData:Effect;
    fetchCaseList: Effect;
    fetchCaseListEditCreate:Effect;
    fetchUpdateCaseNm:Effect;
    fetchEndUserList: Effect;
    fetchAllEndUserList: Effect;
    fetchCodeValueList: Effect;
    fetchUserList:Effect;
    fetchInputUserList:Effect;
    fetchBusinessActivitiesList:Effect;
    fetchDBusActHeadList:Effect;
    fetchEditDBusActHeadList:Effect;
    fetchBusinessActivityDtlList:Effect;
    deleteBusinessActivity:Effect;
    updateBusinessActivityDtl:Effect;
    insertBusinessActivityDtl:Effect;
    updateBusinessActivityHead:Effect;
    insertBusinessActivity:Effect;
    fetchUserOrgInfo:Effect;
    deleteBusinessActivityFile:Effect;
  };
  reducers: {
    CustomerList: Reducer<CustomerType>;
    AllCustomerList: Reducer<AllCustomerType>;
    SearchCustomerList:Reducer<CustomerType>;
    CaseList: Reducer<CaseType>;
    CaseListEditCreate:Reducer<CaseType>;
    UpdateCaseNm:Reducer;
    EndUserList: Reducer<EndUserType>;
    AllEndUserList: Reducer<AllEndUserType>;
    CodeValueList:Reducer<CodeValueType>;
    UserList: Reducer<UserType>;
    BusinessActivitiesList:Reducer<BusActHedDtlDataType>;
    DBusActHeadList:Reducer<DBusActHeadDataType>;
    EditDBusActHeadList:Reducer<DBusActHeadDataType>;
    BusinessActivityDtlList:Reducer<BusActHedDtlDataType>;
    DeleteBusinessActivity:Reducer<MessageType>;
    UpdateBusinessActivityDtl:Reducer<MessageType>;
    InsertBusinessActivityDtl:Reducer<MessageType>;
    UpdateBusinessActivityHead:Reducer<MessageType>;
    InsertBusinessActivity:Reducer<DBusActHeadDataType>;
    InputUserList: Reducer<UserType>;
    UserOrgInfo:Reducer<CurrentUser>;
    SetResultFlag:Reducer<boolean>;
    DeleteBusinessActivityFile:Reducer<MessageType>;
  };
}

const initState = {
  customerList: [],
  allCustomerList: [],
  searchCustomerList:[],
  userList: [],
  inputUserList: [],
  BusActInfoModify: {},
  BusActInfoDelete:{},
  caseList: [],
  caseListEditCreate:[],
  updateCaseNm:[],
  endUserList:[],
  allEndUserList:[],
  codeValueList:[],
  businessActivitiesList:[],
  bBusActHeadDataList:[],
  editDBusActHeadDataList:[],
  BusActInfoUpdateData:{},
  busActDtlInsertDataType:{},
  businessActivityDtlList:[],
  userOrgInfo:{},
  messageData: {
    data: '',
    errcode: '',
    message: '',
  },
  resultFlag:true,
};

// @ts-ignore
const Model: ModelType = {
  namespace: 'BusinessActivities',
  // @ts-ignore
  state: initState,
  effects: {
    *fetchUserOrgInfo({ payload }, { call, put }) {
      const response = yield call(getUserInfo, payload);
      yield put({
        type: 'UserOrgInfo',
        payload: response,
      });
      if (response.result === false) {
        message.error(response.message.replace(/\{|}/g,''));
      }
    },
    *fetchCustomerList({ payload }, { call, put }) {
      const response = yield call(getCustomerData, payload);
      yield put({
        type: 'CustomerList',
        payload: response,
      });
    },
    *fetchAllCustomerList({ payload }, { call, put }) {
      const response = yield call(getAllCustomerData, payload);
      yield put({
        type: 'AllCustomerList',
        payload: response,
      });
    },
    *fetchSearchCustomerData({ payload }, { call, put }) {
      const response = yield call(getSearchCustomerData, payload);
      yield put({
        type: 'SearchCustomerList',
        payload: response,
      });
    },
    *fetchCaseList({ payload }, { call, put }) {
      const response = yield call(getCaseData, payload);
      yield put({
        type: 'CaseList',
        payload: response,
      });
    },
    *fetchCaseListEditCreate({ payload }, { call, put }) {
      const response = yield call(getCaseListEditCreate, payload);
      yield put({
        type: 'CaseListEditCreate',
        payload: response,
      });
    },
    *fetchUpdateCaseNm({ payload,payload1,payload2}, { call, put }) {
      const response = yield call(updateCaseNm, payload,payload1,payload2);
      yield put({
        type: 'UpdateCaseNm',
        payload: response,
      });
      if (response.result === true) {
        message.info(response.message.replace(/\{|}/g,''));
      }else{
        message.error(response.message.replace(/\{|}/g,''));
      }
      yield put({
        type: 'SetResultFlag',
        payload: response.result,
      });
    },

    *fetchEndUserList({ payload }, { call, put }) {
      const response = yield call(getEndUsers, payload);
      yield put({
        type: 'EndUserList',
        payload: response,
      });
    },
    *fetchAllEndUserList({ payload }, { call, put }) {
      const response = yield call(getAllEndUsers, payload);
      yield put({
        type: 'AllEndUserList',
        payload: response,
      });
    },
    *fetchCodeValueList({ payload }, { call, put }) {
      const response = yield call(getCodeValues, payload);
      yield put({
        type: 'CodeValueList',
        payload: response,
      });
    },
    *fetchUserList({ payload }, { call, put }) {
      const response = yield call(getBusUserInfo, payload);
      yield put({
        type: 'UserList',
        payload: response,
      });
    },
    *fetchInputUserList({ payload }, { call, put }) {
      const response = yield call(getBusUserInfo, payload);
      yield put({
        type: 'InputUserList',
        payload: response,
      });
    },
    *fetchBusinessActivitiesList({ payload }, { call, put }) {
      const response = yield call(getBusinessActivities, payload);
      yield put({
        type: 'BusinessActivitiesList',
        payload: response,
      });
      yield put({
        type: 'SetResultFlag',
        payload: response.result,
      });
    },
    *fetchDBusActHeadList({ payload }, { call, put }) {
      const response = yield call(getBusinessActivityHeaders, payload);
      yield put({
        type: 'DBusActHeadList',
        payload: response,
      });
      yield put({
        type: 'SetResultFlag',
        payload: response.result,
      });
    },
    *fetchEditDBusActHeadList({ payload }, { call, put }) {
      const response = yield call(getBusinessActivityHeaders, payload);
      yield put({
        type: 'EditDBusActHeadList',
        payload: response,
      });
      yield put({
        type: 'SetResultFlag',
        payload: response.result,
      });
    },
    *fetchBusinessActivityDtlList({ payload }, { call, put }) {
      const response = yield call(getBusinessActivityDtls, payload);
      yield put({
        type: 'BusinessActivityDtlList',
        payload: response,
      });
    },
    *deleteBusinessActivity({ payload }, { call, put }) {
      const response = yield call(deleteBusinessActivity, payload);
      yield put({
        type: 'DeleteBusinessActivity',
        payload: response,
      });
      if (response.result === true) {
        message.info(response.message.replace(/\{|}/g,''));
      }else{
        message.error(response.message.replace(/\{|}/g,''));
      }
      yield put({
        type: 'SetResultFlag',
        payload: response.result,
      });
    },

    *updateBusinessActivityDtl({ payload }, { call, put }) {
      const response = yield call(updateBusinessActivityDtl, payload);
      yield put({
        type: 'UpdateBusinessActivityDtl',
        payload: response,
      });
      if (response.result === true) {
        message.info(response.message.replace(/\{|}/g,''));
      }else{
        message.error(response.message.replace(/\{|}/g,''));
      }
      yield put({
        type: 'SetResultFlag',
        payload: response.result,
      });
    },
    *insertBusinessActivityDtl({ payload }, { call, put }) {
      const response = yield call(insertBusinessActivityDtl, payload);
      yield put({
        type: 'InsertBusinessActivityDtl',
        payload: response,
      });
      if (response.result === true) {
        message.info(response.message.replace(/\{|}/g,''));
      }else{
        message.error(response.message.replace(/\{|}/g,''));
      }
      yield put({
        type: 'SetResultFlag',
        payload: response.result,
      });
    },

    *updateBusinessActivityHead({ payload }, { call, put }) {
      const response = yield call(updateBusinessActivityHead, payload);
      yield put({
        type: 'UpdateBusinessActivityHead',
        payload: response,
      });
      if (response.result === true) {
        message.info(response.message.replace(/\{|}/g,''));
      }else{
        message.error(response.message.replace(/\{|}/g,''));
      }
      yield put({
        type: 'SetResultFlag',
        payload: response.result,
      });
    },

    *insertBusinessActivity({ payload }, { call, put }) {
      const response = yield call(insertBusinessActivity, payload);
      yield put({
        type: 'InsertBusinessActivity',
        payload: response,
      });
      if (response.result === true) {
        message.info(response.message.replace(/\{|}/g,''));
      }else{
        message.error(response.message.replace(/\{|}/g,''));
      }
      yield put({
        type: 'SetResultFlag',
        payload: response.result,
      });
    },
    *deleteBusinessActivityFile({ payload }, { call, put }) {
      const response = yield call(deleteBusinessActivityFile, payload);
      yield put({
        type: 'DeleteBusinessActivityFile',
        payload: response,
      });
      if (response.result === true) {
        message.info(response.message.replace(/\{|}/g,''));
      }else{
        message.error(response.message.replace(/\{|}/g,''));
      }
      yield put({
        type: 'SetResultFlag',
        payload: response.result,
      });
    },
  },

  reducers: {
    UserOrgInfo(state, action) {
      console.log("UserOrgInfo");
      console.log(action.payload.data);
      return {
        ...state,
        // @ts-ignore
        ...state.userOrgInfo,
        userOrgInfo: action.payload.data,
      };
    },
    CustomerList(state, action) {
      console.log("CustomerList");
      console.log(action.payload.data);
      return {
        ...state,
        // @ts-ignore
        ...state.customerList,
        customerList: action.payload.data,
      };
    },
    AllCustomerList(state, action) {
      console.log("AllCustomerList");
      console.log(action.payload.data);
      return {
        ...state,
        // @ts-ignore
        ...state.allCustomerList,
        allCustomerList: action.payload.data,
      };
    },
    SearchCustomerList(state, action) {
      console.log("SearchCustomerList");
      console.log(action.payload.data);
      return {
        ...state,
        // @ts-ignore
        ...state.customerList,
        searchCustomerList: action.payload.data,
      };
    },
    CaseList(state, action) {
      console.log("CaseList");
      console.log(action.payload.data);
      return {
        ...state,
        // @ts-ignore
        ...state.caseList,
        caseList: action.payload.data,
      };
    },
    CaseListEditCreate(state, action) {
      console.log("caseListEditCreate");
      console.log(action.payload.data);
      return {
        ...state,
        // @ts-ignore
        ...state.caseListEditCreate,
        caseListEditCreate: action.payload.data,
      };
    },
    UpdateCaseNm(state, action) {
      console.log("UpdateCaseNm");
      console.log(action.payload.data);
      return {
        ...state,
        // @ts-ignore
        ...state.updateCaseNm,
        updateCaseNm: action.payload.data,
      };
    },
    EndUserList(state, action) {
      console.log("EndUserList");
      console.log(action.payload.data);
      return {
        ...state,
        // @ts-ignore
        ...state.endUserList,
        endUserList: action.payload.data,
      };
    },
    AllEndUserList(state, action) {
      console.log("AllEndUserList");
      console.log(action.payload.data);
      return {
        ...state,
        // @ts-ignore
        ...state.allEndUserList,
        allEndUserList: action.payload.data,
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
    UserList(state, action) {
      console.log("UserList");
      console.log(action.payload.data);
      return {
        ...state,
        // @ts-ignore
        ...state.userList,
        userList: action.payload.data,
      };
    },
    InputUserList(state, action) {
      console.log("InputUserList");
      console.log(action.payload.data);
      return {
        ...state,
        // @ts-ignore
        ...state.inputUserList,
        inputUserList: action.payload.data,
      };
    },
    BusinessActivitiesList(state, action) {
      console.log("BusinessActivitiesList");
      console.log(action.payload.data);
      return {
        ...state,
        // @ts-ignore
        ...state.businessActivitiesList,
        businessActivitiesList: action.payload.data,
      };
    },
    DBusActHeadList(state, action) {
      console.log("DBusActHeadList");
      console.log(action.payload.data);
      return {
        ...state,
        // @ts-ignore
        ...state.bBusActHeadDataList,
        bBusActHeadDataList: action.payload.data,
      };
    },
    EditDBusActHeadList(state, action) {
      console.log("EditDBusActHeadList");
      console.log(action.payload.data);
      return {
        ...state,
        // @ts-ignore
        ...state.editDBusActHeadDataList,
        editDBusActHeadDataList: action.payload.data,
      };
    },
    BusinessActivityDtlList(state, action) {
      console.log("BusinessActivityDtlList");
      console.log(action.payload.data);
      return {
        ...state,
        // @ts-ignore
        ...state.businessActivityDtlList,
        businessActivityDtlList: action.payload.data,
      };
    },
    UpdateBusinessActivityDtl(state, action) {
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
    DeleteBusinessActivity(state, action) {
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
    InsertBusinessActivityDtl(state, action) {
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
    UpdateBusinessActivityHead(state, action) {
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
    InsertBusinessActivity(state, action) {
      console.log("InsertBusinessActivity");
      console.log(action.payload.data);
      console.log(state);

      if (!action.payload.result){
        return ;
      }

      // @ts-ignore
      let {editDBusActHeadDataList} = state;

      if (editDBusActHeadDataList !== null &&  undefined !== editDBusActHeadDataList){
        editDBusActHeadDataList.push(action.payload.data);
      }else
      {
        editDBusActHeadDataList=[];
        editDBusActHeadDataList.push(action.payload.data);
      }
      console.log(editDBusActHeadDataList);
      return {
        ...state,
        // @ts-ignore
        ...state.editDBusActHeadDataList,
        editDBusActHeadDataList,
      };
    },

    DeleteBusinessActivityFile(state, action) {
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
    SetResultFlag(state, action) {
      console.log("SetResultFlag");
      console.log(action);
      return {
        // @ts-ignore
        ...state,
        ...state.resultFlag,
        resultFlag:action.payload === null || undefined === action.payload?false:action.payload,
      };
    },
  },
};

export default Model;
