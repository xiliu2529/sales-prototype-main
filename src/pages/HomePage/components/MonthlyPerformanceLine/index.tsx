import React, { Component } from 'react';
import  'echarts/lib/chart/bar';
import  'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import ReactEcharts from 'echarts-for-react';
import {formatMessage} from "@@/plugin-locale/localeExports";

export interface MonthlyPerformanceLineProps {
  title: React.ReactNode;
  legendData:[];
  budgetData:[];
  salesData:[];
}

class MonthlyPerformanceLine extends Component<MonthlyPerformanceLineProps>{

  getOption = (legendData: any[], budgetData: any[], salesData: any[])=>{

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
    let budgetTitleY= formatMessage({ id: "homepage.basic.BudgetTitle" });

    let option;
    // eslint-disable-next-line prefer-const
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
      //     top: 10,
      //     orient: 'vertical',
      //     data: ['Budget', 'Sales']
      // },
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: monthData
      },
      yAxis: {
        type: 'value',
        name: salesTitleY
      },
      series: [{
        name: budgetTitleY,
        data: budgetData,
        type: 'line',
        color: '#62BCFA',
        smooth: true,
        lineStyle: {width: 3},
        markPoint: {
          symbol: 'rect',
          symbolSize: [25,3],
          data: [{x: '18%', y: '15%'}],
          label: {
            color: '#000000',
            position: 'right',
            formatter(params: { seriesIndex: React.ReactText; }) {
              // eslint-disable-next-line no-use-before-define,@typescript-eslint/no-use-before-define
              return series[params.seriesIndex].name;
            }
          }
        }
      },
        {
          name: salesTitleY,
          data: salesData,
          type: 'line',
          color: '#0D448C',
          smooth: true,
          lineStyle: {width: 3},
          markPoint: {
            symbol: 'rect',
            symbolSize: [25,3],
            data: [{x: '18%', y: '25%'}],
            label: {
              color: '#000000',
              position: 'right',
              // @ts-ignore
              formatter(params: { seriesIndex: React.ReactText; }) {
                // eslint-disable-next-line no-use-before-define,@typescript-eslint/no-use-before-define
                return series[params.seriesIndex].name;
              }
            }
          }
        }]
    };

    // @ts-ignore
    let {series} = option;

    return option;
  }

  render() {
    const { legendData,budgetData,salesData} = this.props;
    return (
      <div>
        <ReactEcharts style={{ top:10, width: '102%', height:'300%' }} option={this.getOption(legendData,budgetData,salesData)} />

      </div>
    );
  }
}

export default MonthlyPerformanceLine;
