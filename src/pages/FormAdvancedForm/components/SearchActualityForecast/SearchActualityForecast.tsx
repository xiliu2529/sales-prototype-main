import {
  Button,
  Select,
  Space,
  Table,
  Card,
  message,
  Spin,
  BackTop,
  Layout,
  Affix,
  Badge,
  Checkbox,
  Tooltip,
  Tabs,
  Col, Row, Modal, Menu, Dropdown
} from 'antd';
import React, { Component , useState } from 'react';
import { formatMessage } from '@@/plugin-locale/localeExports';
// eslint-disable-next-line import/no-duplicates
import { DoubleLeftOutlined, PercentageOutlined, SnippetsOutlined } from '@ant-design/icons';
// eslint-disable-next-line import/no-duplicates
import './style.less';
import { connect } from '@@/plugin-dva/exports';
import {Dispatch, GlobalModelState, UserModelState} from '@@/plugin-dva/connect';
import { ConnectState } from '@/models/connect';
import "@/utils/messageConfig";
import {HomeRankOrderModel} from "@/pages/HomePage/data";
import {ActForecastTopData, DBusActDtl, FetchMonthNoType, MonthNoType} from "@/pages/FormAdvancedForm/data";
import ReactTooltip from "react-tooltip";
import setting from "@/assets/setting.png";
import classNames from "classnames";
import RightContent from "./RightContent";
import styles from './style.less';
import {ActForecastData, FetchActForDataType, SearchActForDataType, UserType} from './data';
import CaseAch from "@/pages/FormAdvancedForm/components/SearchActualityForecast/CaseAch";
import {history} from "@@/core/history";
import {BusActHead} from "@/pages/FormAdvancedForm/components/SearchActualityForecast/data";
import ActualityForecastMonthSummary
  from "@/pages/FormAdvancedForm/components/SearchActualityForecast/ActualityForecastMonthSummary"

const { Option } = Select;
const { TabPane } = Tabs;
interface TableFormProps {
  dispatch: Dispatch;
  searchActForData: ActForecastData;
  budgetOrHistDataList: ActForecastTopData;
  getMonthNo: MonthNoType;
  user: UserModelState;
  selectUserName: GlobalModelState[];
  actForMoth: string;
  searchUserLst: UserType[];
  busUserCd?: string;
  busUserNm?: string;
  busActHead:BusActHead;
}

