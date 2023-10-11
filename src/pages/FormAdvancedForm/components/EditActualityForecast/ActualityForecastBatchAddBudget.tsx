import React, {Component, ReactText } from 'react';
import {
  Button,
  Space, Spin, Table,
} from 'antd';
import styles from '@/pages/FormAdvancedForm/components/EditActualityForecast/style.less';
import {ConnectState, UserModelState} from "@/models/connect";
import { Dispatch } from '@@/plugin-dva/connect';
import {
  ActForecastTopData,
  FetchBudgetDtlType,
  DBudgetDtlType,
  FetchBatchSaveDateType, FetchBottomDataType, FetchCaseType,
} from "@/pages/FormAdvancedForm/data";
import { connect } from 'umi';
import 'moment/locale/zh-cn';
import formatUtil from "@/utils/formatUtil";
import {formatMessage} from "@@/plugin-locale/localeExports";

interface TableFormProps {
  dispatch: Dispatch;
  ActForecastData:ActForecastTopData;
  TopOnClose?: any;
  changeBugtId: any;
  user: UserModelState;
  nowMonth: string;
  btnStatus: Boolean;
  relatedNo: string;
  bugtId: string;
  busUserCd?: string;
  busUserNm?: string;
  cntrcCurrCd: string;
  cntrcCurrNm: string;
  effortUnitCd: string;
  effortUnitNm: string;
}

interface TableDataStates {
  searchLoading: boolean;
  bugtId:string;
  selectedRowKeys: ReactText[],
}

class ActualityForecastBatchAddBudget extends Component<TableFormProps, TableDataStates> {

  constructor(props: Readonly<TableFormProps>) {
    super(props);
      this.state = {
        // eslint-disab
        searchLoading: false,
        selectedRowKeys: [],
        bugtId:this.props.bugtId,
    };
  };


  setBugtId = (flag: string) => {
    this.props.changeBugtId(flag,this.state.bugtId);
  };

  getControl = (contrName: DBudgetDtlType[]) => {
    const name = contrName.map(item => [item.ankName]);
    let result = {};
    let finalResult=[];
    for(let i=0;i<name.length;i++){
      // @ts-ignore
      result[name[i]]=name[i];
    }
    for(let item in result) {
      finalResult.push(result[item]);
    }
    finalResult = finalResult.map(item => item.toString() === ''? ['','undefined']:[item.toString(),item.toString()]);
    return Array.from(
      finalResult.map(item => {
        const dataItem = {};
        [dataItem.text, dataItem.value] = item;
        return dataItem;
      }),);
  };

  async componentDidMount() {
    // @ts-ignore
    this.props.onRef('ActualityForecastBatchAddBudget',this);
    const {dispatch} = this.props;
    const language = this.props.user.currentUser?.dspLang;
    const inputUserCd = this.props.user.currentUser?.inputUserCds;
    const caseYear = this.props.user.currentUser?.dspYear;
    const fetchBudgetDtlType: FetchBudgetDtlType = {
      language,
      inputUserCd,
      caseYear,
    };
    const dbudgetDtlModel = JSON.stringify(fetchBudgetDtlType);
    await dispatch({
      type: 'ActForecastData/fetchBudgetDtl',
      payload: {
        dbudgetDtlModel,
      },
    });
    if (this.props.ActForecastData.dBudgetDtlDataList
      && this.props.ActForecastData.dBudgetDtlDataList.length > 0
      && this.props.bugtId) {

      for (let i = 0; i < this.props.ActForecastData.dBudgetDtlDataList.length; i+=1) {
        if (this.props.bugtId === this.props.ActForecastData.dBudgetDtlDataList[i].bugtId.toString()) {
          const keys: ReactText[] = [];
          keys.push(this.props.ActForecastData.dBudgetDtlDataList[i].bugtId);
          this.setState({
            selectedRowKeys: keys,
            bugtId:this.props.ActForecastData.dBudgetDtlDataList[i].bugtId.toString(),
          })
          break;
        }
      }
    };
  };

