import {
  Input,
  Table,
  Select,
  Button,
  message,
  Space,
  AutoComplete,
  Modal,
  Spin, Tooltip,
} from 'antd';
import { connect } from 'umi';
import React, { Component } from 'react';
import { formatMessage } from '@@/plugin-locale/localeExports';
import { ConnectState, UserModelState } from '@/models/connect';
import { Dispatch } from '@@/plugin-dva/connect';
import 'moment/locale/zh-cn';
import {
  ActForecastTopData,
  AuthOrgType, BatchEditTableData,
  CaseType,
  CustomerType,
  EndUserType,
  FetchBottomDataType,
  FetchCaseNoType,
  FetchCaseType,
  IndustryType,
  OptionType,
  SalesDataModel,
  ActForBatchEditModel,
  UserType, ExchRtModel, AllCustomerType, AllEndUserType, SearchCaseType, FetchBatchEditDataType,
} from '@/pages/FormAdvancedForm/data';
// eslint-disable-next-line import/no-duplicates
import styles from './style.less';
// eslint-disable-next-line import/no-duplicates
import './style.less';
import '@/utils/messageConfig';
import formatUtil from '@/utils/formatUtil';

import { EditOutlined, ClearOutlined, CloseOutlined} from '@ant-design/icons';
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
  nowMonth: string;
  TopOnClose?: any;
  BatchEditonClose?: any;
  batchEditTableData: BatchEditTableData;

  userLst: UserType[];
  authOrgCdLst: AuthOrgType[];
  customerLst: CustomerType[];
  allCustomerLst: AllCustomerType[];
  industryLst: IndustryType[];

  searchBatchData:SearchCaseType[];
  caseLst: [];
  ExchLst: [],
  probabilityLst: IndustryType[];
  currencyLst: IndustryType[];
  effortUnitLst: IndustryType[];
  endUserLst: EndUserType[];
  allEndUserLst: AllEndUserType[];

  ActForecastData: ActForecastTopData;
}

interface TableDataStates {
  // actForId: string,
  actForYear: string,
  countOrgCd: string,
  countOrgNm: string,
  busUserCd: string,
  busUserNm: string,
  cstmrCd: string,
  cstmrNm: string,
  caseIndstyCd: string,
  caseIndstyNm: string,
  caseNm: string,
  caseNo: string,
  endUserCd: string,
  endUserNm: string,
  relatedNo: string,
  bugtId: string;
  busActId: string;
  totalAmount: string,
  totalEffort: string,
  totalAmountUnit: string,
  totalEffortUnit: string,
  batchEditable: boolean;
  actForBatchEditSalesVoList:SalesDataModel[];
  exchRtInfoVoList: ExchRtModel[];

  searchLoading: boolean;
  notEnterTip: string;
  caseNumsValue: CaseType[];
}

// 画面データを保存
let formData: SalesDataModel[];
let exchRtListData:ExchRtModel[];
let formDataBak: BatchEditTableData;
let basicInfoBak: ActForBatchEditModel;

const caseNo = '';

class ActualityForecastBatchEdit extends Component<TableFormProps, TableDataStates> {
  state = {
    actForYear: '',
    countOrgCd: '',
    countOrgNm: '',
    busUserCd: '',
    busUserNm: '',
    cstmrCd: '',
    cstmrNm: '',
    caseIndstyCd: '',
    caseIndstyNm: '',
    searchCaseNo:'',
    searchCaseNm:'',
    caseNm: '',
    caseNo: '',
    endUserCd: '',
    endUserNm: '',
    relatedNo: '',
    bugtId: '',
    busActId: '',
    totalAmount: '',
    totalEffort: '',
    totalAmountUnit: '',
    totalEffortUnit: '',

    actForBatchEditSalesVoList: [{
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
    }],

    exchRtInfoVoList: [{
      exchRt: '',
      currCdFrom:  '',
      currCdTo:  '',
      actvStartDt:  '',
      actvEndDt:  '',
    }],

    batchEditable: false,

    searchLoading: false,
    notEnterTip: '',
    caseNumsValue: [
      {
        cstmrCd: '',
        caseNm: '',
        caseNo: '',
      },
    ],
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static getDerivedStateFromProps(nextProps: TableFormProps, prevState: TableDataStates) {
    return {
      searchLoading: nextProps.ActForecastData.setSearchLoading.searchLoading,
    };
  }

  componentDidMount(){
    // @ts-ignore
    // this.props.onRef(this)

    // const searchCaseInfo =this.props.ActForecastData.searchBatchData.filter((item)=>item.relatedNo === this.props.ActForecastData.batchEditTableData.relatedNo);
    // const searchcase = this.props.ActForecastData.batchEditTableData.caseNm !== null ? this.props.ActForecastData.batchEditTableData.caseNm : '';
    // @ts-ignore
    this.setState({
      batchEditable: false,
      // actForId: this.props.batchEditTableData.actForId,
      actForYear: this.props.ActForecastData.batchEditTableData.actForYear !== null ? this.props.ActForecastData.batchEditTableData.actForYear : '',
      countOrgCd: this.props.ActForecastData.batchEditTableData.countOrgCd,
      countOrgNm: this.props.ActForecastData.batchEditTableData.countOrgNm,
      busUserCd: this.props.ActForecastData.batchEditTableData.busUserCd,
      busUserNm: this.props.ActForecastData.batchEditTableData.busUserNm,
      cstmrCd: this.props.ActForecastData.batchEditTableData.cstmrCd,
      cstmrNm: this.props.ActForecastData.batchEditTableData.cstmrNm !== null ? this.props.ActForecastData.batchEditTableData.cstmrNm : '',
      caseIndstyCd: this.props.ActForecastData.batchEditTableData.caseIndstyCd,
      caseIndstyNm: this.props.ActForecastData.batchEditTableData.caseIndstyNm,
      caseNm: this.props.ActForecastData.batchEditTableData.caseNm !== null ? this.props.ActForecastData.batchEditTableData.caseNm : '',
      caseNo: this.props.ActForecastData.batchEditTableData.caseNo !== null ? this.props.ActForecastData.batchEditTableData.caseNo : '',
      endUserCd: this.props.ActForecastData.batchEditTableData.endUserCd,
      endUserNm: this.props.ActForecastData.batchEditTableData.endUserNm !== null ? this.props.ActForecastData.batchEditTableData.endUserNm : '',
      relatedNo: this.props.ActForecastData.batchEditTableData.relatedNo,
      bugtId: this.props.ActForecastData.batchEditTableData.bugtId,
      busActId: this.props.ActForecastData.batchEditTableData.busActId,
      totalAmount: this.props.ActForecastData.batchEditTableData.totalAmount !== null ? formatUtil.thousandAmountFormat(Math.round(parseFloat(this.props.ActForecastData.batchEditTableData.totalAmount)).toString()).toString() : '',
      totalEffort: this.props.ActForecastData.batchEditTableData.totalEffort !== null ? formatUtil.thousandEffortFormat((parseFloat(this.props.ActForecastData.batchEditTableData.totalEffort)).toFixed(2).toString()).toString() : '',
      totalAmountUnit: this.props.ActForecastData.batchEditTableData.totalAmountUnit,
      totalEffortUnit: this.props.ActForecastData.batchEditTableData.totalEffortUnit,
      actForBatchEditSalesVoList:this.props.ActForecastData.batchEditTableData.actForBatchEditSalesVoList,
      exchRtInfoVoList: this.props.ActForecastData.batchEditTableData.exchRtInfoVoList,
      searchCaseNm: this.props.ActForecastData.batchEditTableData.caseNm !== null ? this.props.ActForecastData.batchEditTableData.caseNm +'\xa0\xa0\xa0\xa0'+this.props.ActForecastData.batchEditTableData.caseNo : '',
    })

    formData = this.props.ActForecastData.batchEditTableData.actForBatchEditSalesVoList;
    for (let i = 0; i < 12 ; i++) {
      if (formData[i].actForMoth !== null) {
        formData[i].orderAmt = formatUtil.thousandAmountFormat(formData[i].orderAmt.toString());
      } else {
        formData[i].orderAmt = '';
        formData[i].actForId = '';
      }
    }

    exchRtListData = this.props.ActForecastData.batchEditTableData.exchRtInfoVoList;
  }

  /**
   *  金额变更
   * @param e amount文本框的值
   */
  onAmountFocusChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (e.toString() !== '') {
      // onFocusAmount = e.target.value.toString();
      const regValue = e.target.value.toString().replaceAll(',','');
      formData[index].orderAmt = regValue;
      this.setState({
        actForBatchEditSalesVoList: formData,
      });
    }
  }

