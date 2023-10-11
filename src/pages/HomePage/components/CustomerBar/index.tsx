import React, { Component } from 'react';
// @ts-ignore
import echarts from 'echarts/lib/echarts';
import  'echarts/lib/chart/bar';
import  'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import ReactEcharts from 'echarts-for-react';

export interface CustomerBarProps {
  title: React.ReactNode;

}

class CustomerBar extends Component<CustomerBarProps>{

  getOption = (customerBar: any)=>{

    const names: any[]=[];
    const values: any[]=[];
    // eslint-disable-next-line no-plusplus
    for (let i=0;i < customerBar.length;i++) {
      if(i<5){
        if(customerBar[i].name===null || customerBar[i].name ===''){
          names.push('');
        }else{
          names.push(customerBar[i].name);
        }
      values.push(customerBar[i].percent)
      }
    }

    let option;
    // eslint-disable-next-line prefer-const
      option = {
        backgroundColor: '#FFFFFF',
        grid: {
          top: '25%',
          // bottom: 400,
          left: '30%',
          // right: 450
          width: '60%',
          height: '70%'
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
            // label: {
            //     normal: {
            //         show: true,
            //         position: 'right',
            //         color: '#003D82',
            //         formatter: function(d) {
            //             return formatNum(d.value);
            //         }
            //     }
            // },
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
      return option;
  }

  render() {
    // @ts-ignore
    const { customerBar} = this.props;
    return (
          <ReactEcharts option={this.getOption(customerBar)} style={{position: 'relative',top:10, width: '110%', height: '300%' }}/>
    );
  }
}

export default CustomerBar;
