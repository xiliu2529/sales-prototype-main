import React, { Component } from 'react';
import 'echarts/lib/chart/pie';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import ReactEcharts from 'echarts-for-react'
import { Dispatch, EchartsState } from "@@/plugin-dva/connect";
import CustomerBar from "@/pages/HomePage/components/CustomerBar";
import CustOrendUOrMemberTrans from "@/pages/HomePage/components/Trans/custOrendUOrMemberTrans"
import { Button, Col, Modal, Row, Switch } from "antd";
import CustomerRanking from "@/pages/HomePage/components/CustomerRanking";
import { connect } from "umi";
import { formatMessage } from "@@/plugin-locale/localeExports";
import atlas from "@/assets/atlas.png";
import columnarAtlas from "@/assets/columnarAtlas.png";
import setting from "@/assets/setting.png";
import styles from "@/pages/HomePage/components/CustomerRanking/index.less";
import ReactTooltip from "react-tooltip";
import CustomerRankingTrans from '../Trans/CustomerRankingTrans';
import '@/pages/HomePage/components/Trans/index.less';
import { SendMessageProps } from "@/components/SendMessageInfo";
import classNames from "classnames";
import { ConnectState } from "@/models/connect";

import ActualityForecastMonthSummary
  from "@/pages/FormAdvancedForm/components/SearchActualityForecast/ActualityForecastMonthSummary"

export interface PieProps {
  title: React.ReactNode;
  budgetOrhistorical?: boolean;
  typIndex?: number;
  visible: boolean;
  dispatch: Dispatch;
  customerDataList: [];
  endUserDataList: [];
  homePage: EchartsState;
  oncust: boolean;
}
interface Piestates {
  budgetOrhistorical?: boolean;
  summaryCstmrCd: string;
  summaryCstmrNm: string;
  summaryEndUserCd: string;
  summaryEndUserNm: string;
  oncust: boolean;
}

class CustOrEnd extends Component<PieProps>{
  constructor(props: Readonly<PieProps>) {
    super(props);
    this.state = {
      budgetOrhistorical: true,
      typIndex: 0,
      visible: false,
      rankingRightData: [],
      modalKey: 0,
      summaryCstmrCd: '',
      summaryCstmrNm: '',
      summaryEndUserCd: '',
      summaryEndUserNm: '',

    };
    this.chartChange = this.chartChange.bind(this);
    this.barChange = this.barChange.bind(this);
    this.switchOnChange = this.switchOnChange.bind(this);

  }
  
  budgetOrhistorical = (oncust: Boolean,budgetOrhistorical:Boolean) => {
    if (oncust && !budgetOrhistorical) {
      this.setState({
        budgetOrhistorical: true,
      });
    }
  }
  

