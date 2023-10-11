import React from 'react';
import {
  Tabs,
  Table,
  notification, Button, Modal, Spin,
} from 'antd';
import {formatMessage} from "@@/plugin-locale/localeExports";
import Logger from './Logger';
import InnerTableSchemaUtils from './InnerTableSchemaUtils';
import InnerTableRenderUtils from './InnerTableRenderUtils';
import styles from './style.less';

const logger = Logger.getLogger('InnerTable');

const { TabPane } = Tabs;

/**
 * 内部表格组件
 */
class InnerTable extends React.PureComponent {

  // 对于InnerTable组件而言, 既有表格又有表单
  // 虽然传进来的是dataSchema, 但要parse两次, 分别变成表格和表单的schema

  state = {
    modalVisible: false,  // modal是否可见
    modalTitle: '新增',  // modal标题
    modalInsert: true,  // 当前modal是用来insert还是update

    selectedTab: '0',  // 当前选中的tab 掉后台用
    // selectedRowData: [], // 当前选中的数据 掉后台用

    selectedRowKeys: [],  // 当前有哪些行被选中, 这里只保存key

    loadModelVisible: false,

    // loading...
    loadDataLoading: false,
  };

  /**
   * 组件初次挂载时parse schema
   */
  // eslint-disable-next-line react/no-deprecated
  componentWillMount() {
    this.parseTableSchema(this.props);
  }

  /**
   * InnerTable组件的re-render有两种情况: 自身状态变化导致的render vs 父组件导致的render
   * 正常情况下, 只有父组件导致的render才会触发这个方法, InnerTable自身的变化应该不会触发
   *
   * 父组件触发这个方法也有两种情况:
   * 1. 只有data变化, 比如改变了查询条件/分页等等
   * 2. schema和data都变化了, 比如在react router中切换了菜单项
   *
   * @param nextProps
   */
  // eslint-disable-next-line react/no-deprecated
  componentWillReceiveProps(nextProps) {
    logger.debug('receive new props and try to render, nextProps=%o', nextProps);
    // 之前因为antd的Form组件搞了一些黑盒操作, 表单每输入一次都会触发这个方法, 现在表单独立成一个组件了, 应该好了

    // 只有表名变化时才需要重新parse schema
    if (this.props.tableName !== nextProps.tableName) {
      logger.debug('tableName changed and try to refresh schema');
      this.parseTableSchema(nextProps);
      this.formComponent = undefined;  // 这个别忘了, 如果schema变了, 表单当然也要变
    }

    this.state.modalVisible = false;
    this.state.modalTitle = '新增';
    this.state.modalInsert = true;
    this.state.selectedRowKeys = [];
  }

  /**
   * 解析表格的schema
   */
  parseTableSchema(props) {
    const {tableName, schema} = props;
    const parseResult = InnerTableSchemaUtils.getTableSchema(tableName, schema);

    this.primaryKey = parseResult.primaryKey;
    // fieldMap是对原始的dataSchema做了一些处理, 方便查询用的
    this.fieldMap = parseResult.fieldMap;

    // tableSchema是转换后的Table组件可用的schema
    // 对于tableSchema, 即使命中了缓存, 也要重新设置下render函数
    this.tableSchema = InnerTableRenderUtils.bindRender(parseResult.tableSchema, tableName, this);
  }

/*  /!**
   * 处理表格的选择事件
   *
   * @param selectedRowKeys
   *!/
  onTableSelectChange = (selectedRowKeys) => {

    const sheetDataBak = [];
      this.props.data[this.state.selectedTab].forEach((item,index)=>{
      if(selectedRowKeys.toString().indexOf(index.toString())>-1 ){
        sheetDataBak.push(item);
      }
    })

    this.setState({
      selectedRowKeys,
      selectedRowData:sheetDataBak,
    });
  }; */