interface TableDataStates {
  actForMoth: string;
  busUserCd?: string;
  busUserNm?: string;
  countOrgCd: string;
  countOrgNm: string;
  visible: boolean;
  initFlag: boolean;
  rankRight: [];
  searchLoading: boolean;
  columns: [];
  setCheckedList: [];
  checkedList: [];
  indeterminate: boolean;
  checkAll: boolean;
  caseAchVisible: boolean;
  cseeAchTitle: string;

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

let monthNo = 3;

class SearchActualityForecast extends Component<TableFormProps, TableDataStates> {
  constructor(props: Readonly<TableFormProps>) {
    super(props);
    this.state = {
      indeterminate:false,
      actForMoth: '',
      checkAll:true,
      checkedList : [],
      visible: false,
      caseAchVisible: false,
      cseeAchTitle: '',
      busUserCd: '',
      busUserNm: '',
      // eslint-disable-next-line react/no-unused-state
      countOrgCd: '',
      // eslint-disable-next-line react/no-unused-state
      countOrgNm: '',
      initFlag: true,
      searchLoading: false,
      setCheckedList:['3','4','5','6','7','8','9','10','11','12'],
      transSourceData :[
        /* { label: formatMessage({id: 'actualityForecastBottom.tableHead.No'}), value: '0' },
         { label: formatMessage({id: 'actualityForecastBottom.tableHead.customer'}), value: '1' },
         { label: formatMessage({id: 'actualityForecastBottom.tableHead.case'}), value: '2'}, */
        { label: formatMessage({id: 'actualityForecastBottom.tableHead.caseNumber'}), value: '3' },
        { label: formatMessage({id: 'actualityForecastBottom.tableHead.probability'}), value: '4' },
        { label: formatMessage({id: 'actualityForecastBottom.tableHead.contractAmount'}), value: '5' },
        { label: formatMessage({id: 'actualityForecastBottom.tableHead.contractCurrency'}), value: '6' },
        { label: formatMessage({id: 'actualityForecastBottom.tableHead.conversionAmount'}), value: '7' },
        { label: formatMessage({id: 'actualityForecastBottom.tableHead.conversionCurrency'}), value: '8' },
        { label: formatMessage({id: 'actualityForecastBottom.tableHead.effort'}), value: '9' },
        { label: formatMessage({id: 'actualityForecastBottom.tableHead.accountingDepartment'}), value: '10' },
        { label: formatMessage({id: 'actualityForecastBottom.tableHead.industry'}), value: '11' },
        { label: formatMessage({id: 'actualityForecastBottom.tableHead.endUser'}), value: '12' },
      ],
      columns: [
        {
          title: formatMessage({id: 'actualityForecastBottom.tableHead.No'}),
          dataIndex: 'No',
          key: '0',
          width: '50px',
          align: 'center',
          // eslint-disable-next-line @typescript-eslint/no-shadow
          render: (text: any, record: any, index: number) => {
            const no = index + 1;
            return <span>{no}</span>;
          },
        },
        {
          title: formatMessage({id: 'actualityForecastBottom.tableHead.customer'}),
          dataIndex: 'cstmrNm',
          key: '1',
          sorter: {
            compare: (a: {cstmrNm: string}, b: {cstmrNm: string}) => {
              const aVlue = a.cstmrNm ? a.cstmrNm :'';
              const bVlue = b.cstmrNm ? b.cstmrNm :'';
              return aVlue.localeCompare(bVlue);
            },
          },
          showSorterTooltip: false,
          width: '200px',
          render: (text: any, record: any, index: number) => {
            return <a  onClick={() => this.onCstmrNmEndUserNmClick(index,record,false)}>{record.cstmrNm}</a>;
          },
        },
        {
          title: formatMessage({id: 'actualityForecastBottom.tableHead.case'}),
          dataIndex: 'caseNm',
          key: '2',
          sorter: {
            compare: (a: {caseNm: string}, b: {caseNm: string}) => {
              const aVlue = a.caseNm ? a.caseNm :'';
              const bVlue = b.caseNm ? b.caseNm :'';
              return aVlue.localeCompare(bVlue);
            },
          },
          showSorterTooltip: false,
          width: '200px',
          render: (text: any, record: any, index: number) => {
            return (<Dropdown overlay={this.menuCaseNm(index, record)}><a>{record.caseNm}</a></Dropdown>);
          }
        },
        {
          title: formatMessage({id: 'actualityForecastBottom.tableHead.caseNumber'}),
          dataIndex: 'caseNo',
          key: '3',
          sorter: {
            compare: (a: {caseNo: string}, b: {caseNo: string}) => {
              const aVlue = a.caseNo ? a.caseNo :'';
              const bVlue = b.caseNo ? b.caseNo :'';
              return aVlue.localeCompare(bVlue);
            },
          },
          showSorterTooltip: false,
          width: '120px',
        },
        {
          title: formatMessage({id: 'actualityForecastBottom.tableHead.probability'}),
          dataIndex: 'actForRankNm',
          key: '4',
          sorter: {
            compare: (a: {actForRankNm: string}, b: {actForRankNm: string}) => {
              const aVlue = a.actForRankNm ? a.actForRankNm :'';
              const bVlue = b.actForRankNm ? b.actForRankNm :'';
              return aVlue.localeCompare(bVlue);
            },
          },
          showSorterTooltip: false,
          width: '110px',
        },
        {
          title: formatMessage({id: 'actualityForecastBottom.tableHead.contractAmount'}),
          dataIndex: 'orderAmt',
          key: '5',
          width: '80px',
          render: (text: string) => {
            return <div className={styles.amountDiv}>{text.toLocaleString()}</div>;
          },
        },
        {
          title: formatMessage({id: 'actualityForecastBottom.tableHead.contractCurrency'}),
          dataIndex: 'cntrcCurrNm',
          key: '6',
          width: '80px',
        },
        {
          title: formatMessage({id: 'actualityForecastBottom.tableHead.conversionAmount'}),
          dataIndex: 'changedOrderAmt',
          key: '7',
          width: '90px',
          render: (text: string) => {
            return <div className={styles.amountDiv}>{text.toLocaleString()}</div>;
          },
        },
        {
          title: formatMessage({id: 'actualityForecastBottom.tableHead.conversionCurrency'}),
          dataIndex: 'changedCntrcCurrNm',
          key: '8',
          width: '90px',
        },
        {
          title: formatMessage({id: 'actualityForecastBottom.tableHead.effort'}),
          dataIndex: 'effort',
          width: '70px',
          key: '9',
          colSpan: 2,
          render: (text: string) => {
            return <div className={styles.amountDiv}>{
              text.toLocaleString() === '0.00' ? (
                  <div>-</div>)
                :
                (<div>{text.toLocaleString()}</div>)}
            </div>;
          },
        },
        {
          title: formatMessage({id: 'actualityForecastBottom.tableHead.effort'}),
          dataIndex: 'effortUnitNm',
          key: '9',
          width: '40px',
          colSpan: 0,
        },
        {
          title: formatMessage({id: 'actualityForecastBottom.tableHead.accountingDepartment'}),
          dataIndex: 'countOrgNm',
          key: '10',
          width: '250px',
        },
        // {
        //   title: formatMessage({ id: 'actualityForecastTop.tableHead.businessCharge' }),
        //   dataIndex: 'busUserNm',
        //   key: 'busUserNm',
        //   width: '150px',
        // },
        {
          title: formatMessage({id: 'actualityForecastBottom.tableHead.industry'}),
          dataIndex: 'caseIndstyNm',
          key: '11',
          width: '70px',
        },
        {
          title: formatMessage({id: 'actualityForecastBottom.tableHead.endUser'}),
          dataIndex: 'endUserNm',
          key: '12',
          width: '220px',
          render: (text: any, record: any, index: number) => {
            return <a  onClick={() => this.onCstmrNmEndUserNmClick(index,record,true)}>{record.endUserNm}</a>;
          },
        },
      ],
      columnsList:[],
      summaryCstmrCd: '',
      summaryCstmrNm: '',
      summaryEndUserCd: '',
      summaryEndUserNm: '',
    };
    this.state.columns.forEach((item: any) => {
      // @ts-ignore
      this.state.columnsList.push(item);
    });
  }

