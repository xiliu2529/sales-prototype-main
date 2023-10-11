import React, {Component} from 'react';
// @ts-ignore
import styles from "@/pages/BusinessActivities/index.less";
import {AutoComplete, Button, Col, DatePicker, Form, message, Row, Select, Upload, Modal} from "antd";
import {formatMessage} from "@@/plugin-locale/localeExports";
import Markdown from "@/pages/BusinessActivities/components/Markdown/editorMarkdown";
import {HttpUrlStrUplod} from "@/utils/request";
import {ExclamationCircleOutlined, UploadOutlined} from "@ant-design/icons/lib";
import {
  BusActData,
  CodeValueType,
  OptionType
} from "@/pages/BusinessActivities/data";
import {UserType} from "@/pages/FormAdvancedForm/components/SearchRunningCases/data";
import {CurrentUser, Dispatch, GlobalModelState} from "@@/plugin-dva/connect";
import classNames from "classnames";
import {connect} from "umi";
import "@/utils/messageConfig";
import CustomerInfo from "@/components/CustomerInfo/CustomerInfo";
import EndUserInfo from "@/components/EndUserInfo/EndUserInfo";

export interface NewBusinesActivitieProps {
  BusinessActivities:BusActData;
  currentUser: CurrentUser;
  newBusinessActivity:any,
  dispatch:Dispatch,
  resultFlag:boolean,
  global:GlobalModelState;
}

class NewBusinesActivitie extends Component<NewBusinesActivitieProps>{
  state = {
    showUplodFiles:[],
    uplodFiles:[],
    createDate:"",
    cstmrNm:"",
    caseNm:"",
    status:"",
    endUser:"",
    editorRef: React.createRef(),
    inputUser:  this.props.currentUser?.userDiv === "1" ?this.props.currentUser?.userid:"",
    visible:false,
  };

