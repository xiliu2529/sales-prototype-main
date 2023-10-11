import { UploadOutlined, QuestionCircleTwoTone } from '@ant-design/icons';
import {Button, Input, Select, Upload, Form, message, Spin, Col, Modal, Space, Tooltip, Row} from 'antd';
import { connect, FormattedMessage, formatMessage } from 'umi';
import React, { Component } from 'react';

import {ChangePassModel, CurrentUser} from '../data.d';
import styles from './BaseView.less';
import {ConnectState} from "@/models/connect";
import {CheckOutlined, CloseOutlined, EditOutlined, ExclamationCircleOutlined} from "@ant-design/icons/lib";
import {ModalState} from "@/pages/AccountSettings/model";
import "@/utils/messageConfig";

const { Option } = Select;

// 头像组件 方便以后独立，增加裁剪之类的功能
const AvatarView = ({ avatar }: { avatar: string }) => (
  <>
    <div className={styles.avatar_title}>
      <FormattedMessage id="accountsettings.basic.avatar" defaultMessage="Avatar" />
    </div>
    <div className={styles.avatar}>
      <img src={avatar} alt="avatar" />
    </div>
    <Upload showUploadList={false}>
      <div className={styles.button_view}>
        <Button>
          <UploadOutlined />
          <FormattedMessage id="accountsettings.basic.change-avatar" defaultMessage="Change avatar" />
        </Button>
      </div>
    </Upload>
  </>
);
interface SelectItem {
  label: string;
  key: string;
}

const validatorGeographic = (
  _: any,
  value: {
    province: SelectItem;
    city: SelectItem;
  },
  callback: (message?: string) => void,
) => {
  const { province, city } = value;
  if (!province.key) {
    callback('Please input your province!');
  }
  if (!city.key) {
    callback('Please input your city!');
  }
  callback();
};

const validatorPhone = (rule: any, value: string, callback: (message?: string) => void) => {
  const values = value.split('-');
  if (!values[0]) {
    callback('Please input your area code!');
  }
  if (!values[1]) {
    callback('Please input your phone number!');
  }
  callback();
};

interface BaseViewProps {
  currentUser?: CurrentUser;
  updateYear:[];
  dspYearFlag:boolean;
}

interface SendMessageStates {
  confimEmail:string;
  dspYear:string;
  visible:boolean;
  edit:boolean;
}


class BaseView extends Component<BaseViewProps,SendMessageStates> {
  view: HTMLDivElement | undefined = undefined;

