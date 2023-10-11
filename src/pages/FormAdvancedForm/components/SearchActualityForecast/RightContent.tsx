
import { Drawer, message, Table, Modal} from 'antd';
import React, {Dispatch, ReactNode, useEffect} from 'react';
import { connect } from 'umi';
import './style.less';
import {ActForecastData, RightLineContent} from "@/pages/FormAdvancedForm/components/SearchActualityForecast/data";
import {formatMessage} from "@@/plugin-locale/localeExports";
import styles from "@/pages/FormAdvancedForm/components/SearchActualityForecast/style.less";
import {ActForecastTopData} from "@/pages/FormAdvancedForm/data";
import classNames from "classnames";

message.config({
  duration: 5,
});

export interface RightContentProps {
  show?: boolean;
  getContainer?: any;
  prefixCls?: string;
  dispatch:Dispatch<any>;
  selectCollapsed:boolean;
  budgetOrHistDataList:ActForecastTopData;
  amountTitle?: string;
}

const RightContent: React.FC<RightContentProps> = (props) => {
  const {
    // @ts-ignore
    selectCollapsed,
  } = props;

  const changeReadState = (payload: boolean): void => {
    const { dispatch } = props;
    if (dispatch) {
      dispatch({
        // add Org
        type: 'searchActForData/changeSelectCollapseOrg',
        payload
      });
    }
  };

  const {budgetOrHistDataList,amountTitle} = props;
  if(budgetOrHistDataList === null || budgetOrHistDataList === undefined || budgetOrHistDataList ===[] || budgetOrHistDataList.length===0){
    return null;
  }

  let ContentData: any[] | undefined = [];
  let comment = '';


  const achCal  = (params1:any,params2:any) => {
    let januaryAch = '';
    if( parseFloat(params2) >0 && parseFloat(params1) ===0){
      januaryAch += `100`;
    }
    if(parseFloat(params2) ===0 && parseFloat(params1) ===0){
      januaryAch += `0`;
    }
    if(parseFloat(params1) !== 0){
      januaryAch +=  (params2 /params1 * 100).toFixed(0);
    }
    return januaryAch;
  }


  if(budgetOrHistDataList!==undefined && budgetOrHistDataList!==null && budgetOrHistDataList.length>0) {
    comment = budgetOrHistDataList[0].title;
    const amountBudget1 = (budgetOrHistDataList[0].month1 + budgetOrHistDataList[0].month2 + budgetOrHistDataList[0].month3).toFixed(0);
    const amountSales1 = (budgetOrHistDataList[1].month1 + budgetOrHistDataList[1].month2 + budgetOrHistDataList[1].month3).toFixed(0);
    const effortBudget1 =(budgetOrHistDataList[0].effort1 + budgetOrHistDataList[0].effort2 + budgetOrHistDataList[0].effort3).toFixed(2);
    const effortSales1 =(budgetOrHistDataList[1].effort1 + budgetOrHistDataList[1].effort2 + budgetOrHistDataList[1].effort3).toFixed(2);

    const amountBudget2 = (budgetOrHistDataList[0].month4 + budgetOrHistDataList[0].month5 + budgetOrHistDataList[0].month6).toFixed(0);
    const amountSales2 = (budgetOrHistDataList[1].month4 + budgetOrHistDataList[1].month5 + budgetOrHistDataList[1].month6).toFixed(0);
    const effortBudget2 =(budgetOrHistDataList[0].effort4 + budgetOrHistDataList[0].effort5 + budgetOrHistDataList[0].effort6).toFixed(2);
    const effortSales2 =(budgetOrHistDataList[1].effort4 + budgetOrHistDataList[1].effort5 + budgetOrHistDataList[1].effort6).toFixed(2);

    const amountBudget3 = (budgetOrHistDataList[0].month7 + budgetOrHistDataList[0].month8 + budgetOrHistDataList[0].month9).toFixed(0);
    const amountSales3 = (budgetOrHistDataList[1].month7 + budgetOrHistDataList[1].month8 + budgetOrHistDataList[1].month9).toFixed(0);
    const effortBudget3 =(budgetOrHistDataList[0].effort7 + budgetOrHistDataList[0].effort8 + budgetOrHistDataList[0].effort9).toFixed(2);
    const effortSales3 =(budgetOrHistDataList[1].effort7 + budgetOrHistDataList[1].effort8 + budgetOrHistDataList[1].effort9).toFixed(2);

    const amountBudget4 = (budgetOrHistDataList[0].month10 + budgetOrHistDataList[0].month11 + budgetOrHistDataList[0].month12).toFixed(0);
    const amountSales4 = (budgetOrHistDataList[1].month10 + budgetOrHistDataList[1].month11 + budgetOrHistDataList[1].month12).toFixed(0);
    const effortBudget4 =(budgetOrHistDataList[0].effort10 + budgetOrHistDataList[0].effort11 + budgetOrHistDataList[0].effort12).toFixed(2);
    const effortSales4 =(budgetOrHistDataList[1].effort10 + budgetOrHistDataList[1].effort11 + budgetOrHistDataList[1].effort12).toFixed(2);

    const amountBudget12 = ( parseFloat(amountBudget1)+ parseFloat(amountBudget2)).toFixed(0);
    const  amountSales12 =( parseFloat(amountSales1)+ parseFloat(amountSales2)).toFixed(0);
    const effortBudget12 = ( parseFloat(effortBudget1)+ parseFloat(effortBudget2)).toFixed(2);
    const effortSales12 = ( parseFloat(effortSales1)+ parseFloat(effortSales2)).toFixed(2);

    const amountBudget123 = ( parseFloat(amountBudget12)+ parseFloat(amountBudget3)).toFixed(0);
    const  amountSales123 = ( parseFloat(amountSales12)+ parseFloat(amountSales3)).toFixed(0);
    const effortBudget123 = ( parseFloat(effortBudget12)+ parseFloat(effortBudget3)).toFixed(2);
    const effortSales123 = ( parseFloat(effortSales12)+ parseFloat(effortSales3)).toFixed(2);

    const amountBudget1234 = ( parseFloat(amountBudget123)+ parseFloat(amountBudget4)).toFixed(0);
    const  amountSales1234 = ( parseFloat(amountSales123)+ parseFloat(amountSales4)).toFixed(0);
    const effortBudget1234 = ( parseFloat(effortBudget123)+ parseFloat(effortBudget4)).toFixed(2);
    const effortSales1234 = ( parseFloat(effortSales123)+ parseFloat(effortSales4)).toFixed(2);


    ContentData.push({No:'1Q',amountBudget:formatNum(amountBudget1),amountSales:formatNum(amountSales1),amountAch:formatNum(achCal(amountBudget1,amountSales1)),effortBudget:formatNum(effortBudget1),effortSales:formatNum(effortSales1),effortAch:formatNum(achCal(effortBudget1,effortSales1))});
    ContentData.push({No:'2Q',amountBudget:formatNum(amountBudget2),amountSales:formatNum(amountSales2),amountAch:formatNum(achCal(amountBudget2,amountSales2)),effortBudget:formatNum(effortBudget2),effortSales:formatNum(effortSales2),effortAch:formatNum(achCal(effortBudget2,effortSales2))});
    ContentData.push({No:formatMessage({ id: 'app.common.Total' }),amountBudget:formatNum(amountBudget12),amountSales:formatNum(amountSales12),amountAch:formatNum(achCal(amountBudget12,amountSales12)),effortBudget:formatNum(effortBudget12),effortSales:formatNum(effortSales12),effortAch:formatNum(achCal(effortBudget12,effortSales12))});
    ContentData.push({No:'3Q',amountBudget:formatNum(amountBudget3),amountSales:formatNum(amountSales3),amountAch:formatNum(achCal(amountBudget3,amountSales3)),effortBudget:formatNum(effortBudget3),effortSales:formatNum(effortSales3),effortAch:formatNum(achCal(effortBudget3,effortSales3))});
    ContentData.push({No:formatMessage({ id: 'app.common.Total' }),amountBudget:formatNum(amountBudget123),amountSales:formatNum(amountSales123),amountAch:formatNum(achCal(amountBudget123,amountSales123)),effortBudget:formatNum(effortBudget123),effortSales:formatNum(effortSales123),effortAch:formatNum(achCal(effortBudget123,effortSales123))});
    ContentData.push({No:'4Q',amountBudget:formatNum(amountBudget4),amountSales:formatNum(amountSales4),amountAch:formatNum(achCal(amountBudget4,amountSales4)),effortBudget:formatNum(effortBudget4),effortSales:formatNum(effortSales4),effortAch:formatNum(achCal(effortBudget4,effortSales4))});
    ContentData.push({No:formatMessage({ id: 'app.common.Total' }),amountBudget:formatNum(amountBudget1234),amountSales:formatNum(amountSales1234),amountAch:formatNum(achCal(amountBudget1234,amountSales1234)),effortBudget:formatNum(effortBudget1234),effortSales:formatNum(effortSales1234),effortAch:formatNum(achCal(effortBudget1234,effortSales1234))});
  }

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



  const columns = [
    {
          title: '',
          dataIndex: 'No',
          key: 'No',
          width: '20px',
      render: (text: string) => {
        if(text === '1Q' || text === '2Q' || text === '3Q' || text === '4Q') {
          return <div style={{ textAlign: 'left'}}>{text.toLocaleString()}</div>;
        }
        return <div style={{textAlign: 'right'}}>{text.toLocaleString()}</div>;
      },
    },
    {
      title: formatMessage({ id: 'common.basic.amount' })+'('+ amountTitle+')',
      // title: formatMessage({ id: 'common.basic.amount' }),
      children: [
        {
          title: formatMessage({ id: 'common.basic.BudgetTitle' }),
          dataIndex: 'amountBudget',
          key: 'amountBudget',
          width: '15px',
          render: (text: string) => {
            return <div style={{textAlign: 'right'}}>{text.toLocaleString()}</div>;
          },
        },
        {
          title: '※' + formatMessage({ id: 'common.basic.Sales' }),
          dataIndex: 'amountSales',
          key: 'amountSales',
          width: '15px',
          render: (text: string) => {
            return <div style={{textAlign: 'right'}}>{text.toLocaleString()}</div>;
          },
        },
        {
          title: 'Ach%',
          dataIndex: 'amountAch',
          key: 'amountAch',
          width: '15px',
          render: (text: string) => {
            // if(parseFloat(text) <100){
            //   return <div style={{color:'#D7484C', textAlign: 'right'}}>{text.toLocaleString()}</div>;
            // }
            return <div style={{textAlign: 'right'}}>{text.toLocaleString()}</div>;
          },
        },
      ],
    },
    {
      title: formatMessage({ id: 'common.basic.effort' })+'(MM)',
      children: [
        {
          title: formatMessage({ id: 'common.basic.BudgetTitle' }),
          dataIndex: 'effortBudget',
          key: 'effortBudget',
          width: '15px',
          render: (text: string) => {
            return <div style={{textAlign: 'right'}}>{text.toLocaleString()}</div>;
          },
        },
        {
          title: formatMessage({ id: 'common.basic.Sales' }),
          dataIndex: 'effortSales',
          key: 'effortSales',
          width: '15px',
          render: (text: string) => {
            return <div style={{textAlign: 'right'}}>{text.toLocaleString()}</div>;
          },
        },
        {
          title: 'Ach%',
          dataIndex: 'effortAch',
          key: 'effortAch',
          width: '15px',
          render: (text: string) => {
            // if(parseFloat(text) <100){
            //   return <div style={{color:'#d7484c', textAlign: 'right'}}>{text.toLocaleString()}</div>;
            // }
            return <div style={{ textAlign: 'right'}}>{text.toLocaleString()}</div>;
          },
        },
      ],
    },
  ];

  // @ts-ignore
  return (
    // <Drawer
    //   visible={selectCollapsed}
    //   width={500}
    //   height={500}
    //   onClose={() => changeReadState(false)}
    //   placement='right'
    //   getContainer={false}
    //
    //   style={{
    //     marginTop: 96,
    //     // marginLeft:-24,
    //     // marginTop:-24,
    //     zIndex: 999,
    //     bottom:-96
    //   }}
    // >
    <Modal
      visible={selectCollapsed}
      // onOk={() => setVisible(false)}
      onCancel={() => changeReadState(false)}
      // width={600}
      // height={500}
      footer={null}
      className={classNames(styles.TotalModel)}
      style={{
        marginTop: 96,
        marginRight: 100,
        zIndex: 999,
        bottom:-96,
        // width: 600px !important,
      }}
    >
    <br/> <br/>
      <div>
        <p  style={{marginLeft: 5,fontSize: '12px',color: '#0000FF',fontWeight:'bolder'}}>※{formatMessage({ id: 'common.basic.Sales' })} = {comment}</p>
      </div>
      <div>
        <Table
         className={styles.RightAct}
          // @ts-ignore
          columns={columns}
          dataSource={ContentData}
          bordered
          pagination={false}
          rowClassName={(record, index) => (index ===2 ||index ===4||index ===6) ?styles.csbsTypes:''}
        />
      </div>
      <br/> <br/>
    </Modal>
  );
}


// @ts-ignore
export default connect(({ActForecastData,searchActForData}:{ActForecastData:ActForecastTopData,searchActForData: ActForecastData;}) => ({
  selectCollapsed:searchActForData.selectCollapsed,
  budgetOrHistDataList:ActForecastData.budgetOrHistDataList,
}))(RightContent);
