import {Button, DatePicker, Form, Layout, Menu, Select, Tabs, Row, Col, AutoComplete, Spin, Modal,} from 'antd';
import React, {Component, useState} from 'react';
import { connect, Dispatch, FormattedMessage } from 'umi';
import {
  BusActData,
  MessageType,
  DBusActHeadDataType,
  BusActHedDtlDataType, OptionType
} from '@/pages/BusinessActivities/data';
import { formatMessage } from '@@/plugin-locale/localeExports';
// @ts-ignore
import {ConnectState, GlobalModelState, UserModelState} from "@/models/connect";
import SubMenu from "antd/es/menu/SubMenu";
import  BusinesActivitieContent from '@/pages/BusinessActivities/components/BusinesActivitieContent/index'
import {UserType} from "@/pages/FormAdvancedForm/components/SearchRunningCases/data";
import Sider from "antd/es/layout/Sider";
import {Content} from "antd/es/layout/layout";
import moment from "moment";
import { HttpUrlStrUplod } from '@/utils/request';
import classNames from "classnames";
import {CurrentUser, MenuInfo} from "@/models/user";
import {SelectMenuItem, SelectUserNmItem} from "@/models/global";
import EditBusinesActivitie from './components/EditBusinesActivitie';
import NewBusinesActivitie from './components/NewBusinesActivitie';
import styles from './index.less';
import {ExclamationCircleOutlined} from "@ant-design/icons/lib";
import {BusActHead} from "@/pages/FormAdvancedForm/components/SearchActualityForecast/data";
import {FetchCaseType} from "@/pages/FormAdvancedForm/data";
import {history} from "@@/core/history";

const { TabPane } = Tabs;

let selectUserCdListInit: (string | undefined)[] | null | undefined = [];
let caseSelectUserCdListInit: (string | undefined)[] | null | undefined = [];
interface BusinessActivitiesProps {
  dispatch: Dispatch;
  BusinessActivities: BusActData;
  user: UserModelState;
  global: GlobalModelState;
  selectUserName:GlobalModelState[];
  visible:boolean;
}
type AccountSettingsStateKeys = 'EditActivities'| 'SearchActivities' | 'SearchCase';

interface BusinessActivitiesDataState {
  menuSearchMap: {
    [key: string]: React.ReactNode;
  };
  selectKey: AccountSettingsStateKeys;

  actForYear: string;
  actForMoth: string;
  language: string;
  userOrgCd: string;

  runYear: string;
  loginUser: string;
  loginUserNm: string;
  messageData: MessageType;
  authOrgCds:string[];
  userCdList:string[];
  orgIdList:string[];// 获取組織ID
  cstmrNm:string;
  caseNm:string;
  selectUserCdList:string[];
  fromDate:string;
  toDate:string;
  businessActivities:any;
  bBusActHeadDataList:any;
  editDBusActHeadDataList:any;
  caseCstmrNm:string;
  caseCaseNm:string;
  caseSelectUserCdList:string[];
  tabSelectKey:string;
  businessActivityDtlList:any;
  activeKey:string;
  newActiveKey:number;
  searchLoading:boolean;
  userOrgInfo:CurrentUser;
  caseStaff:string;
}

class Index extends Component<BusinessActivitiesProps, BusinessActivitiesDataState> {
  main: HTMLDivElement | undefined = undefined;

  reqRef: number = 0;

  timeoutId: number = 0;

  private renderChildren: (() => null | any) | undefined;

  constructor(props: BusinessActivitiesProps) {
    super(props);
    const menuSearchMap = {
      SearchActivities: (
        <FormattedMessage
          id="SearchActivities"
          defaultMessage={formatMessage({ id: 'businessactivities.index.Search.activities' })}
        />
      ),
      SearchCase: (
        <FormattedMessage
          id="SearchCase"
          defaultMessage={formatMessage({ id: 'common.business.activities.case' })}
        />
      ),
    };

    let submenu = this.props.global.busActHead;
    let cstmrNm = "";
    let caseNm = "";
    let fromDate = moment(this.props.user.currentUser?.dspYear).startOf('year').format("YYYY-MM-DD");
    let toDate = moment(this.props.user.currentUser?.dspYear).endOf('year').format("YYYY-MM-DD");
    // @ts-ignore
    this.state = {
      visible:true,
      menuSearchMap,
      selectKey: '',
      // @ts-ignore
      actForYear: this.props.user.currentUser?.dspYear,
      // @ts-ignore
      language: this.props.user.currentUser?.dspLang,
      // @ts-ignore
      userOrgCd: this.props.user.currentUser?.authOrgCds,
      // @ts-ignore
      loginUser: this.props.user.currentUser?.userid,
      // @ts-ignore
      loginUserNm: this.props.user.currentUser?.name,
      // @ts-ignore
      authOrgCds: this.props.user.currentUser?.authOrgCds,
      userCdList: [],
      orgIdList: [],// 获取組織ID
      messageData: {
        data: '',
        errcode: '',
        message: '',
      },
      cstmrNm: "",
      caseNm: "",
      fromDate: fromDate,
      toDate: toDate,
      selectUserCdList: [],
      caseCstmrNm: cstmrNm,
      caseCaseNm: caseNm,
      caseSelectUserCdList: [],
      tabSelectKey: "",
      activeKey: "",
      newActiveKey: 0,
      showUplodFiles: [],
      uplodFiles: [],
      searchLoading: false,
      userOrgInfo: {
        avatar:"",
        name:"",
        title:"",
        group:"",
        signature:"",
        tags:[],
        userid:"",
        unreadCount:0,
        access_token:"",
        dspCurrCd:"",
        userDiv:"",
        dspLang:"",
        dspYear:"",
        authOrgCds:"",
        dspUserOrgCd:"",
        orgVos:[],
        orgGroupId:"",
        inputUserCds:"",
        caseStaff:""}
    }
  }

  // 在渲染前调用,在客户端也在服务端。
  // componentWillMount(){
  //
  // }
  static async getDerivedStateFromProps(nextProps: BusinessActivitiesProps, prevState: BusinessActivitiesDataState) {
    const {userOrgInfo} = nextProps.BusinessActivities;
    if ((userOrgInfo !== null && undefined !== userOrgInfo && userOrgInfo?.userDiv !== null
      && undefined !== userOrgInfo?.userDiv && userOrgInfo?.userDiv === "1")
      || (userOrgInfo !== null && undefined !== userOrgInfo && userOrgInfo?.userDiv !== null
        && undefined !== userOrgInfo?.userDiv && userOrgInfo?.userDiv === "0"
        && undefined !== userOrgInfo?.inputUserCds && userOrgInfo?.inputUserCds !== "")) {

      if(userOrgInfo !== prevState.userOrgInfo){
        if (nextProps.BusinessActivities.userOrgInfo?.userid !== undefined) {
          const userCdList = nextProps.BusinessActivities.userOrgInfo?.userid.split(",");
          const {dispatch} = nextProps;
          const actForYear = nextProps.user.currentUser?.dspYear;

          // 获取組織ID
          const orgIdList:any[]=[];
          if ( nextProps.BusinessActivities.userOrgInfo?.authOrgCds === null
            || undefined === nextProps.BusinessActivities.userOrgInfo?.authOrgCds
            || nextProps.BusinessActivities.userOrgInfo?.authOrgCds === ""){
            return ;
          }
          const authOrgCds =  nextProps.BusinessActivities.userOrgInfo?.authOrgCds;

          if ( nextProps.BusinessActivities.userOrgInfo?.orgVos === null
            || undefined === nextProps.BusinessActivities.userOrgInfo?.orgVos
            || nextProps.BusinessActivities.userOrgInfo?.orgVos.length<=0){
            return ;
          }
          const orgVos = nextProps.BusinessActivities.userOrgInfo?.orgVos;
          // @ts-ignore
          authOrgCds.split(",").some((authOrgCd)=>{
            // @ts-ignore
            orgVos.filter(item => {
              if (authOrgCd.indexOf("-") === 1){
                // @ts-ignore
                if (item.orgCd.length > 5){
                  // @ts-ignore
                  return item.levels === 3 && authOrgCd === item.orgCd.substring(0,5)
                }
              }else if (authOrgCd.indexOf("-") > 1){
                // @ts-ignore
                if (item.orgCd.length === 8){
                  // @ts-ignore
                  return item.levels === 3 && authOrgCd.substring(0,8) === item.orgCd
                }
              }else{
                // @ts-ignore
                return  item.levels === 3  && authOrgCd === item.orgCd
              }
            }).map((item: { orgId: any; }) => {
              // @ts-ignore
              orgIdList.push(item.orgId);
            });
          });

          const inputUserList = userOrgInfo?.inputUserCds.split(",");
          // 営業担当リスト取得
          await dispatch({
            type: 'BusinessActivities/fetchInputUserList',
            payload: {userCdList: inputUserList, displayYear: actForYear},
          });

          const language = nextProps.user.currentUser?.dspLang;
          const caseYear = nextProps.user.currentUser?.dspYear;
          const orgGroupId = nextProps.user.currentUser?.orgGroupId;
          const inputUserCd = nextProps.user.currentUser?.inputUserCds;
          const authOrgCd = nextProps.user.currentUser?.authOrgCds;
          const caseNm = '';
          const caseParam: FetchCaseType = {language, caseYear, orgGroupId, authOrgCd, inputUserCd, caseNm};

          const caseInfoModel = JSON.stringify(caseParam);

          // 営業担当リスト取得
          await dispatch({
            type: 'BusinessActivities/fetchEndUserList',
            // payload: {userCdList, userOrgCdList: orgIdList},
            payload:{ caseInfoModel},
          });


          // 営業担当リスト取得
          await dispatch({
            type: 'BusinessActivities/fetchAllEndUserList',
            payload:{ caseInfoModel},
          });

          return {
            userOrgInfo: nextProps.BusinessActivities.userOrgInfo,
          }
        }
      }
    }
    return null;
  }


  // render之后并不会立即调用，而是所有的子组件都render完之后才可以调用
  async componentDidMount() {
    this.reqRef = requestAnimationFrame(() => {
      this.businessActivitiesInit();


    });

  }

