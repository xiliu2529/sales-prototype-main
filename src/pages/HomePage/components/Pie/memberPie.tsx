import React, { Component } from 'react';
import  'echarts/lib/chart/pie';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import ReactEcharts from 'echarts-for-react'
import {Dispatch, EchartsState} from "@@/plugin-dva/connect";
import CustomerBar from "@/pages/HomePage/components/CustomerBar";

import {Button, Col, Modal, Row, Switch} from "antd";
import CustomerRanking from "@/pages/HomePage/components/CustomerRanking";
import {connect} from "umi";
import {formatMessage} from "@@/plugin-locale/localeExports";
import atlas from "@/assets/atlas.png";
import columnarAtlas from "@/assets/columnarAtlas.png";
import setting from "@/assets/setting.png";
import styles from "@/pages/HomePage/components/CustomerRanking/index.less";
import ReactTooltip from "react-tooltip";
import '@/pages/HomePage/components/Trans/index.less';
import CustomerRankingTrans from '../Trans/CustomerRankingTrans';
import classNames from "classnames";
  import { ConnectState } from '@/models/connect';


export interface PieProps {
  title: React.ReactNode;
  budgetOrhistorical?:boolean;
  typIndex?:number;
  visible:boolean;
  dispatch: Dispatch;
  oncust:boolean;
}

class MemberPie extends Component<PieProps>{
  constructor(props: Readonly<PieProps>) {
    super(props);
    this.state = {
      typIndex:0,
      visible: false,
      modalKey:0,
    };
    this.refresh = this.refresh.bind(this);
    this.chartChange = this.chartChange.bind(this);
    this.barChange = this.barChange.bind(this);
  }

/*
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  refresh = (rankingRight:any) => {
    rankingRight.forEach((Item:any)=>{
      // todo 穿梭框传参
      /!* alert(JSON.stringify(rankingRight[Item.key])); *!/
    })

  /!*  const { dispatch } = this.props;
    dispatch({
      type: 'homePage/fetchCustOrEndUserData',
      payload:{}
    }); *!/
  }; */

  // ポップアップの設定ボックスを閉じます
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleCancel = (e: any) => {
    // @ts-ignore
    const {modalKey} = this.state;
    this.setState({
      visible: false,
      modalKey: modalKey + 1,
    });
  };

  //  円グラフに切り替え
  chartChange() {
    this.setState({
      typIndex: 0,
    });
  }

  // ヒストグラムに切り替え
  barChange() {
    this.setState({
      typIndex: 1,
    });
  }


  componentDidMount() {
    // @ts-ignore
    const { dispatch,homeRankOrderModel } = this.props;
   dispatch({
      type: 'homePage/fetchMemberData',
      payload: {
        homeRankOrderModel,
      },
    });
  }

