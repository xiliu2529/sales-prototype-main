import React, { Component } from 'react';
import  'echarts/lib/chart/bar';
import  'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import styles from "./index.less";
// @ts-ignore
import numeral from 'numeral';
import moneysmall from "@/assets/moneysmall.png";
import times from "@/assets/times.png";
import {formatMessage} from "@@/plugin-locale/localeExports";
import switches from "@/assets/switches.png";
import ReactTooltip from "react-tooltip";
import {Col, Row} from "antd";


export interface CustomerRankingProps {
  title: React.ReactNode;
  onTitleClick:any;
}

// eslint-disable-next-line react/prefer-stateless-function
class CustomerRanking extends Component<CustomerRankingProps>{

  render() {
    // @ts-ignore
    const { customerRanking,title,onTitleClick} = this.props;
    
    // @ts-ignore
    return (
      <div className={styles.divClass}>
        <h4 className={styles.rankingTitleRight}>
          {title}
        </h4>
          <div style={{height:20,marginRight: "40px"}}>
            <Row>
              <Col xl={10} lg={24} md={24} sm={24} xs={24}> </Col>
              <Col xl={8} lg={24} md={24} sm={24} xs={24} style={{textAlign: "right",marginLeft:"20px"}}>
                <img src={moneysmall} alt="" data-tip={formatMessage({id: 'homepage.basic.amount'})} data-place = "bottom" data-type='light' data-class={styles.Suspensionframe1}   className={styles.rankingItemSales}/>
                <ReactTooltip />
              </Col>
              <Col xl={2} lg={24} md={24} sm={24} xs={24}> </Col>
              <Col xl={4} lg={24} md={24} sm={24} xs={24} style={{textAlign: "right",marginLeft: "-20px"}}>
                <img src={times} alt="" data-tip={formatMessage({id: 'homepage.basic.effort'})} data-place = "bottom" data-type='light' data-class={styles.Suspensionframe1}    className={styles.rankingItemManMonth}/>
                <ReactTooltip />
              </Col>
            </Row>
          </div>
        <div style= {{width:'100%',height:230,overflowY:'scroll'}}>
        <ul className={styles.rankingList}>
          {customerRanking.map((item:any,i:any) => (
            <li>
              <span className={`${styles.rankingItemNumber} ${i < 3 ? styles.active : styles.rankingItemNumberAfter}`}>
                {i + 1}
              </span>
              <span className={styles.rankingItemTitle} title={item.name}>
                {onTitleClick?
                   <a  onClick={() => onTitleClick(item)}>{item.name}</a>
                :
                   <div>{item.name}</div>
                }
              </span>

              <span className={styles.rankingItemSales}>
                      {numeral(item.amount).format('0,0')}
              </span>
              <span className={styles.rankingItemManMonth}>
                      {numeral(item.effort).format('0,0')}
              </span>

            </li>
          ))}
        </ul>
          </div>
      </div>
    );
  }
}

export default CustomerRanking;
