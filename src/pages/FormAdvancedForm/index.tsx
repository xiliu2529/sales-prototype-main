import {Menu, Drawer, Button, Modal} from 'antd';
import React, { Component } from 'react';
import { history, connect, Dispatch, FormattedMessage } from 'umi';
import { GridContent } from '@ant-design/pro-layout';
import ActualityForecastBatchAdd from '@/pages/FormAdvancedForm/components/EditActualityForecast/ActualityForecastBatchAdd';
import ActualityForecastBottom from '@/pages/FormAdvancedForm/components/EditActualityForecast/ActualityForecastBottom';
import RunningCases from '@/pages/FormAdvancedForm/components/EditRunningCases/RunningCases';
import SearchActualityForecast from '@/pages/FormAdvancedForm/components/SearchActualityForecast/SearchActualityForecast';
import SearchRunningCases from '@/pages/FormAdvancedForm/components/SearchRunningCases/SearchRunningCases';
import {
  ActForecastTopData,
  FetchCaseType, FetchMonthNoType,
  FetchOrgCdType,
  RunCaseToActTopDataType,
} from '@/pages/FormAdvancedForm/data';
import { formatMessage } from '@@/plugin-locale/localeExports';
import { ConnectState, UserModelState } from '@/models/connect';
import styles from './index.less';
import moment from "moment";
import {SelectMenuItem} from "@/models/global";
import {HomeRankOrderModel} from "@/pages/HomePage/data";
import {ExclamationCircleOutlined} from "@ant-design/icons/lib";
import ActualityForecastBatchAddBudget
  from "@/pages/FormAdvancedForm/components/EditActualityForecast/ActualityForecastBatchAddBudget";
import {MenuInfo} from "@/models/user";

const { Item } = Menu;

interface ActForecastDataProps {
  dispatch: Dispatch;
  ActForecastData: ActForecastTopData;
  Loading: boolean;
  user: UserModelState;
}
type AccountSettingsStateKeys =
  | 'EditActualityForecast'
  | 'EditRunningCases'
  | 'SearchActualityForecast'
  | 'SearchRunningCases';

interface ActForecastDataState {
  userDiv:string;
  year: string;
  menuSearchMap: {
    [key: string]: React.ReactNode;
  };
  selectKey: AccountSettingsStateKeys;
  actForMoth: string;
  RunCaseToActTopData: RunCaseToActTopDataType;

  nowMonth: string;
  batchAddVisible:boolean;
  topVisible: boolean;
  topTipModel: boolean;
}

// 获取系统当前月
const myDate = new Date();
const tYear = myDate.getFullYear();
const tMonth = myDate.getMonth();
const currMonth = tMonth + 1;

const nowMonth = currMonth.toString().length === 1? `0${currMonth.toString()}`: currMonth.toString();

let monthNo = 3;
let lastYearMonthList: any[] = [];

class Index extends Component<ActForecastDataProps, ActForecastDataState> {
  main: HTMLDivElement | undefined = undefined;
  child: any = {}
  reqRef: number = 0;
  timeoutId: number = 0;

  private renderChildren: (() => null | any) | undefined;

