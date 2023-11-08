import React, { Component } from 'react';
import {FetchCaseType, FormatNameType, golbalParamReportModel, ReportData, ReportInfoModel} from "../data";
import {connect} from "umi";
import {ConnectState, GlobalModelState, UserModelState} from "@/models/connect";
import {Dispatch} from "@@/plugin-dva/connect";
import Report from "@/components/Report/index";
import styles from "./style.less";
import {Card, Select, Space, Spin} from "antd";
import {formatMessage} from "@@/plugin-locale/localeExports";

const { Option } = Select;

interface ReportProps {
  dispatch: Dispatch;
  reportData: ReportData;
  user: UserModelState;
  global: GlobalModelState;
}

class Index extends Component<ReportProps> {

  state={
    // eslint-disable-next-line react/no-unused-state
    formatCode: '',
    formatName: '',
    Top:10,
    showSelect :false,
    reportParam: null,

    init: true,
    searchLoading: false,
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.Top !== prevState.Top) {
      const {dispatch} = this.props;
      const { reportParam } = this.state;
      if(reportParam !== null){ 
         reportParam.top = this.state.Top;}
         const reportInfoModel  = JSON.stringify(reportParam);
      
      dispatch({
        type: 'reportData/getFormatHeaderNameData',
        payload: {
          reportInfoModel
        },
      });
    }
  }
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

  // ページの先頭にあるメニューが表示されますか
  // @ts-ignore
  changeBaseMenuShowState = (payload: boolean): void => {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'global/displayBaseMenuFlag',
        payload
      });
    }
  };

  componentDidMount() {
    const {dispatch} = this.props;

    const language = this.props.user.currentUser?.dspLang;
    const orgGroupId = this.props.user.currentUser?.orgGroupId;
    const caseYear = this.props.user.currentUser?.dspYear;
    const loginUserCd = '';
    const authOrgCd = this.props.user.currentUser?.authOrgCds;
    let selectedOrgCd: string | undefined = '';
    if (this.props.global.homePageMenu !== undefined && this.props.global.homePageMenu.length > 0
      && this.props.global.homePageMenu[0].selectMenuData !== undefined
      && this.props.global.homePageMenu[0].selectMenuData !== null) {
      selectedOrgCd = this.props.global.homePageMenu[0].selectMenuData?.selectOrgCd;
    } else {
      selectedOrgCd = this.props.user.currentUser?.currentUserOrgCd;
      if(selectedOrgCd === null || selectedOrgCd===""){
        selectedOrgCd= this.props.user.currentUser?.dspUserOrgCd;
      }
    }

    this.changeBaseMenuShowState(false);
    this.changeRightMenu(false,false,true,false,false,false);
    const caseInfoParam: FetchCaseType = { language, caseYear, orgGroupId,loginUserCd, authOrgCd, selectedOrgCd};
    const caseInfoModel  = JSON.stringify(caseInfoParam);
    dispatch({
      type: 'reportData/getFormatNameData',
      payload: {
        caseInfoModel
      },
    });
  }

  static getDerivedStateFromProps(nextProps: ReportProps) {
    return {
      searchLoading: nextProps.reportData.setSearchLoading.searchLoading,
    };
  }

  /**
   * report Name 变更方法
   * @param e: 变更后的值
   */
  handleChange = (event:any) => {
    this.setState({ Top: event});
  };
  onSelect = (e: string) => {

    this.setState({
      init: false,
    })

    if(e !== null){
      const formatNmLst = this.props.reportData.formatNameData;
      if(formatNmLst!== null && formatNmLst.length>0){
        const formatNmList = formatNmLst.filter((item)=>item.layNm===e.toString());
        if(formatNmList.length>0){
          const formatCode = formatNmList[0].layCd;

          this.setState({
            // eslint-disable-next-line react/no-unused-state
            formatCode,
            formatName: e.toString(),
          })

          // AUTH_PRO !== ''
         // if(formatNmList[0].authPro !== undefined && formatNmList[0].authPro !== null && formatNmList[0].authPro !== ''){
            // todo message
            // レポートタイトルフォーマット情報取得
            const {dispatch} = this.props;

            const orgGroupId = this.props.user.currentUser?.orgGroupId;
            const budgetYear = this.props.user.currentUser?.dspYear;
            const layCd = formatCode;
            const {authPro} = formatNmList[0];
            const authOrgCd = this.props.user.currentUser?.authOrgCds;
            const top = this.state.Top;
            let selectedOrgCd ;
            if( this.props.global.homePageMenu[0].selectedKeys !== undefined &&  this.props.global.homePageMenu[0].selectedKeys!== ""
              &&  this.props.global.homePageMenu[0].selectedKeys!== null){
               selectedOrgCd = this.props.global.homePageMenu[0].selectMenuData?.selectOrgCd;
            }else{
              selectedOrgCd = this.props.user.currentUser?.currentUserOrgCd;
              if(selectedOrgCd === null || selectedOrgCd===""){
                selectedOrgCd= this.props.user.currentUser?.dspUserOrgCd;
              }
              // selectedOrgCd = this.props.global.selectMenu[0].selectedKeys;
            }

            const loginUserCd = this.props.user.currentUser?.userid;
            const reportParam: ReportInfoModel = { layCd, budgetYear, orgGroupId, authPro, authOrgCd, selectedOrgCd,loginUserCd,top};
            const reportInfoModel  = JSON.stringify(reportParam);
            this.setState({ reportParam });
            if(reportParam.layCd === "REP_005"){
              this.setState({ showSelect: true});
            }else{
              this.setState({ showSelect: false});
            }
            dispatch({
              type: 'reportData/getFormatHeaderNameData',
              payload: {
                reportInfoModel 
              },
            });
          // }
        }else{
          this.setState({
            // eslint-disable-next-line react/no-unused-state
            formatCode:'',
            formatName: '',
          })
        }
      }
    }
  };

  render() {

    const getformatNameOption = (list: FormatNameType[]) => {
      if (!list || list.length < 1) {
        return (
          <Option key={0} value={0}>
            {formatMessage({ id: 'common.message.noSelect' })}
          </Option>
        );
      }
      const listBak = list.filter((item)=>item.layNm !== null && item.layNm !== '');

      return listBak.map((item) => (
        <Option key={item.layCd} value={item.layNm}>
          {item.layNm}
        </Option>
      ));
    };

    const formatNameList = this.props.reportData.formatNameData;
    let optionNameList: FormatNameType[] = [];
    if(formatNameList!== null && formatNameList.length>0){
      optionNameList = formatNameList;
    }

    let visible: boolean = false;
    if(this.props.reportData.resultData !== undefined && this.props.reportData.resultData !== null){
      if(this.props.reportData.resultData.length>0){
        visible = true;
      }else {
        visible = false;
      }
    }else {
      visible = false;
    }

    return (

      <div>
        <Spin spinning={this.state.searchLoading}>
          <div className={styles.TopCard}>
            <Card>
              <div className={styles.ReportTop}>
                <Space size={10}>
                  {formatMessage({ id: 'report.label.ReportName' })}
                  <Select
                    className={styles.ReportNameSelect}
                    value={this.state.formatName}
                    onSelect={(e) => this.onSelect(e)}
                  >
                    {getformatNameOption(optionNameList)}
                  </Select>
                  {this.state.showSelect ? (
                  <div>
                    {formatMessage({ id: 'report.label.Top' })}
                    <Select style={{ width: '100px',margin: '10px' }} value={this.state.Top} onChange={this.handleChange}>
                      <option value={5}>5</option> 
                      <option value={10}>10</option> 
                      <option value={15}>15</option> 
                      <option value={20}>20</option>  
                    </Select>{formatMessage({ id: 'report.label.ranking' })}
                  </div>
                ) : null}

                </Space>
              </div>
            </Card>
          </div>
          <div style={{height: '10px'}}> </div>
            { visible === true && this.state.init === false ?(
              <div className={styles.TopCard}>
                <Card>
                  <Report
                    tableName ="report"
                    schema={this.props.reportData.resultData[0]}
                    data={this.props.reportData.resultData[1]}
                    sumData={this.props.reportData.resultData[2]}
                    procedureDiv={this.props.reportData.resultData[3]}
                    year={this.props.user.currentUser?.dspYear}
                    formatName={this.state.formatName}
                  />
                </Card>
              </div>
            ):
              <div className={styles.AllPageDiv}>
                <Card />
              </div>
            }
        </Spin>
      </div>
    );
  }
}

export default connect(
  ({
     reportData,
     user,
     global,
   }: {
    reportData: ReportData;
     user:ConnectState;
    global: GlobalModelState;
   },
  ) => ({
    reportData,
    user,
    global,
  }),
  // @ts-ignore
)(Index);