  menuCaseNm = (index: number, record: any) => {
    const tagData = this.props.searchActForData.actForData.filter((item) => item.actForMoth === this.state.actForMoth);
    return (
      <Menu>
        <Menu.Item disabled={ tagData[index].bugtId===null?true:false }
                   onClick={(e) => {this.clickMenuRow1(e, index, record, tagData)}}>
          <PercentageOutlined />{formatMessage({ id: 'actualityForecastBottom.tooltip.compare' })}</Menu.Item>
        <Menu.Item　disabled={ record.busActId===null?true:false }
                   onClick={(e) => {this.clickMenuRow2(e, index, record, record.busActId);
                     this.changeRightMenu(false,true,false,false,false,false);
                   }}
        ><SnippetsOutlined />{formatMessage({ id: 'actualityForecastBottom.tooltip.sales' })}</Menu.Item>
      </Menu>
    )
  };

  closeCaseAch = () => {
    this.setState({
      caseAchVisible: false,
      cseeAchTitle: '',
    })
  }

  clickMenuRow1 =  async (e: any, index: number, record: any, tagData: any) => {
    const {dispatch} = this.props;
    const param = this.props.user.currentUser?.dspYear;
    const param1 = tagData[index].relatedNo;
    const param2 = tagData[index].bugtId;

    this.setState({
      caseAchVisible: true,
      cseeAchTitle: record.caseNm + ' ' + formatMessage({id: 'common.basic.compare'})
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


  clickMenuRow2 =  async (e: any, index: number, record: any, busActId: string) => {
    const {dispatch} = this.props;
    if (dispatch) {
      await dispatch({
        type: 'ActForecastData/getBusActHead',
        payload: busActId,
      });
    }
    this.props.busActHead.busUserNm = this.state.busUserNm;
    history.push({
      pathname: "/businessactivitiesEditAct",
      query: {id:'EditActivities'},
      state: {head: this.props.busActHead},
    });
  };
  // @ts-ignore
  changeRightMenu = (parma1: boolean,parma2: boolean,parma3: boolean,parma4: boolean,parma5: boolean,parma6: boolean): void => {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'message/changeRightMenu',
        payload1: {
          parma1,
        },
        payload2: {
          parma2,
        },
        payload3: {
          parma3,
        },
        payload4: {
          parma4,
        },
        payload5: {
          parma5,
        },
        payload6: {
          parma6,
        },
      });
    }
  };

  async componentDidMount(){

    const {dispatch} = this.props;
    // 販売データ編集範囲設定
    const monthNoParam: FetchMonthNoType = {
      orgGroupId: this.props.user.currentUser?.orgGroupId,
      orgId: this.props.user.currentUser?.dspUserOrgCd,
    };
    const monthNoModel = JSON.stringify(monthNoParam);
    await dispatch({
      type: 'ActForecastData/fetchMonthNo',
      payload: {
        monthNoModel
      },
    });

    if (this.props.getMonthNo.monthNo !== undefined &&
      this.props.getMonthNo.monthNo !== null &&
      this.props.getMonthNo.monthNo.toString() !== ''
    ) {
      monthNo = this.props.getMonthNo.monthNo
    }
    console.log(`monthNo: ${this.props.getMonthNo.monthNo}`);

    const lastYearMonthNo = monthNo - tMonth;
    // 取得 上一年可以修改数据的月份集合
    /* if (lastYearMonthNo > 0) {
       lastYearMonthList = [];
       for (let i = lastYearMonthNo; i > 0; i -= 1) {
         //  month 从0开始
         let lastOneMonth = moment(myDate).add(i - monthNo, 'month').month().toString();
         if (lastOneMonth === '0') {
           lastOneMonth = '12'
         } else if (lastOneMonth.length < 2) {
           lastOneMonth = `0${lastOneMonth}`;
         }
         console.log(`lastOneMonth: ${lastOneMonth}`);
         lastYearMonthList.push(lastOneMonth.toString());
       }

       let actForMoth = '';
       if (this.props.user.currentUser !== undefined && this.props.user.currentUser?.userDiv === '2' || this.props.user.currentUser?.dspYear === tYear.toString()) {
         actForMoth = nowMonth;
       } else {
         actForMoth = lastYearMonthList[lastYearMonthList.length - 1]
       }
       console.log(`月份: ${actForMoth}`);
       this.setState({actForMoth,})
     } */
    let actForMoth = '';

    if (this.props.user.currentUser !== undefined &&  this.props.user.currentUser?.dspYear === tYear.toString()) {
      actForMoth = nowMonth;
    } else {
      actForMoth = '12'
    }
    this.setState({actForMoth : actForMoth,});

    const pathname = window.location.pathname.substring(1,window.location.pathname.length);
    if ((this.props.global.selectMenu
      && this.props.global.selectMenu.length > 0)
      && (pathname === "formadvancedformSea" || pathname === "formadvancedformSeaRun" )) {
      this.props.global.selectMenu = this.props.global.homePageMenu;
      this.changeRightMenu(false,false,false,false,false,false);}
  }

