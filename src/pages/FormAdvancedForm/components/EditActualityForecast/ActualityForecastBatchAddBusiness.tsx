import {
  Table,
  Button,
  Spin,
  AutoComplete,
  Select,
  DatePicker,
  Form,
  Space,
  Tooltip,
  Checkbox,
  message,
  Modal,
} from 'antd';
import React, {Component, ReactText} from 'react';
import { PlusOutlined ,CheckOutlined,CloseOutlined} from '@ant-design/icons';
import styles from '@/pages/FormAdvancedForm/components/EditActualityForecast/style.less';
import {formatMessage} from "@@/plugin-locale/localeExports";
import {
  ActForecastTopData,
  AllCustomerType,
  AllEndUserType,
  CustomerType,
  DBusActDtl,
  EndUserType,
  FetchBudgetDtlType,
  OptionType,
  UserType,
  CodeValueType,
  FetchBatchSaveDateType, FetchBottomDataType, FetchCaseType,
} from "@/pages/FormAdvancedForm/data";
import {Dispatch} from "@@/plugin-dva/connect";
import {ConnectState, UserModelState} from "@/models/connect";
import { connect } from 'umi';
import CustomerInfo from "@/components/CustomerInfo/CustomerInfo";
import EndUserInfo from "@/components/EndUserInfo/EndUserInfo";
import {CheckboxChangeEvent} from "antd/es/checkbox";
import moment from "moment";
const { Option } = Select;

// 追加ボタンをクリック
let isClickable = true;

// 現在の行数
let columnsNum: number;

// 画面データを保存
let formData: DBusActDtl[];

interface ActualityForecastBatchAddBusinessProps {
  dispatch: Dispatch;
  ActForecastData:ActForecastTopData;
  changeBusiness:any,
  changeIsClickable:any,
  TopOnClose?: any;
  user: UserModelState;
  nowMonth: string;
  relatedNo: string;
  busActId: string;
  caseNm: string;
  cstmrNm: string;
  endUserNm: string;
  busUserCd?: string;
  busUserNm?: string;
  userLst: UserType[];
  caseLst: [];
  customerLst: CustomerType[];
  endUserLst: EndUserType[];
  allCustomerLst: AllCustomerType[];
  allEndUserLst:AllEndUserType[];
  codeValueList: CodeValueType[];
  btnStatus: Boolean;
}

interface TableDataStates {
  busActId: string,
  batchAddBusinessData: DBusActDtl[];
  searchLoading: boolean;
}

class ActualityForecastBatchAddBusiness extends Component<ActualityForecastBatchAddBusinessProps, TableDataStates> {
  constructor(props: Readonly<ActualityForecastBatchAddBusinessProps>) {
    super(props);
    this.state = {
      searchLoading: false,
      busActId: props.busActId,
    };
  }

  componentDidMount() {
    // @ts-ignore
    this.props.onRef('ActualityForecastBatchAddBusiness',this);
    this.fetchBudget();
  };

