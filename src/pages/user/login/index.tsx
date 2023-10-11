import { Alert } from 'antd';
import React, { useState } from 'react';
import { connect, Dispatch } from 'umi';
import { StateType } from '@/models/login';
import { LoginParamsType } from '@/services/login';
import { ConnectState } from '@/models/connect';
import LoginForm from './components/Login';

import styles from './style.less';
import {formatMessage} from "@@/plugin-locale/localeExports";
import SystemMessage from "@/pages/user/login/components/SystemMessage";

const { UserName, Password, Submit } = LoginForm;
interface LoginProps {
  dispatch: Dispatch;
  userLogin: StateType;
  submitting?: boolean;
}

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Login: React.FC<LoginProps> = (props) => {
  const { userLogin = {}, submitting } = props;
  const { status, type: loginType, access_token,refresh_token ,dspYear,userCode,dspLang,dspCurrCd} = userLogin;
  const [type, setType] = useState<string>('account');
  const [forgetPassFlag, setForgetPassFlag] = useState<boolean>(false);
  const [userNm, setUserNm] = useState<string>('');


  // ページの先頭にあるメニューが表示されますか
  // @ts-ignore
  const changeBaseMenuShowState = (payload: boolean): void => {
    const { dispatch } = props;
    if (dispatch) {
      dispatch({
        type: 'global/displayBaseMenuFlag',
        payload
      });
    }
  };


  const handleSubmit = (values: LoginParamsType) => {
    const { dispatch } = props;
    // eslint-disable-next-line consistent-return
    changeBaseMenuShowState(true);
    dispatch({
      type: 'login/login',
      payload: { ...values, type },
    });
  };


  const forgetPass= (forgetPassFlag:boolean) => {
    const { dispatch } = props;
    if(!forgetPassFlag=== true){
      dispatch({
        type: 'user/forgetPassWord',
        payload: userNm,
      });
    }
  };

  const changeUserNm=(e: { target: { value: React.SetStateAction<string>; }; } | undefined)=>{
    setUserNm(e.target.value);
  }

  if (access_token != null) {
    localStorage.setItem("Authorization", "Basic bHp0Omx6dA==");
    // @ts-ignore
    localStorage.setItem("refresh_token", refresh_token);
    // @ts-ignore
    localStorage.setItem('useCd',userCode);
    sessionStorage.setItem('access_token',"bearer " + access_token);
    if (localStorage.getItem('umi_locale') === '' || localStorage.getItem('umi_locale') === null ){
      if (dspLang != null) {
        localStorage.setItem('umi_locale', dspLang.replace('_', '-'));
      }
    }

    if (localStorage.getItem('umi_locale_money') === '' || localStorage.getItem('umi_locale_money') === null ){
      if (dspCurrCd != null) {
        localStorage.setItem('umi_locale_money', dspCurrCd || '');
      }
    }

    // // @ts-ignore
    // localStorage.setItem('umi_displayDate',dspYear);
  }else{
    localStorage.setItem("Authorization", "Basic bHp0Omx6dA==");
  }

  // @ts-ignore
  return (
    <div className={styles.main}>
      <LoginForm activeKey={type} onTabChange={setType} onSubmit={handleSubmit}>
        <div>
          {/*{status === 'error' && loginType === 'account' && !submitting && (*/}
          {/*  <LoginMessage content="账户或密码错误（admin/ant.design）" />*/}
          {/*)}*/}

          {status === 'false' && (
            <LoginMessage content={formatMessage({ id: 'login.message.error' })} />
          )}

          <UserName
            name="userName"
            placeholder={formatMessage({ id: 'login.Username' })}
            rules={[
              {
                required: true,
                message: formatMessage({ id: 'login.message.inputUsername' }, {}),
              },
            ]}
            value={userNm}
            onChange={e=>changeUserNm(e)}
          />
          <Password
            name="password"
            placeholder={formatMessage({ id: 'login.Password' })}
            rules={[
              {
                required: true,
                message: formatMessage({ id: 'login.message.inputPassword' }, {}),
              },
            ]}
          />
        </div>
        <div>
          <a onClick={()=>forgetPass(forgetPassFlag)}>{formatMessage({ id: 'login.ForgetPassword' })}</a>
          <Submit loading={submitting}>{formatMessage({ id: 'login.login' })}</Submit>
        </div>
      </LoginForm>
      <SystemMessage />
    </div>
  );
};

export default connect(({ login, loading,user,global }: ConnectState) => ({
  userLogin: login,
  user,
  submitting: loading.effects['login/login'],
}))(Login);