  /**
   * 显示错误信息
   * @param errorMsg
   */
  error=(errorMsg)=> {
    // 对于错误信息, 要很明显的提示用户, 这个通知框要用户手动关闭
    notification.error({
      message: '出错啦!',
      description: `请联系管理员, 错误信息: ${errorMsg}`,
      duration: 0,
    });
  }

  /**
   * 选项卡变更
   * @param activeKey 当前选中的页
   */
  tabsChange = (activeKey) => {
    this.setState({
      selectedTab:activeKey,
    });
  }

  /**
   * 插入数据 用于点击load按钮后调用
   */
  loadData=()=> {

   this.setState({
     loadModelVisible: true,
   })
  }

  /**
   * 登録確認 確認
   * */
  loadModelConfirm = () => {
    this.setState({
      loadModelVisible: false,
    })

    const {dispatch} = this.props;

    const nowUserList = this.props.userList.filter((userItem)=>
      userItem.userNmDeft.replace(' ','').replace('　','') === this.props.sheetNames[this.state.selectedTab].replace(' ','').replace('　','')
      ||
      userItem.userNmJp.replace(' ','').replace('　','') === this.props.sheetNames[this.state.selectedTab].replace(' ','').replace('　','')
      ||
      userItem.userNmEn.replace(' ','').replace('　','') === this.props.sheetNames[this.state.selectedTab].replace(' ','').replace('　','')
      ||
      userItem.userNmCn.replace(' ','').replace('　','') === this.props.sheetNames[this.state.selectedTab].replace(' ','').replace('　','')
      ||
      userItem.userNmFra.replace(' ','').replace('　','') === this.props.sheetNames[this.state.selectedTab].replace(' ','').replace('　','')
    );
    // 数据格式化 每一条数据都转json
    const loadDataList = [];
    const dataBak = JSON.parse(JSON.stringify(this.props.data));
    dataBak[this.state.selectedTab].forEach((dataItem)=>{
      const changeCurrCdData = dataItem;
      if(changeCurrCdData.CURR_CD === 'RMB'){
        changeCurrCdData.CURR_CD = 'CNY';
      }
      loadDataList.push(JSON.stringify(dataItem));
    })

    const year = this.props.year.toString();
    const {userCd} = nowUserList[0];
    const userNm = this.props.sheetNames[this.state.selectedTab].replace(' ','').replace('　','');
    const busUserList = this.props.sheetNames;
    const {orgGroupId} = this.props;
    const {loginUserCd} = this.props
    const {effortUnitCd} = this.props;
    const {amtRt} = this.props;
    const {procName} = this.props;
    const loadDataParam = { year, orgGroupId, userCd, userNm, busUserList, loadDataList, loginUserCd, effortUnitCd, amtRt, procName };

    const loadDataModel = JSON.stringify(loadDataParam);
    dispatch({
      type: 'uploadExcel/loadData',
      payload: {
        loadDataModel,
      },
    });
  }

  /**
   * 登録確認 关闭
   * */
  loadModelHideModal = () => {
    this.setState({
      loadModelVisible: false,
    })
  }

