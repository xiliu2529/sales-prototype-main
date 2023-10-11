import { ConnectState } from '@/models/connect';
import React, {Component, useEffect} from 'react';
import { connect, Dispatch } from 'umi';
import {Form, Input, Button, Select, Checkbox, Modal, Card, message, Row, Col, AutoComplete} from 'antd';
import {formatMessage} from "@@/plugin-locale/localeExports";
import { SendMessageInfo, SendMessageModel} from "@/components/SendMessageInfo/data";
// eslint-disable-next-line import/no-duplicates
import classNames from "classnames";
// @ts-ignore
import {LabeledValue} from "antd/es/select";
import {SendMessageModelState} from "@/models/sendmessage";
import {OptionType} from "@/pages/BusinessActivities/data";
import styles from './index.less';
import CustomerInfo from "@/components/CustomerInfo/CustomerInfo";


export interface SendMessageProps {
  dispatch:Dispatch;
  sendMessage1:SendMessageInfo;
  sendMessageModel:[];
  sendMessage:[],
  msgInfo:[],
  className?: string,
  sendMessageFlag:boolean,
  message:SendMessageModelState,
  user:[],
}

interface SendMessageStates {
  msgInfo: [];
  sendMessageFlag:boolean,
  toParams: string,
  toName:string,
  customerParams: string,
  caseParams: string,
  value:string,
  checkBox:boolean,
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { Option } = Select;

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

const { TextArea } = Input;


class Index extends Component<SendMessageProps,SendMessageStates> {

  constructor(props: Readonly<SendMessageProps>) {
    super(props);
    this.state = {
        toParams:'',
        toName:'',
        customerParams:'',
        caseParams:'',
        value:'',
        checkBox:false,
        modalKey:0,
        msgInfo:[],
      sendMessageFlag:false,
    }
  }

  componentDidMount() {
    const { dispatch,user}= this.props;


    // @ts-ignore
    const loginUserCd=user.currentUser.userid;
    const to="";
    const toName="";
    const customerName="";
    const caseNm="";
    const message="";
    const msgId="";
    const email="";
    // @ts-ignore
    const {orgGroupId,caseYear,inputUserCd,authOrgCd} = user.currentUser;
    const caseParam: SendMessageModel = {to,toName,customerName,caseNm,loginUserCd,message, msgId,email,orgGroupId,caseYear,inputUserCd,authOrgCd};
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const sendMessageModel = JSON.stringify(caseParam);

    dispatch({
      type: 'message/fetchGetSendMessageInfo',
      payload: {
        sendMessageModel,
      },
    });
  }



  static getDerivedStateFromProps(nextProps: SendMessageProps, prevState: SendMessageStates) {
     if(nextProps.message.sendMessageFlag ) {
  /*  if(prevState.showFlag){ */
       if ( JSON.stringify(nextProps.message.msgInfo) !== JSON.stringify(prevState.msgInfo)) {

         const {dispatch, user} = nextProps;
         // @ts-ignore
         const loginUserCd = user.currentUser.userid;
         const to = "";
         const toName="";
         const customerName = "";
         const caseNm = "";
         const message = "";
         const msgId = "";
         const email = ""
         const from ="";
         // const {orgGroupId} = user.currentUser;
         const {orgGroupId,caseYear,inputUserCd,authOrgCd} = user.currentUser;
         const caseParam: SendMessageModel = {to,toName,customerName,caseNm,loginUserCd,message, msgId,email,from,orgGroupId,caseYear,inputUserCd,authOrgCd};
         // const caseParam: SendMessageModel = {to,toName, customerName, caseNm, loginUserCd, message, msgId, email,from,orgGroupId};
         const sendMessageModel = JSON.stringify(caseParam);

         dispatch({
           type: 'message/fetchGetSendMessageInfo',
           payload: {
             sendMessageModel,
           },
         });
         return{  msgInfo : nextProps.message.msgInfo }
       }
     }
    return null;
  }


  formRef = React.createRef();

  onFinish = (values:any) => {
    console.log('Received values of form:', values);
  };

