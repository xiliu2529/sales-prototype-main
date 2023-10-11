import { GridContent } from '@ant-design/pro-layout';
import {connect, Dispatch} from 'umi';
import React, { Component } from 'react';
import { Col, Row } from 'antd';
import {AnalysisData, HomeRankOrderModel} from "@/pages/HomePage/data";
import "./index.less";
import ActualAmountChar from "@/pages/HomePage/components/ActualAmountChar/index";
import {EchartsState} from "@/pages/HomePage/model";
import MemberPie, {PieProps} from "@/pages/HomePage/components/Pie/memberPie";
import {ConnectState} from "@/models/connect";
import CustOrEnd from "./components/Pie/custOrEnd";
import MonthlyPerformance from "./components/MonthlyPerformance/index";
import RankOrder from "./components/Rank/rankOrder";
import Gauge from "@/pages/HomePage/components/Gauge";
import {SelectUserNmItem} from "@/models/global";



interface SalesDataProps {
  salesData: AnalysisData;
  dispatch: Dispatch;
  homeRankOrderModel:[];
  loading: boolean;
  selectUserName:SelectUserNmItem[];
  oncust:boolean;
}


class SalesDataAnalysis extends Component<SalesDataProps>{
  reqRef: number = 0;

  timeoutId: number = 0;

  constructor(props: Readonly<PieProps>) {
    // @ts-ignore
    super(props);
    this.state = {
      // loginUserCd:'',
      // dspYear:'',
      // dspCurrCd:'',
      menuData:{},
    }
  }

  /**
   * 设置选中的用户
   * @param payload
   */
    selectUserNameMenu = (payload: SelectUserNmItem): void => {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'global/selectUserNameMenu',
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
    
    const { user,cust,global,selectUserName,mainGraphLeft,oncust} = this.props;
    const loginUserCd=user.currentUser.userid;  
    const {dspYear} = user.currentUser;
    const {dspCurrCd} = user.currentUser;
    const language = user.currentUser.dspLang;
    let menuData = {};
    // ページ登録にメニューが選択されていない場合は、ログイン時のデフォルトをとります
    if(this.props.location.state===null || this.props.location.state === undefined
      || this.props.location.state.menuData === null || undefined === this.props.location.state.menuData ) {
      if (global.selectMenu === null || undefined === global.selectMenu || global.selectMenu.length <= 0) {
        return null;
      } else if(global.selectMenu
        && global.homePageMenu
        && (global.homePageMenu[0].selectedKeys !== global.selectMenu[0].selectedKeys)) {
        global.selectMenu = global.homePageMenu;

      }
      menuData = global.selectMenu[0].selectMenuData;
    }
    else{
      // ページ登録後にメニューを選択する場合は、選択した内容をとります
      global.selectMenu = global.homePageMenu;
      menuData = this.props.location.state.menuData
      if (global.userOrgInfoList !== null && undefined !== global.userOrgInfoList && global.userOrgInfoList.length > 0){
        const selectMenu = global.userOrgInfoList.filter((item: { key: any; orgDiv: any; })=>item.key === this.props.location.state.key && item.orgDiv === menuData.orgType)
        if(selectMenu !== null && undefined !== selectMenu && selectMenu.length > 0){
          menuData.tabName = selectMenu[0].title;
        }
      }
    }
    this.changeRightMenu(false,false,false,false,false,false);
    // @ts-ignore
    const {userCd} = menuData;
  
    
    // @ts-ignore
    const userOrgCd = menuData.orgCd;
    const userOrgDiv = menuData.orgType
    const typeNm = menuData.tabName
    const typedDivi = menuData.tabType;

    // 当月の取得 2021/10/08 start
    // @ts-ignore
    let currentMonth= "";
    if (mainGraphLeft !== undefined &&  mainGraphLeft !== null) {
      currentMonth = mainGraphLeft[2].title.substring(mainGraphLeft[2].title.length-2,mainGraphLeft[2].title.length);
    }
    const disMonth = currentMonth;
    // 当月の取得 2021/10/08 end

    const caseParam: HomeRankOrderModel = {loginUserCd,dspYear,dspCurrCd,language,userCd,userOrgCd,userOrgDiv,typeNm,typedDivi,disMonth,oncust};
    const homeRankOrderModel = JSON.stringify(caseParam);

    return homeRankOrderModel;
  }

