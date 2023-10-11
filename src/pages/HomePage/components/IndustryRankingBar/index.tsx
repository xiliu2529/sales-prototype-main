import React, { Component } from 'react';
// @ts-ignore
import echarts from 'echarts/lib/echarts';
import  'echarts/lib/chart/bar';
import  'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import ReactEcharts from 'echarts-for-react';
import {IndustryRankingData} from "@/pages/HomePage/data";

export interface IndustryRankingBarProps {
  title: React.ReactNode;
  industryRankingData:IndustryRankingData[];
}

class IndustryRankingBar extends Component<IndustryRankingBarProps>{

  componentDidMount() {
    this.getOption(this.props.industryRankingData)
  }

  componentDidUpdate() {
    // 每次更新组件都重置
    this.getOption(this.props.industryRankingData)
  }

  // Home Pageを描く業種のラック.ヒストグラム
  getOption = (industryRankingData: any)=>{

    const names: any[]=[];
    const values: any[]=[];
    const percents: any[]=[];
    // eslint-disable-next-line array-callback-return
    industryRankingData.map((item:any)=>{
      names.push(item.caseIndstyNm);
      values.push(parseFloat(item.amount).toFixed(0));
      percents.push(parseFloat(item.percent).toFixed(0));
    })

    let option;
    // eslint-disable-next-line prefer-const
      option = {
        backgroundColor: '#FFFFFF',
        grid: {
          top: '15%',
          // bottom: 400,
          left: '5%',
          // right: 450
          width: '50%',
          height: '80%',
          containLabel: true
        },
        xAxis: {show: false},
        yAxis: {
          show: true,
          inverse: true,
          splitLine: {show: false},
          axisLine: {show: false},
          axisTick: {show: false},
          data: names,
          axisLabel: {
            color: '#003D82',
            fontSize: 12,
            fontWeight: 'bold'// ,
            // formatter: function(value) {
            //     if (value.length > 10) {
            //         return value.slice(0,4) + '...';
            //     } else {
            //         return value;
            //     }
            // }
          }
        },
        series: [
          {
            name: 'Sales',
            type: 'bar',
            data: values,
            barWidth: 10,
            label: {
                normal: {
                    show: true,
                    position: 'right',
                    color: '#003D82',
                    // formatter(d: { value: RankingData; }) {
                    //      return formatNum(d.value.amount);
                    // }
                 }
            },
            itemStyle: {
              normal: {
                barBorderRadius: 5,
                color: new echarts.graphic.LinearGradient(
                  0, 0, 0, 1,
                  [
                    {offset: 1, color: '#BBC4EF'},
                    // {offset: 0.2, color: 'rgba(156,107,211,0.5)'},
                    {offset: 0, color: '#62BCFA'}
                  ]
                )
              }
            }
          }
        ]
      };


      // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      const amount = formatNum(series[0].data[params.dataIndex]);
      const percent = percents[params.dataIndex];
      return `${amount} (${ percent}%)`;
    }
    // @ts-ignore
    series[0].label.normal.formatter = fun;

      return option;
  }

  render() {
    const { industryRankingData} = this.props;
    return (
          <ReactEcharts option={this.getOption(industryRankingData)} style={{ width: '100%', height: '100%' }}/>
    );
  }
}

export default IndustryRankingBar;
