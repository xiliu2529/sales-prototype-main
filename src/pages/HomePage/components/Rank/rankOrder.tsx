import React, { Component } from 'react';
import  'echarts/lib/chart/gauge';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import ReactEcharts from 'echarts-for-react'
import {Button, Col, Modal, Row} from "antd";
import styles from "@/pages/HomePage/components/CustomerRanking/index.less";
import RankUnofficial from "@/pages/HomePage/components/Rank/rankUnofficial";
import RankAtoD from "@/pages/HomePage/components/Rank/rankAtoD";
import IndustryRankingBar from "@/pages/HomePage/components/IndustryRankingBar";
import {connect} from "umi";
import {EchartsState} from "@/pages/HomePage/model";
import {AnalysisData, HomeRankOrderModel} from "@/pages/HomePage/data";
import {Dispatch} from "@@/plugin-dva/connect";
import {formatMessage} from "@@/plugin-locale/localeExports";
import ReactTooltip from "react-tooltip";
import atlas from "@/assets/atlas.png";
import circulation from "@/assets/circulation.png";
import Insurance from "@/assets/Insurance.png";
import medicalcare from "@/assets/medicalcare.png";
import setting from "@/assets/setting.png";
import other from "@/assets/other.png";
import publicImg from "@/assets/public.png";
import securities from "@/assets/securities.png";
import finance from "@/assets/finance.png";
import industry from "@/assets/industry.png";
import CustomerRankingTrans from "@/pages/HomePage/components/Trans/CustomerRankingTrans";
import columnarAtlas from "@/assets/columnarAtlas.png";
import moneysmall from "@/assets/moneysmall.png";
import '@/pages/HomePage/components/Trans/index.less';
import Gauge from "@/pages/HomePage/components/Gauge";
import classNames from "classnames";




export interface RankOrderProps {
  title: React.ReactNode;
  analysisData:AnalysisData;
  graphData:[];
  typIndex:number,
  visible: boolean,
  dispatch: Dispatch;
  homeRankOrderModel:HomeRankOrderModel;
}

class RankOrder extends Component<RankOrderProps>{

  constructor(props: Readonly<RankOrderProps>) {
    super(props);
    this.state = {
      typIndex:0,
      // eslint-disable-next-line react/no-unused-state
      visible: false,
      rankingRightData:[],
      modalKey:0,
      homeRankSettingModel:[],
    };
    this.chartChange = this.chartChange.bind(this);
    this.barChange = this.barChange.bind(this);
  }

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  refresh = async () => {
    const { dispatch,homeRankOrderModel} = this.props;

    const homeRankSettingModel=this.settingParams([],this.state.rankingRightData,homeRankOrderModel);


    await dispatch({
      type: 'homePage/fetchSettingRefreshData',
      payload: {
        homeRankSettingModel,
      },
    });


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

    /*  rankingRight.forEach((Item: any) => {
        // TODO 穿梭框参数
         alert(JSON.stringify(rankingRight[Item.key]));
      }) */
    this.setState({
      visible: false
    });
  }

