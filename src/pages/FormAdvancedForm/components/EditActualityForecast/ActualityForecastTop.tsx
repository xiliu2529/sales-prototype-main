import {
  Input,
  Table,
  Select,
  Radio,
  Button,
  message,
  Space,
  AutoComplete,
  Modal,
  Spin,
} from 'antd';
import { connect } from 'umi';
import React, { Component } from 'react';
import { formatMessage } from '@@/plugin-locale/localeExports';
import { ConnectState, UserModelState } from '@/models/connect';
import { Dispatch } from '@@/plugin-dva/connect';
import 'moment/locale/zh-cn';
import {
  ActForecastTopData,
  AuthOrgType,
  CaseType,
  CustomerType,AllCustomerType,AllEndUserType,
  EndUserType,
  FetchBatchAddDataType,
  FetchBottomDataType,
  FetchCaseNoType,
  FetchCaseType,
  IndustryType,
  midDataModel,
  OptionType,
  RunCaseToActTopDataType,
  UserType, ActualityForecastBatchAddStates,
} from '@/pages/FormAdvancedForm/data';
// eslint-disable-next-line import/no-duplicates
import styles from './style.less';
// eslint-disable-next-line import/no-duplicates
import './style.less';
import '@/utils/messageConfig';
import formatUtil from '@/utils/formatUtil';
import EndUserInfo from "@/components/EndUserInfo/EndUserInfo";
import CustomerInfo from "@/components/CustomerInfo/CustomerInfo";

const { Option } = Select;

// 作为参数插入数据
const addCustomerParam = {
  language: '',
  cstmrCd: '',
  cstmrNm: '',
  orgGroupId: '',
};
const addEndUserParam = {
  language: '',
  endUserCd: '',
  endUserNm: '',
  orgGroupId: '',
};

interface TableFormProps {
  dispatch: Dispatch;
  user: UserModelState;
  RunCaseToActTopData: RunCaseToActTopDataType;
  TopOnClose?: any;
  changeTop?: any;
  actForMoth: string;
  nowMonth: string;
  countOrgCd?: string;
  countOrgNm?: string;
  busUserCd?: string;
  busUserNm?: string;
  cntrcCurrCd: string;
  cntrcCurrNm: string;
  effortUnitCd: string;
  effortUnitNm: string;

  userLst: UserType[];
  authOrgCdLst: AuthOrgType[];
  customerLst: CustomerType[];
  allCustomerLst: AllCustomerType[];
  industryLst: IndustryType[];
  caseLst: [];
  probabilityLst: IndustryType[];
  currencyLst: IndustryType[];
  effortUnitLst: IndustryType[];
  endUserLst: EndUserType[];
  allEndUserLst:AllEndUserType[];

  ActForecastData: ActForecastTopData;
  batchAddStates: ActualityForecastBatchAddStates;
}

interface TableDataStates {
  countOrgCd?: string;
  countOrgNm?: string;
  busUserCd?: string;
  busUserNm?: string;
  cstmrCd: string;
  cstmrNm: string;
  caseIndstyCd: string;
  caseIndstyNm: string;
  caseNm: string;
  caseNo: string;
  actForRankCd: string;
  actForRankNm: string;
  cntrcCurrCd: string;
  cntrcCurrNm: string;
  effortUnitCd: string;
  effortUnitNm: string;
  endUserCd: string;
  endUserNm: string;
  memo: string;

  periodFrom: string;
  periodTo: string;
  optionValue: string;
  amount: string;
  effort: string;

  MidDataModel: midDataModel;
  runToActDataUpdate: boolean;

  searchLoading: boolean;
  notEnterTip: string;
  caseNumsValue: CaseType[];
}

const midFormDataModel: midDataModel = {
  amount1: '',
  effort1: '',
  amount2: '',
  effort2: '',
  amount3: '',
  effort3: '',
  amount4: '',
  effort4: '',
  amount5: '',
  effort5: '',
  amount6: '',
  effort6: '',
  amount7: '',
  effort7: '',
  amount8: '',
  effort8: '',
  amount9: '',
  effort9: '',
  amount10: '',
  effort10: '',
  amount11: '',
  effort11: '',
  amount12: '',
  effort12: '',
  totalAmount: '',
  totalEffort: '',
};

// 获取画面实时的值
let currAmount = '';
let currEffort = '1.00';
let currDateFrom = '';
let currDateTo = '';
let currOptionValue = '2';

let caseNo = '';

// バックアップデータ
let formDataBak: FetchBatchAddDataType;

class ActualityForecastTop extends Component<TableFormProps, TableDataStates> {

