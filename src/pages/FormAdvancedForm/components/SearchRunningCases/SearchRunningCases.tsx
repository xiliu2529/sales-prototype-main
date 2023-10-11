import {BackTop, Button, message, Select, Space, Spin, Table} from 'antd';
import React, { Component } from 'react';
import { formatMessage } from '@@/plugin-locale/localeExports';
import {RunCaseData, FetchRunCaseDataType, UserType, SearchRunCaseDataType} from './data';
// eslint-disable-next-line import/no-duplicates
import styles from './style.less';
// eslint-disable-next-line import/no-duplicates
import './style.less';
import { connect } from '@@/plugin-dva/exports';
import {Dispatch, GlobalModelState, UserModelState} from '@@/plugin-dva/connect';
import { ConnectState } from '@/models/connect';
import "@/utils/messageConfig";
import {DBusActDtl} from "@/pages/FormAdvancedForm/data";

const { Option } = Select;

interface TableFormProps {
  dispatch: Dispatch;
  searchRunCase: RunCaseData;
  user: UserModelState;
  selectUserName:GlobalModelState[];

  searchUserLst: UserType[];
  busUserCd?: string;
  busUserNm?: string;
}

interface TableDataStates {
  busUserCd?: string;
  busUserNm?: string;
  initFlag: boolean;
  searchLoading: boolean;
}

class SearchRunningCases extends Component<TableFormProps, TableDataStates> {
  state = {
    busUserCd: '',
    busUserNm: '',
    initFlag: true,
    searchLoading: false,
  };

  static getDerivedStateFromProps(nextProps: TableFormProps, prevState: TableDataStates) {
    if(nextProps.busUserCd !== prevState.busUserCd && prevState.initFlag){
      const selectUserName = nextProps;
      const { dispatch } = nextProps;
      const language = nextProps.user.currentUser?.dspLang;
      let  busUserCd = nextProps.busUserCd;
      if(selectUserName.selectUserName.length !==0) {
        busUserCd = selectUserName.selectUserName.userCd;
      }
      const runYear = nextProps.user.currentUser?.dspYear;
      const runCaseInfoSearchParam: FetchRunCaseDataType = { language, runYear, busUserCd };
      const runCaseInfoSearchModel = JSON.stringify(runCaseInfoSearchParam);
      dispatch({
        type: 'searchRunCase/searchRunCaseData',
        payload: {
          runCaseInfoSearchModel,
        },
      });
      if(selectUserName.selectUserName.length !==0){
        return {
          busUserCd: selectUserName.selectUserName.userCd,
          busUserNm: selectUserName.selectUserName.userNm,
          initFlag: false,
          searchLoading: nextProps.searchRunCase.setSearchLoading.searchLoading,
        }}
      return {
        busUserCd: nextProps.busUserCd,
        busUserNm: nextProps.busUserNm,
        initFlag: false,
        searchLoading: nextProps.searchRunCase.setSearchLoading.searchLoading,
      }
    }
    return {
      searchLoading: nextProps.searchRunCase.setSearchLoading.searchLoading,
    };
  }

  componentDidMount(){
    const {dispatch} = this.props;
    const pathname = window.location.pathname.substring(1,window.location.pathname.length);
    if ((this.props.global.selectMenu
      && this.props.global.selectMenu.length>0)
      && (pathname === "formadvancedformSea" || pathname === "formadvancedformSeaRun" )) {
      this.props.global.selectMenu = this.props.global.homePageMenu;
      this.changeRightMenu(false,false,false,false,false,false);}
  }

