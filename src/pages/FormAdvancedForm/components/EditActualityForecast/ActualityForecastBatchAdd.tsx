import {
  ActForecastTopData,
  ActualityForecastBatchAddStates,
  AllCustomerType, AllEndUserType,
  AuthOrgType,
  CustomerType, DBusActDtl,
  EndUserType, FetchBatchAddDataType, FetchBottomDataType, FetchCaseType,
  IndustryType, midDataModel,
  RunCaseToActTopDataType,
  UserType,
} from '@/pages/FormAdvancedForm/data';
import React, { Component } from 'react';
import {Button, Col, Row, Steps, Space, Modal, Spin} from 'antd';
import ActualityForecastTop from '@/pages/FormAdvancedForm/components/EditActualityForecast/ActualityForecastTop';
import styles from '@/pages/FormAdvancedForm/components/EditActualityForecast/style.less';
import ActualityForecastBatchAddBudget from '@/pages/FormAdvancedForm/components/EditActualityForecast/ActualityForecastBatchAddBudget';
import ActualityForecastBatchAddBusiness from './ActualityForecastBatchAddBusiness';
import { FormOutlined, AccountBookOutlined, FileSyncOutlined } from '@ant-design/icons';
import {formatMessage} from "@@/plugin-locale/localeExports";
import {CodeValueType} from "@/pages/BusinessActivities/data";
import {history,connect} from "umi";
import {ConnectState} from "@/models/connect";

const { Step } = Steps;

interface ActualityForecastBatchAddProps {
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
  caseYear: string;
  RunCaseToActTopData: RunCaseToActTopDataType;
  TopOnClose?: any;
  userLst: UserType[];
  authOrgCdLst: AuthOrgType[];
  customerLst: CustomerType[];
  industryLst: IndustryType[];
  caseLst: [];
  probabilityLst: IndustryType[];
  currencyLst: IndustryType[];
  effortUnitLst: IndustryType[];
  endUserLst: EndUserType[];
  allCustomerLst: AllCustomerType[];
  allEndUserLst:AllEndUserType[];
  codeValueList: CodeValueType[];

  ActForecastData: ActForecastTopData;
}
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
// バックアップデータ
let formDataBak: FetchBatchAddDataType;

class ActualityForecastBatchAdd extends Component<ActualityForecastBatchAddProps,ActualityForecastBatchAddStates> {
  constructor(props: ActualityForecastBatchAddProps | Readonly<ActualityForecastBatchAddProps>) {
    super(props);
    this.state = {
      current: 0,
      clickable: true,
      bugtId: '',
      busActId: '',
      btnStatus: false,
      // eslint-disable-next-line react/no-unused-state
      countOrgCd: props.countOrgCd,
      countOrgNm: props.countOrgNm,
      busUserCd: props.busUserCd,
      busUserNm: props.busUserNm,
      cstmrCd: '',
      cstmrNm: '',
      caseIndstyCd: '',
      caseIndstyNm: '',
      caseNm: '',
      caseNo: '',
      actForRankCd: '',
      actForRankNm: '',
      cntrcCurrCd: props.cntrcCurrCd,
      cntrcCurrNm: props.cntrcCurrNm,
      effortUnitCd: props.effortUnitCd,
      effortUnitNm: props.effortUnitNm,
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
      // selectedRowKeys: [],
    };
  }

  onRef = (name:string,ref:any) => {
    switch (name) {
      case 'ActualityForecastTop':
        this.actualityForecastTop = ref
        break
      case 'ActualityForecastBatchAddBudget':
        this.actualityForecastBatchAddBudget = ref
        break
      case 'ActualityForecastBatchAddBusiness':
        this.actualityForecastBatchAddBusiness = ref
        break
      default:
        break
    }
  };

