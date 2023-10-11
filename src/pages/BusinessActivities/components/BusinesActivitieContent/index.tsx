import {Button, Comment, Form, Row, Col, Upload, Modal, message} from 'antd';
import React, {Dispatch, useState} from 'react';
import styles from "./index.less";
import {formatMessage} from "@@/plugin-locale/localeExports";
import {UploadOutlined, ExclamationCircleOutlined} from "@ant-design/icons";
import Markdown from "@/pages/BusinessActivities/components/Markdown/editorMarkdown";
import ViewerMarkdown from "@/pages/BusinessActivities/components/Markdown/viewerMarkdown";
import {CurrentUser} from "@/models/user";
import {
  BusActData,
  BusActDtlInsertDataType,
  BusActHedDtlDataType,
  BusActInfoUpdateParamType
} from "@/pages/BusinessActivities/data";
import {HttpUrlStrUplod} from "@/utils/request";
import {connect} from "umi";
import "@/utils/messageConfig";
import {GlobalModelState} from "@/models/global";



export interface BusinesActivitieContentProps {
  businesActivitieInfo: BusActHedDtlDataType;
  businesActivitieType: string;
  currentUser:CurrentUser;
  dispatch:Dispatch<any>;
  RefreshComment:any;
  deleteComment:any;
  resultFlag:boolean;
  dispatch:Dispatch;
  global:GlobalModelState;

}

