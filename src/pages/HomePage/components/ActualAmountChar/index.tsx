import React, { Component } from 'react';
import  'echarts/lib/chart/pie';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import  'echarts/lib/chart/line'
import {Col,  Row} from "antd";
import ReactEcharts from "echarts-for-react";
import {connect} from "umi";
import {Dispatch, EchartsState} from "@@/plugin-dva/connect";
import down from "@/assets/down.png";
import up from "@/assets/up.png";
import original from "@/assets/original.png";
import switches from "@/assets/switches.png";
import {formatMessage} from "@@/plugin-locale/localeExports";
import styles from "./index.less";
// @ts-ignore
import ReactTooltip from "react-tooltip";
import Gauge from "@/pages/HomePage/components/Gauge";



export interface ActualAmountCharProps {
  title: React.ReactNode;
  dispatch: Dispatch;
  homeRankOrderModel:[];
}

class ActualAmountChar extends Component<ActualAmountCharProps> {
  reqRef: number = 0;

  componentDidMount() {
    const { dispatch ,homeRankOrderModel} = this.props;
    this.reqRef = requestAnimationFrame(() => {
      dispatch({
        type: 'homePage/fetchMainGraphLeft',
        payload: {
          homeRankOrderModel,
        },
      });
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'homePage/clear',
    });
    cancelAnimationFrame(this.reqRef);
  }

/*  // 数字は三桁につき、コンマで区切られています
  toThousands=(num:any)=> {
    let result = '';
    while (num.length > 3) {
      result = `,${  num.slice(-3)  }${result}`;
      // eslint-disable-next-line no-param-reassign
      num = num.slice(0, num.length - 3);
    }
    if (num) { result = num + result; }
    return result;
  } */