  constructor(props: ActForecastDataProps) {
    super(props);

    const menuSearchMap = {
      SearchActualityForecast: (
        <FormattedMessage
          id="SearchActualityForecast"
          defaultMessage={formatMessage({ id: 'actualityForecast.index.ActualityForecast' })}
        />
      ),
      SearchRunningCases: (
        <FormattedMessage
          id="SearchRunningCases"
          defaultMessage={formatMessage({ id: 'actualityForecast.index.RunningCases' })}
        />
      ),
    };

    this.state = {
      // @ts-ignore
      userDiv: this.props.user.currentUser?.userDiv,
      // @ts-ignore
      year: this.props.user.currentUser?.dspYear,
      nowMonth,
      menuSearchMap,
      actForMoth: nowMonth.toString(),
      selectKey: '',
      batchAddVisible:false,
      RunCaseToActTopData: {
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

      topVisible: false,
      topTipModel: false,
    };
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
  // ホームページの全パラメータ
  params=()=>{
    // @ts-ignore
    const loginUserCd=this.props.user.currentUser?.userid;
    const dspYear = this.props.user.currentUser?.dspYear;
    const dspCurrCd = this.props.user.currentUser?.dspCurrCd;
    const language = this.props.user.currentUser?.dspLang;

    const userCd = [];
    userCd.push(loginUserCd);

    const caseParam: HomeRankOrderModel = {loginUserCd,dspYear,dspCurrCd,language,userCd};
    const homeRankOrderModel = JSON.stringify(caseParam);

    return homeRankOrderModel;
  }

  async componentDidMount() {

    const {dispatch} = this.props;
    // eslint-disable-next-line consistent-return

    dispatch({
      type: 'ActForecastData/clear',
    });
    dispatch({
      type: 'searchActForData/clear',
    });
    dispatch({
      type: 'searchRunCase/clear',
    });
    dispatch({
      type: 'runCaseData/clear',
    });

    // 販売データ編集範囲設定
    const monthNoParam: FetchMonthNoType = {
      orgGroupId: this.props.user.currentUser?.orgGroupId,
      orgId: this.props.user.currentUser?.dspUserOrgCd,
    };
    const monthNoModel = JSON.stringify(monthNoParam);
    await dispatch({
      type: 'ActForecastData/fetchMonthNo',
      payload: {
        monthNoModel,
      },
    });

    // true： edit, false: search
    let editOrSearch: boolean;
    if (this.state.userDiv === '2') {
      editOrSearch = true;
    } else if (this.state.userDiv === '1' && this.state.year.localeCompare(tYear.toString()) >= 0) {
      editOrSearch = true;
    } else if (this.state.userDiv === '1' && this.state.year === (tYear - 1).toString() && tMonth + 1 <= monthNo) {
      editOrSearch = true;
    } else {
      editOrSearch = false;
    }

    /*    if (editOrSearch) {
          this.setState({
            selectKey: 'EditActualityForecast',
          })
        } else {
          this.setState({
            selectKey: 'SearchActualityForecast',
          })
        } */


    // @ts-ignore
    const selectKey =this.props.location.query.id;
    const pathname =this.props.location.pathname.substring(1,this.props.location.pathname.length);
    const menuInfoVos = this.props.user.currentUser?.menuInfoVos ? this.props.user.currentUser?.menuInfoVos:[];
    if(selectKey ==="SearchActualityForecast" || selectKey ==="SearchRunningCases"
      ||selectKey ==="SearchActivities" || selectKey ==="SearchCase"){

      if((this.props.global.selectMenu !==[] && this.props.global.selectMenu.length>0 &&
        this.props.global.selectMenu[0].path.indexOf("homePage") === -1)
        || (pathname === "formadvancedform" || pathname === "formadvancedformSearchRun" ) ) {
        this.changeSelectMenuState([]);
        let defaultItmes:any = [];
        let defaultChildrenItmes: any[] = [];
        let selectItemData: SelectMenuItem[] = [];

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
        // eslint-disable-next-line block-scoped-var
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
              let selectChildrenMenu: SelectMenuItem = {
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
      }
    }else if(selectKey ==="EditActualityForecast" || selectKey ==="EditRunningCases" || selectKey ==="EditActivities") {
      this.changeSelectMenuState([]);
      let defaultItmes: any = [];
      let defaultChildrenItmes: any[] = [];
      let selectItemData: SelectMenuItem[] = [];
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
        let selectItem: SelectMenuItem = {
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

    this.selectKey(selectKey)
    this.reqRef = requestAnimationFrame(async () => {
      const language = this.props.user.currentUser?.dspLang;
      const caseYear = this.props.user.currentUser?.dspYear;
      const orgGroupId = this.props.user.currentUser?.orgGroupId;
      const inputUserCd = this.props.user.currentUser?.inputUserCds;
      const authOrgCd = this.props.user.currentUser?.authOrgCds;
      const caseNm = '';
      const caseParam: FetchCaseType = {language, caseYear, orgGroupId, authOrgCd, inputUserCd, caseNm};

      const caseInfoModel = JSON.stringify(caseParam);
      dispatch({
        type: 'ActForecastData/searchUserLst',
        payload: {
          caseInfoModel,
        },
      });

      dispatch({
        type: 'ActForecastData/fetchUserLst',
        payload: {
          caseInfoModel,
        },
      });

      const dspUserOrgCd = this.props.user.currentUser?.dspUserOrgCd;
      const OrgCdParam: FetchOrgCdType = {language, dspUserOrgCd};
      const orgCdInfoModel = JSON.stringify(OrgCdParam);
      dispatch({
        type: 'ActForecastData/fetchAuthOrgCdLst',
        payload: {
          orgCdInfoModel,
        },
      });

      dispatch({
        type: 'ActForecastData/fetchCustomerLst',
        payload: {
          caseInfoModel,
        },
      });

      dispatch({
        type: 'ActForecastData/fetchAllCustomerLst',
        payload: {
          caseInfoModel,
        },
      });

      dispatch({
        type: 'ActForecastData/fetchIndustryLst',
        payload: {
          caseYear,
        },
      });

      dispatch({
        type: 'ActForecastData/fetchCaseLst',
        payload: {
          caseInfoModel,
        },
      });

      dispatch({
        type: 'ActForecastData/fetchProbabilityLst',
        payload: {
          caseYear,
        },
      });

      dispatch({
        type: 'ActForecastData/fetchCurrencyLst',
        payload: {
          caseYear,
        },
      });

      dispatch({
        type: 'ActForecastData/fetchEffortUnitLst',
        payload: {
          caseYear,
        },
      });

      dispatch({
        type: 'ActForecastData/fetchEndUserLst',
        payload: {
          caseInfoModel,
        },
      });

      dispatch({
        type: 'ActForecastData/fetchAllEndUserLst',
        payload: {
          caseInfoModel,
        },
      });

      dispatch({
        type: 'ActForecastData/fetchCodeValueList',
      })

      dispatch({
        type: 'ActForecastData/fetchBudActFlg',
        payload: {
          caseInfoModel,
        },
      })
      let busUserCd = this.props.user.currentUser?.userid;
      if(busUserCd) {
        await dispatch({
          type: 'ActForecastData/fetchParOrgs',
          payload: {
            busUserCd,
          },
          payload1: {
            caseYear
          },
        });
      }

      const loginUserCd=this.props.user.currentUser?.userid;
      const dspYear = this.props.user.currentUser?.dspYear;
      const dspCurrCd = this.props.user.currentUser?.dspCurrCd;

      const userCd = [];
      userCd.push(loginUserCd);

      const userOrgCd = null;
      const userOrgDiv = null
      const typeNm = null
      const typedDivi = null;
      const disMonth ="";
      const authOrgCds = this.props.user.currentUser?.authOrgCds;

      // const rankParam: HomeRankOrderModel = {loginUserCd,dspYear,dspCurrCd,language,userCd,userOrgCd,userOrgDiv,typeNm,typedDivi,disMonth,authOrgCds};
      // const homeRankOrderModel = JSON.stringify(rankParam);

      // dispatch({
      //   type: 'ActForecastData/fetchBudgetOrHistData',
      //   payload: {
      //     homeRankOrderModel,
      //   },
      // });
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'ActForecastData/clear',
    });
    cancelAnimationFrame(this.reqRef);
    clearTimeout(this.timeoutId);
  };

  // search 切换menu操作
  getSearchMenu = () => {
    const { menuSearchMap } = this.state;
    return Object.keys(menuSearchMap).map((item) => <Item key={item}>{menuSearchMap[item]}</Item>);
  };

  selectKey = (key: AccountSettingsStateKeys) => {
    this.setState({
      selectKey: key,
    });

    // 左侧menu切换清空top数据
    if(key !== 'EditActualityForecast'){
      const runCaseToActTopDataParm: RunCaseToActTopDataType ={
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
      }
      this.setState({
        RunCaseToActTopData: runCaseToActTopDataParm,
      })
    }

  };

  /**
   * runningCase数据,传到Act上部画面显示，用于批量插入
   * @param runCaseToActTopDataParm runningCase子组件的table数据，用于更新父组件state
   */
  runCaseToActTop = (runCaseToActTopDataParm: RunCaseToActTopDataType) => {
    this.setState({
      // eslint-disable-next-line react/no-unused-state
      RunCaseToActTopData: runCaseToActTopDataParm,
    });
    this.selectKey('EditActualityForecast');

  };

  /**
   * 取得当前选择的月
   * @param month 当前选中的月
   */
  getNowMonth = (month: string) => {
    this.setState({
      nowMonth: month,
    });
  };

  /**
   * Top 画面显示
   */
  showDrawer = () => {
    const { dispatch } = this.props;
    if(this.props.global.inForceFlag){
      Modal.confirm({
        visible:this.state.batchAddVisible,
        icon: <ExclamationCircleOutlined />,
        content:formatMessage({id: 'common.business.activities.content'}),
        closable: true,
        centered: true,
        okText: formatMessage({id: 'common.business.activities.content.ok'}),
        cancelText: formatMessage({id: 'common.business.activities.content.onCancel'}),
        // 这里注意要用箭头函数, 否则this不生效
        onOk: async () => {
          this.setState({
            topVisible: true,
            batchAddVisible: false,
          });
          this.actualityForecastBottom.cancel()
          /* dispatch({
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
           });*/
        },
        onCancel: () => {
          this.setState(
            {
              batchAddVisible: false,
            }
          )
        }
      });
    }else {
      this.setState({
        topVisible: true,
      });
    }
  }

  /**
   * Top 画面关闭
   */
  onClose = () => {
    this.setState({
      topTipModel: true,
    });
  }


  /**
   * Top 画面关闭 确认关闭
   */
  closeOk = () => {
    this.setState({
      topVisible: false,
      topTipModel: false,
    });
    this.actualityForecastBatchAdd.clearTopPage();
    history.push(`/formadvancedformEditAct?id=EditActualityForecast`);
  }

  /**
   * Top 画面关闭 取消
   */
  closeCancel = () => {
    this.setState({
      topTipModel: false,
    });
  }

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

  onRef = (name:string,ref:any) => {
    switch (name) {
      case 'ActualityForecastBottom':
        this.actualityForecastBottom = ref
        break
      case 'ActualityForecastBatchAdd':
        this.actualityForecastBatchAdd = ref
        break
      case 'ActualityForecastBatchAddBudget':
        this.actualityForecastBatchAddBudget = ref
        break
      default:
        break
    }
  }


  render() {
    const { selectKey } = this.state;
    // @ts-ignore
    if(selectKey ===""){
      this.selectKey(this.props.location.query.id);
    }
    // 是否是系统管理员
    let sysAdminFlag: boolean = false;
    if(this.props.user.currentUser !== undefined && this.props.user.currentUser.userDiv==='2'){
      sysAdminFlag = true;
    }else if(this.props.user.currentUser !== undefined && this.props.user.currentUser.userDiv!=='2'){
      sysAdminFlag = false;
    }

    // 是否是营业人员
    let busUserFlag: boolean = false;
    if(this.props.user.currentUser !== undefined && this.props.user.currentUser.userDiv==='1'){
      busUserFlag = true;
    }else if(this.props.user.currentUser !== undefined && this.props.user.currentUser.userDiv!=='1'){
      busUserFlag = false;
    }

    if(this.props.ActForecastData.getMonthNo.monthNo !== undefined &&
      this.props.ActForecastData.getMonthNo.monthNo !== null &&
      this.props.ActForecastData.getMonthNo.monthNo.toString() !== ''
    ){
      monthNo = this.props.ActForecastData.getMonthNo.monthNo
    }
    console.log(`monthNo: ${  this.props.ActForecastData.getMonthNo.monthNo }`);
    const lastYearMonthNo = monthNo - tMonth;
    // 取得 上一年可以修改数据的月份集合
    if(lastYearMonthNo > 0){
      lastYearMonthList = [];
      for(let i = lastYearMonthNo; i > 0; i-=1){
        //  month 从0开始
        let lastOneMonth =moment(myDate).add(i-monthNo, 'month').month().toString();
        if(lastOneMonth === '0' ){
          lastOneMonth = '12'
        }else if(lastOneMonth.length <2){
          lastOneMonth = `0${lastOneMonth}`;
        }
        console.log(`lastOneMonth: ${  lastOneMonth }`);
        lastYearMonthList.push(lastOneMonth.toString());
      }
    }else{
      lastYearMonthList = [];
    }

    this.renderChildren = () => {
      const { ActForecastData } = this.props;
      const {
        userLst,
        searchUserLst,
        authOrgCdLst,
        customerLst,
        allCustomerLst,
        industryLst,
        caseLst,
        caseNumberLst,
        probabilityLst,
        currencyLst,
        effortUnitLst,
        endUserLst,
        allEndUserLst,
        ActBottomData,
        codeValueList,
      } = ActForecastData;

      if (
        customerLst === undefined ||
        industryLst === undefined ||
        caseLst === undefined ||
        caseNumberLst === undefined ||
        probabilityLst === undefined ||
        currencyLst === undefined ||
        effortUnitLst === undefined ||
        endUserLst === undefined ||
        allEndUserLst === undefined ||
        ActBottomData === undefined ||
        allCustomerLst === undefined ||
        codeValueList === undefined ||
        this.props.ActForecastData.getMonthNo.monthNo === 0
      ) {
        return null;
      }

      // 現在の営業者の権限を判断
      let busUserCd = this.props.user.currentUser?.userid;
      let busUserNm = this.props.user.currentUser?.name;
      if(userLst !== undefined && userLst !== null && userLst.length>0){
        const userList = userLst.filter((item)=>item.userNm===busUserNm);
        if(!(userList!==undefined && userList!==null && userList.length>0)){
          busUserCd = userLst[0].userCd;
          busUserNm = userLst[0].userNm;
        }
      }else{
        busUserCd = '';
        busUserNm = '';
      }

      // 現在の営業者の権限を判断
      let searchBusUserCd = this.props.user.currentUser?.userid;
      let searchBusUserNm = this.props.user.currentUser?.name;
      if(searchUserLst !== undefined && searchUserLst !== null && searchUserLst.length>0){
        const searchUserList = searchUserLst.filter((item)=>item.userCd===searchBusUserCd);
        if(!(searchUserList!==undefined && searchUserList!==null && searchUserList.length>0)){
          searchBusUserCd = searchUserLst[0].userCd;
          searchBusUserNm = searchUserLst[0].userNm;
        }
      }else{
        searchBusUserCd = '';
        searchBusUserNm = '';
      }

      let cntrcCurrCd = '';
      let cntrcCurrNm = '';
      if(currencyLst!== undefined && currencyLst !== null && currencyLst.length>0){
        cntrcCurrCd = currencyLst[0].cdVal.toString();
        cntrcCurrNm = currencyLst[0].cdNm;
      }

      let effortUnitCd = '';
      let effortUnitNm = '';
      if(effortUnitLst!== undefined && effortUnitLst !== null && effortUnitLst.length>0){
        effortUnitCd = effortUnitLst[0].cdVal.toString();
        effortUnitNm = effortUnitLst[0].cdNm;
      }

      // 現在の営業者の権限を判断
      let countOrgCd = '';
      let countOrgNm = '';
      if (this.props.ActForecastData.parOrgCdLst && this.props.ActForecastData.parOrgCdLst.length > 0) {
        let parCntrcCurrCd = this.props.ActForecastData.parOrgCdLst[0].parOrgCd;
        if(authOrgCdLst !== undefined && authOrgCdLst !== null && authOrgCdLst.length>0){
          for (let i=0; i < authOrgCdLst.length; i++ ) {
            if (parCntrcCurrCd === authOrgCdLst[i].orgCd) {
              countOrgCd = authOrgCdLst[i].orgCd;
              countOrgNm = authOrgCdLst[i].orgNm;
              break;
            }
          }
        }
      }

      // edit
      switch (selectKey) {
        case 'SearchActualityForecast':
          return (
            <div>
              <SearchActualityForecast
                searchUserLst={searchUserLst}
                busUserCd={searchBusUserCd}
                busUserNm={searchBusUserNm}
              />
            </div>
          );
        case 'SearchRunningCases':
          return (
            <div>
              <SearchRunningCases
                searchUserLst={searchUserLst}
                busUserCd={searchBusUserCd}
                busUserNm={searchBusUserNm}
              />
            </div>
          );
        case 'EditActualityForecast':
          // @ts-ignore
          return (
            <div>
              {sysAdminFlag === true || (busUserFlag === true && this.state.year.localeCompare((tYear).toString()) >= 0) ?(
                <div>
                  <Button  type="primary" onClick={this.showDrawer} className={styles.addButton}>
                    {formatMessage({ id: 'actualityForecast.index.batchAdd' })}
                  </Button>
                  <Drawer
                    className={styles.DrawerStyle}
                    height='375px'
                    placement='top'
                    closable={false}
                    destroyOnClose={true}
                    visible={this.state.topVisible}
                    onClose={this.onClose}
                  >
                    <ActualityForecastBatchAdd
                      actForMoth={this.state.actForMoth}
                      nowMonth={this.state.nowMonth}
                      countOrgCd={countOrgCd}
                      countOrgNm={countOrgNm}
                      busUserCd={busUserCd}
                      busUserNm={busUserNm}
                      cntrcCurrCd={cntrcCurrCd}
                      cntrcCurrNm={cntrcCurrNm}
                      effortUnitCd={effortUnitCd}
                      effortUnitNm={effortUnitNm}

                      RunCaseToActTopData={this.state.RunCaseToActTopData}
                      TopOnClose={this.closeOk}
                      userLst={userLst}
                      authOrgCdLst={authOrgCdLst}
                      customerLst={customerLst}
                      allCustomerLst={allCustomerLst}
                      industryLst={industryLst}
                      caseLst={caseLst}
                      probabilityLst={probabilityLst}
                      currencyLst={currencyLst}
                      effortUnitLst={effortUnitLst}
                      endUserLst={endUserLst}
                      allEndUserLst={allEndUserLst}
                      codeValueList={codeValueList}
                      onRef={this.onRef}
                    />
                  </Drawer>
                </div>
              ) : (
                <div/>
              )}
              {/*<div>*/}
              {/*  <Button  type="primary" onClick={this.showDrawer} className={styles.addButton}>*/}
              {/*    修正*/}
              {/*  </Button>*/}
              {/*  <Drawer*/}
              {/*    className={styles.DrawerStyle}*/}
              {/*    height='375px'*/}
              {/*    placement='top'*/}
              {/*    closable={false}*/}
              {/*    visible={this.state.topVisible}*/}
              {/*    onClose={this.onClose}*/}
              {/*  >*/}
              {/*    <ActualityForecastBatchAddBusiness*/}
              {/*      actForMoth={this.state.actForMoth}*/}
              {/*      nowMonth={this.state.nowMonth}*/}
              {/*      customerLst={customerLst}*/}
              {/*      userLst={userLst}*/}
              {/*      caseLst={caseLst}*/}
              {/*      endUserLst={endUserLst}*/}
              {/*      allEndUserLst={allEndUserLst}*/}
              {/*      allCustomerLst={allCustomerLst}*/}
              {/*      codeValueList={codeValueList}*/}
              {/*      TopOnClose={this.closeOk}*/}
              {/*      relatedNo={'b012202104141827630'}*/}
              {/*      busActId={'1260'}*/}
              {/*      btnStatus={true}*/}
              {/*      onRef={this.onRef}*/}
              {/*    />*/}
              {/*  </Drawer>*/}
              {/*</div>*/}
              <ActualityForecastBottom
                actForMoth={ sysAdminFlag === true || this.props.user.currentUser?.dspYear === tYear.toString() ? this.state.actForMoth :
                  lastYearMonthList.length>0 ? lastYearMonthList[lastYearMonthList.length - 1] : '12'}
                getNowMonth={this.getNowMonth}
                countOrgCd={countOrgCd}
                countOrgNm={countOrgNm}
                busUserCd={busUserCd}
                busUserNm={busUserNm}
                cntrcCurrCd={cntrcCurrCd}
                cntrcCurrNm={cntrcCurrNm}
                effortUnitCd={effortUnitCd}
                effortUnitNm={effortUnitNm}
                onRef={this.onRef}
                userLst={userLst}
                authOrgCdLst={authOrgCdLst}
                customerLst={customerLst}
                allCustomerLst={allCustomerLst}
                industryLst={industryLst}
                caseLst={caseLst}
                probabilityLst={probabilityLst}
                currencyLst={currencyLst}
                effortUnitLst={effortUnitLst}
                endUserLst={endUserLst}
                allEndUserLst={allEndUserLst}
                codeValueList={codeValueList}
                noYear={tYear.toString()}
                // 上一年可以修改的月份集合
                lastYearMonthList={lastYearMonthList}
              />
            </div>
          );
        case 'EditRunningCases':
          return (
            <RunningCases
              cntrcCurrCd={cntrcCurrCd}
              cntrcCurrNm={cntrcCurrNm}
              effortUnitCd={effortUnitCd}
              effortUnitNm={effortUnitNm}
              busUserCd={busUserCd}
              busUserNm={busUserNm}
              runCaseToActTop={this.runCaseToActTop}
              topOpen={this.showDrawer}
              userLst={userLst}
              customerLst={customerLst}
              allCustomerLst={allCustomerLst}
              industryLst={industryLst}
              currencyLst={currencyLst}
              effortUnitLst={effortUnitLst}
              probabilityLst={probabilityLst}
              noYear={tYear.toString()}
            />
          );
        default:
          break;
      }

      return null;
    };

    // true： edit, false: search
    let editOrSearch: boolean;
    if(sysAdminFlag === true ){
      editOrSearch= true;
    }else if(busUserFlag === true && this.state.year.localeCompare(tYear.toString()) >= 0) {
      editOrSearch= true;
    }else if(busUserFlag === true && this.state.year === (tYear-1).toString() && tMonth+1 <= monthNo){
      editOrSearch= true;
    } else {
      editOrSearch= false;
    }

    return (
      <GridContent>
        <div
          className={styles.main}
          ref={(ref) => {
            if (ref) {
              this.main = ref;
            }
          }}
        >
          {/*  <div className={styles.leftMenu}>
            <Menu
              defaultSelectedKeys={editOrSearch === true ? ['EditActualityForecast']:['SearchActualityForecast']}
              defaultOpenKeys={editOrSearch === true ?['sub1','sub2']:['sub1']}
              mode="inline"
              selectedKeys={['']}
            >
              <SubMenu
                key="sub1"
                title={formatMessage({ id: 'common.message.searchMenu' })}
                icon={<SearchOutlined />}
                className={styles.subMenu}
              >
                {selectKey === 'SearchActualityForecast' ? (
                    <Menu
                      mode="vertical"
                      selectedKeys={[selectKey]}
                      onClick={({ key }) => this.selectKey(key as AccountSettingsStateKeys)}
                      className={styles.menu}
                    >
                      <Menu.Item
                        className="ant-menu-item ant-menu-item-only-child ant-menu-item-selected"
                        key="SearchActualityForecast"
                      >
                        {formatMessage({ id: 'actualityForecast.index.ActualityForecast' })}
                      </Menu.Item>

                      <Menu.Item
                        className="ant-menu-item ant-menu-item-only-child"
                        key="SearchRunningCases"
                      >
                        {formatMessage({ id: 'actualityForecast.index.RunningCases' })}
                      </Menu.Item>
                    </Menu>
                  )
                  :
                  (
                    <div/>
                  )
                }

                {selectKey === 'SearchRunningCases' ? (
                    <Menu
                      mode="vertical"
                      selectedKeys={[selectKey]}
                      onClick={({ key }) => this.selectKey(key as AccountSettingsStateKeys)}
                      className={styles.menu}
                    >
                      <Menu.Item
                        className="ant-menu-item ant-menu-item-only-child"
                        key="SearchActualityForecast"
                      >
                        {formatMessage({ id: 'actualityForecast.index.ActualityForecast' })}
                      </Menu.Item>

                      <Menu.Item
                        className="ant-menu-item ant-menu-item-only-child ant-menu-item-selected"
                        key="SearchRunningCases"
                      >
                        {formatMessage({ id: 'actualityForecast.index.RunningCases' })}
                      </Menu.Item>
                    </Menu>
                  )
                  :
                  (
                    <div/>
                  )
                }

                {selectKey !== 'SearchActualityForecast' && selectKey !== 'SearchRunningCases' ? (
                    <Menu
                      mode="vertical"
                      selectedKeys={[selectKey]}
                      onClick={({ key }) => this.selectKey(key as AccountSettingsStateKeys)}
                      className={styles.menu}
                    >
                       {this.getMenu()}
                      <Menu.Item
                        className="ant-menu-item ant-menu-item-only-child"
                        key="SearchActualityForecast"
                      >
                        {formatMessage({ id: 'actualityForecast.index.ActualityForecast' })}
                      </Menu.Item>

                      <Menu.Item
                        className="ant-menu-item ant-menu-item-only-child"
                        key="SearchRunningCases"
                      >
                        {formatMessage({ id: 'actualityForecast.index.RunningCases' })}
                      </Menu.Item>
                    </Menu>
                  )
                  :
                  (
                    <div/>
                  )
                }

              </SubMenu>

                {editOrSearch === true ?(
                  <SubMenu
                    key="sub2"
                    title={formatMessage({ id: 'common.message.editMenu' })}
                    icon={<EditOutlined />}
                    className={styles.subMenu}
                  >
                    {selectKey === 'EditActualityForecast' ? (
                        <Menu
                          mode="vertical"
                          selectedKeys={[selectKey]}
                          onClick={({ key }) => this.selectKey(key as AccountSettingsStateKeys)}
                          className={styles.menu}
                        >
                            <Menu.Item
                              className="ant-menu-item ant-menu-item-only-child ant-menu-item-selected"
                              key="EditActualityForecast"
                            >
                              {formatMessage({ id: 'actualityForecast.index.ActualityForecast' })}
                            </Menu.Item>

                            <Menu.Item
                              className="ant-menu-item ant-menu-item-only-child"
                              key="EditRunningCases"
                            >
                              {formatMessage({ id: 'actualityForecast.index.RunningCases' })}
                            </Menu.Item>
                        </Menu>
                      )
                      :
                      (
                        <div/>
                      )
                    }

                    {selectKey === 'EditRunningCases' ? (
                        <Menu
                          mode="vertical"
                          selectedKeys={[selectKey]}
                          onClick={({ key }) => this.selectKey(key as AccountSettingsStateKeys)}
                          className={styles.menu}
                        >
                          <Menu.Item
                            className="ant-menu-item ant-menu-item-only-child"
                            key="EditActualityForecast"
                          >
                            {formatMessage({ id: 'actualityForecast.index.ActualityForecast' })}
                          </Menu.Item>

                          <Menu.Item
                            className="ant-menu-item ant-menu-item-only-child ant-menu-item-selected"
                            key="EditRunningCases"
                          >
                            {formatMessage({ id: 'actualityForecast.index.RunningCases' })}
                          </Menu.Item>
                        </Menu>
                      )
                      :
                      (
                        <div/>
                      )
                    }

                    {selectKey !== 'EditActualityForecast' && selectKey !== 'EditRunningCases' ? (
                        <Menu
                          mode="vertical"
                          selectedKeys={[selectKey]}
                          onClick={({ key }) => this.selectKey(key as AccountSettingsStateKeys)}
                          className={styles.menu}
                        >
                           {this.getMenu()}
                          <Menu.Item
                            className="ant-menu-item ant-menu-item-only-child"
                            key="EditActualityForecast"
                          >
                            {formatMessage({ id: 'actualityForecast.index.ActualityForecast' })}
                          </Menu.Item>

                          <Menu.Item
                            className="ant-menu-item ant-menu-item-only-child"
                            key="EditRunningCases"
                          >
                            {formatMessage({ id: 'actualityForecast.index.RunningCases' })}
                          </Menu.Item>
                        </Menu>
                      )
                      :
                      (
                        <div/>
                      )
                    }

                  </SubMenu>
                ):(<div/>)}

            </Menu>
          </div> */}
          <div className={styles.right}>{this.renderChildren()}</div>
        </div>

        {/* Top close tip Model */}
        <Modal
          visible={this.state.topTipModel === true }
          closable={false}
          centered={true}
          onOk={this.closeOk}
          onCancel={this.closeCancel}
          okText={formatMessage({ id: 'actualityForecastTop.messageModel.confirm' })}
          cancelText={formatMessage({ id: 'actualityForecastTop.messageModel.cancel' })}
          destroyOnClose
          maskClosable={false}
        >
          <p>{formatMessage({ id: 'actualityForecast.topCloseTip.message' })}</p>
        </Modal>
      </GridContent>
    );
  }
}

export default connect(
  ({
     ActForecastData,
     user,
     global
   }: {
    ActForecastData: any;
    loading: {
      effects: { [key: string]: boolean };
    };
    user: ConnectState;
    global:ConnectState;
  }) => ({
    ActForecastData,
    user,
    global
  }),
  // @ts-ignore
)(Index);