  getOption = (pieData:any,)=>{
    const legendData: any[] = [];
    const chartData: any[] = [];
    pieData.forEach((item: any)=>{
      legendData.push(item.name);
    })

    pieData.forEach((item: any)=>{
      chartData.push({value:item.amount,name:item.name });
    })

    let option;
    // eslint-disable-next-line prefer-const
    option = {
      backgroundColor: '#FFFFFF',
      color: ['#366181', '#7ECBEE', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
      tooltip: {
        trigger: 'item',
        // formatter: '{b}<br/>{c} ({d}%)'
        formatter(v:any) {return `${v.name  }<br/>${formatNum(parseFloat(v.value).toFixed(0))} (${  v.percent.toFixed(0)  }%)`;},
      },

      series: [
        {
          name: 'Customer data',
          type: 'pie',
          radius: ['20%', '60%'],
          center: ['50%', '50%'],
          label: {
            formatter(v:any) {return `${v.name  }\n{per|${  v.percent.toFixed(0)  }%}`;},
            position: 'inner',
            rich: {
              per: {
                fontSize: 10,
                color: '#FFFFFF'
              }
            }
          },
          itemStyle: { // 此配置
            normal: {
              borderWidth: 4,
              borderColor: '#ffffff',
            },
            emphasis: {
              borderWidth: 0,
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          data:chartData
        }
      ]
    };

    function formatNum(strNum: string | number | any[]) {
      if (typeof strNum !== "number" && strNum?.length <= 3) {
        return strNum;
      }
      if (!/^(\+|-)?(\d+)(\.\d+)?$/.test(strNum as string)) {
        return strNum;
      }
      const a = RegExp.$1; let b = RegExp.$2; const c = RegExp.$3;
      // @ts-ignore
      const re = new RegExp();
      // @ts-ignore
      re.compile("(\\d)(\\d{3})(,|$)");
      while (re.test(b)) {
        b = b.replace(re, "$1,$2$3");
      }
      return `${a  }${  b  }${  c}`;
    }
    return option;
  }

  //
  // @ts-ignore
  // eslint-disable-next-line consistent-return
  PieOrBar= (custOrEndUData:any, memberRanking: any)=> {

     let percentAll:number = 0;
     let amountAll:number =0;
     let amountSelect:number =0;
     let percent:number  = 0;
     let otherAmount:number =0;
     const memberData:any[]=[];

     // バックグラウンドから戻ってきたお客様またはエンドユーザのデータ
    // @ts-ignore
    custOrEndUData.forEach((item:any) => {
      percentAll += Number(item.percent);
      amountSelect += Number(item.amount);
      // 四捨五入は二桁の小数を取る
      // eslint-disable-next-line no-param-reassign
      item.amount = parseFloat(item.amount).toFixed(0);
      memberData.push(item);
      }
    )

    // すべてのデータの金額
    memberRanking.forEach((item:any) => {
      amountAll += Number(item.amount);
    })

    // 残りのデータの金額とパーセント =すべてのデータの金額 - バックグラウンドから戻ってきたお客様またはエンドユーザのデータ
    // @ts-ignore
    percent = 100 - percentAll;
    otherAmount=amountAll-amountSelect;

    // すべてのデータの長さは5以下で、取得した顧客または最終ユーザーのデータの長さはすべてのデータの長さより小さく、5未満の場合は、すべてのデータを顧客または最終ユーザのデータの残りのデータに投げ出して配列に加える
    if(memberRanking.length!== null && memberRanking.length<5 && custOrEndUData.length < memberRanking.length && custOrEndUData.length<5){
      memberData.push({amount:otherAmount.toFixed(0),effort: "",code: "",name: "Other",shrtNm: "",key:"",percent:percent})
    }
    // すべてのデータの長さは5に等しく、取得した顧客または最終ユーザのデータの長さはすべてのデータの長さより小さく、5以下になったら、すべてのデータを顧客または最終ユーザのデータの残りのデータを投げ出して配列に加える
    if(memberRanking.length!== null && memberRanking.length === 5 && custOrEndUData.length < memberRanking.length && custOrEndUData.length<5){
      memberData.push({amount:otherAmount.toFixed(0),effort: "",code: "",name: "Other",shrtNm: "",key:"",percent:percent})
    }
    // すべてのデータの長さは5より大きく、取得した顧客または最終ユーザのデータの長さはすべてのデータの長さより小さく、5未満の後、すべてのデータを顧客または最終ユーザのデータの残りのデータを投げ出して配列に加える
    if(memberRanking.length!== null && memberRanking.length > 5 && custOrEndUData.length < memberRanking.length && custOrEndUData.length<5){
      memberData.push({amount:otherAmount.toFixed(0),effort: "",code: "",name: "Other",shrtNm: "",key:"",percent:percent})
    }
    if(memberRanking.length!== null && memberRanking.length > 5 && custOrEndUData.length < memberRanking.length && custOrEndUData.length>5){
      memberData.push({amount:otherAmount.toFixed(0),effort: "",code: "",name: "Other",shrtNm: "",key:"",percent:percent})
    }
    if(memberRanking.length!== null && memberRanking.length > 5 && custOrEndUData.length < memberRanking.length && custOrEndUData.length===5){
      memberData.push({amount:otherAmount.toFixed(0),effort: "",code: "",name: "Other",shrtNm: "",key:"",percent:percent})
    }

    // 円グラフ表示
    // @ts-ignore
    if (this.state.typIndex === 0) {
      return (
        <ReactEcharts option={this.getOption(memberData)} style={{top: 10, width: '110%', height: '300%'}}/>
      )
    }
    // ヒストグラム表示
    // @ts-ignore
    // eslint-disable-next-line no-lonely-if
    if (this.state.typIndex === 1) {
      return (
        <CustomerBar customerBar={custOrEndUData} title=''/>
      )
    }
  }

   // 設定ポップアップを送信
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  refresh = async () => {
    // @ts-ignore
    const {dispatch, homeRankOrderModel} = this.props;

    // @ts-ignore
    let homeRankSettingModel:string=[];
    // @ts-ignore
    homeRankSettingModel = this.settingParams([], this.state.rankingRightData, homeRankOrderModel);

    await dispatch({
      type: 'homePage/fetchSettingRefreshData',
      payload: {
        homeRankSettingModel,
      },
    });

    await dispatch({
      type: 'homePage/fetchMemberData',
      payload: {
        homeRankOrderModel,
      },
    });

    this.setState({
      visible: false
    });
  }


 // 枠で提出するときに選択した値を設定します
  refreshParams = (rankingRight:any) => {
    const rankingData3=rankingRight;
    this.setState({
        // eslint-disable-next-line react/no-unused-state
        rankingRightData:rankingData3,
      }
    )
    return rankingData3;
  }

  // 枠提出時にバックグラウンドに送るパラメータを設定します
  // @ts-ignore
  settingParams= (memberDataList: any,rightData1:any,homeRankOrderModel:any)=>{
    let params;
    // eslint-disable-next-line prefer-const
    params=JSON.parse(homeRankOrderModel);

    const {dspYear} = params;
    const userCd = params.loginUserCd;
    let type="";
    const homeRankOrderList:never[]=[];let homePageRightDownRankList:[];

    // eslint-disable-next-line prefer-const
      homePageRightDownRankList=memberDataList;
      type ="MEMBER";

    // eslint-disable-next-line @typescript-eslint/no-redeclare
    const rightData=rightData1;
    // @ts-ignore
    const caseParam: HomeRankSettingModel = {dspYear,userCd,type,homeRankOrderList,homePageRightDownRankList,rightData};
    const homeRankSettingModel = JSON.stringify(caseParam);
    return homeRankSettingModel;
  }

  // ポップアップの設定ボックスを表示します
  showModal = async () => {

    // @ts-ignore
    const {dispatch, homeRankOrderModel, memberDataList} = this.props;

    memberDataList.right.forEach((item: { title: any; }) => delete item.title)

    // @ts-ignore
    let homeRankSettingModel: string = [];

    homeRankSettingModel = this.settingParams(memberDataList.right, [], homeRankOrderModel);

    await dispatch({
      type: 'homePage/fetchSettingData',
      payload: {
        homeRankSettingModel,
      },
    });
    await dispatch({
      type: 'homePage/fetchMemberData',
      payload: {
        homeRankOrderModel,
      },
    });

    this.setState({
      // eslint-disable-next-line react/no-unused-state
      visible: true,
    });
  };



  render() {
    // @ts-ignore
    const {memberDataList,settingData,oncust,homeRankOrderModel} = this.props;
     let homeRankOrderModel1 = null;
      if(homeRankOrderModel){
        homeRankOrderModel1 =  JSON.parse(homeRankOrderModel)
       
      }
    
    if(!memberDataList  || !settingData){
      return null;
    }
    let memberData; let memberRanking;
    let transSourceDataMember: any[]=[];

    // eslint-disable-next-line prefer-const
    memberData=memberDataList.left;
    // eslint-disable-next-line prefer-const
    memberRanking=memberDataList.right;

    if(memberRanking !== null && memberRanking.length>0){
      // eslint-disable-next-line prefer-const
      memberRanking.forEach((item:any)=>{
        // eslint-disable-next-line no-param-reassign
        item.key = item.code;
        // eslint-disable-next-line no-param-reassign
        item.title = item.name;
        transSourceDataMember.push(item)
      })
    }

    const rankRight:any[]=[];
    for(let i=0;i<settingData.right.length;i+=1){
      // @ts-ignore
      rankRight.push(settingData.right[i].key);
    }


    // @ts-ignore
    const {visible}=this.state;

    // @ts-ignore
    // @ts-ignore
    return (
      <Row
        gutter={24}
        align="middle">
        <Col xl={12} lg={24} md={24} sm={24} xs={24}>
          {this.PieOrBar(memberData,memberRanking)}


          <Modal
            className={classNames(styles.modalStyle)}
            title=  { oncust && homeRankOrderModel1.userCd !== null ?
              formatMessage({ id: 'homepage.basic.Customerranking' }) :
              formatMessage({ id: 'homepage.basic.Memberranking' })
            }
            visible={visible}
            onCancel={this.handleCancel}
            key={this.state.modalKey}
            footer={[
              <Button key="back"  type="primary" onClick={this.handleCancel}>{formatMessage({ id: 'homepage.basic.SetCancel' })} </Button>,
              // eslint-disable-next-line react/jsx-no-bind
              <Button key="submit" type="primary"  onClick={this.refresh}>{formatMessage({ id: 'homepage.basic.SetRefresh' })}
              </Button>]}
          >
            <CustomerRankingTrans  refreshParams={this.refreshParams} customerRankingRight={rankRight} dataSource={transSourceDataMember}/>
          </Modal>
          <img src={setting} alt="" data-tip={formatMessage({ id: 'homepage.basic.SetDisplayitem' })}  data-place = "bottom" data-type='light' data-class={styles.Suspensionframe1} style={{position: 'absolute', left: '10%', bottom: '80%', fontSize: '20px', color: '#003D82',cursor:"pointer" }}  onClick={this.showModal}/>
          <ReactTooltip />

          {/* <CustomerRankingTrans refresh={this.refresh}
                                customerRankingLeft={rankingLeft}
                                customerRankingRight={rankingRight} title={titleValue} keys={rankingRight.length} /> */}

          <img src={columnarAtlas} alt="" style={{position: 'absolute', left: '24%', bottom: '80%', fontSize: '20px', color: '#003D82',cursor:"pointer" }} onClick={this.barChange}/>
          <img src={atlas} alt="" style={{position: 'absolute', left: '17%', bottom: '80%', fontSize: '20px', color: '#003D82' ,cursor:"pointer"}} onClick={this.chartChange}/>

        </Col>
        <Col xl={12} lg={24} md={24} sm={24} xs={24} >
        {oncust && homeRankOrderModel1.userCd !== null ? <CustomerRanking customerRanking={memberRanking} title={formatMessage({ id: 'homepage.basic.Customerranking' })}/>
                : <CustomerRanking customerRanking={memberRanking} title={formatMessage({ id: 'homepage.basic.Memberranking' })}/>} 
        </Col>
      </Row>
  );
  }
}
export default connect(
  ({homePage,global}: { homePage:EchartsState, global:ConnectState;}) => ({
    memberDataList:homePage.memberDataList,
    settingData:homePage.settingData,
    oncust: global.oncust,
  }),
)// @ts-ignore
  (MemberPie)
