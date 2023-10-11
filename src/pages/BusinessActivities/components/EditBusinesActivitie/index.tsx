import React, {Component} from 'react';
// @ts-ignore
import styles from "@/pages/BusinessActivities/components/EditBusinesActivitie/index.less";
import {Button, Col, Form, Input, message, Modal, Row, Select, Space, Tooltip, Upload} from "antd";
import {formatMessage} from "@@/plugin-locale/localeExports";
import Markdown from "@/pages/BusinessActivities/components/Markdown/editorMarkdown";
import {HttpUrlStrUplod} from "@/utils/request";
import {
  CheckOutlined,
  CloseOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  SaveOutlined,
  UploadOutlined
} from "@ant-design/icons/lib";
import {
  BusActData, BusActDtlInsertDataType, BusActHedDtlDataType,
  CodeValueType,
  DBusActHeadDataType,
} from "@/pages/BusinessActivities/data";
import {Content} from "antd/es/layout/layout";
import BusinesActivitieContent from "@/pages/BusinessActivities/components/BusinesActivitieContent";
import {CurrentUser} from "@/models/user";
import {Dispatch, GlobalModelState} from "@@/plugin-dva/connect";
import classNames from "classnames";
import "@/utils/messageConfig";
import {connect} from "umi";
import {ConnectState} from "@/models/connect";
import ViewerMarkdown from "@/pages/BusinessActivities/components/Markdown/viewerMarkdown";

export interface EditBusinesActivitieProps {
  dispatch: Dispatch;
  BusinessActivities:BusActData;
  currentUser: CurrentUser;
  bBusActHeadData:DBusActHeadDataType;
  contentType:string;
  createBusinessActivityDtl:any;
  deleteComment:any;
  resultFlag:boolean,
  updateCaseNmFlag:boolean,
  updateBusinessActivity:any;
  userCdList:string[];
  orgIdList:string[];// 获取組織ID
  global:GlobalModelState;
}

class EditBusinesActivitie extends Component<EditBusinesActivitieProps>{

  state = {
    showUplodFiles:[],
    uplodFiles:[],
    createDate:"",
    cstmrNm:"",
    caseNm:"",
    status:this.props.bBusActHeadData.busActStsCd,
    endUser:"",
    editorRef: React.createRef(),
    statusName:"",
    initialValue:"",
    caseNmEdit:"",
    editFlag:false,
  };

  /**
   * 组装树函数
   * @param {array} data -- 要组装的list数组
   * @param {string} idKey -- 树节点的id的名称
   * @param {string} parentKey -- 树节点的父节点id的名称
   * @param {string} childListKey -- 树节点的子集list的id的名称
   */
  toTree=(data = [],
          idKey = 'id',
          parentKey = 'pid',
          childListKey = 'subList') => {
    // 删除 所有 children,以防止多次调用
    data.forEach(function (item) {
      delete item[childListKey];
    });

    // 将数据存储为 以 id 为 KEY 的 map 索引数据列
    const map = {};
    data.forEach(function (item) {
      map[item[idKey]] = item;
    });
    const val: never[] = [];
    data.forEach((item) => {
      // 以当前遍历项，的pid,去map对象中找到索引的id
      const parent = map[item[parentKey]];

      // 如果找到索引，那么说明此项不在顶级当中,那么需要把此项添加到，他对应的父级中
      if (parent) {
        // @ts-ignore
        (parent[childListKey] || (parent[childListKey] = [])).push(item);
      } else {
        // 如果没有在map中找到对应的索引ID,那么直接把 当前的item添加到 val结果集中，作为顶级
        val.push(item);
      }
    });
    return val;
  }

  getBusinesActivitieContentChild = (businesActivitie:any[],contentType:string)=>{
    const { currentUser} = this.props;
    if (businesActivitie === null || businesActivitie === undefined){return }
    return businesActivitie.map((item,index)=>(
      // @ts-ignore
      <BusinesActivitieContent key={index} currentUser={currentUser}
                               dispatch={this.props.dispatch}
                               RefreshComment={this.RefreshComment}
                               businesActivitieInfo={item} businesActivitieType={contentType}
                              deleteComment={this.props.deleteComment}>
        {this.getBusinesActivitieContentChild(item.subList,contentType)}
      </BusinesActivitieContent>
    ));
  }