  constructor(props: Readonly<BaseViewProps>) {
    super(props);

    // @ts-ignore
    const {user}= this.props;

    // @ts-ignore
    this.state = {
      confimEmail:"",
      dspYear: user.currentUser.dspYear,
      visible:false,
      edit:false,
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
  async componentDidMount() {
    // @ts-ignore
    const {dispatch} = this.props;
    this.changeBaseMenuShowState(false);
    this.changeRightMenu(false,false,false,false,true,false);
    const changePassModel = this.params('', '');
    if (changePassModel === null)
      return;
    await dispatch({
      type: 'accountSettings/fetchCurrentInfo',
      payload: {
        changePassModel,
      },
    });
  }

  // バックステージのパラメータ
  params=(emailParam:any,dspyearParam:any)=>{
    // @ts-ignore
    const { user}= this.props;
    const oldPassword="";
    const newPassword = "";
    const confirmPassword = "";
    let email = "";
    let dispYear = "";
    if(emailParam!== null || emailParam!==''){
      email =emailParam;
    }
    if(dspyearParam!== null || dspyearParam!==''){
      dispYear =dspyearParam;
    }
    const loginUserCd = user.currentUser.userid;

    const caseParam: ChangePassModel = {loginUserCd,oldPassword,newPassword,confirmPassword,email,dispYear};
    const changePassModel = JSON.stringify(caseParam);
    return changePassModel;
  }





  getAvatarURL() {
    const { currentUser } = this.props;
    if (currentUser) {
      if (currentUser.avatar) {
        return currentUser.avatar;
      }
      const url = 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png';
      return url;
    }
    return '';
  }

  getViewDom = (ref: HTMLDivElement) => {
    this.view = ref;
  };

  handleFinish = () => {
    message.success(formatMessage({ id: 'accountsettings.basic.update.success' }));
  };


  /*
    handleChangeCase = (e: any) => {
      const {msgInfo}= this.props;
      const dspYearListNew:any[]=[];
      let key=0;
      let caseParam ="";
      // @ts-ignore
      if(this.dspYearList !== ''){
        this.dspYearList.forEach((item:any)=>{
          dspYearListNew.push({ label: item, value: key})
          key+=1;
        })
        dspYearListNew.forEach((item:any)=>{
          if(item.value===e){
            caseParam=item.label;
          }
        })
      }

      this.setState({
        email :caseParam,
      })
    };
  */



   // 選択した人のメールアドレスを取得します
  onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      confimEmail:e.target.value.toString(),
    });
  };

 // 変更メールアドレスを閉じます
  cancelEmail = () => {
    // @ts-ignore
    const { dispatch } = this.props;

    const changePassModel=this.params('','');
    console.log("changePassModel");
    console.log(changePassModel);
    if (changePassModel === null)
      return;
    dispatch({
      type: 'accountSettings/fetchCurrentInfo',
      payload:{
        changePassModel}
    });

    this.setState({
      edit: false,
    });
  };

  // メールアドレスを変更
  submitEmail = async () => {

    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { dispatch,currentUser } = this.props;

    // (1).下記のチェックを行って、エラーがある場合、メッセージを表示し、処理を中断する
    if(this.state.confimEmail ==="" || this.state.confimEmail === null ||  this.state.confimEmail === undefined){
      message.error(formatMessage({  id: 'accountsettings.errorMsgInput' }));
      return;
    }
    // @が入力されていない
    // const reg = RegExp(/@/);
    // if(reg.test(this.state.confimEmail)){
    if(this.state.confimEmail.search("@") === -1 ){
      message.error(formatMessage({  id: 'accountsettings.errorMsgContact' }));
      return;
    }

    let changePassModel=this.params(this.state.confimEmail,'');
    if (changePassModel === null)
      return;
    await dispatch({
      type: 'accountSettings/fetchChangeEmail',
      payload: {
        changePassModel,
      },
    });

    changePassModel=this.params('','');
    if (changePassModel === null)
      return;
    await dispatch({
      type: 'accountSettings/fetchCurrentInfo',
      payload:{
        changePassModel}
    });
    this.setState({
      edit: false,
    });

  };

  // 修正表示年
  submitDspYear = async () => {
    // @ts-ignore
    const { dispatch,user } = this.props;
    let changePassModel=this.params('',this.state.dspYear);
    if (changePassModel === null)
      return;
    await dispatch({
      type: 'accountSettings/fetchChangeDspYear',
      payload: {
        changePassModel,
      },
    });
    this.setState({
      visible:false,
    })
    // 修正表示年の成功
     if(this.props.dspYearFlag){
      sessionStorage.setItem('currentYearFlag',true);
         user.currentUser.dspYear =this.state.dspYear;
       changePassModel=this.params('','');
       if (changePassModel === null)
         return;
       await dispatch({
         type: 'accountSettings/fetchCurrentInfo',
         payload:{
           changePassModel}
       });
      await dispatch({
        type: 'user/fetchCurrent',
       });

    }else{
       // 年の失敗を修正しますか？それとも元の表示年です
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { currentUser } = this.props;
      this.setState({
        dspYear:currentUser?.year,
      });
    }

  }

  // 修正表示年キャンセル
  cancel = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { currentUser } = this.props;
    this.setState({
      visible: false,
      dspYear:currentUser?.year,
    });
  };

// 年の変更を表示します
  handleChange = (e: any) => {
    // const { dispatch,user } = this.props;
    // const changePassModel=this.params('','');
    // if (changePassModel === null)
    //   return;
    //  dispatch({
    //   type: 'accountSettings/fetchCurrentInfo',
    //   payload:{
    //     changePassModel}
    // });


    let sysData=new Date().getFullYear();    // 获取完整的年份(4位,1970-????)
    const month = new Date().getMonth();
    if (month.toString() === '11') {
      sysData += 1;
    }
    const dspYearList:any[]=[];
    let value=0;
    // eslint-disable-next-line no-plusplus
    for(let i=sysData;i>=2017;i--){
      dspYearList.push({label:i,value})
      // eslint-disable-next-line no-plusplus
      value++;
    }

    let dspYearRep: string;
    // eslint-disable-next-line array-callback-return
    dspYearList.map((item:any) => {
      if(item.value === e){
        dspYearRep= item.label;
        this.setState({
          dspYear: item.label,
        })
      }
    })

    this.setState({
      visible:true,
    })

    // @ts-ignore
    const cont=formatMessage({ id: 'accountsettings.ViewDataFor' }).replace('%',dspYearRep);

    Modal.confirm({
     /* title: 'Alert', */
      visible:this.state.visible,
      icon: <QuestionCircleTwoTone />,
      content: cont,
      centered: true,
      okText: formatMessage({ id: 'accountsettings.confirm' }),
      cancelText: formatMessage({ id: 'accountsettings.cancel' }),
      // 这里注意要用箭头函数, 否则this不生效
      onOk: () => {
        this.submitDspYear();
      },
      onCancel: () => {
        this.cancel();
      },
    });
  }

