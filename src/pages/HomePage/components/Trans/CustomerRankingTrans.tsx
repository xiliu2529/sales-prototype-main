import React, { Component } from 'react';
import {Transfer} from 'antd';


export interface CustomerRankingTransProps {
  title: React.ReactNode;
  customerRankingLeft: [];
  customerRankingRight: [];
  keys:number;
}


class   CustomerRankingTrans extends Component<CustomerRankingTransProps>{
state = {
    targetKeys: this.props.customerRankingRight,
    selectedKeys: [],
    disabled: false,
  };

// 設定ボックスの両側のデータ選択
  handleChange = (nextTargetKeys: any) => {
    // @ts-ignore
/*    const {keys} = this.props;
    if(nextTargetKeys.length <= keys){ */
      this.setState({ targetKeys: nextTargetKeys });
    /* } */
    this.refreshParams(nextTargetKeys);
  };
// 設定ボックスに選択したデータを送信します
  refreshParams(targetKeys: []) {
    /* 简化，解构赋值 */
    // @ts-ignore
    const { refreshParams } = this.props;
    refreshParams(targetKeys)
  }
// 設定ボックス側のデータ選択を他の端に移動します
  handleSelectChange = (sourceSelectedKeys: any, targetSelectedKeys: any) => {
    this.setState({ selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys] });
  };

  render() {
    // @ts-ignore
    const { targetKeys, selectedKeys, disabled } = this.state;
    const { dataSource} = this.props;
    // ホームページ共通の設定画面
    return (
          <Transfer
            dataSource={dataSource}
            titles={['', '']}
            targetKeys={targetKeys}
            selectedKeys={selectedKeys}
            onChange={this.handleChange}
            onSelectChange={this.handleSelectChange}
            // @ts-ignore
            render={item => item.title}
            disabled={disabled}
            style={{background: "white", width: "430px"}}
          />
    );
  }
}
export default CustomerRankingTrans;