  fetchBudget= async () => {
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
      type: 'ActForecastData/fetchDBusActDtl',
      payload: {
        dbudgetDtlModel,
      },
    });

    if (this.props.ActForecastData.dBusActDtlList
      && this.props.ActForecastData.dBusActDtlList.length > 0
      && this.state.busActId) {

      for (let i = 0; i < this.props.ActForecastData.dBusActDtlList.length; i+=1) {
        if (this.state.busActId === this.props.ActForecastData.dBusActDtlList[i].busActId.toString()) {
          this.props.ActForecastData.dBusActDtlList[i].checked = true;
          this.setState({
            busActId:this.props.ActForecastData.dBusActDtlList[i].busActId.toString(),
          })
        }else{
          this.props.ActForecastData.dBusActDtlList[i].checked = false;
        }
      }
      this.setState({
        // selectedRowKeys: keys,
        batchAddBusinessData:this.props.ActForecastData.dBusActDtlList,
      })

    };
  }

  static getDerivedStateFromProps(nextProps: ActualityForecastBatchAddBusinessProps, prevState: TableDataStates) {
    if (nextProps.ActForecastData.dBusActDtlList) {
      const formDataParam: DBusActDtl[] = nextProps.ActForecastData.dBusActDtlList.filter((item) => item.editable === true)
      if (formDataParam.length > 0) {
        isClickable = false;
      } else {
        isClickable = true;
      }
    } else {
      isClickable = true;
    }

    if (isClickable) {
      if (nextProps.ActForecastData.dBusActDtlList !== prevState.batchAddBusinessData) {
        if (nextProps.ActForecastData.dBusActDtlList) {
          const nowColumnsNum = nextProps.ActForecastData.dBusActDtlList.length;
          columnsNum = nowColumnsNum;
        } else {
          columnsNum = 0;
        }
        formData = nextProps.ActForecastData.dBusActDtlList;
        if (nextProps.ActForecastData.dBusActDtlList
          && nextProps.ActForecastData.dBusActDtlList.length > 0
          && nextProps.busActId) {

          for (let i = 0; i < nextProps.ActForecastData.dBusActDtlList.length; i+=1) {
            if (nextProps.busActId === nextProps.ActForecastData.dBusActDtlList[i].busActId.toString()) {
              formData[i].checked = true;
              // break;
            }else{
              formData[i].checked = false;
            }
          }

        };
        return {
          batchAddBusinessData: formData,
          searchLoading: nextProps.ActForecastData.setSearchLoading.searchLoading,
        }
      }
    }
    return {
      searchLoading: nextProps.ActForecastData.setSearchLoading.searchLoading,
    }
  };

    getControl = (contrName: DBusActDtl[]) => {
      const name = contrName.map(item => [item.caseNm]);
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

  /**
   * 選択ボックスでデータを選択
   * @param e: 変更後の値
   * @param index データの索引
   */
  checkBoxChange = (e: CheckboxChangeEvent, record: DBusActDtl) => {
    for(let i =0;i<formData.length;i+=1){
      formData[i].checked = false;
    }
    const index = record.key - 1;
    formData[index].checked = e.target.checked;
    if(e.target.checked) {
      this.setState({
        busActId: formData[index].busActId,
        batchAddBusinessData: formData,
      });
    } else {
      this.setState({
        busActId: '',
        batchAddBusinessData: formData,
      });
    }

  };

  setBusActId = (flag:string) => {
    this.props.changeBusiness(flag,this.state.busActId);
  };

  setChangeIsClickable = (clickable:boolean) => {
    this.props.changeIsClickable(clickable);
  };

    /**
     * データを追加
     */
    newMember = async() => {
      const {dispatch,codeValueList} = this.props;
      isClickable = false;
      columnsNum += 1;
      let defaultCdNm = '';
      let defaultCd = '';
      if (codeValueList && codeValueList.length > 0) {
        // @ts-ignore
        const listBak = codeValueList.filter((item) => item.cdNm !== null && item.cdNm !== '' && item.cdVal=== '1');
        if(listBak && listBak.length>0){
          defaultCdNm = listBak[0].cdNm;
          defaultCd = listBak[0].cdVal;
        }
      }
      await dispatch({
        type: 'BusinessActivities/fetchCodeValueList',
        payload: true
      })
      const newData: DBusActDtl = {
        key: columnsNum,
        checked: false,
        editable: true,
        busActId: '',
        cstmrNm: this.props.cstmrNm,
        endUserNm: this.props.endUserNm,
        caseNm: this.props.caseNm,
        caseCreatedDt:moment(new Date()).format('YYYY-MM-DD').toString(),
        busActStsCd: defaultCd,
        cdNm: defaultCdNm,
        busUserCd: this.props.busUserCd,
        userNm: this.props.busUserNm,
      };
      if (formData === null || formData === undefined) {
        formData = [];
      }
      const newFormData = formData.concat(newData);
      formData.push(newData);
      this.setState({
        batchAddBusinessData: newFormData,
      });
      if (this.props.btnStatus===false) {
        this.setChangeIsClickable(false);
      };
    };

  onRef = (name:string,ref:any) => {
    switch (name) {
      case 'CustomerInfo':
        this.customerInfo = ref
        break
      case 'EndUserInfo':
        this.endUserInfo = ref
        break
      default:
        break
    }
  }

  caseChange = async (e: string, index: number) => {
    if (e !== undefined && e !== null && e.toString() !== '') {
      if(e.length > 100) {
        message.error(formatMessage({ id: 'common.message.caseNmLength' }));
        return;
      }
      formData[index].caseNm = e.toString();
      this.setState({
        batchAddBusinessData: formData,
      });
    }else {
      formData[index].caseNm = '';
      this.setState({
        batchAddBusinessData: formData,
      });
    }
  }

  /**
   *  Model 开始日变更
   * @param date moment类型日期
   * @param dateString string类型的日期
   */
    // @ts-ignore
  dataChange = (date: moment, dateString: string) => {
    // 仅可以输入当前年
    formData[columnsNum-1].caseCreatedDt = dateString;
    this.setState({
      batchAddBusinessData: formData,
    });
  };

  /**
   * Input User 变更方法
   * @param e: 变更后的值
   */
  onInputUserChange = (value:string, e: { key: any; })=>{
    if (value === null || value === undefined){
      value = "";
    }
    formData[columnsNum-1].busUserCd = e.key;
    formData[columnsNum-1].userNm =  e.value;
    this.setState({
      batchAddBusinessData: formData,
    });
  }

  /**
   * Staff charge 变更方法
   * @param e: 变更后的值
   */
  onStatusChange = (value: CodeValueType,e: { key: any; })=>{
    if (value === null || value === undefined){
      value = "";
    }
    formData[columnsNum-1].busActStsCd = e.key;
    formData[columnsNum-1].cdNm = e.value;
    this.setState({
      batchAddBusinessData: formData,
    });
  }

  handleCustomer= (cstmrCds:string,cstmrNms:string,caseNms:string,index:number) => {
    formData[index].cstmrNm = cstmrNms;
    this.setState({
      batchAddBusinessData: formData,
    });
  }

  handleEndUser= (endUserCds:string,endUserNms:string,index:number) => {
    formData[index].endUserNm = endUserNms;
    this.setState({
      batchAddBusinessData: formData,
    });
  }

  /**
   * 操作をキャンセル
   */
  cancel = () => {
    this.fetchBudget();
    if (this.props.btnStatus===false) {
      this.setChangeIsClickable(true);
    };
  }

  /**
   * データを保存
   * @param record データ
   * @param index データの索引
   */
  save =async (record: DBusActDtl, index: number) => {

    // 各个字段不为空
    if (null === record.caseNm || "" === record.caseNm || undefined === record.caseNm) {
      message.info(formatMessage({id: 'actualityForecastBottom.message.case'}));
      return;
    }else if (record.caseNm.length>100){
      message.info(formatMessage({id: 'common.message.caseNmLength'}));
      return;
    }
    if (null === record.cstmrNm || "" === record.cstmrNm || undefined === record.cstmrNm) {
      message.info(formatMessage({id: 'actualityForecastBottom.message.customer'}));
      return;
    }else if (record.cstmrNm.length>100){
      message.info(formatMessage({id: 'actualityForecastTop.message.input.customer'}));
      return;
    }
    if (null === record.endUserNm || "" === record.endUserNm || undefined === record.endUserNm) {
      message.info(formatMessage({id: 'actualityForecastBottom.message.endUser'}));
      return;
    }else if (record.endUserNm.length>100){
      message.info(formatMessage({id: 'actualityForecastTop.message.input.endUserNmLength'}));
      return;
    }

    if (null === record.caseCreatedDt || "" === record.caseCreatedDt || undefined === record.caseCreatedDt) {
      message.info(formatMessage({id: 'actualityForecastTop.message.input.createDate'}));
      return;
    }

    if (null === record.cdNm || "" === record.cdNm || undefined === record.cdNm) {
      message.info(formatMessage({id: 'actualityForecastTop.message.input.status'}));
      return;
    }
    if (null === record.userNm || "" === record.userNm || undefined === record.userNm) {
      message.info(formatMessage({id: 'actualityForecastBottom.message.busUserNm'}));
      return;
    }


    /**
       * データを挿入して、データベースを更新
       */
      const {dispatch} = this.props;
      record.strCaseCreatedDt = record.caseCreatedDt;
      const dbusActHeadDtlModel = JSON.stringify(record);

      await dispatch({
        type: 'ActForecastData/insertActForecastBusinessData',
        payload: dbusActHeadDtlModel,
      });

      this.fetchBudget();
      if (this.props.btnStatus===false) {
        this.setChangeIsClickable(true);
      };
  };

  batchSave = () => {
    /**
     * データを挿入して、データベースを更新
     */
    const {dispatch} = this.props;

    const dateType: FetchBatchSaveDateType = {
      relatedNo: this.props.relatedNo,
      bugtId: this.props.bugtId,
      busActId: this.state.busActId,
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

    dispatch({
      type: 'ActForecastData/businessActivitiesIdUpdate',
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
    this.setState({
      searchLoading: false,
      batchAddBusinessData:[],
      busActId: '',
    });
    this.props.ActForecastData.dBusActDtlList = undefined;
    this.props.TopOnClose();
  };

  // filterConfirmClick = () => {
  //   isClickable = false;
  // };
  // filterResetClick = () => {
  //   isClickable = true;
  // };

    render()
    {
      const {
        userLst,
        customerLst,
        endUserLst,
        caseLst,
        allCustomerLst,
        allEndUserLst,
        codeValueList,
      } = this.props;

      // エンドユーザー option Valueを取得
      const endUserOptions: OptionType[] = [];
      if(endUserLst!==null && endUserLst.length>0){
        endUserLst.forEach((item) => {
          if (item.endUserNm !== null && item.endUserNm !== '') {
            const optionItem: OptionType = {
              value: item.endUserNm,
            };
            endUserOptions.push(optionItem);
          }
        });
      }else{
        const optionItem: OptionType = {
          value: '',
        };
        endUserOptions.push(optionItem);
      };

      // 営業 option Valueを取得
      const getUserOption = (list: UserType[]) => {
        if (!list || list.length < 1) {
          return (
            <Option key={0} value={0}>
              {formatMessage({ id: 'common.message.noSelect' })}
            </Option>
          );
        }
        const listBak = list.filter((item)=>item.userNm !== null && item.userNm !== '');

        return listBak.map((item) => (
          <Option key={item.userCd} value={item.userNm}>
            {item.userNm}
          </Option>
        ));
      };

      const getStatusOption = (list: CodeValueType[]) => {
        if (!list || list.length < 1) {
          return (
            // @ts-ignore
            <Option key={0} value={0}>
              {formatMessage({ id: 'common.message.noSelect' })}
            </Option>
          );
        }
        // @ts-ignore
        const listBak = list.filter((item) => item.cdNm !== null && item.cdNm !== '');
        return listBak.map((item) => (
          // @ts-ignore
          <Option key={item.cdVal} value={item.cdNm}>
            {item.cdNm}
          </Option>
        ));
      };




      const caseOptions: OptionType[] = [];
      if (caseLst  && caseLst.name !== null && caseLst.name !=='' && caseLst.name !== undefined  && caseLst.name.length > 0) {
              caseLst.name.forEach((item) => {
                if (item.caseNm !== null && item.caseNm !== '') {
                  const optionItem: OptionType = {
                    value: item.caseNm,
                  };
                  caseOptions.push(optionItem);
                }
              });
            } else {
              const optionItem: OptionType = {
                value: '',
              };
              caseOptions.push(optionItem);
            }
          if(caseOptions.length === 0){
            const optionItem: OptionType = {
              value: '',
            };
            caseOptions.push(optionItem);
        }


      var inputs = document.getElementsByTagName("input");

      const columns = [
        {
          title:  formatMessage({id: 'actualityForecastTop.tableHead.select'}),
          dataIndex: 'action',
          key: 'action',
          width: '50px',
          render: (text: string, record: DBusActDtl, index: number) => {
            if (record.editable) {
              return (
                <div className={styles.actionDiv}>
                  <Space size={1}>
                    <CheckOutlined onClick={() => this.save(record, index)} />
                    <CloseOutlined onClick={() => this.cancel()} />
                  </Space>
                </div>
              );
            }
            return (
              <div className={styles.actionDiv}>
                <div className={styles.ButtonIcon}>
                      <Checkbox
                        defaultChecked={false}
                        disabled={!isClickable}
                        checked={record.checked}
                        onChange={(e) => this.checkBoxChange(e, record)}
                      />
                </div>
              </div>
            );
          }
        },
        {
          title: formatMessage({id: 'actualityForecastTop.tableHead.case'}),
          dataIndex: 'caseNm',
          key: 'caseNm',
          filters: this.state.batchAddBusinessData && this.state.batchAddBusinessData.length > 0 ? this.getControl(this.state.batchAddBusinessData) : null,
          filterDropdownVisible: !isClickable? false:'',
          filterMultiple: false,
          onFilter: (value: any, record: any) => ((value === 'undefined'? (record.caseNm ==='' || record.editable):(record.caseNm === value || record.editable))),
          render: (text: string, record: DBusActDtl, index: number) => {
            if (record.editable) {
              return (
                <AutoComplete
                  className={styles.select}
                  dropdownMatchSelectWidth={220}
                  defaultValue={record.caseNm}
                  value={record.caseNm}
                  autoFocus
                  onChange={(e) => this.caseChange(e, index)}
                  // @ts-ignore
                  onSelect={(e) => this.caseChange(e, index)}
                  allowClear
                  options={caseOptions}
                  filterOption={(inputValue, option) =>
                    // @ts-ignore
                    option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                  }
                />
              );
            }
            return record.caseNm;
          },
        },
        {
          title: formatMessage({id: 'actualityForecastTop.tableHead.customer'}),
          dataIndex: 'cstmrNm',
          key: 'cstmrNm',
          render: (text: string, record: DBusActDtl, index: number) => {
            if (record.editable) {
              return (
                <CustomerInfo
                  cstmrNm={record.cstmrNm}
                  customerLst={customerLst}
                  allCustomerLst={allCustomerLst}
                  caseLst={[]}
                  index={index}
                  itemNm={formatMessage({ id: 'actualityForecastTop.tableHead.customer' })}
                  checkLength={100}
                  caseFlag="1"
                  styleFlag="0"
                  onRef={this.onRef}
                  handleCustomer={this.handleCustomer.bind(this)}
                />
              );
            }
            return record.cstmrNm;
          },
        },
        {
          title: formatMessage({id: 'actualityForecastTop.tableHead.endUser'}),
          dataIndex: 'endUserNm',
          key: 'endUserNm',
          render: (text: string, record: DBusActDtl, index: number) => {
            if (record.editable) {
              return (
                <EndUserInfo
                  endUserNm={record.endUserNm}
                  endUserLst={endUserLst}
                  allEndUserLst={allEndUserLst}
                  index={index}
                  itemNm={formatMessage({ id: 'actualityForecastTop.tableHead.endUser' })}
                  checkLength={100}
                  styleFlag="0"
                  onRef={this.onRef}
                  handleEndUser={this.handleEndUser.bind(this)}
                />
              );
            }
            return record.endUserNm;
          },
        },
        {
          title: formatMessage({id: 'common.business.activities.createDate'}),
          dataIndex: 'caseCreatedDt',
          key: 'caseCreatedDt',
          width: '150px',
          render: (text: string, record: DBusActDtl, index: number) => {
            if (record.editable) {
              return (
              <DatePicker
                className={styles.activitiesSearchItem}
                id="fromDate"
                onChange={this.dataChange}
                defaultValue={moment(record.caseCreatedDt, "YYYY-MM-DD")}
                format="YYYY-MM-DD"
              />
              );
            }
            return record.caseCreatedDt;
          },
        },
        {
          title: formatMessage({id: 'common.business.activities.status'}),
          dataIndex: 'cdNm',
          key: 'cdNm',
          width: '150px',
          render: (text: string, record: DBusActDtl, index: number) => {
            if (record.editable) {
              return (
              <Select
                className={styles.activitiesSearchItem}
                value={record.cdNm}
                // @ts-ignore
                onChange={this.onStatusChange}>
                {getStatusOption(codeValueList)}
              </Select>
              );
            }
            return record.cdNm;
          },
        },
        {
          title: formatMessage({id: 'common.business.activities.staff'}),
          dataIndex: 'userNm',
          key: 'userNm',
          width: '150px',
          render: (text: string, record: DBusActDtl, index: number  ) => {
            if (record.editable) {
              return (
                <Select
                  className={styles.activitiesSearchItem}
                  // defaultValue={ this.props.busUserNm}
                  value={ record.userNm}
                  onChange={this.onInputUserChange}
                >
                  {getUserOption(userLst)}
                </Select>
              );
            }
            return text;
          },
        },
      ];
      return (
        <Spin spinning={this.state.searchLoading}>
        <div className={styles.topHeight}>
          <span style={{color: 'blue'}}>{formatMessage({id: 'actualityForecastTop.message.comment'})}</span>
          <Table
            className={styles.businessTable}
            columns={columns}
            dataSource={this.state.batchAddBusinessData}
            pagination={false}
            rowKey="busActId"
            scroll={{y: '155px'}}
          />
          <Button
            style={{width: '97vw', marginTop: 6, marginBottom: 0}}
            type="dashed"
            onClick={this.newMember}
            disabled={!isClickable}
          >
            <PlusOutlined/>
          </Button>
        </div>
          <div style={{marginLeft: 400}}>
            {this.props.btnStatus===false ? '':
              <Button
                onClick={() => {
                  // @ts-ignore
                  this.batchSave();
                  this.closeAddPage();
                }}
                disabled={!isClickable}
                type="primary"
                className={styles.addButton}
                style={{ float: 'right', marginTop:'8px' }}
              >
                {formatMessage({ id: 'actualityForecastTop.button.save' })}
              </Button>
            }
          </div>
        </Spin>
      );
    }
};


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
)(ActualityForecastBatchAddBusiness);