  getCaseBusinesActivitieContent = (dtlDataList: BusActHedDtlDataType[], contentType: String) => {

    if (dtlDataList === null || undefined === dtlDataList || dtlDataList.length < 0)
    {
      return <div />
    }
    // @ts-ignore
    const treeData = this.toTree(dtlDataList,"busActDtlId","parBusActDtlId");
    // @ts-ignore
    return this.getBusinesActivitieContentChild(treeData,contentType);
  }

  /**
   * Staff charge 变更方法
   * @param e: 变更后的值
   */
  onStatusChange = (value:string)=>{
    console.log(value);
    if (value === null || value === undefined){
      value = "";
    }
    console.log(value);
    this.setState({
      // @ts-ignore
      status: value
    })
  }

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
      <Option value={item.cdVal} key={item.cdVal}>
        {item.cdNm}
      </Option>
    ));
  };

   /**
   * 保存case状态
   * @param BusinessActivities
   */
  caseStatusSave=async ()=>{
    const { bBusActHeadData, dispatch } = this.props;
    console.log(bBusActHeadData)
    const { status } = this.state;
    const headParam = {busActId:bBusActHeadData.busActId,busActStsCd: status};
    const headModel = JSON.stringify(headParam);
    // case情報条件によってデータを取得
    await dispatch({
      type: 'BusinessActivities/updateBusinessActivityHead',
      payload: headModel,
    });
    if (this.props.resultFlag)
    {
      this.props.updateBusinessActivity();
    }
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
  }

  /**
   * 営業活動報情報挿入添加评论
   * @param DBusActHeadData
   */
  onAddBusinesActivitieDtlBtn = async (DBusActHeadData:DBusActHeadDataType)=>{
    const { dispatch} = this.props;
/*    dispatch({
      type: 'global/dialogBoxFlag',
      payload: false
    });
    dispatch({
      type: 'global/inForceFlag',
      payload: false
    });
    dispatch({
      type: 'global/disableButton',
      payload: false
    }); */
   await this.commonPageDisplay(false, false, false,false);
    await dispatch({
      type: 'global/editorMarkDownFlag',
      payload: false
    });

    console.log(DBusActHeadData)

    const {editorRef,uplodFiles} = this.state;
    const insertBusActHedDtlData: BusActDtlInsertDataType=
      {
        // @ApiModelProperty(value="'営業活動ID'")
        busActId:"",
        // @ApiModelProperty(value="'営業活動明細ID' ")
        busActDtlId:"",
        // @ApiModelProperty(value=" '上位営業活動ID' ")
        parBusActDtlId:"",
        // @ApiModelProperty(value="'営業活動詳細' ")
        busActDtl:"",
        // @ApiModelProperty(value="'添付ファイル1' ")
        addFileUrl1:"",
        // @ApiModelProperty(value="'添付ファイル2' ")
        addFileUrl2:"",
        // @ApiModelProperty(value="'添付ファイル3' ")
        addFileUrl3:"",
        // @ApiModelProperty(value="'添付ファイル4' ")
        addFileUrl4:"",
        // @ApiModelProperty(value="'添付ファイル5' ")
        addFileUrl5:"",
        // @ApiModelProperty(value="'添付ファイル6' ")
        addFileUrl6:"",
        // @ApiModelProperty(value="'添付ファイル7' ")
        addFileUrl7:"",
        // @ApiModelProperty(value="'添付ファイル8' ")
        addFileUrl8:"",
        // @ApiModelProperty(value="'添付ファイル9' ")
        addFileUrl9:"",
        // @ApiModelProperty(value="'添付ファイル10' ")
        addFileUrl10:"",
        addFileNm1: "",
        // @ApiModelProperty(value=" '添付ファイル名称2' ")
        addFileNm2: "",
        // @ApiModelProperty(value=" '添付ファイル名称3' ")
        addFileNm3: "",
        // @ApiModelProperty(value=" '添付ファイル名称4' ")
        addFileNm4: "",
        // @ApiModelProperty(value=" '添付ファイル名称5' ")
        addFileNm5: "",
        // @ApiModelProperty(value=" '添付ファイル名称6' ")
        addFileNm6: "",
        // @ApiModelProperty(value=" '添付ファイル名称7' ")
        addFileNm7: "",
        // @ApiModelProperty(value=" '添付ファイル名称8' ")
        addFileNm8: "",
        // @ApiModelProperty(value=" '添付ファイル名称9' ")
        addFileNm9:"",
        // @ApiModelProperty(value=" '添付ファイル10' ")
        addFileNm10: "",
        // @ApiModelProperty(value="'階層' ")
        levels:"",
        // @ApiModelProperty(value="'営業者ユーザID' ")
        busUserCd:"",
      }
    if (editorRef !== null &&
      undefined !== editorRef &&
      editorRef.current !== null &&
      undefined !== editorRef.current &&
      // @ts-ignore
      editorRef.current.getInstance() !== null &&  undefined !== editorRef.current.getInstance() && editorRef.current.getInstance().getHtml() !==  "") {
      // @ts-ignore
      insertBusActHedDtlData.addFileUrl1 = uplodFiles.length >= 1 ? uplodFiles[1 - 1].response.data.url : "";
      // @ts-ignore
      insertBusActHedDtlData.addFileUrl2 = uplodFiles.length >= 2 ? uplodFiles[2 - 1].response.data.url : "";
      // @ts-ignore
      insertBusActHedDtlData.addFileUrl3 = uplodFiles.length >= 3 ? uplodFiles[3 - 1].response.data.url : "";
      // @ts-ignore
      insertBusActHedDtlData.addFileUrl4 = uplodFiles.length >= 4 ? uplodFiles[4 - 1].response.data.url : "";
      // @ts-ignore
      insertBusActHedDtlData.addFileUrl5 = uplodFiles.length >= 5 ? uplodFiles[5 - 1].response.data.url : "";
      // @ts-ignore
      insertBusActHedDtlData.addFileUrl6 = uplodFiles.length >= 6 ? uplodFiles[6 - 1].response.data.url : "";
      // @ts-ignore
      insertBusActHedDtlData.addFileUrl7 = uplodFiles.length >= 7 ? uplodFiles[7 - 1].response.data.url : "";
      // @ts-ignore
      insertBusActHedDtlData.addFileUrl8 = uplodFiles.length >= 8 ? uplodFiles[8 - 1].response.data.url : "";
      // @ts-ignore
      insertBusActHedDtlData.addFileUrl9 = uplodFiles.length >= 9 ? uplodFiles[9 - 1].response.data.url : "";
      // @ts-ignore
      insertBusActHedDtlData.addFileUrl10 = uplodFiles.length >= 10 ? uplodFiles[10 - 1].response.data.url : "";
      // @ts-ignore
      insertBusActHedDtlData.addFileNm1 = uplodFiles.length>=1?uplodFiles[1-1].response.data.name:"";
      // @ts-ignore
      insertBusActHedDtlData.addFileNm2 = uplodFiles.length>=2?uplodFiles[2-1].response.data.name:"";
      // @ts-ignore
      insertBusActHedDtlData.addFileNm3 = uplodFiles.length>=3?uplodFiles[3-1].response.data.name:"";
      // @ts-ignore
      insertBusActHedDtlData.addFileNm4 = uplodFiles.length>=4?uplodFiles[4-1].response.data.name:"";
      // @ts-ignore
      insertBusActHedDtlData.addFileNm5 = uplodFiles.length>=5?uplodFiles[5-1].response.data.name:"";
      // @ts-ignore
      insertBusActHedDtlData.addFileNm6 = uplodFiles.length>=6?uplodFiles[6-1].response.data.name:"";
      // @ts-ignore
      insertBusActHedDtlData.addFileNm7 = uplodFiles.length>=7?uplodFiles[7-1].response.data.name:"";
      // @ts-ignore
      insertBusActHedDtlData.addFileNm8 = uplodFiles.length>=8?uplodFiles[8-1].response.data.name:"";
      // @ts-ignore
      insertBusActHedDtlData.addFileNm9 = uplodFiles.length>=9?uplodFiles[9-1].response.data.name:"";
      // @ts-ignore
      insertBusActHedDtlData.addFileNm10 = uplodFiles.length>=10?uplodFiles[10-1].response.data.name:"";

      insertBusActHedDtlData.busActId = DBusActHeadData.busActId;
      insertBusActHedDtlData.busActDtlId = "0";
      insertBusActHedDtlData.parBusActDtlId = "0"
      insertBusActHedDtlData.levels = "0";
        // @ts-ignore
        insertBusActHedDtlData.busUserCd =  DBusActHeadData.userCd;
      // @ts-ignore
      console.log(editorRef.current.getInstance().getMarkdown())
      // @ts-ignore
      insertBusActHedDtlData.busActDtl = editorRef.current.getInstance().getMarkdown();
      insertBusActHedDtlData.busActDtl = insertBusActHedDtlData.busActDtl.replace(/(?:[\n])/g,'\r\n');
      //insertBusActHedDtlData.busActDtl = insertBusActHedDtlData.busActDtl.replaceAll(`</table><p>\r\n</p><p>\r\n</p>`,`</table>`);
      //insertBusActHedDtlData.busActDtl = insertBusActHedDtlData.busActDtl.replaceAll("</table>", `</table><p>\r\n</p>`);
      const businesActivitieInfoParam: {} = {
        busActId: insertBusActHedDtlData.busActId,
        busActDtlId: insertBusActHedDtlData.busActDtlId,
        busActDtl: insertBusActHedDtlData.busActDtl,
        addFileUrl1: insertBusActHedDtlData.addFileUrl1,
        addFileUrl2: insertBusActHedDtlData.addFileUrl2,
        addFileUrl3: insertBusActHedDtlData.addFileUrl3,
        addFileUrl4: insertBusActHedDtlData.addFileUrl4,
        addFileUrl5: insertBusActHedDtlData.addFileUrl5,
        addFileUrl6: insertBusActHedDtlData.addFileUrl6,
        addFileUrl7: insertBusActHedDtlData.addFileUrl7,
        addFileUrl8: insertBusActHedDtlData.addFileUrl8,
        addFileUrl9: insertBusActHedDtlData.addFileUrl9,
        addFileUrl10: insertBusActHedDtlData.addFileUrl10,
        // @ApiModelProperty(value=" '添付ファイル名称1' ")
        addFileNm1: insertBusActHedDtlData.addFileNm1,
        // @ApiModelProperty(value=" '添付ファイル名称2' ")
        addFileNm2: insertBusActHedDtlData.addFileNm2,
        // @ApiModelProperty(value=" '添付ファイル名称3' ")
        addFileNm3: insertBusActHedDtlData.addFileNm3,
        // @ApiModelProperty(value=" '添付ファイル名称4' ")
        addFileNm4: insertBusActHedDtlData.addFileNm4,
        // @ApiModelProperty(value=" '添付ファイル名称5' ")
        addFileNm5: insertBusActHedDtlData.addFileNm5,
        // @ApiModelProperty(value=" '添付ファイル名称6' ")
        addFileNm6: insertBusActHedDtlData.addFileNm6,
        // @ApiModelProperty(value=" '添付ファイル名称7' ")
        addFileNm7: insertBusActHedDtlData.addFileNm7,
        // @ApiModelProperty(value=" '添付ファイル名称8' ")
        addFileNm8: insertBusActHedDtlData.addFileNm8,
        // @ApiModelProperty(value=" '添付ファイル名称9' ")
        addFileNm9: insertBusActHedDtlData.addFileNm9,
        // @ApiModelProperty(value=" '添付ファイル10' ")
        addFileNm10: insertBusActHedDtlData.addFileNm10,
        levels:insertBusActHedDtlData.levels,
        busUserCd:insertBusActHedDtlData.busUserCd,
        parBusActDtlId:insertBusActHedDtlData.parBusActDtlId,
      };

      // @ts-ignore
      const businesActivitieInfoModel = JSON.stringify(businesActivitieInfoParam);
      console.log("insertBusActHedDtlData")
      console.log(businesActivitieInfoModel)
      if (dispatch) {
       await dispatch({
          type: 'BusinessActivities/insertBusinessActivityDtl',
          payload: businesActivitieInfoModel
        });
      }
      // @ts-ignore
      editorRef.current.getInstance().reset();

      this.props.createBusinessActivityDtl();
    }else {
        message.info(formatMessage({ id: 'business.activities.input.busAct.detail' }));
    }
    const fileList = this.state.showUplodFiles.length

    await  dispatch({
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
    if(fileList!==0) {
      await dispatch({
        type: 'global/dialogBoxFlag',
        payload: true
      });
      await  dispatch({
        type: 'global/inForceFlag',
        payload: true
      });
    }
  }

  RefreshComment=()=>{
    this.props.createBusinessActivityDtl();
  }

  // 選択した人のメールアドレスを取得します
  onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      caseNmEdit:e.target.value.toString(),
    });
  };

  // メールアドレスを変更
  submitCaseNm = async() => {
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {dispatch, user, bBusActHeadData} = this.props;
    const caseNm = this.state.caseNmEdit;
    const {busActId} = bBusActHeadData
    const loginUserCd = user.currentUser.userid;
    await dispatch({
      type: 'BusinessActivities/fetchUpdateCaseNm',
      payload: {
        loginUserCd
      },
      payload1: {
        caseNm
      },
      payload2: {
        busActId
      },
    });
    // case情報条件によってデータを取得
    await  dispatch({
      type: 'BusinessActivities/fetchCaseList',
      payload: { userCdList:this.props.userCdList,userOrgCdList:this.props.orgIdList},
    });

    if (this.props.resultFlag) {
      this.props.updateBusinessActivity();
    }
    this.setState({
      editFlag: false,
    });
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
  };

  // 変更メールアドレスを閉じます
  cancelCaseNm = () => {
    const { bBusActHeadData } = this.props;
    this.setState({
      editFlag: false,
      caseNmEdit:bBusActHeadData.caseNm,
    });
  };


