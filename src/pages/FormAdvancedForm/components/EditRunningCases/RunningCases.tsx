import {
  Input,
  Popconfirm,
  Table,
  Select,
  Button,
  DatePicker,
  Space,
  Tooltip,
  message,
  AutoComplete,
  ConfigProvider,
  Modal,
  Spin
} from 'antd';
import React, {Component,} from 'react';
import { EditOutlined, CopyOutlined, DeleteOutlined, CheckOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons';
import moment from "moment";
import locale from 'antd/lib/locale/zh_CN';
import {formatMessage} from "@@/plugin-locale/localeExports";
import {connect} from "umi";
import {Dispatch, GlobalModelState, UserModelState} from "@@/plugin-dva/connect";
import {ConnectState} from "@/models/connect";
import {FetchRunCaseDataType, FetchCustomerType, RunningCaseData, FetchCaseType} from "./data";
import {
  AllCustomerType,
  CustomerType,
  IndustryType,
  OptionType,
  RunCaseToActTopDataType,
  UserType
} from "../../data";
import styles from "./style.less";
import "@/utils/messageConfig";
import formatUtil from '@/utils/formatUtil';
import ex from "umi/dist";
import CustomerInfo from "@/components/CustomerInfo/CustomerInfo";

const { Option } = Select;

// 画面实时数据
let formData: RunningCaseDateType[];

// 是否点击了添加按钮
let isClickable = true;
// 当前数据的行数
let columnsNum: number;

let insertFlag = false;
let updateFlag = false;

interface RunningCaseDateType {
  runId: string;
  No: string;
  runYear?: string;
  language?: string;

  busUserCd?: string;
  busUserNm?: string;
  caseDiviCd: string;
  caseDiviNm: string;
  startYm: string;
  cstmrNm: string;
  caseIndstyCd: string;
  caseIndstyNm: string;
  caseNm: string;
  estdAmt: string;
  estdCurryCd: string;
  estdCurryNm: string;
  effort: string;
  effortUnitCd: string;
  effortUnitNm: string;
  orderMoth: string;
  runRankCd: string;
  runRankNm: string;
  memo: string;
  lastEditedUser?: string;
  editable: boolean;
  global:GlobalModelState;

}

interface TableFormProps {
  dispatch: Dispatch;
  busUserCd?: string;
  busUserNm?: string;
  cntrcCurrCd: string;
  cntrcCurrNm: string;
  effortUnitCd: string;
  effortUnitNm: string;

  runCaseData: RunningCaseData;
  topOpen?: any;
  user: UserModelState;
  runCaseToActTop?: any;
  userLst: UserType[];
  customerLst: CustomerType[];
  allCustomerLst: AllCustomerType[];
  industryLst: IndustryType[];
  currencyLst: IndustryType[];
  effortUnitLst: IndustryType[];
  probabilityLst: IndustryType[];
}

interface deletePopType {
  deletePop:boolean;
}

interface TableDataStates {
  runCaseTableData: RunningCaseDateType[];
  RunCaseToActTopData: RunCaseToActTopDataType;

  messageVisible: boolean;

  searchLoading: boolean;
  deletePopList: deletePopType[];

  insertFlag: boolean;
}

class RunningCases extends Component<TableFormProps,TableDataStates>{

  state={
    runCaseTableData:[{
      runId: '',
      No: '',
      runYear: this.props.user.currentUser?.dspYear,
      language: this.props.user.currentUser?.dspLang,
      busUserCd: this.props.busUserCd,
      busUserNm: this.props.busUserNm,
      caseDiviCd: '',
      caseDiviNm: '',
      startYm: '',
      cstmrNm: '',
      caseIndstyCd: '',
      caseIndstyNm: '',
      caseNm: '',
      estdAmt: '',
      estdCurryCd: '',
      estdCurryNm: '',
      effort: '',
      effortUnitCd: '',
      effortUnitNm: '',
      orderMoth: '',
      runRankCd: '',
      runRankNm: '',
      memo: '',
      lastEditedUser: '',
      editable: false,
    }],

    RunCaseToActTopData:{
      busUserCd: '',
      busUserNm: '',
      cstmrCd: '',
      cstmrNm: '',
      caseIndstyCd: '',
      caseIndstyNm: '',
      caseNm: '',
      actForRankCd: '',
      actForRankNm: '',
      aomount: '',
      cntrcCurrCd: '',
      cntrcCurrNm: '',
      effort: '',
      effortUnitCd: '',
      effortUnitNm: '',
    },

    messageVisible: false,
    searchLoading: false,
    deletePopList:
      [{
      deletePop: false,
    }],

    insertFlag: false,
  }

  componentDidMount() {
    const {dispatch} = this.props;
    const language = this.props.user.currentUser?.dspLang;
    const runYear = this.props.user.currentUser?.dspYear;
    const orgGroupId = this.props.user.currentUser?.orgGroupId;
    const authOrgCd = this.props.user.currentUser?.authOrgCds;
    const inputUserCd = this.props.user.currentUser?.inputUserCds;

    // 表格数据
    const runCaseInfoSelectParam: FetchRunCaseDataType = {language, runYear, inputUserCd};
    const runCaseInfoSelectModel  = JSON.stringify(runCaseInfoSelectParam);
    dispatch({
      type: 'runCaseData/getRunCaseData',
      payload: {
        runCaseInfoSelectModel
      },
    });

    // customerLst 数据
    const searchRunCaseCustomerParam: FetchCustomerType = {language, runYear, orgGroupId, authOrgCd, inputUserCd};
    const runCaseCustomerInfoModel  = JSON.stringify(searchRunCaseCustomerParam);
    dispatch({
      type: 'runCaseData/fetchCustomerLst',
      payload: {
        runCaseCustomerInfoModel
      },
    });

    dispatch({
      type: 'runCaseData/fetchAllCustomerLst',
      payload: {
        runCaseCustomerInfoModel
      },
    });

    // caseLst 数据
    const caseYear = this.props.user.currentUser?.dspYear;
    const caseInfoParam: FetchCaseType = { caseYear, authOrgCd };
    const caseInfoModel  = JSON.stringify(caseInfoParam);
    dispatch({
      type: 'runCaseData/fetchCaseLst',
      payload: {
        caseInfoModel
      },
    });

    // DivisionLst 数据
    dispatch({
      type: 'runCaseData/fetchDivisionLst',
      payload: {
        runYear,
      },
    });
  }

  static getDerivedStateFromProps(nextProps: TableFormProps, prevState: TableDataStates) {

    if(nextProps.runCaseData.runCaseData !== null){
      const formDataParam: RunningCaseDateType[] = nextProps.runCaseData.runCaseData.filter((item)=>item.editable===true)
      if(formDataParam!== null && formDataParam.length>0){
        isClickable = false;
      }else{
        isClickable = true;
      }
    }else{
      isClickable = true;
    }

    // 当是追加数据的时候 不进行对比
    if (prevState.insertFlag === false) {
      if (nextProps.runCaseData.runCaseData !== prevState.runCaseTableData) {
        if (nextProps.runCaseData.runCaseData !== null) {
          const nowColumnsNum = nextProps.runCaseData.runCaseData.length;
          columnsNum = nowColumnsNum;
        } else {
          columnsNum = 0;
        }

        formData = nextProps.runCaseData.runCaseData;

        if(nextProps.runCaseData.runCaseData!== null){
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          nextProps.runCaseData.runCaseData.forEach((item)=>{
            const deletePopType = {
              deletePop: false,
            };
            prevState.deletePopList.push(deletePopType);
          })
        }

        return {
          runCaseTableData: nextProps.runCaseData.runCaseData,
          searchLoading: nextProps.runCaseData.setSearchLoading.searchLoading,
        };
      }
    }
    return {
      searchLoading: nextProps.runCaseData.setSearchLoading.searchLoading,
    };
  }

  /**
   * 新增数据
   * @param record 数据
   */
  newMember = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'global/dialogBoxFlag',
      payload: true
    });
    document.getElementsByClassName('ant-table-body')[0].scrollTo({    left: 0,    behavior: "auto"});

    isClickable = false;
    insertFlag= true;
    this.setState({
      insertFlag: true,
    })
    updateFlag= false;
    columnsNum += 1;
    const newData:RunningCaseDateType = {
      runId: columnsNum.toString(),
      No: columnsNum.toString(),
      runYear: this.props.user.currentUser?.dspYear,
      language: this.props.user.currentUser?.dspLang,

      busUserCd: this.props.busUserCd,
      busUserNm: this.props.busUserNm,
      caseDiviCd: '',
      caseDiviNm: '',
      startYm: '',
      cstmrNm: '',
      caseIndstyCd: '',
      caseIndstyNm: '',
      caseNm: '',
      estdAmt: '',
      estdCurryCd: this.props.cntrcCurrCd,
      estdCurryNm: this.props.cntrcCurrNm,
      effort: '',
      effortUnitCd: this.props.effortUnitCd,
      effortUnitNm: this.props.effortUnitNm,
      orderMoth: '',
      runRankCd: '',
      runRankNm: '',
      memo: '',
      lastEditedUser: this.props.user.currentUser?.userid,
      editable: true,
    };
    const newFormData = formData.concat(newData);
    formData.push(newData);
    this.setState({
      runCaseTableData:newFormData,
    })
  };

  /**
   * 复制数据
   */
  copy = (record: RunningCaseDateType ) => {
    document.getElementsByClassName('ant-table-body')[0].scrollTo({    left: 0,    behavior: "auto"});
    isClickable = false;
    insertFlag= true;
    this.setState({
      insertFlag: true,
    })
    updateFlag= false;
    columnsNum += 1;
    const newData:RunningCaseDateType = {
      runId: columnsNum.toString(),
      No: columnsNum.toString(),
      runYear: this.props.user.currentUser?.dspYear,
      language: this.props.user.currentUser?.dspLang,

      busUserCd: record.busUserCd,
      busUserNm: record.busUserNm,
      caseDiviCd: record.caseDiviCd,
      caseDiviNm: record.caseDiviNm,
      startYm: record.startYm,
      cstmrNm: record.cstmrNm,
      caseIndstyCd: record.caseIndstyCd,
      caseIndstyNm: record.caseIndstyNm,
      caseNm: record.caseNm,
      estdAmt: record.estdAmt,
      estdCurryCd: record.estdCurryCd,
      estdCurryNm: record.estdCurryNm,
      effort: record.effort,
      effortUnitCd: record.effortUnitCd,
      effortUnitNm: record.effortUnitNm,
      orderMoth: record.orderMoth,
      runRankCd: record.runRankCd,
      runRankNm: record.runRankNm,
      memo: record.memo,
      lastEditedUser: this.props.user.currentUser?.userid,
      editable: true,
    };
    const {dispatch} = this.props;
    dispatch({
      type: 'global/dialogBoxFlag',
      payload: true
    });
    const newFormData = formData.concat(newData);
    formData.push(newData);
    this.setState({
      runCaseTableData:newFormData,
    })
  };

  /**
   * 删除数据
   */
  remove = ( record: RunningCaseDateType,index:number ) => {

    this.handleCancel(index);

    insertFlag= false;
    this.setState({
      insertFlag: false,
    })
    updateFlag= false;

    /**
     * 删除runningCase数据,更新数据库
     */
    const { dispatch } = this.props;
    // 要删除的id
    const param = record.runId;
    // 更新数据
    const language = this.props.user.currentUser?.dspLang;
    const runYear = this.props.user.currentUser?.dspYear;
    const inputUserCd = this.props.user.currentUser?.inputUserCds;
    const runCaseInfoSelectParam: FetchRunCaseDataType = {language, runYear, inputUserCd};
    const runCaseInfoSelectModel  = JSON.stringify(runCaseInfoSelectParam);

    dispatch({
      type: 'runCaseData/deleteRunCaseData',
      payload: {
        param,
      },
      payload1: {
        runCaseInfoSelectModel,
      },
    });
  }

  /**
   * 保存编辑后的数据
   * @param record 数据
   * @param index 数据的索引
   */
  save = (record: RunningCaseDateType, index: number) => {
    let errorFlag = false;
    // table各个字段不为空
    if(!formData[index].cstmrNm){
      message.error(formatMessage({ id: 'runningCases.message.customer' }));
      errorFlag = true;
      return;
    }
    if (formData[index].cstmrNm.length>100) {
      message.error(formatMessage({id: 'common.message.customerLength'}));
      errorFlag = true;
      return;
    }
    if(!formData[index].caseNm){
      message.error(formatMessage({ id: 'runningCases.message.case' }));
      errorFlag = true;
      return;
    }
    if(!formData[index].caseDiviCd){
      message.error(formatMessage({ id: 'runningCases.message.division' }));
      errorFlag = true;
      return;
    }
    if(!formData[index].startYm){
      message.error(formatMessage({ id: 'runningCases.message.startDate' }));
      errorFlag = true;
      return;
    }
    if(!formData[index].estdAmt){
      message.error(formatMessage({ id: 'runningCases.message.estimatedAmount' }));
      errorFlag = true;
      return;
    }
    if(!formData[index].estdCurryNm){
      message.error(formatMessage({ id: 'runningCases.message.contractCurrency' }));
      errorFlag = true;
      return;
    }
    if(formData[index].effort && formData[index].effort.toString() !== '0.00' && !formData[index].effortUnitNm){
      message.error(formatMessage({ id: 'runningCases.message.effortUnit' }));
      errorFlag = true;
      return;
    }
    if(!formData[index].runRankNm){
      message.error(formatMessage({ id: 'runningCases.message.probability' }));
      errorFlag = true;
      return;
    }
    if(!formData[index].busUserNm){
      message.error(formatMessage({ id: 'runningCases.message.busUserNm' }));
      errorFlag = true;
      return;
    }
    if(!formData[index].caseIndstyNm){
      message.error(formatMessage({ id: 'runningCases.message.industry' }));
      errorFlag = true;
      return;
    }
    if(formData[index].remarks && formData[index].remarks.length>500) {
      message.error(formatMessage({ id: 'runningCases.message.remarksLength' }));
      errorFlag = true;
      return;
    }

    if(!errorFlag){

      formData[index].runId = record.runId;
      formData[index].runYear = this.props.user.currentUser?.dspYear;
      formData[index].language = this.props.user.currentUser?.dspLang;

      formData[index].busUserCd = record.busUserCd;
      formData[index].busUserNm = record.busUserNm;
      formData[index].caseDiviCd = record.caseDiviCd;
      formData[index].caseDiviNm = record.caseDiviNm;
      formData[index].startYm = record.startYm;
      formData[index].cstmrNm = record.cstmrNm;
      formData[index].caseIndstyCd = record.caseIndstyCd;
      formData[index].caseIndstyNm = record.caseIndstyNm;
      formData[index].caseNm = record.caseNm;
      formData[index].estdAmt = record.estdAmt;
      formData[index].estdCurryCd = record.estdCurryCd;
      formData[index].estdCurryNm = record.estdCurryNm;
      formData[index].effort = record.effort;
      formData[index].effortUnitCd = record.effortUnitCd;
      formData[index].effortUnitNm = record.effortUnitNm;
      formData[index].orderMoth = record.orderMoth;
      formData[index].runRankCd = record.runRankCd;
      formData[index].runRankNm = record.runRankNm;
      formData[index].memo= record.memo;
      formData[index].lastEditedUser = this.props.user.currentUser?.userid;
      formData[index].editable = false;


      // 回归到修正前
  /*    this.setState({
        runCaseTableData:formData,
      }) */

      const runCaseUptDataParam:RunningCaseDateType = {
        No: "",
        editable: false,
        runId: formData[index].runId,
        runYear: this.props.user.currentUser?.dspYear,
        language: this.props.user.currentUser?.dspLang,

        busUserCd: formData[index].busUserCd,
        busUserNm: formData[index].busUserNm,
        caseDiviCd: formData[index].caseDiviCd,
        caseDiviNm: formData[index].caseDiviNm,
        startYm: formData[index].startYm,
        cstmrNm: formData[index].cstmrNm,
        caseIndstyCd: formData[index].caseIndstyCd,
        caseIndstyNm: formData[index].caseIndstyNm,
        caseNm: formData[index].caseNm,
        estdAmt: formData[index].estdAmt,
        estdCurryCd: formData[index].estdCurryCd,
        estdCurryNm: formData[index].estdCurryNm,
        effort: formData[index].effort,
        effortUnitCd: formData[index].effortUnitCd,
        effortUnitNm: formData[index].effortUnitNm,
        orderMoth: formData[index].orderMoth,
        runRankCd: formData[index].runRankCd,
        runRankNm: formData[index].runRankNm,
        memo: formData[index].memo,
        lastEditedUser: formData[index].lastEditedUser
      };


      if(updateFlag){

        /**
         * 更新runningCase数据,更新数据库
         */
        const { dispatch } = this.props;

        // 修改数据
        const runCaseInfoUpdateModel = JSON.stringify(runCaseUptDataParam);
        // 更新数据
        const language = this.props.user.currentUser?.dspLang;
        const runYear = this.props.user.currentUser?.dspYear;
        const inputUserCd = this.props.user.currentUser?.inputUserCds;
        const runCaseInfoSelectParam: FetchRunCaseDataType = {language, runYear, inputUserCd};
        const runCaseInfoSelectModel = JSON.stringify(runCaseInfoSelectParam);

        dispatch({
          type: 'runCaseData/updateRunCaseData',
          payload: {
            runCaseInfoUpdateModel,
          },
          payload1: {
            runCaseInfoSelectModel,
          },
        });

        insertFlag= false;
        this.setState({
          insertFlag: false,
        })
        updateFlag= false;
      }
      if(insertFlag){

        /**
         * 插入 runningCase数据,更新数据库
         */
        const { dispatch } = this.props;
        // 插入数据
        const runCaseInfoInsertModel = JSON.stringify(runCaseUptDataParam);

        // 更新数据
        const language = this.props.user.currentUser?.dspLang;
        const runYear = this.props.user.currentUser?.dspYear;
        const inputUserCd = this.props.user.currentUser?.inputUserCds;
        const runCaseInfoSelectParam: FetchRunCaseDataType = {language, runYear, inputUserCd};
        const runCaseInfoSelectModel = JSON.stringify(runCaseInfoSelectParam);

        dispatch({
          type: 'runCaseData/insertRunCaseData',
          payload: {
            runCaseInfoInsertModel,
          },
          payload1: {
            runCaseInfoSelectModel,
          },
        });

        updateFlag= false;
        insertFlag= false;
        this.setState({
          insertFlag: false,
        })
      }

      if(record.runRankCd === '1') {
        const cstmrData = this.props.customerLst.filter((cusItem)=>cusItem.cstmrNm===record.cstmrNm);
        let cstmrCd ='';
        if(cstmrData !== undefined && cstmrData !== null){
          cstmrData.forEach((item)=>{
            cstmrCd = item.cstmrNm;
          })
        }
        const runCaseToActTopDataParm: RunCaseToActTopDataType = {
          busUserCd: record.busUserCd,
          busUserNm: record.busUserNm,
          cstmrCd,
          cstmrNm: record.cstmrNm,
          caseIndstyCd: record.caseIndstyCd,
          caseIndstyNm: record.caseIndstyNm,
          caseNm: record.caseNm,
          actForRankCd: record.runRankCd,
          actForRankNm: record.runRankNm,
          aomount: record.estdAmt,
          cntrcCurrCd: record.estdCurryCd,
          cntrcCurrNm: record.estdCurryNm,
          effort: record.effort,
          effortUnitCd: record.effortUnitCd,
          effortUnitNm: record.effortUnitNm,
        }
        this.setState({
          messageVisible: true,
          RunCaseToActTopData: runCaseToActTopDataParm,
        })
      }
      const { dispatch } = this.props;
      dispatch({
        type: 'global/dialogBoxFlag',
        payload: false
      });
      isClickable = true;
    }
  }

  /**
   * 取消操作
   */
  cancel = () => {
    const {dispatch} = this.props;
    const language = this.props.user.currentUser?.dspLang;
    const runYear = this.props.user.currentUser?.dspYear;
    const inputUserCd = this.props.user.currentUser?.inputUserCds;

    dispatch({
      type: 'global/dialogBoxFlag',
      payload: false
    });
    // 表格数据
    const runCaseInfoSelectParam: FetchRunCaseDataType = {language, runYear, inputUserCd};
    const runCaseInfoSelectModel  = JSON.stringify(runCaseInfoSelectParam);
    dispatch({
      type: 'runCaseData/getRunCaseData',
      payload: {
        runCaseInfoSelectModel
      },
    });

    insertFlag= false;
    this.setState({
      insertFlag: false,
    })
    updateFlag=false;
    isClickable = true;
  }

  /**
   * 修改数据
   * @param index 数据的索引
   */
  edit = ( index: number ) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'global/dialogBoxFlag',
      payload: true
    });
    // 修改数据时不让追加数据
    isClickable = false;
    updateFlag= true;

    formData[index].editable = true;
    this.setState({
      runCaseTableData: formData,
    })
  }

  /**
   * 表格中各个字段变更的方法
   * @param e: 变更后的值
   * @param index 数据的索引
   */
  businessChargeChange = ( e: String, index:number ) => {
    if(e.toString() !== ''){
      if(this.props.userLst!==null){
        let userList = this.props.userLst;
        userList = userList.filter((item) => item.userNm === e.toString());
        const { userCd } = userList[0];
        formData[index].busUserCd = userCd.toString();
        formData[index].busUserNm = e.toString();
        this.setState({
          runCaseTableData: formData,
        })
      }else{
        formData[index].busUserCd = '';
        formData[index].busUserNm = '';
        this.setState({
          runCaseTableData: formData,
        })
      }
    }
  };

  caseDiviCdChange = ( e: String, index:number ) => {
    if(e.toString() !== ''){
      if(this.props.runCaseData.divisionLst!==null){
        let caseDiviCdList = this.props.runCaseData.divisionLst;
        caseDiviCdList = caseDiviCdList.filter((item) => item.cdNm === e.toString());
        const { cdVal } = caseDiviCdList[0];
        formData[index].caseDiviCd = cdVal.toString();
        formData[index].caseDiviNm = e.toString();
        this.setState({
          runCaseTableData: formData,
        })
      }else {
        formData[index].caseDiviCd = '';
        formData[index].caseDiviNm = '';
        this.setState({
          runCaseTableData: formData,
        })
      }
    }
  };

  startYmChange = ( e: String, index:number ) => {
    if(e !== null){
      formData[index].startYm = e.toString();
      this.setState({
        runCaseTableData: formData,
      })
    }

  };

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

  handleCustomer= (cstmrCds:string,cstmrNms:string,caseNms:string,index:number) => {
    formData[index].cstmrNm = cstmrNms;
    this.setState({
      runCaseTableData: formData,
    });
  }

  // cstmrChange = ( e: String, index:number ) => {
  //   formData[index].cstmrNm = e.toString();
  //   this.setState({
  //     runCaseTableData: formData,
  //   });
  // };

  caseIndstyCdChange = ( e: String, index:number ) => {
    if (e.toString() !== '') {
      if(this.props.industryLst!== null){
        let industryList = this.props.industryLst;
        industryList = industryList.filter((item) => item.cdNm === e.toString());
        const {cdVal} = industryList[0];
        formData[index].caseIndstyCd = cdVal.toString();
        formData[index].caseIndstyNm = e.toString();
        this.setState({
          runCaseTableData: formData,
        });
      }else{
        formData[index].caseIndstyCd = '';
        formData[index].caseIndstyNm = '';
        this.setState({
          runCaseTableData: formData,
        });
      }
    }
  };

  caseChange = ( e: String, index:number ) => {
    if (e !== undefined && e !== null && e.toString() !== '') {
      if(e.length > 100) {
        message.error(formatMessage({ id: 'common.message.caseNmLength' }));
        return;
      }
      formData[index].caseNm = e.toString();
      this.setState({
        runCaseTableData: formData,
      })
    } else {
      formData[index].caseNm = '';
      this.setState({
        runCaseTableData: formData,
      })
    }
  };

  amountChange = ( e: React.ChangeEvent<HTMLInputElement>, index:number) => {
    if (e.toString() !== '') {
      const clearValue = e.target.value.toString().replaceAll(',','');
      const regNum = /^[\d]*$/;
      const newRes = regNum.test(clearValue);
      if (!newRes) {
        return;
      }

      if (clearValue.length > 10) {
        message.error(formatMessage({id: 'common.message.amountLength'}));
        return;
      }
      // const regValue = formatUtil.thousandAmountFormat(e.target.value.toString());
      formData[index].estdAmt = e.target.value.toString();
      this.setState({
        runCaseTableData: formData,
      })
    }
  };

  /**
   *  金额获得焦点变更
   * @param e amount文本框的值
   */
  onAmountFocusChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (e.toString() !== '') {
      const regValue = e.target.value.toString().replaceAll(',','');
      formData[index].estdAmt = regValue;
      this.setState({
        runCaseTableData: formData,
      });
    }
  }

  /**
   *  金额失去焦点变更
   * @param e amount文本框的值
   */
  onAmountBlurChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (e.toString() !== '') {
      const regValue = formatUtil.thousandAmountFormat(e.target.value.toString());
      formData[index].estdAmt = regValue;
      this.setState({
        runCaseTableData: formData,
      });
    }
  }

  currencyChange = ( e: String, index:number ) => {
    if (e.toString() !== '') {
      if(this.props.currencyLst!== null){
        let currencyList = this.props.currencyLst;
        currencyList = currencyList.filter((item) => item.cdNm === e.toString());
        const {cdVal} = currencyList[0];
        formData[index].estdCurryCd = cdVal.toString();
        formData[index].estdCurryNm = e.toString();
        this.setState({
          runCaseTableData: formData,
        })
      }else {
        formData[index].estdCurryCd = '';
        formData[index].estdCurryNm = '';
        this.setState({
          runCaseTableData: formData,
        })
      }
    }
  };

  effortChange = ( e: React.ChangeEvent<HTMLInputElement>, index:number ) => {
    if (e.toString() !== '') {
      const clearValue = e.target.value.toString().replaceAll(',','');
      const regNum = /^[.\d]*$/;
      const newRes= regNum.test(clearValue);
      if(!newRes) {
        return;
      }

      if(clearValue.indexOf('.') !== -1){
        const integerData = clearValue.substring(0,clearValue.indexOf('.'));
        if(integerData.length > 10) {
          message.error(formatMessage({ id: 'common.message.effortLength' }))
          return;
        }
        const decimalData = clearValue.substring(clearValue.indexOf('.'));
        // decimalData 小数点を含む
        if(decimalData.length>3){
          message.error(formatMessage({ id: 'common.message.decimalLength' }));
          return;
        }
      }else if(clearValue.length > 10) {
        message.error(formatMessage({ id: 'common.message.effortLength' }));
        return;
      }

      // const regValue = formatUtil.thousandEffortFormat(e.target.value.toString());
      formData[index].effort = e.target.value.toString();
      this.setState({
        runCaseTableData: formData,
      })
    }
  };

  /**
   *  工数获得焦点变更
   * @param e amount文本框的值
   */
  onEffortFocusChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (e.toString() !== '') {
      const regValue = e.target.value.toString().replaceAll(',','');
      formData[index].effort = regValue.toString();
      this.setState({
        runCaseTableData: formData,
      });
    }
  }

  /**
   *  工数失去焦点变更
   * @param e amount文本框的值
   */
  onEffortBlurChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (e.toString() !== '') {
      const regValue = formatUtil.thousandEffortFormat(e.target.value.toString());
      formData[index].effort = regValue.toString();
      this.setState({
        runCaseTableData: formData,
      });
    }
  }

  effortUnitCdChange = ( e: String, index:number ) => {
    if (e.toString() !== '') {
      if(this.props.effortUnitLst!== null){
        let effortUnitList = this.props.effortUnitLst;
        effortUnitList = effortUnitList.filter((item) => item.cdNm === e.toString());
        if(effortUnitList.length > 0){
          const { cdVal } = effortUnitList[0];
          formData[index].effortUnitCd = cdVal.toString();
        }else{
          formData[index].effortUnitCd = '';
        }
        formData[index].effortUnitNm = e.toString();
        this.setState({
          runCaseTableData: formData,
        });
      }else {
        formData[index].effortUnitCd = '';
        formData[index].effortUnitNm = '';
        this.setState({
          runCaseTableData: formData,
        });
      }
    }
  };

  orderDateChange = ( e: String, index:number ) => {
    if(e !== null){
      formData[index].orderMoth= e.toString();
      this.setState({
        runCaseTableData: formData,
      })
    }
  };

  runRankCdChange = ( e: String, index:number ) => {
    if(e.toString() !== null){
      if(this.props.probabilityLst!== null){
        let probabilityList = this.props.probabilityLst;
        probabilityList = probabilityList.filter((item) => item.cdNm === e.toString());
        const { cdVal } = probabilityList[0];
        formData[index].runRankCd = cdVal.toString();
        formData[index].runRankNm = e.toString();
        this.setState({
          runCaseTableData: formData,
        });
      }else{
        formData[index].runRankCd = '';
        formData[index].runRankNm = '';
        this.setState({
          runCaseTableData: formData,
        });
      }
    }
  };

  memoChange = ( e: React.ChangeEvent<HTMLInputElement>, index:number ) => {
    if (e !== undefined && e !== null && e.target.value.toString() !== '') {
      if (e.target.value.toString().length > 500 ) {
        message.error(formatMessage({ id: 'runningCases.message.remarksLength' }));
        return;
      }
      formData[index].memo= e.target.value.toString();
      this.setState({
        runCaseTableData: formData,
      });
    } else {
      formData[index].memo= '';
      this.setState({
        runCaseTableData: formData,
      })
    }
  };

  /**
   * data 迁移 Model 关闭
   * */
  hideModal = () => {
    this.setState({
      messageVisible: false,
    });
  };

  /**
   * data 迁移 Model 确认
   * */
  confirm = () => {
    const runCaseToActTopDataParm: RunCaseToActTopDataType = this.state.RunCaseToActTopData;
    this.props.runCaseToActTop(runCaseToActTopDataParm);

    this.setState({
      messageVisible: false,
    });

    this.props.topOpen();
  };

  // 削除確認バブルを示します
  showPopConfirm = (index: number) => {
    const {deletePopList} = this.state;
    deletePopList[index].deletePop = true;
    this.setState({
      deletePopList,
    })
  };

  // 削除確認気泡をオフにする
  handleCancel = (index: number) => {
    const {deletePopList} = this.state;
    deletePopList[index].deletePop = false;
    this.setState({
      deletePopList,
    })
  };

  render() {

    const {
      userLst,
      customerLst,
      allCustomerLst,
      industryLst,
      currencyLst,
      effortUnitLst,
      probabilityLst,
    } = this.props;

    const getUserOption = (list: UserType[]) => {
      if (!list || list.length < 1) {
        return (
          <Option key={0} value={0}>
            {formatMessage({ id: 'common.message.noSelect' })}
          </Option>
        );
      }
      const listBak = list.filter((item)=>item.userNm !== null && item.userNm !== '');

      return listBak.map((item) => (
        <Option key={item.userCd} value={item.userNm}>
          {item.userNm}
        </Option>
      ));
    };

    const getCaseDiviCdOption = (list: IndustryType[]) => {
      if (!list || list.length < 1) {
        return (
          <Option key={0} value={0}>
            {formatMessage({ id: 'common.message.noSelect' })}
          </Option>
        );
      }
      const listBak = list.filter((item)=>item.cdNm !== null && item.cdNm !== '');
      return listBak.map((item) => (
        <Option key={item.cdVal} value={item.cdNm}>
          {item.cdNm}
        </Option>
      ));
    };

    const getCaseIndstyCdOption = (list: IndustryType[]) => {
      if (!list || list.length < 1) {
        return (
          <Option key={0} value={0}>
            {formatMessage({ id: 'common.message.noSelect' })}
          </Option>
        );
      }
      const listBak = list.filter((item)=>item.cdNm !== null && item.cdNm !== '');
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
      const listBak = list.filter((item)=>item.cdNm !== null && item.cdNm !== '');
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
      const listBak = list.filter((item)=>item.cdNm !== null && item.cdNm !== '');
      return listBak.map((item) => (
        <Option key={item.cdVal} value={item.cdNm}>
          {item.cdNm}
        </Option>
      ));
    };

    const getrunRankCdOption = (list: IndustryType[]) => {
      if (!list || list.length < 1) {
        return (
          <Option key={0} value={0}>
            {formatMessage({ id: 'common.message.noSelect' })}
          </Option>
        );
      }
      const listBak = list.filter((item)=>item.cdNm !== null && item.cdNm !== '');
      return listBak.map((item) => (
        <Option key={item.cdVal} value={item.cdNm}>
          {item.cdNm}
        </Option>
      ));
    };

    // 获取optionValue
    // const cstmrCdOptions: OptionType[] = [];
    // if(customerLst!==null && customerLst.length>0){
    //   customerLst.forEach((item) => {
    //     if (item.cstmrNm !== null && item.cstmrNm !== '') {
    //       const optionItem: OptionType = {
    //         value: item.cstmrNm,
    //       };
    //       cstmrCdOptions.push(optionItem);
    //     }
    //   });
    // }else{
    //   const optionItem: OptionType = {
    //     value: '',
    //   }
    //   cstmrCdOptions.push(optionItem);
    // }


    const caseOptions: OptionType[] = [];
    const caseList = this.props.runCaseData.caseLst;
    if(caseList !== undefined && caseList !== null && caseList.length>0){
      this.props.runCaseData.caseLst.forEach((item) => {
        if (item.caseNm !== null && item.caseNm !== '') {
          const optionItem: OptionType = {
            value: item.caseNm,
          };
          caseOptions.push(optionItem);
        }
      });
    }
    else{
      const optionItem: OptionType = {
        value: '',
      };
      caseOptions.push(optionItem);
    }

    var inputs = document.getElementsByTagName("input");
    const columns = [
      {
        title: '',
        key: 'action',
        width:'90px',
        fixed: 'left',
        render: (text: string, record: RunningCaseDateType, index: number) => {
          if (record.editable) {
            return (
              <div className={styles.actionDiv}>
              <Space size = {10}>
                <CheckOutlined onClick={() => this.save(record, index)} />
                <CloseOutlined onClick={() => this.cancel()} />
              </Space>
              </div>
            );
          }
          return (
            <div className={styles.actionDiv}>
              <div className={styles.ButtonIcon}>
                <Button
                  type='text'
                  disabled={isClickable===false}>
                <Tooltip
                  placement="rightBottom"
                  title={formatMessage({ id: 'actualityForecastBottom.tooltip.edit' })}
                  color='#FAD460'>
                  <EditOutlined onClick={()=>this.edit(index)} />
                </Tooltip>
                <Tooltip
                  placement="rightBottom"
                  title={formatMessage({ id: 'actualityForecastBottom.tooltip.copy' })}
                  color='#FAD460'>
                  <CopyOutlined onClick={() => this.copy( record )} />
                </Tooltip>
                <Tooltip
                  placement="rightBottom"
                  title={formatMessage({ id: 'actualityForecastBottom.tooltip.delete' })}
                  color='yellow'>
                  <Popconfirm
                    title={formatMessage({ id: 'actualityForecastBottom.message.delete' })}
                    onConfirm={() => this.remove( record,index )}
                    onCancel={() => this.handleCancel( index )}
                    okText={formatMessage({ id: 'actualityForecastTop.messageModel.confirm' })}
                    cancelText={formatMessage({ id: 'actualityForecastTop.messageModel.cancel' })}
                    visible={this.state.deletePopList!==undefined && this.state.deletePopList!==null && this.state.deletePopList[index].deletePop === true}
                  >
                    <DeleteOutlined onClick={() =>this.showPopConfirm(index)}/>
                  </Popconfirm>
                </Tooltip>
                </Button>
              </div>
            </div>
          );
        },
      },
      {
        title: formatMessage({ id: 'runningCases.tableHead.No' }),
        dataIndex: 'No',
        key: 'No',
        width: '80px',
        fixed: 'left',
        // eslint-disable-next-line @typescript-eslint/no-shadow
        render: (text: any, record: any, index: number) => {
          const no = index+1;
          return <div className={styles.noDiv}>{no}</div>;
        }
      },
      {
        title: formatMessage({ id: 'runningCases.tableHead.customer' }),
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
        render: (text: string, record: RunningCaseDateType, index: number) => {
          if (record.editable) {
            return (
              // <AutoComplete
              //   className={styles.select}
              //   autoFocus
              //   dropdownMatchSelectWidth={280}
              //   defaultValue={record.cstmrNm}
              //   onSearch={(e) => this.cstmrChange(e, index)}
              //   // @ts-ignore
              //   onSelect={(e) => this.cstmrChange(e, index)}
              //   allowClear
              //   options={cstmrCdOptions}
              //   filterOption={(inputValue, option) =>
              //     // @ts-ignore
              //     option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
              //   }
              // />
            <CustomerInfo
              bottom={true}
              cstmrCd=""
              cstmrNm={record.cstmrNm}
              customerLst={customerLst}
              allCustomerLst={allCustomerLst}
              caseLst={[]}
              index={index}
              itemNm={formatMessage({ id: 'runningCases.tableHead.customer' })}
              checkLength={100}
              caseFlag="1"
              styleFlag="0"
              onRef={this.onRef}
              handleCustomer={this.handleCustomer.bind(this)}
              onInputKeyDown={ (e) => {
                if (e.key === 'Enter') {
                  inputs[1].focus()
                }
              }}
            />
            );
          }
          return record.cstmrNm;
        },
      },
      {
        title: formatMessage({ id: 'runningCases.tableHead.case' }),
        dataIndex: 'case',
        key: 'case',
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
        width: '200px',
        fixed: 'left',
        render: (text: string, record: RunningCaseDateType, index: number) => {
          if (record.editable) {
            return (
              <AutoComplete
                className={styles.select}
                dropdownMatchSelectWidth={220}
                defaultValue={record.caseNm}
                value={record.caseNm}
                onSearch={(e) => this.caseChange(e, index)}
                // @ts-ignore
                onSelect={(e) => this.caseChange(e, index)}
                allowClear
                options={caseOptions}
                filterOption={(inputValue, option) =>
                  // @ts-ignore
                  option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                }
                onInputKeyDown={ (e) => {
                  if (e.key === 'Enter') {
                    inputs[2].focus()
                  }
                }}
              />
            );
          }
          return record.caseNm;
        },
      },
      {
        title: formatMessage({ id: 'runningCases.tableHead.division' }),
        dataIndex: 'division',
        key: 'division',
        width: '90px',
        render: (text: string, record: RunningCaseDateType, index: number) => {
          if (record.editable) {
            return (
              <Select
                className={styles.select}
                defaultValue={record.caseDiviNm}
                onSelect={(e) => {
                  this.caseDiviCdChange(e,index);
                  inputs[3].focus()
                }}
              >
                {getCaseDiviCdOption(this.props.runCaseData.divisionLst)}
              </Select>
            );
          }
          return record.caseDiviNm;
        },
      },
      {
        title: formatMessage({ id: 'runningCases.tableHead.startDate' }),
        dataIndex: 'startDate',
        key: 'startDate',
        width: '90px',
        render: (text: string, record: RunningCaseDateType, index: number) => {
          if (record.editable) {
            return (
              <ConfigProvider locale={locale}>
                <DatePicker
                  className={styles.monthInput}
                  picker="month"
                  placeholder=''
                  defaultValue={moment()}
                  onSelect={(e) => inputs[4].focus()}
                  // @ts-ignore
                  onChange={(e) => this.startYmChange(e === null?'':e.format('YYYY/MM'), index)}
                  value={record.startYm === '' ? null : moment(record.startYm, 'YYYY/MM')}
                  format="YYYY/MM"
                />
              </ConfigProvider>
            );
          }
          return record.startYm;
        },
      },
      {
        title: formatMessage({ id: 'runningCases.tableHead.estimatedAmount' }),
        dataIndex: 'estimatedAmount',
        key: 'estimatedAmount',
        width: '100px',
        render: (text: string, record: RunningCaseDateType, index: number) => {
          if (record.editable) {
            return (
              <Input
                className={styles.amountInput}
                value={record.estdAmt.toLocaleString()}
                onChange={(e) => this.amountChange(e,index)}
                onFocus={(e) => this.onAmountFocusChange(e, index)}
                onBlur={(e) => this.onAmountBlurChange(e, index)}
                onPressEnter={(e) => inputs[5].focus()}
              />
            );
          }
          return <div className={styles.amountDiv}>{record.estdAmt.toLocaleString()}</div>;
        },
      },
      {
        title: formatMessage({ id: 'runningCases.tableHead.contractCurrency' }),
        dataIndex: 'contractCurrency',
        key: 'contractCurrency',
        width: '100px',
        render: (text: string, record: RunningCaseDateType, index: number) => {
          if (record.editable) {
            return (
              <Select
                className={styles.select}
                defaultValue={record.estdCurryNm}
                onSelect={(e) => {
                  this.currencyChange(e,index);
                  inputs[6].focus();
                }}
              >
                {getCurrencyLstOption(currencyLst)}
              </Select>
            );
          }
          return record.estdCurryNm;
        },
      },
      {
        title: formatMessage({ id: 'runningCases.tableHead.estimatedEffort' }),
        dataIndex: 'estimatedEffort',
        key: 'estimatedEffort',
        width: '110px',
        render: (text: string, record: RunningCaseDateType, index: number) => {
          if (record.editable) {
            return (
              <div>
                <Input
                  className={styles.effortInput}
                  value={record.effort}
                  onChange={(e) => this.effortChange(e,index)}
                  onPressEnter={(e) => inputs[7].focus()}
                  onFocus={(e) => this.onEffortFocusChange(e, index)}
                  onBlur={(e) => this.onEffortBlurChange(e, index)}
                />
                <Select
                  className={styles.effortSelect}
                  showSearch
                  defaultValue={record.effortUnitNm}
                  optionFilterProp="effortUnitNm"
                  onChange={(e) => this.effortUnitCdChange(e,index)}
                  onSelect={(e) => {
                    this.effortUnitCdChange(e,index);
                    inputs[8].focus()
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
          return <div className={styles.effortDiv}>
            {
              record.effort.toString() !=='0.00' ?(
                  <Space size={3}>
                    {record.effort}
                    {record.effortUnitNm}
                  </Space>)
                :
                <div>-</div>
            }
          </div>
        },
      },
      {
        title: formatMessage({ id: 'runningCases.tableHead.orderDate' }),
        dataIndex: 'orderDate',
        key: 'orderDate',
        width: '90px',
        render: (text: string, record: RunningCaseDateType, index: number) => {
          if (record.editable) {
            return (
              <ConfigProvider locale={locale}>
                <DatePicker
                  className={styles.monthInput}
                  picker="month"
                  placeholder=''
                  defaultValue={moment()}
                  // @ts-ignore
                  onSelect={(e) => inputs[9].focus()}
                  onChange={(e) => this.orderDateChange(e === null?'':e.format('YYYY/MM'), index)}
                  value={record.orderMoth === '' ? null : moment(record.orderMoth, 'YYYY/MM')}
                  format="YYYY/MM"
                />
              </ConfigProvider>
            );
          }
          return record.orderMoth;
        },
      },
      {
        title: formatMessage({ id: 'runningCases.tableHead.probability' }),
        dataIndex: 'probability',
        key: 'probability',
        width: '110px',
        render: (text: string, record: RunningCaseDateType, index: number) => {
          if (record.editable) {
            return (
              <Select
                className={styles.select}
                defaultValue={record.runRankNm}
                onSelect={(e) => {
                  this.runRankCdChange(e,index);
                  inputs[10].focus();
                }}
              >
                {getrunRankCdOption(probabilityLst)}
              </Select>
            );
          }
          return record.runRankNm;
        },
      },
      {
        title: formatMessage({ id: 'runningCases.tableHead.businessCharge' }),
        dataIndex: 'businessCharge',
        key: 'businessCharge',
        width: '150px',
        render: (text: string, record: RunningCaseDateType, index: number) => {
          if (record.editable) {
            return (
              <Select
                className={styles.select}
                defaultValue={record.busUserNm}
                onSelect={(e) => {
                  this.businessChargeChange(e,index);
                  inputs[11].focus();
                }}
              >
                {getUserOption(userLst)}
              </Select>
            );
          }
          return record.busUserNm;
        },
      },
      {
        title: formatMessage({ id: 'runningCases.tableHead.industry' }),
        dataIndex: 'industry',
        key: 'industry',
        width: '90px',
        render: (text: string, record: RunningCaseDateType, index: number) => {
          if (record.editable) {
            return (
              <Select
                className={styles.select}
                defaultValue={record.caseIndstyNm}
                onSelect={(e) => {
                  this.caseIndstyCdChange(e,index);
                  inputs[12].focus();
                }}
              >
                {getCaseIndstyCdOption(industryLst)}
              </Select>
            );
          }
          return record.caseIndstyNm;
        },
      },
      {
        title: formatMessage({ id: 'runningCases.tableHead.remarks' }),
        dataIndex: 'remarks',
        key: 'remarks',
        width: '200px',
        render: (text: string, record: RunningCaseDateType, index: number) => {
          if (record.editable) {
            return (
              <Input
                className={styles.remarksInput}
                value={record.memo}
                onChange={(e) => this.memoChange(e,index)}
                onPressEnter={(e) => {
                  inputs[0].focus();
                  document.getElementsByClassName('ant-table-body')[0].scrollLeft=0;
                }}
              />
            );
          }
          return record.memo;
        },
      },
    ];
    const screenHeight = window.screen.height - 380;
    console.log(`screenHeight: ${  screenHeight}`);
    return (
      <>
        <Spin spinning={this.state.searchLoading}>
          <div className={styles.titleMessageModel}>{formatMessage({ id: 'actualityForecastBottom.title.message' })}</div>
          <Table
            className={(!isClickable)? styles.editableRunningCaseTable:styles.diseditableRunningCaseTable}
            size= {(!isClickable)? undefined: 'small'}
            // @ts-ignore
            columns={columns}
            dataSource={this.state.runCaseTableData}
            pagination={false}
            scroll={{ x: '1000px', y: `${screenHeight.toString()}px` }}
          />
          <Button
            style={{width: '100%', marginTop: 6, marginBottom: 0}}
            type="dashed"
            // @ts-ignore
            onClick={this.newMember}
            disabled={!isClickable}
          >
            <PlusOutlined/>
          </Button>
        </Spin>
        {/* data to actTop model */}
        <Modal
          visible={this.state.messageVisible}
          closable={false}
          centered={true}
          onOk={this.confirm}
          onCancel={this.hideModal}
          okText={formatMessage({ id: 'actualityForecastTop.messageModel.confirm' })}
          cancelText={formatMessage({ id: 'actualityForecastTop.messageModel.cancel' })}
          destroyOnClose
          maskClosable={false}
        >
          <p>{formatMessage({ id: 'runningCases.message.runToAct' })}</p>
        </Modal>
      </>
    );
  }
}

export default connect(
  ({
     global,
     runCaseData,
     user,
   }: {
    runCaseData: RunningCaseData;
    user:ConnectState;
    global:ConnectState;
   },
  ) => ({
    global,
    runCaseData,
    user,
  }),
  // @ts-ignore
)(RunningCases);