  /**
   * データの削除は登録確認 点击确认
   * */
  confirm = () => {
    this.hideModal();

    const {dispatch} = this.props;

    const nowUserList = this.props.userList.filter((userItem)=>
      userItem.userNmDeft.replace(' ','').replace('　','') === this.props.sheetNames[this.state.selectedTab].replace(' ','').replace('　','')
      ||
      userItem.userNmJp.replace(' ','').replace('　','') === this.props.sheetNames[this.state.selectedTab].replace(' ','').replace('　','')
      ||
      userItem.userNmEn.replace(' ','').replace('　','') === this.props.sheetNames[this.state.selectedTab].replace(' ','').replace('　','')
      ||
      userItem.userNmCn.replace(' ','').replace('　','') === this.props.sheetNames[this.state.selectedTab].replace(' ','').replace('　','')
      ||
      userItem.userNmFra.replace(' ','').replace('　','') === this.props.sheetNames[this.state.selectedTab].replace(' ','').replace('　','')
    );
    // 数据格式化 每一条数据都转json
    const loadDataList = [];
    const dataBak = JSON.parse(JSON.stringify(this.props.data));
    dataBak[this.state.selectedTab].forEach((dataItem)=>{
      const changeCurrCdData = dataItem;
      if(changeCurrCdData.CURR_CD === 'RMB'){
        changeCurrCdData.CURR_CD = 'CNY';
      }
      loadDataList.push(JSON.stringify(dataItem));
    })

    const year = this.props.year.toString();
    const {userCd} = nowUserList[0];
    const userNm = this.props.sheetNames[this.state.selectedTab].replace(' ','').replace('　','');
    const busUserList = this.props.sheetNames;
    const {orgGroupId} = this.props;
    const {loginUserCd} = this.props
    const {effortUnitCd} = this.props;
    const {amtRt} = this.props;
    const {procName} = this.props;
    const loadDataParam = { year, orgGroupId, userCd, userNm, busUserList, loadDataList, loginUserCd, effortUnitCd, amtRt, procName };

    const loadDataModel = JSON.stringify(loadDataParam);
    dispatch({
      type: 'uploadExcel/clearAndLoadData',
      payload: {
        loadDataModel,
      },
    });
  }

  /**
   * データの削除は登録確認 关闭
   * */
  hideModal = () => {
    const { dispatch } = this.props;
    const payload1 = false;
    dispatch({
      type: 'uploadExcel/changeModelVisible',
      payload: {
        payload1,
      },
    });
  };

  render() {
    const {tableLoading} = this.props;

/*    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: this.onTableSelectChange,
    }; */

    return (
      <div className={styles.boxTabs}>
        <Spin spinning={this.props.loadDataLoading}>
          <Tabs
            type="card"
            defaultActiveKey={this.state.selectedTab}
            onChange={(activeKey) => this.tabsChange(activeKey)}
          >
            {this.props.data.map((pane,index) => (
              <TabPane tab={this.props.sheetNames[index]} key={index}>
                <Table
                  className={styles.innerTable}
                  // rowSelection={rowSelection}
                  columns={this.tableSchema}
                  dataSource={pane}
                  pagination={false}
                  dateFormatter="string"
                  headerTitle="高级表格"
                  loading={tableLoading}
                  scroll={{ x: '2500px' }}
                />
              </TabPane>
            ))}
          </Tabs>
          <div className={styles.amountDiv}>
            <Button
              type="primary"
              className={styles.addButton}
              onClick={this.loadData}
            >
              {formatMessage({ id: 'uploadExcel.label.load' })}
            </Button>
          </div>
        </Spin>
        {/* 登録確認 */}
        <Modal
          visible={this.state.loadModelVisible === true}
          closable={false}
          centered={true}
          onOk={this.loadModelConfirm}
          onCancel={this.loadModelHideModal}
          okText={formatMessage({ id: 'uploadExcel.messageModel.confirm' })}
          cancelText={formatMessage({ id: 'uploadExcel.messageModel.cancel' })}
          // シャットダウン時にModalのサブ元素を廃棄
          destroyOnClose
          maskClosable={false}
        >
          <p>{formatMessage({ id: 'uploadExcel.model.message' })}</p>
        </Modal>

        {/* データの削除は登録確認 */}
        <Modal
          visible={this.props.modelVisible === true}
          closable={false}
          centered={true}
          onOk={this.confirm}
          onCancel={this.hideModal}
          okText={formatMessage({ id: 'uploadExcel.messageModel.confirm' })}
          cancelText={formatMessage({ id: 'uploadExcel.messageModel.cancel' })}
          destroyOnClose
          maskClosable={false}
        >
          <p>{this.props.message}</p>
        </Modal>
      </div>
    );
  }
}

export default InnerTable;
