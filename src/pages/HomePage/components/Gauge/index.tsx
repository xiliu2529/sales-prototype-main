import React, { Component } from 'react';
import  'echarts/lib/chart/gauge';
import 'echarts/lib/component/title';
import ReactEcharts from 'echarts-for-react';
// @ts-ignore
import echarts from 'echarts';
import sunny from "@/assets/sunny.png";
import cloudy from "@/assets/cloudy.png";
import showers from "@/assets/showers.png";
import {connect} from "umi";
import {EchartsState} from "@/pages/HomePage/model";
import {GaugeDataList, HomeRankOrderModel} from "@/pages/HomePage/data";
import {Dispatch} from "@@/plugin-dva/connect";
import {Button, Col, message, Space, Tooltip} from "antd";
import styles from "@/pages/HomePage/components/Gauge/index.less";
import {LeftSquareTwoTone, RightSquareTwoTone, CaretLeftFilled, CaretRightFilled} from "@ant-design/icons/lib";
import {formatMessage} from "@@/plugin-locale/localeExports";
import {RankOrderProps} from "@/pages/HomePage/components/Rank/rankOrder";
import leftMonth from "@/assets/leftMonth.png";
import rightMonth from "@/assets/rightMonth.png";

import ReactTooltip from "react-tooltip";
import {ConnectState} from "@/models/connect";


export interface GaugeProps {
  augeDataList:GaugeDataList;
  dispatch: Dispatch;
  gaugeData:[];
  homeRankOrderModel:[];
  oncust:Boolean
}
interface GaugeStates {
  month:number;
}

class Gauge extends Component<GaugeProps,GaugeStates>{
  reqRef: number = 0;

constructor(props: Readonly<GaugeProps>) {
  // @ts-ignore
  super(props);
  const {gaugeData} =this.props;
  let currentMonth;
  // @ts-ignore
  currentMonth=gaugeData[2].title.substring(gaugeData[2].title.length-2,gaugeData[2].title.length)
  if(currentMonth.substring(0,1) === "0"){
    currentMonth=Number(currentMonth.substring(1,2));
  }else{
    currentMonth=Number( currentMonth);
  }
  this.state = {
    month: currentMonth,
  };

}

