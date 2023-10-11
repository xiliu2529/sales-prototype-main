import {FormattedMessage, formatMessage, connect} from 'umi';
import React, { Component } from 'react';

import {Button, Col, Form, Input, List, message, Row} from 'antd';
import {Dispatch, EchartsState, ModalState, SendMessageModelState} from "@@/plugin-dva/connect";
import {ChangePassModel, CurrentUser} from "@/pages/AccountSettings/data";
import {ConnectState} from "@/models/connect";
import "@/utils/messageConfig";

type Unpacked<T> = T extends (infer U)[] ? U : T;


const passwordStrength = {
  strong: (
    <span className="strong">
      <FormattedMessage id="accountsettings.security.strong" defaultMessage="Strong" />
    </span>
  ),
  medium: (
    <span className="medium">
      <FormattedMessage id="accountsettings.security.medium" defaultMessage="Medium" />
    </span>
  ),
  weak: (
    <span className="weak">
      <FormattedMessage id="accountsettings.security.weak" defaultMessage="Weak" />
      Weak
    </span>
  ),
};

export interface ChangePasswordProps {
  dispatch:Dispatch;
  className?: string,
  name:string,
  userId:string,
}

interface ChangePasswordStates {
    oldPassword:string;
    newPassword:string;
    confimPass:string;
}


class SecurityView extends Component<ChangePasswordProps,ChangePasswordStates> {

  constructor(props: Readonly<ChangePasswordProps>) {
    super(props);
    this.state = {
      oldPassword:'',
      newPassword:'',
      confimPass:'',
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
    // @ts-ignore
    this.changeBaseMenuShowState(false);
    this.changeRightMenu(false,false,false,false,false,true);
  };

  getData = () => [
    {
      title: formatMessage({ id: 'accountsettings.security.password' }, {}),
      description: (
        <>
          {formatMessage({ id: 'accountsettings.security.password-description' })}：
          {passwordStrength.strong}
        </>
      ),
      actions: [
        <a key="Modify">
          <FormattedMessage id="accountsettings.security.modify" defaultMessage="Modify" />
        </a>,
      ],
    },
    {
      title: formatMessage({ id: 'accountsettings.security.phone' }, {}),
      description: `${formatMessage(
        { id: 'accountsettings.security.phone-description' },
        {},
      )}：138****8293`,
      actions: [
        <a key="Modify">
          <FormattedMessage id="accountsettings.security.modify" defaultMessage="Modify" />
        </a>,
      ],
    },
    {
      title: formatMessage({ id: 'accountsettings.security.question' }, {}),
      description: formatMessage({ id: 'accountsettings.security.question-description' }, {}),
      actions: [
        <a key="Set">
          <FormattedMessage id="accountsettings.security.set" defaultMessage="Set" />
        </a>,
      ],
    },
    {
      title: formatMessage({ id: 'accountsettings.security.email' }, {}),
      description: `${formatMessage(
        { id: 'accountsettings.security.email-description' },
        {},
      )}：ant***sign.com`,
      actions: [
        <a key="Modify">
          <FormattedMessage id="accountsettings.security.modify" defaultMessage="Modify" />
        </a>,
      ],
    },
    {
      title: formatMessage({ id: 'accountsettings.security.mfa' }, {}),
      description: formatMessage({ id: 'accountsettings.security.mfa-description' }, {}),
      actions: [
        <a key="bind">
          <FormattedMessage id="accountsettings.security.bind" defaultMessage="Bind" />
        </a>,
      ],
    },
  ];

  handleFinish = () => {
    message.success(formatMessage({ id: 'accountsettings.basic.update.success' }));
  };

  // パスワードを変更して提出してください
  handleSubmit= () => {
    // @ts-ignore
    const { userId,dispatch}= this.props;
    const {oldPassword} = this.state;
    const {newPassword} = this.state;
    const confirmPassword =this.state.confimPass;;
    const email = "";
    const dispYear = "";
    const loginUserCd = userId;
    const caseParam: ChangePassModel = {loginUserCd,oldPassword,newPassword,confirmPassword,email,dispYear};
    const changePassModel = JSON.stringify(caseParam);

    dispatch({
      type: 'accountSettings/fetchChangePass',
      payload: {
        changePassModel,
      },
    });

  }

  // 提出したパスワードを変更します
  onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      confimPass:e.target.value.toString(),
    });
  };

  // 古いパスワードを変更します
  onChangeOld = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      oldPassword:e.target.value.toString(),
    });
  };

  // 新しいパスワードを変更します
  onChangeNew = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      newPassword:e.target.value.toString(),
    });
  };


  render() {
    const data = this.getData();
    const{name}=this.props;
    const layout = {
      labelCol: {
        span: 8,
      },
      wrapperCol: {
        span: 16,
      },
    };
    return (
      <div  style={{ background: "white",marginLeft: "-40px",marginTop:"-10px"}}>
        <div style={{fontWeight:"bolder",fontSize:'20px',color:'#003D82',marginBottom:'12px',marginLeft: "20px",paddingTop: "20px"}}>
          {formatMessage({ id: 'accountsettings.ChangePassword' })}</div>
        <Row>
          <Col style={{width:500}}>
      <Form {...layout} layout="horizontal" >
        <Form.Item  label={formatMessage({id: 'accountsettings.Name'})} >
          <span>{name}</span>
        </Form.Item>
        <Form.Item label={formatMessage({id: 'accountsettings.OldPassword'})}>
          <Input type="PASSWORD" value={this.state.oldPassword} onChange={this.onChangeOld}  style={{width:'200px'}}/>
        </Form.Item>
        <Form.Item  label={formatMessage({id: 'accountsettings.NewPassword'})} >
          <Input  type="PASSWORD" value={this.state.newPassword} onChange={this.onChangeNew}  style={{width:'200px'}}/>
        </Form.Item>
        <Form.Item  label={formatMessage({id: 'accountsettings.ConfirmPassword'})}>
          <Input type="PASSWORD" value={this.state.confimPass} onChange={this.onChange} style={{width:'200px'}}/>
        </Form.Item>
        <Button key="submit" style={{marginLeft:'320px',marginBottom:'10px'}} type="primary" onClick={this.handleSubmit}>OK</Button>
      </Form>
          </Col>
        </Row>
      </div>
    );
  }
}

export default connect(
  ({ accountSettings }: { accountSettings:ModalState}) => ({
    accountSettings
  }),
)
(SecurityView)