  static getDerivedStateFromProps(nextProps: TableFormProps, prevState: TableDataStates) {
    if(nextProps.busUserCd !== prevState.busUserCd && prevState.initFlag){
      const selectUserName = nextProps;
      const { dispatch } = nextProps;
      const language = nextProps.user.currentUser?.dspLang;
      const actForYear = nextProps.user.currentUser?.dspYear;
      const setDate = '';
      let  {busUserCd} = nextProps;
      if(selectUserName.selectUserName.length !==0) {
        busUserCd = selectUserName.selectUserName.userCd;
      }
      const authOrgCds = nextProps.user.currentUser?.authOrgCds;
      const actForInfoSearchParam: FetchActForDataType = {
        language,
        actForYear,
        setDate,
        busUserCd,
        authOrgCds
      };
      const actForInfoSearchModel = JSON.stringify(actForInfoSearchParam);
      dispatch({
        type: 'searchActForData/searchActForData',
        payload: {
          actForInfoSearchModel,
        },
      });

      const loginUserCd=nextProps.user.currentUser?.userid;
      const dspYear = nextProps.user.currentUser?.dspYear;
      const dspCurrCd = nextProps.user.currentUser?.dspCurrCd;

      const userCd = [];
      userCd.push(busUserCd);

      const userOrgCd = null;
      const userOrgDiv = null
      const typeNm = null
      const typedDivi = null;
      const disMonth ="";

      const rankParam: HomeRankOrderModel = {loginUserCd,dspYear,dspCurrCd,language,userCd,userOrgCd,userOrgDiv,typeNm,typedDivi,disMonth,authOrgCds};
      const homeRankOrderModel = JSON.stringify(rankParam);

      dispatch({
        type: 'ActForecastData/fetchBudgetOrHistData',
        payload: {
          homeRankOrderModel,
        },
      });

      if(selectUserName.selectUserName.length !==0){
        return {
          busUserCd: selectUserName.selectUserName.userCd,
          busUserNm: selectUserName.selectUserName.userNm,
          initFlag: false,
          searchLoading: nextProps.searchActForData.setSearchLoading.searchLoading,
        }}
      return {
        busUserCd: nextProps.busUserCd,
        busUserNm: nextProps.busUserNm,
        initFlag: false,
        searchLoading: nextProps.searchActForData.setSearchLoading.searchLoading,
      }
    }
    return {
      searchLoading: nextProps.searchActForData.setSearchLoading.searchLoading,
    };
  }

  /**
   * タブの変更
   * @param activeKey 現在選択されているページ
   */
  tabsChange = (activeKey: string) => {

    this.setState({
      actForMoth : activeKey,
    })

  };

  /**
   * Business charge 变更方法
   * @param e: 变更后的值
   */
  BusUserChange = (e: String) => {
    if (e.toString() !== null) {
      let userList = this.props.searchUserLst;
      if(userList!==null && userList.length>0){
        userList = userList.filter((item) => item.userNm === e.toString());
        const { userCd } = userList[0];
        this.setState({
          busUserCd: userCd.toString(),
          busUserNm: e.toString(),
        });
        this.searchData(userCd.toString());
      }
    }
  };

  /**
   * 表单复选框
   */
    // @ts-ignore
    // eslint-disable-next-line consistent-return
  onChange = (checkedValues:any) =>  {
    const checkedList =  ['3','4','5','6','7','8','9','10','11','12']
    const checkedListAll =  [...checkedList].filter(x => [...checkedValues].every(y => y !== x));
    this.setState({
      indeterminate:!!checkedValues.length && checkedValues.length < checkedList.length,
      setCheckedList:checkedValues,
      checkAll:checkedValues.length === checkedList.length,
      checkedList: checkedListAll
    });
  }

