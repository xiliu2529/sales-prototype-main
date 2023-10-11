import {
    Table,
    Space,
    Modal,
  } from 'antd';
  import { connect } from 'umi';
  import React, { Component } from 'react';
  import { formatMessage } from '@@/plugin-locale/localeExports';
  import { ConnectState, UserModelState } from '@/models/connect';
  import { Dispatch } from '@@/plugin-dva/connect';
  import 'moment/locale/zh-cn';
  import {
    ActForMonthSummaryVo,
    ActForMonthSummarySalesVo,
    FetchActForeCaseMonthSummaryType,
  } from '@/pages/FormAdvancedForm/data';
  // eslint-disable-next-line import/no-duplicates
  import styles from './style.less';
  // eslint-disable-next-line import/no-duplicates
  import './style.less';
  import '@/utils/messageConfig';
  import classNames from "classnames";
  import {ActForecastData} from "@/pages/FormAdvancedForm/components/SearchActualityForecast/data";

   

  interface TableFormProps {
    dispatch: Dispatch;
    user: UserModelState;
    cstmrCd?: string;
    cstmrNm?: string;
    endUserCd?: string;
    endUserNm?: string;
    searchLoading: string;
    actForMonthSummaryVo: ActForMonthSummaryVo;
    monthSummaryModelCollapsed:boolean;
    oncust:boolean;
   
  }
  
  interface TableDataStates {
    actForYear: string;
    cntrcCurrCd: string;
    cntrcCurrNm: string;
    cstmrCd?: string;
    cstmrNm?: string;
    endUserCd?: string;
    endUserNm?: string;
    comment: string;
    salesSummaryVoList: ActForMonthSummarySalesVo[];
    totalAmount: string;
    totalEffort: string;
    searchLoading: string;
  
  }
  
  class ActualityForecastMonthSummary extends Component<TableFormProps, TableDataStates> {
    constructor(props) {
      super(props);
      const { oncust } = this.props;
      this.state = {
        searchLoading: "false",
        actForYear: "",
        cntrcCurrCd: "",
        cntrcCurrNm: "",
        totalAmount: "",
        totalEffort: "",
        cstmrCd: "",
        cstmrNm: "",
        endUserCd: "",
        endUserNm: "",
        comment: "",
        oncust: oncust,
        salesSummaryVoList: [{
            actForMothTitle: formatMessage({id: 'searchActualityForecast.month.January'}),
            actForMoth: "01",
            amount: "0",
            effort: "0.00",
        },
        {
            actForMothTitle: formatMessage({id: 'searchActualityForecast.month.February'}),
            actForMoth: "02",
            amount: "0",
            effort: "0.00",
        },
        {
            actForMothTitle: formatMessage({id: 'searchActualityForecast.month.March'}),
            actForMoth: "03",
            amount: "0",
            effort: "0.00",
        },
        {
            actForMothTitle: formatMessage({id: 'searchActualityForecast.month.April'}),
            actForMoth: "04",
            amount: "0",
            effort: "0.00",
        },
        {
            actForMothTitle: formatMessage({id: 'searchActualityForecast.month.May'}),
            actForMoth: "05",
            amount: "0",
            effort: "0.00",
        },
        {
            actForMothTitle: formatMessage({id: 'searchActualityForecast.month.June'}),
            actForMoth: "06",
            amount: "0",
            effort: "0.00",
        },
        {
            actForMothTitle: formatMessage({id: 'searchActualityForecast.month.July'}),
            actForMoth: "07",
            amount: "0",
            effort: "0.00",
        },
        {
            actForMothTitle: formatMessage({id: 'searchActualityForecast.month.August'}),
            actForMoth: "08",
            amount: "0",
            effort: "0.00",
        },
        {
            actForMothTitle: formatMessage({id: 'searchActualityForecast.month.September'}),
            actForMoth: "09",
            amount: "0",
            effort: "0.00",
        },
        {
            actForMothTitle: formatMessage({id: 'searchActualityForecast.month.October'}),
            actForMoth: "10",
            amount: "0",
            effort: "0.00",
        },
        {
            actForMothTitle: formatMessage({id: 'searchActualityForecast.month.November'}),
            actForMoth: "11",
            amount: "0",
            effort: "0.00",
        },
        {
            actForMothTitle: formatMessage({id: 'searchActualityForecast.month.December'}),
            actForMoth: "12",
            amount: "0",
            effort: "0.00",
        }],
      };
    }
    
    
  
    
    
    componentDidMount(){
      // @ts-ignore
      this.setState({
      })
    }
    static formatNum=(strNum: string | number | any[])=> {
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
    static getDerivedStateFromProps(nextProps: TableFormProps, prevState: TableDataStates,) {
      // if (nextProps.monthSummaryModelCollapsed=== true) {
        const { dispatch } = nextProps;
        const actForYear = nextProps.user.currentUser?.dspYear;
        const cntrcCurrCd = nextProps.user.currentUser?.dspCurrCd;
        const cstmrCd = nextProps.cstmrCd;
        const endUserCd= nextProps.endUserCd;
        const oncust = nextProps.oncust;
       

        if (prevState.actForYear!== actForYear || prevState.cstmrCd !== cstmrCd || prevState.endUserCd !== endUserCd || prevState.cntrcCurrCd!== cntrcCurrCd){
          const fetchActForeCaseMonthSummaryType: FetchActForeCaseMonthSummaryType = { actForYear, cntrcCurrCd,cstmrCd ,endUserCd,oncust};
         // const fetchActForeCaseMonthSummary = JSON.stringify(fetchActForeCaseMonthSummaryType);
          dispatch({
            type: 'ActForecastData/fetchActForeCaseMonthSummaryLst',
            payload: {
              fetchActForeCaseMonthSummaryType,
            },
          });
          const temp = prevState.salesSummaryVoList;
          for (var i=0; i<temp.length;i++) {
              let isHas = false;
              if (nextProps.actForMonthSummaryVo!=null && nextProps.actForMonthSummaryVo.salesVos!=null) {
                  for (var j=0;j<nextProps.actForMonthSummaryVo.salesVos.length;j++){
                      if (temp[i].actForMoth===nextProps.actForMonthSummaryVo.salesVos[j].actForMoth) {
                          temp[i].amount = ActualityForecastMonthSummary.formatNum(nextProps.actForMonthSummaryVo.salesVos[j].amount);
                          temp[i].effort = ActualityForecastMonthSummary.formatNum(nextProps.actForMonthSummaryVo.salesVos[j].effort);
                          isHas =true;
                          break;
                      }
                  }
              }
              if (!isHas) {
                  temp[i].amount = "0.00";
                  temp[i].effort = "0";
              }   
          }
          return {
            salesSummaryVoList: temp,
            totalAmount: nextProps.actForMonthSummaryVo!=null && nextProps.actForMonthSummaryVo.totalAmount!==null?ActualityForecastMonthSummary.formatNum(nextProps.actForMonthSummaryVo.totalAmount):"0",
            totalEffort: nextProps.actForMonthSummaryVo!=null && nextProps.actForMonthSummaryVo.totalEffort!==null?ActualityForecastMonthSummary.formatNum(nextProps.actForMonthSummaryVo.totalEffort):"0",
            actForYear: actForYear,
            cntrcCurrCd: cntrcCurrCd,
            cstmrCd: nextProps.cstmrCd,
            cstmrNm: nextProps.cstmrNm,
            endUserCd: nextProps.endUserCd,
            endUserNm: nextProps.endUserNm,
          };
        }
        if (prevState.salesSummaryVoList!== nextProps.actForMonthSummaryVo?.salesVos){
            const temp = prevState.salesSummaryVoList;
            for (var i=0; i<temp.length;i++) {
                let isHas = false;
                if (nextProps.actForMonthSummaryVo!=null && nextProps.actForMonthSummaryVo.salesVos!=null) {
                    for (var j=0;j<nextProps.actForMonthSummaryVo.salesVos.length;j++){
                        if (temp[i].actForMoth===nextProps.actForMonthSummaryVo.salesVos[j].actForMoth) {
                            temp[i].amount = ActualityForecastMonthSummary.formatNum(nextProps.actForMonthSummaryVo.salesVos[j].amount);
                            temp[i].effort = ActualityForecastMonthSummary.formatNum(nextProps.actForMonthSummaryVo.salesVos[j].effort);
                            isHas =true;
                            break;
                        }
                    }
                }
                if (!isHas) {
                    temp[i].amount = "0.00";
                    temp[i].effort = "0";
                }   
            }
            return {
              salesSummaryVoList: temp,
              totalAmount: nextProps.actForMonthSummaryVo!=null && nextProps.actForMonthSummaryVo.totalAmount!==null?ActualityForecastMonthSummary.formatNum(nextProps.actForMonthSummaryVo.totalAmount):"0",
              totalEffort: nextProps.actForMonthSummaryVo!=null && nextProps.actForMonthSummaryVo.totalEffort!==null?ActualityForecastMonthSummary.formatNum(nextProps.actForMonthSummaryVo.totalEffort):"0",
              cntrcCurrNm: nextProps.actForMonthSummaryVo!=null && nextProps.actForMonthSummaryVo.cntrcCurrNm!==null?nextProps.actForMonthSummaryVo.cntrcCurrNm:"",
              comment: nextProps.actForMonthSummaryVo!=null && nextProps.actForMonthSummaryVo.title!==null?nextProps.actForMonthSummaryVo.title:"",
            }
        } 
    }
    changeMonthSummaryModelCollapsedState = (payload: boolean): void => {
        const { dispatch} = this.props;
        if (dispatch) {
          dispatch({
            type: 'searchActForData/changeMonthSummaryModelCollapsed',
            payload
          });
        }
    };
    render() {
      const {homeRankOrderModel,oncust} = this.props
      let homeRankOrderModel1 = null;
      if(homeRankOrderModel){
        homeRankOrderModel1 =  JSON.parse(homeRankOrderModel)
      }
      const BasicInfoColumns = [
        {
          title: '',
          dataIndex: 'title',
          key: 'title',
          width: '90px',
          render: (text: string) => {
            return <div style={{color: '#003D82', textAlign: 'right' }}>{text}&nbsp;</div>;
          },
        },
        {
          title: '',
          dataIndex: 'value',
          key: 'value',
          width: '230px',
          render: (text: string,  record: any, index: number) => {
            if (this.state.endUserCd!=null && this.state.endUserCd!=''){
                return <div style={{color: 'black'}}>{this.state.endUserNm}</div>;
            } else {
                return <div style={{color: 'black'}}>{this.state.cstmrNm}</div>;
            }
          }
        },
      ];
 
  
      const salesInfoColumns = [
        {
          title: '',
          dataIndex: 'title',
          key: 'title',
          width: '80px',
          render: (text: string, record: ActForMonthSummarySalesVo) => {
            return <div style={{color: '#003D82', textAlign: 'left' }}>{record.actForMothTitle}</div>;
          },
        },
        {
          title: formatMessage({ id: 'common.basic.Sales' }) +'('+ this.state.cntrcCurrNm +')',
          dataIndex: 'amount',
          key: 'amount',
          width: '120px',
          render: (text: string, record: ActForMonthSummarySalesVo, index: number) => {
            const effortValue = this.state.salesSummaryVoList[index];
            let orderAmtValue = '0';
            // @ts-ignore
            if(effortValue!==undefined && effortValue!==null) {
              orderAmtValue= effortValue.amount;
            }
            return (
                <div>{orderAmtValue}</div>
            );
          },
        },
        {
          title: formatMessage({ id: 'searchActualityForecast.summary.effort' }) +'(MM)',
          dataIndex: 'effort',
          key: 'effort',
          width: '120px',
          render: (text: string, record: ActForMonthSummarySalesVo, index: number) => {
            const effort = this.state.salesSummaryVoList[index];
            let effortValue = '0.00';
            if(effort!==undefined && effort!==null) {
              effortValue = effort.effort;
            }
            return (
              <div>
                <div>{effortValue}</div>
              </div>
            );
          },
        },

      ];
      
  
      const salesInfoColumnsTotal = [
        {
          title: '',
          dataIndex: 'title',
          key: 'title',
          width: '80px',
          render: (text: string) => {
            return <div style={{color: '#003D82',fontWeight: 'bolder',textAlign: 'left'}}>{text}</div>;
          },
        },
        {
          title: '',
          dataIndex: 'amount',
          key: 'amount',
          width: '120px',
          render: (text: string) => {
            return <div style={{color: 'black',textAlign: 'right'}}>{text}</div>;
          },
        },
        {
          title: '',
          dataIndex: 'effort',
          key: 'effort',
          width: '120px',
          render: (text: string) => {
            return <div style={{color: 'black',textAlign: 'right'}}>{text} </div>;
          },
        },
      ];
  
      const basicInfoData:any[]=[];
      let salesInfoData:any[]=[];
      let salesInfoTotal:any[]=[];
      
      if (this.state.endUserCd !=null && this.state.endUserCd!=''){
        basicInfoData.push({title: formatMessage({id: 'searchActualityForecast.summary.endUser'}),value: this.state.endUserNm});
      }else {  
       if(oncust && homeRankOrderModel1  && homeRankOrderModel1.userCd != null &&  
        homeRankOrderModel1.userCd.length > 0 &&
        homeRankOrderModel1.userCd[0] !== "" ){
         basicInfoData.push({title: formatMessage({id: 'searchActualityForecast.summary.case'}),value: this.state.cstmrNm});
  
        }else{
         basicInfoData.push({title: formatMessage({id: 'searchActualityForecast.summary.customer'}),value: this.state.cstmrNm});
   
        }
      
        }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      salesInfoData = this.state.salesSummaryVoList; 
      console.log("salesInfoData",salesInfoData);
      
      salesInfoTotal.push({title:formatMessage({id: 'app.common.Total'}),amount:this.state.totalAmount,effort:this.state.totalEffort});
      
      
      
      let basicInfoHeight = '130px';
  
      // @ts-ignore
      return (
        <Modal
            visible={this.props.monthSummaryModelCollapsed}
            onCancel={() => this.changeMonthSummaryModelCollapsedState(false)}
            footer={null}
            className={classNames(styles.monthSummaryModel)}
        >
            <div style={{height: {basicInfoHeight}, backgroundColor: 'white'}}>
              <Space size={10}>
                <p style={{
                  marginLeft: 15,
                  fontSize: '18px',
                  fontWeight: 'bolder',
                  color:'#003D82'
                }}>{formatMessage({id: 'searchActualityForecast.summary.basicInfo'})}</p>
              </Space>
              <div style={{marginLeft: 15,marginRight: 15}}>
                <Table
                  className={styles.MonthSummaryBacicInfo}
                  // @ts-ignore
                  columns={BasicInfoColumns}
                  dataSource={basicInfoData}
                  pagination={false}
                />
              </div>
            </div>
            <div style={{height: '10px'}}/>
            <div style={{height: '410px', backgroundColor: 'white'}}>
              <p style={{
                marginLeft: 15,
                fontSize: '18px',
                fontWeight: 'bolder',
                color:'#003D82'
              }}>{formatMessage({id: 'searchActualityForecast.summary.salesData'})}</p>
   
              <div style={{marginLeft: 15,marginRight: 15}}>
                <Table 
                  id={'tableId'}
                  className={styles.MonthSummarySalesInfo}
                  // @ts-ignore
                  columns={salesInfoColumns}
              
                  dataSource={salesInfoData}
                  pagination={false}
                />
              </div>
              <div style={{marginLeft: 15,marginRight: 15}}>
                <Table
                  className={styles.MonthSummarySalesTotal}
                  // @ts-ignore
                  columns={salesInfoColumnsTotal}
                  dataSource={salesInfoTotal}
                  pagination={false}
                />
              </div>
              <div>
                <div style={{height: '5px'}}></div>
                <p  style={{marginLeft: '10px',marginRight: '10px',fontSize: '12px',color: '#0000FF',fontWeight:'bolder'}}>※{formatMessage({ id: 'common.basic.Sales' })} = {this.state.comment}</p>
              </div>
            </div>
        </Modal>
      );
    }
  }
  
  export default connect(
    ({
       ActForecastData,
       user,
       searchActForData,
       global
       
     }: {
       ActForecastData: any;
       user: ConnectState;
       searchActForData: ActForecastData;
       global:ConnectState;
     },
    ) => ({
      monthSummaryModelCollapsed: searchActForData.monthSummaryModelCollapsed,
      actForMonthSummaryVo: ActForecastData.actForMonthSummaryVo,
      ActForecastData,
      user,
      oncust: global.oncust,
    }),
    // @ts-ignore
  )(ActualityForecastMonthSummary);
  