  handleChange = (e: any) => {
    this.setState({
      toParams: e,

    })
  }


/*
  handleChangeCustomer = (e: any) => {

    const {msgInfo}= this.props;
    const customerList:any[]=[];
    let key=0;
    let customerParam ="";
    if(msgInfo.customerList !== ''){
    msgInfo.customerList.forEach((item:any)=>{
      customerList.push({ label: item, value: key})
      key+=1;
    })
    customerList.forEach((item:any)=>{
      if(item.value===e){
        customerParam=item.label;
      }
    })
    }
    this.setState({
      customerParams :customerParam,
    })
  };

  handleChangeCase = (e: any) => {
    const {msgInfo}= this.props;
    const caseList:any[]=[];
    let key=0;
    let caseParam ="";
    if(msgInfo.caseList !== ''){
      msgInfo.caseList.forEach((item:any)=>{
        caseList.push({ label: item, value: key})
        key+=1;
      })
      caseList.forEach((item:any)=>{
        if(item.value===e){
          caseParam=item.label;
        }
      })
    }

    this.setState({
      caseParams :caseParam,
    })
  };
*/

  /**
   * Customer charge 变更方法
   * @param value
   */
  // onCustomerChange = (value:string)=>{
  //   if (value === null || value === undefined){
  //     value = "";
  //   }
  //
  //   this.setState({
  //     // @ts-ignore
  //     customerParams: value
  //   })
  // }

  handleCustomer= (cstmrCds:string,cstmrNms:string,caseNms:string,index:number) => {
    this.setState({
      // @ts-ignore
      customerParams: cstmrNms
    })
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
    if (value === null || value === undefined){
      value = "";
    }
    this.setState({
      // @ts-ignore
      caseParams: value
    })
  }


  handleChangeMessage = ({ target: { value } }) => {
    this.setState({ value })
  };

  handleChangeCheck = (e:any) => {
    this.setState({
      // eslint-disable-next-line react/no-access-state-in-setstate
      checkBox :e.target.checked,
    })
  };

  // @ts-ignore
  changeSendMessageShowState = async (payload: boolean) => {
    const {dispatch} = this.props;
    if (dispatch) {
      await dispatch({
        type: 'message/changeSendMessageFlag',
        payload
      });
    }
  };



  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleCancel = (e: any) => {
    const { dispatch,user,msgInfo}= this.props;
    const{checkBox}= this.state;
    // @ts-ignore
    const loginUserCd=user.currentUser.userid;
    let to=this.state.toParams;
    let customerName=this.state.customerParams;
    let caseNm=this.state.caseParams;
    let message1=this.state.value;
    // @ts-ignore
    const from = user.currentUser.name;
    let msgId="";


    if(this.state.toParams ===undefined || this.state.toParams ===null || this.state.toParams===''||this.state.toParams===0 ){
      message.info(formatMessage({ id: 'component.sendMessage.toMsg' }));
      return;
    }

    if(this.state.customerParams.length >100 ){
      message.info(formatMessage({ id: 'component.sendMessage.customer' }));
      return;
    }
    if(this.state.caseParams.length >100 ){
      message.info(formatMessage({ id: 'component.sendMessage.case' }));
      return;
    }
    if(this.state.value===undefined || this.state.value===null || this.state.value==='' ){
      message.info(formatMessage({  id: 'component.sendMessage.Msg' }));
      return;
    }

    // @ts-ignore
    let emailParams ="";
    let toName="";
      msgInfo.toList.forEach((item:any)=>{
     if(item.userCd===to){
       emailParams=item.userEmail;
       toName =item.userNm;
     }
    })

    // @ts-ignore
    let email="";
    const re = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
    if(checkBox){
    if (re.test(emailParams)) {
      email =emailParams;
    } else {
      message.info(formatMessage({  id: 'component.sendMessage.errorMsg' }));
    }
    }
    // @ts-ignore
    let {orgGroupId} = user.currentUser;
    const {caseYear,inputUserCd,authOrgCd} = user.currentUser;
    let caseParam: SendMessageModel = {to,toName,customerName,caseNm,loginUserCd,message:message1, msgId,email,from,orgGroupId};
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let sendMessageModel = JSON.stringify(caseParam);

    if (dispatch) {
      dispatch({
        type: 'message/fetchCloseSendMessageInfo',
        payload: {
          sendMessageModel
        },
      });
    }

     to="";
     toName="";
     customerName="";
     caseNm="";
     message1 = "";
     msgId="";
     email="";
     // @ts-ignore
     orgGroupId = user.currentUser.orgGroupId;
     // caseParam = {to,toName,customerName,caseNm,loginUserCd,message:message1, msgId,email,orgGroupId};
    // const {orgGroupId,caseYear,inputUserCd,authOrgCd} = user.currentUser;
     caseParam = {to,toName,customerName,caseNm,loginUserCd,message:message1, msgId,email,orgGroupId,caseYear,inputUserCd,authOrgCd};
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    sendMessageModel = JSON.stringify(caseParam);

    dispatch({
      type: 'message/fetchGetSendMessageInfo',
      payload: {
        sendMessageModel,
      },
    });

    // @ts-ignore
    const {modalKey} = this.state;
    this.setState({
      modalKey,
      value:'',
      toName:'',
      toParams:'',
      customerParams:'',
      caseParams:'',
      msgInfo : [],
      checkBox:false,
    });
  }