  getStatusOption = (list: CodeValueType[]) => {
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
  //  営業担当リスト取得（入力できる）
  getStaffOption = (list: UserType[]) => {
    if (!list || list.length < 1) {
      return (
        // @ts-ignore
        <Option key={0} value={0}>
          {formatMessage({ id: 'common.message.noSelect' })}
        </Option>
      );
    }
    // @ts-ignore
    const listBak = list.filter((item) => item.userNm !== null && item.userNm !== '');
    return listBak.map((item) => (
      // @ts-ignore
      <Option value={item.userCd} key={item.userCd}>
        {item.userNm}
      </Option>
    ));
  };
  /**
   *  Model 开始日变更
   * @param date moment类型日期
   * @param dateString string类型的日期
   */
    // @ts-ignore
  dataFromChange = (date: moment, dateString: string) => {
    // 仅可以输入当前年
    this.setState({
      // @ts-ignore
      createDate: dateString,
    });
  };


  /**
   * Customer charge 变更方法
   * @param value
   */
  // onCustomerChange = (value:string)=>{
  //   console.log(value);
  //   if (value === null || value === undefined){
  //     value = "";
  //   }
  //   console.log(value);
  //   this.setState({
  //     // @ts-ignore
  //     cstmrNm: value
  //   })
  // }
  handleCustomer= (cstmrCds:string,cstmrNms:string,caseNms:string,index:number) => {
    this.setState({
      cstmrNm: cstmrNms,
    });
  }

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

  /**
   * Case charge 变更方法
   * @param e: 变更后的值
   */
  onCaseChange = (value:string)=>{
    console.log(value);
    if (value === null || value === undefined){
      value = "";
    }
    console.log(value);
    this.setState({
      // @ts-ignore
      caseNm: value
    })
  }

  // onEndUserChange = (value:string)=>{
  //   console.log(value);
  //   if (value === null || value === undefined){
  //     value = "";
  //   }
  //   console.log(value);
  //   this.setState({
  //     // @ts-ignore
  //     endUser: value
  //   })
  // }

  handleEndUser= (endUserCds:string,endUserNms:string,index:number) => {
    this.setState({
      endUser: endUserNms,
    });
  }

  /**
   * Staff charge 变更方法
   * @param e: 变更后的值
   */
  onStatusChange = (value:string,e: { key: any; })=>{
    console.log(value);
    console.log(e);
    if (value === null || value === undefined){
      value = "";
    }
    console.log(value);
    this.setState({
      // @ts-ignore
      status: e.key
    })
  }


  /**
   * Input User 变更方法
   * @param e: 变更后的值
   */
  onInputUserChange = (value:string,e: { key: any; })=>{
    console.log(value);
    if (value === null || value === undefined){
      value = "";
    }
    console.log(value);
    this.setState({
      // @ts-ignore
      inputUser: e.key
    })
  }


  onCreateBusinesActivitieBtn= async ()=> {
    const {dispatch} = this.props;
    const {editorRef, uplodFiles, cstmrNm, endUser, caseNm, createDate, status, inputUser} = this.state;
    // 各个字段不为空
    if (null === this.state.cstmrNm || "" === this.state.cstmrNm || undefined === this.state.cstmrNm) {
      message.info(formatMessage({id: 'business.activities.input.customer'}));
      return;
    }else if (this.state.cstmrNm.length>100){
      message.info(formatMessage({id: 'business.activities.input.max.customer'}));
      return;
    }
    if (null === this.state.endUser || "" === this.state.endUser || undefined === this.state.endUser) {
      message.info(formatMessage({id: 'business.activities.input.endUser'}));
      return;
    }else if (this.state.endUser.length>100){
      message.info(formatMessage({id: 'business.activities.input.max.endUser'}));
      return;
    }
    if (null === this.state.caseNm || "" === this.state.caseNm || undefined === this.state.caseNm) {
      message.info(formatMessage({id: 'business.activities.input.case'}));
      return;
    }else if (this.state.caseNm.length>100){
      message.info(formatMessage({id: 'business.activities.input.max.case'}));
      return;
    }
    if (null === this.state.createDate || "" === this.state.createDate || undefined === this.state.createDate) {
      message.info(formatMessage({id: 'business.activities.input.createDate'}));
      return;
    }

    if (null === this.state.status || "" === this.state.status || undefined === this.state.status) {
      message.info(formatMessage({id: 'business.activities.input.status'}));
      return;
    }
    if (null === this.state.inputUser || "" === this.state.inputUser || undefined === this.state.inputUser) {
      message.info(formatMessage({id: 'business.activities.input.staff'}));
      return;
    }else if (this.state.inputUser.length>50){
      message.info(formatMessage({id: 'business.activities.input.max.staff'}));
      return;
    }

    // @ts-ignore
    console.log(editorRef.current.getInstance().getMarkdown())
    // @ts-ignore
    if (null === editorRef || undefined === editorRef || null === editorRef.current || undefined === editorRef.current &&
      // @ts-ignore
      null === editorRef.current.getInstance() || undefined === editorRef.current.getInstance() || "" === editorRef.current.getInstance().getMarkdown())
    {
      message.info(formatMessage({id: 'business.activities.input.busAct.detail'}));
      return;
    }

    // @ApiModelProperty(value = " '案件名称' ")
    let insertBusActHedData = { dtlDataList: [],
      busActId: "",
      cstmrNm: cstmrNm,
      endUserNm:endUser,
      caseNm:caseNm,
      strCaseCreatedDt:createDate,
      caseCreatedDt:createDate,
      busActStsCd:status,
      busUserCd:inputUser}
    let insertBusActDtlData = {
      busUserCd: "",
      busActDtl: ""
    };
    // @ts-ignore
    insertBusActDtlData.addFileUrl1 = uplodFiles.length >= 1 ? uplodFiles[1 - 1].response.data.url : "";
    // @ts-ignore
    insertBusActDtlData.addFileUrl2 = uplodFiles.length >= 2 ? uplodFiles[2 - 1].response.data.url : "";
    // @ts-ignore
    insertBusActDtlData.addFileUrl3 = uplodFiles.length >= 3 ? uplodFiles[3 - 1].response.data.url : "";
    // @ts-ignore
    insertBusActDtlData.addFileUrl4 = uplodFiles.length >= 4 ? uplodFiles[4 - 1].response.data.url : "";
    // @ts-ignore
    insertBusActDtlData.addFileUrl5 = uplodFiles.length >= 5 ? uplodFiles[5 - 1].response.data.url : "";
    // @ts-ignore
    insertBusActDtlData.addFileUrl6 = uplodFiles.length >= 6 ? uplodFiles[6 - 1].response.data.url : "";
    // @ts-ignore
    insertBusActDtlData.addFileUrl7 = uplodFiles.length >= 7 ? uplodFiles[7 - 1].response.data.url : "";
    // @ts-ignore
    insertBusActDtlData.addFileUrl8 = uplodFiles.length >= 8 ? uplodFiles[8 - 1].response.data.url : "";
    // @ts-ignore
    insertBusActDtlData.addFileUrl9 = uplodFiles.length >= 9 ? uplodFiles[9 - 1].response.data.url : "";
    // @ts-ignore
    insertBusActDtlData.addFileUrl10 = uplodFiles.length >= 10 ? uplodFiles[10 - 1].response.data.url : "";
    // @ts-ignore
    insertBusActDtlData.addFileNm1 = uplodFiles.length>=1?uplodFiles[1-1].response.data.name:"";
    // @ts-ignore
    insertBusActDtlData.addFileNm2 = uplodFiles.length>=2?uplodFiles[2-1].response.data.name:"";
    // @ts-ignore
    insertBusActDtlData.addFileNm3 = uplodFiles.length>=3?uplodFiles[3-1].response.data.name:"";
    // @ts-ignore
    insertBusActDtlData.addFileNm4 = uplodFiles.length>=4?uplodFiles[4-1].response.data.name:"";
    // @ts-ignore
    insertBusActDtlData.addFileNm5 = uplodFiles.length>=5?uplodFiles[5-1].response.data.name:"";
    // @ts-ignore
    insertBusActDtlData.addFileNm6 = uplodFiles.length>=6?uplodFiles[6-1].response.data.name:"";
    // @ts-ignore
    insertBusActDtlData.addFileNm7 = uplodFiles.length>=7?uplodFiles[7-1].response.data.name:"";
    // @ts-ignore
    insertBusActDtlData.addFileNm8 = uplodFiles.length>=8?uplodFiles[8-1].response.data.name:"";
    // @ts-ignore
    insertBusActDtlData.addFileNm9 = uplodFiles.length>=9?uplodFiles[9-1].response.data.name:"";
    // @ts-ignore
    insertBusActDtlData.addFileNm10 = uplodFiles.length>=10?uplodFiles[10-1].response.data.name:"";
    // @ts-ignore
    insertBusActDtlData.busUserCd = inputUser;
    // @ts-ignore
    console.log(editorRef.current.getInstance().getMarkdown())
    // @ts-ignore
    insertBusActDtlData.busActDtl = editorRef.current.getInstance().getMarkdown();
    insertBusActDtlData.busActDtl = insertBusActDtlData.busActDtl.replace(/(?:[\n])/g,'\r\n');
    //insertBusActDtlData.busActDtl = insertBusActDtlData.busActDtl.replaceAll(`</table><p>\r\n</p><p>\r\n</p>`,`</table>`);
    //insertBusActDtlData.busActDtl = insertBusActDtlData.busActDtl.replaceAll("</table>", `</table><p>\r\n</p>`);

    // @ts-ignore
    insertBusActHedData.dtlDataList.push(insertBusActDtlData);

    // @ts-ignore
    const businesActivitieInfoModel = JSON.stringify(insertBusActHedData);
    console.log("insertBusActHedData")
    console.log(businesActivitieInfoModel)

    await dispatch({
      type: 'global/dialogBoxFlag',
      payload: false
    });
    await dispatch({
      type: 'global/inForceFlag',
      payload: false
    });
    await dispatch({
      type: 'global/disableButton',
      payload: false
    });
    await dispatch({
      type: 'global/editorMarkDownFlag',
      payload: false
    });
    await dispatch({
      type: 'global/uploadFileFlag',
      payload: false
    });
    await dispatch({
      type: 'global/editAddFlag',
      payload: false
    });
    if (dispatch) {
      await  dispatch({
        type: 'BusinessActivities/insertBusinessActivity',
        payload: businesActivitieInfoModel
      });
    }
    console.log("this.props.resultFlag; "+this.props.resultFlag)
    if (this.props.resultFlag){
      // @ts-ignore
      editorRef.current.getInstance().reset();
      this.props.newBusinessActivity();
    }
  }

  render() {
    // @ts-ignore
    const { BusinessActivities} = this.props;
    const  {showUplodFiles,editorRef,inputUser,visible} = this.state;
    let buttonItemLayout ={labelCol: {style: {width:120} }};


    // 文件上传
    let uploadProps= {
      name: 'file',
      action: HttpUrlStrUplod+"/file",
      data: {categoryId:"1"},
      headers: {
        authorization: 'authorization-text',
      },
      defaultFileList:[],
      // @ts-ignore
      onChange:({ file, fileList })=>{
        console.log("uploadProps->onChange")
        console.log(file)
        console.log(fileList);
        this.setState({
          showUplodFiles:fileList
        })
        if(file.status === 'removed' || file.status === "done") {

          if (file.status === "done" && file.response.result){
            if (null !== fileList && undefined !== fileList && fileList.length>0){
              fileList.forEach((item: { uid: any; url: any; })=>{
                // @ts-ignore
                if(item.uid === file.uid){
                  // @ts-ignore
                  item.url = HttpUrlStrUplod+file.response.data.url;
                }
              })
            }
            this.setState({
              uplodFiles:fileList
            })
          }else if (file.status === 'removed'){
            this.setState({
              uplodFiles:fileList
            })
          }else if (!file.response.result) {
            this.setState({
              showUplodFiles:showUplodFiles,
            })
            message.error(formatMessage({id: 'common.business.activities.upload.error'}));
          }
        }else if(file.status === "error"){
          this.setState({
            showUplodFiles:showUplodFiles,
          })
          message.error(formatMessage({id: 'common.business.activities.upload.error'}));
        }
      },
      // @ts-ignore
      onRemove: file => {
        console.log(file)
        console.log(file)
        this.setState({
          visible:true
        })
        Modal.confirm({
          title: formatMessage({id: 'common.business.activities.delete.alert'}),
          visible:visible,
          icon: <ExclamationCircleOutlined />,
          content: "",
          centered: true,
          okText: formatMessage({id: 'app.common.OK'}),
          cancelText: formatMessage({id: 'app.common.Cancel'}),
          // 这里注意要用箭头函数, 否则this不生效
          onOk: async () => {
            this.setState({
              visible:false
            })
            console.log(showUplodFiles)
            // @ts-ignore
            let showList = showUplodFiles.filter((item)=>item.uid !== file.uid)
            console.log(showList)
            this.setState({
              showUplodFiles:showList,
              uplodFiles:showList
            })
          },
          onCancel: () => {
            this.setState({
              visible:false
            })
          },
        });
        return false;
      }
    };
    // 获取optionValue
    // const customerOption: OptionType[] = [];
    // BusinessActivities.customerList.forEach((item) => {
    //   // @ts-ignore
    //   if (item !== null && "" !== item) {
    //     const optionItem: OptionType = {
    //       // @ts-ignore
    //       value: item
    //     };
    //     customerOption.push(optionItem);
    //   }
    // });

    // const endUserOption: OptionType[] = [];
    // if(BusinessActivities.endUserList !== undefined && BusinessActivities.endUserList !== null && BusinessActivities.endUserList.length>0){
    //   BusinessActivities.endUserList.forEach((item) => {
    //     // @ts-ignore
    //     if (item !== null && item !== '') {
    //       const optionItem: OptionType = {
    //         // @ts-ignore
    //         value: item
    //       };
    //       endUserOption.push(optionItem);
    //     }
    //   });
    // }else{
    //   const optionItem: OptionType = {
    //     // @ts-ignore
    //     value: ''
    //   };
    //   endUserOption.push(optionItem);
    // }

    const caseOption: OptionType[] = [];
    BusinessActivities.caseList.forEach((item) => {
      // @ts-ignore
      if (item !== null && "" !== item) {
        const optionItem: OptionType = {
          // @ts-ignore
          value: item
        };
        caseOption.push(optionItem);
      }
    });
    return (

      <div className={styles.activitiesNewBusines}>
        <Row>
          <Col xl={8} lg={8} md={8} sm={8} xs={8}>
            <Form.Item {...buttonItemLayout} style={{marginBottom:'15px'}} label={formatMessage({ id: 'common.business.activities.customerName' })} className={classNames(styles.styleFont)}>
              {/*<AutoComplete*/}
              {/*  allowClear*/}
              {/*  className={styles.activitiesSearchItem}*/}
              {/*  onChange={(e) => this.onCustomerChange(e)}*/}
              {/*  // @ts-ignore*/}
              {/*  onSelect={(e) => this.onCustomerChange(e)}*/}
              {/*  options={customerOption}*/}
              {/*  filterOption={(inputValue, option) =>*/}
              {/*    // @ts-ignore*/}
              {/*    option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1*/}
              {/*  }*/}
              {/*/>*/}

              {/*<Select showSearch allowClear className={styles.activitiesSearchItem}*/}
              {/*        onChange={this.onCustomerChange}>*/}
              {/*  {this.getCustomerOption(BusinessActivities.customerList)}*/}
              {/*</Select>*/}
              <CustomerInfo
                cstmrCd=""
                cstmrNm={this.state.cstmrNm}
                customerLst={BusinessActivities.customerList}
                allCustomerLst={BusinessActivities.allCustomerList}
                caseLst={[]}
                index={0}
                caseFlag="1"
                styleFlag="1"
                onRef={this.onRef}
                handleCustomer={this.handleCustomer.bind(this)}
              />
            </Form.Item>
          </Col>
          <Col xl={8} lg={8} md={8} sm={8} xs={8}>
            <Form.Item {...buttonItemLayout} style={{marginBottom:'15px'}} label={formatMessage({ id: 'common.business.activities.endUser' })} className={classNames(styles.styleFont)}>
              {/*<AutoComplete*/}
              {/*  allowClear*/}
              {/*  className={styles.activitiesSearchItem}*/}
              {/*  onChange={(e) => this.onEndUserChange(e)}*/}
              {/*  // @ts-ignore*/}
              {/*  onSelect={(e) => this.onEndUserChange(e)}*/}
              {/*  options={endUserOption}*/}
              {/*  filterOption={(inputValue, option) =>*/}
              {/*    // @ts-ignore*/}
              {/*    option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1*/}
              {/*  }*/}
              {/*/>*/}
              <EndUserInfo
                endUserCd=""
                endUserNm={this.state.endUser}
                endUserLst={BusinessActivities.endUserList}
                allEndUserLst={BusinessActivities.allEndUserList}
                index={0}
                styleFlag="1"
                onRef={this.onRef}
                handleEndUser={this.handleEndUser.bind(this)}
              />
              {/*<Select showSearch allowClear className={styles.activitiesSearchItem}*/}
              {/*        onChange={this.onEndUserChange}>*/}
              {/*  {this.getEndUserOption(BusinessActivities.endUserList)}*/}
              {/*</Select>*/}
            </Form.Item>
          </Col>
          <Col xl={8} lg={8} md={8} sm={8} xs={8}>
            <Form.Item {...buttonItemLayout} style={{marginBottom:'15px'}} label={formatMessage({ id: 'common.business.activities.case' })} className={classNames(styles.styleFont)}>
              <AutoComplete
                allowClear
                className={styles.activitiesSearchItem}
                onChange={(e) => this.onCaseChange(e)}
                // @ts-ignore
                onSelect={(e) => this.onCaseChange(e)}
                options={caseOption}
                filterOption={(inputValue, option) =>
                  // @ts-ignore
                  option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                }
              />
              {/*<Select showSearch allowClear className={styles.activitiesSearchItem}*/}
              {/*        onChange={this.onCaseChange}>*/}
              {/*  {this.getCaseOption(BusinessActivities.caseList)}*/}
              {/*</Select>*/}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col xl={8} lg={8} md={8} sm={8} xs={8}>
            <Form.Item {...buttonItemLayout} style={{marginBottom:'15px'}} label={formatMessage({ id: 'common.business.activities.createDate' })} className={classNames(styles.styleFont)}>
              <DatePicker
                className={styles.activitiesSearchItem}
                id="fromDate"
                // placeholder={formatMessage({ id: 'actualityForecastTop.datePicker.placeholder' })}
                onChange={this.dataFromChange}
                format="YYYY-MM-DD"
              />
            </Form.Item>
          </Col>
          <Col xl={8} lg={8} md={8} sm={8} xs={8}>
            <Form.Item {...buttonItemLayout} style={{marginBottom:'15px'}} label={formatMessage({ id: 'common.business.activities.status' })} className={classNames(styles.styleFont)}>
              <Select labelInValue showSearch className={styles.activitiesSearchItem}
                      // @ts-ignore
                      onChange={this.onStatusChange}>
                {this.getStatusOption(BusinessActivities.codeValueList)}
              </Select>
            </Form.Item>
          </Col>
          <Col xl={8} lg={8} md={8} sm={8} xs={8}>
            <Form.Item {...buttonItemLayout} style={{marginBottom:'15px'}} label={formatMessage({ id: 'common.business.activities.staff' })} className={classNames(styles.styleFont)}>
              <Select showSearch className={styles.activitiesSearchItem}
                      // @ts-ignore
                      onChange={this.onInputUserChange}
                      value={inputUser}>
                {this.getStaffOption(BusinessActivities.inputUserList)}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Upload fileList={showUplodFiles} {...uploadProps}>
            {showUplodFiles.length>=10?"": <Button icon={<UploadOutlined />}>{formatMessage({id: 'common.business.activities.upload'})}</Button>}
          </Upload>
        </Row>
        <Row style={{paddingTop:10}}>
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            <Markdown newCloseFlag={this.props.global.newCloseFlag}  disableButton={this.props.global.disableButton}  dispatch = {this.props.dispatch} initialEditType={"wysiwyg"} initialValue={""} MarkdownRef={editorRef}/>
          </Col>
        </Row>
        <Row>
          <div className={styles.contentCommentCreateBtn}>
            <Button type="primary" onClick={()=>this.onCreateBusinesActivitieBtn()} >{formatMessage({id: 'common.business.activities.create'})}</Button>
          </div>
        </Row>
      </div>
    );
  }
}

export default connect(
  ({ BusinessActivities,global}: {BusinessActivities: BusActData,global:GlobalModelState}) => ({
    resultFlag: BusinessActivities.resultFlag,
    global,
  }),
) (NewBusinesActivitie);