  onSelected = (selectedRowKeys: ReactText[]) => {
    if (selectedRowKeys.length < 1) {
      this.setState({
        selectedRowKeys,
        bugtId:'',
      });
    } else if (selectedRowKeys.length === 1) {
      this.setState({
        selectedRowKeys,
        bugtId:selectedRowKeys[0].toString(),
      });
    } else {
      let key: any = selectedRowKeys.pop();
      if (key === undefined) {
        key = '';
      }
      if (this.props.ActForecastData.dBudgetDtlDataList
        && this.props.ActForecastData.dBudgetDtlDataList.length > 0) {
        for (let i = 0; i < this.props.ActForecastData.dBudgetDtlDataList.length; i+=1) {
          if(key === this.props.ActForecastData.dBudgetDtlDataList[i].bugtId){
            this.setState({
              bugtId:this.props.ActForecastData.dBudgetDtlDataList[i].bugtId.toString(),
            })
            break;
          }
        }
      };
      this.setState({
        selectedRowKeys: [key],
      })
    }
  };

  batchSave = async() => {
    /**
     * データを挿入して、データベースを更新
     */
    const {dispatch} = this.props;

    const dateType: FetchBatchSaveDateType = {
      relatedNo: this.props.relatedNo,
      bugtId: this.state.bugtId,
      busActId: this.props.busActId,
    };

    const actForYear = this.props.user.currentUser?.dspYear;
    const actForMoth = this.props.nowMonth;
    const inputUserCd = this.props.user.currentUser?.inputUserCds;
    const language = this.props.user.currentUser?.dspLang;
    const actBottomParam: FetchBottomDataType = {actForYear, actForMoth, inputUserCd, language};
    const actForInfoSelectModel = JSON.stringify(actBottomParam);

    const orgGroupId = this.props.user.currentUser?.orgGroupId;
    const authOrgCd = this.props.user.currentUser?.authOrgCds;
    const caseYear = this.props.user.currentUser?.dspYear;
    const caseNm = '';
    const caseParam: FetchCaseType = {language, caseYear, orgGroupId, authOrgCd, inputUserCd, caseNm};
    const caseInfoModel = JSON.stringify(caseParam);

    const batchSaveDateModel = JSON.stringify(dateType);

    await dispatch({
      type: 'ActForecastData/budgetIdUpdate',
      payload: {
        batchSaveDateModel,
      },
      payload1: {
        actForInfoSelectModel,
      },
      payload2: {
        caseInfoModel,
      },
    });
  }


  /**
   * Top 画面关闭 确认关闭
   */
  closeAddPage = () => {
    this.props.TopOnClose();
  };

