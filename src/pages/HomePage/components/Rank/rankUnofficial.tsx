import React, { Component } from 'react';
import  'echarts/lib/chart/gauge';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import ReactEcharts from 'echarts-for-react'
import securities from "@/assets/securities.png";
import {RankOrder} from "@/pages/HomePage/data";
import finance from "@/assets/finance.png";
import industry from "@/assets/industry.png";
import circulation from "@/assets/circulation.png";
import Insurance from "@/assets/Insurance.png";
import medicalcare from "@/assets/medicalcare.png";
import other from "@/assets/other.png";
import publicImg from "@/assets/public.png";
import moneysmall from "@/assets/moneysmall.png";


export interface RankUnofficialProps {
  rankUnofficial:RankOrder[];
  value1:[];
  value2:[];
  value3:[];
  value4:[];
}

class RankUnofficial extends Component<RankUnofficialProps>{

  getOption = (rankUnofficial: any,value1:any,value2:any,value3:any,value4:any)=> {


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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    imgNm =undefined===rankUnofficial?'':`{${rankUnofficial.caseIndstyLogoNm}|}`;
    // eslint-disable-next-line prefer-const
    topValue = undefined===rankUnofficial?'':rankUnofficial.caseIndstyNm;
    // eslint-disable-next-line prefer-const
    belowValue = undefined===rankUnofficial?'':`{d|${formatNum(parseFloat(rankUnofficial.amount).toFixed(0))}}`;

    // eslint-disable-next-line prefer-const
    topValueSting =  undefined===rankUnofficial?'':`{b|${topValue}}{d|${parseFloat(rankUnofficial.percent).toFixed(0)}% }`;

    // // eslint-disable-next-line prefer-const
    // belowValue = undefined===rankUnofficial?'':`{d|${formatNum(parseFloat(rankUnofficial.amount).toFixed(0))} }{d|${parseFloat(rankUnofficial.percent).toFixed(0)}%}`;
    // // eslint-disable-next-line prefer-const
    // topValueSting = undefined===rankUnofficial?'':`{b|${topValue}}`;
    name= undefined !== rankUnofficial ? rankUnofficial.caseIndstyCd : '';
    /*    // eslint-disable-next-line prefer-const
        title1=formatMessage({ id: 'homepage.basic.amount' });
        // eslint-disable-next-line prefer-const
        title2=formatMessage({ id: 'homepage.basic.percent' });

        // eslint-disable-next-line prefer-const
        title= `{c|${title1}}{c|${title2}}`; */

    let option;
    // eslint-disable-next-line prefer-const
    option = {
      backgroundColor: '#FFFFFF',
      series: [
        {
          name: name,
          animation: false,
          color: ['#F0F0F0', '#86EB9F', '#F0F0F0', '#F0F0F0'],
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

  render() {
    const {rankUnofficial,value1,value2,value3,value4} = this.props;
    return (
      <ReactEcharts option={this.getOption(rankUnofficial,value1,value2,value3,value4)} style={{ width: '100%', height: '33%' }}/>
    );
  }
}

export default RankUnofficial;