  handleCancelRight = () =>{
    // @ts-ignore
    const {modalKey} = this.state;
    this.changeSendMessageShowState(false);
    this.setState({
      msgInfo : [],
      modalKey: modalKey + 1,
      toName:'',
      toParams:'',
      customerParams:'',
      caseParams:'',
      value:'',
      checkBox:false,
    });
  }



  selectCityItem = (item: LabeledValue) => {
    // @ts-ignore
    const { value, onChange } = this.props;
    if (value && onChange) {
      onChange({
        province: value.province,
        city: item,
      });
    }
  };

render() {

   // @ts-ignore
     const{msgInfo}=this.props;
    if(!msgInfo || msgInfo ===undefined || msgInfo.length === 0){
     return null;
     }
    const toList:any[]=[];
    msgInfo.toList.forEach((item:any)=>{
      toList.push({ label: item.userNm, value: item.userCd ,email:item.userEmail})
    })
/*
    const customerList:any[]=[];
    let key=0;
    msgInfo.customerList.forEach((item:any)=>{
      customerList.push({ label: item, value: key})
      key+=1;
    })

    const caseList:any[]=[];
    let keyCase=0;
    msgInfo.caseList.forEach((item:any)=>{
      caseList.push({ label: item,value: keyCase})
      keyCase+=1;
    }) */

  // 获取optionValue
  // const customerOption: OptionType[] = [];
  // msgInfo.customerList.forEach((item:any) => {
  //   // @ts-ignore
  //   if (item !== null && item !== "") {
  //     const optionItem: OptionType = {
  //       // @ts-ignore
  //       value: item
  //     };
  //     customerOption.push(optionItem);
  //   }
  // });
  const caseOption: OptionType[] = [];
  msgInfo.caseList.forEach((item:any) => {
    // @ts-ignore
    if (item !== null && item !== "") {
      const optionItem: OptionType = {
        // @ts-ignore
        value: item
      };
      caseOption.push(optionItem);
    }
  });

 // @ts-ignore
    return(
   <Modal
     title= "   "
     className={classNames(styles.styleSend)}
     visible={this.props.message.sendMessageFlag}
     onCancel={this.handleCancelRight}
     key={this.state.modalKey}
     maskClosable={false}
     footer={[
       <Checkbox onChange={this.handleChangeCheck}  checked={this.state.checkBox}>{formatMessage({id: 'component.sendMessage.sendMail'})}</Checkbox>,
       // eslint-disable-next-line react/jsx-no-bind
       <Button key="submit" type="primary"  onClick={this.handleCancel}>OK
       </Button>]}
   >
     <div  style={{background:"#f2f2f2"}}>
     <Form {...layout} ref={this.formRef} name="dynamic_form_nest_item"  autoComplete="off" >
       <div style={{background:"white" ,paddingTop: "10px",paddingBottom: "0.1px",marginBottom: "10px"}}>
     {/*  <Card style={{ width: '100%' }}> */}

     {/* eslint-disable-next-line no-irregular-whitespace,jsx-a11y/label-has-associated-control */}
   {/*  <label  style={{color:"#003D82",fontWeight: "bolder"}}> {formatMessage({id: 'component.sendMessage.to'})} </label> */}

     <Form.Item name="To" label={formatMessage({id: 'component.sendMessage.to'})} className={classNames(styles.styleFont)}>
       <Select
         showSearch
         style={{ width: '98%' }}
         placeholder=""
         optionFilterProp="children"
         value={this.state.toParams}
         onChange={e=>this.handleChange(e)}
         filterOption={(input, option) =>
           option.children.toLowerCase().indexOf(input.toLowerCase()) >=  0
         }
       >
         {
           toList.map((item:any) => (
         <Option value={item.value} key={item.value}>{item.label}</Option>
           ))}
       </Select>
        <Input type="hidden" value={this.state.toParams}/>
      {/* <Select options={toList} onChange={e=>this.handleChange(e)} style={{ width: '280px' }}/> */}
     </Form.Item>
     <Form.Item name="customerName" label={formatMessage({id: 'app.common.CustomerName'})} className={classNames(styles.styleFont)}>
{/*       <Select
         showSearch
         style={{ width: '98%'  }}
         placeholder=""
         optionFilterProp="children"
         value={this.state.customerParams}
         onChange={e=>this.handleChangeCustomer(e)}
         filterOption={(input, option) =>
           option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
         }
       >
         {
           customerList.map((item:any) => (
             <Option value={item.value} key={item.value}>{item.label}</Option>
           ))}
       </Select> */}
       {/*<AutoComplete*/}
       {/*  allowClear*/}
       {/*  style={{ width: '98%'  }}*/}
       {/*  value={this.state.customerParams}*/}
       {/*  onChange={(e) => this.onCustomerChange(e)}*/}
       {/*  // @ts-ignore*/}
       {/*  onSelect={(e) => this.onCustomerChange(e)}*/}
       {/*  options={customerOption}*/}
       {/*  filterOption={(inputValue, option) =>*/}
       {/*    // @ts-ignore*/}
       {/*    option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1*/}
       {/*  }*/}
       {/*/>*/}

       <CustomerInfo
         cstmrCd=''
         cstmrNm={this.state.customerParams}
         customerLst={msgInfo.customerList}
         allCustomerLst={msgInfo.allCustomerList}
         caseLst={msgInfo.caseList}
         index={0}
         caseFlag="1"
         styleFlag="2"
         onRef={this.onRef}
         handleCustomer={this.handleCustomer.bind(this)}
       />

       <Input type="hidden" value={this.state.customerParams}/>

      {/*  <Select options={customerList} onChange={e=>this.handleChangeCustomer(e)} style={{ width: '280px' }}/> */}
     </Form.Item>
     <Form.Item name="case" label={formatMessage({id: 'app.common.Case'})} className={classNames(styles.styleFont)}>
       {/* <Select
         showSearch
         style={{ width: '98%'  }}
         placeholder=""
         optionFilterProp="children"
         value={this.state.caseParams}
         onChange={e=>this.handleChangeCase(e)}
         filterOption={(input, option) =>
           option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
         }
       >
         {
           caseList.map((item:any) => (
             <Option value={item.value} key={item.value}>{item.label}</Option>
           ))}
       </Select> */}


       <AutoComplete
         allowClear
         style={{ width: '98%'  }}
         value={this.state.caseParams}
         onChange={(e) => this.onCaseChange(e)}
         // @ts-ignore
         onSelect={(e) => this.onCaseChange(e)}
         options={caseOption}
         filterOption={(inputValue, option) =>
           // @ts-ignore
           option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
         }
       />
       <Input type="hidden" value={this.state.caseParams}/>
     {/* 只能选不能输入  <Select options={caseList} onChange={e=>this.handleChangeCase(e)} style={{ width: '280px' }}/> */}
     </Form.Item>
         {/* <Card> */}
       </div>

   {/*  <Form.Item label="" > */}
           <div>
           <TextArea  value={this.state.value} onChange={this.handleChangeMessage} rows={14}
                      className={classNames(styles.textArea)}/>
           {/*  <Input  onChange={e=>this.handleChangeMessage(e)} style={{height: '200px',width :'150%'}} /> */}
           <Input type="hidden" value={this.state.value}/>
           </div>
    {/* </Form.Item> */}

   </Form>
     </div>
   </Modal>
 )
}
}
export default connect(
({
   user,
   message,
}: {
  user:ConnectState;
  message:ConnectState;
}) => ({
  user,
  message,
  msgInfo:message.msgInfo,
}),
)(Index)


