import React, { Component } from 'react';
import  'echarts/lib/chart/gauge';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import ReactEcharts from 'echarts-for-react'
import industry from "@/assets/industry.png";
import {RankOrder} from "@/pages/HomePage/data";
import {formatMessage} from "@@/plugin-locale/localeExports";
import finance from "@/assets/finance.png";
import securities from "@/assets/securities.png";
import circulation from "@/assets/circulation.png";
import Insurance from "@/assets/Insurance.png";
import medicalcare from "@/assets/medicalcare.png";
import other from "@/assets/other.png";
import publicImg from "@/assets/public.png";
import moneysmall from "@/assets/moneysmall.png";
import percent from "@/assets/percent.png";

export interface RankFiveProps {
  rankFive:RankOrder[];
  value1:[];
  value2:[];
  value3:[];
  value4:[];
  value5:[];
  value6:[];
  value7:[];
}

class RankFive extends Component<RankFiveProps>{

  getOption = (rankAtoD: any,value1:any,value2:any,value3:any,value4:any,value5:any,value6:any,value7:any)=>{


    const dataValue:any[]=[];
    let topValue;
    let topValueSting;
    let belowValue;
    let imgNm;
    let name;
    let title;
    let title1;
    let title2;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars,array-callback-return
      dataValue.push({value:value1},{value:value2},{value:value3},{value:value4},{value:value5},{value:value6},{value:value7});
    // eslint-disable-next-line prefer-const
    imgNm =undefined===rankAtoD?'':`{${rankAtoD.caseIndstyLogoNm}|}`;
    // eslint-disable-next-line prefer-const
      topValue = undefined===rankAtoD?'':rankAtoD.caseIndstyNm;
    // eslint-disable-next-line prefer-const
      belowValue = undefined===rankAtoD?'':`{d|${formatNum(parseFloat(rankAtoD.amount).toFixed(0))} }{d|${parseFloat(rankAtoD.percent).toFixed(0)}%}`;
    // eslint-disable-next-line prefer-const
    topValueSting =undefined===rankAtoD?'': `{b|${topValue}}`;
    // eslint-disable-next-line prefer-const
    name= undefined !== rankAtoD ? rankAtoD.caseIndstyNm : '';
 /*  // eslint-disable-next-line prefer-const
    title1=formatMessage({ id: 'homepage.basic.amount' });
    // eslint-disable-next-line prefer-const
    title2=formatMessage({ id: 'homepage.basic.percent' });

    // eslint-disable-next-line prefer-const
    title= `{c|${title1}}{c|${title2}}` */;

    let commonAmount:any;
    // let commonPercent:any;
    commonAmount=formatMessage({ id: "homepage.basic.amount" });
    // commonPercent =formatMessage({ id: "homepage.basic.percent" });

    let option;
    // eslint-disable-next-line prefer-const
    option = {
      backgroundColor: '#FFFFFF',
      tooltip: {
        trigger: 'item',
        formatter: `{a}<br/>${commonAmount}:{c}  <br/>%:{d}`
      },
      series: [
        {
          name: name,
          animation: false,
          color: [ '#F0F0F0', '#F0F0F0', '#F0F0F0','#F0F0F0','#ffcb6e','#F0F0F0','#F0F0F0'],
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
              }
              ,
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
          } /* ,
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
                '                 {moneysmall|}  {percent|}',
                belowValue
              ].join('\n'),
              rich: {
                b: {
                  lineHeight: 12,
                  fontSize: 15,
                  color: '#000',
                  align: 'center',
                  width: 160
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
                  align: 'right',
                  color: '#666666',
                  width: 80
                },
                d: {
                  lineHeight: 20,
                  verticalAlign: 'bottom',
                  fontSize: '13',
                  align: 'right',
                  color: '#666666',
                  width: 80
                },
              moneysmall: {
                height: 15,
                align: 'bottom',
                backgroundColor: {
                  image: moneysmall
                }
              },
              percent: {
                height: 13,
                align: 'right',
                backgroundColor: {
                  image: percent
                }
              },
              }
            }
          }, */
            ,data: dataValue
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

    render() {
    const {rankFive,value1,value2,value3,value4,value5,value6,value7} = this.props;
    return (
        <ReactEcharts option={this.getOption(rankFive,value1,value2,value3,value4,value5,value6,value7)} style={{ width: '100%', height: '33%'}}/>
    );
  }
}

export default RankFive;