  /**
   * 表单复选框全选
   */
  onCheckAllChange = (e: any) => {
    const checkedALL = e.target.checked ? ['3','4','5','6','7','8','9','10','11','12'] : [];
    this.setState({
      setCheckedList:checkedALL,
      indeterminate : false,
      checkAll:e.target.checked,
    });
    this.onChange(checkedALL)
  }

  /**
   * 点击search按钮事件
   */
  searchData = (busUserCd:any) => {
    const { dispatch } = this.props;
    if(this.state.busUserCd===undefined || this.state.busUserCd===null || this.state.busUserCd===''){
      message.info(formatMessage({ id: 'actualityForecastBottom.message.busUserNm' }));
      return;
    }

    const language = this.props.user.currentUser?.dspLang;
    const actForYear = this.props.user.currentUser?.dspYear;
    const authOrgCds = this.props.user.currentUser?.authOrgCds;
    const setDate = '';
    // const { busUserCd } = this.state;
    const actForInfoSearchParam: FetchActForDataType = {
      language,
      actForYear,
      setDate,
      busUserCd,
      authOrgCds,
    };
    const actForInfoSearchModel = JSON.stringify(actForInfoSearchParam);
    dispatch({
      type: 'searchActForData/searchActForData',
      payload: {
        actForInfoSearchModel,
      },
    });


    const loginUserCd=this.props.user.currentUser?.userid;
    const dspYear = this.props.user.currentUser?.dspYear;
    const dspCurrCd = this.props.user.currentUser?.dspCurrCd;

    const userCd = [];
    userCd.push(busUserCd);

    const userOrgCd = null;
    const userOrgDiv = null
    const typeNm = null
    const typedDivi = null;
    const disMonth ="";

    const rankParam: HomeRankOrderModel = {loginUserCd,dspYear,dspCurrCd,language,userCd,userOrgCd,userOrgDiv,typeNm,typedDivi,disMonth,authOrgCds};
    const homeRankOrderModel = JSON.stringify(rankParam);

    dispatch({
      type: 'ActForecastData/fetchBudgetOrHistData',
      payload: {
        homeRankOrderModel,
      },
    });
  };

  /**
   * 点击setting按钮事件
   */
  changeReadState = (payload: boolean): void => {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        // add Org
        type: 'searchActForData/changeSelectCollapseOrg',
        payload
      });
      const loginUserCd=this.props.user.currentUser?.userid;
      const dspYear = this.props.user.currentUser?.dspYear;
      const dspCurrCd = this.props.user.currentUser?.dspCurrCd;
      const language = this.props.user.currentUser?.dspLang;

      const userCd = [];
      userCd.push(this.state.busUserCd);

      const userOrgCd = null;
      const userOrgDiv = null
      const typeNm = null
      const typedDivi = null;
      const disMonth ="";
      const authOrgCds = this.props.user.currentUser?.authOrgCds;

      const rankParam: HomeRankOrderModel = {loginUserCd,dspYear,dspCurrCd,language,userCd,userOrgCd,userOrgDiv,typeNm,typedDivi,disMonth,authOrgCds};
      const homeRankOrderModel = JSON.stringify(rankParam);