  showModal = async () => {

    // @ts-ignore
    const { dispatch, homeRankOrderModel, customerDataList, endUserDataList, oncust } = this.props;

    
    const { budgetOrhistorical } = this.state;

    customerDataList.right.forEach((item: { title: any; }) => delete item.title)

    endUserDataList.right.forEach((item: { title: any; }) => delete item.title)

    // @ts-ignore
    let homeRankSettingModel: string = [];

    if (budgetOrhistorical) {
      homeRankSettingModel = this.settingParams(customerDataList.right, [], [], homeRankOrderModel, oncust);
    } else {
      homeRankSettingModel = this.settingParams([], endUserDataList.right, [], homeRankOrderModel, oncust);
    }
    
    

    await dispatch({
      type: 'homePage/fetchSettingData',
      payload: {
        homeRankSettingModel,
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

    this.setState({
      // eslint-disable-next-line react/no-unused-state
      visible: true,
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleOk = (e: any) => {
    this.setState({
      visible: false,
    });

  };



  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  refresh = async () => {
    // @ts-ignore
    const { dispatch, homeRankOrderModel, customerDataList, endUserDataList, oncust } = this.props;
    // @ts-ignore
    const { budgetOrhistorical } = this.state;

    // @ts-ignore
    let homeRankSettingModel: string = [];
    homeRankSettingModel = this.settingParams([], [], this.state.rankingRightData, homeRankOrderModel, oncust);
    // const homeRankSettingModel=this.settingParams([],this.state.rankingRightData,homeRankOrderModel);

    await dispatch({
      type: 'homePage/fetchSettingRefreshData',
      payload: {
        homeRankSettingModel,
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
    this.setState({
      visible: false
    });
  }



  refreshParams = (rankingRight: any) => {
    const rankingData2 = rankingRight;
    this.setState({
      // eslint-disable-next-line react/no-unused-state
      rankingRightData: rankingData2,
    }
    )
    return rankingData2;
  }
  // @ts-ignore
  settingParams = (customerDataList: any, endUserDataList: any, rightData1: any, homeRankOrderModel: any, oncust) => {

    // @ts-ignore
    // const { homeRankOrderModel} = this.props;
    const { budgetOrhistorical } = this.state;
    let params;
    params = JSON.parse(homeRankOrderModel);

    const { dspYear } = params;
    const userCd = params.loginUserCd;
    let type = "";
    const homeRankOrderList: never[] = []; let homePageRightDownRankList: [];
    if (budgetOrhistorical) {
      homePageRightDownRankList = customerDataList;
      type = "CUSTOMER";
    } else {
      homePageRightDownRankList = endUserDataList;
      type = "ENDUSER";
    }




    // eslint-disable-next-line @typescript-eslint/no-redeclare
    const rightData = rightData1;
    // @ts-ignore
    const caseParam: HomeRankSettingModel = { dspYear, userCd, type, homeRankOrderList, homePageRightDownRankList, rightData };
    const homeRankSettingModel = JSON.stringify(caseParam);
    return homeRankSettingModel;
  }



  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleCancel = (e: any) => {
    // @ts-ignore
    const { modalKey } = this.state;
    this.setState({
      visible: false,
      modalKey: modalKey + 1,
    });
  };

  chartChange() {
    this.setState({
      typIndex: 0,
    });
  }

  barChange() {
    this.setState({
      typIndex: 1,
    });
  }
  
  switchOnChange() {
    // @ts-ignore
    const { budgetOrhistorical } = this.state;
    this.setState({
      budgetOrhistorical: !budgetOrhistorical,
    });
  }
 
  onCstmrNmEndUserNmClick = async (record: any) => {
    const { dispatch } = this.props;
    const { budgetOrhistorical } = this.state;
    if (budgetOrhistorical === true) {
      this.setState({

        summaryCstmrCd: record.key,
        summaryCstmrNm: record.name,
        summaryEndUserCd: "",
        summaryEndUserNm: "",
      });
    } else {
      this.setState({
        summaryCstmrCd: "",
        summaryCstmrNm: "",
        summaryEndUserCd: record.key,
        summaryEndUserNm: record.name,
      });


    }

    const payload = true;
    await dispatch({
      type: 'searchActForData/changeMonthSummaryModelCollapsed',
      payload
    });

  };

  async componentDidMount() {
    // @ts-ignore
    const { dispatch, homeRankOrderModel, customerDataList, endUserDataList, oncust } = this.props;
     
    const { homePage } = this.props;
    if (!customerDataList || !endUserDataList) {
      return;
    }

    let homeRankSettingModel: string = [];
    homeRankSettingModel = this.settingParams(customerDataList.right, [], [], homeRankOrderModel, oncust);
    await dispatch({
      type: 'homePage/fetchSettingRefreshData',
      payload: {
        homeRankSettingModel,
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
  }

  getOption = (pieData: any,) => {
    const legendData: any[] = [];
    const chartData: any[] = [];
    if (pieData !== null && undefined !== pieData) {
      pieData.forEach((item: any) => {
        legendData.push(item.name);
      })

    pieData.forEach((item: any)=>{
      chartData.push({value:item.amount,name:item.name });
    }) }

    let option;
    // eslint-disable-next-line prefer-const
    option = {
      backgroundColor: '#FFFFFF',
      color: ['#366181', '#7ECBEE', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'],
      tooltip: {
        show: true,
        confine: true,
        transitionDuration: 0,// echart防止tooltip的抖动,
        trigger: 'item',
        //  formatter: '{b}<br/>{c} ({d}%)'
        formatter(v: any) { return `${v.name}<br/>${formatNum(parseFloat(v.value).toFixed(0))} (${v.percent.toFixed(0)}%)`; },
      },

      series: [
        {
          name: 'Customer data',
          type: 'pie',
          radius: ['20%', '60%'],
          center: ['50%', '50%'],
          label: {
            formatter(v: any) { return `${v.name}\n{per|${v.percent.toFixed(0)}%}`; },
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
          data: chartData
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
      return `${a}${b}${c}`;
    }
    return option;
  }

  // @ts-ignore
  // eslint-disable-next-line consistent-return
  PieOrBar = (custOrEndUData, rankingData: any) => {

    let percentAll: number = 0;
    let amountAll: number = 0;
    let amountSelect: number = 0;
    let percent: number = 0;
    let otherAmount: number = 0;
    const memberData: any[] = [];

    // @ts-ignore
    custOrEndUData.forEach((item: any) => {
      percentAll += Number(item.percent);
      amountSelect += Number(item.amount);
      // 四捨五入は二桁の小数を取る
      // eslint-disable-next-line no-param-reassign
      item.amount = parseFloat(item.amount).toFixed(0);
      memberData.push(item);
    }
    )

    rankingData.forEach((item: any) => {
      amountAll += Number(item.amount);
    })
    // @ts-ignore
    percent = 100 - percentAll;
    otherAmount = amountAll - amountSelect;

    if (rankingData.length !== null && rankingData.length < 5 && custOrEndUData.length < rankingData.length && custOrEndUData.length < 5) {
      memberData.push({ amount: otherAmount.toFixed(0), effort: "", code: "", name: "Other", shrtNm: "", key: "", percent })
    }
    if (rankingData.length !== null && rankingData.length === 5 && custOrEndUData.length < rankingData.length && custOrEndUData.length < 5) {
      memberData.push({ amount: otherAmount.toFixed(0), effort: "", code: "", name: "Other", shrtNm: "", key: "", percent })
    }
    if (rankingData.length !== null && rankingData.length > 5 && custOrEndUData.length < rankingData.length && custOrEndUData.length < 5) {
      memberData.push({ amount: otherAmount.toFixed(0), effort: "", code: "", name: "Other", shrtNm: "", key: "", percent })
    }
    if (rankingData.length !== null && rankingData.length > 5 && custOrEndUData.length < rankingData.length && custOrEndUData.length > 5) {
      memberData.push({ amount: otherAmount.toFixed(0), effort: "", code: "", name: "Other", shrtNm: "", key: "", percent })
    }
    if (rankingData.length !== null && rankingData.length > 5 && custOrEndUData.length < rankingData.length && custOrEndUData.length === 5) {
      memberData.push({ amount: otherAmount.toFixed(0), effort: "", code: "", name: "Other", shrtNm: "", key: "", percent })
    }

    // @ts-ignore
    if (this.state.typIndex === 0) {
      return (
        <ReactEcharts option={this.getOption(memberData)} style={{ top: 10, width: '110%', height: '300%' }} />
      )
    }
    // @ts-ignore
    // eslint-disable-next-line no-lonely-if
    if (this.state.typIndex === 1) {
      return (
        <CustomerBar customerBar={custOrEndUData} title='' />
      )
    }
  }

  // @ts-ignore
  // eslint-disable-next-line consistent-return
  CommonChart = (transSourceData, rankRight, customerData, visible, rankingData, titleValue, homeRankOrderModel) => {

    // @ts-ignore
    return (
      <Row
        gutter={24}
        align="middle">
        <Col xl={13} lg={24} md={24} sm={24} xs={24}>
          {this.PieOrBar(customerData, rankingData)}

          <Modal
            className={classNames(styles.modalStyle)}
            title={titleValue}
            visible={visible}
            onCancel={this.handleCancel}
            key={this.state.modalKey}
            footer={[
              <Button key="back" type="primary" onClick={this.handleCancel}>{formatMessage({ id: 'homepage.basic.SetCancel' })} </Button>,
              // eslint-disable-next-line react/jsx-no-bind
              <Button key="submit" type="primary" onClick={this.refresh}>{formatMessage({ id: 'homepage.basic.SetRefresh' })}
              </Button>]}
          >
            <CustomerRankingTrans refreshParams={this.refreshParams} customerRankingRight={rankRight} dataSource={transSourceData} />
          </Modal>
          <img src={setting} alt="" data-tip={formatMessage({ id: 'homepage.basic.SetDisplayitem' })} data-place="bottom" data-type='light' data-class={styles.Suspensionframe1} style={{ position: 'absolute', left: '10%', bottom: '80%', fontSize: '20px', color: '#003D82', cursor: "pointer" }} onClick={this.showModal} />
          <ReactTooltip />

          {/* <CustomerRankingTrans refresh={this.refresh}
                                customerRankingLeft={rankingLeft}
                                customerRankingRight={rankingRight} title={titleValue} keys={rankingRight.length} /> */}
          <img src={atlas} alt="" style={{ position: 'absolute', left: '17%', bottom: '80%', fontSize: '20px', color: '#003D82', cursor: "pointer" }} onClick={this.chartChange} />
          <img src={columnarAtlas} alt="" style={{ position: 'absolute', left: '24%', bottom: '80%', fontSize: '20px', color: '#003D82', cursor: "pointer" }} onClick={this.barChange} />


        </Col>
        <Col xl={11} lg={24} md={24} sm={24} xs={24} >
          <CustomerRanking customerRanking={rankingData} title={titleValue} onTitleClick={(item: any) => this.onCstmrNmEndUserNmClick(item)} />
        </Col>
        <ActualityForecastMonthSummary
          cstmrCd={this.state.summaryCstmrCd}
          cstmrNm={this.state.summaryCstmrNm}
          endUserCd={this.state.summaryEndUserCd}
          endUserNm={this.state.summaryEndUserNm}
          homeRankOrderModel={homeRankOrderModel}
        />
      </Row>
    )
  }

  render() {
    // @ts-ignore
    const { customerDataList, endUserDataList, settingData, homeRankOrderModel } = this.props;
    if (!customerDataList || !endUserDataList || !settingData) {
      return null;
    }
    let customerData; let customerRanking; let endUserData; let endUserRanking;
    const transSourceDataCust: any[] = []; const transSourceDataEndUser: any[] = [];
    // eslint-disable-next-line prefer-const
    customerData = customerDataList.left;
    // eslint-disable-next-line prefer-const
    customerRanking = customerDataList.right;
    // eslint-disable-next-line prefer-const
    endUserData = endUserDataList.left;
    // eslint-disable-next-line prefer-const
    endUserRanking = endUserDataList.right;

    if (customerRanking !== null && undefined !== customerRanking) {
      // eslint-disable-next-line prefer-const
      customerRanking.forEach((item: any) => {
        item.key = item.code;
        item.title = item.name;
        transSourceDataCust.push(item)
      })
    }
    if (endUserRanking !== null && endUserRanking.length > 0) {
      // eslint-disable-next-line prefer-const
      endUserRanking.forEach((item: any) => {
        // eslint-disable-next-line no-param-reassign
        item.key = item.code;
        // eslint-disable-next-line no-param-reassign
        item.title = item.name;
        transSourceDataEndUser.push(item)
      })
    }
    const rankRight: any[] = [];
    for (let i = 0; i < settingData.right.length; i += 1) {
      // @ts-ignore
      rankRight.push(settingData.right[i].key);
    }

    /* const {

        customerRankingLeft,
        customerRankingRight,
        endUserData,
        endUserRanking,
        endUserRankingLeft,
        endUserRankingRight,
      }=custOrEndUserDataList */
    // @ts-ignore
    const { visible, budgetOrhistorical } = this.state;
    const { oncust } = this.props
    return (
      // eslint-disable-next-line react/jsx-no-comment-textnodes
      <div id='customer'>
        {budgetOrhistorical === true ?

          oncust && JSON.parse(homeRankOrderModel).userCd != null &&
            JSON.parse(homeRankOrderModel).userCd.length > 0 &&
            JSON.parse(homeRankOrderModel).userCd[0] !== "" ?
            this.CommonChart(transSourceDataCust, rankRight, customerData, visible, customerRanking, formatMessage({ id: 'homepage.basic.projectranking' }), homeRankOrderModel)
            :
            this.CommonChart(transSourceDataCust, rankRight, customerData, visible, customerRanking, formatMessage({ id: 'homepage.basic.Customerranking' }), homeRankOrderModel)
          :
          // eslint-disable-next-line no-lone-blocks
          this.CommonChart(transSourceDataEndUser, rankRight, endUserData, visible, endUserRanking, formatMessage({ id: 'homepage.basic.Enduserranking' }), homeRankOrderModel)
        }

        {oncust ? this.budgetOrhistorical(oncust,budgetOrhistorical): <div className='text-top-cusOrEnd'>
          <Row>

            <Col><span id='Customer' className='customer-span' >{formatMessage({ id: 'app.common.Customer' })}</span></Col>
            <Col><Switch
              // @ts-ignore
              id='switch' className='switch-span-right' style={{ background: "#7ECBEE" }}
              // @ts-ignore
              onChange={this.switchOnChange} />
            </Col>
            <Col> <span id='EndUser' className='endUser-span' >{formatMessage({ id: 'app.common.EndUser' })}</span></Col>
          </Row>
        </div>}


      </div>
    );
  }
}
export default connect(({ homePage, global }: { homePage: EchartsState, global: ConnectState; }) => ({
  customerDataList: homePage.customerDataList,
  endUserDataList: homePage.endUserDataList,
  memberDataList: homePage.memberDataList,
  settingData: homePage.settingData,
  oncust: global.oncust,
}),
)// @ts-ignore
  (CustOrEnd)
