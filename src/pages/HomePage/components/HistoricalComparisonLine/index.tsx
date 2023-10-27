import React, { Component } from 'react';
import  'echarts/lib/chart/bar';
import  'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import ReactEcharts from 'echarts-for-react';
import {formatMessage} from "@@/plugin-locale/localeExports";

export interface HistoricalComparisonLineProps {
  title: React.ReactNode;
  legendData:[];
  thisYear:[];
  lastYear:[];
  beforeLastYear:[];
  fourYear:[];
  fiveYear:[];
}

class HistoricalComparisonLine extends Component<HistoricalComparisonLineProps>{

/*
   componentDidMount() {
    this.getOption(this.props.historicalComparisonLine)
  }

  componentDidUpdate() {
    // 每次更新组件都重置
    this.getOption(this.props.historicalComparisonLine)
  }
*/

  getOption = (legendData: any, thisYear: any, lastYear: any, beforeLastYear: any,fourYear: any,fiveYear:any,year:any)=>{
    let option;
    const title4 =legendData[4].replace(/([^:]+)$/, '').replace(":","");
    const title3 =legendData[3].replace(/([^:]+)$/, '').replace(":","");
    const title2 =legendData[2].replace(/([^:]+)$/, '').replace(":","");

    const title1 =legendData[1].replace(/([^:]+)$/, '').replace(":","");

    const title0 =legendData[0].replace(/([^:]+)$/, '').replace(":","");


    const monthData: any[]=[];
    // @ts-ignore
    // eslint-disable-next-line no-plusplus,no-empty
    for(let i=0;i <= 12;i++){
      let commonMonth:any;
      switch (i) {
        case 0:
          commonMonth="";
          break;
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
      monthData.push(commonMonth);
    }
    let salesTitleY= formatMessage({ id: "homepage.basic.Sales" });

    // eslint-disable-next-line prefer-const
    let seriesData =  [
      {
      name: title4,
      data: fourYear,
      type: 'line',
      color: '#33ffcc',
      // color: '#A3C4D9',
      smooth: true,
      lineStyle: {width: 3},
      itemStyle: {
        borderWidth: 2
      },
      markPoint: {
        symbol: 'rect',
        symbolSize: [25,3],
        data: [{x: '18%', y: '5%'}],
        label: {
          color: '#000000',
          position: 'right',
          formatter(params: { seriesIndex: React.ReactText; }) {
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            let datavalue = series[params.seriesIndex].data[12];
            // eslint-disable-next-line no-use-before-define,@typescript-eslint/no-use-before-define
            return `${title2}:${ formatNum(datavalue)}`;
          }
        }
      }
    },
      {
      name: title3,
      data: fiveYear,
      type: 'line',
      color: '#39C5BB',
      // color: '#A3C4D9',
      smooth: true,
      lineStyle: {width: 3},
      itemStyle: {
        borderWidth: 2
      },
      markPoint: {
        symbol: 'rect',
        symbolSize: [25,3],
        data: [{x: '18%', y: '10%'}],
        label: {
          color: '#000000',
          position: 'right',
          formatter(params: { seriesIndex: React.ReactText; }) {
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            let datavalue = series[params.seriesIndex].data[12];
            // eslint-disable-next-line no-use-before-define,@typescript-eslint/no-use-before-define
            return `${title2}:${ formatNum(datavalue)}`;
          }
        }
      }
    },
      {
      name: title2,
      data: beforeLastYear,
      type: 'line',
      color: '#56A6A6',
      // color: '#A3C4D9',
      smooth: true,
      lineStyle: {width: 3},
      itemStyle: {
        borderWidth: 2
      },
      markPoint: {
        symbol: 'rect',
        symbolSize: [25,3],
        data: [{x: '18%', y: '15%'}],
        label: {
          color: '#000000',
          position: 'right',
          formatter(params: { seriesIndex: React.ReactText; }) {
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            let datavalue = series[params.seriesIndex].data[12];
            // eslint-disable-next-line no-use-before-define,@typescript-eslint/no-use-before-define
            return `${title2}:${ formatNum(datavalue)}`;
          }
        }
      }
    },
      {
        name:title1,
        data: lastYear,
        type: 'line',
        color: '#079DD9',
        // color: '#048ABF',
        smooth: true,
        lineStyle: {width: 3},
        itemStyle: {
          borderWidth: 2
        },
        markPoint: {
          symbol: 'rect',
          symbolSize: [25,3],
          data: [{x: '18%', y: '20%'}],
          label: {
            color: '#000000',
            position: 'right',
            formatter(params: { seriesIndex: React.ReactText; }) {
              // eslint-disable-next-line @typescript-eslint/no-use-before-define,@typescript-eslint/no-unused-vars
              let datavalue = series[params.seriesIndex].data[12];
              // eslint-disable-next-line no-use-before-define,@typescript-eslint/no-use-before-define
              return `${title1 }:${formatNum(datavalue)}`;
            }
          }
        }
      },
      {
        name: title0,
        data: thisYear,
        type: 'line',
        color: '#0D448C',
        // color: '#18358C',
        smooth: true,
        lineStyle: {width: 3},
        itemStyle: {
          borderWidth: 2
        },
        markPoint: {
          symbol: 'rect',
          symbolSize: [25,3],
          data: [{x: '18%', y: '25%'}],
          label: {
            color: '#000000',
            position: 'right',
            // @ts-ignore
            formatter(params: { seriesIndex: React.ReactText; }) {
              // eslint-disable-next-line @typescript-eslint/no-use-before-define,@typescript-eslint/no-unused-vars
              let datavalue = series[params.seriesIndex].data[12];
              // eslint-disable-next-line no-use-before-define,@typescript-eslint/no-use-before-define
              return `${title0 }:${formatNum(datavalue)}`;
            }
          }
        }
      }]
     if (year < 5) {
      seriesData.shift();
      }
     if (year < 4) {
       seriesData.shift();
         }
     if (year < 3) {
       seriesData.shift(); 
     }
    option = {
      backgroundColor: '#FFFFFF',
      grid: {
        left: '12%',
        // right: 20,
        top: '30%',
        // bottom: 380
        height:'60%',
        width: '85%'
      },
      // legend: {
      //     left: 100,
      //     top: 5,
      //     orient: 'vertical',
      //     data: ['2018', '2019', '2020']
      // },
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data:monthData,
      },
      yAxis: {
        type: 'value',
        name: salesTitleY
      },
      series: seriesData
    };

    function formatNum(strNum: string | any[]) {
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

    // @ts-ignore
    const {series} = option;

    return option;
  }

  render() {
    const { legendData,thisYear,lastYear, beforeLastYear,fiveYear,fourYear,year} = this.props;
    return (
        <div>
          <ReactEcharts key={this.props.year} style={{ top:10, width: '102%', height:'300%' }} option={this.getOption(legendData,thisYear,lastYear, beforeLastYear,fourYear,fiveYear,year)} />
        </div>
    );
  }
}

export default HistoricalComparisonLine;