const BusinesActivitieContent: React.FC<BusinesActivitieContentProps> = (props) => {
  const {
    businesActivitieInfo,
    businesActivitieType,
    children,
    currentUser,
    dispatch,
    global,
  }=props;

  let files: any[] | (() => any[]) = [];
  if (null !== businesActivitieInfo || undefined !== businesActivitieInfo){
    null === businesActivitieInfo.addFileUrl1 || undefined === businesActivitieInfo.addFileUrl1 || "" === businesActivitieInfo.addFileUrl1?null:files.push(
      {uid:"1", name: businesActivitieInfo.addFileNm1,status: 'done',url:  businesActivitieInfo.addFileUrl1,
      response:{data:{uid:"1", name: businesActivitieInfo.addFileNm1,status: 'done',url: businesActivitieInfo.addFileUrl1}}})
    null === businesActivitieInfo.addFileUrl2 || undefined === businesActivitieInfo.addFileUrl2|| "" === businesActivitieInfo.addFileUrl2?null:files.push(
      {uid:"2", name: businesActivitieInfo.addFileNm2,status: 'done',url:  businesActivitieInfo.addFileUrl2,
        response:{data:{uid:"2", name: businesActivitieInfo.addFileNm2,status: 'done',url: businesActivitieInfo.addFileUrl2}}})
    null === businesActivitieInfo.addFileUrl3 || undefined === businesActivitieInfo.addFileUrl3|| "" === businesActivitieInfo.addFileUrl3?null:files.push(
      {uid:"3", name: businesActivitieInfo.addFileNm3,status: 'done',url:  businesActivitieInfo.addFileUrl3,
        response:{data:{uid:"3", name: businesActivitieInfo.addFileNm3,status: 'done',url: businesActivitieInfo.addFileUrl3}}})
    null === businesActivitieInfo.addFileUrl4 || undefined === businesActivitieInfo.addFileUrl4|| "" === businesActivitieInfo.addFileUrl4?null:files.push(
      {uid:"4", name: businesActivitieInfo.addFileNm4,status: 'done',url:  businesActivitieInfo.addFileUrl4,
        response:{data:{uid:"4", name: businesActivitieInfo.addFileNm4,status: 'done',url: businesActivitieInfo.addFileUrl4}}})
    null === businesActivitieInfo.addFileUrl5 || undefined === businesActivitieInfo.addFileUrl5|| "" === businesActivitieInfo.addFileUrl5?null:files.push(
      {uid:"5", name: businesActivitieInfo.addFileNm5,status: 'done',url:  businesActivitieInfo.addFileUrl5,
        response:{data:{uid:"5", name: businesActivitieInfo.addFileNm5,status: 'done',url: businesActivitieInfo.addFileUrl5}}})
    null === businesActivitieInfo.addFileUrl6 || undefined === businesActivitieInfo.addFileUrl6|| "" === businesActivitieInfo.addFileUrl6?null:files.push(
      {uid:"6", name: businesActivitieInfo.addFileNm6,status: 'done',url:  businesActivitieInfo.addFileUrl6,
        response:{data:{uid:"6", name: businesActivitieInfo.addFileNm6,status: 'done',url: businesActivitieInfo.addFileUrl6}}})
    null === businesActivitieInfo.addFileUrl7 || undefined === businesActivitieInfo.addFileUrl7|| "" === businesActivitieInfo.addFileUrl7?null:files.push(
      {uid:"7", name: businesActivitieInfo.addFileNm7,status: 'done',url:  businesActivitieInfo.addFileUrl7,
        response:{data:{uid:"7", name: businesActivitieInfo.addFileNm7,status: 'done',url: businesActivitieInfo.addFileUrl7}}})
    null === businesActivitieInfo.addFileUrl8 || undefined === businesActivitieInfo.addFileUrl8|| "" === businesActivitieInfo.addFileUrl8?null:files.push(
      {uid:"8", name: businesActivitieInfo.addFileNm8,status: 'done',url:  businesActivitieInfo.addFileUrl8,
        response:{data:{uid:"8", name: businesActivitieInfo.addFileNm8,status: 'done',url: businesActivitieInfo.addFileUrl8}}})
    null === businesActivitieInfo.addFileUrl9 || undefined === businesActivitieInfo.addFileUrl9|| "" === businesActivitieInfo.addFileUrl9?null:files.push(
      {uid:"9", name: businesActivitieInfo.addFileNm9,status: 'done',url:  businesActivitieInfo.addFileUrl9,
        response:{data:{uid:"9", name: businesActivitieInfo.addFileNm9,status: 'done',url: businesActivitieInfo.addFileUrl9}}})
    null === businesActivitieInfo.addFileUrl10 || undefined === businesActivitieInfo.addFileUrl10|| "" === businesActivitieInfo.addFileUrl10?null:files.push(
      {uid:"10", name: businesActivitieInfo.addFileNm10,status: 'done',url:  businesActivitieInfo.addFileUrl10,
        response:{data:{uid:"10", name: businesActivitieInfo.addFileNm10,status: 'done',url: businesActivitieInfo.addFileUrl10}}})

  }
  const [initUplodFiles,setInitUplodFiles] = useState(files);
  const [showUplodFiles,setShowUplodFiles] = useState(files);
  const [uplodFiles,setUplodFiles] = useState(files);
  const [editorRef ] = useState(React.createRef());
  const [comentEditorRef] = useState(React.createRef());
  const [operationType,setOperationType] = useState("view")

  const [commentUplodFiles,setCommentUplodFiles] = useState([]);
  const [showCommentUplodFiles,setShowCommentUplodFiles] = useState([]);
  const [visible,setVisible] = useState(false);

  const onDeleteBtnClick=async (businesActivitieInfo:BusActHedDtlDataType)=>{
    console.log("onDeleteBtnClick")
    setVisible(true)
    Modal.confirm({
      title: formatMessage({id: 'common.business.activities.delete.alert'}),
      visible:visible,
      icon: <ExclamationCircleOutlined />,
      content: "",
      centered:true,
      okText: formatMessage({id: 'app.common.OK'}),
      cancelText: formatMessage({id: 'app.common.Cancel'}),
      // 这里注意要用箭头函数, 否则this不生效
      onOk: async () => {
        let busActInfoDeleteParam={ busActId: "", busActDtlIds:[]}

        if (null !== businesActivitieInfo && undefined !== businesActivitieInfo ){
          // @ts-ignore
          busActInfoDeleteParam.busActId = businesActivitieInfo.busActId;
          if (null !== businesActivitieInfo.subList && undefined !== businesActivitieInfo.subList && businesActivitieInfo.subList.length >0){
            getDelectBusAct(businesActivitieInfo.subList,busActInfoDeleteParam)
          }
          else {
            // @ts-ignore
            busActInfoDeleteParam.busActDtlIds.push(businesActivitieInfo.busActDtlId);
          }

          console.log(busActInfoDeleteParam)
          const deleteModel = JSON.stringify(busActInfoDeleteParam);
          const { dispatch } = props;
          if (dispatch) {
            await  dispatch({
              type: 'BusinessActivities/deleteBusinessActivity',
              payload:deleteModel
            });
            if (props.resultFlag){
              props.deleteComment();
            }
          }
          setVisible(false)
        }
      },
      onCancel: () => {
        setVisible(false)
      },
    });
  }

  const commonPageDisplay= async (dialogBoxFlag: boolean, disableButton: boolean, inForceFlag: boolean, saveButtonFlag: boolean) => {
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
      type: 'global/saveButtonFlag',
      payload: saveButtonFlag
    });
  }

  const  onEditBtnClick= async(key: React.MouseEvent<HTMLElement>)=>{
    await commonPageDisplay(true,true,true,true);
    await console.log("************************:2->",props.global.disableButton)
    await dispatch({
      type: 'global/editorMarkDownFlag',
      payload: false
    });
     await dispatch({
      type: 'global/uploadFileFlag',
      payload: false
    });
    await  console.log("************************:3->",props.global.disableButton)
    await setOperationType("edit")
  }

  const getDelectBusAct= (dataList: BusActHedDtlDataType[], busActInfoDeleteParam: { busActId: string; busActDtlIds: any[] })=>{
      dataList.forEach((item)=>{
        busActInfoDeleteParam.busActDtlIds.push(item.busActDtlId);
        if (null !== item.subList && undefined !== item.subList && item.subList.length >0){
          getDelectBusAct(item.subList, busActInfoDeleteParam)
        }
      });
  }

  const onCommentClick=async (key: React.MouseEvent<HTMLElement>)=>{
   await commonPageDisplay(true,true,true,true);
    await  dispatch({
      type: 'global/editorMarkDownFlag',
      payload: false
    });
    await dispatch({
      type: 'global/uploadFileFlag',
      payload: false
    });
    setOperationType("comment")
  }

  const OnMarkdownEditOk = async (businesActivitieInfo: BusActHedDtlDataType)=>{

    console.log("OnMarkdownEditOk")
    // @ts-ignore
    if (null === editorRef || undefined === editorRef || null === editorRef.current || undefined === editorRef.current &&
      // @ts-ignore
      null === editorRef.current.getInstance() || undefined === editorRef.current.getInstance() || "" === editorRef.current.getInstance().getMarkdown())
    {
      message.info(formatMessage({id: 'business.activities.input.busAct.detail'}));
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const { dispatch } = props;



    if (null !== editorRef && undefined !== editorRef &&
      null !== editorRef.current && undefined !== editorRef.current &&
      // @ts-ignore
      null !== editorRef.current.getInstance() && undefined !== editorRef.current.getInstance())
    {
      // @ts-ignore
      businesActivitieInfo.addFileUrl1 = uplodFiles.length>=1?uplodFiles[1-1].response.data.url:"";
      // @ts-ignore
      businesActivitieInfo.addFileUrl2 = uplodFiles.length>=2?uplodFiles[2-1].response.data.url:"";
      // @ts-ignore
      businesActivitieInfo.addFileUrl3 = uplodFiles.length>=3?uplodFiles[3-1].response.data.url:"";
      // @ts-ignore
      businesActivitieInfo.addFileUrl4 = uplodFiles.length>=4?uplodFiles[4-1].response.data.url:"";
      // @ts-ignore
      businesActivitieInfo.addFileUrl5 = uplodFiles.length>=5?uplodFiles[5-1].response.data.url:"";
      // @ts-ignore
      businesActivitieInfo.addFileUrl6 = uplodFiles.length>=6?uplodFiles[6-1].response.data.url:"";
      // @ts-ignore
      businesActivitieInfo.addFileUrl7 = uplodFiles.length>=7?uplodFiles[7-1].response.data.url:"";
      // @ts-ignore
      businesActivitieInfo.addFileUrl8 = uplodFiles.length>=8?uplodFiles[8-1].response.data.url:"";
      // @ts-ignore
      businesActivitieInfo.addFileUrl9 = uplodFiles.length>=9?uplodFiles[9-1].response.data.url:"";
      // @ts-ignore
      businesActivitieInfo.addFileUrl10 = uplodFiles.length>=10?uplodFiles[10-1].response.data.url:"";
      // @ts-ignore
      businesActivitieInfo.addFileNm1 = uplodFiles.length>=1?uplodFiles[1-1].response.data.name:"";
      // @ts-ignore
      businesActivitieInfo.addFileNm2 = uplodFiles.length>=2?uplodFiles[2-1].response.data.name:"";
      // @ts-ignore
      businesActivitieInfo.addFileNm3 = uplodFiles.length>=3?uplodFiles[3-1].response.data.name:"";
      // @ts-ignore
      businesActivitieInfo.addFileNm4 = uplodFiles.length>=4?uplodFiles[4-1].response.data.name:"";
      // @ts-ignore
      businesActivitieInfo.addFileNm5 = uplodFiles.length>=5?uplodFiles[5-1].response.data.name:"";
      // @ts-ignore
      businesActivitieInfo.addFileNm6 = uplodFiles.length>=6?uplodFiles[6-1].response.data.name:"";
      // @ts-ignore
      businesActivitieInfo.addFileNm7 = uplodFiles.length>=7?uplodFiles[7-1].response.data.name:"";
      // @ts-ignore
      businesActivitieInfo.addFileNm8 = uplodFiles.length>=8?uplodFiles[8-1].response.data.name:"";
      // @ts-ignore
      businesActivitieInfo.addFileNm9 = uplodFiles.length>=9?uplodFiles[9-1].response.data.name:"";
      // @ts-ignore
      businesActivitieInfo.addFileNm10 = uplodFiles.length>=10?uplodFiles[10-1].response.data.name:"";

      // @ts-ignore
      console.log( editorRef.current.getInstance().getMarkdown())
      // @ts-ignore
      businesActivitieInfo.busActDtl = editorRef.current.getInstance().getMarkdown();
      businesActivitieInfo.busActDtl = businesActivitieInfo.busActDtl.replace(/(?:[\n])/g,'\r\n');
      //businesActivitieInfo.busActDtl = businesActivitieInfo.busActDtl.replaceAll(`</table><p>\r\n</p><p>\r\n</p>`,`</table>`);
      //businesActivitieInfo.busActDtl = businesActivitieInfo.busActDtl.replaceAll("</table>", `</table><p>\r\n</p>`);

      const businesActivitieInfoParam: BusActInfoUpdateParamType = { busActId:businesActivitieInfo.busActId, busActDtlId:businesActivitieInfo.busActDtlId,
        busActDtl:businesActivitieInfo.busActDtl, addFileUrl1:businesActivitieInfo.addFileUrl1.replace(HttpUrlStrUplod,""), addFileUrl2:businesActivitieInfo.addFileUrl2.replace(HttpUrlStrUplod,""),
        addFileUrl3:businesActivitieInfo.addFileUrl3.replace(HttpUrlStrUplod,""),addFileUrl4:businesActivitieInfo.addFileUrl4.replace(HttpUrlStrUplod,""),addFileUrl5:businesActivitieInfo.addFileUrl5.replace(HttpUrlStrUplod,""),
        addFileUrl6:businesActivitieInfo.addFileUrl6.replace(HttpUrlStrUplod,""),addFileUrl7:businesActivitieInfo.addFileUrl7.replace(HttpUrlStrUplod,""),addFileUrl8:businesActivitieInfo.addFileUrl8.replace(HttpUrlStrUplod,""),
        addFileUrl9:businesActivitieInfo.addFileUrl9.replace(HttpUrlStrUplod,""),addFileUrl10:businesActivitieInfo.addFileUrl10.replace(HttpUrlStrUplod,""),
        addFileNm1:businesActivitieInfo.addFileNm1, addFileNm2:businesActivitieInfo.addFileNm2,
        addFileNm3:businesActivitieInfo.addFileNm3,addFileNm4:businesActivitieInfo.addFileNm4,addFileNm5:businesActivitieInfo.addFileNm5,
        addFileNm6:businesActivitieInfo.addFileNm6,addFileNm7:businesActivitieInfo.addFileNm7,addFileNm8:businesActivitieInfo.addFileNm8,
        addFileNm9:businesActivitieInfo.addFileNm9,addFileNm10:businesActivitieInfo.addFileNm10
      };

      const businesActivitieInfoModel = JSON.stringify(businesActivitieInfoParam);
      await commonPageDisplay(false,false,false,false);
      await dispatch({
        type: 'global/editorMarkDownFlag',
        payload: false
      });
      await dispatch({
        type: 'global/uploadFileFlag',
        payload: false
      });
      await setOperationType("view")
      if (dispatch) {
        await  dispatch({
          type: 'BusinessActivities/updateBusinessActivityDtl',
          payload:businesActivitieInfoModel
        });
      }
      props.RefreshComment();
      setShowUplodFiles([]);
      // @ts-ignore
    ///  businesActivitieInfo.busActDtl = editorRef.current.getInstance().getMarkdown()
    }else {

    }

 /*   dispatch({
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
    });
    dispatch({
      type: 'global/saveButtonFlag',
      payload: true
    }); */


  }
  const OnDeleteFile = async (businesActivitieInfo: BusActHedDtlDataType,uplodFileList)=>{

    console.log("OnDeleteFile")

      // @ts-ignore
      businesActivitieInfo.addFileUrl1 = uplodFileList.length>=1?uplodFileList[1-1].response.data.url:"";
      // @ts-ignore
      businesActivitieInfo.addFileUrl2 = uplodFileList.length>=2?uplodFileList[2-1].response.data.url:"";
      // @ts-ignore
      businesActivitieInfo.addFileUrl3 = uplodFileList.length>=3?uplodFileList[3-1].response.data.url:"";
      // @ts-ignore
      businesActivitieInfo.addFileUrl4 = uplodFileList.length>=4?uplodFileList[4-1].response.data.url:"";
      // @ts-ignore
      businesActivitieInfo.addFileUrl5 = uplodFileList.length>=5?uplodFileList[5-1].response.data.url:"";
      // @ts-ignore
      businesActivitieInfo.addFileUrl6 = uplodFileList.length>=6?uplodFileList[6-1].response.data.url:"";
      // @ts-ignore
      businesActivitieInfo.addFileUrl7 = uplodFileList.length>=7?uplodFileList[7-1].response.data.url:"";
      // @ts-ignore
      businesActivitieInfo.addFileUrl8 = uplodFileList.length>=8?uplodFileList[8-1].response.data.url:"";
      // @ts-ignore
      businesActivitieInfo.addFileUrl9 = uplodFileList.length>=9?uplodFileList[9-1].response.data.url:"";
      // @ts-ignore
      businesActivitieInfo.addFileUrl10 = uplodFileList.length>=10?uplodFileList[10-1].response.data.url:"";
      // @ts-ignore
      businesActivitieInfo.addFileNm1 = uplodFileList.length>=1?uplodFileList[1-1].response.data.name:"";
      // @ts-ignore
      businesActivitieInfo.addFileNm2 = uplodFileList.length>=2?uplodFileList[2-1].response.data.name:"";
      // @ts-ignore
      businesActivitieInfo.addFileNm3 = uplodFileList.length>=3?uplodFileList[3-1].response.data.name:"";
      // @ts-ignore
      businesActivitieInfo.addFileNm4 = uplodFileList.length>=4?uplodFileList[4-1].response.data.name:"";
      // @ts-ignore
      businesActivitieInfo.addFileNm5 = uplodFileList.length>=5?uplodFileList[5-1].response.data.name:"";
      // @ts-ignore
      businesActivitieInfo.addFileNm6 = uplodFileList.length>=6?uplodFileList[6-1].response.data.name:"";
      // @ts-ignore
      businesActivitieInfo.addFileNm7 = uplodFileList.length>=7?uplodFileList[7-1].response.data.name:"";
      // @ts-ignore
      businesActivitieInfo.addFileNm8 = uplodFileList.length>=8?uplodFileList[8-1].response.data.name:"";
      // @ts-ignore
      businesActivitieInfo.addFileNm9 = uplodFileList.length>=9?uplodFileList[9-1].response.data.name:"";
      // @ts-ignore
      businesActivitieInfo.addFileNm10 = uplodFileList.length>=10?uplodFileList[10-1].response.data.name:"";

      const businesActivitieInfoParam: BusActInfoUpdateParamType = {
        busActDtl:"",
        busActId:businesActivitieInfo.busActId, busActDtlId:businesActivitieInfo.busActDtlId,
        addFileUrl1:businesActivitieInfo.addFileUrl1, addFileUrl2:businesActivitieInfo.addFileUrl2,
        addFileUrl3:businesActivitieInfo.addFileUrl3,addFileUrl4:businesActivitieInfo.addFileUrl4,addFileUrl5:businesActivitieInfo.addFileUrl5,
        addFileUrl6:businesActivitieInfo.addFileUrl6,addFileUrl7:businesActivitieInfo.addFileUrl7,addFileUrl8:businesActivitieInfo.addFileUrl8,
        addFileUrl9:businesActivitieInfo.addFileUrl9,addFileUrl10:businesActivitieInfo.addFileUrl10,
        addFileNm1:businesActivitieInfo.addFileNm1, addFileNm2:businesActivitieInfo.addFileNm2,
        addFileNm3:businesActivitieInfo.addFileNm3,addFileNm4:businesActivitieInfo.addFileNm4,addFileNm5:businesActivitieInfo.addFileNm5,
        addFileNm6:businesActivitieInfo.addFileNm6,addFileNm7:businesActivitieInfo.addFileNm7,addFileNm8:businesActivitieInfo.addFileNm8,
        addFileNm9:businesActivitieInfo.addFileNm9,addFileNm10:businesActivitieInfo.addFileNm10
      };

      const businesActivitieInfoModel = JSON.stringify(businesActivitieInfoParam);

      const { dispatch } = props;
      if (dispatch) {
        await  dispatch({
          type: 'BusinessActivities/deleteBusinessActivityFile',
          payload:businesActivitieInfoModel
        });
      }
  }
  const OnMarkdownCommentOk= async (businesActivitieInfo: BusActHedDtlDataType)=> {

    // @ts-ignore
    if (null === comentEditorRef || undefined === comentEditorRef || null === comentEditorRef.current || undefined === comentEditorRef.current &&
      // @ts-ignore
      null === comentEditorRef.current.getInstance() || undefined === comentEditorRef.current.getInstance() || "" === comentEditorRef.current.getInstance().getMarkdown())
    {
      message.info(formatMessage({id: 'business.activities.input.busAct.detail'}));
      return;
    }
    setOperationType("view")
    const insertBusActHedDtlData: BusActDtlInsertDataType=
      {//@ApiModelProperty(value="'営業活動ID'")
        busActId:"",
        //@ApiModelProperty(value="'営業活動明細ID' ")
        busActDtlId:"",
        //@ApiModelProperty(value=" '上位営業活動ID' ")
        parBusActDtlId:"",
        //@ApiModelProperty(value="'営業活動詳細' ")
        busActDtl:"",
        //@ApiModelProperty(value="'添付ファイル1' ")
        addFileUrl1:"",
        //@ApiModelProperty(value="'添付ファイル2' ")
        addFileUrl2:"",
        //@ApiModelProperty(value="'添付ファイル3' ")
        addFileUrl3:"",
        //@ApiModelProperty(value="'添付ファイル4' ")
        addFileUrl4:"",
        //@ApiModelProperty(value="'添付ファイル5' ")
        addFileUrl5:"",
        //@ApiModelProperty(value="'添付ファイル6' ")
        addFileUrl6:"",
        //@ApiModelProperty(value="'添付ファイル7' ")
        addFileUrl7:"",
        //@ApiModelProperty(value="'添付ファイル8' ")
        addFileUrl8:"",
        //@ApiModelProperty(value="'添付ファイル9' ")
        addFileUrl9:"",
        //@ApiModelProperty(value="'添付ファイル10' ")
        addFileUrl10:"",
        // @ApiModelProperty(value=" '添付ファイル名称1' ")
        addFileNm1:"",
        // @ApiModelProperty(value=" '添付ファイル名称2' ")
        addFileNm2:"",
        // @ApiModelProperty(value=" '添付ファイル名称3' ")
        addFileNm3:"",
        // @ApiModelProperty(value=" '添付ファイル名称4' ")
        addFileNm4:"",
        // @ApiModelProperty(value=" '添付ファイル名称5' ")
        addFileNm5:"",
        // @ApiModelProperty(value=" '添付ファイル名称6' ")
        addFileNm6:"",
        // @ApiModelProperty(value=" '添付ファイル名称7' ")
        addFileNm7:"",
        // @ApiModelProperty(value=" '添付ファイル名称8' ")
        addFileNm8:"",
        // @ApiModelProperty(value=" '添付ファイル名称9' ")
        addFileNm9:"",
        // @ApiModelProperty(value=" '添付ファイル10' ")
        addFileNm10:"",
        //@ApiModelProperty(value="'階層' ")
        levels:"",
        //@ApiModelProperty(value="'営業者ユーザID' ")
        busUserCd:"",
      }
    if (null !== comentEditorRef && undefined !== comentEditorRef &&
      null !== comentEditorRef.current && undefined !== comentEditorRef.current &&
      // @ts-ignore
      null !== comentEditorRef.current.getInstance() && undefined !== comentEditorRef.current.getInstance()) {
      // @ts-ignore
      insertBusActHedDtlData.addFileUrl1 = commentUplodFiles.length >= 1 ? commentUplodFiles[1 - 1].response.data.url : "";
      // @ts-ignore
      insertBusActHedDtlData.addFileUrl2 = commentUplodFiles.length >= 2 ? commentUplodFiles[2 - 1].response.data.url : "";
      // @ts-ignore
      insertBusActHedDtlData.addFileUrl3 = commentUplodFiles.length >= 3 ? commentUplodFiles[3 - 1].response.data.url : "";
      // @ts-ignore
      insertBusActHedDtlData.addFileUrl4 = commentUplodFiles.length >= 4 ? commentUplodFiles[4 - 1].response.data.url : "";
      // @ts-ignore
      insertBusActHedDtlData.addFileUrl5 = commentUplodFiles.length >= 5 ? commentUplodFiles[5 - 1].response.data.url : "";
      // @ts-ignore
      insertBusActHedDtlData.addFileUrl6 = commentUplodFiles.length >= 6 ? commentUplodFiles[6 - 1].response.data.url : "";
      // @ts-ignore
      insertBusActHedDtlData.addFileUrl7 = commentUplodFiles.length >= 7 ? commentUplodFiles[7 - 1].response.data.url : "";
      // @ts-ignore
      insertBusActHedDtlData.addFileUrl8 = commentUplodFiles.length >= 8 ? commentUplodFiles[8 - 1].response.data.url : "";
      // @ts-ignore
      insertBusActHedDtlData.addFileUrl9 = commentUplodFiles.length >= 9 ? commentUplodFiles[9 - 1].response.data.url : "";
      // @ts-ignore
      insertBusActHedDtlData.addFileUrl10 = commentUplodFiles.length >= 10 ? commentUplodFiles[10 - 1].response.data.url : "";

      // @ts-ignore
      insertBusActHedDtlData.addFileNm1 = commentUplodFiles.length>=1?commentUplodFiles[1-1].response.data.name:"";
      // @ts-ignore
      insertBusActHedDtlData.addFileNm2 = commentUplodFiles.length>=2?commentUplodFiles[2-1].response.data.name:"";
      // @ts-ignore
      insertBusActHedDtlData.addFileNm3 = commentUplodFiles.length>=3?commentUplodFiles[3-1].response.data.name:"";
      // @ts-ignore
      insertBusActHedDtlData.addFileNm4 = commentUplodFiles.length>=4?commentUplodFiles[4-1].response.data.name:"";
      // @ts-ignore
      insertBusActHedDtlData.addFileNm5 = commentUplodFiles.length>=5?commentUplodFiles[5-1].response.data.name:"";
      // @ts-ignore
      insertBusActHedDtlData.addFileNm6 = commentUplodFiles.length>=6?commentUplodFiles[6-1].response.data.name:"";
      // @ts-ignore
      insertBusActHedDtlData.addFileNm7 = commentUplodFiles.length>=7?commentUplodFiles[7-1].response.data.name:"";
      // @ts-ignore
      insertBusActHedDtlData.addFileNm8 = commentUplodFiles.length>=8?commentUplodFiles[8-1].response.data.name:"";
      // @ts-ignore
      insertBusActHedDtlData.addFileNm9 = commentUplodFiles.length>=9?commentUplodFiles[9-1].response.data.name:"";
      // @ts-ignore
      insertBusActHedDtlData.addFileNm10 = commentUplodFiles.length>=10?commentUplodFiles[10-1].response.data.name:"";
      insertBusActHedDtlData.busActId = businesActivitieInfo.busActId;
      insertBusActHedDtlData.busActDtlId = businesActivitieInfo.busActDtlId + 1;
      insertBusActHedDtlData.parBusActDtlId = businesActivitieInfo.busActDtlId
      insertBusActHedDtlData.levels = businesActivitieInfo.levels + 1;
      if (currentUser.userid != null) {
        insertBusActHedDtlData.busUserCd = currentUser.userid;
      }
      // @ts-ignore
      console.log(comentEditorRef.current.getInstance().getMarkdown())
      // @ts-ignore
      insertBusActHedDtlData.busActDtl = comentEditorRef.current.getInstance().getMarkdown();
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
        addFileNm1:insertBusActHedDtlData.addFileNm1, addFileNm2:insertBusActHedDtlData.addFileNm2,
        addFileNm3:insertBusActHedDtlData.addFileNm3,addFileNm4:insertBusActHedDtlData.addFileNm4,addFileNm5:insertBusActHedDtlData.addFileNm5,
        addFileNm6:insertBusActHedDtlData.addFileNm6,addFileNm7:insertBusActHedDtlData.addFileNm7,addFileNm8:insertBusActHedDtlData.addFileNm8,
        addFileNm9:insertBusActHedDtlData.addFileNm9,addFileNm10:insertBusActHedDtlData.addFileNm10,
        levels:insertBusActHedDtlData.levels,
        busUserCd:insertBusActHedDtlData.busUserCd,
        parBusActDtlId:insertBusActHedDtlData.parBusActDtlId,
      };

      // @ts-ignore
      const businesActivitieInfoModel = JSON.stringify(businesActivitieInfoParam);
      console.log("insertBusActHedDtlData")
      console.log(businesActivitieInfoModel)
      const {dispatch} = props;
      if (dispatch) {

        await commonPageDisplay(false,false,false,false);
        await dispatch({
          type: 'global/editorMarkDownFlag',
          payload: false
        });
        await dispatch({
          type: 'global/uploadFileFlag',
          payload: false
        });

        await  dispatch({
          type: 'BusinessActivities/insertBusinessActivityDtl',
          payload: businesActivitieInfoModel
        });
      }
      await props.RefreshComment();
    }


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
        });
        dispatch({
          type: 'global/saveButtonFlag',
          payload: true
        }); */

  }
  // 文件上传
  const uploadProps = {
    name: 'file',
    action: HttpUrlStrUplod+"/file",
    data: {categoryId:"1"},
    headers: {
      authorization: 'authorization-text',
    },
    defaultFileList:showUplodFiles,
    // @ts-ignore
    onChange:({ file, fileList })=>{
      console.log("uploadProps->onChange")
      console.log(file);
      console.log(fileList);
      setShowUplodFiles(fileList);

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

          dispatch({
            type: 'global/uploadFileFlag',
            payload: true
          });
          setUplodFiles(fileList);
        }else if (file.status === 'removed'){
          setShowUplodFiles(fileList)
          setUplodFiles(fileList);
        }else if(!file.response.result){
          let showList = showUplodFiles.filter((item)=>item.uid !== file.uid)
          setShowUplodFiles(showList)
          message.error(formatMessage({id: 'common.business.activities.upload.error'}));
        }
      }else if(file.status === "error"){
        let showList = showUplodFiles.filter((item)=>item.uid !== file.uid)
        setShowUplodFiles(showList)
        message.error(formatMessage({id: 'common.business.activities.upload.error'}));
      }
    },
    // @ts-ignore
    onRemove: file => {
      console.log(file)
      setVisible(true)
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
          console.log(showUplodFiles)
          let showList = showUplodFiles.filter((item)=>item.uid !== file.uid)
          console.log(showList)
          setShowUplodFiles(showList)
          // @ts-ignore
          setUplodFiles(showList);
          setVisible(false);
        },
        onCancel: () => {
          setVisible(false);
        },
      });
      return false;
    }
  };

  const  OnMarkdownCancel=async()=>{
    setShowUplodFiles(initUplodFiles);
    // @ts-ignore
    setUplodFiles(initUplodFiles);
    setShowCommentUplodFiles([]);
    setCommentUplodFiles([]);
    setOperationType("view")
    await commonPageDisplay(false,false,false,false);
    await dispatch({
      type: 'global/editorMarkDownFlag',
      payload: false
    });
    await dispatch({
      type: 'global/uploadFileFlag',
      payload: false
    });
  }

  // 文件上传
  const viewUploadProps = {
    name: 'file',
    action: HttpUrlStrUplod+"/file",
    data: {categoryId:"1"},
    headers: {
      authorization: 'authorization-text',
    },
    defaultFileList:showUplodFiles,
    // @ts-ignore
    onChange:({ file, fileList })=>{
      console.log("uploadProps->onChange")
      console.log(file);
      console.log(fileList);
      setShowUplodFiles(fileList);

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
          setUplodFiles(fileList);
        }else if (file.status === 'removed'){
          setShowUplodFiles(fileList)
          setUplodFiles(fileList);
        }else if(!file.response.result){
          let showList = showUplodFiles.filter((item)=>item.uid !== file.uid)
          setShowUplodFiles(showList)
          message.error(formatMessage({id: 'common.business.activities.upload.error'}));
        }
      }else if(file.status === "error"){
        let showList = showUplodFiles.filter((item)=>item.uid !== file.uid)
        setShowUplodFiles(showList)
        message.error(formatMessage({id: 'common.business.activities.upload.error'}));
      }
    },
    // @ts-ignore
    onRemove: file => {
      console.log(file)
      setVisible(true)
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
          setVisible(false)
          console.log(showUplodFiles)
          let showList = showUplodFiles.filter((item)=>item.uid !== file.uid)
          console.log(showList)
          await OnDeleteFile(businesActivitieInfo,showList)
          if (props.resultFlag)
          {
            setShowUplodFiles(showList)
            // @ts-ignore
            setUplodFiles(showList);
            setInitUplodFiles(showList);
          }
        },
        onCancel: () => {
          setVisible(false)
        },
      });
      return false;
    }
  };

  // 评论文件上传
  const commentUploadProps = {
    name: 'file',
    action: HttpUrlStrUplod+"/file",
    data: {categoryId:"1"},
    headers: {
      authorization: 'authorization-text',
    },
    // @ts-ignore
    onChange:({ file, fileList })=>{
      console.log(file);
      console.log(fileList);
      setShowCommentUplodFiles(fileList)

      if(file.status === 'removed' || file.status === "done") {
        if (file.status === "done" && file.response.result){
          showCommentUplodFiles.forEach((item)=>{
            // @ts-ignore
            if(item.uid === file.uid){
              // @ts-ignore
              item.url = file.response.data.url;
            }
          })
          if (null !== fileList && undefined !== fileList && fileList.length>0){
            fileList.forEach((item: { uid: any; url: any; })=>{
              // @ts-ignore
              if(item.uid === file.uid){
                // @ts-ignore
                item.url = HttpUrlStrUplod+file.response.data.url;
              }
            })
          }
          setCommentUplodFiles(fileList);
        }else if (file.status === 'removed'){
          setCommentUplodFiles(fileList);
        }else if(!file.response.result){
          // @ts-ignore
          let showList = showCommentUplodFiles.filter((item)=>item.uid !== file.uid)
          setShowCommentUplodFiles(showList)
          message.error(formatMessage({id: 'common.business.activities.upload.error'}));
        }
      }else if(file.status === "error"){
        // @ts-ignore
        let showList = showCommentUplodFiles.filter((item)=>item.uid !== file.uid)
        setShowCommentUplodFiles(showList)
        message.error(formatMessage({id: 'common.business.activities.upload.error'}));
      }
    },
    // @ts-ignore
    onRemove: file => {
      console.log(file)
      setVisible(true)
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
          setVisible(false)
          console.log(showCommentUplodFiles)
          // @ts-ignore
          let showList = showCommentUplodFiles.filter((item)=>item.uid !== file.uid)
          console.log(showList)
          setShowCommentUplodFiles(showList)
          // @ts-ignore
          setCommentUplodFiles(showList);
        },
        onCancel: () => {
          setVisible(false)
        },
      });
      return false;
    }
  };

  const viewUploadPropsLayout = {
    showUploadList:{
      showRemoveIcon: false,
      showDownloadIcon: true
    }
  }

  const editUploadProps = {
    showUploadList:{
      showRemoveIcon: true,
      showDownloadIcon: false
    }
  }

  const contentCommentOperation=()=>{
    // @ts-ignore
    if(currentUser.inputUserCds.indexOf(businesActivitieInfo.userCd) !== -1 || businesActivitieInfo.userCd === currentUser.userid){

      if(null === businesActivitieInfo.subList || undefined === businesActivitieInfo.subList || businesActivitieInfo.subList.length <=0){
        return (

          <div>
            <Button  disabled={global.disableButton===true || !(props.global.uploadFileFlag===false && props.global.editorMarkDownFlag===false)} type="primary" onClick={(key)=>onEditBtnClick(key)}>{formatMessage({id: 'common.business.activities.edit'})}</Button>
            <Button  disabled={global.disableButton===true || !(props.global.uploadFileFlag===false && props.global.editorMarkDownFlag===false)} type="primary" onClick={()=>onDeleteBtnClick(businesActivitieInfo)}>{formatMessage({id: 'common.business.activities.delete'})}</Button>
          </div>
        )
      }else {
        return (
          <div>
            <Button disabled={global.disableButton===true || !(props.global.uploadFileFlag===false && props.global.editorMarkDownFlag===false)} type="primary" onClick={(key)=>onEditBtnClick(key)}>{formatMessage({id: 'common.business.activities.edit'})}</Button>
          </div>
        )
      }
    }else
    {
      return (
        <div>
          {businesActivitieInfo.orgGroupId === currentUser.orgGroupId?<Button disabled={global.disableButton===true || !(props.global.uploadFileFlag===false && props.global.editorMarkDownFlag===false)}  type="primary" onClick={(key)=>onCommentClick(key)}>{formatMessage({id: 'common.business.activities.comment'})}</Button>:<div></div>}
        </div>
      )
    }
  }
  // @ts-ignore
  const getOperationInfo=()=>{
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    }
    const itemLayout ={labelCol: {style: {width:150,color:'black'} }};
    if (operationType === "view") {
      return (
        <div>
          <div>
            <Row >
              <Col xl={6} lg={6} md={6} sm={6} xs={6}>
                <Form.Item>
                  <span>{businesActivitieInfo.createdDt}</span>
                </Form.Item>
              </Col>
              {
                businesActivitieType==="edit"?
                  <Col xl={6} lg={6} md={6} sm={6} xs={6} >
                    <Form.Item className={styles.formItemLabel} {...itemLayout}  label={formatMessage({id: 'common.business.activities.staff'})}>
                      <span>{businesActivitieInfo.userNm}</span>
                    </Form.Item>
                  </Col>
                :""
              }
            </Row>
            {
              businesActivitieType==="edit"?"":
                <Form
                  {...formItemLayout}
                  layout={"inline"}  className={styles.contentCommentLeft}>
                    <Form.Item className={styles.formItemLabel} {...itemLayout} label={formatMessage({id: 'common.business.activities.customer'})}>
                      <span>{businesActivitieInfo.cstmrNm}</span>
                    </Form.Item>
                    <Form.Item className={styles.formItemLabel}  {...itemLayout}  label={formatMessage({id: 'common.business.activities.case'})}>
                      <span>{businesActivitieInfo.caseNm}</span>
                    </Form.Item>
                    <Form.Item className={styles.formItemLabel} {...itemLayout}  label={formatMessage({id: 'common.business.activities.staff'})}>
                      <span>{businesActivitieInfo.userNm}</span>
                    </Form.Item>
                </Form>
            }
            <Row>
              {(currentUser.inputUserCds.indexOf(businesActivitieInfo.userCd) !== -1 || businesActivitieInfo.userCd === currentUser.userid)?
                <Upload  {...editUploadProps} {...viewUploadProps} fileList={showUplodFiles}></Upload>
                :<Upload  {...viewUploadPropsLayout} {...uploadProps}></Upload>}
            </Row>
            <Row className={styles.contentCommentLeft}>
              <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                <ViewerMarkdown dispatch = {dispatch} MarkdownRef={""} initialValue={businesActivitieInfo.busActDtl}></ViewerMarkdown>
              </Col>
            </Row>
            <Row  className={styles.contentCommentLeft}>
              <div className={styles.contentCommentOperation}>
                {contentCommentOperation()}
              </div>
            </Row>
          </div>
        </div>
      )

    }else if (operationType === "edit") {
        console.log("************************:6666->",global.disableButton)
      return (
        <div>
          <Row>
          <Upload  fileList={showUplodFiles} {...uploadProps}>
            {showUplodFiles.length>=10?"": <Button autoFocus icon={<UploadOutlined />}>{formatMessage({id: 'common.business.activities.upload'})}</Button>}
          </Upload>
          </Row>
          <div>
            <Row style={{paddingTop:10}}>
              <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                <Markdown newCloseFlag={global.newCloseFlag} disableButton={global.disableButton} dispatch = {dispatch} MarkdownRef={editorRef} initialEditType={"wysiwyg"} initialValue={businesActivitieInfo.busActDtl}/>
              </Col>
            </Row>
            <Row>
              <div className={styles.contentCommentOperation}>
                <Button type="primary" onClick={()=>OnMarkdownEditOk(businesActivitieInfo)}>{formatMessage({id: 'common.business.activities.ok'})}</Button>
                <Button type="primary" onClick={()=>OnMarkdownCancel()}>{formatMessage({id: 'common.business.activities.cancel'})}</Button>
              </div>
            </Row>
          </div>
        </div>
      )
    }else if (operationType === "comment") {
      return (
        <div>
          <div>
            <Row >
              <Col xl={6} lg={6} md={6} sm={6} xs={6}>
                <Form.Item>
                  <span>{businesActivitieInfo.createdDt}</span>
                </Form.Item>
              </Col>
              {
                businesActivitieType==="edit"?
                  <Col xl={6} lg={6} md={6} sm={6} xs={6} >
                    <Form.Item className={styles.formItemLabel} {...itemLayout}  label={formatMessage({id: 'common.business.activities.staff'})}>
                      <span>{businesActivitieInfo.userNm}</span>
                    </Form.Item>
                  </Col>
                  :""
              }
            </Row>
            {
              businesActivitieType==="edit"?"":
                <Form
                  {...formItemLayout}
                  layout={"inline"}  className={styles.contentCommentLeft}>
                  <Form.Item className={styles.formItemLabel} {...itemLayout} label={formatMessage({id: 'common.business.activities.customer'})}>
                    <span>{businesActivitieInfo.cstmrNm}</span>
                  </Form.Item>
                  <Form.Item className={styles.formItemLabel}  {...itemLayout}  label={formatMessage({id: 'common.business.activities.case'})}>
                    <span>{businesActivitieInfo.caseNm}</span>
                  </Form.Item>
                  <Form.Item className={styles.formItemLabel} {...itemLayout}  label={formatMessage({id: 'common.business.activities.staff'})}>
                    <span>{businesActivitieInfo.userNm}</span>
                  </Form.Item>
                </Form>
            }
            <Row>
              <Upload  {...uploadProps}  {...viewUploadPropsLayout}></Upload>
            </Row>
            <Row className={styles.contentCommentLeft}>
              <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                <ViewerMarkdown dispatch = {dispatch} MarkdownRef={""} initialValue={businesActivitieInfo.busActDtl}></ViewerMarkdown>
              </Col>
            </Row>
          </div>
          <div className={styles.contentCommentViewTop}>
            <Row>
            <Upload {...commentUploadProps} fileList={showCommentUplodFiles}>
              {showCommentUplodFiles.length>=10?"":<Button autoFocus icon={<UploadOutlined />}>{formatMessage({id: 'common.business.activities.upload'})}</Button>}
            </Upload>
            </Row>
            <Row style={{paddingTop:10}}>
              <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                <Markdown newCloseFlag={global.newCloseFlag} disableButton={global.disableButton} dispatch = {dispatch} MarkdownRef={comentEditorRef} initialEditType={"wysiwyg"} initialValue={""}/>
              </Col>
            </Row>
            <Row>
              <div className={styles.contentCommentOperation}>
                <Button type="primary" onClick={()=>OnMarkdownCommentOk(businesActivitieInfo)}>{formatMessage({id: 'common.business.activities.ok'})}</Button>
                <Button type="primary" onClick={()=>OnMarkdownCancel()}>{formatMessage({id: 'common.business.activities.cancel'})}</Button>
              </div>
            </Row>
          </div>
        </div>
      )
    }
  }

  // @ts-ignore
  return (
    <Comment className={styles.contentCommentInfo}
      content={
        <div >
          {getOperationInfo()}
        </div>
      }
    >
      {children}
    </Comment>
  );
};

export default  connect(
  ({ BusinessActivities,global}: {BusinessActivities: BusActData,global:GlobalModelState}) => ({
    resultFlag: BusinessActivities.resultFlag,
    global,
  }),
) (BusinesActivitieContent)