  constructor(props:Readonly<TableFormProps>) {
    super(props);
    this.state = this.props.batchAddStates? this.props.batchAddStates :{
      // this.state = {
      btnStatus: false,
      // eslint-disable-next-line react/no-unused-state
      countOrgCd: this.props.countOrgCd,
      countOrgNm: this.props.countOrgNm,
      busUserCd: this.props.busUserCd,
      busUserNm: this.props.busUserNm,
      cstmrCd: '',
      cstmrNm: '',
      caseIndstyCd: '',
      caseIndstyNm: '',
      caseNm: '',
      caseNo: '',
      actForRankCd: '',
      actForRankNm: '',
      cntrcCurrCd: this.props.cntrcCurrCd,
      cntrcCurrNm: this.props.cntrcCurrNm,
      effortUnitCd: this.props.effortUnitCd,
      effortUnitNm: this.props.effortUnitNm,
      endUserCd: '',
      endUserNm: '',
      memo: '',

      periodFrom: '',
      periodTo: '',
      optionValue: '2',
      amount: '',
      effort: '1.00',

      // eslint-disable-next-line react/no-unused-state
      MidDataModel: {
        amount1: '',
        effort1: '',
        amount2: '',
        effort2: '',
        amount3: '',
        effort3: '',
        amount4: '',
        effort4: '',
        amount5: '',
        effort5: '',
        amount6: '',
        effort6: '',
        amount7: '',
        effort7: '',
        amount8: '',
        effort8: '',
        amount9: '',
        effort9: '',
        amount10: '',
        effort10: '',
        amount11: '',
        effort11: '',
        amount12: '',
        effort12: '',
        totalAmount: '',
        totalEffort: '',
      },

      runToActDataUpdate: true,

      searchLoading: false,
      notEnterTip: '',
      caseNumsValue: [
        {
          cstmrCd: '',
          caseNm: '',
          caseNo: '',
        },
      ],
      selectedRowKeys: [],
      bugtId:this.props.bugtId,
    };
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static getDerivedStateFromProps(nextProps: TableFormProps, prevState: TableDataStates) {
    if (prevState.amount === '' && prevState.effort === '') {
      // eslint-disable-next-line no-return-assign
      Object.keys(midFormDataModel).forEach((key) => (midFormDataModel[key] = ''));
    }
    // 页面初期 清空页面
    if (
      prevState.amount === '' &&
      prevState.effort === '' &&
      prevState.periodFrom === '' &&
      prevState.periodTo === '' &&
      prevState.optionValue === '2'
    ) {
      currAmount = '';
      currEffort = '1.00';
      currDateFrom = '';
      currDateTo = '';
      currOptionValue = '2';
      // eslint-disable-next-line no-return-assign
      Object.keys(midFormDataModel).forEach((key) => (midFormDataModel[key] = ''));
    }

    if (
      nextProps.RunCaseToActTopData !== null &&
      nextProps.RunCaseToActTopData.busUserNm !== '' &&
      nextProps.RunCaseToActTopData !== undefined &&
      prevState.runToActDataUpdate === true
    ) {
      if(nextProps.RunCaseToActTopData.aomount.toString().indexOf(',')===-1){
        currAmount = nextProps.RunCaseToActTopData.aomount;
      }else{
        currAmount = nextProps.RunCaseToActTopData.aomount.toString().replaceAll(',','');
      }
      if(nextProps.RunCaseToActTopData.effort.toString().indexOf(',')===-1){
        currEffort = nextProps.RunCaseToActTopData.effort;
      }else{
        currEffort = nextProps.RunCaseToActTopData.effort.toString().replaceAll(',','');
      }
      currDateFrom = '';
      currDateTo = '';
      currOptionValue = '2';

      return {
        busUserCd: nextProps.RunCaseToActTopData.busUserCd,
        busUserNm: nextProps.RunCaseToActTopData.busUserNm,
        cstmrCd: nextProps.RunCaseToActTopData.cstmrCd,
        cstmrNm: nextProps.RunCaseToActTopData.cstmrNm,
        caseIndstyCd: nextProps.RunCaseToActTopData.caseIndstyCd,
        caseIndstyNm: nextProps.RunCaseToActTopData.caseIndstyNm,
        caseNm: nextProps.RunCaseToActTopData.caseNm,
        actForRankCd: nextProps.RunCaseToActTopData.actForRankCd,
        actForRankNm: nextProps.RunCaseToActTopData.actForRankNm,
        amount: nextProps.RunCaseToActTopData.aomount,
        cntrcCurrCd: nextProps.RunCaseToActTopData.cntrcCurrCd,
        cntrcCurrNm: nextProps.RunCaseToActTopData.cntrcCurrNm,
        effort: nextProps.RunCaseToActTopData.effort,
        effortUnitCd: nextProps.RunCaseToActTopData.effortUnitCd,
        effortUnitNm: nextProps.RunCaseToActTopData.effortUnitNm,
        customerLst: nextProps.customerLst,
        runToActDataUpdate: false,
      };
    }
    if(prevState.busUserNm === ''){
      return{
        busUserCd:nextProps.busUserCd,
        busUserNm:nextProps.busUserNm,
        searchLoading: nextProps.ActForecastData.setSearchLoading.searchLoading,
      }
    }

    // 契約通貨
    if(prevState.cntrcCurrNm === ''){
      return{
        cntrcCurrCd: nextProps.cntrcCurrCd,
        cntrcCurrNm: nextProps.cntrcCurrNm,
        searchLoading: nextProps.ActForecastData.setSearchLoading.searchLoading,
      }
    }
    // 工数単位
    if(prevState.effortUnitNm === ''){
      return{
        effortUnitCd: nextProps.effortUnitCd,
        effortUnitNm: nextProps.effortUnitNm,
        searchLoading: nextProps.ActForecastData.setSearchLoading.searchLoading,
      }
    }

    if(prevState.countOrgNm==='' && nextProps.countOrgNm !== '') {
      return{
        countOrgCd:nextProps.countOrgCd,
        countOrgNm:nextProps.countOrgNm,
        searchLoading: nextProps.ActForecastData.setSearchLoading.searchLoading,
      }
    }
    return {
      searchLoading: nextProps.ActForecastData.setSearchLoading.searchLoading,
    };
  }

  componentDidMount(){
    // @ts-ignore
    this.props.onRef('ActualityForecastTop',this)
  }

  setTopData = (flag:string) => {
    this.props.changeTop(flag,this.state);
  };

  /**
   * 批量清空
   */
  clearTopDate = () => {

    // 清空 midFormDataModel
    // eslint-disable-next-line no-return-assign
    Object.keys(midFormDataModel).forEach((key) => (midFormDataModel[key] = ''));

    currAmount = '';
    currEffort = '1.00';
    currDateFrom = '';
    currDateTo = '';
    currOptionValue = '2';
    caseNo = '';
    this.setState({
      countOrgCd: this.props.countOrgCd,
      countOrgNm: this.props.countOrgNm,
      busUserCd: this.props.busUserCd,
      busUserNm: this.props.busUserNm,
      cstmrCd: '',
      cstmrNm: '',
      caseIndstyCd: '',
      caseIndstyNm: '',
      caseNm: '',
      caseNo: '',
      actForRankCd: '',
      actForRankNm: '',
      cntrcCurrCd: this.props.cntrcCurrCd,
      cntrcCurrNm: this.props.cntrcCurrNm,
      effortUnitCd: this.props.effortUnitCd,
      effortUnitNm: this.props.effortUnitNm,
      endUserCd: '',
      endUserNm: '',
      memo: '',
      amount: '',
      effort: '1.00',
      periodFrom: '',
      periodTo: '',
      optionValue: '2',
      MidDataModel: midFormDataModel,
    });
    this.customerInfo.clearCustomer();
    this.endUserInfo.clearEndUser();
  }


  onRef = (name:string,ref:any) => {
    switch (name) {
      case 'CustomerInfo':
        this.customerInfo = ref
        break
      case 'EndUserInfo':
        this.endUserInfo = ref
        break
      default:
        break
    }
  }

  /**
   * 批量追加
   */
  // batchAdd = (): boolean => {
  //   // 項目チェック
  //   if(!this.dateCheck()){
  //     return false;
  //   };
  //
  //   // 案件№、工数、エンドユーザー 入力されない
  //   let notEnterValue = '';
  //
  //   // 確率=	受注
  //   if (this.state.actForRankCd === '1') {
  //     // 案件№ ,エンドユーザー 正しく入力する 確認メッセージ
  //     notEnterValue = formatMessage({ id: 'common.message.confirm' });
  //   } else if (
  //     !this.state.cstmrNm &&
  //     !this.state.caseNo &&
  //     !this.state.effort &&
  //     !this.state.endUserNm
  //   ) {
  //     notEnterValue = formatMessage({
  //       id: 'common.message.customerAndCaseNoAndEffortAndEndUserNotInput',
  //     });
  //   } else if (!this.state.cstmrNm && !this.state.caseNo && !this.state.effort) {
  //     notEnterValue = formatMessage({ id: 'common.message.customerAndCaseNoAndEffortNotInput' });
  //   } else if (!this.state.cstmrNm && !this.state.caseNo && !this.state.endUserNm) {
  //     notEnterValue = formatMessage({ id: 'common.message.customerAndCaseNoAndEndUserNotInput' });
  //   } else if (!this.state.caseNo && !this.state.effort && !this.state.endUserNm) {
  //     notEnterValue = formatMessage({ id: 'common.message.caseNoAndEffortAndEndUserNotInput' });
  //   } else if (!this.state.cstmrNm && !this.state.caseNo) {
  //     notEnterValue = formatMessage({ id: 'common.message.customerAndCaseNoNotInput' });
  //   } else if (!this.state.cstmrNm && !this.state.effort) {
  //     notEnterValue = formatMessage({ id: 'common.message.customerAndEffortNotInput' });
  //   } else if (!this.state.cstmrNm && !this.state.endUserNm) {
  //     notEnterValue = formatMessage({ id: 'common.message.customerAndEndUserNotInput' });
  //   } else if (!this.state.caseNo && !this.state.effort) {
  //     notEnterValue = formatMessage({ id: 'common.message.caseNoAndEffortNotInput' });
  //   } else if (!this.state.caseNo && !this.state.endUserNm) {
  //     notEnterValue = formatMessage({ id: 'common.message.caseNoAndEndUserNotInput' });
  //   } else if (!this.state.effort && !this.state.endUserNm) {
  //     notEnterValue = formatMessage({ id: 'common.message.effortAndEndUserNotInput' });
  //   } else if (!this.state.cstmrNm) {
  //     notEnterValue = formatMessage({ id: 'common.message.customerNotInput' });
  //   } else if (!this.state.caseNo) {
  //     notEnterValue = formatMessage({ id: 'common.message.caseNoNotInput' });
  //   } else if (!this.state.effort) {
  //     notEnterValue = formatMessage({ id: 'common.message.effortNotInput' });
  //   } else if (!this.state.endUserNm) {
  //     notEnterValue = formatMessage({ id: 'common.message.endUserNotInput' });
  //   };
  //
  //   // eslint-disable-next-line @typescript-eslint/no-shadow
  //   const midDataModel: midDataModel = {
  //     amount1: this.state.MidDataModel.amount1,
  //     effort1: this.state.MidDataModel.effort1,
  //     amount2: this.state.MidDataModel.amount2,
  //     effort2: this.state.MidDataModel.effort2,
  //     amount3: this.state.MidDataModel.amount3,
  //     effort3: this.state.MidDataModel.effort3,
  //     amount4: this.state.MidDataModel.amount4,
  //     effort4: this.state.MidDataModel.effort4,
  //     amount5: this.state.MidDataModel.amount5,
  //     effort5: this.state.MidDataModel.effort5,
  //     amount6: this.state.MidDataModel.amount6,
  //     effort6: this.state.MidDataModel.effort6,
  //     amount7: this.state.MidDataModel.amount7,
  //     effort7: this.state.MidDataModel.effort7,
  //     amount8: this.state.MidDataModel.amount8,
  //     effort8: this.state.MidDataModel.effort8,
  //     amount9: this.state.MidDataModel.amount9,
  //     effort9: this.state.MidDataModel.effort9,
  //     amount10: this.state.MidDataModel.amount10,
  //     effort10: this.state.MidDataModel.effort10,
  //     amount11: this.state.MidDataModel.amount11,
  //     effort11: this.state.MidDataModel.effort11,
  //     amount12: this.state.MidDataModel.amount12,
  //     effort12: this.state.MidDataModel.effort12,
  //     totalAmount: this.state.MidDataModel.totalAmount,
  //     totalEffort: this.state.MidDataModel.totalEffort,
  //   };
  //
  //   const batchAddDataParam: FetchBatchAddDataType = {
  //     language: this.props.user.currentUser?.dspLang,
  //     actForYear: this.props.user.currentUser?.dspYear,
  //     periodFrom: currDateFrom,
  //     periodTo: currDateTo,
  //     orgGroupId: this.props.user.currentUser?.orgGroupId,
  //
  //     countOrgCd: this.state.countOrgCd,
  //     countOrgNm: this.state.countOrgNm,
  //     busUserCd: this.state.busUserCd,
  //     busUserNm: this.state.busUserNm,
  //     cstmrCd: this.state.cstmrCd,
  //     cstmrNm: this.state.cstmrNm,
  //     caseIndstyCd: this.state.caseIndstyCd,
  //     caseIndstyNm: this.state.caseIndstyNm,
  //     caseNm: this.state.caseNm,
  //     caseNo: this.state.caseNo,
  //     actForRankCd: this.state.actForRankCd,
  //     actForRankNm: this.state.actForRankNm,
  //     cntrcCurrCd: this.state.cntrcCurrCd,
  //     cntrcCurrNm: this.state.cntrcCurrNm,
  //     effortUnitCd: this.state.effortUnitCd,
  //     effortUnitNm: this.state.effortUnitNm,
  //     endUserCd: this.state.endUserCd,
  //     endUserNm: this.state.endUserNm,
  //     memo: this.state.memo,
  //     midDataModel,
  //   };
  //
  //   formDataBak = batchAddDataParam;
  //
  //   this.setState({
  //     notEnterTip: notEnterValue,
  //   });
  //
  //   sessionStorage.setItem('notEnterValue',notEnterValue);
  //   // 案件№、工数、エンドユーザー 入力
  //   if (notEnterValue === '') {
  //     return this.updateOrInsertData();
  //   }
  //   return false;
  // };

  /**
   * 項目チェック
   */
  dateCheck = (): boolean => {

    // 確率=	受注
    if (this.state.actForRankCd === '1') {
      if (!this.state.cstmrNm) {
        message.error(formatMessage({ id: 'actualityForecastBottom.message.customer' }));
        return false;
      }
    }

    if (this.state.cstmrNm.length>100) {
      message.error(formatMessage({id: 'common.message.customerLength'}));
      return false;
    }

    // table各个字段不为空
    if (!this.state.caseNm) {
      message.error(formatMessage({ id: 'actualityForecastBottom.message.case' }));
      return false;
    }

    // 確率=	受注
    if (this.state.actForRankCd === '1') {
      if (!this.state.caseNo) {
        message.error(formatMessage({ id: 'common.error.caseNoNotInput' }));
        return false;
      }
    }

    if (!this.state.actForRankNm) {
      message.error(formatMessage({ id: 'actualityForecastBottom.message.probability' }));
      return false;
    }

    if (!this.state.amount) {
      message.error(formatMessage({ id: 'common.message.inputAmount' }));
      return false;
    }

    if (!this.state.cntrcCurrNm) {
      message.error(formatMessage({ id: 'actualityForecastBottom.message.contractCurrency' }));
      return false;
    }

    if (this.state.effort && this.state.effort !== '0.00' && !this.state.effortUnitNm) {
      message.error(formatMessage({ id: 'actualityForecastBottom.message.effortUnit' }));
      return false;
    }

    if (!this.state.countOrgNm) {
      message.error(formatMessage({ id: 'actualityForecastBottom.message.countOrgNm' }));
      return false;
    }

    if (!this.state.busUserNm) {
      message.error(formatMessage({ id: 'actualityForecastBottom.message.busUserNm' }));
      return false;
    }

    if (!this.state.caseIndstyNm) {
      message.error(formatMessage({ id: 'actualityForecastBottom.message.industry' }));
      return false;
    }

    if (this.state.endUserNm.length>100) {
      message.error(formatMessage({id: 'common.message.endUserNmLength'}));
      return false;
    }

    // 確率=	受注
    if (this.state.actForRankCd === '1') {
      if (!this.state.endUserNm) {
        message.error(formatMessage({ id: 'common.error.endUserNotInput' }));
        return false;
      }
    }

    if (this.state.periodFrom === '') {
      message.error(formatMessage({ id: 'actualityForecastTop.message.starMonth' }));
      return false;
    }

    if (this.state.periodTo === '') {
      message.error(formatMessage({ id: 'actualityForecastTop.message.endMonth' }));
      return false;
    }

    if (this.state.optionValue === '2') {
      message.error(formatMessage({ id: 'actualityForecastTop.message.avgOrSame' }));
      return false;
    }
    return true;
  }

  /**
   * 更新または挿入
   */
  // updateOrInsertData = async (): boolean => {
  //   /**
  //    * 批量添加数据
  //    */
  //   const {dispatch} = this.props;
  //   const actForInfoInsertModel = JSON.stringify(formDataBak);
  //
  //   const actForYear = this.props.user.currentUser?.dspYear;
  //   const actForMoth = this.props.nowMonth;
  //   const inputUserCd = this.props.user.currentUser?.inputUserCds;
  //   const language = this.props.user.currentUser?.dspLang;
  //   const actBottomParam: FetchBottomDataType = {actForYear, actForMoth, inputUserCd, language};
  //   const actForInfoSelectModel = JSON.stringify(actBottomParam);
  //   const orgGroupId = this.props.user.currentUser?.orgGroupId;
  //   const authOrgCd = this.props.user.currentUser?.authOrgCds;
  //   const caseYear = this.props.user.currentUser?.dspYear;
  //   const caseNm = '';
  //   const caseParam: FetchCaseType = {language, caseYear, orgGroupId, authOrgCd, inputUserCd, caseNm};
  //   const caseInfoModel = JSON.stringify(caseParam);
  //   await dispatch({
  //     type: 'ActForecastData/batchAddActData',
  //     payload: {
  //       actForInfoInsertModel,
  //     },
  //     payload1: {
  //       actForInfoSelectModel,
  //     },
  //     payload2: {
  //       caseInfoModel,
  //     },
  //   });
  //
  //   if(this.props.ActForecastData.messageData.result
  //     && !this.props.ActForecastData.modelVisible.topModelVisible){
  //     // 关闭Top画面
  //     // this.props.TopOnClose();
  //     return true;
  //   }
  //     return false;
  // };

  /**
   *  属性赋值
   * @param str 属性名
   * @param value 属性值
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  filedChange = (str: string, value: string) => {
    // eslint-disable-next-line no-eval
    eval(` ( midFormDataModel.${str}=value) `);
  };

  /**
   *  计算个月平均值或者相同值共同方法
   */
  setAvengeOrSameFunction = () => {
    if (currDateFrom === '') {
      return;
    }
    if (currDateTo === '') {
      return;
    }

    const dateFromFarmat = currDateFrom.replace('/', '').replace('-', '');
    const dateToFarmat = currDateTo.replace('/', '').replace('-', '');

    // 開始日 > 終了日
    if (dateFromFarmat > dateToFarmat) {
      message.error(formatMessage({ id: 'actualityForecastTop.message.start>end' }));
      return;
    }

    // 開始日 ～ 終了日 が1年より大きい
    if (
      dateFromFarmat.substring(0, 4) < dateToFarmat.substring(0, 4) &&
      dateFromFarmat.substring(4) < dateToFarmat.substring(4)
    ) {
      message.error(formatMessage({ id: 'actualityForecastTop.message.end>start_oneYear' }));
      return;
    }

    if (currOptionValue === '2') {
      return;
    }

    if (currAmount === '') {
      return;
    }

    // 清空 midFormDataModel
    // eslint-disable-next-line no-return-assign
    Object.keys(midFormDataModel).forEach((key) => (midFormDataModel[key] = ''));

    const monthFrom = dateFromFarmat.substring(4);
    const monthTo = dateToFarmat.substring(4);
    const monthFromInt = parseInt(monthFrom, 10);
    const monthToInt = parseInt(monthTo, 10);

    const amount = parseInt(currAmount, 10);
    let effort;
    if (currEffort.toString().indexOf('.') !== -1) {
      effort = parseFloat(currEffort);
    } else {
      effort = parseInt(currEffort, 10);
    }

    let amountTotal = 0;
    let effortTotal = 0;

    // 单选按钮 为0 average
    if (currOptionValue === '0') {
      let averageAmountTotal = 0;
      let averageEffortTotal = 0;

      const averageAmount = Math.round(amount / (monthToInt - monthFromInt + 1));
      const averageEffort = Math.round((effort / (monthToInt - monthFromInt + 1)) * 100) / 100;

      for (let i = monthFromInt; i <= monthToInt; i += 1) {
        this.filedChange(`amount${i}`, formatUtil.thousandAmountFormat(averageAmount.toString()));
        this.filedChange(`effort${i}`, formatUtil.thousandEffortFormat(averageEffort.toString()));
        averageAmountTotal += averageAmount;
        averageEffortTotal += averageEffort;
      }
      amountTotal = averageAmountTotal;
      effortTotal = averageEffortTotal;
      // 单选按钮 为1 same
    } else if (currOptionValue === '1') {
      let sameAmountTotal = 0;
      let sameEffortTotal = 0;

      const sameAmount = amount;
      const sameEffort = effort;

      for (let i = monthFromInt; i <= monthToInt; i += 1) {
        this.filedChange(`amount${i}`, formatUtil.thousandAmountFormat(sameAmount.toString()));
        this.filedChange(`effort${i}`, formatUtil.thousandEffortFormat(sameEffort.toString()));

        sameAmountTotal += sameAmount;
        sameEffortTotal += sameEffort;
      }

      amountTotal = sameAmountTotal;
      effortTotal = sameEffortTotal;
    }
    // 设定total属性
    this.filedChange(`totalAmount`, formatUtil.thousandAmountFormat(amountTotal.toString()));
    this.filedChange(`totalEffort`, formatUtil.thousandEffortFormat(effortTotal.toFixed(2)));

    this.setState({
      // eslint-disable-next-line react/no-unused-state
      MidDataModel: midFormDataModel,
    });
  };

  /**
   *  开始月变更
   * @param date moment类型日期
   * @param dateString string类型的日期
   */
  // @ts-ignore
  // dataFromChange = (date: moment, dateString: string) => {
  //   if(dateString !== ''){
  //     // 仅可以输入当前年
  //     // @ts-ignore
  //     if(this.props.user.currentUser?.dspYear.toString() !== dateString.substring(0,4)){
  //       message.info(formatMessage({ id: 'common.message.currYear' }));
  //       return;
  //     }
  //   }
  //
  //   this.setState({
  //     periodFrom: dateString,
  //   });
  //   currDateFrom = dateString;
  //   this.setAvengeOrSameFunction();
  // };


  dataFromHandleChange = (e: String) => {
    if (e.toString() !== null) {
      this.setState({
        // @ts-ignore
        periodFrom: e.toString(),
      });
      // @ts-ignore
      currDateFrom = this.props.user.currentUser?.dspYear.toString()+'/'+ e.toString();
      this.setAvengeOrSameFunction();
    }
  };


  /**
   *  终了月变更
   * @param date moment类型日期
   * @param dateString string类型的日期
   */
  // @ts-ignore
  // dataToChange = (date: moment, dateString: string) => {
  //   if(dateString !== ''){
  //     if (this.state.periodFrom === '') {
  //       message.info(formatMessage({ id: 'actualityForecastTop.message.starMonth' }));
  //       return;
  //     }
  //
  //     // 仅可以输入当前年
  //     if(this.state.periodFrom.substring(0,4) !== dateString.substring(0,4)){
  //       message.info(formatMessage({ id: 'common.message.dataInfo' }));
  //       return;
  //     }
  //   }
  //
  //   this.setState({
  //     periodTo: dateString.replace('-', '/'),
  //   });
  //   currDateTo = dateString;
  //   this.setAvengeOrSameFunction();
  // };

  dataToHandleChange = (e: String) => {
    if (e.toString() !== null) {
      if (this.state.periodFrom === '') {
        message.error(formatMessage({ id: 'actualityForecastTop.message.starMonth' }));
        return;
      }

      this.setState({
        periodTo:  e.toString(),
      });
      // @ts-ignore
      currDateTo =this.props.user.currentUser?.dspYear.toString()+'/'+ e.toString();
      this.setAvengeOrSameFunction();
    }
  };

  /**
   *  单选按钮变更
   * @param e 单选按钮的值
   * @param dateString string类型的日期
   */
  onChange = async (e: { target: { value: any } }) => {
    this.setState({
      optionValue: e.target.value,
    });
    currOptionValue = e.target.value;
    this.setAvengeOrSameFunction();
  };

  /**
   *  金额变更
   * @param e amount文本框的值
   */
  onAmountChange = async (e: { target: { value: any } }) => {
    const clearValue = e.target.value.toString().replaceAll(',','');
    const regNum = /^[\d]*$/;
    const newRes = regNum.test(clearValue);
    if (!newRes) {
      return;
    }

    if (clearValue.length > 10) {
      message.error(formatMessage({ id: 'common.message.amountLength' }));
      return;
    }
    // const regValue = formatUtil.thousandAmountFormat(e.target.value.toString());
    this.setState({
      amount: e.target.value.toString(),
    });
    currAmount = clearValue.toString();
    this.setAvengeOrSameFunction();
  };

  /**
   *  金额获得焦点变更
   * @param e amount文本框的值
   */
  onAmountFocusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.toString() !== '') {
      const regValue = e.target.value.toString().replaceAll(',','');
      this.setState({
        amount: regValue.toString(),
      });
    }
  }

  /**
   *  金额失去焦点变更
   * @param e amount文本框的值
   */
  onAmountBlurChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.toString() !== '') {
      const regValue = formatUtil.thousandAmountFormat(e.target.value.toString());
      this.setState({
        amount: regValue.toString(),
      });
    }
  }

  /**
   *  工时变更
   * @param e effort文本框的值
   */
  onEffortChange = async (e: { target: { value: any } }) => {
    const clearValue = e.target.value.toString().replaceAll(',','');
    const regNum = /^[.\d]*$/;
    const newRes = regNum.test(clearValue);
    if (!newRes) {
      return;
    }

    if (clearValue.indexOf('.') !== -1) {
      const integerData = clearValue.substring(0, clearValue.indexOf('.'));
      if (integerData.length > 10) {
        message.error(formatMessage({ id: 'common.message.effortLength' }));
        return;
      }
      const decimalData = clearValue.substring(clearValue.indexOf('.'));
      // decimalData 小数点を含む
      if (decimalData.length > 3) {
        message.error(formatMessage({ id: 'common.message.decimalLength' }));
        return;
      }
    } else if (clearValue.length > 10) {
      message.error(formatMessage({ id: 'common.message.effortLength' }));
      return;
    }

    // const regValue = formatUtil.thousandEffortFormat(e.target.value.toString());
    this.setState({
      effort: e.target.value.toString(),
    });
    currEffort = clearValue;
    this.setAvengeOrSameFunction();
  };

  /**
   *  工数获得焦点变更
   * @param e amount文本框的值
   */
  onEffortFocusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.toString() !== '') {
      const regValue = e.target.value.toString().replaceAll(',','');
      this.setState({
        effort: regValue.toString(),
      });
    }
  }

  /**
   *  工数失去焦点变更
   * @param e amount文本框的值
   */
  onEffortBlurChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.toString() !== '') {
      const regValue = formatUtil.thousandEffortFormat(e.target.value.toString());
      this.setState({
        effort: regValue.toString(),
      });
    }
  }

  /**
   *  total 计算
   * @param e amount1 文本框的值
   */
  totalSum = () => {
    let amount1 = parseInt(midFormDataModel.amount1.replaceAll(',',''),10);
    if(amount1.toString() === 'NaN'){
      amount1 = 0;
    }
    let amount2 = parseInt(midFormDataModel.amount2.replaceAll(',',''),10);
    if(amount2.toString() === 'NaN'){
      amount2 = 0;
    }
    let amount3 = parseInt(midFormDataModel.amount3.replaceAll(',',''),10);
    if(amount3.toString() === 'NaN'){
      amount3 = 0;
    }
    let amount4 = parseInt(midFormDataModel.amount4.replaceAll(',',''),10);
    if(amount4.toString() === 'NaN'){
      amount4 = 0;
    }
    let amount5 = parseInt(midFormDataModel.amount5.replaceAll(',',''),10);
    if(amount5.toString() === 'NaN'){
      amount5 = 0;
    }
    let amount6 = parseInt(midFormDataModel.amount6.replaceAll(',',''),10);
    if(amount6.toString() === 'NaN'){
      amount6 = 0;
    }
    let amount7 = parseInt(midFormDataModel.amount7.replaceAll(',',''),10);
    if(amount7.toString() === 'NaN'){
      amount7 = 0;
    }
    let amount8 = parseInt(midFormDataModel.amount8.replaceAll(',',''),10);
    if(amount8.toString() === 'NaN'){
      amount8 = 0;
    }
    let amount9 = parseInt(midFormDataModel.amount9.replaceAll(',',''),10);
    if(amount9.toString() === 'NaN'){
      amount9 = 0;
    }
    let amount10 = parseInt(midFormDataModel.amount10.replaceAll(',',''),10);
    if(amount10.toString() === 'NaN'){
      amount10 = 0;
    }
    let amount11 = parseInt(midFormDataModel.amount11.replaceAll(',',''),10);
    if(amount11.toString() === 'NaN'){
      amount11 = 0;
    }
    let amount12 = parseInt(midFormDataModel.amount12.replaceAll(',',''),10);
    if(amount12.toString() === 'NaN'){
      amount12 = 0;
    }

    let effort1 = parseFloat(midFormDataModel.effort1.replaceAll(',',''));
    if(effort1.toString() === 'NaN'){
      effort1 = 0.00;
    }
    let effort2 = parseFloat(midFormDataModel.effort2.replaceAll(',',''));
    if(effort2.toString() === 'NaN'){
      effort2 = 0.00;
    }
    let effort3 = parseFloat(midFormDataModel.effort3.replaceAll(',',''));
    if(effort3.toString() === 'NaN'){
      effort3 = 0.00;
    }
    let effort4 = parseFloat(midFormDataModel.effort4.replaceAll(',',''));
    if(effort4.toString() === 'NaN'){
      effort4 = 0.00;
    }
    let effort5 = parseFloat(midFormDataModel.effort5.replaceAll(',',''));
    if(effort5.toString() === 'NaN'){
      effort5 = 0.00;
    }
    let effort6 = parseFloat(midFormDataModel.effort6.replaceAll(',',''));
    if(effort6.toString() === 'NaN'){
      effort6 = 0.00;
    }
    let effort7 = parseFloat(midFormDataModel.effort7.replaceAll(',',''));
    if(effort7.toString() === 'NaN'){
      effort7 = 0.00;
    }
    let effort8 = parseFloat(midFormDataModel.effort8.replaceAll(',',''));
    if(effort8.toString() === 'NaN'){
      effort8 = 0.00;
    }
    let effort9 = parseFloat(midFormDataModel.effort9.replaceAll(',',''));
    if(effort9.toString() === 'NaN'){
      effort9 = 0.00;
    }
    let effort10 = parseFloat(midFormDataModel.effort10.replaceAll(',',''));
    if(effort10.toString() === 'NaN'){
      effort10 = 0.00;
    }
    let effort11 = parseFloat(midFormDataModel.effort11.replaceAll(',',''));
    if(effort11.toString() === 'NaN'){
      effort11 = 0.00;
    }
    let effort12 = parseFloat(midFormDataModel.effort12.replaceAll(',',''));
    if(effort12.toString() === 'NaN'){
      effort12 = 0.00;
    }

    midFormDataModel.totalAmount = formatUtil.thousandAmountFormat((amount1+amount2+amount3+amount4+amount5+amount6+amount7+amount8+amount9+amount10+amount11+amount12).toString());
    midFormDataModel.totalEffort = formatUtil.thousandEffortFormat((effort1+effort2+effort3+effort4+effort5+effort6+effort7+effort8+effort9+effort10+effort11+effort12).toFixed(2));
    this.setState({
      // eslint-disable-next-line react/no-unused-state
      MidDataModel: midFormDataModel,
    });
  };


  /**
   *  各个月 amount 变更
   * @param e amount 文本框的值
   */
  monthAmountChange = (e: { target: { value: any } }  , amount: string) => {
    const clearValue = e.target.value.toString().replaceAll(',','');
    const regNum = /^[.\d]*$/;
    const newRes = regNum.test(clearValue);
    if (!newRes) {
      return;
    }

    if (clearValue.length > 10) {
      message.error(formatMessage({ id: 'common.message.amountLength' }));
      return;
    }

    // const regValue = formatUtil.thousandAmountFormat(e.target.value.toString());
    midFormDataModel[amount] = e.target.value.toString();
    this.setState({
      // eslint-disable-next-line react/no-unused-state
      MidDataModel: midFormDataModel,
    });

    this.totalSum();
  };

  /**
   *  金额获得焦点变更
   * @param e amount文本框的值
   */
  monthAmountFocusChange = (e: React.ChangeEvent<HTMLInputElement>, amount: string) => {
    if (e.toString() !== '') {
      const regValue = e.target.value.toString().replaceAll(',','');
      midFormDataModel[amount] = regValue.toString();
      this.setState({
        MidDataModel: midFormDataModel,
      });
    }
  }

  /**
   *  金额失去焦点变更
   * @param e amount文本框的值
   */
  monthAmountBlurChange = (e: React.ChangeEvent<HTMLInputElement>, amount: string) => {
    if (e.toString() !== '') {
      const regValue = formatUtil.thousandAmountFormat(e.target.value.toString());
      midFormDataModel[amount] = regValue.toString();
      this.setState({
        MidDataModel: midFormDataModel,
      });
    }
  }

  /**
   *  effort 变更
   * @param e effort 文本框的值
   */
  mongthEffortChange = (e: { target: { value: any } }, effort: string) => {
    const clearValue = e.target.value.toString().replaceAll(',','');
    const regNum = /^[.\d]*$/;
    const newRes = regNum.test(clearValue);
    if (!newRes) {
      message.error(formatMessage({ id: 'common.message.number' }));
      return;
    }

    if (clearValue.indexOf('.') !== -1) {
      const integerData = clearValue.substring(0, clearValue.indexOf('.'));
      if (integerData.length > 10) {
        message.error(formatMessage({ id: 'common.message.effortLength' }));
        return;
      }
      const decimalData = clearValue.substring(clearValue.indexOf('.'));
      // decimalData 小数点を含む
      if (decimalData.length > 3) {
        message.error(formatMessage({ id: 'common.message.decimalLength' }));
        return;
      }
    } else if (clearValue.length > 10) {
      message.error(formatMessage({ id: 'common.message.effortLength' }));
      return;
    }

    // const regValue = formatUtil.thousandEffortFormat(e.target.value.toString());
    midFormDataModel[effort] = e.target.value.toString();
    this.setState({
      // eslint-disable-next-line react/no-unused-state
      MidDataModel: midFormDataModel,
    });

    this.totalSum();
  };

  /**
   *  工数获得焦点变更
   * @param e amount文本框的值
   */
  monthEffortFocusChange = (e: React.ChangeEvent<HTMLInputElement>, effort: string) => {
    if (e.toString() !== '') {
      const regValue = e.target.value.toString().replaceAll(',','');
      midFormDataModel[effort] = regValue.toString();
      this.setState({
        MidDataModel: midFormDataModel,
      });
    }
  }

  /**
   *  工数失去焦点变更
   * @param e amount文本框的值
   */
  monthEffortBlurChange = (e: React.ChangeEvent<HTMLInputElement>, effort: string) => {
    if (e.toString() !== '') {
      const regValue = formatUtil.thousandEffortFormat(e.target.value.toString());
      midFormDataModel[effort] = regValue.toString();
      this.setState({
        MidDataModel: midFormDataModel,
      });
    }
  }

  /**
   * 表格中各个字段变更的方法
   * @param e: 变更后的值
   * @param index 数据的索引
   */
  onOrgCdChange = (e: String) => {
    if (e.toString() !== null) {
      if (this.props.authOrgCdLst !== null) {
        let authOrgCdList = this.props.authOrgCdLst;
        authOrgCdList = authOrgCdList.filter((item) => item.orgNm === e.toString());
        let orgCd = '';
        if (authOrgCdList !== undefined && authOrgCdList !== null) {
          orgCd = authOrgCdList[0].orgCd;
        }
        this.setState({
          countOrgCd: orgCd.toString(),
          countOrgNm: e.toString(),
        });
      } else {
        this.setState({
          countOrgCd: '',
          countOrgNm: '',
        });
      }
    }
  };

  businessChargeChange = (e: String) => {
    if (e.toString() !== null) {
      if (this.props.userLst !== null) {
        let userList = this.props.userLst;
        userList = userList.filter((item) => item.userNm === e.toString());
        let userCd = '';
        if (userList !== undefined && userList !== null) {
          userCd = userList[0].userCd;
        }
        this.setState({
          busUserCd: userCd.toString(),
          busUserNm: e.toString(),
        });
      } else {
        this.setState({
          busUserCd: '',
          busUserNm: '',
        });
      }
    }
  };

  // customerChange = (e: String) => {
  //   this.setState({
  //     caseNumsValue:[],
  //   });
  //   if (e===undefined || e.toString() === '') {
  //     this.setState({
  //       cstmrCd: 'undefined',
  //       cstmrNm: '',
  //       caseNm: '',
  //     });
  //     this.caseChange('')
  //     return;
  //   }
  //   if (e.toString() !== null) {
  //     if (this.props.customerLst !== null) {
  //       let customrList = this.props.customerLst;
  //       customrList = customrList.filter((item) => item.cstmrNm.toUpperCase() === e.toString().toUpperCase());
  //       if (customrList !== undefined && customrList !== null && customrList.length > 0) {
  //         const { cstmrCd } = customrList[0];
  //
  //         if(this.props.ActForecastData.caseLst !== undefined && this.props.ActForecastData.caseLst !== null){
  //           const caseOptionsParam: OptionType[] = [];
  //           this.props.ActForecastData.caseLst.cd.forEach((item) => {
  //             if (item.caseNm !== null && item.caseNm !== '' && item.cstmrCd.toString() === cstmrCd.toString()) {
  //               const optionItem: OptionType = {
  //                 value: item.caseNm,
  //               };
  //               caseOptionsParam.push(optionItem);
  //             }
  //           });
  //
  //           if(caseOptionsParam.length === 1){
  //             this.setState({
  //               caseNm: caseOptionsParam[0].value,
  //             });
  //             this.caseChange(caseOptionsParam[0].value)
  //           }else {
  //             this.setState({
  //               caseNm: '',
  //             });
  //             this.caseChange('')
  //           }
  //         }else {
  //           this.setState({
  //             caseNm: '',
  //           });
  //           this.caseChange('')
  //         }
  //
  //         this.setState({
  //           cstmrCd: cstmrCd.toString(),
  //           cstmrNm: e.toString(),
  //         });
  //       } else {
  //         this.setState({
  //           cstmrCd: 'undefined',
  //           cstmrNm: e.toString(),
  //           caseNm: '',
  //         });
  //         this.caseChange('')
  //       }
  //     } else {
  //       this.setState({
  //         cstmrCd: 'undefined',
  //         cstmrNm: e.toString(),
  //         caseNm: '',
  //       });
  //       this.caseChange('')
  //     }
  //   }
  // };

  industryChange = (e: String) => {
    if (e.toString() !== '') {
      if (this.props.industryLst !== null) {
        let industryList = this.props.industryLst;
        industryList = industryList.filter((item) => item.cdNm === e.toString());
        if (industryList !== undefined && industryList !== null) {
          const { cdVal } = industryList[0];
          this.setState({
            caseIndstyCd: cdVal.toString(),
            caseIndstyNm: e.toString(),
          });
        } else {
          this.setState({
            caseIndstyCd: '',
            caseIndstyNm: e.toString(),
          });
        }
      } else {
        this.setState({
          caseIndstyCd: '',
          caseIndstyNm: '',
        });
      }
    }
  };

  caseChange = async (e: String) => {
    if (e !== undefined && e !== null && e.toString() !== '') {
      if(e.length > 100) {
        message.error(formatMessage({ id: 'common.message.caseNmLength' }));
        return;
      }
      this.setState({
        caseNm: e.toString(),
      });

      // if (e.toString() !== '') {
        const caseParam: FetchCaseNoType = {
          caseNm: e.toString(),
          caseYear: this.props.user.currentUser?.dspYear,
          language: this.props.user.currentUser?.dspLang,
          inputUserCd: this.props.user.currentUser?.inputUserCds,
          orgGroupId: this.props.user.currentUser?.orgGroupId,
          authOrgCd: this.props.user.currentUser?.authOrgCds,
        };

        /**
         * 根据 cassNm 查找 caseNumberLit
         */
        const {dispatch} = this.props;
        const caseInfoModel = JSON.stringify(caseParam);
        await dispatch({
          type: 'ActForecastData/fetchCaseNumberLst',
          payload: {
            caseInfoModel,
          },
        });

        const caseNumberOptions: OptionType[] = [];
        if(this.props.ActForecastData.caseNumberLst!==null && this.props.ActForecastData.caseNumberLst.length>0){
          this.props.ActForecastData.caseNumberLst.forEach((item) => {
            const caseParamList = caseNumberOptions.filter((optionItem)=>optionItem.value === item.caseNo)
            if(caseParamList.length===0){
              if (item.caseNo !== null && item.caseNo !== '') {
                const optionItem: OptionType = {
                  value: item.caseNo,
                };
                caseNumberOptions.push(optionItem);
              }
            }
          });
          if(caseNumberOptions.length===0){
            const optionItem: OptionType = {
              value: '',
            };
            caseNumberOptions.push(optionItem);
          }
        }else{
          const optionItem: OptionType = {
            value: '',
          };
          caseNumberOptions.push(optionItem);
        }
      this.setState({
        caseNumsValue: this.props.ActForecastData.caseNumberLst,
      }) ;

        // caseNo 只有一条时 直接显示
        const caseNoList = this.props.ActForecastData.caseNumberLst.filter((item) => item.caseNm === e.toString());
        const otherCaseNoList = this.props.ActForecastData.caseNumberLst.filter((item) => item.caseNm !== e.toString() && item.caseNo !=='');
        if (otherCaseNoList!==undefined && otherCaseNoList!== null && otherCaseNoList.length === 0 &&
          caseNoList !== undefined && caseNoList !== null && caseNoList.length > 0 &&
          caseNumberOptions !== undefined && caseNumberOptions !== null && caseNumberOptions.length ===1) {
          this.setState({
            caseNo: caseNoList[0].caseNo,
          })
        }else if (caseNoList !== undefined && caseNoList !== null && caseNoList.length > 0 &&
          caseNumberOptions !== undefined && caseNumberOptions !== null && caseNumberOptions.length >1) {
            this.setState({
              caseNo: '',
            })
        }
      // }
      // else{
      //   this.setState({
      //     caseNm: '',
      //     caseNo: '',
      //   });
      // }
    }else{
      this.setState({
        caseNm: '',
        caseNo: '',
        caseNumsValue:[],
      });
    }
  };

  caseNumberChange = (e: String) => {
    if (e !== undefined && e !== null && e !== '') {
      if (e.length > 15) {
        message.error(formatMessage({ id: 'common.message.caseNoLength' }));
        return;
      }
      this.setState({
        caseNo: e.toString(),
      });
    } else {
      this.setState({
        caseNo: '',
      });
    }
  };

  probabilityChange = (e: String) => {
    if (e.toString() !== '') {
      if (this.props.probabilityLst !== null) {
        let probabilityList = this.props.probabilityLst;
        probabilityList = probabilityList.filter((item) => item.cdNm === e.toString());
        if (probabilityList !== undefined && probabilityList !== null) {
          const { cdVal } = probabilityList[0];
          this.setState({
            actForRankCd: cdVal.toString(),
            actForRankNm: e.toString(),
          });
        } else {
          this.setState({
            actForRankCd: '',
            actForRankNm: e.toString(),
          });
        }
      } else {
        this.setState({
          actForRankCd: '',
          actForRankNm: '',
        });
      }
    }
  };

  currencyChange = (e: String) => {
    if (e.toString() !== '') {
      if (this.props.currencyLst !== null) {
        let currencyList = this.props.currencyLst;
        currencyList = currencyList.filter((item) => item.cdNm === e.toString());
        if (currencyList !== undefined && currencyList !== null) {
          const { cdVal } = currencyList[0];
          this.setState({
            cntrcCurrCd: cdVal.toString(),
            cntrcCurrNm: e.toString(),
          });
        } else {
          this.setState({
            cntrcCurrCd: '',
            cntrcCurrNm: e.toString(),
          });
        }
      } else {
        this.setState({
          cntrcCurrCd: '',
          cntrcCurrNm: '',
        });
      }
    }
  };

  effortUnitChange = (e: String) => {
    if (e.toString() !== '') {
      if (this.props.effortUnitLst !== null) {
        let effortUnitList = this.props.effortUnitLst;
        effortUnitList = effortUnitList.filter((item) => item.cdNm === e.toString());
        if (effortUnitList !== undefined && effortUnitList !== null) {
          const { cdVal } = effortUnitList[0];
          this.setState({
            effortUnitCd: cdVal.toString(),
            effortUnitNm: e.toString(),
          });
        } else {
          this.setState({
            effortUnitCd: '',
            effortUnitNm: e.toString(),
          });
        }
      } else {
        this.setState({
          effortUnitCd: '',
          effortUnitNm: '',
        });
      }
    }
  };

  handleEndUser= (endUserCds:string,endUserNms:string,index:number) => {
    this.setState({
      endUserCd: endUserCds,
      endUserNm: endUserNms,
    });
  }

  handleCustomer= (cstmrCds:string,cstmrNms:string,caseNms:string,index:number) => {
    this.setState({
      cstmrCd: cstmrCds,
      cstmrNm: cstmrNms,
      caseNm: caseNms,
      caseNumsValue:[],
    });
    this.caseChange(caseNms)
  }

  // endUserChange = (e: String) => {
  //   if (e.toString() !== '') {
  //     // if (e.length > 100) {
  //     //   return;
  //     // }
  //     if (this.props.endUserLst !== null) {
  //       let endUserList = this.props.endUserLst;
  //       endUserList = endUserList.filter((item) => item.endUserNm === e.toString());
  //       if (endUserList !== undefined && endUserList !== null && endUserList.length > 0) {
  //         const { endUserCd } = endUserList[0];
  //         this.setState({
  //           endUserCd: endUserCd.toString(),
  //           endUserNm: e.toString(),
  //         });
  //       } else {
  //         this.setState({
  //           endUserCd: '',
  //           endUserNm: e.toString(),
  //         });
  //       }
  //     } else {
  //       this.setState({
  //         endUserCd: '',
  //         endUserNm: '',
  //       });
  //     }
  //   } else {
  //     this.setState({
  //       endUserCd: '',
  //       endUserNm: '',
  //     });
  //   }
  // };

  /**
   * messageModel 关闭
   * */
  // TopHideModal = () => {
  //   const { dispatch } = this.props;
  //   const visible = false;
  //   dispatch({
  //     type: 'ActForecastData/changeTopModelVisible',
  //     payload: {
  //       visible,
  //     },
  //   });
  // };

  /**
   * messageModel 点击确认
   * */
  // TopConfirm = () => {
  //   // 关闭model
  //   this.TopHideModal();
  //   // eslint-disable-next-line @typescript-eslint/no-shadow
  //   const midDataModel: midDataModel = {
  //     amount1: this.state.MidDataModel.amount1,
  //     effort1: this.state.MidDataModel.effort1,
  //     amount2: this.state.MidDataModel.amount2,
  //     effort2: this.state.MidDataModel.effort2,
  //     amount3: this.state.MidDataModel.amount3,
  //     effort3: this.state.MidDataModel.effort3,
  //     amount4: this.state.MidDataModel.amount4,
  //     effort4: this.state.MidDataModel.effort4,
  //     amount5: this.state.MidDataModel.amount5,
  //     effort5: this.state.MidDataModel.effort5,
  //     amount6: this.state.MidDataModel.amount6,
  //     effort6: this.state.MidDataModel.effort6,
  //     amount7: this.state.MidDataModel.amount7,
  //     effort7: this.state.MidDataModel.effort7,
  //     amount8: this.state.MidDataModel.amount8,
  //     effort8: this.state.MidDataModel.effort8,
  //     amount9: this.state.MidDataModel.amount9,
  //     effort9: this.state.MidDataModel.effort9,
  //     amount10: this.state.MidDataModel.amount10,
  //     effort10: this.state.MidDataModel.effort10,
  //     amount11: this.state.MidDataModel.amount11,
  //     effort11: this.state.MidDataModel.effort11,
  //     amount12: this.state.MidDataModel.amount12,
  //     effort12: this.state.MidDataModel.effort12,
  //     totalAmount: this.state.MidDataModel.totalAmount,
  //     totalEffort: this.state.MidDataModel.totalEffort,
  //   };
  //
  //   const batchAddDataParam: FetchBatchAddDataType = {
  //     language: this.props.user.currentUser?.dspLang,
  //     actForYear: this.props.user.currentUser?.dspYear,
  //     // periodFrom: this.state.periodFrom,
  //     // periodTo: this.state.periodTo,
  //     periodFrom: currDateFrom,
  //     periodTo: currDateTo,
  //     orgGroupId: this.props.user.currentUser?.orgGroupId,
  //
  //     countOrgCd: this.state.countOrgCd,
  //     countOrgNm: this.state.countOrgNm,
  //     busUserCd: this.state.busUserCd,
  //     busUserNm: this.state.busUserNm,
  //     cstmrCd: this.state.cstmrCd,
  //     cstmrNm: this.state.cstmrNm,
  //     caseIndstyCd: this.state.caseIndstyCd,
  //     caseIndstyNm: this.state.caseIndstyNm,
  //     caseNm: this.state.caseNm,
  //     caseNo: this.state.caseNo,
  //     actForRankCd: this.state.actForRankCd,
  //     actForRankNm: this.state.actForRankNm,
  //     cntrcCurrCd: this.state.cntrcCurrCd,
  //     cntrcCurrNm: this.state.cntrcCurrNm,
  //     effortUnitCd: this.state.effortUnitCd,
  //     effortUnitNm: this.state.effortUnitNm,
  //     endUserCd: this.state.endUserCd,
  //     endUserNm: this.state.endUserNm,
  //     memo: this.state.memo,
  //     midDataModel,
  //   };
  //
  //   // 用于当参数插入数据
  //   // @ts-ignore
  //   addCustomerParam.language = this.props.user.currentUser?.dspLang;
  //   addCustomerParam.cstmrCd = this.state.cstmrCd;
  //   addCustomerParam.cstmrNm = this.state.cstmrNm;
  //   // @ts-ignore
  //   addCustomerParam.orgGroupId = this.props.user.currentUser?.orgGroupId;
  //
  //   // @ts-ignore
  //   addEndUserParam.language = this.props.user.currentUser?.dspLang;
  //   addEndUserParam.endUserCd = this.state.endUserCd;
  //   addEndUserParam.endUserNm = this.state.endUserNm;
  //   // @ts-ignore
  //   addEndUserParam.orgGroupId = this.props.user.currentUser?.orgGroupId;
  //
  //   // 插入customer数据
  //   const customerInfoModel = JSON.stringify(addCustomerParam);
  //
  //   // 插入endUser数据
  //   const endUserInfoModel = JSON.stringify(addEndUserParam);
  //
  //   // 更新 customer or endUser 数据
  //   const language = this.props.user.currentUser?.dspLang;
  //   const caseYear = this.props.user.currentUser?.dspYear;
  //   const orgGroupId = this.props.user.currentUser?.orgGroupId;
  //   const caseNm = '';
  //   const caseParam: FetchCaseType = { language, caseYear, orgGroupId, caseNm };
  //   const caseInfoModel = JSON.stringify(caseParam);
  //
  //   // 更新或插入bottom数据
  //   const actForInfoInsertModel = JSON.stringify(batchAddDataParam);
  //
  //   // 更新bottom数据
  //   const actForYear = this.props.user.currentUser?.dspYear;
  //   const actForMoth = this.props.nowMonth;
  //   const inputUserCd = this.props.user.currentUser?.inputUserCds;
  //   const getActBottomParam: FetchBottomDataType = {
  //     actForYear,
  //     actForMoth,
  //     inputUserCd,
  //     language,
  //   };
  //   const actForInfoSelectModel = JSON.stringify(getActBottomParam);
  //
  //   // 插入 customer and endUser
  //   if (this.props.ActForecastData.messageData.data === 'topCustomer+topEndUser') {
  //     /**
  //      * 追加 Customer 和 endUser 数据 (actTop用)
  //      */
  //     const { dispatch } = this.props;
  //
  //     dispatch({
  //       type: 'ActForecastData/addTopCustomerAndEndUserDataInfo',
  //       payload: {
  //         customerInfoModel,
  //       },
  //       payload1: {
  //         endUserInfoModel,
  //       },
  //       payload2: {
  //         caseInfoModel,
  //       },
  //       payload3: {
  //         actForInfoInsertModel,
  //       },
  //       payload4: {
  //         actForInfoSelectModel,
  //       },
  //       payload5: {
  //         caseInfoModel,
  //       },
  //     });
  //     // 插入 customer
  //   } else if (this.props.ActForecastData.messageData.data === 'topCustomer') {
  //     /**
  //      * 追加 customer 数据 (actTop用)
  //      */
  //     const { dispatch } = this.props;
  //     dispatch({
  //       type: 'ActForecastData/addTopCustomerDataInfo',
  //       payload: {
  //         customerInfoModel,
  //       },
  //       payload1: {
  //         caseInfoModel,
  //       },
  //       payload2: {
  //         actForInfoInsertModel,
  //       },
  //       payload3: {
  //         actForInfoSelectModel,
  //       },
  //       payload4: {
  //         caseInfoModel,
  //       },
  //     });
  //
  //     // 插入 endUser
  //   } else if (this.props.ActForecastData.messageData.data === 'topEndUser') {
  //     /**
  //      * 追加 endUser 数据 (actTop用)
  //      */
  //     const { dispatch } = this.props;
  //     dispatch({
  //       type: 'ActForecastData/addTopEndUserDataInfo',
  //       payload: {
  //         endUserInfoModel,
  //       },
  //       payload1: {
  //         caseInfoModel,
  //       },
  //       payload2: {
  //         actForInfoInsertModel,
  //       },
  //       payload3: {
  //         actForInfoSelectModel,
  //       },
  //       payload4: {
  //         caseInfoModel,
  //       },
  //     });
  //   }
  //   if (this.state.notEnterTip === '') {
  //     // 关闭Top画面
  //     this.props.TopOnClose();
  //   }
  // };

  /**
   * 入力ヒント閉じる
   * */
  // notEnterHideModal = () => {
  //   this.setState({
  //     notEnterTip: '',
  //   });
  // };

  /**
   * 入力ヒント確認
   * */
  // notEnterConfirm = () => {
  //   this.setState({
  //     notEnterTip: '',
  //   });
  //   this.updateOrInsertData();
  // };

  render() {

    const {
      userLst,
      authOrgCdLst,
      customerLst,
      industryLst,
      caseLst,
      probabilityLst,
      currencyLst,
      effortUnitLst,
      endUserLst,
      allEndUserLst,
      allCustomerLst
    } = this.props;

    // 定义上部数据(一条空数据)
    const dataSource = [
      {
        countOrgNm: '',
        busUserNm: '',
        customer: ' ',
        industry: ' ',
        case: ' ',
        caseNumber: ' ',
        probability: ' ',
        amount: ' ',
        currency: ' ',
        effort: ' ',
        effortUnit: ' ',
        endUser: ' ',
      },
    ];

    const getOrgCdOption = (list: AuthOrgType[]) => {
      if (!list || list.length < 1) {
        return (
          <Option key={0} value={0}>
            {formatMessage({ id: 'common.message.noSelect' })}
          </Option>
        );
      }
      const listBak = list.filter((item) => item.orgNm !== null && item.orgNm !== '');

      return listBak.map((item) => (
        <Option key={item.orgCd} value={item.orgNm}>
          {item.orgNm}
        </Option>
      ));
    };

    const getUserOption = (list: UserType[]) => {
      if (!list || list.length < 1) {
        return (
          <Option key={0} value={0}>
            {formatMessage({ id: 'common.message.noSelect' })}
          </Option>
        );
      }
      const listBak = list.filter((item) => item.userNm !== null && item.userNm !== '');

      return listBak.map((item) => (
        <Option key={item.userCd} value={item.userNm}>
          {item.userNm}
        </Option>
      ));
    };

    const getIndustryOption = (list: IndustryType[]) => {
      if (!list || list.length < 1) {
        return (
          <Option key={0} value={0}>
            {formatMessage({ id: 'common.message.noSelect' })}
          </Option>
        );
      }
      const listBak = list.filter((item) => item.cdNm !== null && item.cdNm !== '');

      return listBak.map((item) => (
        <Option key={item.cdVal} value={item.cdNm}>
          {item.cdNm}
        </Option>
      ));
    };

    const getProbabilityOption = (list: IndustryType[]) => {
      if (!list || list.length < 1) {
        return (
          <Option key={0} value={0}>
            {formatMessage({ id: 'common.message.noSelect' })}
          </Option>
        );
      }
      const listBak = list.filter((item) => item.cdNm !== null && item.cdNm !== '');
      return listBak.map((item) => (
        <Option key={item.cdVal} value={item.cdNm}>
          {item.cdNm}
        </Option>
      ));
    };

    const getCurrencyLstOption = (list: IndustryType[]) => {
      if (!list || list.length < 1) {
        return (
          <Option key={0} value={0}>
            {formatMessage({ id: 'common.message.noSelect' })}
          </Option>
        );
      }
      const listBak = list.filter((item) => item.cdNm !== null && item.cdNm !== '');
      return listBak.map((item) => (
        <Option key={item.cdVal} value={item.cdNm}>
          {item.cdNm}
        </Option>
      ));
    };

    const getEffortUnitLstOption = (list: IndustryType[]) => {
      if (!list || list.length < 1) {
        return (
          <Option key={0} value={0}>
            {formatMessage({ id: 'common.message.noSelect' })}
          </Option>
        );
      }
      const listBak = list.filter((item) => item.cdNm !== null && item.cdNm !== '');
      return listBak.map((item) => (
        <Option key={item.cdVal} value={item.cdNm}>
          {item.cdNm}
        </Option>
      ));
    };

    // 获取optionValue
    // const customerOptions: OptionType[] = [];
    // if (customerLst !== null && customerLst.length > 0) {
    //   customerLst.forEach((item) => {
    //     if (item.cstmrNm !== null && item.cstmrNm !== '') {
    //       const optionItem: OptionType = {
    //         value: item.cstmrNm,
    //       };
    //       customerOptions.push(optionItem);
    //     }
    //   });
    // } else {
    //   const optionItem: OptionType = {
    //     value: '',
    //   };
    //   customerOptions.push(optionItem);
    // }

    const caseOptions: OptionType[] = [];
    if (caseLst !== null  && caseLst !== undefined && caseLst !=='' && caseLst.name !== null && caseLst.name !=='' && caseLst.name !== undefined && caseLst.name.length > 0) {
      const {cstmrCd} = this.state;

      // 顾客code为空
      if(cstmrCd === '' || cstmrCd === 'undefined'){
        caseLst.name.forEach((item) => {
          if (item.caseNm !== null && item.caseNm !== '') {
            const optionItem: OptionType = {
              value: item.caseNm,
            };
            caseOptions.push(optionItem);
          }
        });
        // 顾客code不为空对查询的caselist进行筛选
      }else {
        caseLst.cd.forEach((item) => {
          if (item.caseNm !== null && item.caseNm !== '' && item.cstmrCd.toString() === cstmrCd) {
            const optionItem: OptionType = {
              value: item.caseNm,
            };
            caseOptions.push(optionItem);
          }
        });
      }
      if(caseOptions.length === 0){
        const optionItem: OptionType = {
          value: '',
        };
        caseOptions.push(optionItem);
      }
    }else{
      const optionItem: OptionType = {
        value: '',
      };
      caseOptions.push(optionItem);
    }

    const caseNumberOptions: OptionType[] = [];
    if (
      this.state.caseNumsValue !== null &&
      this.state.caseNumsValue.length > 0
    ) {

      this.state.caseNumsValue.forEach((item) => {
        const caseParamList = caseNumberOptions.filter(
          (optionItem) => optionItem.value === item.caseNo,
        );
        if (caseParamList.length === 0) {
          if (item.caseNo !== null && item.caseNo !== '') {
            const optionItem: OptionType = {
              value: item.caseNo,
            };
            caseNumberOptions.push(optionItem);
          }
        }
      });
    } else {
      const optionItem: OptionType = {
        value: '',
      };
      caseNumberOptions.push(optionItem);
    }

    // const endUserOptions: OptionType[] = [];
    // if (endUserLst !== null && endUserLst.length > 0) {
    //   endUserLst.forEach((item) => {
    //     if (item.endUserNm !== null && item.endUserNm !== '') {
    //       const optionItem: OptionType = {
    //         value: item.endUserNm,
    //       };
    //       endUserOptions.push(optionItem);
    //     }
    //   });
    // } else {
    //   const optionItem: OptionType = {
    //     value: '',
    //   };
    //   endUserOptions.push(optionItem);
    // }

    const columns = [
      {
        title: formatMessage({ id: 'actualityForecastTop.tableHead.customer' }),
        dataIndex: 'customer',
        key: 'customer',
        width: '200px',
        fixed: 'left',
        render: (text: string) => {
          if (true) {
            return (
              // <AutoComplete
              //   className={styles.select}
              //   dropdownMatchSelectWidth={280}
              //   value={this.state.cstmrNm}
              //   onChange={(e) => this.customerChange(e)}
              //   // @ts-ignore
              //   onSelect={(e) => this.customerChange(e)}
              //   allowClear
              //   options={customerOptions}
              //   filterOption={(inputValue, option) =>
              //     // @ts-ignore
              //     option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
              //   }
              // />
              <CustomerInfo
                id={'customer'}
                cstmrCd={this.state.cstmrCd}
                cstmrNm={this.state.cstmrNm}
                customerLst={customerLst}
                allCustomerLst={allCustomerLst}
                caseLst={caseLst}
                index={0}
                caseFlag="0"
                styleFlag="0"
                itemNm={formatMessage({ id: 'actualityForecastTop.tableHead.customer' })}
                checkLength={100}
                onRef={this.onRef}
                handleCustomer={this.handleCustomer.bind(this)}
                onInputKeyDown={ (e) => {
                  if (e.key === 'Enter') {
                    document.querySelector('#case').focus();
                  }
                }}
                />
            );
          }
          return text;
        },
      },
      {
        title: formatMessage({ id: 'actualityForecastTop.tableHead.case' }),
        dataIndex: 'case',
        key: 'case',
        width: '200px',
        fixed: 'left',
        render: (text: string) => {
          if (true) {
            return (
              <AutoComplete
                id={'case'}
                className={styles.select}
                dropdownMatchSelectWidth={220}
                value={this.state.caseNm}
                onChange={(e) => this.caseChange(e)}
                // @ts-ignore
                onSelect={(e) => this.caseChange(e)}
                allowClear
                options={caseOptions}
                filterOption={(inputValue, option) =>
                  // @ts-ignore
                  option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                }
                onInputKeyDown={ (e) => {
                  if (e.key === 'Enter') {
                    document.querySelector('#caseNumber').focus();
                  }
                }}
              />
            );
          }
          return text;
        },
      },
      {
        title: formatMessage({ id: 'actualityForecastTop.tableHead.caseNumber' }),
        dataIndex: 'caseNumber',
        key: 'caseNumber',
        width: '120px',
        render: () => {
          if (true) {
            return (
              <AutoComplete
                id={'caseNumber'}
                className={styles.select}
                defaultValue={this.state.caseNo}
                onChange={(e) => this.caseNumberChange(e)}
                onSelect={(e) => this.caseNumberChange(e)}
                value={caseNo === ''? this.state.caseNo : caseNo}
                allowClear
                options={caseNumberOptions}
                filterOption={(inputValue, option) =>
                  // @ts-ignore
                  option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                }
                onInputKeyDown={ (e) => {
                  if (e.key === 'Enter') {
                    document.querySelector('#probability').focus();
                  }
                }}
              />
            );
          }
          return this.state.caseNo;
        },
      },
      {
        title: formatMessage({ id: 'actualityForecastTop.tableHead.probability' }),
        dataIndex: 'probability',
        key: 'probability',
        width: '90px',
        render: (text: string) => {
          if (true) {
            return (
              <Select
                id={'probability'}
                className={styles.select}
                value={this.state.actForRankNm}
                // @ts-ignore
                onSelect={(e) => {
                  this.probabilityChange(e);
                  document.querySelector('#contractAmount').focus();
                }}
              >
                {getProbabilityOption(probabilityLst)}
              </Select>
            );
          }
          return text;
        },
      },
      {
        title: formatMessage({ id: 'actualityForecastTop.tableHead.contractAmount' }),
        dataIndex: 'amount',
        key: 'amount',
        width: '100px',
        // eslint-disable-next-line consistent-return
        render: () => {
          if (true) {
            return (
              <Input
                id={'contractAmount'}
                className={styles.amountInput}
                value={this.state.amount.toLocaleString()}
                onChange={this.onAmountChange}
                onFocus={(e) => this.onAmountFocusChange(e)}
                onBlur={(e) => this.onAmountBlurChange(e)}
                onPressEnter={(e) =>{
                  document.querySelector('#contractCurrency').focus();
                }}
              />
            );
          }
        },
      },
      {
        title: formatMessage({ id: 'actualityForecastTop.tableHead.contractCurrency' }),
        dataIndex: 'currency',
        key: 'currency',
        width: '100px',
        render: (text: string) => {
          if (true) {
            return (
              <Select
                id={'contractCurrency'}
                className={styles.select}
                value={this.state.cntrcCurrNm}
                // @ts-ignore
                onSelect={(e) => {
                  this.currencyChange(e);
                  document.querySelector('#effort1').focus();
                }}
              >
                {getCurrencyLstOption(currencyLst)}
              </Select>
            );
          }
          return text;
        },
      },
      {
        title: formatMessage({ id: 'actualityForecastTop.tableHead.effort' }),
        dataIndex: 'effort',
        key: 'effort',
        width: '120px',
        // eslint-disable-next-line consistent-return
        render: () => {
          if (true) {
            return (
              <div>
                <Input
                  id={'effort1'}
                  className={styles.effortInput}
                  value={this.state.effort}
                  onChange={this.onEffortChange}
                  onFocus={(e) => this.onEffortFocusChange(e)}
                  onBlur={(e) => this.onEffortBlurChange(e)}
                  onPressEnter={(e) => {document.querySelector('#effort2').focus();}}
                />
                <Select
                  id={'effort2'}
                  className={styles.effortSelect}
                  value={this.state.effortUnitNm}
                  // @ts-ignore
                  onSelect={(e) => {
                    this.effortUnitChange(e);
                    document.querySelector('#accountingDepartment').focus();
                  }}
                >
                  {getEffortUnitLstOption(effortUnitLst)}
                </Select>
              </div>
            );
          }
        },
      },
      {
        title: formatMessage({ id: 'actualityForecastTop.tableHead.accountingDepartment' }),
        dataIndex: 'accounting',
        key: 'accounting',
        width: '250px',
        render: (text: string) => {
          if (true) {
            return (
              <Select
                id={'accountingDepartment'}
                className={styles.select}
                value={this.state.countOrgNm}
                // @ts-ignore
                onSelect={(e) => {
                  this.onOrgCdChange(e);
                  document.querySelector('#businessCharge').focus();
                }}
              >
                {getOrgCdOption(authOrgCdLst)}
              </Select>
            );
          }
          return text;
        },
      },
      {
        title: formatMessage({ id: 'actualityForecastTop.tableHead.businessCharge' }),
        dataIndex: 'busUserNm',
        key: 'busUserNm',
        width: '150px',
        render: (text: string) => {
          if (true) {
            return (
              <Select
                id={'businessCharge'}
                className={styles.select}
                value={this.state.busUserNm}
                // @ts-ignore
                onSelect={(e) => {
                  this.businessChargeChange(e);
                  document.querySelector('#industry').focus();
                }}
              >
                {getUserOption(userLst)}
              </Select>
            );
          }
          return text;
        },
      },
      {
        title: formatMessage({ id: 'actualityForecastTop.tableHead.industry' }),
        dataIndex: 'industry',
        key: 'industry',
        width: '90px',
        render: (text: string) => {
          if (true) {
            return (
              <Select
                id={'industry'}
                className={styles.select}
                value={this.state.caseIndstyNm}
                // @ts-ignore
                onSelect={(e) => {
                  this.industryChange(e);
                  document.querySelector('#endUser').focus();
                }}
              >
                {getIndustryOption(industryLst)}
              </Select>
            );
          }
          return text;
        },
      },
      {
        title: formatMessage({ id: 'actualityForecastTop.tableHead.endUser' }),
        dataIndex: 'endUser',
        key: 'endUser',
        width: '220px',
        render: (text: string) => {
          if (true) {
            return (
              <EndUserInfo
                id={'endUser'}
                endUserCd={this.state.endUserCd}
                endUserNm={this.state.endUserNm}
                endUserLst={endUserLst}
                allEndUserLst={allEndUserLst}
                index={0}
                itemNm={formatMessage({ id: 'actualityForecastTop.tableHead.endUser' })}
                checkLength={100}
                styleFlag="0"
                onRef={this.onRef}
                handleEndUser={this.handleEndUser.bind(this)}
                onInputKeyDown={ (e) => {
                  if (e.key === 'Enter') {
                    document.querySelector('#periodFrom').focus();
                  }
                }}
              />
            );
          }
          return text;
        },
      },
    ];

    // 中部数据
    const monthDataSource = [
      {
        Jan: '　',
        Feb: '　',
        Mar: '　',
        Apr: '　',
        May: '　',
        Jun: '　',
        Jul: '　',
        Aug: '　',
        Sept: '　',
        Oct: '　',
        Nov: '　',
        Dec: '　',
        total: '　',
      },
    ];

    // 中部列
    const monthColumns = [
      {
        title: formatMessage({ id: 'actualityForecastBottom.month.Jan' }),
        dataIndex: 'Jan',
        key: 'Jan',
        width: '160px',
        render: (text: string) => {
          if (
            (midFormDataModel.amount1 !== null &&
              midFormDataModel.amount1 !== '' &&
              midFormDataModel.amount1 !== undefined &&
              midFormDataModel.amount1 !== 'NaN') ||
            (midFormDataModel.effort1 !== null &&
              midFormDataModel.effort1 !== '' &&
              midFormDataModel.effort1 !== undefined &&
              midFormDataModel.effort1 !== 'NaN')
          ) {
            let amount1 = '';
            let effort1 = '';
            if (
              midFormDataModel.amount1 !== null &&
              midFormDataModel.amount1 !== '' &&
              midFormDataModel.amount1 !== undefined &&
              midFormDataModel.amount1 !== 'NaN'
            ) {
              amount1 = midFormDataModel.amount1;
            } else {
              amount1 = '';
            }
            if (
              midFormDataModel.effort1 !== null &&
              midFormDataModel.effort1 !== '' &&
              midFormDataModel.effort1 !== undefined &&
              midFormDataModel.effort1 !== 'NaN'
            ) {
              effort1 = midFormDataModel.effort1;
            } else {
              effort1 = '';
            }
            return (
              <div className={styles.divClass}>
                <Input
                  className={styles.monthtInput}
                  value={amount1.toLocaleString()}
                  onChange={(e) => this.monthAmountChange(e, 'amount1')}
                  onFocus={(e) => this.monthAmountFocusChange(e, 'amount1')}
                  onBlur={(e) => this.monthAmountBlurChange(e, 'amount1')}
                />
                <Input
                  className={styles.midEffortInput}
                  value={effort1.toLocaleString()}
                  onChange={(e) => this.mongthEffortChange(e, 'effort1')}
                  onFocus={(e) => this.monthEffortFocusChange(e, 'effort1')}
                  onBlur={(e) => this.monthEffortBlurChange(e, 'effort1')}
                />
              </div>
            );
          }
          return text;
        },
      },
      {
        title: formatMessage({ id: 'actualityForecastBottom.month.Feb' }),
        dataIndex: 'Feb',
        key: 'Feb',
        width: '160px',
        render: () => {
          if (
            (midFormDataModel.amount2 !== null &&
              midFormDataModel.amount2 !== '' &&
              midFormDataModel.amount2 !== undefined &&
              midFormDataModel.amount2 !== 'NaN') ||
            (midFormDataModel.effort2 !== null &&
              midFormDataModel.effort2 !== '' &&
              midFormDataModel.effort2 !== undefined &&
              midFormDataModel.effort2 !== 'NaN')
          ) {
            let amount2 = '';
            let effort2 = '';
            if (
              midFormDataModel.amount2 !== null &&
              midFormDataModel.amount2 !== '' &&
              midFormDataModel.amount2 !== undefined &&
              midFormDataModel.amount2 !== 'NaN'
            ) {
              amount2 = midFormDataModel.amount2;
            } else {
              amount2 = '';
            }
            if (
              midFormDataModel.effort2 !== null &&
              midFormDataModel.effort2 !== '' &&
              midFormDataModel.effort2 !== undefined &&
              midFormDataModel.effort2 !== 'NaN'
            ) {
              effort2 = midFormDataModel.effort2;
            } else {
              effort2 = '';
            }
            return (
              <div className={styles.divClass}>
                <Input
                  className={styles.monthtInput}
                  value={amount2}
                  onChange={(e) => this.monthAmountChange(e, 'amount2')}
                  onFocus={(e) => this.monthAmountFocusChange(e, 'amount2')}
                  onBlur={(e) => this.monthAmountBlurChange(e, 'amount2')}
                />
                <Input
                  className={styles.midEffortInput}
                  value={effort2}
                  onChange={(e) => this.mongthEffortChange(e, 'effort2')}
                  onFocus={(e) => this.monthEffortFocusChange(e, 'effort2')}
                  onBlur={(e) => this.monthEffortBlurChange(e, 'effort2')}
                />
              </div>
            );
          }
          return '';
        },
      },
      {
        title: formatMessage({ id: 'actualityForecastBottom.month.Mar' }),
        dataIndex: 'Mar',
        key: 'Mar',
        width: '160px',
        render: () => {
          if (
            (midFormDataModel.amount3 !== null &&
              midFormDataModel.amount3 !== '' &&
              midFormDataModel.amount3 !== undefined &&
              midFormDataModel.amount3 !== 'NaN') ||
            (midFormDataModel.effort3 !== null &&
              midFormDataModel.effort3 !== '' &&
              midFormDataModel.effort3 !== undefined &&
              midFormDataModel.effort3 !== 'NaN')
          ) {
            let amount3 = '';
            let effort3 = '';
            if (
              midFormDataModel.amount3 !== null &&
              midFormDataModel.amount3 !== '' &&
              midFormDataModel.amount3 !== undefined &&
              midFormDataModel.amount3 !== 'NaN'
            ) {
              amount3 = midFormDataModel.amount3;
            } else {
              amount3 = '';
            }
            if (
              midFormDataModel.effort3 !== null &&
              midFormDataModel.effort3 !== '' &&
              midFormDataModel.effort3 !== undefined &&
              midFormDataModel.effort3 !== 'NaN'
            ) {
              effort3 = midFormDataModel.effort3;
            } else {
              effort3 = '';
            }
            return (
              <div className={styles.divClass}>
                <Input
                  className={styles.monthtInput}
                  value={amount3}
                  onChange={(e) => this.monthAmountChange(e, 'amount3')}
                  onFocus={(e) => this.monthAmountFocusChange(e, 'amount3')}
                  onBlur={(e) => this.monthAmountBlurChange(e, 'amount3')}
                />
                <Input
                  className={styles.midEffortInput}
                  value={effort3}
                  onChange={(e) => this.mongthEffortChange(e, 'effort3')}
                  onFocus={(e) => this.monthEffortFocusChange(e, 'effort3')}
                  onBlur={(e) => this.monthEffortBlurChange(e, 'effort3')}
                />
              </div>
            );
          }
          return '';
        },
      },
      {
        title: formatMessage({ id: 'actualityForecastBottom.month.Apr' }),
        dataIndex: 'Apr',
        key: 'Apr',
        width: '160px',
        render: () => {
          if (
            (midFormDataModel.amount4 !== null &&
              midFormDataModel.amount4 !== '' &&
              midFormDataModel.amount4 !== undefined &&
              midFormDataModel.amount4 !== 'NaN') ||
            (midFormDataModel.effort4 !== null &&
              midFormDataModel.effort4 !== '' &&
              midFormDataModel.effort4 !== undefined &&
              midFormDataModel.effort4 !== 'NaN')
          ) {
            let amount4 = '';
            let effort4 = '';
            if (
              midFormDataModel.amount4 !== null &&
              midFormDataModel.amount4 !== '' &&
              midFormDataModel.amount4 !== undefined &&
              midFormDataModel.amount4 !== 'NaN'
            ) {
              amount4 = midFormDataModel.amount4;
            } else {
              amount4 = '';
            }
            if (
              midFormDataModel.effort4 !== null &&
              midFormDataModel.effort4 !== '' &&
              midFormDataModel.effort4 !== undefined &&
              midFormDataModel.effort4 !== 'NaN'
            ) {
              effort4 = midFormDataModel.effort4;
            } else {
              effort4 = '';
            }
            return (
              <div className={styles.divClass}>
                <Input
                  className={styles.monthtInput}
                  value={amount4}
                  onChange={(e) => this.monthAmountChange(e, 'amount4')}
                  onFocus={(e) => this.monthAmountFocusChange(e, 'amount4')}
                  onBlur={(e) => this.monthAmountBlurChange(e, 'amount4')}
                />
                <Input
                  className={styles.midEffortInput}
                  value={effort4}
                  onChange={(e) => this.mongthEffortChange(e, 'effort4')}
                  onFocus={(e) => this.monthEffortFocusChange(e, 'effort4')}
                  onBlur={(e) => this.monthEffortBlurChange(e, 'effort4')}
                />
              </div>
            );
          }
          return '';
        },
      },
      {
        title: formatMessage({ id: 'actualityForecastBottom.month.May' }),
        dataIndex: 'May',
        key: 'May',
        width: '160px',
        render: () => {
          if (
            (midFormDataModel.amount5 !== null &&
              midFormDataModel.amount5 !== '' &&
              midFormDataModel.amount5 !== undefined &&
              midFormDataModel.amount5 !== 'NaN') ||
            (midFormDataModel.effort5 !== null &&
              midFormDataModel.effort5 !== '' &&
              midFormDataModel.effort5 !== undefined &&
              midFormDataModel.effort5 !== 'NaN')
          ) {
            let amount5 = '';
            let effort5 = '';
            if (
              midFormDataModel.amount5 !== null &&
              midFormDataModel.amount5 !== '' &&
              midFormDataModel.amount5 !== undefined &&
              midFormDataModel.amount5 !== 'NaN'
            ) {
              amount5 = midFormDataModel.amount5;
            } else {
              amount5 = '';
            }
            if (
              midFormDataModel.effort5 !== null &&
              midFormDataModel.effort5 !== '' &&
              midFormDataModel.effort5 !== undefined &&
              midFormDataModel.effort5 !== 'NaN'
            ) {
              effort5 = midFormDataModel.effort5;
            } else {
              effort5 = '';
            }
            return (
              <div className={styles.divClass}>
                <Input
                  className={styles.monthtInput}
                  value={amount5}
                  onChange={(e) => this.monthAmountChange(e, 'amount5')}
                  onFocus={(e) => this.monthAmountFocusChange(e, 'amount5')}
                  onBlur={(e) => this.monthAmountBlurChange(e, 'amount5')}
                />
                <Input
                  className={styles.midEffortInput}
                  value={effort5}
                  onChange={(e) => this.mongthEffortChange(e, 'effort5')}
                  onFocus={(e) => this.monthEffortFocusChange(e, 'effort5')}
                  onBlur={(e) => this.monthEffortBlurChange(e, 'effort5')}
                />
              </div>
            );
          }
          return '';
        },
      },
      {
        title: formatMessage({ id: 'actualityForecastBottom.month.Jun' }),
        dataIndex: 'Jun',
        key: 'Jun',
        width: '160px',
        render: () => {
          if (
            (midFormDataModel.amount6 !== null &&
              midFormDataModel.amount6 !== '' &&
              midFormDataModel.amount6 !== undefined &&
              midFormDataModel.amount6 !== 'NaN') ||
            (midFormDataModel.effort6 !== null &&
              midFormDataModel.effort6 !== '' &&
              midFormDataModel.effort6 !== undefined &&
              midFormDataModel.effort6 !== 'NaN')
          ) {
            let amount6 = '';
            let effort6 = '';
            if (
              midFormDataModel.amount6 !== null &&
              midFormDataModel.amount6 !== '' &&
              midFormDataModel.amount6 !== undefined &&
              midFormDataModel.amount6 !== 'NaN'
            ) {
              amount6 = midFormDataModel.amount6;
            } else {
              amount6 = '';
            }
            if (
              midFormDataModel.effort6 !== null &&
              midFormDataModel.effort6 !== '' &&
              midFormDataModel.effort6 !== undefined &&
              midFormDataModel.effort6 !== 'NaN'
            ) {
              effort6 = midFormDataModel.effort6;
            } else {
              effort6 = '';
            }
            return (
              <div className={styles.divClass}>
                <Input
                  className={styles.monthtInput}
                  value={amount6}
                  onChange={(e) => this.monthAmountChange(e, 'amount6')}
                  onFocus={(e) => this.monthAmountFocusChange(e, 'amount6')}
                  onBlur={(e) => this.monthAmountBlurChange(e, 'amount6')}
                />
                <Input
                  className={styles.midEffortInput}
                  value={effort6}
                  onChange={(e) => this.mongthEffortChange(e, 'effort6')}
                  onFocus={(e) => this.monthEffortFocusChange(e, 'effort6')}
                  onBlur={(e) => this.monthEffortBlurChange(e, 'effort6')}
                />
              </div>
            );
          }
          return '';
        },
      },
      {
        title: formatMessage({ id: 'actualityForecastBottom.month.Jul' }),
        dataIndex: 'Jul',
        key: 'Jul',
        width: '160px',
        render: () => {
          if (
            (midFormDataModel.amount7 !== null &&
              midFormDataModel.amount7 !== '' &&
              midFormDataModel.amount7 !== undefined &&
              midFormDataModel.amount7 !== 'NaN') ||
            (midFormDataModel.effort7 !== null &&
              midFormDataModel.effort7 !== '' &&
              midFormDataModel.effort7 !== undefined &&
              midFormDataModel.effort7 !== 'NaN')
          ) {
            let amount7 = '';
            let effort7 = '';
            if (
              midFormDataModel.amount7 !== null &&
              midFormDataModel.amount7 !== '' &&
              midFormDataModel.amount7 !== undefined &&
              midFormDataModel.amount7 !== 'NaN'
            ) {
              amount7 = midFormDataModel.amount7;
            } else {
              amount7 = '';
            }
            if (
              midFormDataModel.effort7 !== null &&
              midFormDataModel.effort7 !== '' &&
              midFormDataModel.effort7 !== undefined &&
              midFormDataModel.effort7 !== 'NaN'
            ) {
              effort7 = midFormDataModel.effort7;
            } else {
              effort7 = '';
            }
            return (
              <div className={styles.divClass}>
                <Input
                  className={styles.monthtInput}
                  value={amount7}
                  onChange={(e) => this.monthAmountChange(e, 'amount7')}
                  onFocus={(e) => this.monthAmountFocusChange(e, 'amount7')}
                  onBlur={(e) => this.monthAmountBlurChange(e, 'amount7')}
                />
                <Input
                  className={styles.midEffortInput}
                  value={effort7}
                  onChange={(e) => this.mongthEffortChange(e, 'effort7')}
                  onFocus={(e) => this.monthEffortFocusChange(e, 'effort7')}
                  onBlur={(e) => this.monthEffortBlurChange(e, 'effort7')}
                />
              </div>
            );
          }
          return '';
        },
      },
      {
        title: formatMessage({ id: 'actualityForecastBottom.month.Aug' }),
        dataIndex: 'Aug',
        key: 'Aug',
        width: '160px',
        render: () => {
          if (
            (midFormDataModel.amount8 !== null &&
              midFormDataModel.amount8 !== '' &&
              midFormDataModel.amount8 !== undefined &&
              midFormDataModel.amount8 !== 'NaN') ||
            (midFormDataModel.effort8 !== null &&
              midFormDataModel.effort8 !== '' &&
              midFormDataModel.effort8 !== undefined &&
              midFormDataModel.effort8 !== 'NaN')
          ) {
            let amount8 = '';
            let effort8 = '';
            if (
              midFormDataModel.amount8 !== null &&
              midFormDataModel.amount8 !== '' &&
              midFormDataModel.amount8 !== undefined &&
              midFormDataModel.amount8 !== 'NaN'
            ) {
              amount8 = midFormDataModel.amount8;
            } else {
              amount8 = '';
            }
            if (
              midFormDataModel.effort8 !== null &&
              midFormDataModel.effort8 !== '' &&
              midFormDataModel.effort8 !== undefined &&
              midFormDataModel.effort8 !== 'NaN'
            ) {
              effort8 = midFormDataModel.effort8;
            } else {
              effort8 = '';
            }
            return (
              <div className={styles.divClass}>
                <Input
                  className={styles.monthtInput}
                  value={amount8}
                  onChange={(e) => this.monthAmountChange(e, 'amount8')}
                  onFocus={(e) => this.monthAmountFocusChange(e, 'amount8')}
                  onBlur={(e) => this.monthAmountBlurChange(e, 'amount8')}
                />
                <Input
                  className={styles.midEffortInput}
                  value={effort8}
                  onChange={(e) => this.mongthEffortChange(e, 'effort8')}
                  onFocus={(e) => this.monthEffortFocusChange(e, 'effort8')}
                  onBlur={(e) => this.monthEffortBlurChange(e, 'effort8')}
                />
              </div>
            );
          }
          return '';
        },
      },
      {
        title: formatMessage({ id: 'actualityForecastBottom.month.Sept' }),
        dataIndex: 'Sept',
        key: 'Sept',
        width: '160px',
        render: () => {
          if (
            (midFormDataModel.amount9 !== null &&
              midFormDataModel.amount9 !== '' &&
              midFormDataModel.amount9 !== undefined &&
              midFormDataModel.amount9 !== 'NaN') ||
            (midFormDataModel.effort9 !== null &&
              midFormDataModel.effort9 !== '' &&
              midFormDataModel.effort9 !== undefined &&
              midFormDataModel.effort9 !== 'NaN')
          ) {
            let amount9 = '';
            let effort9 = '';
            if (
              midFormDataModel.amount9 !== null &&
              midFormDataModel.amount9 !== '' &&
              midFormDataModel.amount9 !== undefined &&
              midFormDataModel.amount9 !== 'NaN'
            ) {
              amount9 = midFormDataModel.amount9;
            } else {
              amount9 = '';
            }
            if (
              midFormDataModel.effort9 !== null &&
              midFormDataModel.effort9 !== '' &&
              midFormDataModel.effort9 !== undefined &&
              midFormDataModel.effort9 !== 'NaN'
            ) {
              effort9 = midFormDataModel.effort9;
            } else {
              effort9 = '';
            }
            return (
              <div className={styles.divClass}>
                <Input
                  className={styles.monthtInput}
                  value={amount9}
                  onChange={(e) => this.monthAmountChange(e, 'amount9')}
                  onFocus={(e) => this.monthAmountFocusChange(e, 'amount9')}
                  onBlur={(e) => this.monthAmountBlurChange(e, 'amount9')}
                />
                <Input
                  className={styles.midEffortInput}
                  value={effort9}
                  onChange={(e) => this.mongthEffortChange(e, 'effort9')}
                  onFocus={(e) => this.monthEffortFocusChange(e, 'effort9')}
                  onBlur={(e) => this.monthEffortBlurChange(e, 'effort9')}
                />
              </div>
            );
          }
          return '';
        },
      },
      {
        title: formatMessage({ id: 'actualityForecastBottom.month.Oct' }),
        dataIndex: 'Oct',
        key: 'Oct',
        width: '160px',
        render: () => {
          if (
            (midFormDataModel.amount10 !== null &&
              midFormDataModel.amount10 !== '' &&
              midFormDataModel.amount10 !== undefined &&
              midFormDataModel.amount10 !== 'NaN') ||
            (midFormDataModel.effort10 !== null &&
              midFormDataModel.effort10 !== '' &&
              midFormDataModel.effort10 !== undefined &&
              midFormDataModel.effort10 !== 'NaN')
          ) {
            let amount10 = '';
            let effort10 = '';
            if (
              midFormDataModel.amount10 !== null &&
              midFormDataModel.amount10 !== '' &&
              midFormDataModel.amount10 !== undefined &&
              midFormDataModel.amount10 !== 'NaN'
            ) {
              amount10 = midFormDataModel.amount10;
            } else {
              amount10 = '';
            }
            if (
              midFormDataModel.effort10 !== null &&
              midFormDataModel.effort10 !== '' &&
              midFormDataModel.effort10 !== undefined &&
              midFormDataModel.effort10 !== 'NaN'
            ) {
              effort10 = midFormDataModel.effort10;
            } else {
              effort10 = '';
            }
            return (
              <div className={styles.divClass}>
                <Input
                  className={styles.monthtInput}
                  value={amount10}
                  onChange={(e) => this.monthAmountChange(e, 'amount10')}
                  onFocus={(e) => this.monthAmountFocusChange(e, 'amount10')}
                  onBlur={(e) => this.monthAmountBlurChange(e, 'amount10')}
                />
                <Input
                  className={styles.midEffortInput}
                  value={effort10}
                  onChange={(e) => this.mongthEffortChange(e, 'effort10')}
                  onFocus={(e) => this.monthEffortFocusChange(e, 'effort10')}
                  onBlur={(e) => this.monthEffortBlurChange(e, 'effort10')}
                />
              </div>
            );
          }
          return '';
        },
      },
      {
        title: formatMessage({ id: 'actualityForecastBottom.month.Nov' }),
        dataIndex: 'Nov',
        key: 'Nov',
        width: '160px',
        render: () => {
          if (
            (midFormDataModel.amount11 !== null &&
              midFormDataModel.amount11 !== '' &&
              midFormDataModel.amount11 !== undefined &&
              midFormDataModel.amount11 !== 'NaN') ||
            (midFormDataModel.effort11 !== null &&
              midFormDataModel.effort11 !== '' &&
              midFormDataModel.effort11 !== undefined &&
              midFormDataModel.effort11 !== 'NaN')
          ) {
            let amount11 = '';
            let effort11 = '';
            if (
              midFormDataModel.amount11 !== null &&
              midFormDataModel.amount11 !== '' &&
              midFormDataModel.amount11 !== undefined &&
              midFormDataModel.amount11 !== 'NaN'
            ) {
              amount11 = midFormDataModel.amount11;
            } else {
              amount11 = '';
            }
            if (
              midFormDataModel.effort11 !== null &&
              midFormDataModel.effort11 !== '' &&
              midFormDataModel.effort11 !== undefined &&
              midFormDataModel.effort11 !== 'NaN'
            ) {
              effort11 = midFormDataModel.effort11;
            } else {
              effort11 = '';
            }
            return (
              <div className={styles.divClass}>
                <Input
                  className={styles.monthtInput}
                  value={amount11}
                  onChange={(e) => this.monthAmountChange(e, 'amount11')}
                  onFocus={(e) => this.monthAmountFocusChange(e, 'amount11')}
                  onBlur={(e) => this.monthAmountBlurChange(e, 'amount11')}
                />
                <Input
                  className={styles.midEffortInput}
                  value={effort11}
                  onChange={(e) => this.mongthEffortChange(e, 'effort11')}
                  onFocus={(e) => this.monthEffortFocusChange(e, 'effort11')}
                  onBlur={(e) => this.monthEffortBlurChange(e, 'effort11')}
                />
              </div>
            );
          }
          return '';
        },
      },
      {
        title: formatMessage({ id: 'actualityForecastBottom.month.Dec' }),
        dataIndex: 'Dec',
        key: 'Dec',
        width: '160px',
        render: () => {
          if (
            (midFormDataModel.amount12 !== null &&
              midFormDataModel.amount12 !== '' &&
              midFormDataModel.amount12 !== undefined &&
              midFormDataModel.amount12 !== 'NaN') ||
            (midFormDataModel.effort12 !== null &&
              midFormDataModel.effort12 !== '' &&
              midFormDataModel.effort12 !== undefined &&
              midFormDataModel.effort12 !== 'NaN')
          ) {
            let amount12 = '';
            let effort12 = '';
            if (
              midFormDataModel.amount12 !== null &&
              midFormDataModel.amount12 !== '' &&
              midFormDataModel.amount12 !== undefined &&
              midFormDataModel.amount12 !== 'NaN'
            ) {
              amount12 = midFormDataModel.amount12;
            } else {
              amount12 = '';
            }
            if (
              midFormDataModel.effort12 !== null &&
              midFormDataModel.effort12 !== '' &&
              midFormDataModel.effort12 !== undefined &&
              midFormDataModel.effort12 !== 'NaN'
            ) {
              effort12 = midFormDataModel.effort12;
            } else {
              effort12 = '';
            }
            return (
              <div className={styles.divClass}>
                <Input
                  className={styles.monthtInput}
                  value={amount12}
                  onChange={(e) => this.monthAmountChange(e, 'amount12')}
                  onFocus={(e) => this.monthAmountFocusChange(e, 'amount12')}
                  onBlur={(e) => this.monthAmountBlurChange(e, 'amount12')}
                />
                <Input
                  className={styles.midEffortInput}
                  value={effort12}
                  onChange={(e) => this.mongthEffortChange(e, 'effort12')}
                  onFocus={(e) => this.monthEffortFocusChange(e, 'effort12')}
                  onBlur={(e) => this.monthEffortBlurChange(e, 'effort12')}
                />
              </div>
            );
          }
          return '';
        },
      },
      {
        title: formatMessage({ id: 'actualityForecastBottom.month.total' }),
        dataIndex: 'total',
        key: 'total',
        width: '200px',
        fixed: 'right',
        render: () => {
          if (
            (midFormDataModel.totalAmount !== null &&
              midFormDataModel.totalAmount !== '' &&
              midFormDataModel.totalAmount !== undefined &&
              midFormDataModel.totalAmount !== 'NaN') ||
            (midFormDataModel.totalEffort !== null &&
              midFormDataModel.totalEffort !== '' &&
              midFormDataModel.totalEffort !== undefined &&
              midFormDataModel.totalEffort !== 'NaN')
          ) {
            let totalAmount = '';
            let totalEffort = '';
            if (
              midFormDataModel.totalAmount !== null &&
              midFormDataModel.totalAmount !== '' &&
              midFormDataModel.totalAmount !== undefined &&
              midFormDataModel.totalAmount !== 'NaN'
            ) {
              totalAmount = midFormDataModel.totalAmount;
            } else {
              totalAmount = '';
            }
            if (
              midFormDataModel.totalEffort !== null &&
              midFormDataModel.totalEffort !== '' &&
              midFormDataModel.totalEffort !== undefined &&
              midFormDataModel.totalEffort !== 'NaN'
            ) {
              totalEffort = midFormDataModel.totalEffort;
            } else {
              totalEffort = '';
            }
            return (
              <div className={styles.divClass}>
                <Space size={20}>
                  <div>{totalAmount}</div>
                  <div>{totalEffort}</div>
                </Space>
              </div>
            );
          }
          return '';
        },
      },
    ];


    const options = [];
    options.push(<option value="01">{formatMessage({ id: 'actualityForecastBottom.month.Jan' })}</option>);
    options.push(<option value="02">{formatMessage({id: 'actualityForecastBottom.month.Feb'})}</option>);
    options.push(<option value="03">{formatMessage({id: 'actualityForecastBottom.month.Mar'})}</option>);
    options.push(<option value="04">{formatMessage({id: 'actualityForecastBottom.month.Apr'})}</option>);
    options.push(<option value="05">{formatMessage({id: 'actualityForecastBottom.month.May'})}</option>);
    options.push(<option value="06">{formatMessage({id: 'actualityForecastBottom.month.Jun'})}</option>);
    options.push(<option value="07">{formatMessage({id: 'actualityForecastBottom.month.Jul'})}</option>);
    options.push(<option value="08">{formatMessage({id: 'actualityForecastBottom.month.Aug'})}</option>);
    options.push(<option value="09">{formatMessage({id: 'actualityForecastBottom.month.Sept'})}</option>);
    options.push(<option value="10">{formatMessage({id: 'actualityForecastBottom.month.Oct'})}</option>);
    options.push(<option value="11">{formatMessage({id: 'actualityForecastBottom.month.Nov'})}</option>);
    options.push(<option value="12">{formatMessage({id: 'actualityForecastBottom.month.Dec'})}</option>);



    return (
      <div className={styles.topHeight}>
        <Spin spinning={this.state.searchLoading}>
          <Table
            className={styles.topTable}
            // @ts-ignore
            columns={columns}
            dataSource={dataSource}
            pagination={false}
            scroll={{ x: '1650px' }}
          />
          <br />
          <div style={{ position: 'relative',  margin: '0 auto',  width: '70%' }}>
            {formatMessage({ id: 'actualityForecastMid.dateInfo.period' })}
            <Select id="periodFrom"
                    style={{ width: '80px' }}
                    placeholder={formatMessage({ id: 'actualityForecastTop.datePicker.placeholder' })}
                    value={this.state.periodFrom === '' ? null : this.state.periodFrom}
                    onSelect={(e) => {
                      this.dataFromHandleChange(e);
                      document.querySelector('#periodTo').focus();
                    }}
            >
              {options}
            </Select>

            <label>　~　</label>
            <Space size={30}>
              <Select id="periodTo"
                      style={{ width: '80px' }}
                      placeholder={formatMessage({ id: 'actualityForecastTop.datePicker.placeholder' })}
                      value={this.state.periodTo === '' ? null : this.state.periodTo}
                      onSelect={(e) => {
                        this.dataToHandleChange(e);
                        document.querySelector('#average').focus();
                      }}
                >
                {options}
              </Select>

              <Radio.Group
                // @ts-ignore
                onChange={this.onChange}
                value={this.state.optionValue}
              >
                defaultPickerValue={null};
                <Radio id='average' value="0">
                  {formatMessage({ id: 'actualityForecastMid.radioButton.average' })}
                </Radio>
                <Radio id='same' value="1">
                  {formatMessage({ id: 'actualityForecastMid.radioButton.same' })}
                </Radio>
              </Radio.Group>

              {/*<Button onClick={this.batchAdd} type="primary" className={styles.addButton}>*/}
              {/* {formatMessage({ id: 'actualityForecastMid.radioButton.add' })}*/}
              {/*</Button>*/}
              <Button onClick={this.clearTopDate} type="primary" className={styles.addButton}>
                {formatMessage({ id: 'actualityForecastMid.radioButton.clear' })}
              </Button>
            </Space>
          </div>
          <br />
          <div>
            <Table
              className={styles.midTable}
              dataSource={monthDataSource}
              // @ts-ignore
              columns={monthColumns}
              pagination={false}
              scroll={{ x: '2120px' }}
            />
          </div>
        </Spin>

        {/*/!* message model *!/*/}
        {/*<Modal*/}
        {/*  visible={this.props.ActForecastData.modelVisible.topModelVisible === true}*/}
        {/*  closable={false}*/}
        {/*  centered={true}*/}
        {/*  onOk={this.props.topConfirm}*/}
        {/*  onCancel={this.TopHideModal}*/}
        {/*  okText={formatMessage({ id: 'actualityForecastTop.messageModel.confirm' })}*/}
        {/*  cancelText={formatMessage({ id: 'actualityForecastTop.messageModel.cancel' })}*/}
        {/*  destroyOnClose*/}
        {/*  maskClosable={false}*/}
        {/*>*/}
        {/*  <p>{this.props.ActForecastData.messageData.message}</p>*/}
        {/*</Modal>*/}

        {/* not entered Prompt model */}
        {/*<Modal*/}
        {/*  visible={this.state.notEnterTip !== ''}*/}
        {/*  closable={false}*/}
        {/*  centered={true}*/}
        {/*  onOk={this.notEnterConfirm}*/}
        {/*  onCancel={this.notEnterHideModal}*/}
        {/*  okText={formatMessage({ id: 'actualityForecastTop.messageModel.confirm' })}*/}
        {/*  cancelText={formatMessage({ id: 'actualityForecastTop.messageModel.cancel' })}*/}
        {/*  destroyOnClose*/}
        {/*  maskClosable={false}*/}
        {/*>*/}
        {/*  <p>{this.state.notEnterTip}</p>*/}
        {/*</Modal>*/}
      </div>
    );
  }
}

export default connect(
  ({
     ActForecastData,
     user,
   }: {
     ActForecastData: any;
     user: ConnectState;
   },
  ) => ({
    ActForecastData,
    user,
  }),
  // @ts-ignore
)(ActualityForecastTop);