// 年変更を表示する場合、メッセージボックスを表示します
  showModal = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { currentUser } = this.props;
    this.setState({
      edit:true,
      confimEmail:currentUser?.email,
    })
  };


  render() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { currentUser } = this.props;

    // if(currentUser){
    //   this.setState({
    //     dspYear:currentUser?.year,
    //   });
    // }

    const layout = {
      labelCol: {
        span: 8,
      },
      wrapperCol: {
        span: 16,
      },
    };
    let sysData=new Date().getFullYear();    // 获取完整的年份(4位,1970-????)
    const month = new Date().getMonth();
    if (month.toString() === '11') {
      sysData += 1;
    }
    const dspYearList:any[]=[];
    let value=0;
    // eslint-disable-next-line no-plusplus
    for(let i=sysData;i>=2017;i--){
      dspYearList.push({label:i,value})
      // eslint-disable-next-line no-plusplus
      value++;
    }

    // @ts-ignore
    return (
      <div  ref={this.getViewDom}>
        <div style={{ background:  "white", marginLeft: "-40px", marginTop: "-10px"}}>
          <div style={{fontWeight:"bolder",fontSize:'20px',color:'#003D82',marginBottom:'12px',marginLeft: "20px",paddingTop: "20px"}}>
            {formatMessage({ id: 'accountsettings.PersonalInformation' })}</div>
          <div className={styles.top }>
            <div className={styles.left }>
              <Row>
                <Col style={{width:400}}>
                  <Form {...layout} layout="horizontal" style={{width:'300',color:"black"}} >
                    <Form.Item
                      name="Name"
                      label={formatMessage({ id: 'accountsettings.Name' })}
                    >
                      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                      <label style={{color:"black"}}>{currentUser?.name}</label>
                    </Form.Item>
                    <Form.Item
                      name="Company"
                      label={formatMessage({ id: 'accountsettings.Company' })}
                    >
                      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                      <label>{currentUser?.company}</label>
                    </Form.Item>

                    <Form.Item
                      name="Depart"
                      label={formatMessage({ id: 'accountsettings.Department' })}
                    >
                      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                      <label>{currentUser?.depart}</label>
                    </Form.Item>

                    <Form.Item
                      name="Title"
                      label={formatMessage({ id: 'accountsettings.Title' })}
                    >
                      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                      <label>{currentUser?.title}</label>
                    </Form.Item>

                    <Form.Item
                      name="email"
                      label={formatMessage({ id: 'accountsettings.Email' })}
                    >
                      { // @ts-ignore
                        this.state.edit ?
                          <div className={styles.edit}>

                            <Input  value={this.state.confimEmail} onChange={this.onChange} style={{width:'200px'}}/>
                            <Space size = {8}>
                              <CheckOutlined onClick={() => this.submitEmail()} />
                              <CloseOutlined onClick={() => this.cancelEmail()} />
                            </Space>
                          </div>
                          :
                          <div className={styles.edit}>
                            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                            <label>{currentUser?.email}</label>

                            <Tooltip
                              placement="rightBottom"
                              title={formatMessage({ id: 'actualityForecastBottom.tooltip.edit' })}
                              color='yellow'>
                              <EditOutlined onClick={()=>this.showModal()} />
                            </Tooltip>
                          </div>
                      }

                      {/* <img src={setting} alt="" data-tip={formatMessage({ id: 'homepage.basic.SetDisplayitem' })}  data-place = "bottom" data-type='light' data-class={styles.Suspensionframe1} style={{position: 'absolute', left: '30%', bottom: '25%', fontSize: '20px', color: '#003D82' }}  onClick={this.showModal}/>
                <ReactTooltip /> */}
                    </Form.Item>

                  </Form>
                </Col></Row>
            </div>
          </div>
        </div>

        <div style={{height:'10px'}}></div>
        <div  style={{ background: "white",marginLeft: "-40px"}}>
          <div style={{fontWeight:"bolder",fontSize:'20px',color:'#003D82',marginBottom:'12px',marginLeft: "20px",paddingTop: "20px"}}>
            {formatMessage({id: 'accountsettings.SystemSetting'})}
          </div>
          <Row>
            <Col style={{width:400}}>
              <Form {...layout} layout="horizontal" >
                <Form.Item name="dspyear" label={formatMessage({id: 'accountsettings.Year'})}>
                  <Select
                    showSearch
                    style={{ width: '100px'  }}
                    placeholder=""
                    optionFilterProp="children"
                    value={this.state.dspYear}
                    onChange={e=>this.handleChange(e)}
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {
                      dspYearList.map((item:any) => (
                        <Option value={item.value} key={item.value}>{item.label}</Option>
                      ))}

                  </Select>

                  <Input type="hidden" value=''/>

                  {/* 只能选不能输入  <Select options={caseList} onChange={e=>this.handleChangeCase(e)} style={{ width: '280px' }}/> */}
                </Form.Item>
              </Form>
            </Col>

            <label style={{marginLeft:'-140px',color:'#40a9ff',marginTop: '4px'}}>{formatMessage({id: 'accountsettings.ViewData'})} </label>

          </Row>

        </div>
      </div>

    );
  }
}

export default connect(
  ({ accountSettings,user }: { accountSettings: ModalState ;user:ConnectState;}) => ({
    currentUser: accountSettings.currentUser,
    updateYear:accountSettings.updateYear,
    dspYearFlag:accountSettings.dspYearFlag,
    user,
  }),
)(BaseView);