  // ページの先頭にあるメニューが表示されますか
  // @ts-ignore
  changeBaseMenuShowState = (payload: boolean): void => {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'global/displayBaseMenuFlag',
        payload
      });
    }
  };

  businessActivitiesInit= async()=>{

    const { dispatch,selectUserName,BusinessActivities} = this.props;
    // let userCd;
    // if(selectUserName !== null && selectUserName.length !==0) {
    //   userCd = selectUserName.userCd;
    // }else{
    //   userCd=this.props.user.currentUser?.userid;
    //   // userCd = this.props.BusinessActivities.userList[0].userCd;
    // }

    let userCd = this.props.user.currentUser?.userid;
    await dispatch({
      type: 'BusinessActivities/fetchUserOrgInfo',
      payload: userCd,
    });

    console.log(this.props.BusinessActivities.userOrgInfo)

    // 获取当前用户下的所有营业者

    if (this.props.BusinessActivities.userOrgInfo === null
      || undefined === this.props.BusinessActivities.userOrgInfo
      || this.props.BusinessActivities.userOrgInfo?.userid === null
      || undefined === this.props.BusinessActivities.userOrgInfo?.userid
      || this.props.BusinessActivities.userOrgInfo?.userid === ""){
      return ;
    }
    // @ts-ignore
    const userCdList = this.props.BusinessActivities.userOrgInfo?.userid.split(",");

    // 获取組織ID
    const orgIdList:any[]=[];
    if ( this.props.BusinessActivities.userOrgInfo?.authOrgCds === null
      || undefined === this.props.BusinessActivities.userOrgInfo?.authOrgCds
      || this.props.BusinessActivities.userOrgInfo?.authOrgCds === ""){
      return ;
    }
    const authOrgCds =  this.props.BusinessActivities.userOrgInfo?.authOrgCds;

    if ( this.props.BusinessActivities.userOrgInfo?.orgVos === null
      || undefined === this.props.BusinessActivities.userOrgInfo?.orgVos
      || this.props.BusinessActivities.userOrgInfo?.orgVos.length<=0){
      return ;
    }
    const orgVos = this.props.BusinessActivities.userOrgInfo?.orgVos;
    // @ts-ignore
    authOrgCds.split(",").some((authOrgCd)=>{
      // @ts-ignore
      orgVos.filter(item => {
        if (authOrgCd.indexOf("-") === 1){
          // @ts-ignore
          if (item.orgCd.length > 5){
            // @ts-ignore
            return item.levels === 3 && authOrgCd === item.orgCd.substring(0,5)
          }
        }else if (authOrgCd.indexOf("-") > 1){
          // @ts-ignore
          if (item.orgCd.length === 8){
            // @ts-ignore
            return item.levels === 3 && authOrgCd.substring(0,8) === item.orgCd
          }
        }else{
          // @ts-ignore
          return  item.levels === 3  && authOrgCd === item.orgCd
        }
      }).map((item: { orgId: any; }) => {
        // @ts-ignore
        orgIdList.push(item.orgId);
      });
    });
    const {userOrgInfo} = this.props.BusinessActivities;
    userOrgInfo.userid = this.props.user.currentUser?.userid;
    this.setState({
      userCdList,
      orgIdList,
      userOrgInfo,
    })

    // await dispatch({
    //   type: 'BusinessActivities/fetchOrgGroupIds',
    //   payload: {userOrgCdList:orgIdList},
    // });
    console.log("****************************************************************");
    console.log(userCdList);
    console.log(orgIdList);
    console.log("****************************************************************");
    const {actForYear} = this.state

    const language = this.props.user.currentUser?.dspLang;
    const caseYear = this.props.user.currentUser?.dspYear;
    const orgGroupId = this.props.user.currentUser?.orgGroupId;
    const inputUserCd = this.props.user.currentUser?.inputUserCds;
    const authOrgCd = this.props.user.currentUser?.authOrgCds;
    const caseNm = '';
    const caseParam: FetchCaseType = {language, caseYear, orgGroupId, authOrgCd, inputUserCd, caseNm};

    const caseInfoModel = JSON.stringify(caseParam);

    // ustomer info 取得
    await dispatch({
      type: 'BusinessActivities/fetchCustomerList',
      // payload: { userCdList,userOrgCdList:orgIdList}
      payload:{ caseInfoModel},
    });

    await dispatch({
      type: 'BusinessActivities/fetchAllCustomerList',
      payload: { caseInfoModel},
    });

    // 検索エリアのcustomerリスト取得
    await dispatch({
      type: 'BusinessActivities/fetchSearchCustomerData',
      payload: { userCdList,userOrgCdList:orgIdList},
    });

    // case情報条件によってデータを取得
    await  dispatch({
      type: 'BusinessActivities/fetchCaseList',
      payload: { userCdList,userOrgCdList:orgIdList},
    });

    // 営業活動の項目取得
    await dispatch({
      type: 'BusinessActivities/fetchCaseListEditCreate',
      payload: { userCdList,userOrgCdList:orgIdList},
    });

    // 営業担当リスト取得
    await dispatch({
      type: 'BusinessActivities/fetchUserList',
      payload:{userCdList,displayYear:actForYear},
    });

    // 営業担当リスト取得
    await dispatch({
      type: 'BusinessActivities/fetchCodeValueList',
    });

    // 営業担当リスト取得
    await dispatch({
      type: 'BusinessActivities/fetchEndUserList',
      // payload: {userCdList, userOrgCdList: orgIdList},
      payload:{ caseInfoModel},
    });


    // 営業担当リスト取得
    await dispatch({
      type: 'BusinessActivities/fetchAllEndUserList',
      // payload: {userCdList, userOrgCdList: orgIdList},
      payload:{ caseInfoModel},
    });

    const inputUserList = userOrgInfo?.inputUserCds.split(",");
    // 営業担当リスト取得
    await dispatch({
      type: 'BusinessActivities/fetchInputUserList',
      payload: {userCdList: inputUserList, displayYear: actForYear},
    });

    // 営業者显示
   // let userCd = this.props.user.currentUser?.userid;
  /*  if (this.props.user.currentUser?.userDiv !== '1') {
      if (this.props.BusinessActivities.userList !== undefined && this.props.BusinessActivities.userList !== null && this.props.BusinessActivities.userList.length > 0) {
        userCd = this.props.BusinessActivities.userList[0].userCd;
      } else {
        userCd = '';
      }
    } */
  /*  if(selectUserName !== null && selectUserName.length !==0) {
      userCd = selectUserName.userCd;
    }else if (this.props.BusinessActivities.userList !== undefined && this.props.BusinessActivities.userList !== null && this.props.BusinessActivities.userList.length > 0) {
        userCd = this.props.BusinessActivities.userList[0].userCd;
      }else {
        userCd = '';
      }
*/
    //panx
    // 現在の営業者の権限を判断
    userCd = this.props.user.currentUser?.userid
    let userNm = this.props.user.currentUser?.name;
    const selectMenuList:any[]=[];
    // @ts-ignore
    if(global.selectMenu!==null && global.selectMenu !==0 && global.selectMenu !== undefined && global.selectMenu.length>0){
      global.selectMenu.some((item:any)=>{
        if(item.orgType ==="2"){
          selectMenuList.push(item)
          return;
        }
      })
      if(selectMenuList!==null && selectMenuList !==0 && selectMenuList.length>0){
        userCd=selectMenuList[0].userCd[0];
      }
    }
    if(selectUserName !== null && selectUserName.length !==0) {
      // @ts-ignore
      userCd = selectUserName.userCd;
    } else{
      if(BusinessActivities.userList !== undefined
        && BusinessActivities.userList !== null
        && BusinessActivities.userList.length > 0){
        const searchUserList = BusinessActivities.userList.filter((item)=>item.userCd===userCd);
        if(!(searchUserList!==undefined && searchUserList!==null && searchUserList.length>0)){
          userCd = BusinessActivities.userList[0].userCd;
        }
      }else{
        // searchBusUserCd = '';
        userCd = '';
      }
    }

    const userList: any[] = [];
    userList.push(userCd);
    this.setState({
      selectUserCdList: userList,
      caseSelectUserCdList: userList,
    })

    selectUserCdListInit = [];
    caseSelectUserCdListInit = [];
    selectUserCdListInit.push(userCd);
    caseSelectUserCdListInit.push(userCd);

    // // menu 显示
    // let busUserFlag: boolean;
    // if (this.props.user.currentUser?.userDiv === '0') {
    //   busUserFlag = false;
    // } else {
    //   busUserFlag = true;
    // }
    //
    // if (busUserFlag === true) {
    //   this.setState({
    //     selectKey: 'EditActivities',
    //   })
    // } else {
    //   this.setState({
    //     selectKey: 'SearchActivities',
    //   })
    // }

    // @ts-ignore
    const selectKey =this.props.location.query.id;
    const menuInfoVos = this.props.user.currentUser?.menuInfoVos ? this.props.user.currentUser?.menuInfoVos:[];
    if(selectKey ==="SearchActualityForecast" || selectKey ==="SearchRunningCases"
      ||selectKey ==="SearchActivities" || selectKey ==="SearchCase"){
      this.changeSelectMenuState([]);
      const defaultItmes:any = [];
      const defaultChildrenItmes: any[] = [];
      const selectItemData: SelectMenuItem[] = [];
      menuInfoVos.forEach((item:MenuInfo) => {
        if (item.menuCd === '101') {
          // eslint-disable-next-line block-scoped-var
          defaultItmes.push({key:"FormAdvancedForm1",path:"formadvancedform?id=SearchActualityForecast",name: item.menuNm})
        } else if(item.menuCd === '102') {
          // eslint-disable-next-line block-scoped-var
          defaultItmes.push({
            key: "FormAdvancedForm2",
            path: "formadvancedformSearchRun?id=SearchRunningCases",
            name: item.menuNm
          })
        } else if(item.menuCd === '103') {
          // eslint-disable-next-line block-scoped-var
          defaultItmes.push({
            key: "businessactivities1",
            path: "",
            name: item.menuNm
          })
        } else if(item.menuCd === '104') {
          // eslint-disable-next-line block-scoped-var
          defaultChildrenItmes.push({
            key: "businessactivities2",
            path: "businessactivities?id=SearchActivities",
            name: item.menuNm
          })
        } else if(item.menuCd === '105') {
          // eslint-disable-next-line block-scoped-var
          defaultChildrenItmes.push({
            key: "businessactivities3",
            path: "businessactivitiesSearchCase?id=SearchCase",
            name: item.menuNm
          })
        }
      });

      defaultItmes.forEach((item:any) => {
        // @ts-ignore
        const selectItem: SelectMenuItem = {
          selectedKeys:item.key,
          selectedIndex: item.key,
          selectedName: item.name,
          path:item.path,
          selectMenuData: [],
          selectChildrenMenuData:[],
        };
        if(item.key==='businessactivities1')
        {
          defaultChildrenItmes.forEach((item:any) => {
            const selectChildrenMenu: SelectMenuItem = {
              selectedKeys: item.key,
              selectedIndex: item.key,
              path:item.path,
              selectedName: item.name,
              selectMenuData: [],
            };
            selectItem.selectChildrenMenuData.push(selectChildrenMenu);
          })
        }
        selectItemData.push(selectItem);
      })
      this.changeSelectMenuState([]);
      this.changeSelectMenuState(selectItemData);
      this.changeRightMenu(true,false,false,false,false,false);
    }else if(selectKey ==="EditActualityForecast" || selectKey ==="EditRunningCases" || selectKey ==="EditActivities") {
      this.changeSelectMenuState([]);
      const defaultItmes: any = [];
      const defaultChildrenItmes: any[] = [];
      const selectItemData: SelectMenuItem[] = [];
      // eslint-disable-next-line block-scoped-var
      menuInfoVos.forEach((item:MenuInfo) => {
        if(item.menuCd === '201') {
          defaultItmes.push({
            key: "FormAdvancedForm3",
            path: "formadvancedformEditAct?id=EditActualityForecast",
            name: item.menuNm
          })
        } else if(item.menuCd === '202') {
          defaultItmes.push({
            key: "FormAdvancedForm4",
            path: "formadvancedformEditRun?id=EditRunningCases",
            name: item.menuNm
          })
        } else if(item.menuCd === '203') {
          defaultItmes.push({
            key: "businessactivities4",
            path: "businessactivitiesEditAct?id=EditActivities",
            name: item.menuNm
          })
        }
      });
      defaultItmes.forEach((item: any) => {
        // @ts-ignore
        const selectItem: SelectMenuItem = {
          selectedKeys: item.key,
          selectedIndex: item.key,
          selectedName: item.name,
          path:item.path,
          selectMenuData: [],
          selectChildrenMenuData: [],
        };
        selectItemData.push(selectItem);
      })
      this.changeSelectMenuState([]);
      this.changeSelectMenuState(selectItemData);
      this.changeRightMenu(false,true,false,false,false,false);
    }
    this.changeBaseMenuShowState(true);
    this.setState({
      selectKey,
    })
    this.selectKey(selectKey);

  }

  // componentWillMount  每一个组件render之前立即调用；

  // 在组件从 DOM 中移除之前立刻被调用。
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'ActForecastData/clear',
    });
    cancelAnimationFrame(this.reqRef);
    clearTimeout(this.timeoutId);
  }

  selectKey = async (key: AccountSettingsStateKeys) => {
    const {dispatch,selectUserName,BusinessActivities,global} = this.props;
    const {userCdList, orgIdList, actForYear, selectKey, userOrgInfo} = this.state
    this.props.BusinessActivities.bBusActHeadDataList = [];
    this.props.BusinessActivities.editDBusActHeadDataList = [];
    this.props.BusinessActivities.businessActivitiesList = [];
    let submenu ={};
    if(this.props.location.state!==undefined && this.props.location.state!==null && this.props.location.state.length !== 0) {
      submenu = this.props.location.state.head;
    }
    let cstmrNm = "";
    let caseNm = "";
    let caseStaff = "";
    let fromDate = moment(this.props.user.currentUser?.dspYear).startOf('year').format("YYYY-MM-DD");
    let toDate = moment(this.props.user.currentUser?.dspYear).endOf('year').format("YYYY-MM-DD");
    if(submenu!==undefined && submenu!==null  && submenu.caseNm!==undefined  && submenu.size !== 0){
      caseNm = submenu.caseNm;
      cstmrNm = submenu.cstmrNm
      fromDate = submenu.caseCreatedDt;
      toDate = submenu.caseCreatedDt;
    }
    this.setState({
      businessActivities: [],
      bBusActHeadDataList: [],
      editDBusActHeadDataList: [],
      cstmrNm: "",
      caseNm: "",
      fromDate: fromDate,
      toDate: toDate,
      caseCstmrNm: cstmrNm,
      caseCaseNm: caseNm,
      // caseSelectUserCdList:[],
      caseStaff: caseStaff,
    });
    let userCd= "";
    //panx
    // 現在の営業者の権限を判断
     userCd = this.props.user.currentUser?.userid
    const selectMenuList:any[]=[];
    // @ts-ignore
    if(global.selectMenu!==null && global.selectMenu !==0 && global.selectMenu.length>0){
      global.selectMenu.some((item:any)=>{
        if(item.orgType ==="2"){
          selectMenuList.push(item)
          return;
        }
      })
      if(selectMenuList!==null && selectMenuList !==0 && selectMenuList.length>0){
        userCd=selectMenuList[0].userCd[0];
      }
    }
    if(selectUserName !== null && selectUserName.length !==0) {
      // @ts-ignore
      userCd = selectUserName.userCd;
    } else{
      if(BusinessActivities.userList !== undefined
        && BusinessActivities.userList !== null
        && BusinessActivities.userList.length > 0){
        const searchUserList = BusinessActivities.userList.filter((item)=>item.userCd===userCd);
        if(!(searchUserList!==undefined && searchUserList!==null && searchUserList.length>0)){
          userCd = BusinessActivities.userList[0].userCd;
        }
      }else{
        userCd = '';
      }
    }
/*
    if(selectUserName !== null && selectUserName.length !==0) {
      userCd = selectUserName.userCd;
    }else if (this.props.BusinessActivities.userList !== undefined && this.props.BusinessActivities.userList !== null && this.props.BusinessActivities.userList.length > 0) {
        userCd = this.props.BusinessActivities.userList[0].userCd;
      }else {
        userCd = '';
      }
*/
    const userList: any[] = [];
    userList.push(userCd);
    this.setState({
      selectUserCdList: userList,
      caseSelectUserCdList: userList,
    })

    selectUserCdListInit = [];
    caseSelectUserCdListInit = [];
    selectUserCdListInit.push(userCd);
    caseSelectUserCdListInit.push(userCd);
    switch (key) {
      case 'SearchActivities':
        if (key === 'SearchActivities') {
          this.onSearchActivitiesClick();
          break;
        }
        break;
      case 'SearchCase':
        if (key === 'SearchCase') {
          this.onSearchCaseActivitiesClick();
          break;
        }
        break;
      case 'EditActivities':

        if ((userOrgInfo !== null && undefined !== userOrgInfo && userOrgInfo?.userDiv !== null
          && undefined !== userOrgInfo?.userDiv && userOrgInfo?.userDiv === "1")
          || (userOrgInfo !== null && undefined !== userOrgInfo && userOrgInfo?.userDiv !== null
            && undefined !== userOrgInfo?.userDiv && userOrgInfo?.userDiv === "0"
            && undefined !== userOrgInfo?.inputUserCds && userOrgInfo?.inputUserCds !== "")
            || (userOrgInfo !== null && undefined !== userOrgInfo && userOrgInfo?.userDiv !== null
              && undefined !== userOrgInfo?.userDiv && userOrgInfo?.userDiv === "2")) {
          const inputUserList = userOrgInfo?.inputUserCds.split(",");
          // 営業担当リスト取得
          await dispatch({
            type: 'BusinessActivities/fetchInputUserList',
            payload: {userCdList: inputUserList, displayYear: actForYear},
          });
         // this.add('0')
        }

        const language = this.props.user.currentUser?.dspLang;
        const caseYear = this.props.user.currentUser?.dspYear;
        const orgGroupId = this.props.user.currentUser?.orgGroupId;
        const inputUserCd = this.props.user.currentUser?.inputUserCds;
        const authOrgCd = this.props.user.currentUser?.authOrgCds;
        const caseNm = '';
        const caseParam: FetchCaseType = {language, caseYear, orgGroupId, authOrgCd, inputUserCd, caseNm};

        const caseInfoModel = JSON.stringify(caseParam);

        // 営業担当リスト取得
        await dispatch({
          type: 'BusinessActivities/fetchEndUserList',
          // payload: {userCdList, userOrgCdList: orgIdList},
          payload:{ caseInfoModel},
        });

        // 営業担当リスト取得
        await dispatch({
          type: 'BusinessActivities/fetchAllEndUserList',
          payload:{ caseInfoModel},
        });

        if (key === 'EditActivities') {
          this.onSearchEditActivitiesClick();
          break;
        }
    }
    this.setState({
      selectKey: key,
    });
  };

  //  営業担当リスト取得（入力できる）
  getStaffOption = (list: UserType[]) => {
    if (!list || list.length < 1) {
      return (
        // @ts-ignore
        <Option key={0} value={0}>
          {formatMessage({ id: 'common.message.noSelect' })}
        </Option>
      );
    }
    // @ts-ignore
    const listBak = list.filter((item) => item.userNm !== null && item.userNm !== '');
    return listBak.map((item) => (
      // @ts-ignore
      <Option key={item.userCd} value={item.userNm}>
        {item.userNm}
      </Option>
    ));
  };

  /**
   *  Model 开始日变更
   * @param date moment类型日期
   * @param dateString string类型的日期
   */
    // @ts-ignore
  dataFromChange = (date: moment, dateString: string) => {
    // 仅可以输入当前年
    this.setState({
      // @ts-ignore
      fromDate: dateString,
    });
  };

  /**
   *  Model 终了日更
   * @param date moment类型日期
   * @param dateString string类型的日期
   */
    // @ts-ignore
  dataToChange = (date: moment, dateString: string) => {

    this.setState({
      // @ts-ignore
      toDate: dateString
    })
  }

  /**
   * Staff charge 变更方法
   * @param e: 变更后的值
   */
  onStaffChange = (value:string,e: { key: string; } | null | undefined)=>{
    console.log(e);
    const selectUserCdList = [];
    if (e === undefined || e !== null && e.key ==="") {
      this.props.BusinessActivities.userList.map((user: { userCd: any; })=>{
        selectUserCdList.push(user.userCd)
      })
    }else { // @ts-ignore
      if(e.key !=="") {
            // @ts-ignore
            selectUserCdList.push(e.key)
          }
    }
    console.log(selectUserCdList);
    this.setState({
      // @ts-ignore
      selectUserCdList
    })
  }

  /**
   * Customer charge 变更方法
   * @param value
   */
  onCustomerChange = (value:string)=>{
    console.log(value);
    if (value === null || value === undefined){
      value = "";
    }
    console.log(value);
    this.setState({
      // @ts-ignore
      cstmrNm: value
    })
  }

  /**
   * Case charge 变更方法
   * @param e: 变更后的值
   */
  onCaseChange = (value:string)=>{
    console.log(value);
    if (value === null || value === undefined){
      value = "";
    }
    console.log(value);
    this.setState({
      // @ts-ignore
      caseNm: value
    })
  }

  /**
   * Staff charge 变更方法
   * @param e: 变更后的值
   */
  onCaseStaffChange = (value:string,e: { key: string; } | null | undefined)=>{
    console.log(e);
    const selectUserCdList = [];
    let caseStaff = "";
    if (e === undefined || e !== null && e.key ==="") {
      this.props.BusinessActivities.userList.map((user: { userCd: any; })=>{
        selectUserCdList.push(user.userCd)
      })
    }else { // @ts-ignore
      if(e.key !=="") {
        // @ts-ignore
        selectUserCdList.push(e.key)
        // @ts-ignore
        caseStaff = e.value;
      }
    }
    console.log(selectUserCdList);
    this.setState({
      // @ts-ignore
      caseSelectUserCdList: selectUserCdList,
      caseStaff,
    })
  }

  /**
   * Customer charge 变更方法
   * @param value
   */
  onCaseCustomerChange = (value:string)=>{
    console.log(value);
    if (value === null || value === undefined){
      value = "";
    }
    console.log(value);
    this.setState({
      // @ts-ignore
      caseCstmrNm: value
    })
  }

  /**
   * Case charge 变更方法
   * @param e: 变更后的值
   */
  onCaseCaseChange = (value:string)=>{
    console.log(value);
    if (value === null || value === undefined){
      value = "";
    }
    console.log(value);
    this.setState({
      // @ts-ignore
      caseCaseNm: value
    })
  }

  onSearchActivitiesClick=async ()=>{
    const { dispatch } = this.props;
    const { language } = this.state;
    const {actForYear, selectUserCdList, cstmrNm, caseNm, fromDate, toDate} = this.state;
    let userCdList = selectUserCdList;
    if(this.props.global.inForceFlag){
      Modal.confirm({
        visible:this.state.visible,
        icon: <ExclamationCircleOutlined />,
        content:formatMessage({id: 'common.business.activities.content'}),
        closable: true,
        centered: true,
        okText: formatMessage({id: 'common.business.activities.content.ok'}),
        cancelText: formatMessage({id: 'common.business.activities.content.onCancel'}),
        // 这里注意要用箭头函数, 否则this不生效
        onOk: async () => {


          await dispatch({
            type: 'global/inForceFlag',
            payload: false
          });
          await dispatch({
            type: 'global/dialogBoxFlag',
            payload: false
          });
          await dispatch({
            type: 'global/disableButton',
            payload: false
          });
          await dispatch({
            type: 'global/newCloseFlag',
            payload: false
          });
          await dispatch({
            type: 'global/editorMarkDownFlag',
            payload: false
          });
          await dispatch({
            type: 'global/uploadFileFlag',
            payload: false
          });
          this.setState({
            searchLoading: true,
            visible: false,
          });
          if (userCdList === null || undefined === userCdList || userCdList.length <= 0) {
            if (selectUserCdListInit !== undefined && selectUserCdListInit !== null && selectUserCdListInit.length > 0) {
              // @ts-ignore
              userCdList = selectUserCdListInit;
            } else {
              userCdList = [];
              this.props.BusinessActivities.userList.map((user: { userCd: any; }) => {
                userCdList.push(user.userCd)
              })
            }
          }
          const dataParam: { dspYear: "", fromDate: ""; caseNm: string; cstmrNm: string; toDate: ""; language: string; userCdList: string[] }
            // @ts-ignore
            = {dspYear: actForYear, language, userCdList, cstmrNm, caseNm, fromDate, toDate};
          const searchModel = JSON.stringify(dataParam);
          console.log("onSearchActivitiesClick")
          console.log(dataParam)
          this.setState({
            businessActivities: [],
          });
          this.props.BusinessActivities.businessActivitiesList = [];
          await dispatch({
            type: 'BusinessActivities/fetchBusinessActivitiesList',
            payload: searchModel
          });
          if (this.props.BusinessActivities.businessActivitiesList !== null
            && undefined !== this.props.BusinessActivities.businessActivitiesList
            && this.props.BusinessActivities.businessActivitiesList.length > 0) {
            this.props.BusinessActivities.businessActivitiesList.forEach((item) => {
              item.addFileUrl1 = item.addFileUrl1 === null || undefined === item.addFileUrl1 || item.addFileUrl1 === "" ? "" : HttpUrlStrUplod + item.addFileUrl1;
              item.addFileUrl2 = item.addFileUrl2 === null || undefined === item.addFileUrl2 || item.addFileUrl2 === "" ? "" : HttpUrlStrUplod + item.addFileUrl2;
              item.addFileUrl3 = item.addFileUrl3 === null || undefined === item.addFileUrl3 || item.addFileUrl3 === "" ? "" : HttpUrlStrUplod + item.addFileUrl3;
              item.addFileUrl4 = item.addFileUrl4 === null || undefined === item.addFileUrl4 || item.addFileUrl4 === "" ? "" : HttpUrlStrUplod + item.addFileUrl4;
              item.addFileUrl5 = item.addFileUrl5 === null || undefined === item.addFileUrl5 || item.addFileUrl5 === "" ? "" : HttpUrlStrUplod + item.addFileUrl5;
              item.addFileUrl6 = item.addFileUrl6 === null || undefined === item.addFileUrl6 || item.addFileUrl6 === "" ? "" : HttpUrlStrUplod + item.addFileUrl6;
              item.addFileUrl7 = item.addFileUrl7 === null || undefined === item.addFileUrl7 || item.addFileUrl7 === "" ? "" : HttpUrlStrUplod + item.addFileUrl7;
              item.addFileUrl8 = item.addFileUrl8 === null || undefined === item.addFileUrl8 || item.addFileUrl8 === "" ? "" : HttpUrlStrUplod + item.addFileUrl8;
              item.addFileUrl9 = item.addFileUrl9 === null || undefined === item.addFileUrl9 || item.addFileUrl9 === "" ? "" : HttpUrlStrUplod + item.addFileUrl9;
              item.addFileUrl10 = item.addFileUrl10 === null || undefined === item.addFileUrl10 || item.addFileUrl10 === "" ? "" : HttpUrlStrUplod + item.addFileUrl10;
            })
            this.setState({
              businessActivities: this.props.BusinessActivities.businessActivitiesList,
            });
            this.setState({
              searchLoading: false
            });
          } else {
            this.setState({
              searchLoading: false
            });
          }
        },
        onCancel: () => {
          this.setState(
            {
              visible: false,
            }
          )
        }
      });
    }else {
      this.setState({
        searchLoading:true
      });
      if(userCdList === null || undefined === userCdList || userCdList.length<=0){
        if(selectUserCdListInit !== undefined && selectUserCdListInit !== null && selectUserCdListInit.length>0){
          // @ts-ignore
          userCdList = selectUserCdListInit;
        }else{
          userCdList = [];
          this.props.BusinessActivities.userList.map((user: { userCd: any; })=>{
            userCdList.push(user.userCd)
          })
        }
      }
      const dataParam:{ dspYear:"", fromDate: ""; caseNm: string; cstmrNm: string; toDate: ""; language: string; userCdList: string[] }
        // @ts-ignore
        = { dspYear:actForYear, language, userCdList,cstmrNm,caseNm,fromDate,toDate};
      const searchModel = JSON.stringify(dataParam);
      console.log("onSearchActivitiesClick")
      console.log(dataParam)
      this.setState({
        businessActivities:[],
      });
      this.props.BusinessActivities.businessActivitiesList = [];
      await dispatch({
        type: 'BusinessActivities/fetchBusinessActivitiesList',
        payload:searchModel
      });
      if(this.props.BusinessActivities.businessActivitiesList !== null
        && undefined !== this.props.BusinessActivities.businessActivitiesList
        && this.props.BusinessActivities.businessActivitiesList.length>0){
        this.props.BusinessActivities.businessActivitiesList.forEach((item)=>{
          item.addFileUrl1 = item.addFileUrl1===null || undefined ===item.addFileUrl1 || item.addFileUrl1===""?"":HttpUrlStrUplod+item.addFileUrl1;
          item.addFileUrl2 = item.addFileUrl2===null || undefined ===item.addFileUrl2 || item.addFileUrl2===""?"":HttpUrlStrUplod+item.addFileUrl2;
          item.addFileUrl3 = item.addFileUrl3===null || undefined ===item.addFileUrl3 || item.addFileUrl3===""?"":HttpUrlStrUplod+item.addFileUrl3;
          item.addFileUrl4 = item.addFileUrl4===null || undefined ===item.addFileUrl4 || item.addFileUrl4===""?"":HttpUrlStrUplod+item.addFileUrl4;
          item.addFileUrl5 = item.addFileUrl5===null || undefined ===item.addFileUrl5 || item.addFileUrl5===""?"":HttpUrlStrUplod+item.addFileUrl5;
          item.addFileUrl6 = item.addFileUrl6===null || undefined ===item.addFileUrl6 || item.addFileUrl6===""?"":HttpUrlStrUplod+item.addFileUrl6;
          item.addFileUrl7 = item.addFileUrl7===null || undefined ===item.addFileUrl7 || item.addFileUrl7===""?"":HttpUrlStrUplod+item.addFileUrl7;
          item.addFileUrl8 = item.addFileUrl8===null || undefined ===item.addFileUrl8 || item.addFileUrl8===""?"":HttpUrlStrUplod+item.addFileUrl8;
          item.addFileUrl9 = item.addFileUrl9===null || undefined ===item.addFileUrl9 || item.addFileUrl9===""?"":HttpUrlStrUplod+item.addFileUrl9;
          item.addFileUrl10 = item.addFileUrl10===null || undefined ===item.addFileUrl10 || item.addFileUrl10===""?"":HttpUrlStrUplod+item.addFileUrl10;
        })
        this.setState({
          businessActivities:this.props.BusinessActivities.businessActivitiesList,
        });
        this.setState({
          searchLoading:false
        });
      }else {
        this.setState({
          searchLoading:false
        });
      }
      dispatch({
        type: 'global/inForceFlag',
        payload: false
      });
      dispatch({
        type: 'global/dialogBoxFlag',
        payload: false
      });
      dispatch({
        type: 'global/disableButton',
        payload: false
      });
      dispatch({
        type: 'global/newCloseFlag',
        payload: false
      });
    }
  }

  onSearchCaseActivitiesClick=async ()=>{
    const { dispatch } = this.props;
    const { actForYear,caseSelectUserCdList,caseCstmrNm,caseCaseNm,fromDate,toDate} = this.state;
    if(this.props.global.inForceFlag){
      Modal.confirm({
        visible:this.state.visible,
        icon: <ExclamationCircleOutlined />,
        content:formatMessage({id: 'common.business.activities.content'}),
        closable: true,
        centered: true,
        okText: formatMessage({id: 'common.business.activities.content.ok'}),
        cancelText: formatMessage({id: 'common.business.activities.content.onCancel'}),
        // 这里注意要用箭头函数, 否则this不生效
        onOk: async () => {
          await dispatch({
            type: 'global/inForceFlag',
            payload: false
          });
          await dispatch({
            type: 'global/dialogBoxFlag',
            payload: false
          });
          await dispatch({
            type: 'global/disableButton',
            payload: false
          });
          await dispatch({
            type: 'global/newCloseFlag',
            payload: false
          });
          await dispatch({
            type: 'global/editorMarkDownFlag',
            payload: false
          });
          await dispatch({
            type: 'global/uploadFileFlag',
            payload: false
          });

          this.setState({
            tabSelectKey: "",
            activeKey:"",
            visible: false,
          });
          this.setState({
            searchLoading:true
          });
          let userCdList = caseSelectUserCdList;
          if(userCdList === null || undefined === userCdList || userCdList.length<=0){
            if(caseSelectUserCdListInit !== undefined && caseSelectUserCdListInit !== null && caseSelectUserCdListInit.length>0){
              // @ts-ignore
              userCdList = caseSelectUserCdListInit;
            }else{
              userCdList = [];
              this.props.BusinessActivities.userList.map((user: { userCd: any; })=>{
                userCdList.push(user.userCd)
              })
            }
          }
          const dataParam:{fromDate: string; toDate: string; dspYear:string,caseNm: string; cstmrNm: string; userCdList: string[] }
            = {dspYear:actForYear, userCdList,cstmrNm:caseCstmrNm,caseNm:caseCaseNm,fromDate,toDate};
          const searchModel = JSON.stringify(dataParam);
          console.log("onSearchCaseActivitiesClick")
          console.log(dataParam)
          await dispatch({
            type: 'BusinessActivities/fetchDBusActHeadList',
            payload:searchModel
          });
          const headDataList = this.props.BusinessActivities.bBusActHeadDataList
          let busActId = "";
          if (this.props.BusinessActivities.bBusActHeadDataList !== null &&
            undefined != this.props.BusinessActivities.bBusActHeadDataList &&
            this.props.BusinessActivities.bBusActHeadDataList.length > 0){
            busActId = this.props.BusinessActivities.bBusActHeadDataList[0].busActId;
          }
          await this.getbusinessActivityDtlList(headDataList,busActId,"case");
          this.setState({
            searchLoading:false
          });
        },
        onCancel: () => {
          this.setState(
            {
              visible: false,
            }
          )
        }
      });
    }else {
    this.setState({
      tabSelectKey: "",
      activeKey:""
    });
    this.setState({
      searchLoading:true
    });
    let userCdList = caseSelectUserCdList;
    if(userCdList === null || undefined === userCdList || userCdList.length<=0){
      if(caseSelectUserCdListInit !== undefined && caseSelectUserCdListInit !== null && caseSelectUserCdListInit.length>0){
        // @ts-ignore
        userCdList = caseSelectUserCdListInit;
      }else{
        userCdList = [];
        this.props.BusinessActivities.userList.map((user: { userCd: any; })=>{
          userCdList.push(user.userCd)
        })
      }
    }

    const dataParam:{fromDate: string; toDate: string; dspYear:string,caseNm: string; cstmrNm: string; userCdList: string[] }
    = {dspYear:actForYear, userCdList,cstmrNm:caseCstmrNm,caseNm:caseCaseNm,fromDate,toDate};
    const searchModel = JSON.stringify(dataParam);
    console.log("onSearchCaseActivitiesClick")
    console.log(dataParam)
      await dispatch({
        type: 'global/inForceFlag',
        payload: false
      });
      await dispatch({
        type: 'global/dialogBoxFlag',
        payload: false
      });
      await dispatch({
        type: 'global/disableButton',
        payload: false
      });
      await dispatch({
        type: 'global/newCloseFlag',
        payload: false
      });

    await dispatch({
      type: 'BusinessActivities/fetchDBusActHeadList',
      payload:searchModel
    });
    const headDataList = this.props.BusinessActivities.bBusActHeadDataList
    let busActId = "";
    if (this.props.BusinessActivities.bBusActHeadDataList !== null &&
      undefined != this.props.BusinessActivities.bBusActHeadDataList &&
      this.props.BusinessActivities.bBusActHeadDataList.length > 0){
      busActId = this.props.BusinessActivities.bBusActHeadDataList[0].busActId;
    }


    await this.getbusinessActivityDtlList(headDataList,busActId,"case");
    this.setState({
      searchLoading:false
    });

    }
  }

  onSearchEditActivitiesClick=async ()=>{
    const { dispatch } = this.props;
    const { actForYear,caseSelectUserCdList,caseCstmrNm,caseCaseNm,fromDate,toDate,userOrgInfo} = this.state;
    let userCdList = caseSelectUserCdList;
    if(this.props.global.inForceFlag || !(this.props.global.uploadFileFlag===false && this.props.global.editorMarkDownFlag===false) ){
      Modal.confirm({
        visible:this.state.visible,
        icon: <ExclamationCircleOutlined />,
        content:formatMessage({id: 'common.business.activities.content'}),
        closable: true,
        centered: true,
        okText: formatMessage({id: 'common.business.activities.content.ok'}),
        cancelText: formatMessage({id: 'common.business.activities.content.onCancel'}),
        // 这里注意要用箭头函数, 否则this不生效
        onOk: async () => {
          await dispatch({
            type: 'global/inForceFlag',
            payload: false
          });
          await dispatch({
            type: 'global/dialogBoxFlag',
            payload: false
          });
          await dispatch({
            type: 'global/disableButton',
            payload: false
          });
          await dispatch({
            type: 'global/newCloseFlag',
            payload: false
          });
          await dispatch({
            type: 'global/editorMarkDownFlag',
            payload: false
          });
          await dispatch({
            type: 'global/uploadFileFlag',
            payload: false
          });
          await dispatch({
            type: 'global/editAddFlag',
            payload: false
          });
          await dispatch({
            type: 'global/saveButtonFlag',
            payload: false
          });

          this.setState({
            tabSelectKey: "",
            activeKey:"",
            searchLoading:true,
            visible: false,
          });
          if(userCdList === null || undefined === userCdList || userCdList.length<=0){
            if(caseSelectUserCdListInit !== undefined && caseSelectUserCdListInit !== null && caseSelectUserCdListInit.length>0){
              // @ts-ignore
              userCdList = caseSelectUserCdListInit;
            }else {
              userCdList = [];
              this.props.BusinessActivities.userList.map((user: { userCd: any; })=>{
                userCdList.push(user.userCd)
              })
            }
          }

          const dataParam:{ fromDate: string; toDate: string; dspYear:string,caseNm: string; cstmrNm: string; userCdList: string[] }
            = {dspYear:actForYear, userCdList,cstmrNm:caseCstmrNm,caseNm:caseCaseNm,fromDate,toDate};
          const searchModel = JSON.stringify(dataParam);
          console.log("onSearchEditActivitiesClick")
          console.log(dataParam)
          await dispatch({
            type: 'BusinessActivities/fetchEditDBusActHeadList',
            payload:searchModel
          });
          const headDataList = this.props.BusinessActivities.editDBusActHeadDataList
          let busActId = "";
          if (headDataList !== null &&
            undefined != headDataList &&
            headDataList.length > 0 &&
            headDataList[0] !== null &&
            undefined !== headDataList[0]){
            busActId = headDataList[0].busActId;
          }
          else {
            if ((userOrgInfo !== null && undefined !== userOrgInfo && userOrgInfo?.userDiv !== null
              && undefined !==  userOrgInfo?.userDiv && userOrgInfo?.userDiv === "1")
              ||  (userOrgInfo !== null && undefined !== userOrgInfo && userOrgInfo?.userDiv !== null
                && undefined !==  userOrgInfo?.userDiv && userOrgInfo?.userDiv === "0"
                && undefined !==  userOrgInfo?.inputUserCds &&  userOrgInfo?.inputUserCds !=="")){
              dispatch({
                type: 'global/inForceFlag',
                payload: false
              });
              dispatch({
                type: 'global/dialogBoxFlag',
                payload: false
              });
              dispatch({
                type: 'global/disableButton',
                payload: false
              });
              dispatch({
                type: 'global/newCloseFlag',
                payload: false
              });
              this.add('0')
            };
            this.setState({
              searchLoading:false,
              editDBusActHeadDataList:[],
            });
            return ;
          }
          await this.getbusinessActivityDtlList(headDataList,busActId,"edit");
          this.setState({
            searchLoading:false
          });
        },
        onCancel: () => {
          this.setState(
            {
              visible: false,
            }
          )
        }
      });
    }else{
      this.setState({
        tabSelectKey: "",
        activeKey:"",
        searchLoading:true
      });
      if(userCdList === null || undefined === userCdList || userCdList.length<=0){
        if(caseSelectUserCdListInit !== undefined && caseSelectUserCdListInit !== null && caseSelectUserCdListInit.length>0){
          // @ts-ignore
          userCdList = caseSelectUserCdListInit;
        }else {
          userCdList = [];
          this.props.BusinessActivities.userList.map((user: { userCd: any; })=>{
            userCdList.push(user.userCd)
          })
        }
      }
      // 検索画面から別ユーザと営業別々の場合
      let submenu ={};
      if(this.props.location.state!==undefined && this.props.location.state!==null && this.props.location.state.length !== 0) {
        submenu = this.props.location.state.head;
      }
      if(submenu!==undefined && submenu!==null  && submenu.caseNm!==undefined  && submenu.size !== 0){
        userCdList.push(submenu.busUserCd);
      }

      const dataParam:{ fromDate: string; toDate: string; dspYear:string,caseNm: string; cstmrNm: string; userCdList: string[] }
        = {dspYear:actForYear, userCdList,cstmrNm:caseCstmrNm,caseNm:caseCaseNm,fromDate,toDate};
      const searchModel = JSON.stringify(dataParam);
      console.log("onSearchEditActivitiesClick")
      console.log(dataParam)
      await dispatch({
        type: 'BusinessActivities/fetchEditDBusActHeadList',
        payload:searchModel
      });
      const headDataList = this.props.BusinessActivities.editDBusActHeadDataList
      let busActId = "";
      if (headDataList !== null &&
        undefined != headDataList &&
        headDataList.length > 0 &&
        headDataList[0] !== null &&
        undefined !== headDataList[0]){
        busActId = headDataList[0].busActId;
      }
      else {
        if ((userOrgInfo !== null && undefined !== userOrgInfo && userOrgInfo?.userDiv !== null
          && undefined !==  userOrgInfo?.userDiv && userOrgInfo?.userDiv === "1")
          ||  (userOrgInfo !== null && undefined !== userOrgInfo && userOrgInfo?.userDiv !== null
            && undefined !==  userOrgInfo?.userDiv && userOrgInfo?.userDiv === "0"
            && undefined !==  userOrgInfo?.inputUserCds &&  userOrgInfo?.inputUserCds !=="")){
          dispatch({
            type: 'global/inForceFlag',
            payload: false
          });
          dispatch({
            type: 'global/dialogBoxFlag',
            payload: false
          });
          dispatch({
            type: 'global/disableButton',
            payload: false
          });
          dispatch({
            type: 'global/newCloseFlag',
            payload: false
          });
          this.add('0')
        };
        this.setState({
          searchLoading:false,
          editDBusActHeadDataList:[],
        });
        return ;
      }
      await this.getbusinessActivityDtlList(headDataList,busActId,"edit");
      this.setState({
        searchLoading:false
      });
      if(headDataList)
      dispatch({
        type: 'global/inForceFlag',
        payload: false
      });
      dispatch({
        type: 'global/dialogBoxFlag',
        payload: false
      });
      dispatch({
        type: 'global/disableButton',
        payload: false
      });
      dispatch({
        type: 'global/newCloseFlag',
        payload: false
      });
    }
  }

  onUpdateSearchEditActivitiesClick=async ()=>{
    this.setState({
      searchLoading:true
    });
    const { dispatch } = this.props;
    const { actForYear,caseSelectUserCdList,caseCstmrNm,caseCaseNm,fromDate,toDate,activeKey} = this.state;

    let userCdList = caseSelectUserCdList;
    if(userCdList === null || undefined === userCdList || userCdList.length<=0){
      userCdList = [];
      this.props.BusinessActivities.userList.map((user: { userCd: any; })=>{
        userCdList.push(user.userCd)
      })
    }
    const dataParam:{ fromDate: string; toDate: string; dspYear:string,caseNm: string; cstmrNm: string; userCdList: string[] }
      = {dspYear:actForYear, userCdList,cstmrNm:caseCstmrNm,caseNm:caseCaseNm,fromDate,toDate};
    const searchModel = JSON.stringify(dataParam);
    console.log("onSearchEditActivitiesClick")
    console.log(dataParam)
    await dispatch({
      type: 'BusinessActivities/fetchEditDBusActHeadList',
      payload:searchModel
    });
    const headDataList = this.props.BusinessActivities.editDBusActHeadDataList
    const busActId = activeKey;
    await this.getbusinessActivityDtlList(headDataList,busActId,"edit");
    this.setState({
      searchLoading:false
    });
  }

  newBusinessActivity = ()=>{
    const {userCdList,orgIdList} = this.state;
    const { dispatch } = this.props;

    const language = this.props.user.currentUser?.dspLang;
    const caseYear = this.props.user.currentUser?.dspYear;
    const orgGroupId = this.props.user.currentUser?.orgGroupId;
    const inputUserCd = this.props.user.currentUser?.inputUserCds;
    const authOrgCd = this.props.user.currentUser?.authOrgCds;
    const caseNm = '';
    const caseParam: FetchCaseType = {language, caseYear, orgGroupId, authOrgCd, inputUserCd, caseNm};

    const caseInfoModel = JSON.stringify(caseParam);
    // ustomer info 取得
    dispatch({
      type: 'BusinessActivities/fetchCustomerList',
      // payload: { userCdList,userOrgCdList:orgIdList},
      payload:{ caseInfoModel},
    });

    dispatch({
      type: 'BusinessActivities/fetchAllCustomerList',
      payload:{ caseInfoModel},
    });

    // case情報条件によってデータを取得businessActivityDtlList
    dispatch({
      type: 'BusinessActivities/fetchCaseList',
      payload: { userCdList,userOrgCdList:orgIdList},
    });


    dispatch({
      type: 'BusinessActivities/fetchEndUserList',
      // payload:{userCdList,userOrgCdList:orgIdList},
      payload:{ caseInfoModel},
    });

    // 営業担当リスト取得
    dispatch({
      type: 'BusinessActivities/fetchAllEndUserList',
      payload:{ caseInfoModel},
    });

    this.setState({
      searchLoading:true
    });
    const headDataList = this.props.BusinessActivities.editDBusActHeadDataList
    let busActId = "";
    if (headDataList !== null && undefined != headDataList&& headDataList.length > 0 &&
      headDataList[headDataList.length-1] !== null && undefined !==  headDataList[headDataList.length-1]){
      busActId =  headDataList[headDataList.length-1].busActId;
    }else {
      this.setState({
        searchLoading:false
      });
      return ;
    }
    const {userOrgInfo} = this.state
    headDataList.forEach((item)=>{
      if (userOrgInfo.orgGroupId != null) {
        item.orgGroupId = userOrgInfo.orgGroupId;
      }
    })
    this.getbusinessActivityDtlList(headDataList,busActId,"edit");
    this.setState({
      searchLoading:false
    });
  };


  deleteBusinessActivityDtl= async ()=>{
    const { editDBusActHeadDataList,tabSelectKey,selectKey,userCdList,orgIdList} = this.state;
    if (selectKey ==='SearchActivities'){
      this.onSearchActivitiesClick();
      this.setState({
        searchLoading:false
      });
      return ;
    }

    let busActId = tabSelectKey;
    const { dispatch,} = this.props;

    const language = this.props.user.currentUser?.dspLang;
    const caseYear = this.props.user.currentUser?.dspYear;
    const orgGroupId = this.props.user.currentUser?.orgGroupId;
    const inputUserCd = this.props.user.currentUser?.inputUserCds;
    const authOrgCd = this.props.user.currentUser?.authOrgCds;
    const caseNm = '';
    const caseParam: FetchCaseType = {language, caseYear, orgGroupId, authOrgCd, inputUserCd, caseNm};

    const caseInfoModel = JSON.stringify(caseParam);


    dispatch({
      type: 'BusinessActivities/fetchCustomerList',
      // payload: { userCdList,userOrgCdList:orgIdList},
      payload:{ caseInfoModel},
    });

    dispatch({
      type: 'BusinessActivities/fetchAllCustomerList',
      payload:{ caseInfoModel},
    });
// 検索エリアのcustomerリスト取得
    dispatch({
      type: 'BusinessActivities/fetchSearchCustomerData',
      payload: { userCdList,userOrgCdList:orgIdList},
    });

    // case情報条件によってデータを取得
    dispatch({
      type: 'BusinessActivities/fetchCaseList',
      payload: { userCdList,userOrgCdList:orgIdList},
    });

    dispatch({
      type: 'BusinessActivities/fetchEndUserList',
      // payload:{userCdList,userOrgCdList:orgIdList},
      payload:{ caseInfoModel},
    });
    // 営業担当リスト取得
    dispatch({
      type: 'BusinessActivities/fetchAllEndUserList',
      payload:{ caseInfoModel},
    });
    this.setState({
      searchLoading:true
    });

    const seleckList = editDBusActHeadDataList.filter((item: { busActId: { toString: () => string; }; })=>item.busActId.toString() === busActId)
    if(seleckList !== null && undefined !== seleckList && seleckList.length > 0 && seleckList[0] !== null && undefined !== seleckList[0] ){
      if (seleckList[0].dtlDataList.length === 1){
        const HeadList = editDBusActHeadDataList.filter((item: { busActId: { toString: () => string; }; })=>item.busActId.toString() !== busActId)

        if (HeadList !== null && undefined != HeadList&& HeadList.length > 0 &&
          HeadList[0] !== null && undefined !==  HeadList[0]){
          busActId =  HeadList[0].busActId;
        }

        if (selectKey === 'EditActivities'){
          this.getbusinessActivityDtlList(HeadList, busActId,"edit");
        }
        else if (selectKey === 'SearchCase'){
          this.getbusinessActivityDtlList(HeadList, busActId,"");
        }
        this.setState({
          searchLoading:false
        });
      }
      else {

        const { actForYear,caseSelectUserCdList,caseCstmrNm,caseCaseNm,fromDate,toDate} = this.state;

        let userCdList = caseSelectUserCdList;
        if(userCdList === null || undefined === userCdList || userCdList.length<=0){
          userCdList = [];
          this.props.BusinessActivities.userList.map((user: { userCd: any; })=>{
            userCdList.push(user.userCd)
          })
        }
        const dataParam:{ fromDate: string; toDate: string; dspYear:string,caseNm: string; cstmrNm: string; userCdList: string[] }
          = {dspYear:actForYear, userCdList,cstmrNm:caseCstmrNm,caseNm:caseCaseNm,fromDate,toDate};
        const searchModel = JSON.stringify(dataParam);
        if (selectKey === 'EditActivities'){

          console.log("onSearchEditActivitiesClick")
          console.log(dataParam)
          await dispatch({
            type: 'BusinessActivities/fetchEditDBusActHeadList',
            payload:searchModel
          });
          const headDataList = this.props.BusinessActivities.editDBusActHeadDataList
          this.getbusinessActivityDtlList(headDataList, tabSelectKey,"edit");
        }
        else if (selectKey === 'SearchCase'){
          console.log("onSearchCaseActivitiesClick")
          console.log(dataParam)
          await dispatch({
            type: 'BusinessActivities/fetchDBusActHeadList',
            payload:searchModel
          });
          const headDataList = this.props.BusinessActivities.bBusActHeadDataList
          this.getbusinessActivityDtlList(headDataList, tabSelectKey,"");
        }
      }
    }else if (selectKey === 'EditActivities'){
        this.onSearchEditActivitiesClick();
      }
      else if (selectKey === 'SearchCase'){
        this.onSearchCaseActivitiesClick();
      }
    this.setState({
      searchLoading:false
    });
  }

  createBusinessActivityDtl=()=>{
    this.setState({
      searchLoading:true
    });
    const { editDBusActHeadDataList,tabSelectKey} = this.state;
    this.getbusinessActivityDtlList(editDBusActHeadDataList, tabSelectKey,"edit");
    this.setState({
      searchLoading:false
    });
  }


  getbusinessActivityDtlList= async (headDataList: DBusActHeadDataType[], busActId: string,type:string)=>{
    if (type==="edit"){
      this.setState({
        editDBusActHeadDataList:[],
      });
    }else {
      this.setState({
        bBusActHeadDataList:[],
      });
    }
    const busActIds = [];
    busActIds.push(busActId);
    const { dispatch,user } = this.props;
    const { actForYear} = this.state;
    const dtlDataParam = {dspYear: actForYear,busActIds};
    const searchDtlModel = JSON.stringify(dtlDataParam);
    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
    console.log(searchDtlModel)
    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
    await dispatch({
      type: 'BusinessActivities/fetchBusinessActivityDtlList',
      payload: searchDtlModel
    });

   /* if (this.props.BusinessActivities.businessActivityDtlList === null
      || undefined === this.props.BusinessActivities.businessActivityDtlList
      || this.props.BusinessActivities.businessActivityDtlList.length <=0){

      const headList = headDataList.filter((item)=>item.busActId === busActId)
      if (headList === null || undefined === headList || headList.length <= 0){
        if ((user !== null && undefined !== user && user.currentUser?.userDiv !== null
          && undefined !==  user.currentUser?.userDiv && user.currentUser?.userDiv === "1")
          ||  (user !== null && undefined !== user && user.currentUser?.userDiv !== null
            && undefined !==  user.currentUser?.userDiv && user.currentUser?.userDiv === "0"
            && undefined !==  user.currentUser?.inputUserCds &&  user.currentUser?.inputUserCds !==""&&type==="edit")){
          this.add('1')
        };
        return
      }
      const busActIds: never[] = [];
      // @ts-ignore
      busActIds.push(busActId)
      const dtlDataParam = {dspYear: actForYear,busActIds};
      const searchDtlModel = JSON.stringify(dtlDataParam);
      await dispatch({
        type: 'BusinessActivities/fetchBusinessActivityDtlList',
        payload: searchDtlModel
      });
    } */
    if(this.props.BusinessActivities.businessActivityDtlList !== null
      && undefined !== this.props.BusinessActivities.businessActivityDtlList
      && this.props.BusinessActivities.businessActivityDtlList.length>0) {
      this.props.BusinessActivities.businessActivityDtlList.forEach((item) => {
        item.addFileUrl1 = item.addFileUrl1 === null || undefined === item.addFileUrl1 || item.addFileUrl1 === "" ? "" : HttpUrlStrUplod + item.addFileUrl1;
        item.addFileUrl2 = item.addFileUrl2 === null || undefined === item.addFileUrl2 || item.addFileUrl2 === "" ? "" : HttpUrlStrUplod + item.addFileUrl2;
        item.addFileUrl3 = item.addFileUrl3 === null || undefined === item.addFileUrl3 || item.addFileUrl3 === "" ? "" : HttpUrlStrUplod + item.addFileUrl3;
        item.addFileUrl4 = item.addFileUrl4 === null || undefined === item.addFileUrl4 || item.addFileUrl4 === "" ? "" : HttpUrlStrUplod + item.addFileUrl4;
        item.addFileUrl5 = item.addFileUrl5 === null || undefined === item.addFileUrl5 || item.addFileUrl5 === "" ? "" : HttpUrlStrUplod + item.addFileUrl5;
        item.addFileUrl6 = item.addFileUrl6 === null || undefined === item.addFileUrl6 || item.addFileUrl6 === "" ? "" : HttpUrlStrUplod + item.addFileUrl6;
        item.addFileUrl7 = item.addFileUrl7 === null || undefined === item.addFileUrl7 || item.addFileUrl7 === "" ? "" : HttpUrlStrUplod + item.addFileUrl7;
        item.addFileUrl8 = item.addFileUrl8 === null || undefined === item.addFileUrl8 || item.addFileUrl8 === "" ? "" : HttpUrlStrUplod + item.addFileUrl8;
        item.addFileUrl9 = item.addFileUrl9 === null || undefined === item.addFileUrl9 || item.addFileUrl9 === "" ? "" : HttpUrlStrUplod + item.addFileUrl9;
        item.addFileUrl10 = item.addFileUrl10 === null || undefined === item.addFileUrl10 || item.addFileUrl10 === "" ? "" : HttpUrlStrUplod + item.addFileUrl10;
      })
      headDataList.forEach((item)=>{
        if (item.busActId.toString() === busActId.toString()){
          item.dtlDataList = this.props.BusinessActivities.businessActivityDtlList;
          item.dtlDataList.forEach((dtlItem)=>{
            dtlItem.cstmrNm = item.cstmrNm;
          })
        }
      });
    }


    console.log("....................................................")
    console.log(headDataList)
    console.log(busActId)
    console.log("....................................................")
    if (type==="edit"){
      this.props.BusinessActivities.editDBusActHeadDataList = headDataList;
      this.setState({
        editDBusActHeadDataList:headDataList,
      });
    }else {
      this.props.BusinessActivities.bBusActHeadDataList = headDataList;
      this.setState({
        bBusActHeadDataList:headDataList,
      });
    }
    this.setState({
      tabSelectKey: busActId,
      activeKey:busActId.toString()
    });
  }

  /**
   * 组装树函数
   * @param {array} data -- 要组装的list数组
   * @param {string} idKey -- 树节点的id的名称
   * @param {string} parentKey -- 树节点的父节点id的名称
   * @param {string} childListKey -- 树节点的子集list的id的名称
   */
  toTree=(data = [],
                 idKey = 'id',
                 parentKey = 'pid',
                 childListKey = 'subList') => {
    // 删除 所有 children,以防止多次调用
    data.forEach(function (item) {
      delete item[childListKey];
    });

    // 将数据存储为 以 id 为 KEY 的 map 索引数据列
    const map = {};
    data.forEach(function (item) {
      map[item[idKey]] = item;
    });
    const val: never[] = [];
    data.forEach((item) => {
      // 以当前遍历项，的pid,去map对象中找到索引的id
      const parent = map[item[parentKey]];

      // 如果找到索引，那么说明此项不在顶级当中,那么需要把此项添加到，他对应的父级中
      if (parent) {
        // @ts-ignore
        (parent[childListKey] || (parent[childListKey] = [])).push(item);
      } else {
        // 如果没有在map中找到对应的索引ID,那么直接把 当前的item添加到 val结果集中，作为顶级
        val.push(item);
      }
    });
    return val;
  }

  // 组装数据 Activitie 数据
  getBusinesActivitieContentHead=(dataList: any[],contentType:string)=>{
    if (dataList === null || undefined === dataList || dataList.length <=0){
      return ;
    }
   // toTree(dataList,)
    const businesActivitieHead = [];
    for (let i = 0; i < dataList.length; i++) {
      if (businesActivitieHead.indexOf(dataList[i].busActId) == -1 ) {
        businesActivitieHead.push(dataList[i].busActId);
      }
    }

     return businesActivitieHead.map((head,index)=>(
        <Content   className={index===0?styles.searchActivitiesViewTop:styles.searchActivitiesView}>
          {this.getBusinesActivitieContent(dataList,head,contentType)}
        </Content>
     ));
  }


  getBusinesActivitieContent = (dataList:any[],busActId:string,contentType:string)=> {

    const businesActivitie = dataList.filter((item) => item.busActId === busActId);

    // @ts-ignore
    const treeData = this.toTree(businesActivitie,"busActDtlId","parBusActDtlId");

    return this.getBusinesActivitieContentChild(treeData,contentType);
  }

  getBusinesActivitieContentChild = (businesActivitie:any[],contentType:string)=>{
    const {selectKey,userOrgInfo} = this.state
    if (businesActivitie === null || businesActivitie === undefined){return }
    return businesActivitie.map((item)=>(
      // @ts-ignore
      <BusinesActivitieContent currentUser={userOrgInfo} RefreshComment={selectKey==="SearchActivities"?this.onSearchActivitiesClick:this.onCaseTabRefreshComment}
                               businesActivitieInfo={item}
                               businesActivitieType={contentType}
                                dispatch={this.props.dispatch}
                                deleteComment={this.deleteBusinessActivityDtl}>
        {this.getBusinesActivitieContentChild(item.subList,contentType)}
      </BusinesActivitieContent>
    ));
  }

  getCaseBusinesActivitieContent = (dtlDataList: BusActHedDtlDataType[], contentType: String) => {
    const  {dispatch} = this.props;
    if (dtlDataList === null || undefined === dtlDataList || dtlDataList.length < 0)
    {
      return <div />
    }
      // @ts-ignore
    const treeData = this.toTree(dtlDataList,"busActDtlId","parBusActDtlId");
      // @ts-ignore
    return this.getBusinesActivitieContentChild(treeData,contentType);

    dispatch({
      type: 'global/inForceFlag',
      payload: false
    });
    dispatch({
      type: 'global/disableButton',
      payload: false
    });
    dispatch({
      type: 'global/newCloseFlag',
      payload: false
    });

  }

  // 组装数据 case 数据
  getBusinesActivitieContentCaseHead= (dataList: DBusActHeadDataType[], contentType: string)=>{
    if (dataList === null || undefined === dataList || dataList.length <=0){
      return ;
    }
    const caseScreenHeight = window.screen.height - 460;
    if(dataList.length === 1){
      const item = dataList[0]
      // eslint-disable-next-line @typescript-eslint/no-shadow
      return dataList.map((item)=>(
        <TabPane tab={item.caseNm} key={item.busActId} forceRender={false} closable={false} >
          <Row>
            <Col xl={5} lg={5} md={5} sm={5} xs={5}>
              <Form.Item label={formatMessage({ id: 'common.business.activities.staff' })} className={classNames(styles.styleFont)}>
                <span>{item.userNm}</span>
              </Form.Item>
            </Col>
            <Col xl={5} lg={5} md={5} sm={5} xs={5}>
              <Form.Item label={formatMessage({ id: 'common.business.activities.customerName' })} className={classNames(styles.styleFont)}>
                <span>{item.cstmrNm}</span>
              </Form.Item>
            </Col>
            <Col xl={5} lg={5} md={5} sm={5} xs={5}>
              <Form.Item label={formatMessage({ id: 'common.business.activities.endUser' })} className={classNames(styles.styleFont)}>
                <span>{item.endUserNm}</span>
              </Form.Item>
            </Col>
            <Col xl={4} lg={4} md={4} sm={4} xs={4}>
              <Form.Item label={formatMessage({ id: 'common.business.activities.createDate' })} className={classNames(styles.styleFont)}>
                <span>{item.caseCreatedDt}</span>
              </Form.Item>
            </Col>
            <Col xl={4} lg={4} md={4} sm={4} xs={4}>
              <Form.Item label={formatMessage({ id: 'common.business.activities.status' })}className={classNames(styles.styleFont)}>
                <span>{item.cdNm}</span>
              </Form.Item>
            </Col>

          </Row>
          <Row>
            <Col xl={24} lg={24} md={24} sm={24} xs={24}>
              <Content className={styles.caseActivitiesView}
                       style= {{height:caseScreenHeight,overflowY:'scroll'}}>
                {this.getCaseBusinesActivitieContent(item.dtlDataList,contentType)}
              </Content>
            </Col>
          </Row>
        </TabPane>
      ));
    }
    return dataList.map((item)=>(
      <TabPane tab={item.caseNm} key={item.busActId} forceRender={false}>
        <Row>
          <Col xl={5} lg={5} md={5} sm={5} xs={5}>
            <Form.Item label={formatMessage({ id: 'common.business.activities.staff' })} className={classNames(styles.styleFont)}>
              <span>{item.userNm}</span>
            </Form.Item>
          </Col>
          <Col xl={5} lg={5} md={5} sm={5} xs={5}>
            <Form.Item label={formatMessage({ id: 'common.business.activities.customerName' })} className={classNames(styles.styleFont)}>
              <span>{item.cstmrNm}</span>
            </Form.Item>
          </Col>
          <Col xl={5} lg={5} md={5} sm={5} xs={5}>
            <Form.Item label={formatMessage({ id: 'common.business.activities.endUser' })} className={classNames(styles.styleFont)}>
              <span>{item.endUserNm}</span>
            </Form.Item>
         </Col>
          <Col xl={4} lg={4} md={4} sm={4} xs={4}>
            <Form.Item label={formatMessage({ id: 'common.business.activities.createDate' })} className={classNames(styles.styleFont)}>
              <span>{item.caseCreatedDt}</span>
            </Form.Item>
          </Col>
          <Col xl={4} lg={4} md={4} sm={4} xs={4}>
            <Form.Item label={formatMessage({ id: 'common.business.activities.status' })}className={classNames(styles.styleFont)}>
              <span>{item.cdNm}</span>
            </Form.Item>
          </Col>

        </Row>
        <Row>
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            <Content className={styles.caseActivitiesView}
                     style= {{height:caseScreenHeight,overflowY:'scroll'}}>
              {this.getCaseBusinesActivitieContent(item.dtlDataList,contentType)}
            </Content>
          </Col>
        </Row>
      </TabPane>
    ));
  }

  onCaseTabClick =(key: string, event: MouseEvent)=>{
    const { bBusActHeadDataList} = this.state;
    const { dispatch} = this.props;
    if(this.props.global.inForceFlag || !(this.props.global.uploadFileFlag===false && this.props.global.editorMarkDownFlag===false )){
      Modal.confirm({
        visible:this.state.visible,
        icon: <ExclamationCircleOutlined />,
        content:formatMessage({id: 'common.business.activities.content'}),
        closable: true,
        centered: true,
        okText: formatMessage({id: 'common.business.activities.content.ok'}),
        cancelText: formatMessage({id: 'common.business.activities.content.onCancel'}),
        // 这里注意要用箭头函数, 否则this不生效
        onOk: async () =>{
          await dispatch({
            type: 'global/dialogBoxFlag',
            payload: false
          });
          await dispatch({
            type: 'global/inForceFlag',
            payload: false
          });
          await dispatch({
            type: 'global/disableButton',
            payload: false
          });
          await dispatch({
            type: 'global/newCloseFlag',
            payload: false
          });
          await dispatch({
            type: 'global/editorMarkDownFlag',
            payload: false
          });
          await dispatch({
            type: 'global/uploadFileFlag',
            payload: false
          });

          this.getbusinessActivityDtlList(bBusActHeadDataList, key,"case");
          this.setState({
            activeKey:key.toString(),
            visible: false,
          })

        },
        onCancel:() => {
          this.setState(
            {
              visible: false,
            }
          )
        }
      });
    }else {
      dispatch({
        type: 'global/dialogBoxFlag',
        payload: false
      });
      dispatch({
        type: 'global/inForceFlag',
        payload: false
      });
      dispatch({
        type: 'global/disableButton',
        payload: false
      });
      this.getbusinessActivityDtlList(bBusActHeadDataList, key,"case");
      this.setState({
        activeKey:key.toString()
      })
    }
  }
  onEditCaseTabClick =(key: string, event: MouseEvent)=>{
     const dispatch = this.props.dispatch;
     if(this.props.global.inForceFlag || !(this.props.global.uploadFileFlag===false && this.props.global.editorMarkDownFlag===false )){
      Modal.confirm({
        visible:this.state.visible,
        icon: <ExclamationCircleOutlined />,
        content:formatMessage({id: 'common.business.activities.content'}),
        closable: true,
        centered: true,
        okText: formatMessage({id: 'common.business.activities.content.ok'}),
        cancelText: formatMessage({id: 'common.business.activities.content.onCancel'}),
        // 这里注意要用箭头函数, 否则this不生效
        onOk: async () => {
          const {editDBusActHeadDataList} = this.state;
          if (key.substring(0, 3) !== "new") {
            const fileArray = editDBusActHeadDataList.filter((data: { busActId: string; }) => data.busActId.toString().substring(0, 3) !== 'new')
            this.getbusinessActivityDtlList(fileArray, key, "edit");
          }

          this.setState({
            activeKey: key.toString()
          })
          this.setState(
            {
              visible: false,
            });
          await dispatch({
            type: 'global/inForceFlag',
            payload: false
          });
          await dispatch({
            type: 'global/dialogBoxFlag',
            payload: false
          });
          await dispatch({
            type: 'global/disableButton',
            payload: false
          });
          await dispatch({
            type: 'global/newCloseFlag',
            payload: false
          });
          await dispatch({
            type: 'global/editorMarkDownFlag',
            payload: false
          });
          await dispatch({
            type: 'global/uploadFileFlag',
            payload: false
          });
          await dispatch({
            type: 'global/editAddFlag',
            payload: false
          });
          await dispatch({
            type: 'global/saveButtonFlag',
            payload: false
          });
        },
        onCancel: () => {
          this.setState(
            {
              visible: false,
            }
          )
        }
      });
    }else {
      console.log(key);
      console.log(event);
      const { editDBusActHeadDataList} = this.state;
      if (key.substring(0,3) !== "new"){
        this.getbusinessActivityDtlList(editDBusActHeadDataList, key,"edit");
      }
      this.setState({
        activeKey:key.toString()
      })
      dispatch({
        type: 'global/inForceFlag',
        payload: false
      });
      dispatch({
        type: 'global/disableButton',
        payload: false
      });
      dispatch({
        type: 'global/newCloseFlag',
        payload: false
      });
    }
  }

  onCaseTabRefreshComment=()=>{
    const { bBusActHeadDataList,tabSelectKey} = this.state;
    this.getbusinessActivityDtlList(bBusActHeadDataList, tabSelectKey,"case");
  }

  remove = (type:string) => {
    const {dispatch} = this.props;
    const { editDBusActHeadDataList,bBusActHeadDataList,activeKey ,selectKey, actForYear,caseSelectUserCdList,caseCstmrNm,caseCaseNm,fromDate,toDate} = this.state;

      if ( activeKey === type && (this.props.global.inForceFlag || !(this.props.global.uploadFileFlag===false && this.props.global.editorMarkDownFlag===false))) {
        Modal.confirm({
          visible: this.state.visible,
          icon: <ExclamationCircleOutlined/>,
          content: formatMessage({id: 'common.business.activities.content'}),
          closable: true,
          centered: true,
          okText: formatMessage({id: 'common.business.activities.content.ok'}),
          cancelText: formatMessage({id: 'common.business.activities.content.onCancel'}),
          // 这里注意要用箭头函数, 否则this不生效
          onOk: async () => {
            if (selectKey === "EditActivities") {
              const newHeadData: [] = editDBusActHeadDataList;
              let selectIndex: number = 0;
              if (type !== "" || type !== undefined || type !== null || editDBusActHeadDataList !== "" || editDBusActHeadDataList.size !== 0) {
                editDBusActHeadDataList.some((item: any, index: number) => {
                    if (type === item.busActId.toString()) {
                      selectIndex = index;
                    }
                  }
                );
                newHeadData.splice(selectIndex, 1);
              }
              if (activeKey === type) {
                let busActId = "";
                if (newHeadData.length - 1 >= selectIndex) {
                  busActId = newHeadData[selectIndex].busActId.toString();
                } else {
                  busActId = newHeadData[selectIndex - 1].busActId.toString();
                }
                if (busActId.length > 3 && busActId.substring(0, 3) === "new") {
                  this.setState({
                    tabSelectKey: busActId,
                    activeKey: busActId.toString(),
                    bBusActHeadDataList: newHeadData,
                  });
                } else {
                  this.getbusinessActivityDtlList(newHeadData, busActId, "edit");
                }

              } else {
                this.setState({
                  bBusActHeadDataList: newHeadData,
                });
              }
            } else if (selectKey === "SearchCase") {
              const newHeadDataSearchCase: [] = bBusActHeadDataList;
              let selectIndexSearch: number = 0;
              if (type !== "" || type !== undefined || type !== null || bBusActHeadDataList !== "" || bBusActHeadDataList.size !== 0) {
                bBusActHeadDataList.some((item: any, index: number) => {
                    if (type === item.busActId.toString()) {
                      selectIndexSearch = index;
                    }
                  }
                );
                newHeadDataSearchCase.splice(selectIndexSearch, 1);
              }
              if (activeKey === type) {
                let busActId = "";
                if (newHeadDataSearchCase.length - 1 >= selectIndexSearch) {
                  busActId = newHeadDataSearchCase[selectIndexSearch].busActId.toString();
                } else {
                  busActId = newHeadDataSearchCase[selectIndexSearch - 1].busActId.toString();
                }
                this.getbusinessActivityDtlList(newHeadDataSearchCase, busActId, "case");
              } else {
                this.setState({
                  bBusActHeadDataList: newHeadDataSearchCase,
                });
              }
            }
            const fileArray = editDBusActHeadDataList.filter((data: { busActId: string; }) => data.busActId.toString().substring(0, 3) === 'new')
            // @ts-ignore
            if (fileArray.length === 0) {
              await dispatch({
                type: 'global/dialogBoxFlag',
                payload: false
              });
            }
            await dispatch({
              type: 'global/inForceFlag',
              payload: false
            });
            await dispatch({
              type: 'global/newCloseFlag',
              payload: false
            });
            await dispatch({
              type: 'global/disableButton',
              payload: false
            });
            await dispatch({
              type: 'global/editorMarkDownFlag',
              payload: false
            });
            await dispatch({
              type: 'global/uploadFileFlag',
              payload: false
            });
            await dispatch({
              type: 'global/editAddFlag',
              payload: false
            });
            await dispatch({
              type: 'global/saveButtonFlag',
              payload: false
            });

            this.setState(
              {
                visible: false,
              });
          },
          onCancel: () => {
            this.setState(
              {
                visible: false,
              }
            )
          }
        });
      } else {
        if (selectKey === "EditActivities") {
          const newHeadData: [] = editDBusActHeadDataList;
          let selectIndex: number = 0;
          if (type !== "" || type !== undefined || type !== null || editDBusActHeadDataList !== "" || editDBusActHeadDataList.size !== 0) {
            editDBusActHeadDataList.some((item: any, index: number) => {
                if (type === item.busActId.toString()) {
                  selectIndex = index;
                }
              }
            );
            newHeadData.splice(selectIndex, 1);
          }

          if (activeKey === type) {
            let busActId = "";
            if (newHeadData.length - 1 >= selectIndex) {
              busActId = newHeadData[selectIndex].busActId.toString();
            } else {
              busActId = newHeadData[selectIndex - 1].busActId.toString();
            }
            if (busActId.length > 3 && busActId.substring(0, 3) === "new") {
              this.setState({
                tabSelectKey: busActId,
                activeKey: busActId.toString(),
                bBusActHeadDataList: newHeadData,
              });
            } else {
              this.getbusinessActivityDtlList(newHeadData, busActId, "edit");
            }

          } else {
            this.setState({
              bBusActHeadDataList: newHeadData,
            });
          }
        } else if (selectKey === "SearchCase") {
          const newHeadDataSearchCase: [] = bBusActHeadDataList;
          let selectIndexSearch: number = 0;
          if (type !== "" || type !== undefined || type !== null || bBusActHeadDataList !== "" || bBusActHeadDataList.size !== 0) {
            bBusActHeadDataList.some((item: any, index: number) => {
                if (type === item.busActId.toString()) {
                  selectIndexSearch = index;
                }
              }
            );
            newHeadDataSearchCase.splice(selectIndexSearch, 1);
          }
          if (activeKey === type) {
            let busActId = "";
            if (newHeadDataSearchCase.length - 1 >= selectIndexSearch) {
              busActId = newHeadDataSearchCase[selectIndexSearch].busActId.toString();
            } else {
              busActId = newHeadDataSearchCase[selectIndexSearch - 1].busActId.toString();
            }
            this.getbusinessActivityDtlList(newHeadDataSearchCase, busActId, "case");
          } else {
            this.setState({
              bBusActHeadDataList: newHeadDataSearchCase,
            });
          }
        }
        const fileArray = editDBusActHeadDataList.filter((data: { busActId: string; }) => data.busActId.toString().substring(0, 3) === 'new')
      }

  };


  // 组装数据 case 数据
  getBusinesActivitieContentEditHead= (dataList: DBusActHeadDataType[], contentType: string)=>{
    if (dataList === null || undefined === dataList || dataList.length <=0){
      return ;
    }
    if(dataList.length === 1){
      const item = dataList[0]
      return (
        <TabPane tab={item.caseNm} key={item.busActId} forceRender={false} closable={false}>
          {this.newBusinesActivitie(item, contentType)}
        </TabPane>
      )
    }
      // eslint-disable-next-line consistent-return
      return dataList.map((item: DBusActHeadDataType,index)=>(
        this.newBusinesActivitieclosable(item,contentType)
      ));

  }

  newBusinesActivitieclosable= (item: DBusActHeadDataType,contentType:string)=>{

    const busActId = item.busActId.toString();
    if (busActId.length > 3 && busActId.substring(0,3) === "new") {
      return (
        <TabPane tab={item.caseNm} key={item.busActId} forceRender={false} >
          {this.newBusinesActivitie(item, contentType)}
        </TabPane>
      )
    }

      return (
        <TabPane tab={item.caseNm} key={item.busActId} forceRender={false} >
          {this.newBusinesActivitie(item, contentType)}
        </TabPane>
      )

  }


  // @ts-ignore
  newBusinesActivitie= (item: DBusActHeadDataType, contentType: string)=>{

    const {BusinessActivities} = this.props
    const {userOrgInfo} = this.state
    item.strCaseCreatedDt = item.caseCreatedDt;
    if (item.isCreate !== null && undefined !== item.isCreate && item.isCreate)
    {
      // 新添加
      return (
       <NewBusinesActivitie newBusinessActivity={this.newBusinessActivity}
                            currentUser={userOrgInfo}
                            BusinessActivities={BusinessActivities}
                            dispatch={this.props.dispatch} />
      )
    }
     return (
       <EditBusinesActivitie createBusinessActivityDtl={this.createBusinessActivityDtl}
                             dispatch={this.props.dispatch}
                             BusinessActivities={BusinessActivities}
                             currentUser={userOrgInfo}
                             bBusActHeadData={item}
                             userCdList={this.state.userCdList}
                             orgIdList={this.state.orgIdList}
                             contentType={contentType}
                             deleteComment={this.deleteBusinessActivityDtl}
                             updateBusinessActivity={this.onUpdateSearchEditActivitiesClick}  />
     )

  }

  onEdit = (targetKey: any, action: string | number) => {
    console.log(action)
    console.log(targetKey)
    this[action](targetKey);
  };

  add = async (type: string) => {
    const {editDBusActHeadDataList, newActiveKey} = this.state;
    let newHeadData = {};
    const newKey = newActiveKey + 1;
    const newBusActId = `new${newKey}`;
    let newPanes: any[] = [];
    const {dispatch} = this.props;

    if (type !== '0' && type !== '1'  ) {
      await dispatch({
        type: 'global/dialogBoxFlag',
        payload: true
      });
      await dispatch({
        type: 'global/newCloseFlag',
        payload: true
      });
      await dispatch({
        type: 'global/disableButton',
        payload: true
      });
      await dispatch({
        type: 'global/editAddFlag',
        payload: true
      });
    }


    if (this.props.global.inForceFlag || !(this.props.global.uploadFileFlag===false && this.props.global.editorMarkDownFlag===false)) {
      Modal.confirm({
        visible: this.state.visible,
        icon: <ExclamationCircleOutlined/>,
        content: formatMessage({id: 'common.business.activities.content'}),
        closable: true,
        centered: true,
        okText: formatMessage({id: 'common.business.activities.content.ok'}),
        cancelText: formatMessage({id: 'common.business.activities.content.onCancel'}),
        // 这里注意要用箭头函数, 否则this不生效
        onOk: () => {
          if (type === '0') {
            newHeadData = {
              busActId: newBusActId,
              cstmrNm: "",
              endUserNm: "",
              caseNm: formatMessage({id: 'common.business.activities.new'}),
              busActStsCd: "",
              cdNm: "",
              orgGroupId: "",
              isCreate: true
            }
          } else if (editDBusActHeadDataList !== null && undefined !== editDBusActHeadDataList && editDBusActHeadDataList.length > 0) {
            const headData = editDBusActHeadDataList[editDBusActHeadDataList.length - 1];
            newHeadData = {
              busActId: newBusActId,
              cstmrNm: "",
              endUserNm: "",
              caseNm: formatMessage({id: 'common.business.activities.new'}),
              busActStsCd: "",
              cdNm: "",
              orgGroupId: headData.orgGroupId,
              isCreate: true
            }
            newPanes = [...editDBusActHeadDataList];
          } else {
            newHeadData = {
              busActId: newBusActId,
              cstmrNm: "",
              endUserNm: "",
              caseNm: formatMessage({id: 'common.business.activities.new'}),
              busActStsCd: "",
              cdNm: "",
              orgGroupId: "",
              isCreate: true
            }
          }
          newPanes.push(newHeadData);
          this.setState({
            editDBusActHeadDataList: newPanes,
            activeKey: newBusActId,
            newActiveKey: newActiveKey + 1,
            visible: false,
          });
        },
        onCancel: async() => {
          await dispatch({
            type: 'global/editAddFlag',
            payload: false
          });
          this.setState(
            {
              visible: false,
            }
          )
        }
      });
    } else {
      if (type === '0') {
        newHeadData = {
          busActId: newBusActId,
          cstmrNm: "",
          endUserNm: "",
          caseNm: formatMessage({id: 'common.business.activities.new'}),
          busActStsCd: "",
          cdNm: "",
          orgGroupId: "",
          isCreate: true
        }
      } else if (editDBusActHeadDataList !== null && undefined !== editDBusActHeadDataList && editDBusActHeadDataList.length > 0) {
        const headData = editDBusActHeadDataList[editDBusActHeadDataList.length - 1];
        newHeadData = {
          busActId: newBusActId,
          cstmrNm: "",
          endUserNm: "",
          caseNm: formatMessage({id: 'common.business.activities.new'}),
          busActStsCd: "",
          cdNm: "",
          orgGroupId: headData.orgGroupId,
          isCreate: true
        }
        newPanes = [...editDBusActHeadDataList];
      } else {
        newHeadData = {
          busActId: newBusActId,
          cstmrNm: "",
          endUserNm: "",
          caseNm: formatMessage({id: 'common.business.activities.new'}),
          busActStsCd: "",
          cdNm: "",
          orgGroupId: "",
          isCreate: true
        }
      }
      newPanes.push(newHeadData);
      this.setState({
        editDBusActHeadDataList: newPanes,
        activeKey: newBusActId,
        newActiveKey: newActiveKey + 1
      });
    }
  if (type !== '0' && type !== '1' ) {
      await dispatch({
        type: 'global/inForceFlag',
        payload: true
      });
    }

  };

  /**
   * 设置title菜单
   * @param payload
   */
  changeSelectMenuState = (payload: SelectMenuItem[]): void => {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const { dispatch } =this.props;
    if (dispatch) {
      dispatch({
        type: 'global/changeSelectMenu',
        payload
      });
    }
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

  render() {
    const {selectKey, bBusActHeadDataList,activeKey,editDBusActHeadDataList,searchLoading,caseCaseNm,caseCstmrNm,caseStaff} = this.state;
    // @ts-ignore
    const { BusinessActivities,user,selectUserName,global} = this.props;
    const {businessActivities} = this.state
    const formItemLayout = {
          labelCol: { span: 8 },
          wrapperCol: { span: 16 },
        }
        if(BusinessActivities.userList ===[] || BusinessActivities.userList.length<=0){
          return null;
        }
 /*   if(BusinessActivities.searchCustomerList ===[] || BusinessActivities.searchCustomerList.length<=0){
      return null;
    }*/
    // @ts-ignore
    if(selectKey ===""){
      //this.selectKey(this.props.location.query.id);
      this.setState({
        selectKey: this.props.location.query.id,
      });
    }


    // 获取optionValue
    const customerOption: OptionType[] = [];
    BusinessActivities.searchCustomerList.forEach((item) => {
      // @ts-ignore
      if (item !== null && item !== "") {
        const optionItem: OptionType = {
          // @ts-ignore
          value: item
        };
        customerOption.push(optionItem);
      }
    });
    const caseOption: OptionType[] = [];
    BusinessActivities.caseList.forEach((item) => {
      // @ts-ignore
      if (item !== null && item !== "") {
        const optionItem: OptionType = {
          // @ts-ignore
          value: item
        };
        caseOption.push(optionItem);
      }
    });

    this.renderChildren = () => {
      const ItemLayout ={labelCol: {style: {width:80} }};

      //let userNm:string | undefined = "";
/*      if(this.props.user.currentUser?.userDiv !== '1'){
        if(BusinessActivities.userList !== undefined
          && BusinessActivities.userList!== null
          && BusinessActivities.userList.length>0){
          userNm = BusinessActivities.userList[0].userNm;
        }else{
          userNm = '';
        }
      }else{
        userNm = this.props.user.currentUser?.name;
      } */
      // fv
     /* if(selectUserName !== null && selectUserName.length !==0) {
        userNm = selectUserName.userNm;
      }else if (BusinessActivities.userList !== undefined
            && BusinessActivities.userList !== null
            && BusinessActivities.userList.length > 0) {
            userNm = BusinessActivities.userList[0].userNm;
          } else {
            userNm = '';
          }
        }
      }
      if(caseStaff !==null && undefined !==caseStaff && caseStaff !==""){
        userNm = caseStaff
      } */

      //panx
      // 現在の営業者の権限を判断
     let searchBusUserCd = this.props.user.currentUser?.userid
      let userNm = this.props.user.currentUser?.name;
      const selectMenuList:any[]=[];
     if(global.selectMenu!==null && global.selectMenu !==0 && global.selectMenu.length>0){
       global.selectMenu.some((item:any)=>{
         if(item.orgType ==="2"){
           selectMenuList.push(item)
           return;
         }
         })
       if(selectMenuList!==null && selectMenuList !==0 && selectMenuList.length>0){
         userNm=selectMenuList[0].tabName
       }
     }
      if(selectUserName !== null && selectUserName.length !==0) {
        userNm = selectUserName.userNm;
      } else{
      if(BusinessActivities.userList !== undefined
        && BusinessActivities.userList !== null
        && BusinessActivities.userList.length > 0){
        const searchUserList = BusinessActivities.userList.filter((item)=>item.userCd===searchBusUserCd);
        if(!(searchUserList!==undefined && searchUserList!==null && searchUserList.length>0)){
        //  searchBusUserCd = searchUserLst[0].userCd;
          userNm = BusinessActivities.userList[0].userNm;
        }
      }else{
       // searchBusUserCd = '';
        userNm = '';
      }
      }

      let submenu ={};
      if(this.props.location.state!==undefined && this.props.location.state!==null && this.props.location.state.length !== 0) {
        submenu = this.props.location.state.head;
      }
      if(submenu!==undefined && submenu!==null  && submenu.caseNm!==undefined  && submenu.size !== 0){
        userNm = submenu.busUserNm;
      }
      /*if(caseStaff ===""){
        userNm="";
      } */
      // edit
      const activitiesScreenHeight = window.screen.height - 275;
      switch (selectKey) {
        case 'SearchActivities':
          // @ts-ignore
          return (
            <div >
              <Layout>
                <Sider className={styles.searchconditionssider}>
                  <Form
                    labelCol={{ span: 8}}
                    wrapperCol={{ span: 16 }}
                    layout="horizontal"
                  >
                    <Form.Item label={formatMessage({ id: 'common.business.activities.staff' })}  className={classNames(styles.styleFont)}>
                      <Select showSearch allowClear className={styles.activitiesSearchItem}
                              defaultValue={userNm}
                              // @ts-ignore
                              onChange={this.onStaffChange}>
                        {this.getStaffOption(BusinessActivities.userList)}
                      </Select>
                    </Form.Item>
                    <Form.Item label={formatMessage({ id: 'common.business.activities.customer' })} className={classNames(styles.styleFont)}>
                      <AutoComplete
                        allowClear
                        className={styles.activitiesSearchItem}
                        onChange={(e) => this.onCustomerChange(e)}
                        // @ts-ignore
                        onSelect={(e) => this.onCustomerChange(e)}
                        options={customerOption}
                        filterOption={(inputValue, option) =>
                          // @ts-ignore
                          option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                        }
                      />
                      {/* <Select showSearch allowClear className={styles.activitiesSearchItem} */}
                      {/*        onChange={this.onCustomerChange}> */}
                      {/*  {this.getCustomerOption(BusinessActivities.customerList)} */}
                      {/* </Select> */}
                    </Form.Item>
                    <Form.Item label={formatMessage({ id: 'common.business.activities.case' })} className={classNames(styles.styleFont)}>
                      <AutoComplete
                        allowClear
                        className={styles.activitiesSearchItem}
                        onChange={(e) => this.onCaseChange(e)}
                        // @ts-ignore
                        onSelect={(e) => this.onCaseChange(e)}
                        options={caseOption}
                        filterOption={(inputValue, option) =>
                          // @ts-ignore
                          option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                        }
                      />
                      {/* <Select showSearch allowClear className={styles.activitiesSearchItem} */}
                      {/*        onChange={this.onCaseChange}> */}
                      {/*  {this.getCaseOption(BusinessActivities.caseList)} */}
                      {/* </Select> */}
                    </Form.Item>
                    <Form.Item label={formatMessage({ id: 'common.business.activities.form' })} className={classNames(styles.styleFont)}>
                      <DatePicker
                        className={styles.activitiesSearchItem}
                        id="fromDate"
                        // placeholder={formatMessage({ id: 'actualityForecastTop.datePicker.placeholder' })}
                         onChange={this.dataFromChange}
                        value={this.state.fromDate === '' ? null : moment(this.state.fromDate, 'YYYY-MM-DD')}
                        format="YYYY-MM-DD"
                      />
                    </Form.Item>
                    <Form.Item label={formatMessage({ id: 'common.business.activities.to' })} className={classNames(styles.styleFont)}>
                      <DatePicker
                        className={styles.activitiesSearchItem}
                        id="toDate"
                        // placeholder={formatMessage({ id: 'actualityForecastTop.datePicker.placeholder' })}
                        onChange={this.dataToChange}
                        value={this.state.toDate === '' ? null : moment(this.state.toDate, 'YYYY-MM-DD')}
                        format="YYYY-MM-DD"
                      />
                    </Form.Item>
                    <Form.Item label="">
                      <Button type="primary"  className={styles.searchButton} onClick={this.onSearchActivitiesClick}>{formatMessage({ id: 'common.business.activities.search' })}</Button>
                    </Form.Item>
                  </Form>
                </Sider>
                <Layout className={styles.searchContent}
                        style= {{height:activitiesScreenHeight,overflowY:'scroll'}}>
                  {this.getBusinesActivitieContentHead(businessActivities,"view")}
                </Layout>
              </Layout>
            </div>
          );
        case 'SearchCase':
          return (
            <div>
              <Row className={styles.activitiesSearchHeader}>
                <Form
                  {...formItemLayout}
                  layout="inline">
                  <Form.Item {...ItemLayout} label={formatMessage({ id: 'common.business.activities.staff' })} className={classNames(styles.styleFont)}>
                    <Select showSearch allowClear className={styles.activitiesSearchItem}
                            defaultValue={userNm}
                            //value={userNm}
                            // @ts-ignore
                            onChange={this.onCaseStaffChange}>
                      {this.getStaffOption(BusinessActivities.userList)}
                    </Select>
                  </Form.Item>
                  <Form.Item {...ItemLayout}  label={formatMessage({ id: 'common.business.activities.customer' })} className={classNames(styles.styleFont)}>
                    <AutoComplete
                      allowClear
                      className={styles.activitiesSearchItem}
                      onChange={(e) => this.onCaseCustomerChange(e)}
                      // @ts-ignore
                      onSelect={(e) => this.onCaseCustomerChange(e)}
                      options={customerOption}
                      value={caseCstmrNm}
                      filterOption={(inputValue, option) =>
                        // @ts-ignore
                        option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                      }
                    />
                    {/* <Select showSearch allowClear className={styles.activitiesSearchItem} */}
                    {/*        onChange={this.onCaseCustomerChange}> */}
                    {/*  {this.getCustomerOption(BusinessActivities.customerList)} */}
                    {/* </Select> */}
                  </Form.Item>
                  <Form.Item {...ItemLayout}  label={formatMessage({ id: 'common.business.activities.case' })} className={classNames(styles.styleFont)}>
                    <AutoComplete
                      allowClear
                      className={styles.activitiesSearchItem}
                      onChange={(e) => this.onCaseCaseChange(e)}
                      // @ts-ignore
                      onSelect={(e) => this.onCaseCaseChange(e)}
                      options={caseOption}
                      value={caseCaseNm}
                      filterOption={(inputValue, option) =>
                        // @ts-ignore
                        option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                      }
                    />
                    {/* <Select showSearch allowClear className={styles.activitiesSearchItem} */}
                    {/*        onChange={this.onCaseCaseChange}> */}
                    {/*  {this.getCaseOption(BusinessActivities.caseList)} */}
                    {/* </Select> */}
                  </Form.Item >
                  <Form.Item {...ItemLayout}  label={formatMessage({ id: 'common.business.activities.form' })} className={classNames(styles.styleFont)}>
                    <DatePicker
                      className={styles.activitiesSearchItem}
                      id="fromDate"
                      // placeholder={formatMessage({ id: 'actualityForecastTop.datePicker.placeholder' })}
                      onChange={this.dataFromChange}
                      value={this.state.fromDate === '' ? null : moment(this.state.fromDate, 'YYYY-MM-DD')}
                      format="YYYY-MM-DD"
                    />
                  </Form.Item>
                  <Form.Item {...ItemLayout}  label={formatMessage({ id: 'common.business.activities.to' })} className={classNames(styles.styleFont)}>
                    <DatePicker
                      className={styles.activitiesSearchItem}
                      id="toDate"
                      // placeholder={formatMessage({ id: 'actualityForecastTop.datePicker.placeholder' })}
                      onChange={this.dataToChange}
                      value={this.state.toDate === '' ? null : moment(this.state.toDate, 'YYYY-MM-DD')}
                      format="YYYY-MM-DD"
                    />
                  </Form.Item>
                  <Form.Item >
                    <Button type="primary" onClick={this.onSearchCaseActivitiesClick}>{formatMessage({ id: 'common.business.activities.search' })}</Button>
                  </Form.Item>
                </Form>
              </Row>
              <Row >
                <Tabs className={styles.caseActivitiesTab}
                      tabPosition="top" defaultActiveKey="1"
                      // @ts-ignore
                      onTabClick={(key, MouseEvent)=>this.onCaseTabClick(key, MouseEvent)}
                      activeKey={activeKey}
                      type="editable-card"
                      onEdit={this.onEdit}
                      hideAdd
                >

                  {this.getBusinesActivitieContentCaseHead(bBusActHeadDataList,"edit")}

                </Tabs>
              </Row>

            </div>
          );
        case 'EditActivities':
          // @ts-ignore
          return (
            <div>
              <Row className={styles.activitiesSearchHeader}>
                <Form
                {...formItemLayout}
                layout="inline">
               <Form.Item {...ItemLayout} label={formatMessage({ id: 'common.business.activities.staff' })} className={classNames(styles.styleFont)}>
                  <Select showSearch allowClear className={styles.activitiesSearchItem}
                          defaultValue={userNm}
                          //value={userNm}
                          // @ts-ignore
                          onChange={this.onCaseStaffChange}>
                    {this.getStaffOption(BusinessActivities.userList)}
                  </Select>
                </Form.Item>
                <Form.Item  {...ItemLayout} label={formatMessage({ id: 'common.business.activities.customer' })} className={classNames(styles.styleFont)}>
                  <AutoComplete
                    allowClear
                    className={styles.activitiesSearchItem}
                    onChange={(e) => this.onCaseCustomerChange(e)}
                    // @ts-ignore
                    onSelect={(e) => this.onCaseCustomerChange(e)}
                    options={customerOption}
                    value={caseCstmrNm}
                    filterOption={(inputValue, option) =>
                      // @ts-ignore
                      option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                    }
                  />
                  {/* <Select showSearch allowClear cldeleteCommentassName={styles.activitiesSearchItem} */}
                  {/*        onChange={this.onCaseCustomerChange}> */}
                  {/*  {this.getCustomerOption(BusinessActivities.customerList)} */}
                  {/* </Select> */}
                </Form.Item>
                <Form.Item  {...ItemLayout} label={formatMessage({ id: 'common.business.activities.case' })} className={classNames(styles.styleFont)}>
                  {/* <Select showSearch allowClear className={styles.activitiesSearchItem} */}
                  {/*        onChange={this.onCaseCaseChange}> */}
                  {/*  {this.getCaseOption(BusinessActivities.caseList)} */}
                  {/* </Select> */}
                  <AutoComplete
                    allowClear
                    className={styles.activitiesSearchItem}
                    onChange={(e) => this.onCaseCaseChange(e)}
                    // @ts-ignore
                    onSelect={(e) => this.onCaseCaseChange(e)}
                    options={caseOption}
                    value={caseCaseNm}
                    filterOption={(inputValue, option) =>
                      // @ts-ignore
                      option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                    }
                  />
                </Form.Item>
                  <Form.Item {...ItemLayout}  label={formatMessage({ id: 'common.business.activities.form' })} className={classNames(styles.styleFont)}>
                    <DatePicker
                      className={styles.activitiesSearchItem}
                      id="fromDate"
                      // placeholder={formatMessage({ id: 'actualityForecastTop.datePicker.placeholder' })}
                      onChange={this.dataFromChange}
                      value={this.state.fromDate === '' ? null : moment(this.state.fromDate, 'YYYY-MM-DD')}
                      format="YYYY-MM-DD"
                    />
                  </Form.Item>
                  <Form.Item {...ItemLayout}  label={formatMessage({ id: 'common.business.activities.to' })} className={classNames(styles.styleFont)}>
                    <DatePicker
                      className={styles.activitiesSearchItem}
                      id="toDate"
                      // placeholder={formatMessage({ id: 'actualityForecastTop.datePicker.placeholder' })}
                      onChange={this.dataToChange}
                      value={this.state.toDate === '' ? null : moment(this.state.toDate, 'YYYY-MM-DD')}
                      format="YYYY-MM-DD"
                    />
                  </Form.Item>
                <Form.Item >
                  <Button type="primary"  onClick={this.onSearchEditActivitiesClick}>{formatMessage({ id: 'common.business.activities.search' })}</Button>
                </Form.Item>
              </Form>
              </Row>
              <Content>
                <Tabs type={
                  ((user !== null && undefined !== user && user.currentUser?.userDiv !== null
                    && undefined !==  user.currentUser?.userDiv && user.currentUser?.userDiv === "1")
                  ||  (user !== null && undefined !== user && user.currentUser?.userDiv !== null
                    && undefined !==  user.currentUser?.userDiv && user.currentUser?.userDiv === "0"
                      && undefined !==  user.currentUser?.inputUserCds &&  user.currentUser?.inputUserCds !=="")
                      ||  (user !== null && undefined !== user && user.currentUser?.userDiv !== null
                        && undefined !==  user.currentUser?.userDiv && user.currentUser?.userDiv === "2"))?"editable-card":"line"}
                  activeKey={activeKey}
                  className={styles.caseActivitiesTab} tabPosition="top" defaultActiveKey="2"
                      // @ts-ignore
                      onTabClick={(key, MouseEvent)=>this.onEditCaseTabClick(key, MouseEvent)}
                      hideAdd ={ this.props.global.editAddFlag}
                      onEdit={this.onEdit}>

                  {this.getBusinesActivitieContentEditHead(editDBusActHeadDataList,"edit")}

                </Tabs>

              </Content>
            </div>
          );

        default:
          break;
      }

      return null;
    };

    // menu 显示
    let busUserFlag: boolean;
    if(this.props.user.currentUser?.userDiv === '0'){
      busUserFlag = false;
    }else{
      busUserFlag = true;
    }

    return (
      <Spin spinning={searchLoading}>
      <Layout>
            {/* <Sider className={styles.businessActivitiesLeft}>
              <div >
                <Menu mode="inline"
                      defaultOpenKeys={['sub1']}
                      defaultSelectedKeys={busUserFlag === true ? ['EditActivities']:['SearchActivities']}
                      selectedKeys={[selectKey]}>
                  <SubMenu key="sub1" title={formatMessage({ id: 'common.business.activities.search' })} >

                    <Menu.Item key="SearchActivities"
                               selectedKeys={[selectKey]}
                               onClick={({ key }) => this.selectKey(key as AccountSettingsStateKeys)}
                    >
                      {formatMessage({ id: 'businessactivities.index.Search.activities' })}
                    </Menu.Item>
                    <Menu.Item key="SearchCase"
                               selectedKeys={[selectKey]}
                               onClick={({ key }) => this.selectKey(key as AccountSettingsStateKeys)}
                    >
                      {formatMessage({ id: 'common.business.activities.case' })}
                    </Menu.Item>
                     <Menu

                      mode="inline"
                      selectedKeys={[selectKey]}
                      onClick={({ key }) => this.selectKey(key as AccountSettingsStateKeys)}
                     >
                      {this.getSearchMenu()}
                     </Menu>
                  </SubMenu>

                  {busUserFlag === true ?(
                    <Menu.Item key="EditActivities"
                               selectedKeys={[selectKey]}
                               onClick={({ key }) => this.selectKey(key as AccountSettingsStateKeys)}
                    >
                      {formatMessage({ id: 'common.business.activities.edit' })}
                    </Menu.Item>
                  ):(
                    <div/>
                    )}

                </Menu>
              </div>
            </Sider>  */}

            {/* <Col span={20}> */}
            <Layout className={styles.uploadFile}>
              <div  >{this.renderChildren()}</div>
            {/* </Col> */}
            </Layout>
      </Layout>
      </Spin>
    );
  }
}

export default connect(
  ({
     BusinessActivities,
     user,
     global,
   }: {
    BusinessActivities: any;
     user:ConnectState;
     global:ConnectState;
   },
  ) => ({
    BusinessActivities,
    user,
    global,
   selectUserName:global.selectUserName,
  }),
  // @ts-ignore
)(Index);