  refreshParams = (rankingRight:any) => {
    const rankingData1=rankingRight;
    this.setState({
        // eslint-disable-next-line react/no-unused-state
        rankingRightData:rankingData1,
      }
    )
    return rankingData1;
  }



  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleOk = (e: any) => {
    this.setState({
      visible: false,
    });

  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleCancel = (e: any) => {
    // @ts-ignore
    const {modalKey} = this.state;
    this.setState({
      visible: false,
      modalKey: modalKey + 1,
    });

  }

  componentDidMount() {
    // @ts-ignore
    const { dispatch,homeRankOrderModel,graphData} = this.props;
    const homeRankSettingModel=this.settingParams(graphData,[],homeRankOrderModel);
    dispatch({
      type: 'homePage/fetch',
      payload: {
        homeRankOrderModel,
      },
    });
    dispatch({
      type: 'homePage/fetchGraph',
      payload: {
        homeRankOrderModel,
      },
    });

    dispatch({
      type: 'homePage/fetchSettingData',
      payload: {
        homeRankSettingModel,
      },
    });
  }


  static getDerivedStateFromProps(nextProps: RankOrderProps) {
    if (nextProps.graphData !== null && nextProps.graphData !== undefined) {
      const graphData1 = nextProps.graphData
      return {
        graphData: graphData1,
      }
    }
    return null;
  }



  // @ts-ignore
  settingParams= (graphData: any,rightData1:any,homeRankOrderModel:any)=>{

    // @ts-ignore
    // const { homeRankOrderModel} = this.props;
    let params;
    params=JSON.parse(homeRankOrderModel);

    const {dspYear} = params;
    const userCd = params.loginUserCd;
    const type ="CASE_INDSTY_CLS";
    const homeRankOrderList= graphData.right;
    const homePageRightDownRankList: never[]=[];
    // eslint-disable-next-line @typescript-eslint/no-redeclare
    const rightData=rightData1;
    // @ts-ignore
    const caseParam: HomeRankSettingModel = {dspYear,userCd,type,homeRankOrderList,homePageRightDownRankList,rightData};
    const homeRankSettingModel = JSON.stringify(caseParam);
    return homeRankSettingModel;
  }


  showModal = () => {
    // @ts-ignore
    const { dispatch,homeRankOrderModel,graphData} = this.props;
    const homeRankSettingModel=this.settingParams(graphData,[],homeRankOrderModel);
    dispatch({
      type: 'homePage/fetchSettingData',
      payload: {
        homeRankSettingModel,
      },
    });

    this.setState({
      visible: true,
    });
  }


  // @ts-ignore
  // eslint-disable-next-line consistent-return
  IndustryPieOrBar=(rankOrder,rankUnofficial,rankAtoD,value1,value2,value3,value4,graphData1)=>{

    // @ts-ignore
    if(this.state.typIndex === 0) {

      if(rankOrder==='' || rankOrder ===undefined && value1 === 0){
        if(rankUnofficial==='' || rankUnofficial ===undefined && value2 === 0){
          return(
            <div id='rankPieData' className={styles.rightTop}>
              <RankAtoD rankAtoD={rankAtoD} value1={value1} value2={value2} value3={value3} value4={value4}/>
              <div style={{background:"white",height: "67.1%"}} />
            </div>
          )
        }
        if(rankAtoD==='' || rankAtoD ===undefined && value3 === 0){
          return(
            <div id='rankPieData' className={styles.rightTop}>
              <RankUnofficial rankUnofficial={rankUnofficial} value1={value1} value2={value2} value3={value3} value4={value4}/>
              <div style={{background:"white",height: "67.1%"}} />
            </div>
          )
        }
        return(
          <div id='rankPieData' className={styles.rightTop}>
            <RankUnofficial rankUnofficial={rankUnofficial} value1={value1} value2={value2} value3={value3} value4={value4}/>
            <RankAtoD rankAtoD={rankAtoD} value1={value1} value2={value2} value3={value3} value4={value4}/>
            <div style={{background:"white",height: "34.1%"}} />
          </div>
        )
      }
      if(rankUnofficial==='' || rankUnofficial ===undefined && value2 === 0){
        if(rankAtoD==='' || rankAtoD ===undefined && value3 === 0){
          return(
            <div id='rankPieData' className={styles.rightTop}>
              <ReactEcharts option={this.getOption(rankOrder,value1,value2,value3,value4)} style={{ width: '100%', height: '33%' }}/>
              <div style={{background:"white",height: "67.1%"}} />
            </div>
          )
        }
        return(
          <div id='rankPieData' className={styles.rightTop}>
            <ReactEcharts option={this.getOption(rankOrder,value1,value2,value3,value4)} style={{ width: '100%', height: '33%' }}/>
            <RankAtoD rankAtoD={rankAtoD} value1={value1} value2={value2} value3={value3} value4={value4}/>
            <div style={{background:"white",height: "34.1%"}} />
          </div>
        )
      }
      if(rankAtoD==='' || rankAtoD ===undefined && value3 === 0){
        return(
          <div id='rankPieData' className={styles.rightTop}>
            <ReactEcharts option={this.getOption(rankOrder,value1,value2,value3,value4)} style={{ width: '100%', height: '33%' }}/>
            <RankUnofficial rankUnofficial={rankUnofficial} value1={value1} value2={value2} value3={value3} value4={value4}/>
            <div style={{background:"white",height: "34.1%"}} />
          </div>
        )
      }
      return(
        <div id='rankPieData' className={styles.rightTop}>
          <ReactEcharts option={this.getOption(rankOrder,value1,value2,value3,value4)} style={{ width: '100%', height: '33%' }}/>
          <RankUnofficial rankUnofficial={rankUnofficial} value1={value1} value2={value2} value3={value3} value4={value4}/>
          <RankAtoD rankAtoD={rankAtoD} value1={value1} value2={value2} value3={value3} value4={value4}/>
        </div>
      )
    }

    // @ts-ignore
    if(this.state.typIndex === 1) {
      return(
        <div id='rankCustomerBar' className={styles.rightTop}>
          <IndustryRankingBar industryRankingData={graphData1} title=''/>
        </div>
      )
    }
  }


  getOption = (rankOrder: any,value1:any,value2:any,value3:any,value4:any)=>{

    const dataValue:any[]=[];
    let topValue;
    let topValueSting;
    let belowValue;
    let imgNm;
    let name;
    // let title;
    // let title1;
    // let title2;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars,array-callback-return
    dataValue.push({value:value1},{value:value2},{value:value3},{value:value4});
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,prefer-const
    imgNm =undefined===rankOrder?'':`{${rankOrder.caseIndstyLogoNm}|}`;
    // eslint-disable-next-line prefer-const
    topValue =undefined===rankOrder?'': rankOrder.caseIndstyNm;
    // eslint-disable-next-line prefer-const
    belowValue = undefined===rankOrder?'':`{d|${formatNum(parseFloat(rankOrder.amount).toFixed(0))}}`;

    // eslint-disable-next-line prefer-const
    topValueSting =  undefined===rankOrder?'':`{b|${topValue}}{d|${parseFloat(rankOrder.percent).toFixed(0)}% }`;
    name= undefined !== rankOrder ? rankOrder.caseIndstyNm : '';

    /*
        // eslint-disable-next-line prefer-const
        title1=formatMessage({ id: 'homepage.basic.amount' });
        // eslint-disable-next-line prefer-const
        title2=formatMessage({ id: 'homepage.basic.percent' });

        // eslint-disable-next-line prefer-const
        title= `{c|${title1}}{c|${title2}}`;
    */

    let option;
    // eslint-disable-next-line prefer-const
    option = {
      backgroundColor: '#FFFFFF',
      series: [
        {
          name,
          animation: false,
          color: ['#FFB0D6','#F0F0F0', '#F0F0F0', '#F0F0F0'],
          type: 'pie',
          radius: [35, 50],
          center: [60, 60],
          labelLine: {
            show: false
          },
          label: {
            show: true,
            position: 'center',
            formatter: imgNm,
            rich: {
              finance: {
                height: 30,
                align: 'center',
                backgroundColor: {
                  image: finance
                }
              },
              industry: {
                height: 30,
                align: 'center',
                backgroundColor: {
                  image: industry
                }
              },
              securities: {
                height: 30,
                align: 'center',
                backgroundColor: {
                  image: securities
                }
              },
              circulation: {
                height: 30,
                align: 'center',
                backgroundColor: {
                  image: circulation
                }
              },
              Insurance: {
                height: 30,
                align: 'center',
                backgroundColor: {
                  image: Insurance
                }
              },
              medicalcare: {
                height: 30,
                align: 'center',
                backgroundColor: {
                  image: medicalcare
                }
              },
              other: {
                height: 30,
                align: 'center',
                backgroundColor: {
                  image: other
                }
              },
              public: {
                height: 30,
                align: 'center',
                backgroundColor: {
                  image: publicImg
                }
              }
            }
          },
          markPoint: {
            symbol: 'circle',
            symbolSize: 1,
            data: [{x: 115, y: 60}],
            color: '#86EB9F',
            label: {
              position: 'right',
              formatter: [
                topValueSting,
                '{blank|}',
                '{hr|}',
                '{blank|}',
                `              {moneysmall|} ${belowValue}`
              ].join('\n'),
              rich: {
                b: {
                  lineHeight: 12,
                  fontSize: 15,
                  color: '#000',
                  align: 'center',
                  width: 100
                },
                hr: {
                  borderColor: '#aaa',
                  width: '100%',
                  align: 'right',
                  borderWidth: 0.5,
                  height: 0
                },
                blank: {
                  height: 5
                },
                c: {
                  lineHeight: 20,
                  verticalAlign: 'bottom',
                  fontSize: '13',
                  align: 'left',
                  color: '#666666',
                  width: 70
                },
                d: {
                  lineHeight: 20,
                  verticalAlign: 'bottom',
                  fontSize: '13',
                  align: 'right',
                  color: '#666666',
                  width: 40
                },
                moneysmall: {
                  height: 15,
                  align: 'bottom',
                  backgroundColor: {
                    image: moneysmall
                  }
                },
              }
            }
          },
          data: dataValue
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
    return option;
  }


  // @ts-ignore
  render() {
    // @ts-ignore
    const {analysisData,graphData,homeRankOrderModel,settingData,mainGraphLeft} = this.props;
    if(!analysisData || !graphData || !settingData){
      return null;
    }
    const {visible} =this.state;
    const rankRight:any[]=[];
    for(let i=0;i<settingData.right.length;i+=1){
      // @ts-ignore
      rankRight.push(settingData.right[i].key);
    }
    let rankOrder;
    let rankUnofficial;
    let rankAtoD;
    // 饼图用到的位置百分比
    let value1:number=0;
    let value2:number=0;
    let value3:number=0;
    let value4:number=0;
    const transSourceData1=[];
    let graphData1

    // eslint-disable-next-line prefer-const
    graphData.right.forEach((item)=>{
      item.key = item.caseIndstyCd;
      item.title = item.caseIndstyNm
      transSourceData1.push(item)
    })


    // @ts-ignore
    // eslint-disable-next-line no-plusplus
    for (let i=0;i < analysisData.length;i++) {
      if(i ===0){
        // eslint-disable-next-line prefer-destructuring
        rankOrder=analysisData[i];
        value1=analysisData[i].percent;
      }
      if(i ===1){
        // eslint-disable-next-line prefer-destructuring
        rankUnofficial=analysisData[i];
        value2=analysisData[i].percent;
      }
      if(i ===2){
        // eslint-disable-next-line prefer-destructuring
        rankAtoD=analysisData[i];
        value3=analysisData[i].percent;
      }
      value4 =100-value1-value2-value3;
    }

    return (
      <div style={{width:'100%',height:390,background:'white',}}>
        <Row style={{height:390}}>
          <Col xl={18} lg={24} md={24} sm={24} xs={24}>
            <Gauge gaugeData={mainGraphLeft} homeRankOrderModel={homeRankOrderModel}/>
          </Col>
          <Col xl={6} lg={24} md={24} sm={24} xs={24}>
            <Row
              gutter={24}
              align="middle" style={{marginLeft:'-12%',background: 'white',marginRight:'0px'}}>
              <Col xl={10} lg={24} md={24} sm={24} xs={24}>
                <Modal
                  className={classNames(styles.modalStyle)}
                  title= {formatMessage({ id: 'homepage.basic.Industryranking' })}
                  visible={visible}
                  onCancel={this.handleCancel}
                  key={this.state.modalKey}
                  footer={[
                    <Button key="back"  type="primary"  onClick={this.handleCancel}>{formatMessage({ id: 'homepage.basic.SetCancel' })}</Button>,
                    // eslint-disable-next-line react/jsx-no-bind
                    <Button key="submit" type="primary"  onClick={this.refresh}>{formatMessage({ id: 'homepage.basic.SetRefresh' })}
                    </Button>]}
                >
                  <CustomerRankingTrans  refreshParams={this.refreshParams}
                                         customerRankingRight={rankRight} dataSource={transSourceData1}/>
                </Modal>
                <img src={setting} alt="" data-tip={formatMessage({ id: 'homepage.basic.SetDisplayitem' })}  data-place = "bottom" data-type='light' data-class={styles.Suspensionframe1} style={{position: 'absolute', left: '0px', fontSize: '20px', color: '#003D82',cursor:"pointer" }}  onClick={this.showModal}/>
                <ReactTooltip />

                <img src={atlas} alt=""  style={{position: 'absolute', left: '25px', fontSize: '20px', color: '#003D82',cursor:"pointer" }} onClick={this.chartChange}/>
                <img src={columnarAtlas} alt="" style={{position: 'absolute', left: '50px', fontSize: '20px', color: '#003D82' ,cursor:"pointer"}} onClick={this.barChange}/>
              </Col>
              <Col xl={14} lg={24} md={24} sm={24} xs={24} style={{marginLeft:'0%'}}>
                <h4 className={styles.rankingTitle}>
                  {formatMessage({ id: 'homepage.basic.Industryranking' })}
                </h4>
              </Col>
            </Row>
            <Row
              gutter={24}
              align="middle"  style={{marginLeft:'5px'}}>
              <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                {this.IndustryPieOrBar(rankOrder,rankUnofficial,rankAtoD,value1,value2,value3,value4,graphData.left)}
              </Col>

            </Row>
          </Col>
        </Row>
      </div>
    );
  }
}

// @ts-ignore
export default connect(({homePage}: { homePage: EchartsState; }) => ({
    analysisData:homePage.analysisData,
    graphData:homePage.graphData,
    mainGraphLeft:homePage.mainGraphLeft,
    settingData:homePage.settingData,
  }),
)// @ts-ignore
  (RankOrder);
