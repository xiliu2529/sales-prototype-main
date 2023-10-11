import React, { Component } from 'react';
import {Transfer} from 'antd';


export interface custOrendUOrMemberTransProps {
  title: React.ReactNode;
  customerRankingLeft: [];
  custOrEndOrMemberRanking: [];
  keys:number;
}


class   custOrendUOrMemberTrans extends Component<custOrendUOrMemberTransProps>{
state = {
    targetKeys: this.props.custOrEndOrMemberRanking,
    selectedKeys: [],
    disabled: false,
  };


  handleChange = (nextTargetKeys: any) => {
    // @ts-ignore
/*    const {keys} = this.props;
    if(nextTargetKeys.length <= keys){ */
      this.setState({ targetKeys: nextTargetKeys });
    /* } */
    this.refreshParams(nextTargetKeys);
  };

  refreshParams(targetKeys: []) {
    /* 简化，解构赋值 */
    // @ts-ignore
    const { refreshParams } = this.props;
    refreshParams(targetKeys)
  }

  handleSelectChange = (sourceSelectedKeys: any, targetSelectedKeys: any) => {
    this.setState({ selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys] });
  };

  render() {
    // @ts-ignore
    const { targetKeys, selectedKeys, disabled } = this.state;
    const { dataSource} = this.props;

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
            style={{ marginBottom: 16 }}
          />
    );
  }
}
export default custOrendUOrMemberTrans;