  /**
   * 批量清空
   */
  clearTopPage = () => {
    this.actualityForecastTop.clearTopDate();
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

    // 清空 midFormDataModel
    // eslint-disable-next-line no-return-assign
    Object.keys(midFormDataModel).forEach((key) => (midFormDataModel[key] = ''));

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
      runToActDataUpdate: true,
      searchLoading: false,
      notEnterTip:'',
      bugtId: '',
      busActId: '',
      MidDataModel: midFormDataModel,
    });
  }

  next = () => {
    this.setState({ current: ( this.state.current += 1) });
  };

  changeStep = (step: number) => {
    this.setState({ current: step });
  };

  changeBugtId = (flag:string, bugtIds: string) => {
    if(flag==='0') {
      this.setState({ bugtId: bugtIds });
    } else {
      this.setState({ bugtId: bugtIds },() => { this.batchAdd();})
    }
  };

  changeBusiness = (flag:string, busActIds: string) => {
    if (flag==='0') {
      this.setState({ busActId: busActIds});
    } else {
      this.setState({ busActId: busActIds, },() => { this.batchAdd();})
    }
  };

  changeTop = (flag:string,states: ActualityForecastBatchAddStates) => {
    if(flag === '0'){
      this.setState({
        countOrgCd: states.countOrgCd,
        countOrgNm: states.countOrgNm,
        busUserCd: states.busUserCd,
        busUserNm: states.busUserNm,
        cstmrCd: states.cstmrCd,
        cstmrNm: states.cstmrNm,
        caseIndstyCd: states.caseIndstyCd,
        caseIndstyNm: states.caseIndstyNm,
        caseNm: states.caseNm,
        caseNo: states.caseNo,
        actForRankCd: states.actForRankCd,
        actForRankNm: states.actForRankNm,
        cntrcCurrCd: states.cntrcCurrCd,
        cntrcCurrNm: states.cntrcCurrNm,
        effortUnitCd: states.effortUnitCd,
        effortUnitNm: states.effortUnitNm,
        endUserCd: states.endUserCd,
        endUserNm: states.endUserNm,
        memo: states.memo,

        periodFrom: states.periodFrom,
        periodTo: states.periodTo,
        optionValue: states.optionValue,
        amount: states.amount,
        effort: states.effort,

        MidDataModel: {
          amount1: states.MidDataModel.amount1,
          effort1: states.MidDataModel.effort1,
          amount2: states.MidDataModel.amount2,
          effort2: states.MidDataModel.effort2,
          amount3: states.MidDataModel.amount3,
          effort3: states.MidDataModel.effort3,
          amount4: states.MidDataModel.amount4,
          effort4: states.MidDataModel.effort4,
          amount5: states.MidDataModel.amount5,
          effort5: states.MidDataModel.effort5,
          amount6: states.MidDataModel.amount6,
          effort6: states.MidDataModel.effort6,
          amount7: states.MidDataModel.amount7,
          effort7: states.MidDataModel.effort7,
          amount8: states.MidDataModel.amount8,
          effort8: states.MidDataModel.effort8,
          amount9: states.MidDataModel.amount9,
          effort9: states.MidDataModel.effort9,
          amount10: states.MidDataModel.amount10,
          effort10: states.MidDataModel.effort10,
          amount11: states.MidDataModel.amount11,
          effort11: states.MidDataModel.effort11,
          amount12: states.MidDataModel.amount12,
          effort12: states.MidDataModel.effort12,
          totalAmount: states.MidDataModel.totalAmount,
          totalEffort: states.MidDataModel.totalEffort,
        },
      });
    }else{
      this.state = states;
    }
  };

  changeIsClickable = (clickable: boolean) => {
    this.setState({clickable: clickable});
  };

  componentDidMount() {
    // @ts-ignore
    this.props.onRef('ActualityForecastBatchAdd',this);
  }

  /**
   * 批量追加
   */
  batchAdd = () => {

    // 案件№、工数、エンドユーザー 入力されない
    let notEnterValue = '';

    // 確率=	受注
    if (this.state.actForRankCd === '1') {
      // 案件№ ,エンドユーザー 正しく入力する 確認メッセージ
      notEnterValue = formatMessage({ id: 'common.message.confirm' });
    } else if (
      !this.state.cstmrNm &&
      !this.state.caseNo &&
      !this.state.effort &&
      !this.state.endUserNm
    ) {
      notEnterValue = formatMessage({
        id: 'common.message.customerAndCaseNoAndEffortAndEndUserNotInput',
      });
    } else if (!this.state.cstmrNm && !this.state.caseNo && !this.state.effort) {
      notEnterValue = formatMessage({ id: 'common.message.customerAndCaseNoAndEffortNotInput' });
    } else if (!this.state.cstmrNm && !this.state.caseNo && !this.state.endUserNm) {
      notEnterValue = formatMessage({ id: 'common.message.customerAndCaseNoAndEndUserNotInput' });
    } else if (!this.state.caseNo && !this.state.effort && !this.state.endUserNm) {
      notEnterValue = formatMessage({ id: 'common.message.caseNoAndEffortAndEndUserNotInput' });
    } else if (!this.state.cstmrNm && !this.state.caseNo) {
      notEnterValue = formatMessage({ id: 'common.message.customerAndCaseNoNotInput' });
    } else if (!this.state.cstmrNm && !this.state.effort) {
      notEnterValue = formatMessage({ id: 'common.message.customerAndEffortNotInput' });
    } else if (!this.state.cstmrNm && !this.state.endUserNm) {
      notEnterValue = formatMessage({ id: 'common.message.customerAndEndUserNotInput' });
    } else if (!this.state.caseNo && !this.state.effort) {
      notEnterValue = formatMessage({ id: 'common.message.caseNoAndEffortNotInput' });
    } else if (!this.state.caseNo && !this.state.endUserNm) {
      notEnterValue = formatMessage({ id: 'common.message.caseNoAndEndUserNotInput' });
    } else if (!this.state.effort && !this.state.endUserNm) {
      notEnterValue = formatMessage({ id: 'common.message.effortAndEndUserNotInput' });
    } else if (!this.state.cstmrNm) {
      notEnterValue = formatMessage({ id: 'common.message.customerNotInput' });
    } else if (!this.state.caseNo) {
      notEnterValue = formatMessage({ id: 'common.message.caseNoNotInput' });
    } else if (!this.state.effort) {
      notEnterValue = formatMessage({ id: 'common.message.effortNotInput' });
    } else if (!this.state.endUserNm) {
      notEnterValue = formatMessage({ id: 'common.message.endUserNotInput' });
    };

    const midDataModel: midDataModel = {
      amount1: this.state.MidDataModel.amount1,
      effort1: this.state.MidDataModel.effort1,
      amount2: this.state.MidDataModel.amount2,
      effort2: this.state.MidDataModel.effort2,
      amount3: this.state.MidDataModel.amount3,
      effort3: this.state.MidDataModel.effort3,
      amount4: this.state.MidDataModel.amount4,
      effort4: this.state.MidDataModel.effort4,
      amount5: this.state.MidDataModel.amount5,
      effort5: this.state.MidDataModel.effort5,
      amount6: this.state.MidDataModel.amount6,
      effort6: this.state.MidDataModel.effort6,
      amount7: this.state.MidDataModel.amount7,
      effort7: this.state.MidDataModel.effort7,
      amount8: this.state.MidDataModel.amount8,
      effort8: this.state.MidDataModel.effort8,
      amount9: this.state.MidDataModel.amount9,
      effort9: this.state.MidDataModel.effort9,
      amount10: this.state.MidDataModel.amount10,
      effort10: this.state.MidDataModel.effort10,
      amount11: this.state.MidDataModel.amount11,
      effort11: this.state.MidDataModel.effort11,
      amount12: this.state.MidDataModel.amount12,
      effort12: this.state.MidDataModel.effort12,
      totalAmount: this.state.MidDataModel.totalAmount,
      totalEffort: this.state.MidDataModel.totalEffort,
    };
    const batchAddDataParam: FetchBatchAddDataType = {
      language: this.props.user.currentUser?.dspLang,
      actForYear: this.props.user.currentUser?.dspYear,
      periodFrom: this.props.user.currentUser?.dspYear.toString()+'/'+ this.state.periodFrom.toString(),
      periodTo: this.props.user.currentUser?.dspYear.toString()+'/'+ this.state.periodTo.toString(),
      orgGroupId: this.props.user.currentUser?.orgGroupId,

      countOrgCd: this.state.countOrgCd,
      countOrgNm: this.state.countOrgNm,
      busUserCd: this.state.busUserCd,
      busUserNm: this.state.busUserNm,
      cstmrCd: this.state.cstmrCd,
      cstmrNm: this.state.cstmrNm,
      caseIndstyCd: this.state.caseIndstyCd,
      caseIndstyNm: this.state.caseIndstyNm,
      caseNm: this.state.caseNm,
      caseNo: this.state.caseNo,
      actForRankCd: this.state.actForRankCd,
      actForRankNm: this.state.actForRankNm,
      cntrcCurrCd: this.state.cntrcCurrCd,
      cntrcCurrNm: this.state.cntrcCurrNm,
      effortUnitCd: this.state.effortUnitCd,
      effortUnitNm: this.state.effortUnitNm,
      endUserCd: this.state.endUserCd,
      endUserNm: this.state.endUserNm,
      memo: this.state.memo,
      bugtId: this.state.bugtId,
      busActId: this.state.busActId,
      midDataModel,
    };

    formDataBak = batchAddDataParam;

    this.setState({
      notEnterTip: notEnterValue,
    });

    // 案件№、工数、エンドユーザー 入力
    if (notEnterValue === '') {
      this.updateOrInsertData();
    }
  };

  /**
   * 更新または挿入
   */
  updateOrInsertData = async () => {
    this.actualityForecastTop.setTopData("1");
    /**
     * 批量添加数据
     */
    const {dispatch} = this.props;
    const actForInfoInsertModel = JSON.stringify(formDataBak);

    const actForYear = this.props.user.currentUser?.dspYear;
    const actForMoth = this.props.nowMonth;
    const inputUserCd = this.props.user.currentUser?.inputUserCds;
    const language = this.props.user.currentUser?.dspLang;
    const actBottomParam: FetchBottomDataType = {actForYear, actForMoth, inputUserCd, language};
    const actForInfoSelectModel = JSON.stringify(actBottomParam);
    const orgGroupId = this.props.user.currentUser?.orgGroupId;
    const authOrgCd = this.props.user.currentUser?.authOrgCds;
    const caseYear = this.props.user.currentUser?.dspYear;
    const caseNm = '';
    const caseParam: FetchCaseType = {language, caseYear, orgGroupId, authOrgCd, inputUserCd, caseNm};
    const caseInfoModel = JSON.stringify(caseParam);
    await dispatch({
      type: 'ActForecastData/batchAddActData',
      payload: {
        actForInfoInsertModel,
      },
      payload1: {
        actForInfoSelectModel,
      },
      payload2: {
        caseInfoModel,
      },
    });

    if(this.props.ActForecastData.messageData.result
      && !this.props.ActForecastData.modelVisible.topModelVisible){
      // 关闭Top画面
      this.props.TopOnClose();
      this.changeStep(0);
      history.push(`/formadvancedformEditAct?id=EditActualityForecast`);
    }
  };

  /**
   * messageModel 关闭
   * */
  TopHideModal = () => {
    const { dispatch } = this.props;
    const visible = false;
    dispatch({
      type: 'ActForecastData/changeTopModelVisible',
      payload: {
        visible,
      },
    });
  };

  /**
   * messageModel 点击确认
   * */
  TopConfirm = () => {
    this.actualityForecastTop.setTopData("1");
    // 关闭model
    this.TopHideModal();
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const midDataModel: midDataModel = {
      amount1: this.state.MidDataModel.amount1,
      effort1: this.state.MidDataModel.effort1,
      amount2: this.state.MidDataModel.amount2,
      effort2: this.state.MidDataModel.effort2,
      amount3: this.state.MidDataModel.amount3,
      effort3: this.state.MidDataModel.effort3,
      amount4: this.state.MidDataModel.amount4,
      effort4: this.state.MidDataModel.effort4,
      amount5: this.state.MidDataModel.amount5,
      effort5: this.state.MidDataModel.effort5,
      amount6: this.state.MidDataModel.amount6,
      effort6: this.state.MidDataModel.effort6,
      amount7: this.state.MidDataModel.amount7,
      effort7: this.state.MidDataModel.effort7,
      amount8: this.state.MidDataModel.amount8,
      effort8: this.state.MidDataModel.effort8,
      amount9: this.state.MidDataModel.amount9,
      effort9: this.state.MidDataModel.effort9,
      amount10: this.state.MidDataModel.amount10,
      effort10: this.state.MidDataModel.effort10,
      amount11: this.state.MidDataModel.amount11,
      effort11: this.state.MidDataModel.effort11,
      amount12: this.state.MidDataModel.amount12,
      effort12: this.state.MidDataModel.effort12,
      totalAmount: this.state.MidDataModel.totalAmount,
      totalEffort: this.state.MidDataModel.totalEffort,
    };

    const batchAddDataParam: FetchBatchAddDataType = {
      language: this.props.user.currentUser?.dspLang,
      actForYear: this.props.user.currentUser?.dspYear,
      periodFrom: this.props.user.currentUser?.dspYear.toString()+'/'+ this.state.periodFrom.toString(),
      periodTo: this.props.user.currentUser?.dspYear.toString()+'/'+ this.state.periodTo.toString(),
      orgGroupId: this.props.user.currentUser?.orgGroupId,

      countOrgCd: this.state.countOrgCd,
      countOrgNm: this.state.countOrgNm,
      busUserCd: this.state.busUserCd,
      busUserNm: this.state.busUserNm,
      cstmrCd: this.state.cstmrCd,
      cstmrNm: this.state.cstmrNm,
      caseIndstyCd: this.state.caseIndstyCd,
      caseIndstyNm: this.state.caseIndstyNm,
      caseNm: this.state.caseNm,
      caseNo: this.state.caseNo,
      actForRankCd: this.state.actForRankCd,
      actForRankNm: this.state.actForRankNm,
      cntrcCurrCd: this.state.cntrcCurrCd,
      cntrcCurrNm: this.state.cntrcCurrNm,
      effortUnitCd: this.state.effortUnitCd,
      effortUnitNm: this.state.effortUnitNm,
      endUserCd: this.state.endUserCd,
      endUserNm: this.state.endUserNm,
      memo: this.state.memo,
      midDataModel,
    };

    // 用于当参数插入数据
    // @ts-ignore
    addCustomerParam.language = this.props.user.currentUser?.dspLang;
    addCustomerParam.cstmrCd = this.state.cstmrCd;
    addCustomerParam.cstmrNm = this.state.cstmrNm;
    // @ts-ignore
    addCustomerParam.orgGroupId = this.props.user.currentUser?.orgGroupId;

    // @ts-ignore
    addEndUserParam.language = this.props.user.currentUser?.dspLang;
    addEndUserParam.endUserCd = this.state.endUserCd;
    addEndUserParam.endUserNm = this.state.endUserNm;
    // @ts-ignore
    addEndUserParam.orgGroupId = this.props.user.currentUser?.orgGroupId;

    // 插入customer数据
    const customerInfoModel = JSON.stringify(addCustomerParam);

    // 插入endUser数据
    const endUserInfoModel = JSON.stringify(addEndUserParam);

    // 更新 customer or endUser 数据
    const language = this.props.user.currentUser?.dspLang;
    const caseYear = this.props.user.currentUser?.dspYear;
    const orgGroupId = this.props.user.currentUser?.orgGroupId;
    const caseNm = '';
    const caseParam: FetchCaseType = { language, caseYear, orgGroupId, caseNm };
    const caseInfoModel = JSON.stringify(caseParam);

    // 更新或插入bottom数据
    const actForInfoInsertModel = JSON.stringify(formDataBak);

    // 更新bottom数据
    const actForYear = this.props.user.currentUser?.dspYear;
    const actForMoth = this.props.nowMonth;
    const inputUserCd = this.props.user.currentUser?.inputUserCds;
    const getActBottomParam: FetchBottomDataType = {
      actForYear,
      actForMoth,
      inputUserCd,
      language,
    };
    const actForInfoSelectModel = JSON.stringify(getActBottomParam);

    // 插入 customer and endUser
    if (this.props.ActForecastData.messageData.data === 'topCustomer+topEndUser') {
      /**
       * 追加 Customer 和 endUser 数据 (actTop用)
       */
      const { dispatch } = this.props;

      dispatch({
        type: 'ActForecastData/addTopCustomerAndEndUserDataInfo',
        payload: {
          customerInfoModel,
        },
        payload1: {
          endUserInfoModel,
        },
        payload2: {
          caseInfoModel,
        },
        payload3: {
          actForInfoInsertModel,
        },
        payload4: {
          actForInfoSelectModel,
        },
        payload5: {
          caseInfoModel,
        },
      });
      // 插入 customer
    } else if (this.props.ActForecastData.messageData.data === 'topCustomer') {
      /**
       * 追加 customer 数据 (actTop用)
       */
      const { dispatch } = this.props;
      dispatch({
        type: 'ActForecastData/addTopCustomerDataInfo',
        payload: {
          customerInfoModel,
        },
        payload1: {
          caseInfoModel,
        },
        payload2: {
          actForInfoInsertModel,
        },
        payload3: {
          actForInfoSelectModel,
        },
        payload4: {
          caseInfoModel,
        },
      });

      // 插入 endUser
    } else if (this.props.ActForecastData.messageData.data === 'topEndUser') {
      /**
       * 追加 endUser 数据 (actTop用)
       */
      const { dispatch } = this.props;
      dispatch({
        type: 'ActForecastData/addTopEndUserDataInfo',
        payload: {
          endUserInfoModel,
        },
        payload1: {
          caseInfoModel,
        },
        payload2: {
          actForInfoInsertModel,
        },
        payload3: {
          actForInfoSelectModel,
        },
        payload4: {
          caseInfoModel,
        },
      });
    }
    if (this.state.notEnterTip === '') {
      // 关闭Top画面
      this.props.TopOnClose();
      this.changeStep(0);
      history.push(`/formadvancedformEditAct?id=EditActualityForecast`);
    }
  };
  /**
   * 入力ヒント閉じる
   * */
  notEnterHideModal = () => {
    this.setState({
      notEnterTip: '',
    });
  };

  /**
   * 入力ヒント確認
   * */
  notEnterConfirm = () => {

    this.actualityForecastTop.setTopData("1");
    this.setState({
      notEnterTip: '',
    });
    this.updateOrInsertData()
  };

  render() {
    return (
      <>
        <Steps
          style={{ width: '70%', textAlign: 'left' ,  height: '30px', marginLeft: '15%' }}
          size="small"
          current={
            // @ts-ignore
            this.state.current
          }
        >
          <Step  title={formatMessage({ id: 'actualityForecastTop.message.caseInformationInput' })}  icon={<FormOutlined />} />
          { this.props.ActForecastData.budActFlg === '1' && (<Step title={formatMessage({ id: 'actualityForecastTop.message.relationshipWithBudget' })} icon={<AccountBookOutlined />} />) }
          <Step title={formatMessage({ id: 'actualityForecastTop.message.relationshipWithBusinessActivities' })} icon={<FileSyncOutlined />} />
        </Steps>
        <div style={{height: '8px'}}/>
        {
          // @ts-ignore
          this.state.current === 0 && (
            <ActualityForecastTop
              actForMoth={this.props.actForMoth}
              nowMonth={this.props.nowMonth}
              countOrgCd={this.props.countOrgCd}
              countOrgNm={this.props.countOrgNm}
              busUserCd={this.props.busUserCd}
              busUserNm={this.props.busUserNm}
              cntrcCurrCd={this.props.cntrcCurrCd}
              cntrcCurrNm={this.props.cntrcCurrNm}
              effortUnitCd={this.props.effortUnitCd}
              effortUnitNm={this.props.effortUnitNm}
              RunCaseToActTopData={this.props.RunCaseToActTopData}
              userLst={this.props.userLst}
              authOrgCdLst={this.props.authOrgCdLst}
              customerLst={this.props.customerLst}
              industryLst={this.props.industryLst}
              caseLst={this.props.caseLst}
              probabilityLst={this.props.probabilityLst}
              currencyLst={this.props.currencyLst}
              effortUnitLst={this.props.effortUnitLst}
              endUserLst={this.props.endUserLst}
              allEndUserLst={this.props.allEndUserLst}
              allCustomerLst={this.props.allCustomerLst}
              batchAddStates={this.state}
              // @ts-ignore
              onRef={this.onRef}
              changeTop={this.changeTop.bind(this)}
            />
          )
        }
        {
          // @ts-ignore
          this.state.current === 1 && (<ActualityForecastBatchAddBudget
            nowMonth={this.props.nowMonth}
            busUserCd={this.props.busUserCd}
            busUserNm={this.props.busUserNm}
            cntrcCurrCd={this.props.cntrcCurrCd}
            cntrcCurrNm={this.props.cntrcCurrNm}
            effortUnitCd={this.props.effortUnitCd}
            effortUnitNm={this.props.effortUnitNm}
            bugtId={this.state.bugtId}
            btnStatus={false}
            onRef={this.onRef}
            changeBugtId={this.changeBugtId.bind(this)}
          />)
        }
        {
          // @ts-ignore
          this.state.current === 2 && <ActualityForecastBatchAddBusiness
            nowMonth={this.props.nowMonth}
            caseNm={this.state.caseNm}
            cstmrNm={this.state.cstmrNm}
            endUserNm={this.state.endUserNm}
            busUserCd={this.props.busUserCd}
            busUserNm={this.props.busUserNm}
            customerLst={this.props.customerLst}
            endUserLst={this.props.endUserLst}
            userLst={this.props.userLst}
            caseLst={this.props.caseLst}
            allEndUserLst={this.props.allEndUserLst}
            allCustomerLst={this.props.allCustomerLst}
            codeValueList={this.props.codeValueList}
            busActId={this.state.busActId}
            btnStatus={false}
            onRef={this.onRef}
            changeIsClickable={this.changeIsClickable.bind(this)}
            changeBusiness={this.changeBusiness.bind(this)}/>
        }
        <div style={{height: '8px'}}/>
        <div style={{textAlign: 'right'}}>
            {
              // @ts-ignore
              this.state.current === 0 && (
                <Space>
                  <Button
                    onClick={() => {
                      // @ts-ignore
                      if (this.actualityForecastTop.dateCheck()) {
                        if (this.props.ActForecastData.budActFlg === '1') {
                          this.changeStep(1);
                        } else {
                          this.changeStep(2);
                        }
                        this.actualityForecastTop.setTopData("0");
                      }
                    }}
                  >
                    {formatMessage({ id: 'actualityForecastTop.button.nextPage' })}
                  </Button>
                  <Button
                    onClick={() => {
                      // @ts-ignore
                      if (this.actualityForecastTop.dateCheck()) {
                        this.actualityForecastTop.setTopData("1");
                        this.batchAdd();
                      }
                    }}
                    type="primary"
                    className={styles.addButton}
                  >
                    {formatMessage({ id: 'actualityForecastTop.button.caseCompletion' })}
                  </Button>
                </Space>
              )
            }
            {
              // @ts-ignore
              this.state.current === 1 && (
                <Space>
                  <Button
                    onClick={() => {
                      this.actualityForecastBatchAddBudget.setBugtId("0");
                      this.changeStep(0);
                    }}
                  >
                    {formatMessage({ id: 'actualityForecastTop.button.previousPage' })}
                  </Button>
                  <Button
                    onClick={() => {
                      this.actualityForecastBatchAddBudget.setBugtId("0");
                      this.changeStep(2);
                    }}
                  >
                    {formatMessage({ id: 'actualityForecastTop.button.nextPage' })}
                  </Button>
                  <Button
                    onClick={() => {
                      // @ts-ignore
                        this.actualityForecastBatchAddBudget.setBugtId("1");
                    }}
                    type="primary"
                    className={styles.addButton}
                  >
                    {formatMessage({ id: 'actualityForecastTop.button.caseCompletion' })}
                  </Button>
                </Space>
              )
            }
            {
              // @ts-ignore
              this.state.current === 2 && (
                <Space>
                  <Button
                    disabled={!this.state.clickable}
                    onClick={() => {
                      if (this.props.ActForecastData.budActFlg === '1' ) {
                        this.changeStep(1);
                      } else {
                        this.changeStep(0);
                      }
                      this.actualityForecastBatchAddBusiness.setBusActId("0");
                    }}
                  >
                    {formatMessage({ id: 'actualityForecastTop.button.previousPage' })}
                  </Button>
                  <Button
                    disabled={!this.state.clickable}
                    onClick={() => {
                      this.actualityForecastBatchAddBusiness.setBusActId("1");
                    }}
                    type="primary"
                    className={styles.addButton}
                  >
                    {formatMessage({ id: 'actualityForecastTop.button.caseCompletion' })}
                  </Button>
                </Space>
              )
            }
        </div>
        {/* message model */}
        <Modal
          visible={this.props.ActForecastData.modelVisible.topModelVisible === true}
          closable={false}
          centered={true}
          onOk={this.TopConfirm}
          onCancel={this.TopHideModal}
          okText={formatMessage({ id: 'actualityForecastTop.messageModel.confirm' })}
          cancelText={formatMessage({ id: 'actualityForecastTop.messageModel.cancel' })}
          destroyOnClose
          maskClosable={false}
        >
          <p>{this.props.ActForecastData.messageData.message}</p>
        </Modal>
        <Modal
          visible={this.state.notEnterTip !== ''}
          closable={false}
          centered={true}
          onOk={this.notEnterConfirm}
          onCancel={this.notEnterHideModal}
          okText={formatMessage({ id: 'actualityForecastTop.messageModel.confirm' })}
          cancelText={formatMessage({ id: 'actualityForecastTop.messageModel.cancel' })}
          destroyOnClose
          maskClosable={false}
        >
          <p>{this.state.notEnterTip}</p>
        </Modal>
      </>
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
) (ActualityForecastBatchAdd);
