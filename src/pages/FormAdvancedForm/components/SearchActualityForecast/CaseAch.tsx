import React, {Component} from "react";
import {Table} from "antd";
import {formatMessage} from "@@/plugin-locale/localeExports";
import {ActForecastData, CompareData} from "@/pages/FormAdvancedForm/components/SearchActualityForecast/data";
import {connect} from "umi";
import styles from "@/pages/FormAdvancedForm/components/SearchActualityForecast/style.less";

interface CaseAchProps {
  dataSource1:CompareData;
  searchActForData: ActForecastData;
  amountTitle?: string;
}

class CaseAch extends Component<CaseAchProps> {
  // @ts-ignore
  constructor(props: Readonly<CaseAchProps>) {
    super(props);
    if (this.props.dataSource1  !== undefined &&
      this.props.dataSource1 !== null &&
      this.props.dataSource1.toString() !== '' ){
      return ;
    }
  }



  render()
  {

    let amount = Number(this.props.dataSource1.amount);
    let actAmt = Number(this.props.dataSource1.actAmt);
    // let amount = 6;
    // let actAmt = 100000000;
    let effort = Number(this.props.dataSource1.effort);
    let actEffort = Number(this.props.dataSource1.actEffort);
    const dataSource = [
      {
        rowNm: formatMessage({ id: 'common.basic.Sales' })+'('+ this.props.amountTitle +')',
        budget: this.props.dataSource1.amount,
        // budget: 99999999,
        amt: this.props.dataSource1.actAmt,
        balance: actAmt-amount,
        ach: amount==0 ? 0 : Number((actAmt/amount)*100).toFixed(0),
      },
      {
        rowNm: formatMessage({ id: 'common.basic.effort' })+'(MM)',
        budget: Number(this.props.dataSource1.effort).toFixed(2),
        // budget: 99999999.12,
        amt: Number(this.props.dataSource1.actEffort).toFixed(2),
        balance: (actEffort-effort).toFixed(2),
        ach: effort==0 ? 0 : Number((actEffort/effort)*100).toFixed(0),
      },
    ];
    const columns = [
      {
        title: '',
        dataIndex: 'rowNm',
        key: 'rowNm',
        width: '105px',
      },
      {
        title: formatMessage({ id: 'common.basic.BudgetTitle' }),
        dataIndex: 'budget',
        key: 'budget',
        width: '105px',
        render: (text: number) => {
          return (<div style={{textAlign: 'right'}}>{`${text}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>);
        }
      },
      {
        title: formatMessage({ id: 'common.basic.actualityEstimate' }),
        dataIndex: 'amt',
        key: 'amt',
        width: '105px',
        render: (text: number) => {
          return (<div style={{textAlign: 'right'}}>{`${text}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>);
        }
      },
      {
        title: formatMessage({ id: 'common.basic.gap' }),
        dataIndex: 'balance',
        key: 'balance',
        width: '105px',
        render: (text: number) => {
          if (text < 0) {
            return (<div style={{color: 'red',textAlign: 'right'}}>{`${text}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>);
          }
          return (<div style={{textAlign: 'right'}}>{`${text}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>);
        }
      },
      {
        title: 'Ach(%)',
        dataIndex: 'ach',
        key: 'ach',
        align: 'center',
        width: '105px',
        render: (text: number) => {
          return (<div style={{textAlign: 'right'}}>{text}</div>);
        }
      }
    ];
    return(
      <Table
        className={styles.CompRightAct}
        // @ts-ignore
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        size={'small'}
      />
    );
  }

}

export default connect(
  ({searchActForData,}: { searchActForData:ActForecastData, }) => ({
    searchActForData,
  }),
)// @ts-ignore
  (CaseAch)
