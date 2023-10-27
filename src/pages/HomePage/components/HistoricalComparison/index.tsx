import React, { Component } from 'react';
// @ts-ignore
import echarts from 'echarts/lib/echarts';
import  'echarts/lib/chart/bar';
import  'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import ReactEcharts from 'echarts-for-react';
import {formatMessage} from "@@/plugin-locale/localeExports";

export interface HistoricalComparisonProps {
  title: React.ReactNode;
  legendData:[];
  thisYear:[];
  lastYear:[];
  beforeLastYear:[];
  fourYear:[];
  fiveYear:[];
}

class HistoricalComparison extends Component<HistoricalComparisonProps>{

   /* componentDidMount() {
    this.getOption(this.props.historicalComparison)
  }

  componentDidUpdate() {
    // 每次更新组件都重置
    this.getOption(this.props.historicalComparison)
  }
*/
  getOption = ( legendData: any, thisYear: any, lastYear: any, beforeLastYear: any,fourYear :any,fiveYear:any,year:any)=>{

    const title4 =legendData[4].replace(/([^:]+)$/, '').replace(":","");
    const title3 =legendData[3].replace(/([^:]+)$/, '').replace(":","");
    const title2 =legendData[2].replace(/([^:]+)$/, '').replace(":","");
    // const title2 =legendData[2];
    // const title1 =legendData[1];
    // const title0 =legendData[0];
    const title1 =legendData[1].replace(/([^:]+)$/, '').replace(":","");

    const title0 =legendData[0].replace(/([^:]+)$/, '').replace(":","");

    let salesTitleY= formatMessage({ id: "homepage.basic.Sales" });

    const monthData: any[]=[];
    // @ts-ignore
    // eslint-disable-next-line no-plusplus,no-empty
    for(let i=1;i <= 12;i++){
      let commonMonth:any;
      switch (i) {
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
    let option ;
    let seriesData = [
       {
          name: title4,
          type: 'bar',
          lineStyle: {
            width: 3,
            color: '#33ffcc'
          },
          markPoint: {
            symbol: 'roundRect',
            symbolSize: [20, 8],
            data: [{x: '15%', y: '5%'}],
            label: {
              position: 'right',
              formatter(params: { seriesIndex: string | number; }) {
                let datavalue = 0;
                // eslint-disable-next-line no-plusplus
                for (let i = 0; i < 12; i++) {
                  // eslint-disable-next-line @typescript-eslint/no-use-before-define
                  datavalue += parseFloat(series[series.length-5].data[i]);
                }
                // eslint-disable-next-line no-use-before-define,@typescript-eslint/no-use-before-define
                return `${title4}:${ formatNum(datavalue)}`;
              }
            }
          },
          itemStyle: {
            normal: {
              barBorderRadius: 5,
              color: new echarts.graphic.LinearGradient(
                0, 0, 0, 1,
                [
                  {offset: 1, color: '#33ffcc'},
                  {offset: 0, color: '#33ffcc'}
                ]
              )
            }
          },
       
          data:fiveYear
        },
       {
            name: title3,
            type: 'bar',
            lineStyle: {
              width: 3,
              color: '#39C5BB'
            },
            markPoint: {
              symbol: 'roundRect',
              symbolSize: [20, 8],
              data: [{x: '15%', y: '10%'}],
              label: {
                position: 'right',
                formatter(params: { seriesIndex: string | number; }) {
                  let datavalue = 0;
                  // eslint-disable-next-line no-plusplus
                  for (let i = 0; i < 12; i++) {
                    // eslint-disable-next-line @typescript-eslint/no-use-before-define
                    datavalue += parseFloat(series[series.length-4].data[i]);
                  }
                  // eslint-disable-next-line no-use-before-define,@typescript-eslint/no-use-before-define
                  return `${title3}:${ formatNum(datavalue)}`;
                }
              }
            },
            itemStyle: {
              normal: {
                barBorderRadius: 5,
                color: new echarts.graphic.LinearGradient(
                  0, 0, 0, 1,
                  [
                    {offset: 1, color: '#39C5BB'},
                    {offset: 0, color: '#39C5BB'}
                  ]
                )
              }
            },
            data:fourYear
        },
       {
          name: title2,
          type: 'bar',
          lineStyle: {
            width: 3,
            color: '#C3E3F5'
          },
          markPoint: {
            symbol: 'roundRect',
            symbolSize: [20, 8],
            data: [{x: '15%', y: '15%'}],
            label: {
              position: 'right',
              formatter(params: { seriesIndex: string | number; }) {
                let datavalue = 0;
                // eslint-disable-next-line no-plusplus
                for (let i = 0; i < 12; i++) {
                  // eslint-disable-next-line @typescript-eslint/no-use-before-define
                  datavalue += parseFloat(series[series.length-3].data[i]);
                }
                // eslint-disable-next-line no-use-before-define,@typescript-eslint/no-use-before-define
                return `${title2}:${ formatNum(datavalue)}`;
              }
            }
          },
          itemStyle: {
            normal: {
              barBorderRadius: 5,
              color: new echarts.graphic.LinearGradient(
                0, 0, 0, 1,
                [
                  {offset: 1, color: '#E8F6FF'},
                  {offset: 0, color: '#C3E3F5'}
                ]
              )
            }
          },
          data:beforeLastYear
        },
        {
          name: title1,
          type: 'bar',
          lineStyle: {
            width: 3,
            color: '#62BCFA'
          },
          markPoint: {
            symbol: 'roundRect',
            symbolSize: [20, 8],
            data: [{x: '15%', y: '20%'}],
            label: {
              position: 'right',
              formatter(params: { seriesIndex: React.ReactText; }):string {
                let datavalue = 0;
                // eslint-disable-next-line no-plusplus
                for (let i = 0; i < 12; i++) {
                  // eslint-disable-next-line @typescript-eslint/no-use-before-define
                  datavalue +=parseFloat(series[series.length-2].data[i]);
                }
                // eslint-disable-next-line no-use-before-define,@typescript-eslint/no-use-before-define
                return `${title1}:${ formatNum(datavalue)}`;
              }
            }
          },
          itemStyle: {
            normal: {
              barBorderRadius: 5,
              color: new echarts.graphic.LinearGradient(
                0, 0, 0, 1,
                [
                  {offset: 1, color: '#C3E3F5'},
                  {offset: 0, color: '#62BCFA'}
                ]
              )
            }
          },
          data: lastYear
        },
        {
          name: title0,
          type: 'bar',
          lineStyle: {
            width: 3,
          },
          markPoint: {
            symbol: 'roundRect',
            symbolSize: [20, 8],
            data: [{x: '15%', y: '25%'}],
            label: {
              position: 'right',
              formatter(params: { seriesIndex: React.ReactText; }) {
                let datavalue = 0;
                // eslint-disable-next-line no-plusplus
                for (let i = 0; i < 12; i++) {
                  // eslint-disable-next-line @typescript-eslint/no-use-before-define
                  datavalue += parseFloat(series[series.length-1].data[i]);
                }
                // eslint-disable-next-line no-use-before-define,@typescript-eslint/no-use-before-define
                return `${title0}:${ formatNum(datavalue)}`;
              }
            }
          },
          itemStyle: {
            normal: {
              barBorderRadius: 5,
              color: new echarts.graphic.LinearGradient(
                0, 0, 0, 1,
                [
                  {offset: 1, color: '#62BCFA'},
                  {offset: 0, color: '#003D82'}
                ]
              )
            }
          },
          data: thisYear
        }
    ];
      if (year < 5) {
       seriesData.shift();
       }
      if (year < 4) {
        seriesData.shift();
          }
      if (year < 3) {
        seriesData.shift(); 
      }
    // eslint-disable-next-line prefer-const
      option = {
        backgroundColor: '#FFFFFF',
        grid: {
          left: '10%',
          right: '5%',
          top: '90%',
          bottom: '70%'
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: [
          {
            type: 'category',
            data: monthData,
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: salesTitleY,
            axisLabel: {
              formatter: '{value}'
            }
          }
        ],
      
        series: seriesData
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
    const {series} = option;
    return option;
  }

render() {
  const { legendData,thisYear,lastYear, beforeLastYear,fourYear,fiveYear,year } = this.props;
  return (
      <div>
        <ReactEcharts key={this.props.year} style={{ top: 10, width: '102%', height: '300%' }}option={this.getOption(legendData, thisYear, lastYear, beforeLastYear, fourYear, fiveYear, year)}/>
      </div>
  );
}
}

export default HistoricalComparison;