  /**
   * Business charge 变更方法
   * @param e: 变更后的值
   */
  BusUserChange = (e: String) => {
    if (e.toString() !== null) {
      let userList = this.props.searchUserLst;
      if(userList!==null && userList.length>0){
        userList = userList.filter((item) => item.userNm === e.toString());
        const { userCd } = userList[0];
        this.setState({
          busUserCd: userCd.toString(),
          busUserNm: e.toString(),
        });
        this.searchData(userCd.toString());
      }
    }
  };
  // @ts-ignore
  changeRightMenu = (parma1: boolean,parma2: boolean,parma3: boolean,parma4: boolean,parma5: boolean,parma6: boolean): void => {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'message/changeRightMenu',
        payload1: {
          parma1,
        },
        payload2: {
          parma2,
        },
        payload3: {
          parma3,
        },
        payload4: {
          parma4,
        },
        payload5: {
          parma5,
        },
        payload6: {
          parma6,
        },
      });
    }
  };

  /**
   * 点击search按钮事件
   */
  searchData = (busUserCd:any) => {
    const { dispatch } = this.props;
    document.getElementsByClassName('ant-table-body')[0].scrollTo({    left: 0,    behavior: "auto"});
    if(this.state.busUserCd===undefined || this.state.busUserCd===null || this.state.busUserCd===''){
      message.info(formatMessage({ id: 'actualityForecastBottom.message.busUserNm' }));
      return;
    }

    const runYear = this.props.user.currentUser?.dspYear;
  //  const { busUserCd } = this.state;
    const actForInfoSearchParam: FetchRunCaseDataType = { runYear, busUserCd };
    const runCaseInfoSearchModel = JSON.stringify(actForInfoSearchParam);
    dispatch({
      type: 'searchRunCase/searchRunCaseData',
      payload: {
        runCaseInfoSearchModel,
      },
    });
  };

  render() {

    const getUserOption = (list: UserType[]) => {
      if (!list || list.length < 1) {
        return (
          <Option key={0} value={0}>
            {formatMessage({ id: 'common.message.noSelect' })}
          </Option>
        );
      }
      const listBak = list.filter((item) => item.userNm !== null && item.userNm !== '');

      return listBak.map((item) => (
        <Option key={item.userCd} value={item.userNm}>
          {item.userNm}
        </Option>
      ));
    };

    const columns = [
      {
        title: formatMessage({ id: 'actualityForecastBottom.tableHead.No' }),
        dataIndex: 'No',
        key: 'No',
        width: '50px',
        fixed: 'left',
        align: 'center',
        // eslint-disable-next-line @typescript-eslint/no-shadow
        render: (text: any, record: any, index: number) => {
          const no = index + 1;
          return <span>{no}</span>;
        },
      },
      {
        title: formatMessage({ id: 'runningCases.tableHead.customer' }),
        dataIndex: 'cstmrNm',
        sorter: {
          compare: (a: {cstmrNm: string}, b: {cstmrNm: string}) => {
            const aVlue = a.cstmrNm ? a.cstmrNm :'';
            const bVlue = b.cstmrNm ? b.cstmrNm :'';
            return aVlue.localeCompare(bVlue);
          },
        },
        showSorterTooltip: false,
        key: 'cstmrNm',
        width: '200px',
        fixed: 'left',
      },
      {
        title: formatMessage({ id: 'runningCases.tableHead.case' }),
        dataIndex: 'caseNm',
        sorter: {
          compare: (a: {caseNm: string}, b: {caseNm: string}) =>{
            const aVlue = a.caseNm ? a.caseNm :'';
            const bVlue = b.caseNm ? b.caseNm :'';
            return aVlue.localeCompare(bVlue);
          },
        },
        showSorterTooltip: false,
        key: 'caseNm',
        width: '200px',
        fixed: 'left',
      },
      {
        title: formatMessage({ id: 'runningCases.tableHead.division' }),
        dataIndex: 'caseDiviNm',
        key: 'caseDiviNm',
        width: '80px',
      },
      {
        title: formatMessage({ id: 'runningCases.tableHead.startDate' }),
        dataIndex: 'startYm',
        key: 'startYm',
        width: '70px',
      },
      {
        title: formatMessage({ id: 'runningCases.tableHead.estimatedAmount' }),
        dataIndex: 'estdAmt',
        key: 'estdAmt',
        width: '90px',
        render: (text: string) => {
          return <div className={styles.amountDiv}>{text.toLocaleString()}</div>;
        },
      },
      {
        title: formatMessage({ id: 'runningCases.tableHead.contractCurrency' }),
        dataIndex: 'estdCurryNm',
        key: 'estdCurryNm',
        width: '80px',
      },
      {
        title: formatMessage({ id: 'runningCases.tableHead.conversionAmount' }),
        dataIndex: 'changedEstdAmt',
        key: 'changedEstdAmt',
        width: '90px',
        render: (text: string) => {
          return <div className={styles.amountDiv}>{text.toLocaleString()}</div>;
        },
      },
      {
        title: formatMessage({ id: 'runningCases.tableHead.conversionCurrency' }),
        dataIndex: 'changedEstdCurryNm',
        key: 'changedEstdCurryNm',
        width: '90px',
      },
      {
        title: formatMessage({ id: 'runningCases.tableHead.estimatedEffort' }),
        dataIndex: 'effort',
        key: 'effort',
        width: '70px',
        colSpan: 2,
        render: (text: string) => {
          return <div className={styles.amountDiv}>{
            text.toLocaleString()==='0.00'?(
                <div>-</div>)
              :
              (<div>{text.toLocaleString()}</div>)}
          </div>;
        },
      },
      {
        title: formatMessage({ id: 'runningCases.tableHead.estimatedEffort' }),
        dataIndex: 'effortUnitNm',
        key: 'effortUnitNm',
        width: '40px',
        colSpan: 0,
      },
      {
        title: formatMessage({ id: 'runningCases.tableHead.orderDate' }),
        dataIndex: 'orderMoth',
        key: 'orderMoth',
        width: '80px',
      },
      {
        title: formatMessage({ id: 'runningCases.tableHead.probability' }),
        dataIndex: 'runRankNm',
        key: 'runRankNm',
        width: '90px',
      },
      // {
      //   title: formatMessage({ id: 'runningCases.tableHead.businessCharge' }),
      //   dataIndex: 'busUserNm',
      //   key: 'busUserNm',
      //   width: '150px',
      // },
      {
        title: formatMessage({ id: 'runningCases.tableHead.industry' }),
        dataIndex: 'caseIndstyNm',
        key: 'caseIndstyNm',
        width: '70px',
      },
      {
        title: formatMessage({ id: 'runningCases.tableHead.remarks' }),
        dataIndex: 'memo',
        key: 'memo',
        width: '200px',
      },
    ];

    const screenHeight = window.screen.height * 0.98 - 363;
    console.log(`screenHeight: ${  screenHeight}`);
    return (
      <>
        <Spin spinning={this.state.searchLoading}>
          <Space size={80} style={{ marginTop: '10px', marginLeft: '4%' }}>
            <Space size={10}>
              {formatMessage({ id: 'actualityForecastTop.tableHead.businessCharge' })}
              <Select
                className={styles.BusUserSelect}
                defaultValue={this.state.busUserNm}
                value={this.state.busUserNm}
                // @ts-ignore
                onSelect={(e) => this.BusUserChange(e)}
              >
                {getUserOption(this.props.searchUserLst)}
              </Select>
            </Space>

            {/*<Button*/}
            {/*  className={styles.addButton}*/}
            {/*  onClick={()=>this.searchData(this.state.busUserCd)}*/}
            {/*  type="primary"*/}
            {/*>*/}
            {/*  {formatMessage({ id: 'actualityForecast.index.refresh' })}*/}
            {/*</Button>*/}
          </Space>
          <br /><br/>
          <Table
            size={'small'}
            className={styles.searchRun}
            // @ts-ignore
            columns={columns}
            dataSource={this.props.searchRunCase.runCaseData}
            pagination={false}
            scroll={{ x: '1500px', y: `${screenHeight.toString()}px`  }}
          />
        </Spin>
        <BackTop>
          <div className={styles.TopStyles}>↑</div>
        </BackTop>
      </>
    );
  }
}

export default connect(
  ({ searchRunCase, user ,global}: { searchRunCase: RunCaseData; user: ConnectState ;global:ConnectState}) => ({
    searchRunCase,
    user,
    global,
    selectUserName:global.selectUserName,
  }),
  // @ts-ignore
)(SearchRunningCases);