  render() {
    const columns = [
      {
        title: formatMessage({id: 'actualityForecastTop.tableHead.sales'}),
        dataIndex: 'saleDes',
        key: 'saleDes',
        width: '150px',
        fixed: 'left',
        render:(text:string, record:DBudgetDtlType) => {
          return <div className={styles.aBudgetDiv}>{text}</div>;
        },
      },
      {
        title: formatMessage({id: 'actualityForecastTop.tableHead.case'}),
        dataIndex: 'ankName',
        key: 'ankName',
        width: '150px',
        fixed: 'left',
        filters: (this.props.ActForecastData.dBudgetDtlDataList && this.props.ActForecastData.dBudgetDtlDataList.length>0) ? this.getControl(this.props.ActForecastData.dBudgetDtlDataList) : null,
        filterMultiple: false,
        onFilter: (value: any, record: any) => ((value === 'undefined'? (record.ankName ===''):(record.ankName === value))),
        render:(text:string, record:DBudgetDtlType) => {
          return <div className={styles.aBudgetDiv}>{text}</div>;
        },
      },
      {
        title: formatMessage({id: 'actualityForecastTop.tableHead.caseNumber'}),
        dataIndex: 'projId',
        key: 'projId',
        width: '100px',
        render:(text:string, record:DBudgetDtlType) => {
          return <div className={styles.aBudgetDiv}>{text}</div>;
        },
      },
      {
        title: formatMessage({id: 'actualityForecastTop.tableHead.BudgetYear'}),
        dataIndex: 'bugtYear',
        key: 'bugtYear',
        width: '100px',
        render:(text:string, record:DBudgetDtlType) => {
          return <div className={styles.aBudgetDiv}>{text}</div>;
        },
      },
      {
        title: formatMessage({id: 'runningCases.tableHead.businessCharge'}),
        dataIndex: 'userNm',
        key: 'userNm',
        width: '100px',
        render:(text:string, record:DBudgetDtlType) => {
          return <div className={styles.aBudgetDiv}>{text}</div>;
        },
      },
      {
        title: formatMessage({id: 'runningCases.tableHead.probability'}),
        dataIndex: 'rak',
        key: 'rak',
        width: '100px',
        render:(text:string, record:DBudgetDtlType) => {
          return <div className={styles.aBudgetDiv}>{text}</div>;
        },
      },
      {
        title: formatMessage({id: 'actualityForecastTop.tableHead.NewOld'}),
        dataIndex: 'newOld',
        key: 'newOld',
        width: '100px',
        render:(text:string, record:DBudgetDtlType) => {
          return <div className={styles.aBudgetDiv}>{text}</div>;
        },
      },
      {
        title: formatMessage({id: 'actualityForecastTop.tableHead.accountingDepartment'}) ,
        dataIndex: 'countOrg',
        key: 'countOrg',
        width: '220px',
        render:(text:string, record:DBudgetDtlType) => {
          if (record.countOrgCd) {
            const countOrg = record.countOrgCd.replace(",","　");
            return  <div className={styles.aBudgetDiv}>{countOrg}</div>;
          }
          return '';
        },
      },
      {
         title: formatMessage({id: 'actualityForecastTop.tableHead.price'}),
        children: [
          {
        title:   formatMessage({id: 'actualityForecastTop.tableHead.priceUnit'}),
            dataIndex: 'price',
            key: 'price',
            width: '120px',
            render:(text:string, record:DBudgetDtlType) => {
              return <div className={styles.amountDiv}>{record.price !== null ? formatUtil.thousandAmountFormat(Math.round(parseFloat(record.price)).toString()).toString() : ''}</div>;
            },
          },
          ]
      },
      {
        title: formatMessage({id: 'actualityForecastTop.tableHead.currency'}),
        dataIndex: 'currCd',
        key: 'currCd',
        width: '50px',
        render:(text:string, record:DBudgetDtlType) => {
          return <div className={styles.aBudgetDiv}>{text}</div>;
        },
      },
      {
        title: formatMessage({id: 'actualityForecastBottom.month.Jan'}),
        children: [
          {
            title: formatMessage({id: 'actualityForecastTop.tableHead.effort'}),
            dataIndex: 'effort1',
            key: 'effort1',
            width: '80px',
            render:(text:string, record:DBudgetDtlType) => {
              return (
                <div className={styles.effortDiv}>
                  {
                    (record.effort1 && record.effort1.toString() !=='0.00') ?(
                        <Space size={3}>
                          {formatUtil.thousandEffortFormat((parseFloat(record.effort1)).toFixed(2).toString()).toString()}
                          {record.effortUnitCd}
                        </Space>)
                      :
                      <div>-</div>
                  }
                </div>
              );
            },
          },
          {
            title: formatMessage({id: 'common.basic.amount'}),
            dataIndex: 'amt1',
            key: 'amt1',
            width: '80px',
            render:(text:string, record:DBudgetDtlType) => {
              return <div className={styles.amountDiv}>{record.amt1 !== null ? formatUtil.thousandAmountFormat(Math.round(parseFloat(record.amt1)).toString()).toString() : ''}</div>;
            },
          },
        ],
      },
      {
        title: formatMessage({id: 'actualityForecastBottom.month.Feb'}),
        children: [
          {
            title: formatMessage({id: 'actualityForecastTop.tableHead.effort'}),
            dataIndex: 'effort2',
            key: 'effort2',
            width: '80px',
            render:(text:string, record:DBudgetDtlType) => {
              return (
                <div className={styles.effortDiv}>
                  {
                    (record.effort2 && record.effort2.toString() !=='0.00') ?(
                        <Space size={3}>
                          {formatUtil.thousandEffortFormat((parseFloat(record.effort2)).toFixed(2).toString()).toString()}
                          {record.effortUnitCd}
                        </Space>)
                      :
                      <div>-</div>
                  }
                </div>
              );
            },
          },
          {
            title: formatMessage({id: 'common.basic.amount'}),
            dataIndex: 'amt2',
            key: 'amt2',
            width: '80px',
            render:(text:string, record:DBudgetDtlType) => {
              return <div className={styles.amountDiv}>{record.amt2 !== null ? formatUtil.thousandAmountFormat(Math.round(parseFloat(record.amt2)).toString()).toString() : ''}</div>;
            },
          },
        ],
      },
      {
        title: formatMessage({id: 'actualityForecastBottom.month.Mar'}),
        children: [
          {
            title: formatMessage({id: 'actualityForecastTop.tableHead.effort'}),
            dataIndex: 'effort3',
            key: 'effort3',
            width: '80px',
            render:(text:string, record:DBudgetDtlType) => {
              return (
                <div className={styles.effortDiv}>
                  {
                    (record.effort3 && record.effort3.toString() !=='0.00') ?(
                        <Space size={3}>
                          {formatUtil.thousandEffortFormat((parseFloat(record.effort3)).toFixed(2).toString()).toString()}
                          {record.effortUnitCd}
                        </Space>)
                      :
                      <div>-</div>
                  }
                </div>
              );
            },
          },
          {
            title: formatMessage({id: 'common.basic.amount'}),
            dataIndex: 'amt3',
            key: 'amt3',
            width: '80px',
            render:(text:string, record:DBudgetDtlType) => {
              return <div className={styles.amountDiv}>{record.amt3 !== null ? formatUtil.thousandAmountFormat(Math.round(parseFloat(record.amt3)).toString()).toString() : ''}</div>;
            },
          },
        ],
      },
      {
        title: formatMessage({id: 'actualityForecastBottom.month.Apr'}),
        children: [
          {
            title: formatMessage({id: 'actualityForecastTop.tableHead.effort'}),
            dataIndex: 'effort4',
            key: 'effort4',
            width: '80px',
            render:(text:string, record:DBudgetDtlType) => {
              return (
                <div className={styles.effortDiv}>
                  {
                    (record.effort4 && record.effort4.toString() !=='0.00') ?(
                        <Space size={3}>
                          {formatUtil.thousandEffortFormat((parseFloat(record.effort4)).toFixed(2).toString()).toString()}
                          {record.effortUnitCd}
                        </Space>)
                      :
                      <div>-</div>
                  }
                </div>
              );
            },
          },
          {
            title: formatMessage({id: 'common.basic.amount'}),
            dataIndex: 'amt4',
            key: 'amt4',
            width: '80px',
            render:(text:string, record:DBudgetDtlType) => {
              return <div className={styles.amountDiv}>{record.amt4 !== null ? formatUtil.thousandAmountFormat(Math.round(parseFloat(record.amt4)).toString()).toString() : ''}</div>;
            },
          },
        ],
      },
      {
        title: formatMessage({id: 'actualityForecastBottom.month.May'}),
        children: [
          {
            title: formatMessage({id: 'actualityForecastTop.tableHead.effort'}),
            dataIndex: 'effort5',
            key: 'effort5',
            width: '80px',
            render:(text:string, record:DBudgetDtlType) => {
              return (
                <div className={styles.effortDiv}>
                  {
                    (record.effort5 && record.effort5.toString() !=='0.00') ?(
                        <Space size={3}>
                          {formatUtil.thousandEffortFormat((parseFloat(record.effort5)).toFixed(2).toString()).toString()}
                          {record.effortUnitCd}
                        </Space>)
                      :
                      <div>-</div>
                  }
                </div>
              );
            },
          },
          {
            title: formatMessage({id: 'common.basic.amount'}),
            dataIndex: 'amt5',
            key: 'amt5',
            width: '80px',
            render:(text:string, record:DBudgetDtlType) => {
              return <div className={styles.amountDiv}>{record.amt5 !== null ? formatUtil.thousandAmountFormat(Math.round(parseFloat(record.amt5)).toString()).toString() : ''}</div>;
            },
          },
        ],
      },
      {
        title: formatMessage({id: 'actualityForecastBottom.month.Jun'}),
        children: [
          {
            title: formatMessage({id: 'actualityForecastTop.tableHead.effort'}),
            dataIndex: 'effort6',
            key: 'effort6',
            width: '80px',
            render:(text:string, record:DBudgetDtlType) => {
              return (
                <div className={styles.effortDiv}>
                  {
                    (record.effort6 && record.effort6.toString() !=='0.00') ?(
                        <Space size={3}>
                          {formatUtil.thousandEffortFormat((parseFloat(record.effort6)).toFixed(2).toString()).toString()}
                          {record.effortUnitCd}
                        </Space>)
                      :
                      <div>-</div>
                  }
                </div>
              );
            },
          },
          {
            title: formatMessage({id: 'common.basic.amount'}),
            dataIndex: 'amt6',
            key: 'amt6',
            width: '80px',
            render:(text:string, record:DBudgetDtlType) => {
              return <div className={styles.amountDiv}>{record.amt6 !== null ? formatUtil.thousandAmountFormat(Math.round(parseFloat(record.amt6)).toString()).toString() : ''}</div>;
            },
          },
        ],
      },
      {
        title: formatMessage({id: 'actualityForecastBottom.month.Jul'}),
        children: [
          {
            title: formatMessage({id: 'actualityForecastTop.tableHead.effort'}),
            dataIndex: 'effort7',
            key: 'effort7',
            width: '80px',
            render:(text:string, record:DBudgetDtlType) => {
              return (
                <div className={styles.effortDiv}>
                  {
                    (record.effort7 && record.effort7.toString() !=='0.00') ?(
                        <Space size={3}>
                          {formatUtil.thousandEffortFormat((parseFloat(record.effort7)).toFixed(2).toString()).toString()}
                          {record.effortUnitCd}
                        </Space>)
                      :
                      <div>-</div>
                  }
                </div>
              );
            },
          },
          {
            title: formatMessage({id: 'common.basic.amount'}),
            dataIndex: 'amt7',
            key: 'amt7',
            width: '80px',
            render:(text:string, record:DBudgetDtlType) => {
              return <div className={styles.amountDiv}>{record.amt7 !== null ? formatUtil.thousandAmountFormat(Math.round(parseFloat(record.amt7)).toString()).toString() : ''}</div>;
            },
          },
        ],
      },
      {
        title: formatMessage({id: 'actualityForecastBottom.month.Aug'}),
        children: [
          {
            title: formatMessage({id: 'actualityForecastTop.tableHead.effort'}),
            dataIndex: 'effort8',
            key: 'effort8',
            width: '80px',
            render:(text:string, record:DBudgetDtlType) => {
              return (
                <div className={styles.effortDiv}>
                  {
                    (record.effort8 && record.effort8.toString() !=='0.00') ?(
                        <Space size={3}>
                          {formatUtil.thousandEffortFormat((parseFloat(record.effort8)).toFixed(2).toString()).toString()}
                          {record.effortUnitCd}
                        </Space>)
                      :
                      <div>-</div>
                  }
                </div>
              );
            },
          },
          {
            title: formatMessage({id: 'common.basic.amount'}),
            dataIndex: 'amt8',
            key: 'amt8',
            width: '80px',
            render:(text:string, record:DBudgetDtlType) => {
              return <div className={styles.amountDiv}>{record.amt8 !== null ? formatUtil.thousandAmountFormat(Math.round(parseFloat(record.amt8)).toString()).toString() : ''}</div>;
            },
          },
        ],
      },
      {
        title: formatMessage({id: 'actualityForecastBottom.month.Sept'}),
        children: [
          {
            title: formatMessage({id: 'actualityForecastTop.tableHead.effort'}),
            dataIndex: 'effort9',
            key: 'effort9',
            width: '80px',
            render:(text:string, record:DBudgetDtlType) => {
              return (
                <div className={styles.effortDiv}>
                  {
                    (record.effort9 && record.effort9.toString() !=='0.00') ?(
                        <Space size={3}>
                          {formatUtil.thousandEffortFormat((parseFloat(record.effort9)).toFixed(2).toString()).toString()}
                          {record.effortUnitCd}
                        </Space>)
                      :
                      <div>-</div>
                  }
                </div>
              );
            },
          },
          {
            title: formatMessage({id: 'common.basic.amount'}),
            dataIndex: 'amt9',
            key: 'amt9',
            width: '80px',
            render:(text:string, record:DBudgetDtlType) => {
              return <div className={styles.amountDiv}>{record.amt9 !== null ? formatUtil.thousandAmountFormat(Math.round(parseFloat(record.amt9)).toString()).toString() : ''}</div>;
            },
          },
        ],
      },
      {
        title: formatMessage({id: 'actualityForecastBottom.month.Oct'}),
        children: [
          {
            title: formatMessage({id: 'actualityForecastTop.tableHead.effort'}),
            dataIndex: 'effort10',
            key: 'effort10',
            width: '80px',
            render:(text:string, record:DBudgetDtlType) => {
              return (
                <div className={styles.effortDiv}>
                  {
                    (record.effort10 && record.effort10.toString() !=='0.00') ?(
                        <Space size={3}>
                          {formatUtil.thousandEffortFormat((parseFloat(record.effort10)).toFixed(2).toString()).toString()}
                          {record.effortUnitCd}
                        </Space>)
                      :
                      <div>-</div>
                  }
                </div>
              );
            },
          },
          {
            title: formatMessage({id: 'common.basic.amount'}),
            dataIndex: 'amt10',
            key: 'amt10',
            width: '80px',
            render:(text:string, record:DBudgetDtlType) => {
              return <div className={styles.amountDiv}>{record.amt10 !== null ? formatUtil.thousandAmountFormat(Math.round(parseFloat(record.amt10)).toString()).toString() : ''}</div>;
            },
          },
        ],
      },
      {
        title: formatMessage({id: 'actualityForecastBottom.month.Nov'}),
        children: [
          {
            title: formatMessage({id: 'actualityForecastTop.tableHead.effort'}),
            dataIndex: 'effort11',
            key: 'effort11',
            width: '80px',
            render:(text:string, record:DBudgetDtlType) => {
              return (
                <div className={styles.effortDiv}>
                  {
                    (record.effort11 && record.effort11.toString() !=='0.00') ?(
                        <Space size={3}>
                          {formatUtil.thousandEffortFormat((parseFloat(record.effort11)).toFixed(2).toString()).toString()}
                          {record.effortUnitCd}
                        </Space>)
                      :
                      <div>-</div>
                  }
                </div>
              );
            },
          },
          {
            title: formatMessage({id: 'common.basic.amount'}),
            dataIndex: 'amt11',
            key: 'amt11',
            width: '80px',
            render:(text:string, record:DBudgetDtlType) => {
              return <div className={styles.amountDiv}>{record.amt11 !== null ? formatUtil.thousandAmountFormat(Math.round(parseFloat(record.amt11)).toString()).toString() : ''}</div>;
            },
          },
        ],
      },
      {
        title: formatMessage({id: 'actualityForecastBottom.month.Dec'}),
        children: [
          {
            title: formatMessage({id: 'common.basic.effort'}),
            dataIndex: 'effort12',
            borderTop: '1px solid #e0e0e0',
            key: 'effort12',
            width: '80px',
            render:(text:string, record:DBudgetDtlType) => {
              return (
                <div className={styles.effortDiv}>
                  {
                    (record.effort12 && record.effort12.toString() !=='0.00') ?(
                        <Space size={3}>
                          {formatUtil.thousandEffortFormat((parseFloat(record.effort12)).toFixed(2).toString()).toString()}
                          {record.effortUnitCd}
                        </Space>)
                      :
                      <div>-</div>
                  }
                </div>
              );
            },
          },
          {
            title: formatMessage({id: 'common.basic.amount'}),
            dataIndex: 'amt12',
            borderTop: '1px solid #e0e0e0',
            key: 'amt12',
            width: '80px',
            render:(text:string, record:DBudgetDtlType) => {
              return <div className={styles.amountDiv}>{record.amt12 !== null ?
                formatUtil.thousandAmountFormat(Math.round(parseFloat(record.amt12)).toString()).toString() : ''}</div>;
            },
          },
        ],
      },
    ];
    return (
      <Spin spinning={this.state.searchLoading}>
        <div className={styles.topHeight}>
          <Table
            className={styles.budgetTable}
            columns={columns}
            dataSource={this.props.ActForecastData.dBudgetDtlDataList}
            pagination={false}
            rowKey="bugtId"
            rowSelection={{
              selectedRowKeys: this.state.selectedRowKeys,
              type: 'checkbox',
              columnTitle: formatMessage({id: 'actualityForecastTop.tableHead.select'}),
              columnWidth: '50px',
              onChange: (selectedRowKeys: ReactText[]) => {
                this.onSelected(selectedRowKeys);
              },
            }}
            scroll={{y: '175px'}}
          />
        </div>
        <div style={{marginLeft: 400}}>
          {this.props.btnStatus===false ? '':
            <Button
              onClick={() => {
                // @ts-ignore
                this.batchSave();
                this.props.TopOnClose();
              }}
              type="primary"
              className={styles.addButton}
              style={{ float: 'right', marginTop:'8px'  }}
            >
              {formatMessage({ id: 'actualityForecastTop.button.save' })}
            </Button>
          }
        </div>
      </Spin>
    );
  }
}

export default connect(
  ({
     ActForecastData,
     user,
   }: {
     ActForecastData: any;
     user: ConnectState;
     },
     ) => ({
      ActForecastData,
      user,
  }),
  // @ts-ignore
)(ActualityForecastBatchAddBudget);