      dispatch({
        type: 'ActForecastData/fetchBudgetOrHistData',
        payload: {
          homeRankOrderModel,
        },
      });
    }
  };
  onCstmrNmEndUserNmClick= async (index: number,record:any,isEndUser:boolean)=>{

    const { dispatch } = this.props;

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

  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleCancel = (e: any) => {
    // @ts-ignore
    this.setState({
      visible: false,
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  refresh = async () => {
    let list = [...this.state.columns];
    if (this.state.checkedList !== null || this.state.checkedList !== undefined || this.state.checkedList !== [] || this.state.checkedList.length !== 0) {
      this.state.checkedList.forEach((item:any) => {
        list = list.filter((itemInfo)=>itemInfo.key !== item);
      });
    }
    this.state.columnsList = list;
    this.setState({
      visible: false,
    });
  }


  showModal = async () => {
    this.setState({
      visible: true
    });
  }

  render() {
    const {actForData} = this.props.searchActForData;
    const {visible,setCheckedList,indeterminate,checkAll}=this.state;
    let bottomTableData: any[] | undefined = [];
    let amountTitle;
    if (actForData !== undefined && actForData !== null && actForData.length > 0) {
      amountTitle = actForData[0].changedCntrcCurrNm;
      bottomTableData = actForData.filter((item) => item.actForMoth === this.state.actForMoth);
    }

    function formatNum(strNum: string | number | any[]) {
      if (typeof strNum !== "number" && strNum?.length <= 3) {
        return strNum;
      }
      if (!/^(\+|-)?(\d+)(\.\d+)?$/.test(strNum as string)) {
        return strNum;
      }
      const a = RegExp.$1;
      let b = RegExp.$2;
      const c = RegExp.$3;
      // @ts-ignore
      const re = new RegExp();
      // @ts-ignore
      re.compile("(\\d)(\\d{3})(,|$)");
      while (re.test(b)) {
        b = b.replace(re, "$1,$2$3");
      }
      return `${a}${b}${c}`;
    }

    const achCal = (params1: any, params2: any) => {
      let januaryAch = '';
      if (parseFloat(params2) > 0 && parseFloat(params1) === 0) {
        januaryAch += `100`;
      }
      if (parseFloat(params2) === 0 && parseFloat(params1) === 0) {
        januaryAch += `0`;
      }
      if (parseFloat(params1) !== 0) {
        januaryAch += (params2 / params1 * 100).toFixed(0);
      }
      return januaryAch;
    }

    const getUserOption = (list: UserType[]) => {
      if (!list || list.length < 1) {
        return (
          <Option key={0} value={0}>
            {formatMessage({id: 'common.message.noSelect'})}
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
    const {budgetOrHistDataList} = this.props;
    if (budgetOrHistDataList === null || budgetOrHistDataList === undefined || budgetOrHistDataList === [] || budgetOrHistDataList.length === 0) {
      return null;
    }
    const salesTitleY = `${formatMessage({id: "homepage.basic.Sales"})  }:`;
    // let effortTitle= formatMessage({ id: "homepage.basic.Effort" });
    const budgetTitle = `${formatMessage({id: "homepage.basic.BudgetTitle"})  }:`;
    const lineStyle = function (param1: any, param2: any, param3: any, param4: any) {
      const amountAch = achCal(param1, param3);
      const salesAch = achCal(param2, param4);
      // let amountColor = '#0000FF';
      // let salesColor = '#0000FF';
      const fontSizes = '18px';

      // if (parseFloat(amountAch) < 100) {
      //   amountColor = '#D7484C';
      // }
      //
      // if (parseFloat(salesAch) < 100) {
      //   salesColor = '#D7484C';
      // }

      return <Space size={20}>
        <p style={{
          color: '#000000',
          fontSize: fontSizes
        }}>{budgetTitle} {formatNum(param1)}({formatNum(param2.toFixed(2))}) </p>
        <p style={{
          color: '#000000',
          fontSize: fontSizes
        }}>{salesTitleY} {formatNum(param3)}({formatNum(param4.toFixed(2))})</p>
        <Space>
          <p style={{color: '#000000', fontSize: fontSizes}}>Ach%: {formatNum(amountAch)}({formatNum(salesAch)})</p>
        </Space>
      </Space>
    }
    let dateTitle ;

    if (this.state.actForMoth === '01'){
      dateTitle = () => <div>
        <p>
          <div
            style={{float: "left", marginTop: '10px' }}>{lineStyle(budgetOrHistDataList[0].month1, budgetOrHistDataList[0].effort1, budgetOrHistDataList[1].month1, budgetOrHistDataList[1].effort1)}</div>
        </p>
      </div>;
    }
    if (this.state.actForMoth === '02'){
      dateTitle = () => <div>
        <p>
          <div
            style={{float: "left", marginTop: '10px'}}>{lineStyle(budgetOrHistDataList[0].month2, budgetOrHistDataList[0].effort2, budgetOrHistDataList[1].month2, budgetOrHistDataList[1].effort2)}</div>
        </p>
      </div>;
    }
    if (this.state.actForMoth === '03'){
      dateTitle = () => <div>
        <p>
          <div
            style={{float: "left", marginTop: '10px'}}>{lineStyle(budgetOrHistDataList[0].month3, budgetOrHistDataList[0].effort3, budgetOrHistDataList[1].month3, budgetOrHistDataList[1].effort3)}</div>
        </p>
      </div>;
    }
    if (this.state.actForMoth === '04'){
      dateTitle = () => <div>
        <p>
          <div
            style={{float: "left", marginTop: '10px'}}>{lineStyle(budgetOrHistDataList[0].month4, budgetOrHistDataList[0].effort4, budgetOrHistDataList[1].month4, budgetOrHistDataList[1].effort4)}</div>
        </p>
      </div>;
    }
    if (this.state.actForMoth === '05'){
      dateTitle = () => <div>
        <p>
          <div
            style={{float: "left", marginTop: '10px'}}>{lineStyle(budgetOrHistDataList[0].month5, budgetOrHistDataList[0].effort5, budgetOrHistDataList[1].month5, budgetOrHistDataList[1].effort5)}</div>
        </p>
      </div>;
    }
    if (this.state.actForMoth === '06'){
      dateTitle = () => <div>
        <p>
          <div
            style={{float: "left", marginTop: '10px'}}>{lineStyle(budgetOrHistDataList[0].month6, budgetOrHistDataList[0].effort6, budgetOrHistDataList[1].month6, budgetOrHistDataList[1].effort6)}</div>
        </p>
      </div>;
    }
    if (this.state.actForMoth === '07'){
      dateTitle = () => <div>
        <p>
          <div
            style={{float: "left", marginTop: '10px'}}>{lineStyle(budgetOrHistDataList[0].month7, budgetOrHistDataList[0].effort7, budgetOrHistDataList[1].month7, budgetOrHistDataList[1].effort7)}</div>
        </p>
      </div>;
    }
    if (this.state.actForMoth === '08'){
      dateTitle = () => <div>
        <p>
          <div
            style={{float: "left", marginTop: '10px'}}>{lineStyle(budgetOrHistDataList[0].month8, budgetOrHistDataList[0].effort8, budgetOrHistDataList[1].month8, budgetOrHistDataList[1].effort8)}</div>
        </p>
      </div>;
    }
    if (this.state.actForMoth === '09'){
      dateTitle = () => <div>
        <p>
          <div
            style={{float: "left", marginTop: '10px'}}>{lineStyle(budgetOrHistDataList[0].month9, budgetOrHistDataList[0].effort9, budgetOrHistDataList[1].month9, budgetOrHistDataList[1].effort9)}</div>
        </p>
      </div>;
    }
    if (this.state.actForMoth === '10'){
      dateTitle = () => <div>
        <p>
          <div
            style={{float: "left", marginTop: '10px'}}>{lineStyle(budgetOrHistDataList[0].month10, budgetOrHistDataList[0].effort10, budgetOrHistDataList[1].month10, budgetOrHistDataList[1].effort10)}</div>
        </p>
      </div>;
    } if (this.state.actForMoth === '11'){
      dateTitle = () => <div>
        <p>
          <div
            style={{float: "left" , marginTop: '10px'}}>{lineStyle(budgetOrHistDataList[0].month11, budgetOrHistDataList[0].effort11, budgetOrHistDataList[1].month11, budgetOrHistDataList[1].effort11)}</div>
        </p>
      </div>;
    }  if (this.state.actForMoth === '12'){
      dateTitle = () => <div>
        <p>
          <div
            style={{float: "left" , marginTop: '10px'}}>{lineStyle(budgetOrHistDataList[0].month12, budgetOrHistDataList[0].effort12, budgetOrHistDataList[1].month12, budgetOrHistDataList[1].effort12)}</div>
        </p>
      </div>;
    }
    if(!this.state.actForMoth) {
      dateTitle = () => <div>
        <p>
          <div
            style={{float: "left" , marginTop: '10px'}}>{lineStyle(budgetOrHistDataList[0].month12, budgetOrHistDataList[0].effort12, budgetOrHistDataList[1].month12, budgetOrHistDataList[1].effort12)}</div>
        </p>
      </div>;
    }
    // 言語別-確率のHeight
    let screenHeight = window.screen.height - 468;
    if(localStorage.getItem('umi_locale') === 'en-US'){
      screenHeight = window.screen.height - 478;
    }
    console.log(`screenHeight: ${  screenHeight}`);
    return (
      <>
        <Spin spinning={this.state.searchLoading}>
          <Row style={{marginTop: '10px'}}>
            <Col span={13} offset={1}>
              <Space size={100} >
                <Space size={80}>
                  <Space size={10}>
                    {formatMessage({id: 'actualityForecastTop.tableHead.businessCharge'})}
                    <Select
                      className={styles.BusUserSelect}
                      defaultValue={this.state.busUserNm}
                      value={this.state.busUserNm}
                      // @ts-ignore
                      onSelect={(e) => this.BusUserChange(e)}
                    >
                      {getUserOption(this.props.searchUserLst)}
                    </Select>
                  </Space>
                </Space>
              </Space>
            </Col>
            <Col  offset={8} span={2} style={{marginTop: 'auto',marginBottom: 'auto', textAlign: 'center'}}>
              {/* <div style={{position: 'absolute',  top:5 , marginTop: 'auto',marginBottom: 'auto',textAlign: 'center'}}> */}
              <Button type="text" icon={<DoubleLeftOutlined />}  size = 'small'  style={{color: '#0000ff'}} onClick={() => {
                this.changeReadState( true);
              }}>
                <text style={{fontSize: '16px', textAlign: 'left'}}> {formatMessage({ id: 'common.basic.Total'})}</text>
              </Button>
              <RightContent amountTitle={amountTitle}/>
              {/* <br/> */}
              {/* </div> */}
            </Col>
          </Row>
          <br/>
          <div className={styles.divClass}>
            <Row>
              <Col span={14} offset={0}>
                <Tabs
                  type="card"
                  defaultActiveKey={this.state.actForMoth}
                  onChange={(activeKey) => this.tabsChange(activeKey)}
                >
                  <TabPane tab={formatMessage({ id: 'actualityForecastBottom.month.Jan' })} key="01"/>
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
              </Col>
              <Col offset={8} span={2} style={{marginTop: 'auto',marginBottom: 'auto', textAlign: 'center',paddingLeft:'30px'}}>
                {/*             <Row align="middle"> */}
                <Modal
                  className={classNames(styles.modalStyle)}
                  title= {formatMessage({ id: 'homepage.basic.SetDisplayitem' })}
                  visible={visible}
                  onCancel={this.handleCancel}
                  footer={[
                    <Button key="back"  type="primary" onClick={this.handleCancel}>{formatMessage({ id: 'homepage.basic.SetCancel' })} </Button>,
                    // eslint-disable-next-line react/jsx-no-bind
                    <Button key="submit" type="primary"  onClick={this.refresh}>{formatMessage({ id: 'homepage.basic.SetRefresh' })}
                    </Button>]}
                >
                  <div style={{padding: '0px 0px 8px 0px'}}>
                    <Checkbox   indeterminate={indeterminate} onChange={(e) => this.onCheckAllChange(e)} checked={checkAll} >
                      {formatMessage({ id: 'actualityForecastBottom.modeCheckAll.checkbox'})}
                    </Checkbox>
                  </div>
                  <Checkbox.Group style={{margin:'5px 0px'}} options={this.state.transSourceData}  value={setCheckedList}   onChange={(e) => this.onChange(e)} />
                </Modal>
                <img  style={{fontSize: '20px', color: '#002582',cursor:"pointer" }} src={setting} alt="" data-tip={formatMessage({id: 'homepage.basic.SetDisplayitem'})} data-place="bottom"
                      data-type='light' data-class={styles.Suspensionframe2}  onClick={this.showModal}/>
                <ReactTooltip />
                {/* </Row> */}
              </Col>
            </Row>

            <Table
              size={'small'}
              className={styles.searAct}
              // @ts-ignore
              columns={this.state.columnsList}
              dataSource={bottomTableData}
              pagination={false}
              scroll={{ x:'max-content' , y: `${screenHeight.toString()}px` }}
            />
            <div className={styles.CardBody}>
              <Card title={dateTitle()} bordered/>
            </div>
          </div>
        </Spin>

        {/* <div> */}
        {/*  <Affix offsetTop={40} style={{position: 'absolute', top: 40, left: '95%'}}> */}
        {/* eslint-disable-next-line react/jsx-no-undef */}
        {/* <Tooltip title = {formatMessage({ id: 'app.common.Total'})} > */}
        {/* eslint-disable-next-line react/jsx-no-undef */}
        {/* <Button type="primary" shape="circle"  size = "large" onClick={() => { */}
        {/*  this.changeReadState( true); */}
        {/* }}> */}
        {/*  <img alt="calculate"  height = '40px' width = '40px' data-tip={formatMessage({ id: 'app.common.Total' })}  data-place = "bottom" data-type='light' data-class={styles.Suspensionframe1} className={styles.logo} src={calculate} onClick={() => { */}
        {/*    this.changeReadState( true); */}
        {/*  }}/> */}
        {/*  <ReactTooltip /> */}
        {/* </Button> */}
        {/* eslint-disable-next-line react/jsx-no-undef */}
        {/* <Link href="#" onClick={() => { */}
        {/*  this.changeReadState(true); */}
        {/* }}> */}
        {/*  <DoubleLeftOutlined/>{formatMessage({ id: 'common.basic.Total'})} */}
        {/* </Link> */}

        {/* </Tooltip> */}
        {/* </Affix> */}
        {/*  <RightContent amountTitle={amountTitle}/> */}
        {/* </div> */}
        {/* case Ach */}

        <ActualityForecastMonthSummary
          cstmrCd = {this.state.summaryCstmrCd}
          cstmrNm = {this.state.summaryCstmrNm}
          endUserCd = {this.state.summaryEndUserCd}
          endUserNm = {this.state.summaryEndUserNm}
        />
        <Modal
          className={classNames(styles.modalStyleComp)}
          visible={this.state.caseAchVisible === true}
          centered={true}
          onCancel={this.closeCaseAch}
          footer={null}
          title={this.state.cseeAchTitle}
          maskClosable={false}
        >
          <CaseAch dataSource1={this.props.searchActForData.compareData}  amountTitle={amountTitle}/>
        </Modal>
        <BackTop>
          <div className={styles.TopStyles}>↑</div>
        </BackTop>
      </>
    );
  }
}

export default connect(
  ({ ActForecastData,
     searchActForData,
     user,
     global,}:
     { ActForecastData:ActForecastTopData,
       searchActForData: ActForecastData;
        user: ConnectState,
       global:ConnectState }) => ({
    searchActForData,
    user,
    global,
    selectUserName:global.selectUserName,
    budgetOrHistDataList:ActForecastData.budgetOrHistDataList,
    getMonthNo: ActForecastData.getMonthNo,
    busActHead:ActForecastData.busActHead,
  }),
  // @ts-ignore
)(SearchActualityForecast);