  getOption = (gaugeDataLeft: any, gaugeDataMiddle: any, gaugeDataRight: any)=>{
    const formatterData: any[] = [];
    const eChartsDataLeft: any[] = [];
    const eChartsDataMiddle: any[] = [];
    const eChartsDataRight: any[] = [];
    // eslint-disable-next-line array-callback-return
      formatterData.push(gaugeDataLeft.boardIconNm)
      formatterData.push(gaugeDataMiddle.boardIconNm);
      formatterData.push(gaugeDataRight.boardIconNm);

    eChartsDataLeft.push({value:gaugeDataLeft.boardPercentage,name:gaugeDataLeft.boardTitle})
    eChartsDataMiddle.push({value:gaugeDataMiddle.boardPercentage,name:gaugeDataMiddle.boardTitle})
    eChartsDataRight.push({value:gaugeDataRight.boardPercentage,name:gaugeDataRight.boardTitle})
    const weatherIcons = {
      'Sunny': sunny,
      'Cloudy':cloudy,
      'Showers':showers,
    };
    let formatterDataLeft;
    let formatterDataMiddle;
    let formatterDataRight;
   if(formatterData[0] ==="" || formatterData[0] ===undefined || formatterData[0] ===null){
      formatterDataLeft='{value}%';
   }else{
      formatterDataLeft='{'.concat(formatterData[0],'|}{value}%');
   }
    if(formatterData[1] ==="" || formatterData[1] ===undefined || formatterData[1] ===null){
      formatterDataMiddle='{value}%';
    }else{
      formatterDataMiddle='{'.concat(formatterData[1],'|}{value}%');
    }
    if(formatterData[2] ==="" || formatterData[2] ===undefined || formatterData[2] ===null){
      formatterDataRight='{value}%';
    }else{
      formatterDataRight='{'.concat(formatterData[2],'|}{value}%');
    }
    let option;
    // eslint-disable-next-line prefer-const
    option = {
      /* title:{
        text: titleValue,
        textStyle: {
          color: '#003D82',
          fontStyle:'italic',
        }
      }, */
      backgroundColor: '#FFFFFF',
      series : [
        {
          name: 'Annual PCT :',
          type: 'gauge',
          min: 0,
          max: 160,
          splitNumber: 8,
          radius: '180',
          center:[365,190],
          axisLine: {            // 坐标轴线
            lineStyle: {       // 属性lineStyle控制线条样式
              width: 13,
              color:[
                [1,new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                  {
                    offset: 0.5,
                    color: "#52CEFF"
                  },
                  //   {
                  //     offset: 0.4,
                  //     color: "#4B94EB"
                  //   },
                  //   {
                  //     offset: 0.6,
                  //     color: "#4A6EFF"
                  //   },
                  //   {
                  //     offset: 0.8,
                  //     color: "#4A3FEB"
                  //   },
                  {
                    offset: 1,
                    color: "#003D82"
                  }
                ])
                ]
              ]

            }
          },
          axisTick: {            // 坐标轴小标记
            length: 15,        // 属性length控制线长
            lineStyle: {       // 属性lineStyle控制线条样式
              color: 'auto'
            }
          },
          splitLine: {           // 分隔线
            length: 20,         // 属性length控制线长
            lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
              color: 'auto'
            }
          },
          axisLabel: {
            backgroundColor: 'auto',
            borderRadius: 2,
            color: ' ',
            padding: 3,
            textShadowBlur: 2,
            textShadowOffsetX: 1,
            textShadowOffsetY: 1,
            fontWeight: 'bolder',
            formatter: '{value}%'
          },
          title: {
            // 其余属性默认使用全局文本样式，详见TEXTSTYLE
            fontWeight: 'bolder',
            fontSize: 20,
            fontStyle: 'italic'
          },
          detail: {
            // 其余属性默认使用全局文本样式，详见TEXTSTYLE
            formatter:formatterDataMiddle,
            fontWeight: 'bolder',
            borderRadius: 3,
            backgroundColor: '#003D82',
            borderColor: '#aaa',
            shadowBlur: 5,
            shadowColor: '#333',
            shadowOffsetX: 0,
            shadowOffsetY: 3,
            borderWidth: 2,
            textBorderColor: '#000',
            textBorderWidth: 2,
            textShadowBlur: 2,
            textShadowColor: '#fff',
            textShadowOffsetX: 0,
            textShadowOffsetY: 0,
            fontFamily: 'Arial',
            color: '#eee',
            rich: {
              Sunny: {
                height: 30,
                align: 'left',
                backgroundColor: {
                  image: weatherIcons.Sunny
                }
              },
              Cloudy: {
                height: 25,
                width:40,
                align: 'left',
                backgroundColor: {
                  image: weatherIcons.Cloudy
                }
              },
              Showers: {
                height: 30,
                align: 'left',
                backgroundColor: {
                  image: weatherIcons.Showers
                }
              }
            }
          },
          data: eChartsDataMiddle
        },
        {
          name: 'Current PCT :',
          type: 'gauge',
          center: [125, 210],    // 默认全局居中
          radius: '105',
          min: 0,
          max: 160,
          startAngle: '320',
          endAngle: '55',
          splitNumber: 8,
          axisLine: {            // 坐标轴线
            lineStyle: {       // 属性lineStyle控制线条样式
              width: 8,
              color: [
                [1,new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                  {
                    offset: 0.5,
                    color: "#52CEFF"
                  },
                  //   {
                  //     offset: 0.4,
                  //     color: "#4B94EB"
                  //   },
                  //   {
                  //     offset: 0.6,
                  //     color: "#4A6EFF"
                  //   },
                  //   {
                  //     offset: 0.8,
                  //     color: "#4A3FEB"
                  //   },
                  {
                    offset: 1,
                    color: "#003D82"
                  }
                ])
                ]
              ]
            }
          },
          axisTick: {            // 坐标轴小标记
            length: 12,        // 属性length控制线长
            lineStyle: {       // 属性lineStyle控制线条样式
              color: 'auto'
            }
          },
          splitLine: {           // 分隔线
            length: 20,         // 属性length控制线长
            lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
              color: 'auto'
            }
          },
          pointer: {
            width: 5
          },
          title: {
            offsetCenter: [0, '-30%'],       // x, y，单位px
          },
          axisLabel: {
            fontSize: 10,
            color: ' ',
            formatter: '{value}%'
          },
          detail: {
            // 其余属性默认使用全局文本样式，详见TEXTSTYLE
            formatter:formatterDataLeft,
            fontSize: '16',
            backgroundColor: '#FFFFFF',
            width: '65',
            rich: {
              Sunny: {
                height: 20,
                align: 'left',
                backgroundColor: {
                  image: weatherIcons.Sunny
                }
              },
              Cloudy: {
                height: 15,
                width:25,
                align: 'left',
                backgroundColor: {
                  image: weatherIcons.Cloudy
                }
              },
              Showers: {
                height: 20,
                align: 'left',
                backgroundColor: {
                  image: weatherIcons.Showers
                }
              }
            }
          },
          data: eChartsDataLeft

        },
        {
          name: 'Monthly PCT :',
          type: 'gauge',
          center: [605, 210],    // 默认全局居中
          radius: '105',
          min: 0,
          max: 200,
          startAngle: '125',
          endAngle: '-140',
          splitNumber: 8,
          axisLine: {            // 坐标轴线
            lineStyle: {       // 属性lineStyle控制线条样式
              width: 8,
              color: [
                [1,new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                  {
                    offset: 0.5,
                    color: "#52CEFF"
                  },
                  //   {
                  //     offset: 0.4,
                  //     color: "#4B94EB"
                  //   },
                  //   {
                  //     offset: 0.6,
                  //     color: "#4A6EFF"
                  //   },
                  //   {
                  //     offset: 0.8,
                  //     color: "#4A3FEB"
                  //   },
                  {
                    offset: 1,
                    color: "#003D82"
                  }
                ])
                ]
              ]
            }
          },
          axisTick: {            // 坐标轴小标记
            length: 12,        // 属性length控制线长
            lineStyle: {       // 属性lineStyle控制线条样式
              color: 'auto'
            }
          },
          splitLine: {           // 分隔线
            length: 20,         // 属性length控制线长
            lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
              color: 'auto'
            }
          },
          pointer: {
            width: 5
          },
          title: {
            offsetCenter: [0, '-30%'],       // x, y，单位px
          },
          axisLabel: {
            formatter: '{value}%',
            color: ' ',
            fontSize: '10'
          },
          detail: {
            // 其余属性默认使用全局文本样式，详见TEXTSTYLE
            formatter:formatterDataRight,
            fontSize: '16',
            backgroundColor: '#FFFFFF',
            width: '65',
            rich: {
              Sunny: {
                height: 20,
                align: 'left',
                backgroundColor: {
                  image: weatherIcons.Sunny
                }
              },
              Cloudy: {
                height: 15,
                width:25,
                align: 'left',
                backgroundColor: {
                  image: weatherIcons.Cloudy
                }
              },
              Showers: {
                height: 20,
                align: 'left',
                backgroundColor: {
                  image: weatherIcons.Showers
                }
              }
            }
          },
          data:eChartsDataRight
        }
      ]
    };
    return option;
  }

  // 月份+1
  add = (i:any) => {
    const { dispatch} = this.props;
      this.setState({
        month:i+1,
      });
    let displayMonth:number=0;
    if(i === 11){
      displayMonth =12;
    }else{
      displayMonth =i+1;
    }
    const homeRankOrderModel= this.params(displayMonth)
    dispatch({
      type: 'homePage/fetchMainGraphLeft',
      payload: {
        homeRankOrderModel,
      },
    });
  }

  // 月份-1
  delete = (i:any) => {
    const { dispatch} = this.props;
      let displayMonth:number=0;
      if(i=== 1 || i === 2){
        displayMonth =1;
      }else{
        displayMonth =i-1;
      }
    const homeRankOrderModel= this.params(displayMonth)
    dispatch({
      type: 'homePage/fetchMainGraphLeft',
      payload: {
        homeRankOrderModel,
      },
    });
    this.setState({
      month:i-1,
    });
  };

  // ホームページの全パラメータ
  params=(currentMonth:any)=>{
    // @ts-ignore
    let { homeRankOrderModel,oncust}= this.props;
    let paramsUserNm;
    // @ts-ignore
    paramsUserNm=JSON.parse(homeRankOrderModel);
    const {loginUserCd} = paramsUserNm;
    const {dspYear} = paramsUserNm;
    const {dspCurrCd} = paramsUserNm;
    const {language} = paramsUserNm;
    const {userCd} = paramsUserNm;
    const {userOrgCd} = paramsUserNm;
    const {userOrgDiv} = paramsUserNm;
    const {typeNm} = paramsUserNm;
    const {typedDivi} = paramsUserNm;
    const disMonth =currentMonth;

    const caseParam: HomeRankOrderModel = {loginUserCd,dspYear,dspCurrCd,language,userCd,userOrgCd,userOrgDiv,typeNm,typedDivi,disMonth,oncust};
     // @ts-ignore
    homeRankOrderModel = JSON.stringify(caseParam);
    return homeRankOrderModel;
  }