  // コンポーネントの更新が完了したらすぐに呼び出します。初期化時には呼び出しされません
 async componentDidUpdate() {

   // @ts-ignore
   const {global, dispatch, user,selectUserName,oncust} = this.props;

   // @ts-ignore
   const {menuData} = this.state

   let data = {};
   if (this.props.location.state === null || this.props.location.state === undefined
     || this.props.location.state.menuData === null || undefined === this.props.location.state.menuData) {
     if (global.selectMenu === null || undefined === global.selectMenu || global.selectMenu.length <= 0) {
       return;
     }

     data = global.selectMenu[0].selectMenuData;
   } else {
     data = this.props.location.state.menuData
     if (global.userOrgInfoList !== null && undefined !== global.userOrgInfoList && global.userOrgInfoList.length > 0) {
       const selectMenu = global.userOrgInfoList.filter((item) => item.key === this.props.location.state.key && item.orgDiv === data.orgType)
       if (selectMenu !== null && undefined !== selectMenu && selectMenu.length > 0) {
         data.tabName = selectMenu[0].title;
       }
     }
   }
   if (menuData !== data) {
     const homeRankOrderModel = this.params();

     let paramsUserNm;
     let userOrgDiv;
     let userCd;
     let typeNm;
     // eslint-disable-next-line prefer-const
     paramsUserNm = JSON.parse(homeRankOrderModel);
     // eslint-disable-next-line prefer-const
     userOrgDiv = paramsUserNm.userOrgDiv;
     // eslint-disable-next-line prefer-const,prefer-destructuring
     userCd = paramsUserNm.userCd;
     // eslint-disable-next-line prefer-const
     typeNm = paramsUserNm.typeNm;
     if(selectUserName !== [] && selectUserName.length !==0 && paramsUserNm.typedDivi === "1" && paramsUserNm.userOrgDiv ==="2"){
       this.selectUserNameMenu(selectUserName);
     }else if (userOrgDiv === "2") {
       const selectUserNm: SelectUserNmItem = {
         userCd: userCd[0],
         userNm: typeNm
       }
       this.selectUserNameMenu(selectUserNm);
     } else if (user.currentUser.userDiv === "1" && userOrgDiv !== "2") {
       const selectUserNm: SelectUserNmItem = {
         userCd: user.currentUser.userid,
         userNm: user.currentUser.name
       }
       this.selectUserNameMenu(selectUserNm);
     } else if (user.currentUser.userDiv !== "1" && userOrgDiv !== "2") {
       // @ts-ignore
       this.selectUserNameMenu([]);
     }

     this.setState({menuData: data})

     await dispatch({
       type: 'homePage/fetch',
       payload: {
         homeRankOrderModel,
       },
     });
     await dispatch({
       type: 'homePage/fetchGraph',
       payload: {
         homeRankOrderModel,
       },
     });
     await dispatch({
       type: 'homePage/fetchMainGraphLeft',
       payload: {
         homeRankOrderModel,
       },
     });
     await dispatch({
       type: 'homePage/fetchBudgetOrHistData',
       payload: {
         homeRankOrderModel,
       },
     });
     await dispatch({
       type: 'homePage/fetchCustomerData',
       payload: {
         homeRankOrderModel,
       },
     });
     await dispatch({
       type: 'homePage/fetchEndUserData',
       payload: {
         homeRankOrderModel,
       },
     });
     await dispatch({
       type: 'homePage/fetchMemberData',
       payload: {
         homeRankOrderModel,
       },
     });

   }
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

 // ページの最初のレンダリングの後に呼び出します
  async componentDidMount() {
    // @ts-ignore
    const {dispatch, user, selectUserName,global} = this.props;
    // eslint-disable-next-line consistent-return
    this.changeBaseMenuShowState(true);
    const homeRankOrderModel = this.params();

    let paramsUserNm;
    let userOrgDiv;
    let userCd;
    let typeNm;
    // eslint-disable-next-line prefer-const
    paramsUserNm = JSON.parse(homeRankOrderModel);
    if (!paramsUserNm) {
      return;
    }
    // eslint-disable-next-line prefer-const
    userOrgDiv = paramsUserNm.userOrgDiv;
    // eslint-disable-next-line prefer-const,prefer-destructuring
    userCd = paramsUserNm.userCd;
    // eslint-disable-next-line prefer-const
    typeNm = paramsUserNm.typeNm;

    if(this.props.location.state===null || this.props.location.state === undefined
      || this.props.location.state.menuData === null || undefined === this.props.location.state.menuData ) {
      if (global.selectMenu === null || undefined === global.selectMenu || global.selectMenu.length <= 0) {
        return null;
      }
    const selectMenuUserItem:any[]=[];
    global.selectMenu.map((item: any) => {
      // @ts-ignore
      if (item.selectMenuData.orgType === "2" && item.selectMenuData.tabType !=="1") {
        selectMenuUserItem.push(item)
      }
    })
    if(selectMenuUserItem!==[] && selectMenuUserItem.length !==0) {
      const selectUserNm: SelectUserNmItem = {
        userCd: selectMenuUserItem[0].selectMenuData.userCd[0],
        userNm: selectMenuUserItem[0].selectMenuData.tabName
      }
      this.selectUserNameMenu(selectUserNm);
    }
    }else{
      if(selectUserName !== [] && selectUserName.length !==0 && paramsUserNm.typedDivi === "1" && paramsUserNm.userOrgDiv ==="2"){
        this.selectUserNameMenu(selectUserName);
      }else if (userOrgDiv === "2") {
        const selectUserNm: SelectUserNmItem = {
          userCd: userCd[0],
          userNm: typeNm
        }
        this.selectUserNameMenu(selectUserNm);
      } else if (user.currentUser.userDiv === "1" && userOrgDiv !== "2") {
        const selectUserNm: SelectUserNmItem = {
          userCd: user.currentUser.userid,
          userNm: user.currentUser.name
        }
        this.selectUserNameMenu(selectUserNm);
      } else if (user.currentUser.userDiv !== "1" && userOrgDiv !== "2") {
        // @ts-ignore
        this.selectUserNameMenu([]);
      }
    }

    //  this.reqRef = requestAnimationFrame(() => {
    //   dispatch({
    //     type: 'homePage/fetch',
    //     payload: {
    //       homeRankOrderModel,
    //     },
    //   });
    // });

    if (homeRankOrderModel === null)
      return;
    await dispatch({
      type: 'homePage/fetch',
      payload: {
        homeRankOrderModel,
      },
    });
    await dispatch({
      type: 'homePage/fetchGraph',
      payload: {
        homeRankOrderModel,
      },
    });
  }

  // コンポーネントをDOMから外す前にすぐに呼び出します

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'homePage/clear',
    });
    cancelAnimationFrame(this.reqRef);
    clearTimeout(this.timeoutId);
  }


  render() {
    // @ts-ignore
    const { analysisData,graphData,user,mainGraphLeft } = this.props;

    if (!analysisData||!graphData || !mainGraphLeft) {
      return null;
    }
    let params;
    let typedDivi;
    // @ts-ignore
    // eslint-disable-next-line prefer-const
    params=JSON.parse(this.params());
    if(params === null || params === undefined || params ===""){
      return null;
    }
    // eslint-disable-next-line prefer-const
    typedDivi=params.typedDivi;

    // @ts-ignore
    return(
      <GridContent>
        <React.Fragment>
         <Row
            gutter={24}
            align="middle">
            <Col xl={5} lg={24} md={24} sm={24} xs={24}>
              <div >
                <ActualAmountChar title='' homeRankOrderModel={this.params()}/>
              </div>
            </Col>
            <Col xl={19} lg={24} md={24} sm={24} xs={24}>
              <RankOrder title='' homeRankOrderModel={this.params()} />
            </Col>
          </Row>
          <Row
            gutter={24}
            align="middle">
            <Col xl={12} lg={24} md={24} sm={24} xs={24}>

              <MonthlyPerformance title='' homeRankOrderModel={this.params()}/>
            </Col>
            <Col xl={12} lg={24} md={24} sm={24} xs={24}>
              { typedDivi === '1' ?
                //	INパラメータ_タブ区分＝Totalタブの場合、Memberの＜＜グラフ図＞＞と＜＜リスト＞＞を表示する
                // @ts-ignore
                <MemberPie homeRankOrderModel={this.params()}/>
                :
                // INパラメータ_タブ区分≠Totalタブの場合、Customerの＜＜グラフ図＞＞と＜＜リスト＞＞を表示する
                //当IN参数_标签区分不等于总计标签时，应该显示客户的<<图表>>和<<列表>>。
                // @ts-ignore
                <CustOrEnd homeRankOrderModel={this.params()}/>
              }

            </Col>
          </Row>
        </React.Fragment>
      </GridContent>
    );
  }
}
export default connect(
  ({
     homePage:{analysisData,graphData,mainGraphLeft},
     user,
     global,
   }: {
    homePage: EchartsState;
    loading: {
      effects: { [key: string]: boolean };
    };
    user:ConnectState;
    global:ConnectState;
  }) => ({
    analysisData,
    graphData,
    user,
    global,
    mainGraphLeft,
    selectUserName:global.selectUserName,

    oncust:global.oncust
  }),
)(SalesDataAnalysis)
