import {
  Input,
  Popconfirm,
  Table,
  Select,
  Button,
  Tabs,
  message,
  Checkbox,
  Tooltip,
  Space,
  Modal,
  AutoComplete,
  Spin,
  Menu,
  Dropdown, Drawer,
} from 'antd';
import { connect, Link } from 'umi';
import React, { Component } from 'react';
import type { Dispatch, GlobalModelState, UserModelState } from '@@/plugin-dva/connect';
import type { ConnectState } from '@/models/connect';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import {
  EditOutlined,
  CopyOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
  PlusOutlined,
  DragOutlined,
  WarningTwoTone,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { formatMessage } from '@@/plugin-locale/localeExports';
import type {
  CaseType,
  CustomerType,
  EndUserType,
  IndustryType,
  OptionType,
  ActBottomDataType,
  UpdateBottomDataParamType,
  DeleteBottomDataParamType,
  CopyBottomDataParamType,
  UserType,
  ActForecastTopData,
  FetchBottomDataType,
  FetchCaseNoType,
  FetchCaseType,
  AuthOrgType,
  FetchBatchEditDataType,
  BatchEditTableData,
  CustomerOptionType,
  AllCustomerType,
  AllEndUserType,
} from '@/pages/FormAdvancedForm/data';
// @ts-ignore
// eslint-disable-next-line import/no-duplicates
// eslint-disable-next-line import/no-duplicates
import './style.less';
import '@/utils/messageConfig';
import formatUtil from '@/utils/formatUtil';
import ActualityForecastBatchEdit from '@/pages/FormAdvancedForm/components/EditActualityForecast/ActualityForecastBatchEdit';
import styles from './style.less';
import styleSearch from '@/pages/FormAdvancedForm/components/SearchActualityForecast/style.less';
import CustomerInfo from '@/components/CustomerInfo/CustomerInfo';
import EndUserInfo from '@/components/EndUserInfo/EndUserInfo';
import { CodeValueType } from '@/pages/BusinessActivities/data';
import {
  AccountBookOutlined,
  ArrowsAltOutlined,
  FileSyncOutlined,
  FormOutlined,
  PercentageOutlined,
  SnippetsOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons/lib';
import { history } from '@@/core/history';
import { query } from 'express';
import classNames from 'classnames';
import CaseAch from '@/pages/FormAdvancedForm/components/SearchActualityForecast/CaseAch';
import { ActForecastData } from '@/pages/FormAdvancedForm/components/SearchActualityForecast/data';
import ActualityForecastBatchAdd from '@/pages/FormAdvancedForm/components/EditActualityForecast/ActualityForecastBatchAdd';
import ActualityForecastBatchAddBusiness
  from "@/pages/FormAdvancedForm/components/EditActualityForecast/ActualityForecastBatchAddBusiness";
import ActualityForecastBatchAddBudget
  from "@/pages/FormAdvancedForm/components/EditActualityForecast/ActualityForecastBatchAddBudget";
import ActualityForecastMonthSummary
  from "@/pages/FormAdvancedForm/components/SearchActualityForecast/ActualityForecastMonthSummary"
const { TabPane } = Tabs;
const { Option } = Select;

// 追加ボタンをクリック
let isClickable = true;
// 現在の行数
let columnsNum: number;
// 画面データを保存
let formData: ActBottomDataType[];
// let batchEditFormData: BatchEditTableData;

let indexBak: number;
let formDataBak: UpdateBottomDataParamType;
let currDateFrom = '';
let currDateTo = '';
let onlyEditFlag = false;
let onlyClickCopyFlag = false;
let insertFlag = false;
let updateFlag = false;
let updateBottomLineYesFlag = false;
let updateBottomLineNoFlag = false;
let lineDataUpdateFlag = false;

// パラメータとしてデータ
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
  getNowMonth?: any;

  dispatch: Dispatch;
  ActForecastData: ActForecastTopData;
  searchActForData: ActForecastData;
  user: UserModelState;

  actForMoth: string;
  countOrgCd: string;
  countOrgNm: string;
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
  allEndUserLst: AllEndUserType[];
  codeValueList: CodeValueType[];

  noYear: string;
  lastYearMonthList: any[];
  global: GlobalModelState;
  visibleFlag: boolean;
}

interface TableDataStates {
  actForMoth: string;
  bottomTableData: ActBottomDataType[];
  batchEditTableData: BatchEditTableData;
  // batchEditable: boolean;
  batchEditModelVisible: boolean;
  copyButtonVisible: boolean;
  moveButtonVisible: boolean;
  periodFrom: string;
  periodTo: string;

  deletePop: boolean;

  searchLoading: boolean;
  batchEditTipModel: boolean;
  bottomLineUpdateModel: boolean;
  notEnterTip: string;
  caseNumsValue: CaseType[];
  caseAchVisible: boolean;
  cseeAchTitle: string;
  topVisible1:boolean;
  topVisible2:boolean;

  cstmrNm: string;
  endUserNm: string;
  caseNm: string;
  relatedNo: string;
  busActId: string;
  bugtId: string;

  summaryCstmrCd: string;
  summaryCstmrNm: string;
  summaryEndUserCd: string;
  summaryEndUserNm: string;
}

// 获取系统当前月
const myDate = new Date();
const tYear = myDate.getFullYear();
const tMonth = myDate.getMonth();
const currMonth = tMonth + 1;
const nowMonth = currMonth.toString().length === 1? `0${currMonth.toString()}`: currMonth.toString();

class ActualityForecastBottom extends Component<TableFormProps, TableDataStates> {
  state = {
    actForMoth: this.props.actForMoth,
    visibleFlag: true,
    bottomTableData: [
      {
        No: '',
        editable: false,
        checked: false,
        actForId: '',
        actForYear: '',
        actForMoth: '',
        language: '',
        lastEditedUser: this.props.user.currentUser?.userid,

        countOrgCd: '',
        countOrgNm: '',
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
        orderAmt: '',
        cntrcCurrCd: '',
        cntrcCurrNm: '',
        effort: '',
        effortUnitCd: '',
        effortUnitNm: '',
        endUserCd: '',
        endUserNm: '',
        memo: '',
        relatedNo: '',
        bugtId: '',
        busActId: '',
      },
    ],
    batchEditTableData: {
      editable: false,
      actForYear: '',
      countOrgCd: '',
      countOrgNm: '',
      busUserCd: '',
      busUserNm: '',
      cstmrCd: '',
      cstmrNm: '',
      caseIndstyCd: '',
      caseIndstyNm: '',
      caseNm: '',
      caseNo: '',
      endUserCd: '',
      endUserNm: '',
      relatedNo: '',
      valideCount: '',
      totalAmount: '',
      totalEffort: '',
      totalAmountUnit: '',
      totalEffortUnit: '',
      // eslint-disable-next-line react/no-unused-state
      actForBatchEditSalesVoList: [
        {
          actForId: '',
          actForMothTitle: '',
          actForMoth: '',
          actForRankCd: '',
          actForRankNm: '',
          orderAmt: '',
          cdExchValFrom: '',
          cdExchValTo: '',
          cntrcCurrCd: '',
          cntrcCurrNm: '',
          changedOrderAmt: '',
          changedCntrcCurrCd: '',
          changedCntrcCurrNm: '',
          effort: '',
          effortUnitCd: '',
          effortUnitNm: '',
          exchRt: '',
          memo: '',
        },
      ],
      exchRtInfoVoList: [
        {
          exchRt: '',
          currCdFrom: '',
          currCdTo: '',
          actvStartDt: '',
          actvEndDt: '',
        },
      ],
    },
    batchEditModelVisible: false,
    // batchEditable: false,
    copyButtonVisible: false,
    moveButtonVisible: false,
    periodFrom: '',
    periodTo: '',

    deletePop: false,

    searchLoading: false,
    notEnterTip: '',
    batchEditTipModel: false,
    bottomLineUpdateModel: false,
    caseNumsValue: [
      {
        cstmrCd: '',
        caseNm: '',
        caseNo: '',
      },
    ],
    caseAchVisible: false,
    cseeAchTitle: '',
    topVisible1: false,
    topVisible2: false,

    cstmrNm: '',
    endUserNm: '',
    caseNm: '',
    relatedNo: '',
    busActId: '',
    bugtId: '',
    summaryCstmrCd: '',
    summaryCstmrNm: '',
    summaryEndUserCd: '',
    summaryEndUserNm: '',
  };

  componentDidMount() {
    this.props.onRef('ActualityForecastBottom', this);
    /**
     * 初期データの取得
     */
    const { dispatch } = this.props;

    const { actForMoth } = this.props;
    const actForYear = this.props.user.currentUser?.dspYear;
    const inputUserCd = this.props.user.currentUser?.inputUserCds;
    const language = this.props.user.currentUser?.dspLang;
    const actBottomParam: FetchBottomDataType = { actForYear, actForMoth, inputUserCd, language };
    const actForInfoSelectModel = JSON.stringify(actBottomParam);
    dispatch({
      type: 'ActForecastData/fetchActForecastBottomData',
      payload: {
        actForInfoSelectModel,
      },
    });
  }

  static getDerivedStateFromProps(nextProps: TableFormProps, prevState: TableDataStates) {
    if (nextProps.ActForecastData.ActBottomData !== null) {
      const formDataParam: ActBottomDataType[] = nextProps.ActForecastData.ActBottomData.filter(
        (item) => item.editable === true,
      );
      if (formDataParam.length > 0) {
        isClickable = false;
      } else {
        isClickable = true;
      }
    } else {
      isClickable = true;
    }

    // 追加データの場合は比較しません
    if (isClickable) {
      if (nextProps.ActForecastData.ActBottomData !== prevState.bottomTableData) {
        if (nextProps.ActForecastData.ActBottomData !== null) {
          const nowColumnsNum = nextProps.ActForecastData.ActBottomData.length;
          columnsNum = nowColumnsNum;
        } else {
          columnsNum = 0;
        }

        formData = nextProps.ActForecastData.ActBottomData;
        return {
          bottomTableData: nextProps.ActForecastData.ActBottomData,
          searchLoading: nextProps.ActForecastData.setSearchLoading.searchLoading,
        };
      }
    }

    return {
      searchLoading: nextProps.ActForecastData.setSearchLoading.searchLoading,
    };
  }

  /**
   * タブの変更
   * @param activeKey 現在選択されているページ
   */
  tabsChange = async (activeKey: string) => {
    const { dispatch } = this.props;
    console.log('this.states' + this.state.actForMoth);
    if (this.props.global.inForceFlag) {
      Modal.confirm({
        visible: this.state.visibleFlag,
        icon: <ExclamationCircleOutlined />,
        content: formatMessage({ id: 'common.business.activities.content' }),
        closable: true,
        centered: true,
        okText: formatMessage({ id: 'common.business.activities.content.ok' }),
        cancelText: formatMessage({ id: 'common.business.activities.content.onCancel' }),
        // 这里注意要用箭头函数, 否则this不生效
        onOk: () => {
          insertFlag = false;
          updateFlag = false;
          updateBottomLineYesFlag = false;
          updateBottomLineNoFlag = false;

          const month = activeKey;
          this.props.getNowMonth(month);

          /**
           * 月の変更で、月ごとのデータを更新
           */

          const actForMoth = activeKey;
          const actForYear = this.props.user.currentUser?.dspYear;
          const inputUserCd = this.props.user.currentUser?.inputUserCds;
          const language = this.props.user.currentUser?.dspLang;
          const actBottomParam: FetchBottomDataType = {
            actForYear,
            actForMoth,
            inputUserCd,
            language,
          };
          const actForInfoSelectModel = JSON.stringify(actBottomParam);
          dispatch({
            type: 'ActForecastData/fetchActForecastBottomData',
            payload: {
              actForInfoSelectModel,
            },
          });
          this.setState({
            actForMoth: activeKey,
            visibleFlag: false,
          });
          dispatch({
            type: 'global/inForceFlag',
            payload: false,
          });
          dispatch({
            type: 'global/dialogBoxFlag',
            payload: false,
          });
        },
        onCancel: async () => {
          await this.setState({
            actForMoth: this.state.actForMoth,
            visibleFlag: false,
          });
        },
      });
    } else {
      insertFlag = false;
      updateFlag = false;
      updateBottomLineYesFlag = false;
      updateBottomLineNoFlag = false;

      /**
       * 月の変更で、月ごとのデータを更新
       */
      const actForMoth = activeKey;
      const actForYear = this.props.user.currentUser?.dspYear;
      const inputUserCd = this.props.user.currentUser?.inputUserCds;
      const language = this.props.user.currentUser?.dspLang;
      const actBottomParam: FetchBottomDataType = { actForYear, actForMoth, inputUserCd, language };
      const actForInfoSelectModel = JSON.stringify(actBottomParam);
      await dispatch({
        type: 'ActForecastData/fetchActForecastBottomData',
        payload: {
          actForInfoSelectModel,
        },
      });

      this.setState({
        actForMoth: activeKey,
      });
      const month = activeKey;
      this.props.getNowMonth(month);
    }
  };

  /**
   * データを追加
   */
  newMember = () => {
    onlyClickCopyFlag = true;
    Modal.confirm({
      visible: onlyClickCopyFlag,
      icon: <ExclamationCircleOutlined />,
      content: formatMessage({ id: 'actualityForecastBatchEdit.basic.newData' }),
      closable: true,
      centered: true,
      okText: formatMessage({ id: 'common.business.activities.content.ok' }),
      cancelText: formatMessage({ id: 'common.business.activities.content.onCancel' }),
      // 这里注意要用箭头函数, 否则this不生效
      onOk: async () => {
        const columnSum = columnsNum + 1;
        await this.batchEdit(columnSum);
        this.setState({
          batchEditModelVisible: true,
        });
        onlyClickCopyFlag = false;
      },
      onCancel: () => {
        document
          .getElementsByClassName('ant-table-body')[0]
          .scrollTo({ left: 0, behavior: 'auto' });
        const { dispatch } = this.props;
        dispatch({
          type: 'global/dialogBoxFlag',
          payload: true,
        });
        dispatch({
          type: 'global/inForceFlag',
          payload: true,
        });
        isClickable = false;
        insertFlag = true;
        updateFlag = false;
        updateBottomLineYesFlag = false;
        updateBottomLineNoFlag = false;
        columnsNum += 1;
        const newData: ActBottomDataType = {
          No: columnsNum.toString(),
          editable: true,
          checked: false,
          actForId: columnsNum.toString(),
          actForYear: this.props.user.currentUser?.dspYear,
          actForMoth: this.state.actForMoth,
          language: this.props.user.currentUser?.dspLang,
          lastEditedUser: this.props.user.currentUser?.userid,

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
          orderAmt: '',
          cntrcCurrCd: this.props.cntrcCurrCd,
          cntrcCurrNm: this.props.cntrcCurrNm,
          effort: '1.00',
          effortUnitCd: this.props.effortUnitCd,
          effortUnitNm: this.props.effortUnitNm,
          endUserCd: '',
          endUserNm: '',
          memo: '',
          relatedNo: '',
          bugtId: '',
          busActId: '',
        };

        if (formData === null || formData === undefined) {
          formData = [];
        }
        const newFormData = formData.concat(newData);
        formData.push(newData);
        this.setState({
          bottomTableData: newFormData,
        });
        // document.querySelector('#customer').focus();
        // document.getElementsByTagName("input")[0].focus();
      },
    });
  };

  /**
   * データをコピー
   */
  copy = () => {
    const selectFormData = formData.filter((item) => item.checked === true);
    if (selectFormData.length === 0) {
      message.info(formatMessage({ id: 'actualityForecastBottom.message.noSelectData' }));
      return;
    }
    const newFormData = formData.filter((item) => item.checked === true);
    this.setState({
      bottomTableData: newFormData,
    });

    const { dispatch } = this.props;
    dispatch({
      type: 'ActForecastData/copyModelVisible',
      payload: true,
    });
  };

  /**
   * データをコピー
   */
  copyOne = (record: ActBottomDataType) => {
    document.getElementsByClassName('ant-table-body')[0].scrollTo({ left: 0, behavior: 'auto' });
    isClickable = false;
    insertFlag = true;
    updateFlag = false;
    updateBottomLineYesFlag = false;
    updateBottomLineNoFlag = false;
    columnsNum += 1;
    const newData: ActBottomDataType = {
      No: columnsNum.toString(),
      editable: true,
      checked: false,
      actForId: columnsNum.toString(),
      actForYear: this.props.user.currentUser?.dspYear,
      actForMoth: this.state.actForMoth,
      language: this.props.user.currentUser?.dspLang,
      lastEditedUser: this.props.user.currentUser?.userid,

      countOrgCd: record.countOrgCd,
      countOrgNm: record.countOrgNm,
      busUserCd: record.busUserCd,
      busUserNm: record.busUserNm,
      cstmrCd: record.cstmrCd,
      cstmrNm: record.cstmrNm,
      caseIndstyCd: record.caseIndstyCd,
      caseIndstyNm: record.caseIndstyNm,
      caseNm: record.caseNm,
      caseNo: record.caseNo,
      actForRankCd: record.actForRankCd,
      actForRankNm: record.actForRankNm,
      orderAmt: record.orderAmt,
      cntrcCurrCd: record.cntrcCurrCd,
      cntrcCurrNm: record.cntrcCurrNm,
      effort: record.effort,
      effortUnitCd: record.effortUnitCd,
      effortUnitNm: record.effortUnitNm,
      endUserCd: record.endUserCd,
      endUserNm: record.endUserNm,
      memo: '',
      relatedNo: record.relatedNo,
      bugtId: '',
      busActId: '',
    };
    const { dispatch } = this.props;
    dispatch({
      type: 'global/dialogBoxFlag',
      payload: true,
    });
    dispatch({
      type: 'global/inForceFlag',
      payload: true,
    });
    if (formData === null || formData === undefined) {
      formData = [];
    }
    const newFormData = formData.concat(newData);
    formData.push(newData);
    this.setState({
      bottomTableData: newFormData,
    });
    document.getElementsByClassName('ant-table-body')[0]
      .scrollTo({ left: 0, top:document.body.scrollHeight+30, behavior: 'auto' });
  };

  /**
   * データを移動
   */
  move = () => {
    const selectFormData = formData.filter((item) => item.checked === true);
    if (selectFormData.length === 0) {
      message.info(formatMessage({ id: 'actualityForecastBottom.message.noSelectData' }));
      return;
    }
    const newFormData = formData.filter((item) => item.checked === true);
    this.setState({
      bottomTableData: newFormData,
    });

    // moveモデルを閉じる
    const { dispatch } = this.props;
    dispatch({
      type: 'ActForecastData/moveModelVisible',
      payload: true,
    });
  };

  /**
   * データ一件を削除
   */
  removeOne = (actForId: string) => {
    this.setState({
      deletePop: false,
    });
    // 初期化が必要
    const actForIds: string[] = [];
    actForIds.push(actForId);

    const actBottomParam: DeleteBottomDataParamType = {
      actForIds,
    };
    const nowFormData = formData.filter((item) => item.checked !== true);
    formData = nowFormData;
    this.setState({
      bottomTableData: nowFormData,
    });

    /**
     * Bottomデータを削除して、データベースを更新
     */
    const { dispatch } = this.props;

    const actForInfoDeleteModel = JSON.stringify(actBottomParam);

    const { actForMoth } = this.state;
    const actForYear = this.props.user.currentUser?.dspYear;
    const inputUserCd = this.props.user.currentUser?.inputUserCds;
    const language = this.props.user.currentUser?.dspLang;
    const actBottomSelectParam: FetchBottomDataType = {
      actForYear,
      actForMoth,
      inputUserCd,
      language,
    };
    const actForInfoSelectModel = JSON.stringify(actBottomSelectParam);
    dispatch({
      type: 'ActForecastData/deleteActForecastBottomData',
      payload: {
        actForInfoDeleteModel,
      },
      payload1: {
        actForInfoSelectModel,
      },
    });

    this.tabsChange(this.state.actForMoth);
  };

  /**
   * データを削除
   */
  remove = () => {
    this.setState({
      deletePop: false,
    });

    // チェックボックスで選択した削除するデータ
    const deleteFormData = formData.filter((item) => item.checked === true);
    if (deleteFormData.length === 0) {
      message.info(formatMessage({ id: 'actualityForecastBottom.message.noSelectData' }));
      return;
    }
    // 初期化が必要
    const actForIds: string[] = [];

    deleteFormData.forEach((item) => actForIds.push(item.actForId));

    const actBottomParam: DeleteBottomDataParamType = {
      actForIds,
    };
    const nowFormData = formData.filter((item) => item.checked !== true);
    formData = nowFormData;
    this.setState({
      bottomTableData: nowFormData,
    });

    /**
     * Bottomデータを削除して、データベースを更新
     */
    const { dispatch } = this.props;

    const actForInfoDeleteModel = JSON.stringify(actBottomParam);

    const { actForMoth } = this.state;
    const actForYear = this.props.user.currentUser?.dspYear;
    const inputUserCd = this.props.user.currentUser?.inputUserCds;
    const language = this.props.user.currentUser?.dspLang;
    const actBottomSelectParam: FetchBottomDataType = {
      actForYear,
      actForMoth,
      inputUserCd,
      language,
    };
    const actForInfoSelectModel = JSON.stringify(actBottomSelectParam);
    dispatch({
      type: 'ActForecastData/deleteActForecastBottomData',
      payload: {
        actForInfoDeleteModel,
      },
      payload1: {
        actForInfoSelectModel,
      },
    });

    this.tabsChange(this.state.actForMoth);
  };

  /**
   * 編集したデータを保存
   * @param record データ
   * @param index データの索引
   */
  save = async (record: ActBottomDataType, index: number) => {
    const { dispatch } = this.props;
    /* await dispatch({
      type: 'global/dialogBoxFlag',
      payload: false,
    }); */
    // エラーメッセージフラグ 画面にエラーが発生しました。画面データを保存
    let errorFlag = false;

    if (record.cstmrNm !== null && record.cstmrNm !== undefined && record.cstmrNm !== '') {
      if (record.cstmrNm.length > 100) {
        message.error(formatMessage({ id: 'common.message.customerLength' }));
        errorFlag = true;
        return;
      }
    }

    // 確率=	受注
    if (record.actForRankCd === '1') {
      if (!record.cstmrNm) {
        message.error(formatMessage({ id: 'actualityForecastBottom.message.customer' }));
        errorFlag = true;
        return;
      }
    }

    // 入力フィールドの空きチェック
    if (!record.caseNm) {
      message.error(formatMessage({ id: 'actualityForecastBottom.message.case' }));
      errorFlag = true;
      return;
    }

    // 確率=	受注
    if (record.actForRankCd === '1') {
      if (!record.caseNo) {
        message.error(formatMessage({ id: 'common.error.caseNoNotInput' }));
        errorFlag = true;
        return;
      }
    }

    if (!record.actForRankNm) {
      message.error(formatMessage({ id: 'actualityForecastBottom.message.probability' }));
      errorFlag = true;
      return;
    }
    if (!record.orderAmt) {
      message.error(formatMessage({ id: 'actualityForecastBottom.message.contractAmount' }));
      errorFlag = true;
      return;
    }
    if (!record.cntrcCurrNm) {
      message.error(formatMessage({ id: 'actualityForecastBottom.message.contractCurrency' }));
      errorFlag = true;
      return;
    }
    if (record.effort && record.effort.toString() !== '0.00' && !record.effortUnitNm) {
      message.error(formatMessage({ id: 'actualityForecastBottom.message.effortUnit' }));
      errorFlag = true;
      return;
    }
    if (!record.countOrgNm) {
      message.error(formatMessage({ id: 'actualityForecastBottom.message.countOrgNm' }));
      errorFlag = true;
      return;
    }
    if (!record.busUserNm) {
      message.error(formatMessage({ id: 'actualityForecastBottom.message.busUserNm' }));
      errorFlag = true;
      return;
    }
    if (!record.caseIndstyNm) {
      message.error(formatMessage({ id: 'actualityForecastBottom.message.industry' }));
      errorFlag = true;
      return;
    }

    // 案件№、工数、エンドユーザー 入力されない
    let notEnterValue = '';

    if (record.endUserNm !== null && record.endUserNm.length > 100) {
      message.error(formatMessage({ id: 'common.message.endUserNmLength' }));
      errorFlag = true;
      return;
    }

    // 確率=	受注
    if (record.actForRankCd === '1') {
      if (!record.endUserNm) {
        message.error(formatMessage({ id: 'common.error.endUserNotInput' }));
        errorFlag = true;
        return;
      }

      // 案件№ ,エンドユーザー 正しく入力する 確認メッセージ
      notEnterValue = formatMessage({ id: 'common.message.confirm' });

      errorFlag = true;
    }

    // 確率 !=	受注
    if (record.actForRankCd !== '1') {
      if (!record.cstmrNm && !record.caseNo && !record.effort && !record.endUserNm) {
        errorFlag = true;
        notEnterValue = formatMessage({
          id: 'common.message.customerAndCaseNoAndEffortAndEndUserNotInput',
        });
      } else if (!record.cstmrNm && !record.caseNo && !record.effort) {
        errorFlag = true;
        notEnterValue = formatMessage({ id: 'common.message.customerAndCaseNoAndEffortNotInput' });
      } else if (!record.cstmrNm && !record.caseNo && !record.endUserNm) {
        errorFlag = true;
        notEnterValue = formatMessage({ id: 'common.message.customerAndCaseNoAndEndUserNotInput' });
      } else if (!record.caseNo && !record.effort && !record.endUserNm) {
        errorFlag = true;
        notEnterValue = formatMessage({ id: 'common.message.caseNoAndEffortAndEndUserNotInput' });
      } else if (!record.cstmrNm && !record.caseNo) {
        errorFlag = true;
        notEnterValue = formatMessage({ id: 'common.message.customerAndCaseNoNotInput' });
      } else if (!record.cstmrNm && !record.effort) {
        errorFlag = true;
        notEnterValue = formatMessage({ id: 'common.message.customerAndEffortNotInput' });
      } else if (!record.cstmrNm && !record.endUserNm) {
        errorFlag = true;
        notEnterValue = formatMessage({ id: 'common.message.customerAndEndUserNotInput' });
      } else if (!record.caseNo && !record.effort) {
        errorFlag = true;
        notEnterValue = formatMessage({ id: 'common.message.caseNoAndEffortNotInput' });
      } else if (!record.caseNo && !record.endUserNm) {
        errorFlag = true;
        notEnterValue = formatMessage({ id: 'common.message.caseNoAndEndUserNotInput' });
      } else if (!record.effort && !record.endUserNm) {
        errorFlag = true;
        notEnterValue = formatMessage({ id: 'common.message.effortAndEndUserNotInput' });
      } else if (!record.cstmrNm) {
        errorFlag = true;
        notEnterValue = formatMessage({ id: 'common.message.customerNotInput' });
      } else if (!record.caseNo) {
        errorFlag = true;
        notEnterValue = formatMessage({ id: 'common.message.caseNoNotInput' });
      } else if (!record.effort) {
        errorFlag = true;
        notEnterValue = formatMessage({ id: 'common.message.effortNotInput' });
      } else if (!record.endUserNm) {
        errorFlag = true;
        notEnterValue = formatMessage({ id: 'common.message.endUserNotInput' });
      }
    }

    this.setState({
      notEnterTip: notEnterValue,
    });

    formData[index].countOrgNm = record.countOrgNm;
    formData[index].busUserNm = record.busUserNm;
    formData[index].cstmrNm = record.cstmrNm;
    formData[index].caseIndstyNm = record.caseIndstyNm;
    formData[index].caseNm = record.caseNm;
    formData[index].caseNo = record.caseNo;
    formData[index].actForRankNm = record.actForRankNm;
    formData[index].orderAmt = record.orderAmt;
    formData[index].cntrcCurrNm = record.cntrcCurrNm;
    formData[index].effort = record.effort;
    formData[index].effortUnitNm = record.effortUnitNm;
    formData[index].endUserNm = record.endUserNm;
    formData[index].memo = record.memo;
    formData[index].editable = true;

    let customrList = this.props.customerLst;
    customrList = customrList.filter((item) => item.cstmrNm === record.cstmrNm);
    if (customrList.length > 0) {
      const { cstmrCd } = customrList[0];
      formData[index].cstmrCd = cstmrCd.toString();
    } else {
      formData[index].cstmrCd = '';
    }
    formData[index].cstmrNm = record.cstmrNm;

    let endUserList = this.props.endUserLst;
    endUserList = endUserList.filter((item) => item.endUserNm === record.endUserNm);
    if (endUserList.length > 0) {
      const { endUserCd } = endUserList[0];
      formData[index].endUserCd = endUserCd.toString();
    } else {
      formData[index].endUserCd = '';
    }
    formData[index].endUserNm = record.endUserNm;

    // パラメータをデータに挿入するために使用
    // @ts-ignore
    addCustomerParam.language = this.props.user.currentUser?.dspLang;
    addCustomerParam.cstmrCd = record.cstmrCd;
    addCustomerParam.cstmrNm = record.cstmrNm;
    // @ts-ignore
    addCustomerParam.orgGroupId = this.props.user.currentUser?.orgGroupId;

    // @ts-ignore
    addEndUserParam.language = this.props.user.currentUser?.dspLang;
    addEndUserParam.endUserCd = record.endUserCd;
    addEndUserParam.endUserNm = record.endUserNm;
    // @ts-ignore
    addEndUserParam.orgGroupId = this.props.user.currentUser?.orgGroupId;

    const actBottomParam: UpdateBottomDataParamType = {
      actForIds: formData[index].actForId,
      language: this.props.user.currentUser?.dspLang,
      actForYear: this.props.user.currentUser?.dspYear,
      actForMoth: this.state.actForMoth,
      orgGroupId: this.props.user.currentUser?.orgGroupId,

      countOrgCd: formData[index].countOrgCd,
      countOrgNm: formData[index].countOrgNm,
      busUserCd: formData[index].busUserCd,
      busUserNm: formData[index].busUserNm,
      cstmrCd: formData[index].cstmrCd,
      cstmrNm: formData[index].cstmrNm,
      caseIndstyCd: formData[index].caseIndstyCd,
      caseIndstyNm: formData[index].caseIndstyNm,
      caseNm: formData[index].caseNm,
      caseNo: formData[index].caseNo,
      actForRankCd: formData[index].actForRankCd,
      actForRankNm: formData[index].actForRankNm,
      orderAmt: formData[index].orderAmt,
      cntrcCurrCd: formData[index].cntrcCurrCd,
      cntrcCurrNm: formData[index].cntrcCurrNm,
      effort: formData[index].effort,
      effortUnitCd: formData[index].effortUnitCd,
      effortUnitNm: formData[index].effortUnitNm,
      endUserCd: formData[index].endUserCd,
      endUserNm: formData[index].endUserNm,
      memo: formData[index].memo,
      relatedNo: formData[index].relatedNo,
      bugtId: formData[index].bugtId,
      busActId: formData[index].busActId,
    };

    // バックアップデータ
    formDataBak = actBottomParam;

    indexBak = index;

    if (!errorFlag) {
      // 案件№、工数、エンドユーザー 入力
      if (notEnterValue === '') {
        this.updateOrInsertData(index);
      }
    }
  };

  /**
   * 更新または挿入
   */
  updateOrInsertData = (index: number) => {
    formData[index].editable = false;

    if (updateFlag) {
      this.updateData(index);
    }
    if (insertFlag) {
      this.insertData(index);
    }

    isClickable = true;
  };

  updateData = async (index: number) => {
    /**
     * Bottomデータを更新して、データベースを更新
     */
    const { dispatch } = this.props;

    const actForInfoUpdateModel = JSON.stringify(formDataBak);

    const { actForMoth } = this.state;
    const actForYear = this.props.user.currentUser?.dspYear;
    const inputUserCd = this.props.user.currentUser?.inputUserCds;
    const language = this.props.user.currentUser?.dspLang;
    const orgGroupId = this.props.user.currentUser?.orgGroupId;
    const authOrgCd = this.props.user.currentUser?.authOrgCds;
    const caseYear = this.props.user.currentUser?.dspYear;
    const caseNm = '';
    const actBottomSelectParam: FetchBottomDataType = {
      actForYear,
      actForMoth,
      inputUserCd,
      language,
    };
    const actForInfoSelectModel = JSON.stringify(actBottomSelectParam);
    const caseParam: FetchCaseType = {
      language,
      caseYear,
      orgGroupId,
      authOrgCd,
      inputUserCd,
      caseNm,
    };
    const caseInfoModel = JSON.stringify(caseParam);

    const { relatedNo } = formData[index];
    const currCdTo = 'JPY';
    const actBatchEditSelectParam: FetchBatchEditDataType = { actForYear, currCdTo, relatedNo };
    const actForInfoBatchEditModel = JSON.stringify(actBatchEditSelectParam);
    await dispatch({
      type: 'global/dialogBoxFlag',
      payload: false,
    });
    await dispatch({
      type: 'global/inForceFlag',
      payload: false,
    });
    if (lineDataUpdateFlag) {
      await dispatch({
        type: 'ActForecastData/fetchBatchEditTableData',
        payload: {
          actForInfoBatchEditModel,
        },
      });

      const valideCounts = this.props.ActForecastData.batchEditTableData.valideCount;
      if (parseInt(valideCounts, 10) > 1) {
        updateFlag = false;
        this.setState({
          bottomLineUpdateModel: true,
        });
      } else {
        dispatch({
          type: 'ActForecastData/updateActForecastBottomData',
          payload: {
            actForInfoUpdateModel,
          },
          payload1: {
            actForInfoSelectModel,
          },
          payload2: {
            caseInfoModel,
          },
        });
        lineDataUpdateFlag = false;
      }
    } else {
      dispatch({
        type: 'ActForecastData/updateActForecastBottomData',
        payload: {
          actForInfoUpdateModel,
        },
        payload1: {
          actForInfoSelectModel,
        },
        payload2: {
          caseInfoModel,
        },
      });
    }
    insertFlag = false;
    updateBottomLineYesFlag = false;
    updateBottomLineNoFlag = false;
    onlyEditFlag = false;
  };

  insertData = async (index: number) => {
    /**
     * Bottomデータを挿入して、データベースを更新
     */
    const { dispatch } = this.props;
    const actForInfoUpdateModel = JSON.stringify(formDataBak);

    const { actForMoth } = this.state;
    const actForYear = this.props.user.currentUser?.dspYear;
    const inputUserCd = this.props.user.currentUser?.inputUserCds;
    const language = this.props.user.currentUser?.dspLang;
    const caseYear = this.props.user.currentUser?.dspYear;
    const orgGroupId = this.props.user.currentUser?.orgGroupId;
    const authOrgCd = this.props.user.currentUser?.authOrgCds;
    const caseNm = '';
    const actBottomSelectParam: FetchBottomDataType = {
      actForYear,
      actForMoth,
      inputUserCd,
      language,
    };
    const actForInfoSelectModel = JSON.stringify(actBottomSelectParam);
    const caseParam: FetchCaseType = {
      language,
      caseYear,
      orgGroupId,
      authOrgCd,
      inputUserCd,
      caseNm,
    };
    const caseInfoModel = JSON.stringify(caseParam);

    await dispatch({
      type: 'global/dialogBoxFlag',
      payload: false,
    });
    await dispatch({
      type: 'global/inForceFlag',
      payload: false,
    });
    await dispatch({
      type: 'ActForecastData/insertActForecastBottomData',
      payload: {
        actForInfoUpdateModel,
      },
      payload1: {
        actForInfoSelectModel,
      },
      payload2: {
        caseInfoModel,
      },
    });

    updateFlag = false;
    onlyEditFlag = false;
  };

  /**
   * 操作をキャンセル
   */
  cancel = () => {
    const { dispatch } = this.props;
    isClickable = true;
    const activeKey = this.state.actForMoth;
    // 刷新页面
    /* this.tabsChange(this.state.actForMoth); */

    this.setState({
      actForMoth: activeKey,
    });
    insertFlag = false;
    updateFlag = false;
    updateBottomLineYesFlag = false;
    updateBottomLineNoFlag = false;
    onlyEditFlag = false;

    const month = activeKey;
    this.props.getNowMonth(month);

    /**
     * 月の変更で、月ごとのデータを更新
     */

    const actForMoth = activeKey;
    const actForYear = this.props.user.currentUser?.dspYear;
    const inputUserCd = this.props.user.currentUser?.inputUserCds;
    const language = this.props.user.currentUser?.dspLang;
    const actBottomParam: FetchBottomDataType = { actForYear, actForMoth, inputUserCd, language };
    const actForInfoSelectModel = JSON.stringify(actBottomParam);
    dispatch({
      type: 'ActForecastData/fetchActForecastBottomData',
      payload: {
        actForInfoSelectModel,
      },
    });
    dispatch({
      type: 'global/dialogBoxFlag',
      payload: false,
    });
    dispatch({
      type: 'global/inForceFlag',
      payload: false,
    });
  };

  /**
   * データの変更
   * @param index データの索引
   */
  edit = async (index: number) => {
    const { dispatch } = this.props;
    await dispatch({
      type: 'global/dialogBoxFlag',
      payload: true,
    });
    await dispatch({
      type: 'global/inForceFlag',
      payload: true,
    });
    // データを修正するときは、追加データは禁止
    isClickable = false;
    insertFlag = false;
    updateFlag = true;
    lineDataUpdateFlag = false;
    onlyEditFlag = true;

    formData[index].editable = true;
    this.setState({
      bottomTableData: formData,
    });
  };

  /**
   * batchデータの変更
   * @param index データの索引
   */
  batchEdit = async (index: number) => {
    isClickable = false;
    insertFlag = false;
    updateFlag = false;

    if (index <= columnsNum) {
      formData[index].editable = false;
    }

    const { dispatch } = this.props;

    const actForYear = this.props.user.currentUser?.dspYear;
    let relatedNo = '';
    if (index <= columnsNum) {
      relatedNo = formData[index].relatedNo;
    }

    const currCdTo = 'JPY';

    const inputUserCd = this.props.user.currentUser?.inputUserCds;

    const actBatchEditSelectParam: FetchBatchEditDataType = { actForYear, currCdTo, relatedNo };
    const actForInfoBatchEditModel = JSON.stringify(actBatchEditSelectParam);
    await dispatch({
      type: 'ActForecastData/fetchBatchEditTableData',
      payload: {
        actForInfoBatchEditModel,
      },
    });
    await dispatch({
      type: 'ActForecastData/searchBatchButtonData',
      payload: {
        actForYear,
      },
      payload1: {
        inputUserCd,
      },
    });
    // batchEditFormData = this.props.ActForecastData.batchEditTableData;
    this.setState({
      bottomTableData: formData,
      // eslint-disable-next-line react/no-unused-state
      batchEditTableData: this.props.ActForecastData.batchEditTableData,
      batchEditModelVisible: true,
    });

    isClickable = true;
  };

  /**
   * 選択ボックスでデータを選択
   * @param e: 変更後の値
   * @param index データの索引
   */
  checkBoxChange = (e: CheckboxChangeEvent, index: number) => {
    formData[index].checked = e.target.checked;
    this.setState({
      bottomTableData: formData,
    });
  };

  /**
   * 表の各フィールドの変更方法
   * @param e: 変更後の値
   * @param index データの索引
   */
  onOrgCdChange = (e: string, index: number) => {
    if (e.toString() !== null) {
      if (this.props.authOrgCdLst !== null) {
        let authOrgCdList = this.props.authOrgCdLst;
        authOrgCdList = authOrgCdList.filter((item) => item.orgNm === e.toString());
        let orgCd = '';
        if (authOrgCdList !== undefined && authOrgCdList !== null) {
          orgCd = authOrgCdList[0].orgCd;
        }
        formData[index].countOrgCd = orgCd.toString();
        formData[index].countOrgNm = e.toString();
        this.setState({
          bottomTableData: formData,
        });
      } else {
        formData[index].countOrgCd = '';
        formData[index].countOrgNm = '';
        this.setState({
          bottomTableData: formData,
        });
      }
    }
    lineDataUpdateFlag = true;
  };

  businessChargeChange = (e: string, index: number) => {
    if (e.toString() !== null) {
      if (this.props.userLst !== null) {
        let userList = this.props.userLst;
        userList = userList.filter((item) => item.userNm === e.toString());
        let userCd = '';
        if (userList !== undefined && userList !== null) {
          userCd = userList[0].userCd;
        }
        formData[index].busUserCd = userCd.toString();
        formData[index].busUserNm = e.toString();
        this.setState({
          bottomTableData: formData,
        });
      } else {
        formData[index].busUserCd = '';
        formData[index].busUserNm = '';
        this.setState({
          bottomTableData: formData,
        });
      }
    }
    lineDataUpdateFlag = true;
  };

  handleCustomer = (cstmrCds: string, cstmrNms: string, caseNms: string, index: number) => {
    formData[index].cstmrCd = cstmrCds;
    formData[index].cstmrNm = cstmrNms;
    formData[index].caseNm = caseNms;
    this.caseChange(caseNms, index);

    lineDataUpdateFlag = true;
    this.setState({
      bottomTableData: formData,
      caseNumsValue: [],
    });
  };

  // customerChange = (e: string, index: number) => {
  //   if (e!==undefined && e.toString() !== '') {
  //     if(this.props.allCustomerLst!== null){
  //       let customrList = this.props.allCustomerLst;
  //       customrList = customrList.filter((item) => item.cstmrNmDft === e.toString()
  //         || item.cstmrNmCn === e.toString()
  //         || item.cstmrNmEn === e.toString()
  //         || item.cstmrNmFra === e.toString()
  //         || item.cstmrNmJp === e.toString()
  //         || item.cstmrShrtNmCn === e.toString()
  //         || item.cstmrShrtNmEn === e.toString()
  //         || item.cstmrShrtNmFra === e.toString()
  //         || item.cstmrShrtNmJp === e.toString());
  //       if(customrList !== undefined && customrList !== null && customrList.length>0){
  //         const { cstmrCd } = customrList[0];
  //         formData[index].cstmrCd = cstmrCd.toString();
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
  //             formData[index].caseNm = caseOptionsParam[0].value;
  //             this.caseChange(caseOptionsParam[0].value, index)
  //           }else {
  //             formData[index].caseNm ='';
  //             this.caseChange('', index)
  //           }
  //         }else{
  //           formData[index].caseNm ='';
  //           this.caseChange('', index)
  //         }
  //         const cstmrNms = this.props.customerLst.filter((item) => item.cstmrCd ===  cstmrCd);
  //         formData[index].cstmrNm = cstmrNms[0].cstmrNm;
  //       }else{
  //         formData[index].cstmrCd = 'undefined';
  //         formData[index].caseNm ='';
  //         formData[index].cstmrNm = e.toString();
  //         this.caseChange('', index)
  //       }
  //     }else{
  //       formData[index].cstmrCd = 'undefined';
  //       formData[index].cstmrNm = e.toString();
  //       formData[index].caseNm ='';
  //       this.caseChange('', index)
  //     }
  //   }else{
  //     formData[index].cstmrCd = 'undefined';
  //     formData[index].cstmrNm = '';
  //     formData[index].caseNm ='';
  //     this.caseChange('', index)
  //   }
  //   lineDataUpdateFlag = true;
  //   this.setState({
  //     bottomTableData: formData,
  //     caseNumsValue:[],
  //   });
  // };

  industryChange = (e: string, index: number) => {
    if (e.toString() !== '') {
      if (this.props.industryLst !== null) {
        let industryList = this.props.industryLst;
        industryList = industryList.filter((item) => item.cdNm === e.toString());
        let cdVal = '';
        if (industryList !== undefined && industryList !== null) {
          cdVal = industryList[0].cdVal.toString();
        }
        formData[index].caseIndstyCd = cdVal.toString();
        formData[index].caseIndstyNm = e.toString();
        this.setState({
          bottomTableData: formData,
        });
      } else {
        formData[index].caseIndstyCd = '';
        formData[index].caseIndstyNm = '';
        this.setState({
          bottomTableData: formData,
        });
      }
    }
    lineDataUpdateFlag = true;
  };

  caseChange = async (e: string, index: number) => {
    if (e !== undefined && e !== null && e.toString() !== '') {
      if(e.length > 100) {
        message.error(formatMessage({ id: 'common.message.caseNmLength' }));
        return;
      }
      formData[index].caseNm = e.toString();
      this.setState({
        bottomTableData: formData,
      });

      const caseParam: FetchCaseNoType = {
        caseNm: e.toString(),
        caseYear: this.props.user.currentUser?.dspYear,
        language: this.props.user.currentUser?.dspLang,
        inputUserCd: this.props.user.currentUser?.inputUserCds,
      };

      /**
       * cassNmによるcaseNumberrLitの検索
       */
      const { dispatch } = this.props;
      const caseInfoModel = JSON.stringify(caseParam);
      await dispatch({
        type: 'ActForecastData/fetchCaseNumberLst',
        payload: {
          caseInfoModel,
        },
      });

      const caseNumberOptions: OptionType[] = [];
      if (
        this.props.ActForecastData.caseNumberLst !== null &&
        this.props.ActForecastData.caseNumberLst.length > 0
      ) {
        this.props.ActForecastData.caseNumberLst.forEach((item) => {
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
      this.setState({
        caseNumsValue: this.props.ActForecastData.caseNumberLst,
      });

      // caseNo 只有一条时 直接显示
      const caseNoList = this.props.ActForecastData.caseNumberLst.filter(
        (item) => item.caseNm === e.toString(),
      );
      const otherCaseNoList = this.props.ActForecastData.caseNumberLst.filter(
        (item) => item.caseNm !== e.toString() && item.caseNo !== '',
      );
      if (
        otherCaseNoList !== undefined &&
        otherCaseNoList !== null &&
        otherCaseNoList.length === 0 &&
        caseNoList !== undefined &&
        caseNoList !== null &&
        caseNoList.length > 0 &&
        caseNumberOptions !== undefined &&
        caseNumberOptions !== null &&
        caseNumberOptions.length === 1
      ) {
        formData[index].caseNo = caseNoList[0].caseNo;
        this.setState({
          bottomTableData: formData,
        });
      } else if (
        caseNoList !== undefined &&
        caseNoList !== null &&
        caseNoList.length > 0 &&
        caseNumberOptions !== undefined &&
        caseNumberOptions !== null &&
        caseNumberOptions.length > 1
      ) {
        formData[index].caseNo = '';
        this.setState({
          bottomTableData: formData,
        });
      }
    } else {
      formData[index].caseNm = '';
      formData[index].caseNo = '';
      this.setState({
        bottomTableData: formData,
        caseNumsValue: [],
      });
    }
    lineDataUpdateFlag = true;
  };

  caseNumberChange = (e: string, index: number) => {
    if (e !== undefined && e !== null && e !== '') {
      if (e.length > 15) {
        message.error(formatMessage({ id: 'common.message.caseNoLength' }));
        return;
      }
      formData[index].caseNo = e.toString();
      this.setState({
        bottomTableData: formData,
      });
    } else {
      formData[index].caseNo = '';
      this.setState({
        bottomTableData: formData,
      });
    }
    lineDataUpdateFlag = true;
  };

  probabilityChange = (e: string, index: number) => {
    if (e.toString() !== '') {
      if (this.props.probabilityLst !== null) {
        let probabilityList = this.props.probabilityLst;
        probabilityList = probabilityList.filter((item) => item.cdNm === e.toString());
        let cdVal = '';
        if (probabilityList !== undefined && probabilityList !== null) {
          cdVal = probabilityList[0].cdVal.toString();
        }
        formData[index].actForRankCd = cdVal;
        formData[index].actForRankNm = e.toString();
        this.setState({
          bottomTableData: formData,
        });
      } else {
        formData[index].actForRankCd = '';
        formData[index].actForRankNm = '';
        this.setState({
          bottomTableData: formData,
        });
      }
    }
  };

  amountChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (e.toString() !== '') {
      const clearValue = e.target.value.toString().replaceAll(',', '');
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
      formData[index].orderAmt = e.target.value.toString();
      this.setState({
        bottomTableData: formData,
      });
    }
  };

  /**
   *  金额获得焦点变更
   * @param e amount文本框的值
   */
  onAmountFocusChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (e.toString() !== '') {
      const regValue = e.target.value.toString().replaceAll(',', '');
      formData[index].orderAmt = regValue;
      this.setState({
        bottomTableData: formData,
      });
    }
  };

  /**
   *  金额失去焦点变更
   * @param e amount文本框的值
   */
  onAmountBlurChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (e.toString() !== '') {
      const regValue = formatUtil.thousandAmountFormat(e.target.value.toString());
      formData[index].orderAmt = regValue;
      this.setState({
        bottomTableData: formData,
      });
    }
  };

  currencyChange = (e: string, index: number) => {
    if (e.toString() !== '') {
      if (this.props.currencyLst !== null) {
        let currencyList = this.props.currencyLst;
        currencyList = currencyList.filter((item) => item.cdNm === e.toString());
        let cdVal = '';
        if (currencyList !== undefined && currencyList !== null) {
          cdVal = currencyList[0].cdVal.toString();
        }
        formData[index].cntrcCurrCd = cdVal.toString();
        formData[index].cntrcCurrNm = e.toString();
        this.setState({
          bottomTableData: formData,
        });
      } else {
        formData[index].cntrcCurrCd = '';
        formData[index].cntrcCurrNm = '';
        this.setState({
          bottomTableData: formData,
        });
      }
    }
  };

  effortChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (e.toString() !== '') {
      const clearValue = e.target.value.toString().replaceAll(',', '');
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
      formData[index].effort = e.target.value.toString();
      this.setState({
        bottomTableData: formData,
      });
    }
  };

  /**
   *  工数获得焦点变更
   * @param e amount文本框的值
   */
  onEffortFocusChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (e.toString() !== '') {
      const regValue = e.target.value.toString().replaceAll(',', '');
      formData[index].effort = regValue.toString();
      this.setState({
        bottomTableData: formData,
      });
    }
  };

  /**
   *  工数失去焦点变更
   * @param e amount文本框的值
   */
  onEffortBlurChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (e.toString() !== '') {
      const regValue = formatUtil.thousandEffortFormat(e.target.value.toString());
      formData[index].effort = regValue.toString();
      this.setState({
        bottomTableData: formData,
      });
    }
  };

  effortUnitChange = (e: string, index: number) => {
    if (e.toString() !== '') {
      if (this.props.effortUnitLst !== null) {
        let effortUnitList = this.props.effortUnitLst;
        effortUnitList = effortUnitList.filter((item) => item.cdNm === e.toString());
        if (effortUnitList !== undefined && effortUnitList !== null) {
          const { cdVal } = effortUnitList[0];
          formData[index].effortUnitCd = cdVal.toString();
        } else {
          formData[index].effortUnitCd = '';
        }
        formData[index].effortUnitNm = e.toString();
        this.setState({
          bottomTableData: formData,
        });
      } else {
        formData[index].effortUnitCd = '';
        formData[index].effortUnitNm = '';
        this.setState({
          bottomTableData: formData,
        });
      }
    }
  };

  onRef = (name: string, ref: any) => {
    switch (name) {
      case 'CustomerInfo':
        this.customerInfo = ref;
        break;
      case 'EndUserInfo':
        this.endUserInfo = ref;
        break;
      case 'ActualityForecastBatchAdd':
        this.actualityForecastBatchAdd = ref;
        break;
      default:
        break;
    }
  };

  handleEndUser = (endUserCds: string, endUserNms: string, index: number) => {
    formData[index].endUserCd = endUserCds;
    formData[index].endUserNm = endUserNms;
    this.setState({
      bottomTableData: formData,
    });
    lineDataUpdateFlag = true;
  };

  // endUserChange = (e: string, index: number) => {
  //   if (e.toString() !== '') {
  //     // if(e.length>100){
  //     //   return;
  //     // }
  //     if(this.props.allEndUserLst!== null){
  //       let endUserList = this.props.allEndUserLst;
  //       endUserList = endUserList.filter((item) => item.endUserNmDft === e.toString()
  //         || item.endUserNmCn === e.toString()
  //         || item.endUserNmEn === e.toString()
  //         || item.endUserNmFra === e.toString()
  //         || item.endUserNmJp === e.toString()
  //         || item.endUserShrtNmCn === e.toString()
  //         || item.endUserShrtNmEn === e.toString()
  //         || item.endUserShrtNmFra === e.toString()
  //         || item.endUserShrtNmJp === e.toString());
  //
  //       // endUserList = endUserList.filter((item) => item.endUserNm === e.toString());
  //       if (endUserList !== undefined && endUserList !== null && endUserList.length>0) {
  //         const { endUserCd } = endUserList[0];
  //         formData[index].endUserCd = endUserCd.toString();
  //       }else{
  //         formData[index].endUserCd = '';
  //       }
  //       formData[index].endUserNm = e.toString();
  //       this.setState({
  //         bottomTableData: formData,
  //       });
  //     }else{
  //       formData[index].endUserCd = '';
  //       formData[index].endUserNm = '';
  //       this.setState({
  //         bottomTableData: formData,
  //       });
  //     }
  //   }else{
  //     formData[index].endUserCd = '';
  //     formData[index].endUserNm = '';
  //     this.setState({
  //       bottomTableData: formData,
  //     });
  //   }
  //   lineDataUpdateFlag = true;
  // };

  /**
   *  Model開始月変更
   * @param date moment種類の日付
   * @param dateString stringタイプの日付
   */
  // @ts-ignore
  dataFromHandleChange = (dateString: String) => {
    if (dateString !== '') {
      if (this.state.periodTo !== '') {
        const dateFromFarmat = dateString.replace('/', '').replace('-', '');
        const dateToFarmat = this.state.periodTo.replace('/', '').replace('-', '');

        // 開始日 > 終了日
        if (dateFromFarmat > dateToFarmat) {
          if (this.props.ActForecastData.copyModelVisible === true) {
            this.setState({
              copyButtonVisible: false,
            });
          }

          if (this.props.ActForecastData.moveModelVisible === true) {
            this.setState({
              moveButtonVisible: false,
            });
          }
          message.error(formatMessage({ id: 'actualityForecastTop.message.start>end' }));
          return;
        }

        if (this.props.ActForecastData.copyModelVisible === true) {
          this.setState({
            copyButtonVisible: true,
          });
        }

        if (this.props.ActForecastData.moveModelVisible === true) {
          this.setState({
            moveButtonVisible: true,
          });
        }
      } else {
        this.setState({
          moveButtonVisible: false,
          copyButtonVisible: false,
        });
      }
    } else {
      this.setState({
        moveButtonVisible: false,
        copyButtonVisible: false,
      });
    }

    this.setState({
      periodFrom: dateString.toString(),
    });
    // @ts-ignore
    currDateFrom = `${this.props.user.currentUser?.dspYear.toString()}/${dateString.toString()}`;
  };

  /**
   *  Model終了月変更
   * @param date moment種類の日付
   * @param dateString stringタイプの日付
   */
  // @ts-ignore
  dataToHandleChange = (dateString: String) => {
    if (dateString !== '') {
      // 現在の年のみ入力
      if (this.state.periodFrom === '') {
        message.info(formatMessage({ id: 'actualityForecastTop.message.starMonth' }));
        return;
      }

      const dateFromFarmat = this.state.periodFrom.replace('/', '').replace('-', '');
      const dateToFarmat = dateString.replace('/', '').replace('-', '');

      // 開始日 > 終了日
      if (dateFromFarmat > dateToFarmat) {
        if (this.props.ActForecastData.copyModelVisible === true) {
          this.setState({
            copyButtonVisible: false,
          });
        }

        if (this.props.ActForecastData.moveModelVisible === true) {
          this.setState({
            moveButtonVisible: false,
          });
        }
        message.info(formatMessage({ id: 'actualityForecastTop.message.start>end' }));
        return;
      }

      if (this.props.ActForecastData.copyModelVisible === true) {
        this.setState({
          copyButtonVisible: true,
        });
      }

      if (this.props.ActForecastData.moveModelVisible === true) {
        this.setState({
          moveButtonVisible: true,
        });
      }

      this.setState({
        // @ts-ignore
        periodTo: dateString.toString(),
      });
      // @ts-ignore
      currDateTo = `${this.props.user.currentUser?.dspYear.toString()}/${dateString.toString()}`;
    } else {
      this.setState({
        periodTo: '',
      });
      currDateTo = '';

      this.setState({
        moveButtonVisible: false,
        copyButtonVisible: false,
      });
    }
  };

  monthComCheck = () => {
    if (
      this.state.periodFrom !== null &&
      this.state.periodFrom !== '' &&
      this.state.periodFrom !== undefined &&
      this.state.periodTo !== null &&
      this.state.periodTo !== '' &&
      this.state.periodTo !== undefined
    ) {
      const dateFromFarmat = this.state.periodFrom.replace('/', '').replace('-', '');
      const dateToFarmat = this.state.periodTo.replace('/', '').replace('-', '');

      // 選択した日付チェック
      if (dateFromFarmat > dateToFarmat) {
        message.info(formatMessage({ id: 'actualityForecastTop.message.start>end' }));
        return false;
        // 開始日 ～ 終了日 が1年より大きい
      }
      return true;
    }
    return false;
  };

  /**
   *  モデル閉鎖
   */
  handleCancel = () => {
    this.setState({
      periodTo: '',
      periodFrom: '',
      copyButtonVisible: false,
      moveButtonVisible: false,
      batchEditModelVisible: false,
      batchEditTipModel: false,
      bottomLineUpdateModel: false,
    });

    const { dispatch } = this.props;
    // copyモデルを閉じる
    dispatch({
      type: 'ActForecastData/copyModelVisible',
      payload: false,
    });
    // moveモデルを閉じる
    dispatch({
      type: 'ActForecastData/moveModelVisible',
      payload: false,
    });
  };

  /**
   * Top 画面关闭
   */
  onClose = () => {
    this.setState({
      batchEditTipModel: true,
    });
  };
  onBottomLineUpdateYes = () => {
    insertFlag = false;
    updateFlag = false;
    updateBottomLineYesFlag = true;
    updateBottomLineNoFlag = false;
    const { dispatch } = this.props;

    const actForInfoUpdateModel = JSON.stringify(formDataBak);

    const { actForMoth } = this.state;
    const actForYear = this.props.user.currentUser?.dspYear;
    const inputUserCd = this.props.user.currentUser?.inputUserCds;
    const language = this.props.user.currentUser?.dspLang;
    const orgGroupId = this.props.user.currentUser?.orgGroupId;
    const authOrgCd = this.props.user.currentUser?.authOrgCds;
    const caseYear = this.props.user.currentUser?.dspYear;
    const caseNm = '';
    const actBottomSelectParam: FetchBottomDataType = {
      actForYear,
      actForMoth,
      inputUserCd,
      language,
    };
    const actForInfoSelectModel = JSON.stringify(actBottomSelectParam);
    const caseParam: FetchCaseType = {
      language,
      caseYear,
      orgGroupId,
      authOrgCd,
      inputUserCd,
      caseNm,
    };
    const caseInfoModel = JSON.stringify(caseParam);
    dispatch({
      type: 'ActForecastData/onBottomLineUpdateYes',
      payload: {
        actForInfoUpdateModel,
      },
      payload1: {
        actForInfoSelectModel,
      },
      payload2: {
        caseInfoModel,
      },
    });
    lineDataUpdateFlag = false;
    this.setState({
      bottomLineUpdateModel: false,
    });
  };

  onBottomLineUpdateNo = () => {
    insertFlag = false;
    updateFlag = false;
    updateBottomLineYesFlag = false;
    updateBottomLineNoFlag = true;

    const { dispatch } = this.props;

    const actForInfoUpdateModel = JSON.stringify(formDataBak);

    const { actForMoth } = this.state;
    const actForYear = this.props.user.currentUser?.dspYear;
    const inputUserCd = this.props.user.currentUser?.inputUserCds;
    const language = this.props.user.currentUser?.dspLang;
    const orgGroupId = this.props.user.currentUser?.orgGroupId;
    const authOrgCd = this.props.user.currentUser?.authOrgCds;
    const caseYear = this.props.user.currentUser?.dspYear;
    const caseNm = '';
    const actBottomSelectParam: FetchBottomDataType = {
      actForYear,
      actForMoth,
      inputUserCd,
      language,
    };
    const actForInfoSelectModel = JSON.stringify(actBottomSelectParam);
    const caseParam: FetchCaseType = {
      language,
      caseYear,
      orgGroupId,
      authOrgCd,
      inputUserCd,
      caseNm,
    };
    const caseInfoModel = JSON.stringify(caseParam);
    dispatch({
      type: 'ActForecastData/onBottomLineUpdateNo',
      payload: {
        actForInfoUpdateModel,
      },
      payload1: {
        actForInfoSelectModel,
      },
      payload2: {
        caseInfoModel,
      },
    });
    lineDataUpdateFlag = false;
    this.setState({
      bottomLineUpdateModel: false,
    });
  };

  /**
   * Top 画面关闭 取消
   */
  closeCancel = () => {
    this.setState({
      batchEditTipModel: false,
    });
  };

  /**
   * batcheidt 画面关闭 确认关闭
   */
  batchEditOk = () => {
    this.setState({
      batchEditModelVisible: false,
      batchEditTipModel: false,
      topVisible1: false,
      topVisible2: false,
    });
  };

  /**
   *  コピーモデル
   */
  modelCopy = async () => {
    // 選択した月は要求に合います
    if (this.monthComCheck()) {
      formData.forEach((item, index) => {
        item.No = (index + 1).toString();
      });

      // 選択したデータ
      const newFormData = formData.filter((item) => item.checked === true);

      const actForInfoModelList: UpdateBottomDataParamType[] = [];
      newFormData.forEach((item) => {
        const actForInfoModel: UpdateBottomDataParamType = {
          actForIds: item.actForId,
          language: this.props.user.currentUser?.dspLang,
          actForYear: item.actForYear,
          actForMoth: item.actForMoth,
          orgGroupId: this.props.user.currentUser?.orgGroupId,

          countOrgCd: item.countOrgCd,
          countOrgNm: item.countOrgNm,
          busUserCd: item.busUserCd,
          busUserNm: item.busUserNm,
          cstmrCd: item.cstmrCd,
          cstmrNm: item.cstmrNm,
          actForRankCd: item.actForRankCd,
          actForRankNm: item.actForRankNm,
          caseIndstyCd: item.caseIndstyCd,
          caseIndstyNm: item.caseIndstyNm,
          caseNm: item.caseNm,
          caseNo: item.caseNo,
          orderAmt: item.orderAmt,
          cntrcCurrCd: item.cntrcCurrCd,
          cntrcCurrNm: item.cntrcCurrNm,
          effort: item.effort,
          effortUnitCd: item.effortUnitCd,
          effortUnitNm: item.effortUnitNm,
          // to do
          endUserCd: item.endUserCd,
          endUserNm: item.endUserNm,
          memo: item.memo,
          no: item.No,
          relatedNo: item.relatedNo,
          bugtId: item.bugtId,
          busActId: item.busActId,
        };
        actForInfoModelList.push(actForInfoModel);
      });

      const actBottomParam: CopyBottomDataParamType = {
        actForInfoModelList,
        periodFrom: currDateFrom,
        periodTo: currDateTo,
      };

      /**
       * Bottomデータをコピーして、データベースを更新
       */

      const actForInfoCopyModel = JSON.stringify(actBottomParam);
      const { dispatch } = this.props;
      const { actForMoth } = this.state;
      const actForYear = this.props.user.currentUser?.dspYear;
      const inputUserCd = this.props.user.currentUser?.inputUserCds;
      const language = this.props.user.currentUser?.dspLang;
      const actBottomSelectParam: FetchBottomDataType = {
        actForYear,
        actForMoth,
        inputUserCd,
        language,
      };
      const actForInfoSelectModel = JSON.stringify(actBottomSelectParam);
      await dispatch({
        type: 'ActForecastData/copyActForecastBottomData',
        payload: {
          actForInfoCopyModel,
        },
        payload1: {
          actForInfoSelectModel,
        },
      });
    }

    if (this.props.ActForecastData.copyModelVisible === false) {
      this.setState({
        periodFrom: '',
        periodTo: '',
        copyButtonVisible: false,
      });
      currDateFrom = '';
      currDateTo = '';
    }
  };

  /**
   *  移動モデル
   */
  modelMove = async () => {
    // 选中的月份符合要求
    if (this.monthComCheck()) {
      formData.forEach((item, index) => {
        item.No = (index + 1).toString();
      });

      // 选中的数据
      const newFormData = formData.filter((item) => item.checked === true);

      const actForInfoModelList: UpdateBottomDataParamType[] = [];
      newFormData.forEach((item) => {
        const actForInfoModel: UpdateBottomDataParamType = {
          actForIds: item.actForId,
          language: this.props.user.currentUser?.dspLang,
          actForYear: item.actForYear,
          actForMoth: item.actForMoth,
          orgGroupId: this.props.user.currentUser?.orgGroupId,

          countOrgCd: item.countOrgCd,
          countOrgNm: item.countOrgNm,
          busUserCd: item.busUserCd,
          busUserNm: item.busUserNm,
          cstmrCd: item.cstmrCd,
          cstmrNm: item.cstmrNm,
          actForRankCd: item.actForRankCd,
          actForRankNm: item.actForRankNm,
          caseIndstyCd: item.caseIndstyCd,
          caseIndstyNm: item.caseIndstyNm,
          caseNm: item.caseNm,
          caseNo: item.caseNo,
          orderAmt: item.orderAmt,
          cntrcCurrCd: item.cntrcCurrCd,
          cntrcCurrNm: item.cntrcCurrNm,
          effort: item.effort,
          effortUnitCd: item.effortUnitCd,
          effortUnitNm: item.effortUnitNm,
          // to do
          endUserCd: item.endUserCd,
          endUserNm: item.endUserNm,
          memo: item.memo,
          no: item.No,
          relatedNo: item.relatedNo,
          bugtId: item.bugtId,
          busActId: item.busActId,
        };
        actForInfoModelList.push(actForInfoModel);
      });

      const actBottomParam: CopyBottomDataParamType = {
        actForInfoModelList,
        periodFrom: currDateFrom,
        periodTo: currDateTo,
      };

      /**
       * Bottomデータを移動して、データベースを更新
       */
      const { dispatch } = this.props;
      const actForInfoMoveModel = JSON.stringify(actBottomParam);

      const { actForMoth } = this.state;
      const actForYear = this.props.user.currentUser?.dspYear;
      const inputUserCd = this.props.user.currentUser?.inputUserCds;
      const language = this.props.user.currentUser?.dspLang;
      const actBottomSelectParam: FetchBottomDataType = {
        actForYear,
        actForMoth,
        inputUserCd,
        language,
      };
      const actForInfoSelectModel = JSON.stringify(actBottomSelectParam);
      await dispatch({
        type: 'ActForecastData/moveActForecastBottomData',
        payload: {
          actForInfoMoveModel,
        },
        payload1: {
          actForInfoSelectModel,
        },
      });
    }
    if (this.props.ActForecastData.moveModelVisible === false) {
      this.setState({
        periodFrom: '',
        periodTo: '',
        moveButtonVisible: false,
      });
      currDateFrom = '';
      currDateTo = '';
    }
  };

  /**
   * メッセージモデル閉鎖
   * */
  hideModal = () => {
    const { dispatch } = this.props;
    const visible = false;
    dispatch({
      type: 'ActForecastData/changeBottomModelVisible',
      payload: {
        visible,
      },
    });
  };

  /**
   * メッセージモデル 確認
   * */
  confirm = async () => {
    // メッセージモデル閉鎖
    this.hideModal();

    // customerデータの挿入
    const customerInfoModel = JSON.stringify(addCustomerParam);

    // endUserデータの挿入
    const endUserInfoModel = JSON.stringify(addEndUserParam);

    // customer or endUserデータを更新
    const language = this.props.user.currentUser?.dspLang;
    const caseYear = this.props.user.currentUser?.dspYear;
    const orgGroupId = this.props.user.currentUser?.orgGroupId;
    const inputUserCd = this.props.user.currentUser?.inputUserCds;
    const authOrgCd = this.props.user.currentUser?.authOrgCds;
    const caseNm = '';
    // const caseParam: FetchCaseType = { language, caseYear, orgGroupId, caseNm };
    const caseParam: FetchCaseType = {
      language,
      caseYear,
      orgGroupId,
      authOrgCd,
      inputUserCd,
      caseNm,
    };
    const caseInfoModel = JSON.stringify(caseParam);

    // bottomデータの更新または挿入
    const actForInfoUpdateModel = JSON.stringify(formDataBak);

    // bottomデータを更新
    const { actForMoth } = this.state;
    const actForYear = this.props.user.currentUser?.dspYear;
    // const inputUserCd = this.props.user.currentUser?.inputUserCds;
    const actBottomSelectParam: FetchBottomDataType = {
      actForYear,
      actForMoth,
      inputUserCd,
      language,
    };
    const actForInfoSelectModel = JSON.stringify(actBottomSelectParam);
    const { dispatch } = this.props;
    await dispatch({
      type: 'global/inForceFlag',
      payload: false,
    });
    // customer and endUserを挿入
    if (this.props.ActForecastData.messageData.data === 'customer+endUser') {
      /**
       * CustomerとendUserデータを追加します（act Bottom用）
       */
      await dispatch({
        type: 'ActForecastData/addCustomerAndEndUserDataInfo',
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
          actForInfoUpdateModel,
        },
        payload4: {
          actForInfoSelectModel,
        },
        payload5: {
          insertFlag,
        },
        payload6: {
          updateFlag,
        },
        payload7: {
          caseInfoModel,
        },
        payload8: {
          updateBottomLineYesFlag,
        },
        payload9: {
          updateBottomLineNoFlag,
        },
      });

      // customerを挿入
    } else if (this.props.ActForecastData.messageData.data === 'customer') {
      /**
       * customerデータの追加（act Bottom用）
       */
      await dispatch({
        type: 'ActForecastData/addCustomerDataInfo',
        payload: {
          customerInfoModel,
        },
        payload1: {
          caseInfoModel,
        },
        payload2: {
          actForInfoUpdateModel,
        },
        payload3: {
          actForInfoSelectModel,
        },
        payload4: {
          insertFlag,
        },
        payload5: {
          updateFlag,
        },
        payload6: {
          caseInfoModel,
        },
        payload7: {
          updateBottomLineYesFlag,
        },
        payload8: {
          updateBottomLineNoFlag,
        },
      });

      // endUserを挿入
    } else if (this.props.ActForecastData.messageData.data === 'endUser') {
      /**
       * endUserデータの追加（act Bottom用）
       */
      await dispatch({
        type: 'ActForecastData/addEndUserDataInfo',
        payload: {
          endUserInfoModel,
        },
        payload1: {
          caseInfoModel,
        },
        payload2: {
          actForInfoUpdateModel,
        },
        payload3: {
          actForInfoSelectModel,
        },
        payload4: {
          insertFlag,
        },
        payload5: {
          updateFlag,
        },
        payload6: {
          caseInfoModel,
        },
        payload7: {
          updateBottomLineYesFlag,
        },
        payload8: {
          updateBottomLineNoFlag,
        },
      });
    }
  };

  /**
   * 入力ヒント閉じる
   * */
  notEnterHideModal = async () => {
    const { dispatch } = this.props;
    this.setState({
      notEnterTip: '',
    });
    await dispatch({
      type: 'global/inForceFlag',
      payload: true,
    });
    await dispatch({
      type: 'global/dialogBoxFlag',
      payload: true,
    });
  };

  /**
   * 入力ヒント確認
   * */
  notEnterConfirm = async () => {
    const { dispatch } = this.props;
    this.setState({
      notEnterTip: '',
    });

    await dispatch({
      type: 'global/inForceFlag',
      payload: false,
    });
    await this.updateOrInsertData(indexBak);
  };

  menuHead = () => {
    return (
      <Menu className={styles.subMenu}>
        <Menu.Item onClick={() => this.copy()}>
          <CopyOutlined />
          {formatMessage({ id: 'actualityForecastBottom.tooltip.copy' })}
        </Menu.Item>
        <Menu.Item onClick={() => this.move()}>
          <DragOutlined />
          {formatMessage({ id: 'actualityForecastBottom.tooltip.move' })}
        </Menu.Item>
        <Menu.Item>
          <Popconfirm
            title={formatMessage({ id: 'actualityForecastBottom.message.delete' })}
            onConfirm={() => this.remove()}
            onCancel={this.topCancel}
            okText={formatMessage({ id: 'actualityForecastTop.messageModel.confirm' })}
            cancelText={formatMessage({ id: 'actualityForecastTop.messageModel.cancel' })}
          >
            <DeleteOutlined />
            {formatMessage({ id: 'actualityForecastBottom.tooltip.delete' })}
          </Popconfirm>
        </Menu.Item>
      </Menu>
    );
  };

  menuLine = (record: ActBottomDataType, index: number, editDisableFlag:boolean, nowYearFlag:boolean) => {
    let relatedNoFlg : boolean = false;
    if (record.relatedNo === null || record.relatedNo === ''){
      relatedNoFlg = true;
    }
    return (
      <Menu>
        <Menu.Item
          disabled={editDisableFlag === true}
          onClick={() => this.edit(index)}>
          <EditOutlined />
          {formatMessage({ id: 'actualityForecastBottom.tooltip.editLine' })}
        </Menu.Item>
        <Menu.Item
          disabled={editDisableFlag === true}
          onClick={() => this.copyOne(record)}>
          <CopyOutlined />
          {formatMessage({ id: 'actualityForecastBottom.tooltip.copyLine' })}
        </Menu.Item>
        <Menu.Item
          disabled={editDisableFlag === true}
        >
          <Popconfirm
            onCancel={this.topCancel}
            title={formatMessage({ id: 'actualityForecastBottom.message.delete' })}
            onConfirm={() => this.removeOne(record.actForId)}
            okText={formatMessage({ id: 'actualityForecastTop.messageModel.confirm' })}
            cancelText={formatMessage({ id: 'actualityForecastTop.messageModel.cancel' })}
          >
            <DeleteOutlined />
            {formatMessage({ id: 'actualityForecastBottom.tooltip.deleteLine' })}
          </Popconfirm>
        </Menu.Item>
        <Menu.Item
          disabled={nowYearFlag ? false : true}
          className={styles.subMenu} onClick={() => this.batchEdit(index)}>
          <FormOutlined />
          {formatMessage({ id: 'actualityForecastBottom.tooltip.caseEdit' })}
        </Menu.Item>
        <Menu.Item onClick={() => this.topVisible1(index)}
                   // 予算実績フラグ＜＞1の場合、そのサブメニューはDisableで設定
                   disabled={('1'===this.props.ActForecastData.budActFlg ? false : true) || editDisableFlag === true || relatedNoFlg}
        >
          <AccountBookOutlined />
          {formatMessage({ id: 'actualityForecastTop.message.relationshipWithBudget' })}
        </Menu.Item>
        <Menu.Item
          disabled={editDisableFlag === true || relatedNoFlg}
          onClick={() => this.topVisible2(index)}>
          <FileSyncOutlined />
          {formatMessage({ id: 'actualityForecastTop.message.relationshipWithBusinessActivities' })}
        </Menu.Item>
        <Menu.Item className={styles.subMenu}
          disabled={record.bugtId === null ? true : false}
          onClick={(e) => {
            this.clickMenuRow1(e, index, record);
          }}
        >
          <PercentageOutlined />
          {formatMessage({ id: 'actualityForecastBottom.tooltip.compare' })}
        </Menu.Item>

        <Menu.Item
          disabled={record.busActId === null ? true : false}
          onClick={(e) => {
            this.clickMenuRow2(e, index, record, record.busActId);
          }}
        >
          <SnippetsOutlined />
          {formatMessage({ id: 'actualityForecastBottom.tooltip.sales' })}
        </Menu.Item>
      </Menu>
    );
  };

  topVisible1 = (index:number) => {
    this.setState({
      topVisible1: true,
      relatedNo: formData[index].relatedNo,
      bugtId: formData[index].bugtId,
    });
  };

  topVisible2 = (index: number) => {
    this.setState({
      topVisible2: true,
      relatedNo: formData[index].relatedNo,
      busActId: formData[index].busActId,
      cstmrNm: formData[index].cstmrNm,
      endUserNm:formData[index].endUserNm,
      caseNm: formData[index].caseNm,
    });
  };
  /**
   * Top 画面关闭 确认关闭
   */
  closeOk = () => {
    this.setState({
      // topVisible: false,
      topTipModel: false,
    });
    // this.actualityForecastBatchAdd.clearTopPage();
  }

  showTopDrawer = async (flg: boolean) => {
    const { dispatch } = this.props;
    if (dispatch) {
      await dispatch({
        type: 'global/topVisible',
        payload: flg,
      });
    }
  };

  menuCaseNm = (index: number, record: any) => {
    return (
      <Menu>
        <Menu.Item
          disabled={record.bugtId === null ? true : false}
          onClick={(e) => {
            this.clickMenuRow1(e, index, record);
          }}
        >
          <PercentageOutlined />
          {formatMessage({ id: 'actualityForecastBottom.tooltip.compare' })}
        </Menu.Item>
        <Menu.Item
          disabled={record.busActId === null ? true : false}
          onClick={(e) => {
            this.clickMenuRow2(e, index, record, record.busActId);
          }}
        >
          <SnippetsOutlined />
          {formatMessage({ id: 'actualityForecastBottom.tooltip.sales' })}
        </Menu.Item>
      </Menu>
    );
  };

  closeCaseAch = () => {
    this.setState({
      caseAchVisible: false,
      cseeAchTitle: '',
    });
  };

  clickMenuRow1 = async (e: any, index: number, record: any) => {
    const { dispatch } = this.props;
    const param = this.props.user.currentUser?.dspYear;
    const param1 = record.relatedNo;
    const param2 = record.bugtId;

    this.setState({
      caseAchVisible: true,
      cseeAchTitle: record.caseNm + ' ' + formatMessage({ id: 'common.basic.compare' }),
    });

    dispatch({
      type: 'searchActForData/getCompareData',
      payload: {
        param,
      },
      payload1: {
        param1,
      },
      payload2: {
        param2,
      },
    });
  };

  clickMenuRow2 = async (e: any, index: number, record: any, busActId: string) => {
    const { dispatch } = this.props;
    if (dispatch) {
      await dispatch({
        type: 'ActForecastData/getBusActHead',
        payload: busActId,
      });
    }
    this.props.ActForecastData.busActHead.busUserNm = record.busUserNm;
    history.push({
      pathname: '/businessactivitiesEditAct',
      query: { id: 'EditActivities' },
      state: { head: this.props.ActForecastData.busActHead },
    });
  };
  onCstmrNmEndUserNmClick= async (index: number,record:any,isEndUser:boolean)=>{
    isClickable = false;
    if (index <= columnsNum) {
      formData[index].editable = false;
    }

    const { dispatch } = this.props;

    // const actForYear = this.props.user.currentUser?.dspYear;
    
    // const cntrcCurrCd = this.props.user.currentUser?.dspCurrCd;

    // const cstmrCd = record.cstmrCd;

    // const fetchActForeCaseMonthSummaryType: FetchActForeCaseMonthSummaryType = { actForYear, cntrcCurrCd,cstmrCd ,};
    // const fetchActForeCaseMonthSummary = JSON.stringify(fetchActForeCaseMonthSummaryType);
    // await dispatch({
    //   type: 'ActForecastData/fetchActForeCaseMonthSummaryLst',
    //   payload: {
    //     fetchActForeCaseMonthSummaryType,
    //   },
    // });
    if (isEndUser) {
      this.setState({
        summaryCstmrCd: "",
        summaryCstmrNm: "",
        summaryEndUserCd: record.endUserCd,
        summaryEndUserNm: record.endUserNm,
      });
    } else {
      this.setState({
        summaryCstmrCd: record.cstmrCd,
        summaryCstmrNm: record.cstmrNm,
        summaryEndUserCd: "",
        summaryEndUserNm: "",
      });
    }

    const payload = true;
    await dispatch({
      type: 'searchActForData/changeMonthSummaryModelCollapsed',
      payload
    });

    isClickable = true;
  };
  // 削除確認気泡をオフにする
  topCancel = () => {
    this.setState({
      deletePop: false,
    });
  };
  render() {
    const {
      userLst,
      authOrgCdLst,
      customerLst,
      allCustomerLst,
      industryLst,
      caseLst,
      probabilityLst,
      currencyLst,
      effortUnitLst,
      endUserLst,
      allEndUserLst,
    } = this.props;

    // 是否是系统管理员
    let sysAdminFlag: boolean = false;
    if (this.props.user.currentUser !== undefined && this.props.user.currentUser.userDiv === '2') {
      sysAdminFlag = true;
    } else if (
      this.props.user.currentUser !== undefined &&
      this.props.user.currentUser.userDiv !== '2'
    ) {
      sysAdminFlag = false;
    }

    // 个人设定画面选择的年是否是系统当前年
    let nowYearFlag: boolean = false;
    if (this.props.user.currentUser?.dspYear && this.props.user.currentUser?.dspYear.localeCompare(this.props.noYear) >= 0) {
      nowYearFlag = true;
    } else {
      nowYearFlag = false;
    }

    // 当前年份的月是否可以编辑
    let editDisableFlag: boolean;
    let monthList = [];
    if(this.props.lastYearMonthList.length>0){
      monthList = this.props.lastYearMonthList.filter(
        (item) => item.toString() === this.state.actForMoth,
      );
    }
    // 当前选中的月可以编辑
    if (
      sysAdminFlag === true ||
      (monthList !== undefined && monthList !== null && monthList.length > 0) ||
      nowYearFlag === true
    ) {
      editDisableFlag = false;
    } else {
      editDisableFlag = true;
    }

    // 言語別-確率のWidth
    let probabilityWidth: string = '98px';
    if (localStorage.getItem('umi_locale') === 'en-US') {
      probabilityWidth = '110px';
    } else if (localStorage.getItem('umi_locale') === 'zh-CN') {
      probabilityWidth = '92px';
    }

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

    // option Valueを取得
    // const customerOptions: CustomerOptionType[] = [];
    // if(customerLst!== null && customerLst.length>0){
    //   customerLst.forEach((item) => {
    //     if (item.cstmrNm !== null && item.cstmrNm !== '') {
    //       let tooltips =item.cstmrNm;
    //       if(allCustomerLst!== null && allCustomerLst.length>0){
    //         const titleInfo = allCustomerLst.filter((allItem)=>allItem.cstmrCd.toString() === item.cstmrCd.toString());
    //         if(titleInfo && titleInfo.length>0){
    //           tooltips = titleInfo[0].cstmrNm;
    //         }
    //       }
    //       const optionItem: CustomerOptionType = {
    //         lable: item.cstmrNm,
    //         value: item.cstmrNm,
    //         key: item.cstmrCd.toString(),
    //         title: tooltips,
    //       };
    //       customerOptions.push(optionItem);
    //     }
    //   });
    // }else{
    //   const optionItem: CustomerOptionType = {
    //     lable:'',
    //     value: '',
    //     key: '',
    //     title: '',
    //   };
    //   customerOptions.push(optionItem);
    // }

    const caseOptions: OptionType[] = [];
    if (
      this.state.bottomTableData !== undefined &&
      this.state.bottomTableData !== null &&
      this.state.bottomTableData.length > 0
    ) {
      const editList = this.state.bottomTableData.filter((botItem) => botItem.editable === true);
      // 编辑状态
      if (editList !== undefined && editList !== null && editList.length > 0) {
        // 当前编辑行的顾客code
        const { cstmrCd } = editList[0];

        // 顾客code为空
        if (cstmrCd === '' || cstmrCd === 'undefined') {
          // @ts-ignore
          if (
            caseLst !== null &&
            caseLst !== undefined &&
            caseLst !== '' &&
            caseLst.name !== null &&
            caseLst.name !== '' &&
            caseLst.name !== undefined &&
            caseLst.name.length > 0
          ) {
            caseLst.name.forEach((item) => {
              if (item.caseNm !== null && item.caseNm !== '') {
                const optionItem: OptionType = {
                  value: item.caseNm,
                };
                caseOptions.push(optionItem);
              }
            });
          } else {
            const optionItem: OptionType = {
              value: '',
            };
            caseOptions.push(optionItem);
          }
          // 顾客code不为空对查询的caselist进行筛选
        } else {
          // @ts-ignore
          if (
            caseLst !== null &&
            caseLst !== undefined &&
            caseLst !== '' &&
            caseLst.name !== null &&
            caseLst.name !== '' &&
            caseLst.name !== undefined &&
            caseLst.name.length > 0
          ) {
            caseLst.cd.forEach((item) => {
              if (
                item.caseNm !== null &&
                item.caseNm !== '' &&
                item.cstmrCd.toString() === cstmrCd
              ) {
                const optionItem: OptionType = {
                  value: item.caseNm,
                };
                caseOptions.push(optionItem);
              }
            });
          } else {
            const optionItem: OptionType = {
              value: '',
            };
            caseOptions.push(optionItem);
          }
        }
        if (caseOptions.length === 0) {
          const optionItem: OptionType = {
            value: '',
          };
          caseOptions.push(optionItem);
        }
      }
    }

    const caseNumberOptions: OptionType[] = [];
    if (this.state.caseNumsValue !== null && this.state.caseNumsValue.length > 0) {
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
      if (caseNumberOptions.length === 0) {
        const optionItem: OptionType = {
          value: '',
        };
        caseNumberOptions.push(optionItem);
      }
    } else {
      const optionItem: OptionType = {
        value: '',
      };
      caseNumberOptions.push(optionItem);
    }

    // const endUserOptions: CustomerOptionType[] = [];
    // if(endUserLst!==null && endUserLst.length>0){
    //   endUserLst.forEach((item) => {
    //     if (item.endUserNm !== null && item.endUserNm !== '') {
    //       let tooltips =item.endUserNm;
    //       if(allEndUserLst!== null && allEndUserLst.length>0){
    //         const titleInfo = allEndUserLst.filter((allItem)=>allItem.endUserCd.toString() === item.endUserCd.toString());
    //         if(titleInfo && titleInfo.length>0){
    //           tooltips = titleInfo[0].endUserNm;
    //         }
    //       }
    //       const optionItem: CustomerOptionType = {
    //         lable: item.endUserNm,
    //         value: item.endUserNm,
    //         key: item.endUserCd.toString(),
    //         title: tooltips,
    //       };
    //       endUserOptions.push(optionItem);
    //     }
    //   });
    // }else{
    //   const optionItem: CustomerOptionType = {
    //     value: '',
    //     lable: '',
    //     key: '',
    //     title: '',
    //   };
    //   endUserOptions.push(optionItem);
    // }

    // var inputs = document.getElementsByTagName('input');
    const columns = [
      {
        title: () => (
          <div className={styles.actionDiv}>
            <Dropdown
              disabled={(sysAdminFlag === false && nowYearFlag === false)||isClickable===false}
              overlay={this.menuHead()}>
              <UnorderedListOutlined />
            </Dropdown>
          </div>
        ),
        key: 'action',
        width: '60px',
        fixed: 'left',
        render: (text: string, record: ActBottomDataType, index: number) => {
          if (record.editable) {
            return (
              <div className={styles.actionDiv}>
                <Space size={4}>
                  <CheckOutlined onClick={() => this.save(record, index)} />
                  <CloseOutlined onClick={() => this.cancel()} />
                </Space>
              </div>
            );
          }
          return (
            <div className={styles.actionDiv}>
              <Space size={4}>
                <Checkbox
                  disabled={editDisableFlag === true||isClickable===false}
                  defaultChecked={false}
                  checked={record.checked}
                  onChange={(e) => this.checkBoxChange(e, index)}
                />
                <Tooltip
                  placement="rightBottom"
                  title={formatMessage({ id: 'actualityForecastBottom.tooltip.manage' })}
                  color="#FAD460"
                >
                  <Dropdown
                    disabled={isClickable===false}
                    overlay={this.menuLine(record, index,editDisableFlag,nowYearFlag)}>
                    <UnorderedListOutlined />
                  </Dropdown>
                </Tooltip>
              </Space>
            </div>
          );
        },
      },
      {
        title: formatMessage({ id: 'actualityForecastBottom.tableHead.No' }),
        dataIndex: 'No',
        key: 'No',
        width: '80px',
        fixed: 'left',
        // eslint-disable-next-line @typescript-eslint/no-shadow
        render: (text: any, record: any, index: number) => {
          const no = index + 1;

          return (
            <div className={styles.noDiv}>
              {record.actForRankCd !== '1' &&
              !(nowYearFlag && this.state.actForMoth >= this.props.actForMoth) ? (
                <Tooltip
                  placement="rightBottom"
                  title={formatMessage({ id: 'actualityForecastBottom.tooltip.noOrder' })}
                  color="#FAD460"
                >
                  <WarningTwoTone twoToneColor="#FF6633" /> {no}
                </Tooltip>
              ) : (
                no
              )}
            </div>
          );
        },
      },
      {
        title: formatMessage({ id: 'actualityForecastBottom.tableHead.customer' }),
        dataIndex: 'customer',
        key: 'customer',
        sorter: isClickable ? {
          compare: (a: {cstmrNm: string}, b: {cstmrNm: string}) => {
            if (isClickable) {
              const aVlue = a.cstmrNm ? a.cstmrNm :'';
              const bVlue = b.cstmrNm ? b.cstmrNm :'';
              return aVlue.localeCompare(bVlue);
            }
          },
        } : false,
        showSorterTooltip: false,
        width: '200px',
        fixed: 'left',
        render: (text: string, record: ActBottomDataType, index: number) => {
          if (record.editable) {
            return (
              // <AutoComplete
              //   className={styles.select}
              //   autoFocus
              //   dropdownMatchSelectWidth={280}
              //   defaultValue={record.cstmrNm}
              //   onChange={(e) => this.customerChange(e, index)}
              //   // @ts-ignore
              //   onSelect={(e) => this.customerChange(e, index)}
              //   allowClear
              //   options={customerOptions}
              //   filterOption={(inputValue, option) => {
              //     // @ts-ignore
              //     //   option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
              //     // }
              //     if (allCustomerLst !== null && allCustomerLst !== undefined) {
              //     const allCstrInfo = allCustomerLst.filter((item) => (item.cstmrNmDft && item.cstmrNmDft.toUpperCase().indexOf(inputValue.toUpperCase().toString()) !== -1)
              //         || (item.cstmrNmCn && item.cstmrNmCn.toUpperCase().indexOf(inputValue.toUpperCase().toString()) !== -1)
              //         || (item.cstmrNmEn && item.cstmrNmEn.toUpperCase().indexOf(inputValue.toUpperCase().toString()) !== -1)
              //         || (item.cstmrNmFra && item.cstmrNmFra.toUpperCase().indexOf(inputValue.toUpperCase().toString()) !== -1)
              //         || (item.cstmrNmJp && item.cstmrNmJp.toUpperCase().indexOf(inputValue.toUpperCase().toString()) !== -1)
              //         || (item.cstmrShrtNmCn && item.cstmrShrtNmCn.toUpperCase().indexOf(inputValue.toUpperCase().toString()) !== -1)
              //         || (item.cstmrShrtNmEn && item.cstmrShrtNmEn.toUpperCase().indexOf(inputValue.toUpperCase().toString()) !== -1)
              //         || (item.cstmrShrtNmFra && item.cstmrShrtNmFra.toUpperCase().indexOf(inputValue.toUpperCase().toString()) !== -1)
              //         || (item.cstmrShrtNmJp && item.cstmrShrtNmJp.toUpperCase().indexOf(inputValue.toUpperCase().toString()) !== -1));
              //     if (allCstrInfo && allCstrInfo.length > 0 && option) {
              //       const cstmrcds = allCstrInfo.filter((item) => (item.cstmrCd!==null && item.cstmrCd.toString()=== option.key));
              //       if(cstmrcds && cstmrcds.length > 0){
              //         return true;
              //       }
              //     }
              //   }
              //  return false;
              //   }
              //   }
              // />
              <CustomerInfo
                id={'customer'}
                bottom={true}
                disabled={onlyEditFlag}
                cstmrCd={record.cstmrCd}
                cstmrNm={record.cstmrNm}
                customerLst={customerLst}
                allCustomerLst={allCustomerLst}
                caseLst={caseLst}
                index={index}
                itemNm={formatMessage({ id: 'actualityForecastBottom.tableHead.customer' })}
                checkLength={100}
                caseFlag="0"
                styleFlag="0"
                onRef={this.onRef}
                handleCustomer={this.handleCustomer.bind(this)}
                onInputKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    document.querySelector('#case').focus();
                  }
                }}
              />
            );
          }
          return <a  onClick={() => this.onCstmrNmEndUserNmClick(index,record,false)}>{record.cstmrNm}</a>;
        },
      },

      {
        title: formatMessage({ id: 'actualityForecastBottom.tableHead.case' }),
        dataIndex: 'case',
        key: 'case',
        width: '200px',
        fixed: 'left',
        sorter: isClickable ? {
          compare: (a: {caseNm: string}, b: {caseNm: string}) => {
            if (isClickable) {
              const aVlue = a.caseNm ? a.caseNm :'';
              const bVlue = b.caseNm ? b.caseNm :'';
              return aVlue.localeCompare(bVlue);
            }
          },
        } : false,
        showSorterTooltip: false,
        render: (text: string, record: ActBottomDataType, index: number) => {
          if (record.editable) {
            return (
              <AutoComplete
                id={'case'}
                disabled={onlyEditFlag}
                className={styles.select}
                dropdownMatchSelectWidth={220}
                defaultValue={this.state.bottomTableData[index].caseNm}
                value={this.state.bottomTableData[index].caseNm}
                onChange={(e) => this.caseChange(e, index)}
                // @ts-ignore
                onSelect={(e) => this.caseChange(e, index)}
                allowClear
                options={caseOptions}
                filterOption={(inputValue, option) =>
                  // @ts-ignore
                  option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                }
                onInputKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    document.querySelector('#caseNumber').focus();
                  }
                }}
              />
            );
          } else {
            return (
              <Dropdown overlay={this.menuCaseNm(index, record)}>
                <a>{record.caseNm}</a>
              </Dropdown>
            );
          }
          return record.caseNm;
        },
      },
      {
        title: formatMessage({ id: 'actualityForecastBottom.tableHead.caseNumber' }),
        dataIndex: 'caseNumber',
        key: 'caseNumber',
        width: '120px',
        sorter: isClickable ? {
          compare: (a: {caseNo: string}, b: {caseNo: string}) => {
            if (isClickable) {
              const aVlue = a.caseNo ? a.caseNo :'';
              const bVlue = b.caseNo ? b.caseNo :'';
              return aVlue.localeCompare(bVlue);
            }
          },
        } : false,
        showSorterTooltip: false,
        render: (text: string, record: ActBottomDataType, index: number) => {
          if (record.editable) {
            return (
              <AutoComplete
                id={'caseNumber'}
                disabled={onlyEditFlag}
                className={styles.select}
                defaultValue={this.state.bottomTableData[index].caseNo}
                value={this.state.bottomTableData[index].caseNo}
                onChange={(e) => this.caseNumberChange(e, index)}
                onSelect={(e) => this.caseNumberChange(e, index)}
                allowClear
                options={caseNumberOptions}
                filterOption={(inputValue, option) =>
                  // @ts-ignore
                  option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                }
                onInputKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    document.querySelector('#probability').focus();
                  }
                }}
              />
            );
          }
          return record.caseNo;
        },
      },
      {
        title: formatMessage({ id: 'actualityForecastBottom.tableHead.probability' }),
        dataIndex: 'probability',
        width: probabilityWidth,
        sorter: isClickable ? {
          compare: (a: {actForRankNm: string}, b: {actForRankNm: string}) => {
            if (isClickable) {
              const aVlue = a.actForRankNm ? a.actForRankNm :'';
              const bVlue = b.actForRankNm ? b.actForRankNm :'';
              return aVlue.localeCompare(bVlue);
            }
          },
        } : false,
        showSorterTooltip: false,
        render: (text: string, record: ActBottomDataType, index: number) => {
          if (record.editable) {
            return (
              <Select
                id={'probability'}
                className={styles.select}
                defaultValue={record.actForRankNm}
                onSelect={(e) => {
                  this.probabilityChange(e, index);
                  document.querySelector('#contractAmount').focus();
                }}
              >
                {getProbabilityOption(probabilityLst)}
              </Select>
            );
          }
          return record.actForRankNm;
        },
      },
      {
        title: formatMessage({ id: 'actualityForecastBottom.tableHead.contractAmount' }),
        dataIndex: 'amount',
        key: 'amount',
        width: '100px',
        render: (text: string, record: ActBottomDataType, index: number) => {
          if (record.editable) {
            return (
              <Input
                id={'contractAmount'}
                className={styles.amountInput}
                value={record.orderAmt.toLocaleString()}
                onChange={(e) => this.amountChange(e, index)}
                onFocus={(e) => this.onAmountFocusChange(e, index)}
                onBlur={(e) => this.onAmountBlurChange(e, index)}
                onPressEnter={(e) =>{
                  document.querySelector('#contractCurrency').focus();
                }}
              />
            );
          }
          return <div className={styles.amountDiv}>{record.orderAmt.toLocaleString()}</div>;
        },
      },
      {
        title: formatMessage({ id: 'actualityForecastBottom.tableHead.contractCurrency' }),
        dataIndex: 'currency',
        key: 'currency',
        width: '100px',
        render: (text: string, record: ActBottomDataType, index: number) => {
          if (record.editable) {
            return (
              <Select
                id={'contractCurrency'}
                className={styles.select}
                defaultValue={record.cntrcCurrNm}
                onSelect={(e) => {
                  this.currencyChange(e, index);
                  document.querySelector('#effort1').focus();
                }}
              >
                {getCurrencyLstOption(currencyLst)}
              </Select>
            );
          }
          return record.cntrcCurrNm;
        },
      },
      {
        title: formatMessage({ id: 'actualityForecastBottom.tableHead.effort' }),
        dataIndex: 'effort',
        key: 'effort',
        width: '109px',
        render: (text: string, record: ActBottomDataType, index: number) => {
          if (record.editable) {
            return (
              <div>
                <Input
                  id={'effort1'}
                  className={styles.effortInput}
                  value={record.effort}
                  onChange={(e) => this.effortChange(e, index)}
                  onFocus={(e) => this.onEffortFocusChange(e, index)}
                  onBlur={(e) => this.onEffortBlurChange(e, index)}
                  onPressEnter={(e) => {document.querySelector('#effort2').focus();}}
                />
                <Select
                  id={'effort2'}
                  className={styles.effortSelect}
                  showSearch
                  defaultValue={record.effortUnitNm}
                  optionFilterProp="effortUnit"
                  onSearch={(e) => this.effortUnitChange(e, index)}
                  onSelect={(e) => {
                    this.effortUnitChange(e, index);
                    document.querySelector('#accountingDepartment').focus();
                  }}
                  filterOption={(input, option) =>
                    // @ts-ignore
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {getEffortUnitLstOption(effortUnitLst)}
                </Select>
              </div>
            );
          }

          return (
            <div className={styles.effortDiv}>
              {record.effort && record.effort.toString() !== '0.00' ? (
                <Space size={3}>
                  {record.effort}
                  {record.effortUnitNm}
                </Space>
              ) : (
                <div>-</div>
              )}
            </div>
          );
        },
      },
      {
        title: formatMessage({ id: 'actualityForecastBottom.tableHead.accountingDepartment' }),
        dataIndex: 'accounting',
        key: 'accounting',
        width: '150px',
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        render: (text: string, record: ActBottomDataType, index: number) => {
          if (record.editable) {
            return (
              <Select
                id={'accountingDepartment'}
                disabled={onlyEditFlag}
                className={styles.select}
                value={record.countOrgNm}
                dropdownMatchSelectWidth={250}
                // @ts-ignore
                onSelect={(e) => {
                  this.onOrgCdChange(e, index);
                  document.querySelector('#businessCharge').focus();
                }}
              >
                {getOrgCdOption(authOrgCdLst)}
              </Select>
            );
          }
          return record.countOrgNm;
        },
      },
      {
        title: formatMessage({ id: 'actualityForecastTop.tableHead.businessCharge' }),
        dataIndex: 'busUserNm',
        key: 'busUserNm',
        width: '150px',
        render: (text: string, record: ActBottomDataType, index: number) => {
          if (record.editable) {
            return (
              <Select
                id={'businessCharge'}
                disabled={onlyEditFlag}
                className={styles.select}
                defaultValue={record.busUserNm}
                // @ts-ignore
                onSelect={(e) => {
                  this.businessChargeChange(e, index);
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
        title: formatMessage({ id: 'actualityForecastBottom.tableHead.industry' }),
        dataIndex: 'industry',
        key: 'industry',
        width: '90px',
        render: (text: string, record: ActBottomDataType, index: number) => {
          if (record.editable) {
            return (
              <Select
                id={'industry'}
                disabled={onlyEditFlag}
                className={styles.select}
                defaultValue={record.caseIndstyNm}
                onSelect={(e) => {this.industryChange(e, index);
                  document.querySelector('#endUser').focus();
                }}
              >
                {getIndustryOption(industryLst)}
              </Select>
            );
          }
          return record.caseIndstyNm;
        },
      },
      {
        title: formatMessage({ id: 'actualityForecastBottom.tableHead.endUser' }),
        dataIndex: 'endUser',
        key: 'endUser',
        width: '220px',
        render: (text: string, record: ActBottomDataType, index: number) => {
          if (record.editable) {
            return (
              // <AutoComplete
              //   className={styles.select}
              //   defaultValue={record.endUserNm}
              //   onSearch={(e) => this.endUserChange(e, index)}
              //   // @ts-ignore
              //   onSelect={(e) => this.endUserChange(e, index)}
              //   allowClear
              //   options={endUserOptions}
              //   filterOption={(inputValue, option) =>{
              //     // @ts-ignore
              //     // option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
              //     if (allEndUserLst !== null && allEndUserLst !== undefined) {
              //     const allEndUserInfo = allEndUserLst.filter((item) => (item.endUserNmDft && item.endUserNmDft.toUpperCase().indexOf(inputValue.toUpperCase().toString()) !== -1)
              //     || (item.endUserNmCn && item.endUserNmCn.toUpperCase().indexOf(inputValue.toUpperCase().toString()) !== -1)
              //     || (item.endUserNmEn && item.endUserNmEn.toUpperCase().indexOf(inputValue.toUpperCase().toString()) !== -1)
              //     || (item.endUserNmFra && item.endUserNmFra.toUpperCase().indexOf(inputValue.toUpperCase().toString()) !== -1)
              //     || (item.endUserNmJp && item.endUserNmJp.toUpperCase().indexOf(inputValue.toUpperCase().toString()) !== -1)
              //     || (item.endUserShrtNmCn && item.endUserShrtNmCn.toUpperCase().indexOf(inputValue.toUpperCase().toString()) !== -1)
              //     || (item.endUserShrtNmEn && item.endUserShrtNmEn.toUpperCase().indexOf(inputValue.toUpperCase().toString()) !== -1)
              //     || (item.endUserShrtNmFra && item.endUserShrtNmFra.toUpperCase().indexOf(inputValue.toUpperCase().toString()) !== -1)
              //     || (item.endUserShrtNmJp && item.endUserShrtNmJp.toUpperCase().indexOf(inputValue.toUpperCase().toString()) !== -1));
              //     if (allEndUserInfo && allEndUserInfo.length > 0 && option) {
              //     const endUsercds = allEndUserInfo.filter((item) => (item.endUserCd!==null && item.endUserCd.toString()=== option.key));
              //     if(endUsercds && endUsercds.length > 0){
              //     return true;
              //   }
              //   }
              //   }
              //     return false;
              //   }
              //   }
              // />
              <EndUserInfo
                id={'endUser'}
                disabled={onlyEditFlag}
                endUserCd={record.endUserCd}
                endUserNm={record.endUserNm}
                endUserLst={endUserLst}
                allEndUserLst={allEndUserLst}
                index={index}
                itemNm={formatMessage({ id: 'actualityForecastBottom.tableHead.endUser' })}
                checkLength={100}
                styleFlag="0"
                onRef={this.onRef}
                handleEndUser={this.handleEndUser.bind(this)}
                onInputKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    document.querySelector('#customer').focus();
                  }
                }}
              />
            );
          }
          return <a  onClick={() => this.onCstmrNmEndUserNmClick(index,record,true)}>{record.endUserNm}</a>;
        },
      },
      /* {
        title: formatMessage({ id: 'actualityForecastBottom.tableHead.remarks' }),
        dataIndex: 'remarks',
        key: 'remarks',
        width: '10%',
        render: (text: string, record: ActBottomDataType, index: number) => {
          if (record.editable) {
            return (
              <Input
                className={styles.remarksInput}
                value={record.memo}
                onChange={(e) => this.remarksChange(e, index)}
              />
            );
          }
          return record.memo;
        },
      }, */
    ];

    const options = [];
    options.push(
      <option value="01">{formatMessage({ id: 'actualityForecastBottom.month.Jan' })}</option>,
    );
    options.push(
      <option value="02">{formatMessage({ id: 'actualityForecastBottom.month.Feb' })}</option>,
    );
    options.push(
      <option value="03">{formatMessage({ id: 'actualityForecastBottom.month.Mar' })}</option>,
    );
    options.push(
      <option value="04">{formatMessage({ id: 'actualityForecastBottom.month.Apr' })}</option>,
    );
    options.push(
      <option value="05">{formatMessage({ id: 'actualityForecastBottom.month.May' })}</option>,
    );
    options.push(
      <option value="06">{formatMessage({ id: 'actualityForecastBottom.month.Jun' })}</option>,
    );
    options.push(
      <option value="07">{formatMessage({ id: 'actualityForecastBottom.month.Jul' })}</option>,
    );
    options.push(
      <option value="08">{formatMessage({ id: 'actualityForecastBottom.month.Aug' })}</option>,
    );
    options.push(
      <option value="09">{formatMessage({ id: 'actualityForecastBottom.month.Sept' })}</option>,
    );
    options.push(
      <option value="10">{formatMessage({ id: 'actualityForecastBottom.month.Oct' })}</option>,
    );
    options.push(
      <option value="11">{formatMessage({ id: 'actualityForecastBottom.month.Nov' })}</option>,
    );
    options.push(
      <option value="12">{formatMessage({ id: 'actualityForecastBottom.month.Dec' })}</option>,
    );

    const screenHeight = window.screen.height - 445;
    console.log(`screenHeight: ${screenHeight}`);
    return (
      <>
        <div className={styles.divClass}>
          <Spin spinning={this.state.searchLoading}>
            <div className={styles.titleMessageModel}>
              {formatMessage({ id: 'actualityForecastBottom.title.message' })}
            </div>
            <Tabs
              type="card"
              //defaultActiveKey={this.state.actForMoth}
              activeKey={this.state.actForMoth}
              onChange={(activeKey) => this.tabsChange(activeKey)}
            >
              <TabPane tab={formatMessage({ id: 'actualityForecastBottom.month.Jan' })} key="01" />
              <TabPane tab={formatMessage({ id: 'actualityForecastBottom.month.Feb' })} key="02" />
              <TabPane tab={formatMessage({ id: 'actualityForecastBottom.month.Mar' })} key="03" />
              <TabPane tab={formatMessage({ id: 'actualityForecastBottom.month.Apr' })} key="04" />
              <TabPane tab={formatMessage({ id: 'actualityForecastBottom.month.May' })} key="05" />
              <TabPane tab={formatMessage({ id: 'actualityForecastBottom.month.Jun' })} key="06" />
              <TabPane tab={formatMessage({ id: 'actualityForecastBottom.month.Jul' })} key="07" />
              <TabPane tab={formatMessage({ id: 'actualityForecastBottom.month.Aug' })} key="08" />
              <TabPane tab={formatMessage({ id: 'actualityForecastBottom.month.Sept' })} key="09" />
              <TabPane tab={formatMessage({ id: 'actualityForecastBottom.month.Oct' })} key="10" />
              <TabPane tab={formatMessage({ id: 'actualityForecastBottom.month.Nov' })} key="11" />
              <TabPane tab={formatMessage({ id: 'actualityForecastBottom.month.Dec' })} key="12" />
            </Tabs>

            <Table
              className={(!isClickable)? styles.editableBottomTable:styles.diseditableBottomTable}
              size= {(!isClickable)? undefined: 'small'}
              // @ts-ignore
              columns={columns}
              dataSource={this.state.bottomTableData}
              pagination={false}
              scroll={{ x: '1500px', y: `${screenHeight.toString()}px` }}
              // rowClassName={(record) => (this.state.editable ? styles.editable : '')}
            />
            <Button
              style={{ width: '100%', marginTop: 6, marginBottom: 0 }}
              type="dashed"
              // @ts-ignore
              onClick={this.newMember}
              disabled={!isClickable || editDisableFlag === true}
            >
              <PlusOutlined />
            </Button>
          </Spin>

          {/* copyModel */}
          <Modal
            className={styles.copyModel}
            title=""
            visible={this.props.ActForecastData.copyModelVisible}
            onCancel={this.handleCancel}
            destroyOnClose
            maskClosable={false}
            footer={[
              <Button
                onClick={this.modelCopy}
                type="primary"
                disabled={this.state.copyButtonVisible === false}
              >
                {formatMessage({ id: 'actualityForecastBottom.tooltip.copy' })}
              </Button>,
            ]}
          >
            {formatMessage({ id: 'actualityForecastMid.dateInfo.period' })}
            <Select
              id="periodFrom"
              style={{ width: '80px' }}
              placeholder={formatMessage({ id: 'actualityForecastTop.datePicker.placeholder' })}
              value={this.state.periodFrom === '' ? null : this.state.periodFrom}
              onSelect={(e) => this.dataFromHandleChange(e)}
            >
              {options}
            </Select>
            <label>　~　</label>
            <Select
              id="periodTo"
              style={{ width: '80px' }}
              placeholder={formatMessage({ id: 'actualityForecastTop.datePicker.placeholder' })}
              value={this.state.periodTo === '' ? null : this.state.periodTo}
              onSelect={(e) => this.dataToHandleChange(e)}
            >
              {options}
            </Select>
          </Modal>

          {/* batchEditModel */}
          <Modal
            className={styles.batchEditModel}
            title=""
            visible={this.state.batchEditModelVisible}
            destroyOnClose
            closable={false}
            footer={null}
            //onCancel={this.onClose}
            maskClosable={false}
          >
            <ActualityForecastBatchEdit
              batchEditTableData={this.state.batchEditTableData}
              nowMonth={this.state.actForMoth}
              TopOnClose={this.batchEditOk}
              BatchEditonClose={this.onClose}
              userLst={userLst}
              authOrgCdLst={authOrgCdLst}
              customerLst={customerLst}
              allCustomerLst={allCustomerLst}
              industryLst={industryLst}
              caseLst={caseLst}
              ExchLst={[]}
              probabilityLst={probabilityLst}
              currencyLst={currencyLst}
              effortUnitLst={effortUnitLst}
              endUserLst={endUserLst}
              allEndUserLst={allEndUserLst}
            />
          </Modal>
          {/* batchEditModel */}
          {/* <Modal
            className={styles.batchEditModel}
            title=""
            visible={this.state.monthSummaryModelVisible}
            destroyOnClose
            closable={false}
            footer={null}
            //onCancel={this.onClose}
            maskClosable={false}
          >
            <ActualityForecastMonthSummary
              BatchEditonClose={this.onClose}
              closeFun={this.monthSummaryClose}
              actForMonthSummaryModel={this.state.actForMonthSummaryModel}
            />
          </Modal> */}
            <ActualityForecastMonthSummary
              cstmrCd = {this.state.summaryCstmrCd}
              cstmrNm = {this.state.summaryCstmrNm}
              endUserCd = {this.state.summaryEndUserCd}
              endUserNm = {this.state.summaryEndUserNm}
            />
          <Drawer
            className={styles.DrawerStyle}
            height='375px'
            placement='top'
            closable={false}
            destroyOnClose={true}
            visible={this.state.topVisible1}
            onClose={this.onClose}
          >
            <h2><AccountBookOutlined />{formatMessage({ id: 'actualityForecastTop.message.budget' })}</h2>
            <ActualityForecastBatchAddBudget
              nowMonth={this.state.actForMoth}
              busUserCd={this.props.busUserCd}
              busUserNm={this.props.busUserNm}
              cntrcCurrCd={this.props.cntrcCurrCd}
              cntrcCurrNm={this.props.cntrcCurrNm}
              effortUnitCd={this.props.effortUnitCd}
              effortUnitNm={this.props.effortUnitNm}
              TopOnClose={this.batchEditOk}
              relatedNo={this.state.relatedNo}
              bugtId={this.state.bugtId}
              btnStatus={true}
              onRef={this.onRef}
            />
          </Drawer>

          <Drawer
            className={styles.DrawerStyle}
            height='375px'
            placement='top'
            closable={false}
            destroyOnClose={true}
            visible={this.state.topVisible2}
            onClose={this.onClose}
          >
            <h2><FileSyncOutlined />{formatMessage({ id: 'actualityForecastTop.message.business' })}</h2>
            <ActualityForecastBatchAddBusiness
              nowMonth={this.state.actForMoth}
              caseNm={this.state.caseNm}
              cstmrNm={this.state.cstmrNm}
              endUserNm={this.state.endUserNm}
              busUserCd={this.props.busUserCd}
              busUserNm={this.props.busUserNm}
              customerLst={this.props.customerLst}
              userLst={this.props.userLst}
              caseLst={this.props.caseLst}
              endUserLst={this.props.endUserLst}
              allEndUserLst={this.props.allEndUserLst}
              allCustomerLst={this.props.allCustomerLst}
              codeValueList={this.props.codeValueList}
              TopOnClose={this.batchEditOk}
              relatedNo={this.state.relatedNo}
              busActId={this.state.busActId}
              btnStatus={true}
              onRef={this.onRef}
            />
          </Drawer>

          {/* moveModel */}
          <Modal
            className={styles.copyModel}
            title=""
            visible={this.props.ActForecastData.moveModelVisible}
            onCancel={this.handleCancel}
            destroyOnClose
            maskClosable={false}
            footer={[
              <Button
                onClick={this.modelMove}
                type="primary"
                disabled={this.state.moveButtonVisible === false}
              >
                {formatMessage({ id: 'actualityForecastBottom.tooltip.move' })}
              </Button>,
            ]}
          >
            {formatMessage({ id: 'actualityForecastMid.dateInfo.period' })}
            <Select
              id="periodFrom"
              style={{ width: '80px' }}
              placeholder={formatMessage({ id: 'actualityForecastTop.datePicker.placeholder' })}
              value={this.state.periodFrom === '' ? null : this.state.periodFrom}
              onSelect={(e) => this.dataFromHandleChange(e)}
            >
              {options}
            </Select>
            <label>　~　</label>
            <Select
              id="periodTo"
              style={{ width: '80px' }}
              placeholder={formatMessage({ id: 'actualityForecastTop.datePicker.placeholder' })}
              value={this.state.periodTo === '' ? null : this.state.periodTo}
              onSelect={(e) => this.dataToHandleChange(e)}
            >
              {options}
            </Select>
          </Modal>

          {/* message model */}
          <Modal
            visible={this.props.ActForecastData.modelVisible.bottomModelVisible === true}
            closable={false}
            centered
            onOk={this.confirm}
            onCancel={this.hideModal}
            okText={formatMessage({ id: 'actualityForecastTop.messageModel.confirm' })}
            cancelText={formatMessage({ id: 'actualityForecastTop.messageModel.cancel' })}
            destroyOnClose
            maskClosable={false}
          >
            <p>{this.props.ActForecastData.messageData.message}</p>
          </Modal>

          {/* not entered Prompt model */}
          <Modal
            visible={this.state.notEnterTip !== ''}
            closable={false}
            centered
            onOk={this.notEnterConfirm}
            onCancel={this.notEnterHideModal}
            okText={formatMessage({ id: 'actualityForecastTop.messageModel.confirm' })}
            cancelText={formatMessage({ id: 'actualityForecastTop.messageModel.cancel' })}
            destroyOnClose
            maskClosable={false}
          >
            <p>{this.state.notEnterTip}</p>
          </Modal>

          {/* Top close tip Model */}
          <Modal
            visible={this.state.batchEditTipModel === true}
            closable={false}
            centered
            onOk={this.batchEditOk}
            onCancel={this.closeCancel}
            okText={formatMessage({ id: 'actualityForecastTop.messageModel.confirm' })}
            cancelText={formatMessage({ id: 'actualityForecastTop.messageModel.cancel' })}
            destroyOnClose
            maskClosable={false}
          >
            <p>{formatMessage({ id: 'actualityForecast.topCloseTip.message' })}</p>
          </Modal>

          <Modal
            visible={this.state.bottomLineUpdateModel === true}
            closable={false}
            centered
            onOk={this.onBottomLineUpdateYes}
            onCancel={this.onBottomLineUpdateNo}
            okText={formatMessage({ id: 'actualityForecastTop.messageModel.confirm' })}
            cancelText={formatMessage({ id: 'actualityForecastTop.messageModel.cancel' })}
            destroyOnClose
            maskClosable={false}
          >
            <p>{formatMessage({ id: 'actualityForecast.bottomLineUpdate.message' })}</p>
          </Modal>
          <Modal
            className={classNames(styleSearch.modalStyleComp)}
            visible={this.state.caseAchVisible === true}
            centered={true}
            onCancel={this.closeCaseAch}
            footer={null}
            title={this.state.cseeAchTitle}
            maskClosable={false}
          >
            <CaseAch
              dataSource1={this.props.searchActForData.compareData}
              amountTitle={this.props.searchActForData.compareData.currConcat}
            />
          </Modal>
        </div>
      </>
    );
  }
}

export default connect(
  ({
    ActForecastData,
    user,
    global,
    searchActForData,
  }: {
    ActForecastData: any;
    user: ConnectState;
    global: GlobalModelState;
    searchActForData: ActForecastData;
  }) => ({
    ActForecastData,
    user,
    global,
    searchActForData,
  }),
  // @ts-ignore
)(ActualityForecastBottom);