render() {
  const { gaugeData,homeRankOrderModel} = this.props;

  if(!gaugeData){
    return null;
  }
  let gaugeDataLeft;
  let gaugeDataMiddle;
  let gaugeDataRight;
  let titleName;
  let titleName1;
  // eslint-disable-next-line no-plusplus
  for (let i=0;i < gaugeData.length;i++) {
    if (i === 0) {
      // eslint-disable-next-line prefer-destructuring
      // @ts-ignore
      gaugeDataLeft = gaugeData[i];
    }
    if (i === 1) {
      // eslint-disable-next-line prefer-destructuring
      // @ts-ignore
      gaugeDataMiddle = gaugeData[i];
    }
    if (i === 2) {
      // eslint-disable-next-line prefer-destructuring,@typescript-eslint/no-use-before-define
      // @ts-ignore
      gaugeDataRight = gaugeData[i];
    }
    if(i > 2){
      break;
    }
  }

  // @ts-ignore
  // eslint-disable-next-line prefer-const
  titleName1=JSON.parse(homeRankOrderModel);
  // eslint-disable-next-line prefer-const
  titleName=titleName1.typeNm;
  // 月份左右两边按钮显示不显示
  let disableLeft: boolean;
  let disableRight: boolean;
  if(this.state.month ===1){
    disableLeft=true;
    disableRight=false;
  }
  if(this.state.month ===12){
    disableLeft=false;
    disableRight=true;
  }
  // @ts-ignore
  if(this.state.month !== 1 && this.state.month !==12){
    disableLeft=false;
    disableRight=false;
  }
  let commonMonth:any;;
  switch (this.state.month) {
    case 1 :
      commonMonth=formatMessage({ id: "homepage.basic.Jan" });
      break;
    case 2 :
      commonMonth =formatMessage({ id: "homepage.basic.Feb" });
      break;
    case 3 :
      commonMonth =formatMessage({ id: "homepage.basic.Mar" });
      break;
    case 4 :
      commonMonth=formatMessage({ id: "homepage.basic.Apr" });
      break;
    case 5 :
      commonMonth =formatMessage({ id: "homepage.basic.May" });
      break;
    case 6:
      commonMonth =formatMessage({ id: "homepage.basic.Jun" });
      break;
    case 7 :
      commonMonth=formatMessage({ id: "homepage.basic.Jul" });
      break;
    case 8 :
      commonMonth =formatMessage({ id: "homepage.basic.Aug" });
      break;
    case 9 :
      commonMonth =formatMessage({ id: "homepage.basic.Sept" });
      break;
    case 10 :
      commonMonth=formatMessage({ id: "homepage.basic.Oct" });
      break;
    case 11:
      commonMonth =formatMessage({ id: "homepage.basic.Nov" });
      break;
    default :
      commonMonth =formatMessage({ id: "homepage.basic.Dec" });
      break;
  }


  // @ts-ignore
  return (
    <div style={{ width: '100%', height: '100%'}}>
      <span  className={styles.fontClass}>{titleName}</span>
      <br/>
      <Button 
        type='text'
        disabled={disableLeft}
        className={styles.btnStyle}
      >
        <img src={leftMonth} alt="" data-tip={formatMessage({ id: 'homepage.basic.lastMonth' })}  data-place = "bottom" data-type='light' data-class={styles.Suspensionframe1} style={{bottom:'-1px',position: 'absolute', left: '0px', fontSize: '20px', color: '#003D82',cursor:"pointer" }}  onClick={() => this.delete(this.state.month)}/>
        <ReactTooltip />
      </Button>
      <span className={styles.spanStyle}>{commonMonth}</span>
      <Button
        type='text'
        disabled={disableRight}
        className={styles.btnStyle}
      >
        <img src={rightMonth} alt="" data-tip={formatMessage({ id: 'homepage.basic.nextMonth' })}  data-place = "bottom" data-type='light' data-class={styles.Suspensionframe1} style={{bottom:'-1px',left:'0px',position: 'absolute',  fontSize: '20px', color: '#003D82',cursor:"pointer" }}  onClick={() => this.add(this.state.month)}/>
        <ReactTooltip />
      </Button>
        <ReactEcharts option={this.getOption(gaugeDataLeft,
          gaugeDataMiddle,gaugeDataRight)}  style={{ width: '100%', height: '84%'}}/>
   </div>
  );
}
}


export default connect(
  ({
     homePage,
     global,
   }: {
    homePage:EchartsState,
    loading: {
      effects: { [key: string]: boolean };
    };
    global:ConnectState;
  }) => ({
    augeDataList:homePage.augeDataList,
    oncust:global.oncust
  }),
)// @ts-ignore
(Gauge)