  // 数字は三桁につき、コンマで区切られています
   formatNum1=(strNum: string | number | any[]) =>{
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

  getOption = (item: any)=> {

    let option;
    // eslint-disable-next-line prefer-const
    const dataO:any[]=[];
    dataO.push(item.order);
    dataO.push(item.orderRigthData);
    const dataP:any[]=[];
    dataP.push(item.preorder);
    dataP.push(item.preorderRigthData);
    const dataA:any[]=[];
    dataA.push(item.avalue);
    dataA.push(item.avalueRigthData);
    const dataB:any[]=[];
    dataB.push(item.bvalue);
    dataB.push(item.bvalueRigthData);
    const dataC:any[]=[];
    dataC.push(item.cvalue);
    dataC.push(item.cvalueRigthData);
    const dataD:any[]=[];
    dataD.push(item.dvalue);
    dataD.push(item.dvalueRigthData);
    const max=item.order+item.preorder+item.avalue+item.bvalue+item.cvalue+item.dvalue;

    const dotO = '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#003D82"></span>';
    const dotP = '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#035AA6"></span>';
    const dotA = '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#0477BF"></span>';
    const dotB = '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#04B2D9"></span>';
    const dotC = '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#84BF99"></span>';
    const dotD = '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#F2E394"></span>';

    // eslint-disable-next-line prefer-const
    option = {
      backgroundColor: '#FFFFFF',
      color: ['#003D82', '#035AA6', '#0477BF', '#04B2D9', '#84BF99', '#F2E394'],
      tooltip: {
        trigger: 'axis',
        position: {left: '5%', top: '100%'},
        formatter (params: string | any[]) {
          let result = '';
          result += `${dotO + params[0].seriesName}: ${formatNum(dataO[0])} (Original:${formatNum(dataO[1])})<br/>`;
          if (params.length > 1) {
            result += `${dotP + params[1].seriesName}: ${formatNum(dataP[0])} (Original:${formatNum(dataP[1])})<br/>`;
          }
          if (params.length > 2) {
            result += `${dotA + params[2].seriesName}: ${formatNum(dataA[0])} (Original:${formatNum(dataA[1])})<br/>`;
          }
          if (params.length > 3) {
            result += `${dotB + params[3].seriesName}: ${formatNum(dataB[0])} (Original:${formatNum(dataB[1])})<br/>`;
          }
          if (params.length > 4) {
            result += `${dotC + params[4].seriesName}: ${formatNum(dataC[0])} (Original:${formatNum(dataC[1])})<br/>`;
          }
          if (params.length > 5) {
            result += `${dotD + params[5].seriesName}: ${formatNum(dataD[0])} (Original:${formatNum(dataD[1])})<br/>`;
          }
          return result;
        }
      },
      grid: {
        left: 0,
        top: 0,
        //right: 0,
        width: '100%',
        height: 5
      },
      xAxis: {
        max: max,
        show: false
      },
      yAxis: {
        show: true,
        // inverse: true,
        splitLine: {show: false},
        axisLine: {show: false},
        axisTick: {show: false},
        data: ['a']
      },
      series: [
        {
          name: 'ordered',
          type: 'bar',
          stack: 'amt',
          data: dataO
        },
        {
          name: 'preorder',
          type: 'bar',
          stack: 'amt',
          data: dataP
        },
        {
          name: 'A',
          type: 'bar',
          stack: 'amt',
          data: dataA
        },
        {
          name: 'B',
          type: 'bar',
          stack: 'amt',
          data: dataB
        },
        {
          name: 'C',
          type: 'bar',
          stack: 'amt',
          data: dataC
        },
        {
          name: 'D',
          type: 'bar',
          stack: 'amt',
          data: dataD
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

  // @ts-ignore
  // eslint-disable-next-line consistent-return
  effortUnit=(key:any)=> {
    if (key === 1) {
      return (
        <span className={styles.unit}>{formatMessage({id: 'homepage.basic.YoY'})}</span>
      )
    }if (key === 2) {
      return (
        <span className={styles.unit}>{formatMessage({id: 'homepage.basic.YoY'})}</span>
      )
    }if (key === 3) {
      return (
        <span className={styles.unit}>{formatMessage({id: 'homepage.basic.MoM'})}</span>
      )
    }
  }

  // @ts-ignore
  // eslint-disable-next-line consistent-return
  arrowDisplay=(percentage:any) => {
    if (percentage <0) {
      // YoY比率＜0の場合、下矢印アイコンを表示する
      return (
        <span>
          {`${Math.abs(Number(percentage)).toString()}%`}
          <img src={down} alt="" />
        </span>
      )
    }if (percentage ===0) {
      // YoY比率＝0の場合、下矢印／上矢印アイコンを表示しない
      return (
        <span>
          {`${percentage}%`}
        </span>
      )
    }if (percentage >0) {
      // YoY比率＞0の場合、上矢印アイコンを表示する
      return (
        <span>
          {`${percentage}%`}
          <img src={up} alt=""/>
        </span>
      )
    }
  }

  render() {
    // @ts-ignore
    const {mainGraphLeft,homeRankOrderModel} = this.props;
    console.log("homeRankOrderModel",homeRankOrderModel);
    
    if(!mainGraphLeft){
      return null;
    }
    let key=1;
    let i=1;
    return (
      <div  className={styles.widthHeight}>
        <Row
          gutter={24}
          align="middle">
          <Col xl={24} lg={24} md={24} sm={24} xs={24} style={{paddingRight: '0px'}}>
        {mainGraphLeft.map((item:any) => (
          <div className={styles.divClass}>
            <Row
              gutter={24}
              align="middle">
              <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                { item.title !==undefined && item.title !== null && item.title!== null ?
                 <h4 className={styles.setTitle}>{item.title}</h4>
                  :
                  <div style={{height:'35px',backgroundColor:'white'}}></div>
                }
            <p className={styles.content}>{this.formatNum1(parseFloat(item.actualityAmount))}</p>
                {/* eslint-disable-next-line no-plusplus */}
              {this.effortUnit(key++)}
             {this.arrowDisplay(item.percentage)}
              <ReactEcharts option={this.getOption(item)} style={{height:7,width:'90%',left:8,right:'90%'}} />
              <img src={original} alt="" data-tip={formatMessage({id: 'homepage.basic.Originalinputamount'})} data-place = "bottom" data-type='light' data-class={styles.Suspensionframe} style={{position: 'absolute', left: '40%', fontSize: '15px'}}/>
              <ReactTooltip />
              <span style={{position: 'absolute', left: '46%', fontSize: '12px' }}> {this.formatNum1(parseFloat(item.actualityBudgetAmount))}</span>
             <img src={switches} alt="" data-tip={formatMessage({id: 'homepage.basic.BudgetTitle'})} data-place = "bottom" data-type='light' data-class={styles.Suspensionframe} style={{position: 'absolute', left: '70%', fontSize: '15px'}}/>
             <ReactTooltip />
             <span  style={{position: 'absolute', left: '76%', fontSize: '12px' }}>{this.formatNum1( parseFloat(item.budgetAmount))}</span>
            <br/>
                { i++ <3 ?
                  <div style={{height:'11px',background: '#F2F2F2' }} />
                  :
                  <div />
                }

          </Col>
          </Row>

          </div>
        ))}
          </Col>
        {/*  <Col xl={18} lg={24} md={24} sm={24} xs={24} style={{textAlign: 'center'}}>
           <Gauge gaugeData={mainGraphLeft} homeRankOrderModel={homeRankOrderModel}/>
          </Col> */}
        </Row>
      </div>

    );
  }
}
export default connect(
  ({
     homePage,
   }: {
    homePage:EchartsState,
    loading: {
      effects: { [key: string]: boolean };
    };
  }) => ({
    mainGraphLeft:homePage.mainGraphLeft,
  }),
)// @ts-ignore
(ActualAmountChar)

