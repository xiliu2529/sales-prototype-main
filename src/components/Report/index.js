import React from 'react';
import { notification} from 'antd';
import InnerTable from './InnerTable.js';
import './index.less';

/**
 * 操作数据库中的一张表的组件, 又可以分为3个组件: 表单+表格+分页器
 */
class Report extends React.Component {

  /**
   * 弹出错误信息
   *
   * @param errorMsg
   */
  error = (errorMsg) => {
    // 对于错误信息, 要很明显的提示用户, 这个通知框要用户手动关闭
    notification.error({
      message: '出错啦!',
      description: `请联系管理员, 错误信息: ${errorMsg}`,
      duration: 0,
    });
    this.setState();
  };

  render() {
    return (
      <InnerTable
        tableName={this.props.tableName}
        schema={this.props.schema}
        data={this.props.data}
        sumData={this.props.sumData}
        procedureDiv={this.props.procedureDiv}
        year={this.props.year}
        formatName={this.props.formatName}
      />
    );
  }
}

export default Report;