// 年変更を表示する場合、メッセージボックスを表示します
  showModal = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { bBusActHeadData } = this.props;
    this.setState({
      editFlag:true,
      caseNmEdit:bBusActHeadData.caseNm,
    })
  };

  commonPageDisplay= async (dialogBoxFlag: boolean, disableButton: boolean, inForceFlag: boolean, uploadFileFlag: boolean) => {
    const {dispatch} = this.props;
    await dispatch({
      type: 'global/dialogBoxFlag',
      payload: dialogBoxFlag
    });
    await dispatch({
      type: 'global/disableButton',
      payload: disableButton
    });
    await dispatch({
      type: 'global/inForceFlag',
      payload: inForceFlag
    });
    await dispatch({
      type: 'global/uploadFileFlag',
      payload: uploadFileFlag
    });
  }


  render() {
    // @ts-ignore
    const { BusinessActivities,bBusActHeadData,contentType,currentUser,dispatch} = this.props;
    const  {showUplodFiles,editorRef,status,initialValue} = this.state;

    // 文件上传
    const uploadProps= {
      name: 'file',
      action: `${HttpUrlStrUplod}/file`,
      data: {categoryId:"1"},
      headers: {
        authorization: 'authorization-text',
      },
      defaultFileList:[],
      // @ts-ignore
      onChange:async ({ file, fileList })=>{
        console.log("uploadProps->onChange")
        console.log(file);
        console.log(fileList);
        this.setState({
          showUplodFiles:fileList
        })
        if(file.status === 'removed' || file.status === "done") {

          if (file.status === "done" && file.response.result){
            this.setState({
              uplodFiles:fileList
            })
           await this.commonPageDisplay(true, true, true,true);
          }else if (file.status === 'removed'){
            this.setState({
              uplodFiles:fileList
            })
          }else if (!file.response.result) {
            this.setState({
              showUplodFiles,
            })
            message.error(formatMessage({id: 'common.business.activities.upload.error'}));
          }
        }else if(file.status === "error"){
          this.setState({
            showUplodFiles,
          })
          message.error(formatMessage({id: 'common.business.activities.upload.error'}));
        }
      },
      // @ts-ignore
      onRemove: async file => {
        const fileList = this.state.showUplodFiles.length
        if(fileList===1){
          await this.commonPageDisplay(false, false, false,false);
       /*   dispatch({
            type: 'global/dialogBoxFlag',
            payload: false
          });
          dispatch({
            type: 'global/inForceFlag',
            payload: false
          }); */
        }
        console.log(file)
        // setUplodFiles(file)
      }
    };
    const formItemLayout = {
     // labelCol: { span: 7 },
      wrapperCol: { span: 24 },
    }
    const itemLayout ={labelCol: {style: {width:"auto"} }};
    const itemLayoutLast ={labelCol: {style: {width:70} }};
    const caseScreenHeight = window.screen.height - 460;

    // @ts-ignore
    // @ts-ignore
    return (
      <div>
        <Row style={{paddingTop:10,paddingBottom:10}}>
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
          <Form
            {...formItemLayout}
            layout="inline">
            <Form.Item {...itemLayout} label={formatMessage({ id: 'common.business.activities.staff' })} className={classNames(styles.styleFont)}>
              <span>{bBusActHeadData.userNm}</span>
            </Form.Item>
            <Form.Item {...itemLayout} label={formatMessage({ id: 'common.business.activities.customerName' })} className={classNames(styles.styleFont)}>
              <span>{bBusActHeadData.cstmrNm}</span>
            </Form.Item>
            <Form.Item {...itemLayout} label={formatMessage({ id: 'common.business.activities.endUser' })} className={classNames(styles.styleFont)}>
              <span>{bBusActHeadData.endUserNm}</span>
            </Form.Item>
            <Form.Item {...itemLayout} label={formatMessage({ id: 'common.business.activities.createDate' })} className={classNames(styles.styleFont)}>
              <span>{bBusActHeadData.caseCreatedDt}</span>
            </Form.Item>
            <Form.Item {...itemLayoutLast} label={formatMessage({ id: 'common.business.activities.status' })} className={classNames(styles.styleFont)}>
              {currentUser.inputUserCds.indexOf(bBusActHeadData.userCd) != -1
                ?
                <div>
                  <Select  showSearch allowClear className={styles.activitiesSearchItem}
                           onChange={this.onStatusChange}
                           value={status}>
                    {this.getStatusOption(BusinessActivities.codeValueList)}
                  </Select>
                  <Tooltip title={formatMessage({ id: 'common.business.activities.save.status' })} color='#FAD460'>
                    <Button shape="circle"  disabled={this.props.global.disableButton===true || !(this.props.global.uploadFileFlag===false && this.props.global.editorMarkDownFlag===false)} icon={<SaveOutlined  />} onClick={()=>this.caseStatusSave()} />
                  </Tooltip>
              </div>
                :
                <div>
                  <Select disabled  showSearch allowClear className={styles.activitiesSearchItem}
                           onChange={this.onStatusChange}
                           value={status}>
                    {this.getStatusOption(BusinessActivities.codeValueList)}
                  </Select>
                </div>
              }
            </Form.Item>

            <Form.Item {...itemLayoutLast} label={formatMessage({ id: 'common.business.activities.case' })} className={classNames(styles.styleFont)}>
              {currentUser.inputUserCds.indexOf(bBusActHeadData.userCd) != -1
                  ?
                     // @ts-ignore
                    this.state.editFlag ?
                      <div style={{width:"max-content"}}>
                        <Input  value={this.state.caseNmEdit} onChange={this.onChange} style={{width:'70%'}}/>
                        <Space size = {0}>
                          <CheckOutlined onClick={() => this.submitCaseNm()} />
                          <CloseOutlined onClick={() => this.cancelCaseNm()} />
                        </Space>
                      </div>
                      :
                      <div style={{width:"max-content"}}>
                        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                        <label>{bBusActHeadData.caseNm}</label>

                        <Tooltip
                          placement="rightBottom"
                          title={formatMessage({ id: 'actualityForecastBottom.tooltip.edit' })}
                          color='yellow'>
                          <Button shape="circle" disabled={this.props.global.disableButton===true || !(this.props.global.uploadFileFlag===false && this.props.global.editorMarkDownFlag===false)} icon={<EditOutlined  />} onClick={()=>this.showModal()} />
                        </Tooltip>
                      </div>
                  :
                  <div style={{width:"max-content"}}>
                    {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                    <label>{bBusActHeadData.caseNm}</label>
                    <Tooltip
                      placement="rightBottom"
                      title={formatMessage({ id: 'actualityForecastBottom.tooltip.edit' })}
                      color='yellow'>
                      <Button shape="circle" disabled icon={<EditOutlined  />} onClick={()=>this.showModal()} />
                    </Tooltip>
                  </div>
              }

              {/* <img src={setting} alt="" data-tip={formatMessage({ id: 'homepage.basic.SetDisplayitem' })}  data-place = "bottom" data-type='light' data-class={styles.Suspensionframe1} style={{position: 'absolute', left: '30%', bottom: '25%', fontSize: '20px', color: '#003D82' }}  onClick={this.showModal}/>
                <ReactTooltip /> */}
            </Form.Item>

          </Form>
          </Col>
          {/* <Col xl={4} lg={4} md={4} sm={4} xs={4}> */}
          {/*  <Form.Item label={formatMessage({ id: 'common.business.activities.staff' })}> */}
          {/*    <span>{bBusActHeadData.cstmrNm}</span> */}
          {/*  </Form.Item> */}
          {/* </Col> */}
          {/* <Col xl={4} lg={4} md={4} sm={4} xs={4}> */}
          {/*  <Form.Item label={formatMessage({ id: 'common.business.activities.customerName' })}> */}
          {/*    <span>{bBusActHeadData.cstmrNm}</span> */}
          {/*  </Form.Item> */}
          {/* </Col> */}
          {/* <Col xl={4} lg={4} md={4} sm={4} xs={4}> */}
          {/*  <Form.Item label={formatMessage({ id: 'common.business.activities.endUser' })}> */}
          {/*    <span>{bBusActHeadData.endUserNm}</span> */}
          {/*  </Form.Item> */}
          {/* </Col> */}
          {/* <Col xl={4} lg={4} md={4} sm={4} xs={4}> */}
          {/*  <Form.Item label={formatMessage({ id: 'common.business.activities.createDate' })}> */}
          {/*    <span>{bBusActHeadData.caseCreatedDt}</span> */}
          {/*  </Form.Item> */}
          {/* </Col> */}
          {/* <Col xl={6} lg={6} md={6} sm={6} xs={6}> */}
          {/*  <Form.Item label={formatMessage({ id: 'common.business.activities.status' })}> */}
          {/*    <Select  showSearch allowClear className={styles.activitiesSearchItem} */}
          {/*            onChange={this.onStatusChange} */}
          {/*            value={status}> */}
          {/*      {this.getStatusOption(BusinessActivities.codeValueList)} */}
          {/*    </Select> */}
          {/*    <Tooltip title={formatMessage({ id: 'common.business.activities.save.status' })}> */}
          {/*      <Button shape="circle" icon={<SaveOutlined  />} onClick={()=>this.caseStatusSave()}></Button> */}
          {/*    </Tooltip> */}
          {/*  </Form.Item> */}
          {/* </Col> */}
        </Row>
        <div style= {{height:caseScreenHeight,overflowY:'scroll'}}>
        <Row>
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            <Content className={undefined !== bBusActHeadData.dtlDataList&& bBusActHeadData.dtlDataList.length > 0?styles.editActivitiesView:""}>
              {this.getCaseBusinesActivitieContent(bBusActHeadData.dtlDataList, contentType)}
            </Content>
          </Col>
        </Row>
        {currentUser.inputUserCds.indexOf(bBusActHeadData.userCd) != -1?
          this.props.global.saveButtonFlag ===false ?
              <div>
                <Row>
                  <Upload fileList={showUplodFiles} {...uploadProps}>
                    {showUplodFiles.length>=10?"": <Button  icon={<UploadOutlined />}>{formatMessage({id: 'common.business.activities.upload'})}</Button>}
                  </Upload>
                </Row>
                <Row style={{paddingTop:10}}>
                  <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                    <Markdown newCloseFlag={this.props.global.newCloseFlag}  disableButton={this.props.global.disableButton} dispatch = {this.props.dispatch} initialEditType="wysiwyg" initialValue={initialValue} MarkdownRef={editorRef}/>
                  </Col>
                </Row>
                <Row>
                  <div className={styles.addCommentCreateBtn}>
                    <Button type="primary"  disabled={this.props.global.disableButton  && this.props.global.saveButtonFlag}  onClick={()=>this.onAddBusinesActivitieDtlBtn(bBusActHeadData)} >{formatMessage({id: 'common.business.activities.ok'})}</Button>
                  </div>
                </Row>
              </div>
              :<div/>
          :""}
        </div>
      </div>
    );
  }
}

export default connect(
  ({ BusinessActivities,user,global}: {BusinessActivities: BusActData,user:ConnectState,global:GlobalModelState}) => ({
    resultFlag: BusinessActivities.resultFlag,
    user,
    global,
  }),
)(EditBusinesActivitie);
