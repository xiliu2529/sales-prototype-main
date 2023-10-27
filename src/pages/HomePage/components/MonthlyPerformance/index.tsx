import React, {Component} from 'react';
// @ts-ignore
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import ReactEcharts from 'echarts-for-react';
import {Row, Switch,Radio} from "antd";
import HistoricalComparison from "@/pages/HomePage/components/HistoricalComparison";
import MonthlyPerformanceLine from "@/pages/HomePage/components/MonthlyPerformanceLine";
import HistoricalComparisonLine from "@/pages/HomePage/components/HistoricalComparisonLine";
import {connect} from "umi";
import {EchartsState} from "@/pages/HomePage/model";
import {Dispatch, ModalState} from "@@/plugin-dva/connect";
import {BudgetOrHistDataList} from "@/pages/HomePage/data";
import {formatMessage} from "@@/plugin-locale/localeExports";
import columnarAtlas from "@/assets/columnarAtlas.png";
import leiji from "@/assets/leiji.png";


export interface MonthlyPerformanceProps {
  title: React.ReactNode;
  budgetOrHistDataList:BudgetOrHistDataList;
  budgetOrhistorical?:boolean;
  typIndex?:number;
  dispatch: Dispatch;
  year: any;
}


class MonthlyPerformance extends Component<MonthlyPerformanceProps>{

  constructor(props: Readonly<MonthlyPerformanceProps>) {
    super(props);
    this.state = {
      budgetOrhistorical:true,
      typIndex:0,
      year:3,
    };
    this.chartChange = this.chartChange.bind(this);
    this.barChange = this.barChange.bind(this);
    this.switchOnChange=this.switchOnChange.bind(this);
  }

  // ヒストグラムに切り替え
  chartChange() {
    this.setState({
      // eslint-disable-next-line react/no-access-state-in-setstate
      typIndex: 1,
    });
  }

  // 線に切り替え
  barChange() {
    this.setState({
      // eslint-disable-next-line react/no-access-state-in-setstate
      typIndex: 0,
    });
  }

 // 月営業データと五年営業データの切り替え
  switchOnChange() {
    // @ts-ignore
    const {budgetOrhistorical} = this.state;
    this.setState({
      // eslint-disable-next-line react/no-access-state-in-setstate
      budgetOrhistorical: !budgetOrhistorical,
    });
  }
  BudgetDiff() {
    // @ts-ignore
    const {budgetOrhistorical} = this.state;
    this.setState({
      // eslint-disable-next-line react/no-access-state-in-setstate
      budgetOrhistorical: true,
    });
  }

   handleRadioChange(value:any) {
    const {budgetOrhistorical,year} = this.state;
      if(value == 1){
        this.BudgetDiff()
      }else{
    this.setState({
            // eslint-disable-next-line react/no-access-state-in-setstate
            budgetOrhistorical: false,
            year:value
          });
      }
  }