  /**
   *  金额变更
   * @param e amount文本框的值
   */
  onAmountBlurChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (e.toString() !== '') {
      // if (onFocusAmount !== e.target.value.toString()) {
      //   this.totalAmountSum(index);
      //   onFocusAmount = '';
      // }

      const regValue = formatUtil.thousandAmountFormat(e.target.value.toString());
      formData[index].orderAmt = regValue;
      this.setState({
        actForBatchEditSalesVoList: formData,
      });
    }
  }

  /**
   *  金额变更
   * @param e amount文本框的值
   */
  onAmountChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
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
      const regValue = e.target.value.toString();
      formData[index].orderAmt = regValue;
      this.setState({
        actForBatchEditSalesVoList: formData,
      });
      this.totalAmountSum(index);
    }
  };

  /**
   *  金额变更
   * @param e amount文本框的值
   */
  onEffortFocusChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (e.toString() !== '') {
      const regValue = e.target.value.toString().replaceAll(',','');
      formData[index].effort = regValue.toString();
      this.setState({
        actForBatchEditSalesVoList: formData,
      });
    }
  }

  /**
   *  金额变更
   * @param e amount文本框的值
   */
  onEffortBlurChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (e.toString() !== '') {
      const regValue = formatUtil.thousandEffortFormat(e.target.value.toString());
      formData[index].effort = regValue.toString();
      this.setState({
        actForBatchEditSalesVoList: formData,
      });
    }
  }


  onEffortChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
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
      const regValue = e.target.value.toString();
      formData[index].effort = regValue.toString();
      this.setState({
        actForBatchEditSalesVoList: formData,
      });
      this.totalEffortSum();
    }
  };

  /**
   *  total 计算
   * @param
   */

  totalEffortSum = () => {

    let effortFlag = false;
    let totalEfforts = 0.00;
    let effortUnit = '';

    if(formData !==undefined && formData!==null ){
      formData.forEach((field, index) => {
        if(formData[index]!==undefined && formData[index]!==null
          && formData[index].effortUnitNm) {
          if(effortUnit===''){
            effortUnit = formData[index].effortUnitNm;
          }else if(effortUnit !== formData[index].effortUnitNm){
            effortFlag = true;
          }
        }
      });

      if(effortFlag){
        formData.forEach((field, index) => {
          if(formData[index]!==undefined && formData[index]!==null
            && formData[index].effort) {
            if(formData[index].effortUnitCd ==='MD' ){
              totalEfforts += parseFloat(formData[index].effort.replaceAll(',','')) / 20;
            }
            if(formData[index].effortUnitCd ==='MH'){
              totalEfforts += parseFloat(formData[index].effort.replaceAll(',','')) / 8 /20;
            }
            if(formData[index].effortUnitCd ==='MM'){
              totalEfforts += parseFloat(formData[index].effort.replaceAll(',',''));
            }
          }
        });

        if(this.props.effortUnitLst!== null) {
          let effortUnitList = this.props.effortUnitLst;
          effortUnitList = effortUnitList.filter((item) => item.cdVal.toString() === 'MM');
          if (effortUnitList !== undefined && effortUnitList !== null) {
            const {cdNm} = effortUnitList[0];
            effortUnit  = cdNm.toString();
          }
        }
      }else{
        formData.forEach((field, index) => {
          if(formData[index]!==undefined && formData[index]!==null
            && formData[index].effort
            && formData[index].effortUnitNm) {
            totalEfforts += parseFloat(formData[index].effort.replaceAll(',',''));
          }
        });
      }
    }

    this.setState({
      totalEffort: formatUtil.thousandEffortFormat(totalEfforts.toFixed(2).toString()).toString(),
      totalEffortUnit: effortUnit !== "" ? effortUnit : "MM",
    });

  };

  totalAmountSum =  async (e: number) => {

    let amountFlag = false;
    let totalAmounts = 0.00;
    let amountUnit = '';

    const currCdFroms = [];
    const actForMonths = [];

    if(formData !== undefined && formData !== null ){
      formData.forEach((field, index) => {
        if(formData[index]!==undefined && formData[index]!==null
          && formData[index].cntrcCurrNm) {
          if(amountUnit===''){
            amountUnit = formData[index].cntrcCurrNm;
          }else if(amountUnit !== formData[index].cntrcCurrNm){
            amountFlag = true;
          }
          if(index < 9) {
            actForMonths[index] = "0"+(index+1);
          } else {
            actForMonths[index] = "" + (index + 1);
          }
          currCdFroms[index]= formData[index].cntrcCurrNm;
        }else{
          currCdFroms[index]= "";
          actForMonths[index] ="";
        }
      });

      if(amountFlag){
        // const {dispatch} = this.props;
        const actForYear = this.props.user.currentUser?.dspYear;

        // // @ts-ignore
        // const actBatchFetchExchRtParam: FetchBatchExchRtType = {actForYear, currCdFroms,actForMonths};
        // const actBatchFetchExchRtModel = JSON.stringify(actBatchFetchExchRtParam);
        //
        // await dispatch({
        //   type: 'ActForecastData/searchBatchFetchExch',
        //   payload: {
        //     actBatchFetchExchRtModel,
        //   },
        // });
        //
        // const exchRt =  this.props.ActForecastData.ExchLst;


        let currCdTo = localStorage.getItem('umi_locale_money');
        if (currCdTo === null) {
          currCdTo = 'JPY';
        }
        // const exchRtList = this.state.exchRtList;
        if(exchRtListData!==null && exchRtListData!==undefined) {
          formData.forEach((field, index) => {
            if (formData[index] !== undefined && formData[index] !== null
              && formData[index].orderAmt) {
              let actFormoth = '';
              if(index < 9) {
                actFormoth= '0' + (index+1);
              } else {
                actFormoth = "" + (index + 1);
              }
              const currDt = actForYear + "-" + actFormoth + "-01";
              const exchRt = exchRtListData.filter((e) => e.currCdTo === currCdTo  && e.currCdFrom === formData[index].cntrcCurrNm && currDt>=e.actvStartDt && currDt<=e.actvEndDt);
              if(exchRt!==null && exchRt!==undefined && exchRt !== "" && exchRt.length>0) {
                const value = parseInt(formData[index].orderAmt.replaceAll(',', ''), 10);
                totalAmounts += value * parseFloat(exchRt[0].exchRt);
              }
            }
          });
          // @ts-ignore
          amountUnit = localStorage.getItem('umi_locale_money');
        }



        // if(this.props.ActForecastData.ExchLst!==null && this.props.ActForecastData.ExchLst!==undefined) {
        //   formData.forEach((field, index) => {
        //     if (formData[index] !== undefined && formData[index] !== null
        //       && formData[index].orderAmt) {
        //       const value = parseInt(formData[index].orderAmt.replaceAll(',', ''), 10);
        //       totalAmounts += value * exchRt[index];
        //     }
        //   });
        // // @ts-ignore
        // amountUnit = localStorage.getItem('umi_locale_money');
        // }
      }else{
        formData.forEach((field, index) => {
          if(formData[index]!==undefined && formData[index]!==null
            && formData[index].orderAmt
            && formData[index].cntrcCurrNm) {
            totalAmounts +=  parseInt(formData[index].orderAmt.replaceAll(',',''),10);
          }
        });
      }
    }

    this.setState({
      totalAmount: formatUtil.thousandAmountFormat(Math.round(totalAmounts).toString()).toString(),
      totalAmountUnit: amountUnit !== "" ? amountUnit : localStorage.getItem('umi_locale_money'),
    });
  };


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

  saveTopBatchEditData= () => {
    this.setState({
      batchEditable: false,
    });
  }

  cancelTopBatchEditData= () => {
    this.setState({
      actForYear: basicInfoBak.actForYear,
      busUserCd: basicInfoBak.busUserCd,
      busUserNm: basicInfoBak.busUserNm,
      caseIndstyCd: basicInfoBak.caseIndstyCd,
      caseIndstyNm: basicInfoBak.caseIndstyNm,
      caseNm: basicInfoBak.caseNm,
      caseNo: basicInfoBak.caseNo,
      countOrgCd: basicInfoBak.countOrgCd,
      countOrgNm: basicInfoBak.countOrgNm,
      cstmrCd: basicInfoBak.cstmrCd,
      cstmrNm: basicInfoBak.cstmrNm,
      endUserCd: basicInfoBak.endUserCd,
      endUserNm: basicInfoBak.endUserNm,
      relatedNo: basicInfoBak.relatedNo,
      bugtId: basicInfoBak.bugtId,
      busActId: basicInfoBak.busActId,
      batchEditable: false,
    });
  }


  /**
   * batchデータの変更
   * @param index データの索引
   */
  batchBaseInfoEdit=  () => {
    const saveSaleDataModel: ActForBatchEditModel = {
      actForYear: this.state.actForYear,
      busUserCd: this.state.busUserCd,
      busUserNm: this.state.busUserNm,
      caseIndstyCd: this.state.caseIndstyCd,
      caseIndstyNm: this.state.caseIndstyNm,
      caseNm: this.state.caseNm,
      caseNo: this.state.caseNo,
      countOrgCd: this.state.countOrgCd,
      countOrgNm: this.state.countOrgNm,
      cstmrCd: this.state.cstmrCd,
      cstmrNm: this.state.cstmrNm,
      endUserCd: this.state.endUserCd,
      endUserNm: this.state.endUserNm,
      orgGroupId: this.props.user.currentUser?.orgGroupId,
      relatedNo: this.state.relatedNo,
      bugtId: this.state.bugtId,
      busActId: this.state.busActId,
      actForBatchEditSalesVoList: this.state.actForBatchEditSalesVoList,
      exchRtInfoVoList:this.state.exchRtInfoVoList,
    };

    basicInfoBak = saveSaleDataModel;
    this.setState({
      batchEditable: true,
    });
  }

  // customerChange = (e: String) => {
  //   this.setState({
  //     caseNumsValue:[],
  //   });
  //   if (e===undefined || e.toString() === '') {
  //     this.setState({
  //       cstmrCd: '',
  //       cstmrNm: '',
  //       caseNm: '',
  //     });
  //     this.caseChange('')
  //     return;
  //   }
  //   if (e.toString() !== null) {
  //     if (e.length > 100) {
  //       message.error(formatMessage({id: 'common.message.customerLength'}));
  //       return;
  //     }
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
  //           cstmrCd: '',
  //           cstmrNm: e.toString(),
  //           caseNm: '',
  //         });
  //         this.caseChange('')
  //       }
  //     } else {
  //       this.setState({
  //         cstmrCd: '',
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

   searchInfoColumnChange = async (e:any) => {

    /*  暂时不要
    let modalVisible= true;
     Modal.confirm({
       visible: modalVisible,
       icon: <ExclamationCircleOutlined/>,
       content: formatMessage({id: 'common.business.activities.content'}),
       closable: true,
       centered: true,
       okText: formatMessage({id: 'common.business.activities.content.ok'}),
       cancelText: formatMessage({id: 'common.business.activities.content.onCancel'}),
       // 这里注意要用箭头函数, 否则this不生效
       onOk: async () => { */

         if (e.toString() !== '') {
           if (this.props.ActForecastData.searchBatchData !== null) {
             let searchBatchData = this.props.ActForecastData.searchBatchData;
             searchBatchData = searchBatchData.filter((item) => item.relatedNo === e.toString());
             if (searchBatchData !== undefined && searchBatchData !== null) {
               const caseNo1 = searchBatchData[0].caseNo;
               const {dispatch} = this.props;
               const actForYear = this.props.user.currentUser?.dspYear;
               let relatedNo = '';
               relatedNo = searchBatchData[0].relatedNo;
               const currCdTo = 'JPY';

               const inputUserCd = this.props.user.currentUser?.inputUserCds;

               const actBatchEditSelectParam: FetchBatchEditDataType = {actForYear, currCdTo, relatedNo};
               const actForInfoBatchEditModel = JSON.stringify(actBatchEditSelectParam);
               await dispatch({
                 type: 'ActForecastData/fetchBatchEditTableData',
                 payload: {
                   actForInfoBatchEditModel,
                 },
               });
               this.componentDidMount();
               this.setState({
                 searchCaseNo: caseNo1.toString(),
                 searchCaseNm: e.toString(),
               });

             } else {
               this.setState({
                 searchCaseNo: '',
                 searchCaseNm: e.toString(),
               });
             }
           } else {
             this.setState({
               searchCaseNo: '',
               searchCaseNm: '',
             });
           }
         }
 /*        modalVisible =false;
       },
       onCancel: async () => {
         modalVisible =false;
       }
     }) */
  };




  caseChange = async (e: String) => {
    if (e !== undefined && e !== null && e.toString() !== '') {
      if (e.length > 100) {
        message.error(formatMessage({id: 'common.message.caseNmLength'}));
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
        message.error(formatMessage({id: 'common.message.caseNoLength'}));
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

  probabilityChange = (e: string, index: number) => {
    if (e.toString() !== '') {
      if(this.props.probabilityLst!== null){
        let probabilityList = this.props.probabilityLst;
        probabilityList = probabilityList.filter((item) => item.cdNm === e.toString());
        let cdVal = '';
        if (probabilityList !== undefined && probabilityList !== null) {
          cdVal = probabilityList[0].cdVal.toString();
        }
        formData[index].actForRankCd = cdVal;
        formData[index].actForRankNm = e.toString();
        this.setState({
          actForBatchEditSalesVoList: formData,
        });
      }else{
        formData[index].actForRankCd = '';
        formData[index].actForRankNm = '';
        this.setState({
          actForBatchEditSalesVoList: formData,
        });
      }
    }
  };


  currencyChange = (e: string, index: number) => {
    if (e.toString() !== '') {
      if(this.props.currencyLst!==null){
        let currencyList = this.props.currencyLst;
        currencyList = currencyList.filter((item) => item.cdNm === e.toString());
        let cdVal = '';
        if (currencyList !== undefined && currencyList !== null) {
          cdVal = currencyList[0].cdVal.toString();
        }
        formData[index].cntrcCurrCd = cdVal.toString();
        formData[index].cntrcCurrNm = e.toString();
        this.setState({
          actForBatchEditSalesVoList: formData,
        });
      }else{
        formData[index].cntrcCurrCd = '';
        formData[index].cntrcCurrNm = '';
        this.setState({
          actForBatchEditSalesVoList: formData,
        });
      }
      this.totalAmountSum(index);
    }
  };

  effortUnitChange = (e: string, index: number) => {
    if (e.toString() !== '') {
      if(this.props.effortUnitLst!== null){
        let effortUnitList = this.props.effortUnitLst;
        effortUnitList = effortUnitList.filter((item) => item.cdNm === e.toString());
        if (effortUnitList !== undefined && effortUnitList !== null) {
          const { cdVal } = effortUnitList[0];
          formData[index].effortUnitCd = cdVal.toString();
        }else{
          formData[index].effortUnitCd = '';
        }
        formData[index].effortUnitNm = e.toString();
        this.setState({
          actForBatchEditSalesVoList: formData,
        });
      }else{
        formData[index].effortUnitCd = '';
        formData[index].effortUnitNm = '';
        this.setState({
          actForBatchEditSalesVoList: formData,
        });
      }
      this.totalEffortSum();
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
  //     if (e.length > 100) {
  //       message.error(formatMessage({id: 'common.message.endUserNmLength'}));
  //       return;
  //     }
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
  batchEditHideModal = () => {
    const { dispatch } = this.props;
    const visible = false;
    dispatch({
      type: 'ActForecastData/changeBatchEditVisible',
      payload: {
        visible,
      },
    });
  };

  /**
   * messageModel 点击确认
   * */
  batchEditConfirm = () => {
    // 关闭model
    this.batchEditHideModal();
    // eslint-disable-next-line @typescript-eslint/no-shadow

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
    const actForBatchEditModel = JSON.stringify(formDataBak);

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
        type: 'ActForecastData/addEditCustomerAndEndUserDataInfo',
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
          actForBatchEditModel,
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
        type: 'ActForecastData/addEditCustomerDataInfo',
        payload: {
          customerInfoModel,
        },
        payload1: {
          caseInfoModel,
        },
        payload2: {
          actForBatchEditModel,
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
        type: 'ActForecastData/addEditEndUserDataInfo',
        payload: {
          endUserInfoModel,
        },
        payload1: {
          caseInfoModel,
        },
        payload2: {
          actForBatchEditModel,
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
    this.setState({
      notEnterTip: '',
    });

    this.updateOrInsertData();
  };

  clearBatchLineData = (e: SalesDataModel, index: number) => {
    if (e.toString() !== null) {
      formData[index].effort = '';
      formData[index].effortUnitNm = '';
      formData[index].effortUnitCd = '';
      formData[index].orderAmt = '';
      formData[index].cntrcCurrNm = '';
      formData[index].cntrcCurrCd = '';
      formData[index].actForRankNm = '';
      formData[index].actForRankCd = '';

      this.setState({
        actForBatchEditSalesVoList: formData,
      });
      this.totalAmountSum(index);
      this.totalEffortSum();
    }
  };

  saveBatchEditData= () => {

    // 案件№、工数、エンドユーザー 入力されない
    let notEnterValue = '';
    const list = this.state.actForBatchEditSalesVoList;

    // 明細のチェック
    for (let j = 0; j < list.length; j++){
      let mesgInfo = '';
      const orderAmt = list[j].orderAmt ? parseInt(list[j].orderAmt.replace(',',''),10) : 0;
      const effort = list[j].effort ? parseFloat(list[j].effort.replace(',','')) : 0;

      if((!list[j].orderAmt
        && !list[j].cntrcCurrNm
        && !list[j].effort
        && !list[j].effortUnitNm
        && !list[j].actForRankNm)
        || (orderAmt !== 0
          && list[j].cntrcCurrNm
          && effort === 0
          && !list[j].effortUnitNm
          && list[j].actForRankNm)
        || (orderAmt !== 0
          && list[j].cntrcCurrNm
          && effort === 0
          && !list[j].effortUnitNm
          && list[j].actForRankNm)
        || (orderAmt !== 0
          && list[j].cntrcCurrNm
          && list[j].effort
          && list[j].effortUnitNm
          && list[j].actForRankNm)) {
        // 処理続き
      } else {
        if (orderAmt === 0) {
          mesgInfo = mesgInfo.concat(formatMessage({id: 'actualityForecastBottom.tableHead.contractAmount'}),' ');
        }
        if (!list[j].cntrcCurrNm) {
          mesgInfo = mesgInfo.concat(formatMessage({id: 'actualityForecastBottom.tableHead.contractCurrency'}),' ');
        }
        if (effort !== 0 && !list[j].effortUnitNm) {
          mesgInfo = mesgInfo.concat(formatMessage({id: 'actualityForecastBottom.tableHead.effort'}),' ');
        }
        if (!list[j].actForRankNm) {
          mesgInfo = mesgInfo.concat(formatMessage({id: 'actualityForecastBottom.tableHead.probability'}),' ');
        }
        if (mesgInfo) {
          const errorInfo = formatMessage({id: 'actualityForecastBatchEdit.basic.inputMessage'}).replace('%1',list[j].actForMothTitle);
          message.error(errorInfo.replace('%2',mesgInfo));
          return;
        }
      }

    }
    // Sales Dateの12件probabilityが「ordered」ある場合
    let checkFlag = false;
    let effortCheckFlag = false;
    for (let i = 0; i < list.length; i++) {
      if (list[i].actForRankCd === '1') {
        checkFlag = true;
      }
      if ((list[i].orderAmt
        && list[i].cntrcCurrNm
        && !list[i].effort
        && list[i].actForRankNm)) {
        effortCheckFlag = true;
      }
    }
    if (checkFlag) {
      if(!this.state.cstmrNm) {
        message.error(formatMessage({id: 'runningCases.message.customer'}));
        return;
      }
    }
    // customer
    if(this.state.cstmrNm.length > 100) {
      message.error(formatMessage({id: 'common.message.customerLength'}));
      return;
    }
    // case
    if(!this.state.caseNm) {
      message.error(formatMessage({id: 'actualityForecastBatchEdit.message.caseNm'}));
      return;
    }
    if(this.state.caseNm.length > 100) {
      message.error(formatMessage({id: 'actualityForecastBatchEdit.message.caseNmLength'}));
      return;
    }

    if (checkFlag) {
      if (!this.state.caseNo) {
        message.error(formatMessage({id: 'common.error.caseNoNotInput'}));
        return;
      }
    }

    // case number
    if(this.state.caseNo.length > 15) {
      message.error(formatMessage({id: 'common.message.caseNoLength'}));
      return;
    }


    // sales dept
    if(!this.state.countOrgNm) {
      message.error(formatMessage({id: 'actualityForecastBatchEdit.message.countOrgNm'}));
      return;
    }

    // industy 業種
    if(!this.state.caseIndstyNm) {
      message.error(formatMessage({id: 'actualityForecastBatchEdit.message.industry'}));
      return;
    }

    // marketer
    if(!this.state.busUserNm) {
      message.error(formatMessage({id: 'actualityForecastBatchEdit.message.busUserNm'}));
      return;
    }
    // end user
    if(this.state.endUserNm.length > 100) {
      message.error(formatMessage({id: 'common.message.endUserNmLength'}));
      return;
    }

    if (checkFlag) {
      if (!this.state.endUserNm) {
        message.error(formatMessage({ id: 'common.error.endUserNotInput' }));
        return;
      }
      // 案件№ ,エンドユーザー 正しく入力する 確認メッセージ
      notEnterValue = formatMessage({ id: 'common.message.confirm' });
    } else {
      if (!this.state.caseNo &&
        !this.state.cstmrNm &&
        effortCheckFlag &&
        !this.state.endUserNm) {
        notEnterValue = formatMessage({
          id: 'common.message.customerAndCaseNoAndEffortAndEndUserNotInput',
        });
      } else if (!this.state.caseNo &&
        !this.state.cstmrNm &&
        !this.state.endUserNm) {
        notEnterValue = formatMessage({
          id: 'common.message.customerAndCaseNoAndEndUserNotInput',
        });
      } else if(!this.state.caseNo &&
        !this.state.cstmrNm &&
        effortCheckFlag) {
        notEnterValue = formatMessage({ id: 'common.message.customerAndCaseNoAndEffortNotInput' });
      } else if (!this.state.caseNo &&
        effortCheckFlag &&
        !this.state.endUserNm ) {
        notEnterValue = formatMessage({ id: 'common.message.caseNoAndEffortAndEndUserNotInput' });
      } else if(!this.state.caseNo &&
        !this.state.cstmrNm) {
        notEnterValue = formatMessage({
          id: 'common.message.customerAndCaseNoNotInput',
        });
      } else if(!this.state.caseNo &&
        !this.state.endUserNm) {
        notEnterValue = formatMessage({
          id: 'common.message.caseNoAndEndUserNotInput',
        });
      } else if(!this.state.cstmrNm &&
        !this.state.endUserNm) {
        notEnterValue = formatMessage({
          id: 'common.message.customerAndEndUserNotInput',
        });
      } else if(!this.state.cstmrNm &&
        effortCheckFlag) {
        notEnterValue = formatMessage({ id: 'common.message.customerAndEffortNotInput' });
      } else if(!this.state.caseNo &&
        effortCheckFlag) {
        notEnterValue = formatMessage({ id: 'common.message.caseNoAndEffortNotInput' });
      } else if (!this.state.endUserNm &&
        effortCheckFlag) {
        notEnterValue = formatMessage({ id: 'common.message.effortAndEndUserNotInput' });
      } else if (!this.state.cstmrNm) {
        notEnterValue = formatMessage({ id: 'common.message.customerNotInput' });
      } else if (!this.state.caseNo) {
        notEnterValue = formatMessage({ id: 'common.message.caseNoNotInput' });
      } else if (!this.state.endUserNm) {
        notEnterValue = formatMessage({ id: 'common.message.endUserNotInput' });
      } else if(effortCheckFlag) {
        notEnterValue = formatMessage({ id: 'common.message.effortNotInput' });
      }
    }
    const saveSaleDataModel: ActForBatchEditModel = {
      actForYear: this.state.actForYear,
      busUserCd: this.state.busUserCd,
      busUserNm: this.state.busUserNm,
      caseIndstyCd: this.state.caseIndstyCd,
      caseIndstyNm: this.state.caseIndstyNm,
      caseNm: this.state.caseNm,
      caseNo: this.state.caseNo,
      countOrgCd: this.state.countOrgCd,
      countOrgNm: this.state.countOrgNm,
      cstmrCd: (this.state.cstmrCd && this.state.cstmrCd !=='undefined')?this.state.cstmrCd:'',
      cstmrNm: this.state.cstmrNm?this.state.cstmrNm:'',
      endUserCd: this.state.endUserCd,
      endUserNm: this.state.endUserNm,
      orgGroupId: this.props.user.currentUser?.orgGroupId,
      relatedNo: this.state.relatedNo,
      bugtId: this.state.bugtId,
      busActId: this.state.busActId,
      actForBatchEditSalesVoList: this.state.actForBatchEditSalesVoList,
    };

    formDataBak = saveSaleDataModel;

    this.setState({
      notEnterTip: notEnterValue,
    });

    // 案件№、工数、エンドユーザー 入力
    if (notEnterValue === '') {
      this.updateOrInsertData();
    }
  }

  /**
   * 更新または挿入
   */
  updateOrInsertData = async () => {
    /**
     * 批量添加数据
     */
    const {dispatch} = this.props;
    const actForBatchEditModel = JSON.stringify(formDataBak);

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
      type: 'ActForecastData/fetchSaveSaleData',
      payload: {
        actForBatchEditModel,
      },
      payload1: {
        actForInfoSelectModel,
      },
      payload2: {
        caseInfoModel,
      },
    });

    if(this.props.ActForecastData.messageData.result
      && !this.props.ActForecastData.modelVisible.batchEditVisible){
      // 关闭Top画面
      this.props.TopOnClose();
    }
  };


  editOutLineDisable = () => {

    if (!this.state.batchEditable) {
      return (<Tooltip
        placement="rightBottom"
        title={formatMessage({id: 'actualityForecastBottom.tooltip.edit'})}
        color='#FAD460'
      >
        <EditOutlined style={{color: "#003D82"}} onMouseDown={() => this.batchBaseInfoEdit()}/>
      </Tooltip>);
    }
    return (
      <div>
        <Space size={10}>
         {/* <CheckOutlined style={{color: "#003D82"}} onClick={() => this.saveTopBatchEditData()} /> */}
          <Tooltip
            placement="rightBottom"
            title={formatMessage({id: 'actualityForecastBottom.tooltip.editGiveUp'})}
            color='#FAD460'
          >
          <CloseOutlined style={{color: "#003D82"}} onClick={() => this.cancelTopBatchEditData()} />
          </Tooltip>
        </Space>
      </div>
    );
  }

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
      allCustomerLst,
    } = this.props;


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

    const getSearchCaseOption = (list: SearchCaseType[]) => {
      if (!list || list.length < 1) {
        return (
          <Option key={0}>
            {formatMessage({ id: 'common.message.noSelect' })}
          </Option>
        );
      }

      const listBak = list.filter((item) => item.caseNm !== null && item.caseNm !== '');
      return listBak.map((item) => (
        <Option key={item.relatedNo} >
          {item.caseNm}
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

    const BasicInfoColumns2 = [
      {
        title: '',
        dataIndex: 'title1',
        key: 'title1',
        width: '90px',
        render: (text: string) => {
          return <div style={{color: '#003D82', textAlign: 'right' }}>{text}&nbsp;</div>;
        },
      },
      {
        title: '',
        dataIndex: 'value1',
        key: 'value1',
        width: '230px',
        render: (text: string,  record: any, index: number) => {
          if (this.state.batchEditable) {
            if (index === 0) {
              return (
                <AutoComplete
                  id={'value1'}
                  className={styles.selectBatchEdit}
                  dropdownMatchSelectWidth={220}
                  value={this.state.caseNm}
                  onChange={(e) => this.caseChange(e)}
                  // @ts-ignore
                  onSelect={(e) => {
                    this.caseChange(e);
                    document.querySelector('#value2').focus();
                  }}
                  allowClear
                  options={caseOptions}
                  filterOption={(inputValue, option) =>
                    // @ts-ignore
                    option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                  }
                />
              );
            }
            if (index === 1) {
              return (
                <Select
                  id={'countOrgNm'}
                  className={styles.selectBatchEdit}
                  value={this.state.countOrgNm}
                  // @ts-ignore
                  onSelect={(e) => {
                    this.onOrgCdChange(e);
                    document.querySelector('#caseIndstyNm').focus();}}
                >
                  {getOrgCdOption(authOrgCdLst)}
                </Select>
              );
            }
            if (index === 2) {
              return (
                // <AutoComplete
                //   className={styles.selectBatchEdit}
                //   onSearch={(e) => this.endUserChange(e)}
                //   // @ts-ignore
                //   onSelect={(e) => this.endUserChange(e)}
                //   value={this.state.endUserNm}
                //   allowClear
                //   options={endUserOptions}
                //   filterOption={(inputValue, option) =>
                //     // @ts-ignore
                //     option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                //   }
                // />
                <EndUserInfo
                  id={'endUserNm'}
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
                      document.querySelector('#busUserNm').focus();
                    }
                  }}
                />
              );
            }
          }
          if (index === 0) {
            return <div style={{color: 'black'}}>{this.state.caseNm}</div>;
          }
          if (index === 1) {
            return <div style={{color: 'black'}}>{this.state.countOrgNm}</div>;
          }
          // if (index === 2) {
          return <div style={{color: 'black'}}>{this.state.endUserNm}</div>;
          // }
        }
      },
      {
        title: '',
        dataIndex: 'title2',
        key: 'title2',
        width: '80px',
        render: (text: string) => {
          return <div style={{color: '#003D82', textAlign: 'right'}}>{text}&nbsp;</div>;
        },
      },
      {
        title: '',
        dataIndex: 'value2',
        key: 'value2',
        render: (text: string,  record: any, index: number) => {
          if (this.state.batchEditable) {
            if(index === 0) {
              return (
                <AutoComplete
                  id={'value2'}
                  className={styles.selectBatchEdit}
                  defaultValue={text}
                  onChange={(e) => this.caseNumberChange(e)}
                  onSelect={(e) => {
                    this.caseNumberChange(e);
                    document.querySelector('#countOrgNm').focus();}}
                  value={caseNo === '' ? this.state.caseNo : caseNo}
                  allowClear
                  options={caseNumberOptions}
                  filterOption={(inputValue, option) =>
                    // @ts-ignore
                    option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                  }
                />
              );
            }
            if(index === 1) {
              return (
                <Select
                  id={'caseIndstyNm'}
                  className={styles.selectBatchEdit}
                  value={this.state.caseIndstyNm}
                  // @ts-ignore
                  onSelect={(e) => {
                    this.industryChange(e);
                    document.querySelector('#endUserNm').focus();
                  }}
                >
                  {getIndustryOption(industryLst)}
                </Select>
              );
            }
            if(index === 2) {
              return (
                <Select
                  id={'busUserNm'}
                  className={styles.selectBatchEdit}
                  value={this.state.busUserNm}
                  // @ts-ignore
                  onSelect={(e) => {this.businessChargeChange(e);
                    // document.querySelector('#busUserNm').focus();
                  }}
                >
                  {getUserOption(userLst)}
                </Select>
              );
            }
          }
          if (index === 0) {
            return <div style={{color: 'black'}}>{this.state.caseNo}</div>;
          }
          if (index === 1) {
            return <div style={{color: 'black'}}>{this.state.caseIndstyNm}</div>;
          }
          // if (index === 2) {
          return <div style={{color: 'black'}}>{this.state.busUserNm}</div>;
          // }
        }
      },
    ];
    const BasicInfoColumns1 = [
      {
        title: '',
        dataIndex: 'title1',
        key: 'title1',
        width: '90px',
        render: (text: string) => {
          return <div style={{color: '#003D82', textAlign: 'right'}}>{text}&nbsp;</div>;
        },
      },
      {
        title: '',
        dataIndex: 'value1',
        key: 'value1',
        render: (text: string,  record: any, index: number) => {
          if (this.state.batchEditable) {
            if(index === 0){
              return (
                // <AutoComplete
                //   className={styles.selectBatchEdit}
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
                  cstmrCd={this.state.cstmrCd}
                  cstmrNm={this.state.cstmrNm}
                  customerLst={customerLst}
                  allCustomerLst={allCustomerLst}
                  caseLst={caseLst}
                  index={0}
                  itemNm={formatMessage({id: 'actualityForecastTop.tableHead.customer'})}
                  checkLength={100}
                  caseFlag="0"
                  styleFlag="0"
                  onRef={this.onRef}
                  handleCustomer={this.handleCustomer.bind(this)}
                  onInputKeyDown={ (e) => {
                    if (e.key === 'Enter') {
                      document.querySelector('#value1').focus();
                    }
                  }}
                />
              );
            }
          }
          return <div style={{color: 'black'}}>{this.state.cstmrNm}</div>;
        },
      },
    ];

    const searchInfoColumn = [
      {
        title: '',
        dataIndex: 'title1',
        key: 'title1',
        width: '90px',
        render: (text: string) => {
          return <div style={{color: '#003D82', textAlign: 'right'}}>{text}&nbsp;</div>;
        },
      },
      {
        title: '',
        dataIndex: 'value1',
        key: 'value1',
        render: (text: string,  record: any, index: number) => {
          return (
            <Select
              showSearch
              className={styles.selectBatchEdit}
              value={this.state.searchCaseNm}
              // @ts-ignore
              onChange={(e)=>this.searchInfoColumnChange(e)}
            >
              {getSearchCaseOption(this.props.ActForecastData.searchBatchData)}
            </Select>
          );
        },
      },
    ];


    // var inputs = document.getElementsByTagName("input");
    const salesInfoColumns = [
      {
        title: '',
        dataIndex: 'title',
        key: 'title',
        width: '30px',
        render: (text: string, record: SalesDataModel) => {
          return <div style={{color: '#003D82'}}>{record.actForMothTitle}</div>;
        },
      },
      {
        title: formatMessage({ id: 'actualityForecastBottom.tableHead.contractAmount' }),
        dataIndex: 'amount',
        key: 'amount',
        width: '110px',
        render: (text: string, record: SalesDataModel, index: number) => {
          const effortValue = this.state.actForBatchEditSalesVoList[index];
          let orderAmtValue = '';
          // @ts-ignore
          if(effortValue!==undefined && effortValue!==null) {
            // orderAmtValue = formatUtil.thousandAmountFormat(effortValue.orderAmt.toString());
            orderAmtValue= effortValue.orderAmt.toString()
          }
          return (
            <Input
              className={styles.amountInputBatchEdit}
              value={orderAmtValue}
              onChange={(e) => this.onAmountChange(e, index)}
              onFocus={(e) => this.onAmountFocusChange(e, index)}
              onBlur={(e) => this.onAmountBlurChange(e, index)}
              // onPressEnter={(e) => inputs[2].focus()}
            />
          );
        },
      },
      {
        title: formatMessage({ id: 'actualityForecastBottom.tableHead.contractCurrency' }),
        dataIndex: 'currency',
        key: 'currency',
        width: '110px',
        render: (text: string, record: SalesDataModel, index: number) => {
          const effortValue = this.state.actForBatchEditSalesVoList[index];
          let cntrcCurrNmValue = '';
          if(effortValue!==undefined && effortValue!==null) {
            cntrcCurrNmValue = effortValue.cntrcCurrNm;
          }
          return (
            <Select
              className={styles.selectBatchEdit}
              value={cntrcCurrNmValue}
              // @ts-ignore
              onSelect={(e) => {this.currencyChange(e, index);
                // inputs[3].focus();
              }}
            >
              {getCurrencyLstOption(currencyLst)}
            </Select>
          );
        },
      },
      {
        title: formatMessage({ id: 'actualityForecastBottom.tableHead.effort' }),
        dataIndex: 'effort',
        key: 'effort',
        width: '200px',
        render: (text: string, record: SalesDataModel, index: number) => {
          const effortValue = this.state.actForBatchEditSalesVoList[index];
          let effortInputValue = '';
          let effortUnitNmValue = '';
          if(effortValue!==undefined && effortValue!==null) {
            effortInputValue = effortValue.effort;
            effortUnitNmValue = effortValue.effortUnitNm;
          }
          return (
            <div>
              <Input
                className={styles.effortInputBatchEdit}
                value={effortInputValue}
                onChange={(e) => this.onEffortChange(e, index)}
                onFocus={(e) => this.onEffortFocusChange(e, index)}
                onBlur={(e) => this.onEffortBlurChange(e, index)}
              />
              <Select
                className={styles.effortSelectBatchEdit}
                value={effortUnitNmValue}
                // @ts-ignore
                onSelect={(e) => {this.effortUnitChange(e, index);
                  // inputs[4].focus();
                }}
              >
                {getEffortUnitLstOption(effortUnitLst)}
              </Select>
            </div>
          );
        },
      },
      {
        title: formatMessage({ id: 'actualityForecastBottom.tableHead.probability' }),
        dataIndex: 'probability',
        width: '90px',
        render: (text: string, record: SalesDataModel, index: number) => {
          const rankValue = this.state.actForBatchEditSalesVoList[index];
          let actForRankNmValue = '';
          if(rankValue!==undefined && rankValue!==null) {
            actForRankNmValue = rankValue.actForRankNm;
          }
          return (
            <Select
              className={styles.selectBatchEdit}
              value={actForRankNmValue}
              // @ts-ignore
              onSelect={(e) => {this.probabilityChange(e, index);
                // inputs[5].focus();
              }}
            >
              {getProbabilityOption(probabilityLst)}
            </Select>
          );
        },
      },
      {
        title: '',
        dataIndex: 'title',
        key: 'title',
        render: (text: string, record: SalesDataModel, index: number) => {
          return (
            <div>
              <Tooltip
                placement="rightBottom"
                title={formatMessage({ id: 'actualityForecastMid.radioButton.clear' })}
                color='yellow'>
                <ClearOutlined onMouseDown={()=>this.clearBatchLineData(record,index)} />
              </Tooltip>
            </div>
          );
        },
      },
    ];

    const salesInfoColumnsTotal = [
      {
        title: '',
        dataIndex: 'title',
        key: 'title',
        width: '30px',
        render: (text: string) => {
          return <div style={{color: '#003D82',fontWeight: 'bolder'}}>{text}</div>;
        },
      },
      {
        title: '',
        dataIndex: 'amount',
        key: 'amount',
        width: '105px',
        render: (text: string) => {
          return <div style={{color: 'black',textAlign: 'right'}}>{text}</div>;
        },
      },
      {
        title: '',
        dataIndex: 'currency',
        key: 'currency',
        width: '105px',
        render: (text: string) => {
          return <div style={{color: 'black'}}>&nbsp;{text}</div>;
        },
      },
      {
        title: '',
        dataIndex: 'effort',
        key: 'effort',
        width: '100px',
        render: (text: string) => {
          return <div style={{color: 'black',textAlign: 'right'}}>{text} </div>;
        },
      },
      {
        title: '',
        dataIndex: 'blank1',
        key: 'blank1',
        width: '100px',
        render: (text: string) => {
          return <div style={{color: 'black'}}>&nbsp;{text} </div>;
        },
      },
      {
        title: '',
        dataIndex: 'blank2',
        key: 'blank2',
      },
    ];

    const basicInfoData1:any[]=[];
    const basicInfoDataSearch:any[]=[];
    const basicInfoData2:any[]=[];
    const basicInfoData3:any[]=[];
    let salesInfoData:any[]=[];

    const batchEditFormData = this.props.ActForecastData.batchEditTableData;

    basicInfoDataSearch.push({title1: formatMessage({id: 'actualityForecastTop.tableHead.case'}),value1:""});

    if(batchEditFormData!==undefined && batchEditFormData!==null ) {
      basicInfoData1.push({title1: formatMessage({id: 'actualityForecastTop.tableHead.customer'}),value1:batchEditFormData.cstmrNm});
      basicInfoData2.push({title1: formatMessage({id: 'actualityForecastTop.tableHead.case'}),value1:batchEditFormData.caseNm,title2: formatMessage({id: 'actualityForecastTop.tableHead.caseNumber'}),value2:batchEditFormData.caseNo});
      basicInfoData2.push({title1: formatMessage({id: 'actualityForecastTop.tableHead.accountingDepartment'}),value1:batchEditFormData.countOrgNm,title2: formatMessage({id: 'actualityForecastTop.tableHead.industry'}),value2:batchEditFormData.caseIndstyNm});
      basicInfoData2.push({title1: formatMessage({id: 'actualityForecastTop.tableHead.endUser'}),value1:batchEditFormData.endUserNm,title2: formatMessage({id: 'actualityForecastTop.tableHead.businessCharge'}),value2:batchEditFormData.busUserNm});


      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      salesInfoData = batchEditFormData.actForBatchEditSalesVoList;

      salesInfoData[0].actForMothTitle = formatMessage({id: 'actualityForecastBottom.month.Jan'});
      salesInfoData[1].actForMothTitle = formatMessage({id: 'actualityForecastBottom.month.Feb'});
      salesInfoData[2].actForMothTitle = formatMessage({id: 'actualityForecastBottom.month.Mar'});
      salesInfoData[3].actForMothTitle = formatMessage({id: 'actualityForecastBottom.month.Apr'});
      salesInfoData[4].actForMothTitle = formatMessage({id: 'actualityForecastBottom.month.May'});
      salesInfoData[5].actForMothTitle = formatMessage({id: 'actualityForecastBottom.month.Jun'});
      salesInfoData[6].actForMothTitle = formatMessage({id: 'actualityForecastBottom.month.Jul'});
      salesInfoData[7].actForMothTitle = formatMessage({id: 'actualityForecastBottom.month.Aug'});
      salesInfoData[8].actForMothTitle = formatMessage({id: 'actualityForecastBottom.month.Sept'});
      salesInfoData[9].actForMothTitle = formatMessage({id: 'actualityForecastBottom.month.Oct'});
      salesInfoData[10].actForMothTitle = formatMessage({id: 'actualityForecastBottom.month.Nov'});
      salesInfoData[11].actForMothTitle = formatMessage({id: 'actualityForecastBottom.month.Dec'});

      basicInfoData3.push({title:formatMessage({id: 'app.common.Total'}),amount:this.state.totalAmount,currency:this.state.totalAmountUnit,effort:this.state.totalEffort,blank1:this.state.totalEffortUnit,blank2:''});

    }


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

    let basicInfoHeight = '130px';
    if (this.state.batchEditable) {
      basicInfoHeight = '230px';
    }

    // @ts-ignore
    return (
      <>
        <Spin spinning={this.state.searchLoading}>
          <div style={{height: {basicInfoHeight}, backgroundColor: 'white'}}>
            <Table
              className={styles.BacicInfoAct}
              // @ts-ignore
              columns={searchInfoColumn}
              dataSource={basicInfoDataSearch}
              pagination={false}
            />
          </div>
          <div style={{height: '10px'}}/>
          <div style={{height: {basicInfoHeight}, backgroundColor: 'white'}}>
            <Space size={10}>
              <p style={{
                marginLeft: 15,
                fontSize: '18px',
                fontWeight: 'bolder',
                color:'#003D82'
              }}>{formatMessage({id: 'actualityForecastBottom.batchEdit.basicInfo'})}</p>
              {this.editOutLineDisable()}
            </Space>
            <div style={{marginLeft: 15,marginRight: 15}}>
              <Table
                className={styles.BacicInfoAct}
                // @ts-ignore
                columns={BasicInfoColumns1}
                dataSource={basicInfoData1}
                pagination={false}
              />
            </div>
            <div style={{marginLeft: 15,marginRight: 15}}>
              <Table
                className={styles.BacicInfoAct}
                // @ts-ignore
                columns={BasicInfoColumns2}
                dataSource={basicInfoData2}
                pagination={false}
              />
            </div>
          </div>
          <div style={{height: '10px'}}/>
          <div style={{height: '530px', backgroundColor: 'white'}}>
            <p style={{
              marginLeft: 15,
              fontSize: '18px',
              fontWeight: 'bolder',
              color:'#003D82'
            }}>{formatMessage({id: 'actualityForecastBottom.batchEdit.salesData'})}</p>
            <div style={{marginLeft: 15,marginRight: 15}}>
              <Table
                id={'tableId'}
                className={styles.SalesInfoAct}
                // @ts-ignore
                columns={salesInfoColumns}
                dataSource={salesInfoData}
                pagination={false}
              />
            </div>
            <div style={{marginLeft: 15,marginRight: 15}}>
              <Table
                className={styles.SalesInfoAct}
                // @ts-ignore
                columns={salesInfoColumnsTotal}
                dataSource={basicInfoData3}
                pagination={false}
              />
            </div>
            <div style={{marginLeft: 400}}>
              <Space size={10}>
                <Button onMouseDown={this.props.BatchEditonClose} type="primary" className={styles.batchEditSaveButton}>
                  {formatMessage({ id: 'actualityForecastBatchEdit.basic.SetCancel' })}
                </Button>
                <Button onMouseDown={this.saveBatchEditData} type="primary"
                        className={styles.batchEditSaveButton}
                        disabled={!this.state.searchCaseNm}
                        >
                  {formatMessage({ id: 'actualityForecastBottom.label.save' })}
                </Button>
              </Space>
            </div>
          </div>
        </Spin>

        {/* message model */}
        <Modal
          visible={this.props.ActForecastData.modelVisible.batchEditVisible === true}
          closable={false}
          centered={true}
          onOk={this.batchEditConfirm}
          onCancel={this.batchEditHideModal}
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
)(ActualityForecastBatchEdit);