  componentDidMount() {
    // @ts-ignore
    const { dispatch,homeRankOrderModel } = this.props;
    dispatch({
      type: 'homePage/fetchBudgetOrHistData',
      payload: {
        homeRankOrderModel,
      },
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-shadow
  getOption = (legendData: any[], budgetData: any[], salesData: any[],budgetEffort: any, actuallyEffort: any, maxY: any)=>{

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
    let salesTitleY= formatMessage({ id: "homepage.basic.Sales" });
    let effortTitleY= formatMessage({ id: "homepage.basic.Effort" });
    let budgetTitleY= formatMessage({ id: "homepage.basic.BudgetTitle" });

    let legendDataY :any[]=[];

    legendDataY.push(budgetTitleY,salesTitleY)

    let option;
    // eslint-disable-next-line prefer-const
      option = {
        backgroundColor: '#FFFFFF',
        grid: {
          left: '10%',
          right: '8%',
          top: '90%',
          bottom: '70%'
        },
        // toolbox: {
        //     show: true,
        //     feature: {
        //       magicType: {
        //         type: [ "bar", "line"]
        //       }
        //     }
        // },
        tooltip: {
          trigger: 'axis',
          formatter(params:any) {
            let result = `${params[0].name  }<br/>`;
            const dotBudget = '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#BBC4EF"></span>';
            result += `${dotBudget + params[0].seriesName  }: ${  formatNum(params[0].data)  }(${  formatNum(params[2].data.toFixed(0))  })<br/>`;
            const dotSales = '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#62BCFA"></span>';
            result += `${dotSales + params[1].seriesName  }: ${  formatNum(params[1].data)  }(${  formatNum(params[3].data.toFixed(0))  })<br/>`;
            const dotPer = '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#FCCDD3"></span>';
            let startSpan = '';
            const endSpan = '</span>';
            const datavalue = params[1].data- params[0].data;
            if (datavalue < 0) {
              startSpan = '<span style="color:#D7484C">';
            } else {
              startSpan = '<span style="color:#003D82">';
            }

            if( parseFloat(params[1].data) >0 && parseFloat(params[0].data) ===0){
              result += `${dotPer  }Ach%:100 ( ${ startSpan}${formatNum(datavalue)}${endSpan } )`;
            }
            if(parseFloat(params[1].data) ===0 && parseFloat(params[0].data) ===0){
              result += `${dotPer  }Ach%:0 ( ${ startSpan}${formatNum(datavalue)}${endSpan } )`;
            }
            if(parseFloat(params[0].data) !== 0){
              result += `${dotPer  }Ach%: ${  (params[1].data / params[0].data * 100).toFixed(0)  } ( <b>${ startSpan}${formatNum(datavalue)}${endSpan } </b>)`;
            }
            return result;
          }
        },
        legend: {
          left: '12%',
          top: '7%',
          orient: 'vertical',
          data: legendDataY,
          selectedMode:false
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
            max: maxY,   // 柱状最大值两倍
            axisLabel: {
              formatter: '{value}'
            }
          },
          {
            type: 'value',
            name: effortTitleY,
            splitLine: {
              show: false
            },
            axisLabel: {
              formatter: '{value}'
            }
          }
        ],
        series: [
          {
            name: budgetTitleY,
            type: 'bar',
            yAxisIndex: 0,
            barWidth: 15,
            lineStyle: {
              width: 3,
              color: '#BBC4EF'
            },
            itemStyle: {
              normal: {
                barBorderRadius: 5,
                color: new echarts.graphic.LinearGradient(
                  0, 0, 0, 1,
                  [
                    {offset: 1, color: '#FFFFFF'},
                    // {offset: 0.2, color: 'rgba(156,107,211,0.5)'},
                    {offset: 0, color: '#BBC4EF'}
                  ]
                )
              }
            },
            data:budgetData
          },
          {
            name: salesTitleY,
            type: 'bar',
            yAxisIndex: 0,
            barWidth: 15,
            lineStyle: {
              width: 3
            },
            label: {
              show: true,
              position: 'top',
              rich: {
                colorRed: {
                  color: '#D7484C',
                  fontWeight: 'bolder'
                },
                colorBlue: {
                  color: '#003D82',
                  fontWeight: 'bolder'
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
            data:salesData
          },
          {
            name: budgetTitleY,
            type: 'line',
            lineStyle: {
              color: "#BBC4EF"
            },
            itemStyle: {
              color: "#BBC4EF"
            },
            yAxisIndex: 1,
            data: budgetEffort
          },
          {
            name: salesTitleY,
            type: 'line',
            lineStyle: {
              color: "#003D82"
            },
            itemStyle: {
              color: "#003D82"
            },
            yAxisIndex: 1,
            data: actuallyEffort
          }
        ]
      };

      function formatNum(strNum) {
      if (strNum.length <= 3) {
        return strNum;
      }
      if (!/^(\+|-)?(\d+)(\.\d+)?$/.test(strNum)) {
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
    // @ts-ignore
    const fun = function(params) {
      const datavalue = series[1].data[params.dataIndex]- series[0].data[params.dataIndex];
      if (datavalue < 0) {
        return `{colorRed|${  formatNum(datavalue)  }}`;
      }
        return `{colorBlue|+${  formatNum(datavalue)  }}`;

    }
    // @ts-ignore
    series[1].label.formatter = fun;

    return option;
  }






/*

    let option;
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
        trigger: 'axis',
       formatter(params: {
          seriesName: string;
          name: any;
          data: number; }[]) {
          let result = `${params[0].name  }<br/>`;
          const dotBudget = '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#BBC4EF"></span>';
          result += `${dotBudget + params[0].seriesName  }: ${  formatNum(params[0].data)  }<br/>`;
          const dotSales = '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#62BCFA"></span>';
          result += `${dotSales + params[1].seriesName  }: ${  formatNum(params[1].data)  }<br/>`;
          const dotPer = '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#FCCDD3"></span>';
          result += `${dotPer  }Percent complete: ${  (params[1].data / params[0].data * 100).toFixed(0)  }%`;
          return result;
        }
      },
      legend: {
        left: '12%',
        top: '10%',
        orient: 'vertical',
        data: legendData
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
          name: 'Sales',
          axisLabel: {
            formatter: '{value}'
          }
        }
      ],
      series: [
        {
          name: 'Budget',
          type: 'bar',
          barWidth: 15,
          lineStyle: {
            width: 3,
            color: '#BBC4EF'
          },
          itemStyle: {
            normal: {
              barBorderRadius: 5,
              color: new echarts.graphic.LinearGradient(
                0, 0, 0, 1,
                [
                  {offset: 1, color: '#FFFFFF'},
                  // {offset: 0.2, color: 'rgba(156,107,211,0.5)'},
                  {offset: 0, color: '#BBC4EF'}
                ]
              )
            }
          },
          data: budgetData
        },
        {
          name: 'Sales',
          type: 'bar',
          barWidth: 15,
          lineStyle: {
            width: 3
          },
          label: {
            show: true,
            position: 'top',
            rich: {
              colorRed: {
                color: '#D7484C',
                fontWeight: 'bolder'
              },
              colorBlue: {
                color: '#003D82',
                fontWeight: 'bolder'
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
          data:salesData
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

    // @ts-ignore
    // eslint-disable-next-line no-use-before-define,@typescript-eslint/no-use-before-define
    const {series} = option;
    const fun = function (params: { dataIndex: string | number; }) {
      const datavalue = series[1].data[params.dataIndex] - series[0].data[params.dataIndex];
      if (datavalue < 0) {
        return `{colorRed|${  formatNum(datavalue)  }}`;
      }
      return `{colorBlue|+${  formatNum(datavalue)  }}`;

    }
    // @ts-ignore
    series[1].label.formatter = fun;

    return option;
  } */

  render() {
    // @ts-ignore
    const { budgetOrHistDataList} = this.props;

    if(!budgetOrHistDataList){
      return null;
    }
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const legendData:any[]=[];
    const legendDataHist:any[]=[];
    const budgetData:any[]=[];
    const salesData:any[]=[];
    const budgetEffort:any[]=[];
    const actuallyEffort:any[]=[];

    const thisYear:any[]=[];
    const lastYear:any[]=[];
    const beforeLastYear:any[]=[];
    const fourYear:any[]=[];
    const fiveYear:any[]=[];

    // @ts-ignore
    // eslint-disable-next-line no-plusplus
    for (let i=0;i < budgetOrHistDataList.length;i++) {
      if(i<2){
        // Home Page_月営業データ:図のタイトル
        legendData.push(budgetOrHistDataList[i].title);
      }else {
        // 五年営業データ:図のタイトル
        legendDataHist.push(budgetOrHistDataList[i].title);
      }
      // Home Page_月営業データ: 図のデータ
      if(i===0){
        // Home Page_月営業データ:予算のヒストグラムのデータ
        budgetData.push(budgetOrHistDataList[i].month1.toFixed(0));
        budgetData.push(budgetOrHistDataList[i].month2.toFixed(0));
        budgetData.push(budgetOrHistDataList[i].month3.toFixed(0));
        budgetData.push(budgetOrHistDataList[i].month4.toFixed(0));
        budgetData.push(budgetOrHistDataList[i].month5.toFixed(0));
        budgetData.push(budgetOrHistDataList[i].month6.toFixed(0));
        budgetData.push(budgetOrHistDataList[i].month7.toFixed(0));
        budgetData.push(budgetOrHistDataList[i].month8.toFixed(0));
        budgetData.push(budgetOrHistDataList[i].month9.toFixed(0));
        budgetData.push(budgetOrHistDataList[i].month10.toFixed(0));
        budgetData.push(budgetOrHistDataList[i].month11.toFixed(0));
        budgetData.push(budgetOrHistDataList[i].month12.toFixed(0));

        // Home Page_月営業データ: 工数の線図のデータ
        budgetEffort.push(budgetOrHistDataList[i].effort1);
        budgetEffort.push(budgetOrHistDataList[i].effort2);
        budgetEffort.push(budgetOrHistDataList[i].effort3);
        budgetEffort.push(budgetOrHistDataList[i].effort4);
        budgetEffort.push(budgetOrHistDataList[i].effort5);
        budgetEffort.push(budgetOrHistDataList[i].effort6);
        budgetEffort.push(budgetOrHistDataList[i].effort7);
        budgetEffort.push(budgetOrHistDataList[i].effort8);
        budgetEffort.push(budgetOrHistDataList[i].effort9);
        budgetEffort.push(budgetOrHistDataList[i].effort10);
        budgetEffort.push(budgetOrHistDataList[i].effort11);
        budgetEffort.push(budgetOrHistDataList[i].effort12);

      }
      if(i===1){
         // Home Page_月営業データ:販売のヒストグラムのデータ
        salesData.push(budgetOrHistDataList[i].month1.toFixed(0));
        salesData.push(budgetOrHistDataList[i].month2.toFixed(0));
        salesData.push(budgetOrHistDataList[i].month3.toFixed(0));
        salesData.push(budgetOrHistDataList[i].month4.toFixed(0));
        salesData.push(budgetOrHistDataList[i].month5.toFixed(0));
        salesData.push(budgetOrHistDataList[i].month6.toFixed(0));
        salesData.push(budgetOrHistDataList[i].month7.toFixed(0));
        salesData.push(budgetOrHistDataList[i].month8.toFixed(0));
        salesData.push(budgetOrHistDataList[i].month9.toFixed(0));
        salesData.push(budgetOrHistDataList[i].month10.toFixed(0));
        salesData.push(budgetOrHistDataList[i].month11.toFixed(0));
        salesData.push(budgetOrHistDataList[i].month12.toFixed(0));

        // Home Page_月営業データ: 工数の線図のデータ
        actuallyEffort.push(budgetOrHistDataList[i].effort1);
        actuallyEffort.push(budgetOrHistDataList[i].effort2);
        actuallyEffort.push(budgetOrHistDataList[i].effort3);
        actuallyEffort.push(budgetOrHistDataList[i].effort4);
        actuallyEffort.push(budgetOrHistDataList[i].effort5);
        actuallyEffort.push(budgetOrHistDataList[i].effort6);
        actuallyEffort.push(budgetOrHistDataList[i].effort7);
        actuallyEffort.push(budgetOrHistDataList[i].effort8);
        actuallyEffort.push(budgetOrHistDataList[i].effort9);
        actuallyEffort.push(budgetOrHistDataList[i].effort10);
        actuallyEffort.push(budgetOrHistDataList[i].effort11);
        actuallyEffort.push(budgetOrHistDataList[i].effort12);
      }
      if(i===2){
        // 五年営業データ:今年のデータ
        thisYear.push(budgetOrHistDataList[i].month1.toFixed(0));
        thisYear.push(budgetOrHistDataList[i].month2.toFixed(0));
        thisYear.push(budgetOrHistDataList[i].month3.toFixed(0));
        thisYear.push(budgetOrHistDataList[i].month4.toFixed(0));
        thisYear.push(budgetOrHistDataList[i].month5.toFixed(0));
        thisYear.push(budgetOrHistDataList[i].month6.toFixed(0));
        thisYear.push(budgetOrHistDataList[i].month7.toFixed(0));
        thisYear.push(budgetOrHistDataList[i].month8.toFixed(0));
        thisYear.push(budgetOrHistDataList[i].month9.toFixed(0));
        thisYear.push(budgetOrHistDataList[i].month10.toFixed(0));
        thisYear.push(budgetOrHistDataList[i].month11.toFixed(0));
        thisYear.push(budgetOrHistDataList[i].month12.toFixed(0));
      }
      if(i===3){
        // 五年営業データ:去年のデータ
        lastYear.push(budgetOrHistDataList[i].month1.toFixed(0));
        lastYear.push(budgetOrHistDataList[i].month2.toFixed(0));
        lastYear.push(budgetOrHistDataList[i].month3.toFixed(0));
        lastYear.push(budgetOrHistDataList[i].month4.toFixed(0));
        lastYear.push(budgetOrHistDataList[i].month5.toFixed(0));
        lastYear.push(budgetOrHistDataList[i].month6.toFixed(0));
        lastYear.push(budgetOrHistDataList[i].month7.toFixed(0));
        lastYear.push(budgetOrHistDataList[i].month8.toFixed(0));
        lastYear.push(budgetOrHistDataList[i].month9.toFixed(0));
        lastYear.push(budgetOrHistDataList[i].month10.toFixed(0));
        lastYear.push(budgetOrHistDataList[i].month11.toFixed(0));
        lastYear.push(budgetOrHistDataList[i].month12.toFixed(0));
      }
      if(i===4){
        // 五年営業データ:一昨年のデータ
        beforeLastYear.push(budgetOrHistDataList[i].month1.toFixed(0));
        beforeLastYear.push(budgetOrHistDataList[i].month2.toFixed(0));
        beforeLastYear.push(budgetOrHistDataList[i].month3.toFixed(0));
        beforeLastYear.push(budgetOrHistDataList[i].month4.toFixed(0));
        beforeLastYear.push(budgetOrHistDataList[i].month5.toFixed(0));
        beforeLastYear.push(budgetOrHistDataList[i].month6.toFixed(0));
        beforeLastYear.push(budgetOrHistDataList[i].month7.toFixed(0));
        beforeLastYear.push(budgetOrHistDataList[i].month8.toFixed(0));
        beforeLastYear.push(budgetOrHistDataList[i].month9.toFixed(0));
        beforeLastYear.push(budgetOrHistDataList[i].month10.toFixed(0));
        beforeLastYear.push(budgetOrHistDataList[i].month11.toFixed(0));
        beforeLastYear.push(budgetOrHistDataList[i].month12.toFixed(0));
      }
      if(i===5){
        // 五年営業データ:一昨昨年のデータ
        fourYear.push(budgetOrHistDataList[i].month1.toFixed(0));
        fourYear.push(budgetOrHistDataList[i].month2.toFixed(0));
        fourYear.push(budgetOrHistDataList[i].month3.toFixed(0));
        fourYear.push(budgetOrHistDataList[i].month4.toFixed(0));
        fourYear.push(budgetOrHistDataList[i].month5.toFixed(0));
        fourYear.push(budgetOrHistDataList[i].month6.toFixed(0));
        fourYear.push(budgetOrHistDataList[i].month7.toFixed(0));
        fourYear.push(budgetOrHistDataList[i].month8.toFixed(0));
        fourYear.push(budgetOrHistDataList[i].month9.toFixed(0));
        fourYear.push(budgetOrHistDataList[i].month10.toFixed(0));
        fourYear.push(budgetOrHistDataList[i].month11.toFixed(0));
        fourYear.push(budgetOrHistDataList[i].month12.toFixed(0));
      }
      if(i===6){
        // 五年営業データ:四年前のデータ
        fiveYear.push(budgetOrHistDataList[i].month1.toFixed(0));
        fiveYear.push(budgetOrHistDataList[i].month2.toFixed(0));
        fiveYear.push(budgetOrHistDataList[i].month3.toFixed(0));
        fiveYear.push(budgetOrHistDataList[i].month4.toFixed(0));
        fiveYear.push(budgetOrHistDataList[i].month5.toFixed(0));
        fiveYear.push(budgetOrHistDataList[i].month6.toFixed(0));
        fiveYear.push(budgetOrHistDataList[i].month7.toFixed(0));
        fiveYear.push(budgetOrHistDataList[i].month8.toFixed(0));
        fiveYear.push(budgetOrHistDataList[i].month9.toFixed(0));
        fiveYear.push(budgetOrHistDataList[i].month10.toFixed(0));
        fiveYear.push(budgetOrHistDataList[i].month11.toFixed(0));
        fiveYear.push(budgetOrHistDataList[i].month12.toFixed(0));
      }
    }

   let maxY;
   let maxSales;
   // Home Page_月営業データ:予算の最大値
    maxY= Math.max(...budgetData);
    // Home Page_月営業データ:販売の最大値
    maxSales=Math.max(...salesData);
    // 予算と販売の中で最大値を取る。
    if(maxY < maxSales){
      maxY = maxSales;
    }

    let maxEffortBud;
    let maxEffortAct;
    maxEffortAct= Math.max(...budgetEffort);
    maxEffortBud=Math.max(...actuallyEffort);
    if(maxEffortAct < maxEffortBud){
      maxEffortAct = maxEffortBud;
    }

    const budgetDataLine:any[]=[];
    const salesDataLine:any[]=[];

    const thisYearLine:any[]=[];
    const lastYearLine:any[]=[];
    const beforeLastYearLine:any[]=[];
    const fourYearLine:any[]=[];
    const fiveYearLine:any[]=[];

    // @ts-ignore
    // eslint-disable-next-line no-plusplus
    for (let i=0;i < budgetOrHistDataList.length;i++) {
      if(i===0){
        // 同じ線図のデータを取ります。
        budgetDataLine.push(0);
        budgetDataLine.push((0+budgetOrHistDataList[i].month1).toFixed(0));
        budgetDataLine.push((budgetOrHistDataList[i].month1+budgetOrHistDataList[i].month2).toFixed(0));
        budgetDataLine.push((budgetOrHistDataList[i].month1+budgetOrHistDataList[i].month2+budgetOrHistDataList[i].month3).toFixed(0));
        budgetDataLine.push((budgetOrHistDataList[i].month1+budgetOrHistDataList[i].month2+budgetOrHistDataList[i].month3+budgetOrHistDataList[i].month4).toFixed(0));
        budgetDataLine.push((budgetOrHistDataList[i].month1+budgetOrHistDataList[i].month2+budgetOrHistDataList[i].month3+budgetOrHistDataList[i].month4+budgetOrHistDataList[i].month5).toFixed(0));
        budgetDataLine.push((budgetOrHistDataList[i].month1+budgetOrHistDataList[i].month2+budgetOrHistDataList[i].month3+budgetOrHistDataList[i].month4+budgetOrHistDataList[i].month5+budgetOrHistDataList[i].month6).toFixed(0));
        budgetDataLine.push((budgetOrHistDataList[i].month1+budgetOrHistDataList[i].month2+budgetOrHistDataList[i].month3+budgetOrHistDataList[i].month4+budgetOrHistDataList[i].month5+budgetOrHistDataList[i].month6+budgetOrHistDataList[i].month7).toFixed(0));
        budgetDataLine.push((budgetOrHistDataList[i].month1+budgetOrHistDataList[i].month2+budgetOrHistDataList[i].month3+budgetOrHistDataList[i].month4+budgetOrHistDataList[i].month5+budgetOrHistDataList[i].month6+budgetOrHistDataList[i].month7+budgetOrHistDataList[i].month8).toFixed(0));
        budgetDataLine.push((budgetOrHistDataList[i].month1+budgetOrHistDataList[i].month2+budgetOrHistDataList[i].month3+budgetOrHistDataList[i].month4+budgetOrHistDataList[i].month5+budgetOrHistDataList[i].month6+budgetOrHistDataList[i].month7+budgetOrHistDataList[i].month8+budgetOrHistDataList[i].month9).toFixed(0));
        budgetDataLine.push((budgetOrHistDataList[i].month1+budgetOrHistDataList[i].month2+budgetOrHistDataList[i].month3+budgetOrHistDataList[i].month4+budgetOrHistDataList[i].month5+budgetOrHistDataList[i].month6+budgetOrHistDataList[i].month7+budgetOrHistDataList[i].month8+budgetOrHistDataList[i].month9+budgetOrHistDataList[i].month10).toFixed(0));
        budgetDataLine.push((budgetOrHistDataList[i].month1+budgetOrHistDataList[i].month2+budgetOrHistDataList[i].month3+budgetOrHistDataList[i].month4+budgetOrHistDataList[i].month5+budgetOrHistDataList[i].month6+budgetOrHistDataList[i].month7+budgetOrHistDataList[i].month8+budgetOrHistDataList[i].month9+budgetOrHistDataList[i].month10+budgetOrHistDataList[i].month11).toFixed(0));
        budgetDataLine.push((budgetOrHistDataList[i].month1+budgetOrHistDataList[i].month2+budgetOrHistDataList[i].month3+budgetOrHistDataList[i].month4+budgetOrHistDataList[i].month5+budgetOrHistDataList[i].month6+budgetOrHistDataList[i].month7+budgetOrHistDataList[i].month8+budgetOrHistDataList[i].month9+budgetOrHistDataList[i].month10+budgetOrHistDataList[i].month11+budgetOrHistDataList[i].month12).toFixed(0));
      }
      if(i===1){
        salesDataLine.push(0);
        salesDataLine.push((0+budgetOrHistDataList[i].month1).toFixed(0));
        salesDataLine.push((budgetOrHistDataList[i].month1+budgetOrHistDataList[i].month2).toFixed(0));
        salesDataLine.push((budgetOrHistDataList[i].month1+budgetOrHistDataList[i].month2+budgetOrHistDataList[i].month3).toFixed(0));
        salesDataLine.push((budgetOrHistDataList[i].month1+budgetOrHistDataList[i].month2+budgetOrHistDataList[i].month3+budgetOrHistDataList[i].month4).toFixed(0));
        salesDataLine.push((budgetOrHistDataList[i].month1+budgetOrHistDataList[i].month2+budgetOrHistDataList[i].month3+budgetOrHistDataList[i].month4+budgetOrHistDataList[i].month5).toFixed(0));
        salesDataLine.push((budgetOrHistDataList[i].month1+budgetOrHistDataList[i].month2+budgetOrHistDataList[i].month3+budgetOrHistDataList[i].month4+budgetOrHistDataList[i].month5+budgetOrHistDataList[i].month6).toFixed(0));
        salesDataLine.push((budgetOrHistDataList[i].month1+budgetOrHistDataList[i].month2+budgetOrHistDataList[i].month3+budgetOrHistDataList[i].month4+budgetOrHistDataList[i].month5+budgetOrHistDataList[i].month6+budgetOrHistDataList[i].month7).toFixed(0));
        salesDataLine.push((budgetOrHistDataList[i].month1+budgetOrHistDataList[i].month2+budgetOrHistDataList[i].month3+budgetOrHistDataList[i].month4+budgetOrHistDataList[i].month5+budgetOrHistDataList[i].month6+budgetOrHistDataList[i].month7+budgetOrHistDataList[i].month8).toFixed(0));
        salesDataLine.push((budgetOrHistDataList[i].month1+budgetOrHistDataList[i].month2+budgetOrHistDataList[i].month3+budgetOrHistDataList[i].month4+budgetOrHistDataList[i].month5+budgetOrHistDataList[i].month6+budgetOrHistDataList[i].month7+budgetOrHistDataList[i].month8+budgetOrHistDataList[i].month9).toFixed(0));
        salesDataLine.push((budgetOrHistDataList[i].month1+budgetOrHistDataList[i].month2+budgetOrHistDataList[i].month3+budgetOrHistDataList[i].month4+budgetOrHistDataList[i].month5+budgetOrHistDataList[i].month6+budgetOrHistDataList[i].month7+budgetOrHistDataList[i].month8+budgetOrHistDataList[i].month9+budgetOrHistDataList[i].month10).toFixed(0));
        salesDataLine.push((budgetOrHistDataList[i].month1+budgetOrHistDataList[i].month2+budgetOrHistDataList[i].month3+budgetOrHistDataList[i].month4+budgetOrHistDataList[i].month5+budgetOrHistDataList[i].month6+budgetOrHistDataList[i].month7+budgetOrHistDataList[i].month8+budgetOrHistDataList[i].month9+budgetOrHistDataList[i].month10+budgetOrHistDataList[i].month11).toFixed(0));
        salesDataLine.push((budgetOrHistDataList[i].month1+budgetOrHistDataList[i].month2+budgetOrHistDataList[i].month3+budgetOrHistDataList[i].month4+budgetOrHistDataList[i].month5+budgetOrHistDataList[i].month6+budgetOrHistDataList[i].month7+budgetOrHistDataList[i].month8+budgetOrHistDataList[i].month9+budgetOrHistDataList[i].month10+budgetOrHistDataList[i].month11+budgetOrHistDataList[i].month12).toFixed(0));
      }
      if(i===2){
        thisYearLine.push(0);
        thisYearLine.push((0+budgetOrHistDataList[i].month1).toFixed(0));
        thisYearLine.push((budgetOrHistDataList[i].month1+budgetOrHistDataList[i].month2).toFixed(0));
        thisYearLine.push((budgetOrHistDataList[i].month1+budgetOrHistDataList[i].month2+budgetOrHistDataList[i].month3).toFixed(0));
        thisYearLine.push((budgetOrHistDataList[i].month1+budgetOrHistDataList[i].month2+budgetOrHistDataList[i].month3+budgetOrHistDataList[i].month4).toFixed(0));
        thisYearLine.push((budgetOrHistDataList[i].month1+budgetOrHistDataList[i].month2+budgetOrHistDataList[i].month3+budgetOrHistDataList[i].month4+budgetOrHistDataList[i].month5).toFixed(0));
        thisYearLine.push((budgetOrHistDataList[i].month1+budgetOrHistDataList[i].month2+budgetOrHistDataList[i].month3+budgetOrHistDataList[i].month4+budgetOrHistDataList[i].month5+budgetOrHistDataList[i].month6).toFixed(0));
        thisYearLine.push((budgetOrHistDataList[i].month1+budgetOrHistDataList[i].month2+budgetOrHistDataList[i].month3+budgetOrHistDataList[i].month4+budgetOrHistDataList[i].month5+budgetOrHistDataList[i].month6+budgetOrHistDataList[i].month7).toFixed(0));
        thisYearLine.push((budgetOrHistDataList[i].month1+budgetOrHistDataList[i].month2+budgetOrHistDataList[i].month3+budgetOrHistDataList[i].month4+budgetOrHistDataList[i].month5+budgetOrHistDataList[i].month6+budgetOrHistDataList[i].month7+budgetOrHistDataList[i].month8).toFixed(0));
        thisYearLine.push((budgetOrHistDataList[i].month1+budgetOrHistDataList[i].month2+budgetOrHistDataList[i].month3+budgetOrHistDataList[i].month4+budgetOrHistDataList[i].month5+budgetOrHistDataList[i].month6+budgetOrHistDataList[i].month7+budgetOrHistDataList[i].month8+budgetOrHistDataList[i].month9).toFixed(0));
        thisYearLine.push((budgetOrHistDataList[i].month1+budgetOrHistDataList[i].month2+budgetOrHistDataList[i].month3+budgetOrHistDataList[i].month4+budgetOrHistDataList[i].month5+budgetOrHistDataList[i].month6+budgetOrHistDataList[i].month7+budgetOrHistDataList[i].month8+budgetOrHistDataList[i].month9+budgetOrHistDataList[i].month10).toFixed(0));
        thisYearLine.push((budgetOrHistDataList[i].month1+budgetOrHistDataList[i].month2+budgetOrHistDataList[i].month3+budgetOrHistDataList[i].month4+budgetOrHistDataList[i].month5+budgetOrHistDataList[i].month6+budgetOrHistDataList[i].month7+budgetOrHistDataList[i].month8+budgetOrHistDataList[i].month9+budgetOrHistDataList[i].month10+budgetOrHistDataList[i].month11).toFixed(0));
        thisYearLine.push((budgetOrHistDataList[i].month1+budgetOrHistDataList[i].month2+budgetOrHistDataList[i].month3+budgetOrHistDataList[i].month4+budgetOrHistDataList[i].month5+budgetOrHistDataList[i].month6+budgetOrHistDataList[i].month7+budgetOrHistDataList[i].month8+budgetOrHistDataList[i].month9+budgetOrHistDataList[i].month10+budgetOrHistDataList[i].month11+budgetOrHistDataList[i].month12).toFixed(0));
      }
      if(i===3){
        lastYearLine.push(0);
        lastYearLine.push((0+budgetOrHistDataList[i].month1).toFixed(0));
        lastYearLine.push((budgetOrHistDataList[i].month1+budgetOrHistDataList[i].month2).toFixed(0));
        lastYearLine.push((budgetOrHistDataList[i].month1+budgetOrHistDataList[i].month2+budgetOrHistDataList[i].month3).toFixed(0));
        lastYearLine.push((budgetOrHistDataList[i].month1+budgetOrHistDataList[i].month2+budgetOrHistDataList[i].month3+budgetOrHistDataList[i].month4).toFixed(0));
        lastYearLine.push((budgetOrHistDataList[i].month1+budgetOrHistDataList[i].month2+budgetOrHistDataList[i].month3+budgetOrHistDataList[i].month4+budgetOrHistDataList[i].month5).toFixed(0));
        lastYearLine.push((budgetOrHistDataList[i].month1+budgetOrHistDataList[i].month2+budgetOrHistDataList[i].month3+budgetOrHistDataList[i].month4+budgetOrHistDataList[i].month5+budgetOrHistDataList[i].month6).toFixed(0));
        lastYearLine.push((budgetOrHistDataList[i].month1+budgetOrHistDataList[i].month2+budgetOrHistDataList[i].month3+budgetOrHistDataList[i].month4+budgetOrHistDataList[i].month5+budgetOrHistDataList[i].month6+budgetOrHistDataList[i].month7).toFixed(0));
        lastYearLine.push((budgetOrHistDataList[i].month1+budgetOrHistDataList[i].month2+budgetOrHistDataList[i].month3+budgetOrHistDataList[i].month4+budgetOrHistDataList[i].month5+budgetOrHistDataList[i].month6+budgetOrHistDataList[i].month7+budgetOrHistDataList[i].month8).toFixed(0));
        lastYearLine.push((budgetOrHistDataList[i].month1+budgetOrHistDataList[i].month2+budgetOrHistDataList[i].month3+budgetOrHistDataList[i].month4+budgetOrHistDataList[i].month5+budgetOrHistDataList[i].month6+budgetOrHistDataList[i].month7+budgetOrHistDataList[i].month8+budgetOrHistDataList[i].month9).toFixed(0));
        lastYearLine.push((budgetOrHistDataList[i].month1+budgetOrHistDataList[i].month2+budgetOrHistDataList[i].month3+budgetOrHistDataList[i].month4+budgetOrHistDataList[i].month5+budgetOrHistDataList[i].month6+budgetOrHistDataList[i].month7+budgetOrHistDataList[i].month8+budgetOrHistDataList[i].month9+budgetOrHistDataList[i].month10).toFixed(0));
        lastYearLine.push((budgetOrHistDataList[i].month1+budgetOrHistDataList[i].month2+budgetOrHistDataList[i].month3+budgetOrHistDataList[i].month4+budgetOrHistDataList[i].month5+budgetOrHistDataList[i].month6+budgetOrHistDataList[i].month7+budgetOrHistDataList[i].month8+budgetOrHistDataList[i].month9+budgetOrHistDataList[i].month10+budgetOrHistDataList[i].month11).toFixed(0));
        lastYearLine.push((budgetOrHistDataList[i].month1+budgetOrHistDataList[i].month2+budgetOrHistDataList[i].month3+budgetOrHistDataList[i].month4+budgetOrHistDataList[i].month5+budgetOrHistDataList[i].month6+budgetOrHistDataList[i].month7+budgetOrHistDataList[i].month8+budgetOrHistDataList[i].month9+budgetOrHistDataList[i].month10+budgetOrHistDataList[i].month11+budgetOrHistDataList[i].month12).toFixed(0));
      }
      if(i===4){
        beforeLastYearLine.push(0);
        beforeLastYearLine.push((0+budgetOrHistDataList[i].month1).toFixed(0));
        beforeLastYearLine.push((budgetOrHistDataList[i].month1+budgetOrHistDataList[i].month2).toFixed(0));
        beforeLastYearLine.push((budgetOrHistDataList[i].month1+budgetOrHistDataList[i].month2+budgetOrHistDataList[i].month3).toFixed(0));
        beforeLastYearLine.push((budgetOrHistDataList[i].month1+budgetOrHistDataList[i].month2+budgetOrHistDataList[i].month3+budgetOrHistDataList[i].month4).toFixed(0));
        beforeLastYearLine.push((budgetOrHistDataList[i].month1+budgetOrHistDataList[i].month2+budgetOrHistDataList[i].month3+budgetOrHistDataList[i].month4+budgetOrHistDataList[i].month5).toFixed(0));
        beforeLastYearLine.push((budgetOrHistDataList[i].month1+budgetOrHistDataList[i].month2+budgetOrHistDataList[i].month3+budgetOrHistDataList[i].month4+budgetOrHistDataList[i].month5+budgetOrHistDataList[i].month6).toFixed(0));
        beforeLastYearLine.push((budgetOrHistDataList[i].month1+budgetOrHistDataList[i].month2+budgetOrHistDataList[i].month3+budgetOrHistDataList[i].month4+budgetOrHistDataList[i].month5+budgetOrHistDataList[i].month6+budgetOrHistDataList[i].month7).toFixed(0));
        beforeLastYearLine.push((budgetOrHistDataList[i].month1+budgetOrHistDataList[i].month2+budgetOrHistDataList[i].month3+budgetOrHistDataList[i].month4+budgetOrHistDataList[i].month5+budgetOrHistDataList[i].month6+budgetOrHistDataList[i].month7+budgetOrHistDataList[i].month8).toFixed(0));
        beforeLastYearLine.push((budgetOrHistDataList[i].month1+budgetOrHistDataList[i].month2+budgetOrHistDataList[i].month3+budgetOrHistDataList[i].month4+budgetOrHistDataList[i].month5+budgetOrHistDataList[i].month6+budgetOrHistDataList[i].month7+budgetOrHistDataList[i].month8+budgetOrHistDataList[i].month9).toFixed(0));
        beforeLastYearLine.push((budgetOrHistDataList[i].month1+budgetOrHistDataList[i].month2+budgetOrHistDataList[i].month3+budgetOrHistDataList[i].month4+budgetOrHistDataList[i].month5+budgetOrHistDataList[i].month6+budgetOrHistDataList[i].month7+budgetOrHistDataList[i].month8+budgetOrHistDataList[i].month9+budgetOrHistDataList[i].month10).toFixed(0));
        beforeLastYearLine.push((budgetOrHistDataList[i].month1+budgetOrHistDataList[i].month2+budgetOrHistDataList[i].month3+budgetOrHistDataList[i].month4+budgetOrHistDataList[i].month5+budgetOrHistDataList[i].month6+budgetOrHistDataList[i].month7+budgetOrHistDataList[i].month8+budgetOrHistDataList[i].month9+budgetOrHistDataList[i].month10+budgetOrHistDataList[i].month11).toFixed(0));
        beforeLastYearLine.push((budgetOrHistDataList[i].month1+budgetOrHistDataList[i].month2+budgetOrHistDataList[i].month3+budgetOrHistDataList[i].month4+budgetOrHistDataList[i].month5+budgetOrHistDataList[i].month6+budgetOrHistDataList[i].month7+budgetOrHistDataList[i].month8+budgetOrHistDataList[i].month9+budgetOrHistDataList[i].month10+budgetOrHistDataList[i].month11+budgetOrHistDataList[i].month12).toFixed(0));
      }
      if(i===5){
        fourYearLine.push(0);
        fourYearLine.push((0+budgetOrHistDataList[i].month1).toFixed(0));
        fourYearLine.push((budgetOrHistDataList[i].month1+budgetOrHistDataList[i].month2).toFixed(0));
        fourYearLine.push((budgetOrHistDataList[i].month1+budgetOrHistDataList[i].month2+budgetOrHistDataList[i].month3).toFixed(0));
        fourYearLine.push((budgetOrHistDataList[i].month1+budgetOrHistDataList[i].month2+budgetOrHistDataList[i].month3+budgetOrHistDataList[i].month4).toFixed(0));
        fourYearLine.push((budgetOrHistDataList[i].month1+budgetOrHistDataList[i].month2+budgetOrHistDataList[i].month3+budgetOrHistDataList[i].month4+budgetOrHistDataList[i].month5).toFixed(0));
        fourYearLine.push((budgetOrHistDataList[i].month1+budgetOrHistDataList[i].month2+budgetOrHistDataList[i].month3+budgetOrHistDataList[i].month4+budgetOrHistDataList[i].month5+budgetOrHistDataList[i].month6).toFixed(0));
        fourYearLine.push((budgetOrHistDataList[i].month1+budgetOrHistDataList[i].month2+budgetOrHistDataList[i].month3+budgetOrHistDataList[i].month4+budgetOrHistDataList[i].month5+budgetOrHistDataList[i].month6+budgetOrHistDataList[i].month7).toFixed(0));
        fourYearLine.push((budgetOrHistDataList[i].month1+budgetOrHistDataList[i].month2+budgetOrHistDataList[i].month3+budgetOrHistDataList[i].month4+budgetOrHistDataList[i].month5+budgetOrHistDataList[i].month6+budgetOrHistDataList[i].month7+budgetOrHistDataList[i].month8).toFixed(0));
        fourYearLine.push((budgetOrHistDataList[i].month1+budgetOrHistDataList[i].month2+budgetOrHistDataList[i].month3+budgetOrHistDataList[i].month4+budgetOrHistDataList[i].month5+budgetOrHistDataList[i].month6+budgetOrHistDataList[i].month7+budgetOrHistDataList[i].month8+budgetOrHistDataList[i].month9).toFixed(0));
        fourYearLine.push((budgetOrHistDataList[i].month1+budgetOrHistDataList[i].month2+budgetOrHistDataList[i].month3+budgetOrHistDataList[i].month4+budgetOrHistDataList[i].month5+budgetOrHistDataList[i].month6+budgetOrHistDataList[i].month7+budgetOrHistDataList[i].month8+budgetOrHistDataList[i].month9+budgetOrHistDataList[i].month10).toFixed(0));
        fourYearLine.push((budgetOrHistDataList[i].month1+budgetOrHistDataList[i].month2+budgetOrHistDataList[i].month3+budgetOrHistDataList[i].month4+budgetOrHistDataList[i].month5+budgetOrHistDataList[i].month6+budgetOrHistDataList[i].month7+budgetOrHistDataList[i].month8+budgetOrHistDataList[i].month9+budgetOrHistDataList[i].month10+budgetOrHistDataList[i].month11).toFixed(0));
        fourYearLine.push((budgetOrHistDataList[i].month1+budgetOrHistDataList[i].month2+budgetOrHistDataList[i].month3+budgetOrHistDataList[i].month4+budgetOrHistDataList[i].month5+budgetOrHistDataList[i].month6+budgetOrHistDataList[i].month7+budgetOrHistDataList[i].month8+budgetOrHistDataList[i].month9+budgetOrHistDataList[i].month10+budgetOrHistDataList[i].month11+budgetOrHistDataList[i].month12).toFixed(0));
      }
      if(i===6){
        fiveYearLine.push(0);
        fiveYearLine.push((0+budgetOrHistDataList[i].month1).toFixed(0));
        fiveYearLine.push((budgetOrHistDataList[i].month1+budgetOrHistDataList[i].month2).toFixed(0));
        fiveYearLine.push((budgetOrHistDataList[i].month1+budgetOrHistDataList[i].month2+budgetOrHistDataList[i].month3).toFixed(0));
        fiveYearLine.push((budgetOrHistDataList[i].month1+budgetOrHistDataList[i].month2+budgetOrHistDataList[i].month3+budgetOrHistDataList[i].month4).toFixed(0));
        fiveYearLine.push((budgetOrHistDataList[i].month1+budgetOrHistDataList[i].month2+budgetOrHistDataList[i].month3+budgetOrHistDataList[i].month4+budgetOrHistDataList[i].month5).toFixed(0));
        fiveYearLine.push((budgetOrHistDataList[i].month1+budgetOrHistDataList[i].month2+budgetOrHistDataList[i].month3+budgetOrHistDataList[i].month4+budgetOrHistDataList[i].month5+budgetOrHistDataList[i].month6).toFixed(0));
        fiveYearLine.push((budgetOrHistDataList[i].month1+budgetOrHistDataList[i].month2+budgetOrHistDataList[i].month3+budgetOrHistDataList[i].month4+budgetOrHistDataList[i].month5+budgetOrHistDataList[i].month6+budgetOrHistDataList[i].month7).toFixed(0));
        fiveYearLine.push((budgetOrHistDataList[i].month1+budgetOrHistDataList[i].month2+budgetOrHistDataList[i].month3+budgetOrHistDataList[i].month4+budgetOrHistDataList[i].month5+budgetOrHistDataList[i].month6+budgetOrHistDataList[i].month7+budgetOrHistDataList[i].month8).toFixed(0));
        fiveYearLine.push((budgetOrHistDataList[i].month1+budgetOrHistDataList[i].month2+budgetOrHistDataList[i].month3+budgetOrHistDataList[i].month4+budgetOrHistDataList[i].month5+budgetOrHistDataList[i].month6+budgetOrHistDataList[i].month7+budgetOrHistDataList[i].month8+budgetOrHistDataList[i].month9).toFixed(0));
        fiveYearLine.push((budgetOrHistDataList[i].month1+budgetOrHistDataList[i].month2+budgetOrHistDataList[i].month3+budgetOrHistDataList[i].month4+budgetOrHistDataList[i].month5+budgetOrHistDataList[i].month6+budgetOrHistDataList[i].month7+budgetOrHistDataList[i].month8+budgetOrHistDataList[i].month9+budgetOrHistDataList[i].month10).toFixed(0));
        fiveYearLine.push((budgetOrHistDataList[i].month1+budgetOrHistDataList[i].month2+budgetOrHistDataList[i].month3+budgetOrHistDataList[i].month4+budgetOrHistDataList[i].month5+budgetOrHistDataList[i].month6+budgetOrHistDataList[i].month7+budgetOrHistDataList[i].month8+budgetOrHistDataList[i].month9+budgetOrHistDataList[i].month10+budgetOrHistDataList[i].month11).toFixed(0));
        fiveYearLine.push((budgetOrHistDataList[i].month1+budgetOrHistDataList[i].month2+budgetOrHistDataList[i].month3+budgetOrHistDataList[i].month4+budgetOrHistDataList[i].month5+budgetOrHistDataList[i].month6+budgetOrHistDataList[i].month7+budgetOrHistDataList[i].month8+budgetOrHistDataList[i].month9+budgetOrHistDataList[i].month10+budgetOrHistDataList[i].month11+budgetOrHistDataList[i].month12).toFixed(0));
      }
     
    }

    let displayChart;

    // Home Page_月営業データ
    // @ts-ignore
    if(this.state.budgetOrhistorical) {
      // Home Page_月営業データ:ヒストグラム
      // @ts-ignore
      if (this.state.typIndex === 0) {
        displayChart = (
          <ReactEcharts style={{top: 10, width: '102%', height: '300%'}} option={this.getOption(legendData,budgetData,salesData,budgetEffort,actuallyEffort,maxY*2)}/>
        )
      } else {
        // Home Page_月営業データ:線図
        // @ts-ignore
        // eslint-disable-next-line no-lonely-if
        if (this.state.typIndex === 1) {
          displayChart = (
            <MonthlyPerformanceLine legendData={legendData} budgetData={budgetDataLine} salesData={salesDataLine} title=''/>
          )
        }
      }
    }

    // 五年営業データ
    // @ts-ignore
    const {budgetOrhistorical,year} = this.state;
    if(!this.state.budgetOrhistorical) {
      // 五年営業データ:ヒストグラム
      // @ts-ignore
        if (this.state.typIndex===0) {
          displayChart = (
            <HistoricalComparison legendData={legendDataHist} thisYear={thisYear}  lastYear={lastYear} beforeLastYear={beforeLastYear} fourYear={fourYear} fiveYear={fiveYear} year={year} title=''/>
          )
        } else {
          // 五年営業データ:線図
          // @ts-ignore
          // eslint-disable-next-line no-lonely-if
          if (this.state.typIndex===1) {
            displayChart = (
              <HistoricalComparisonLine legendData={legendDataHist} thisYear={thisYearLine} lastYear={lastYearLine} beforeLastYear={beforeLastYearLine} fourYear={fourYearLine} fiveYear={fiveYearLine} year={year} title=''/>
            )
          }
      }
    }
    return (
      <div>
        {displayChart}
        <img src={columnarAtlas} alt="" style={{position: 'absolute', left: '90%', bottom: '80%', fontSize: '20px', color: '#003D82',cursor:"pointer" }} onClick={this.barChange}/>
        <img src={leiji} alt="" style={{position: 'absolute', left: '95%', bottom: '80%', fontSize: '20px', color: '#003D82',cursor:"pointer" }} onClick={this.chartChange} />

        <div className='text-top'>
          <Row>
            <Radio.Group defaultValue="a" buttonStyle="solid" onChange={(e) => this.handleRadioChange(e.target.value)}>
              <Radio.Button value="1">{formatMessage({ id: 'homepage.basic.Budget' })}</Radio.Button>
              <Radio.Button value="2">{formatMessage({ id: 'homepage.basic.twoYearComparison' })}</Radio.Button>
              <Radio.Button value="3">{formatMessage({ id: 'homepage.basic.threeYearComparison' })}</Radio.Button>
              <Radio.Button value="4">{formatMessage({ id: 'homepage.basic.fourYearComparison' })}</Radio.Button>
              <Radio.Button value="5">{formatMessage({ id: 'homepage.basic.fiveYearComparison' })}</Radio.Button>
            </Radio.Group>
          </Row>
        </div>
      </div>
    );
  }
}



export default connect(({ homePage}: { homePage:EchartsState }) => ({
    budgetOrHistDataList:homePage.budgetOrHistDataList,
  }))// @ts-ignore
(MonthlyPerformance);

