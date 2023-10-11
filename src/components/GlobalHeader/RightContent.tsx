import { Settings as ProSettings } from '../../pro-layout';
import React, {useEffect} from 'react';
import { connect, ConnectProps } from 'umi';
import { SelectLang } from '../PluginLocale/SelectLang';
import { SelectMoney } from '../PluginLocale/SelectMoney';
import { ConnectState } from '@/models/connect';
import styles from './index.less';
import LogoutLogo from '../../assets/logout.png';
import NoticeIconView from './NoticeIconView';
import { CurrentUser } from '@/models/user';
import {CalendarOutlined} from "@ant-design/icons/lib";
import {formatMessage} from "@@/plugin-locale/localeExports";
import ReactTooltip from "react-tooltip";

export interface GlobalHeaderRightProps extends Partial<ConnectProps>, Partial<ProSettings> {
  currentUser?: CurrentUser;
  theme?: ProSettings['navTheme'] | 'realDark';
}

const GlobalHeaderRight: React.SFC<GlobalHeaderRightProps> = (props) => {
  // @ts-ignore
  const { dispatch ,currentUser,dspYear,currencyLst} = props;
  let className = styles.right;
  if(currencyLst === null || dspYear === null ){
    return ;
  }

  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'message/fetchCurrencyLst',
        payload: {
          dspYear,
        },
      });
    }
  }, []);

  // @ts-ignore
  const changeRightMenu = (parma1: boolean,parma2: boolean,parma3: boolean,parma4: boolean,parma5: boolean,parma6: boolean): void => {
    const { dispatch } = props;
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


  const onMenuClick = (): void => {
    changeRightMenu(false,false,false,false,false,false);
    if (dispatch) {

      dispatch({
        type: 'user/clear',
      });
      dispatch({
        type: 'global/clear',
      });
      dispatch({
        type: 'login/logout',
      });
    }
    return;
  };

  return (
    <div className={className}>


      <NoticeIconView />

      <SelectMoney className={styles.action} currencyLst={currencyLst}/>

      <SelectLang className={styles.action} />

     {/* <CalendarOutlined  data-tip={formatMessage({id: 'component.GlobalHeader.MenuDropdown.disYear'})} data-place = "bottom" data-type='light' data-class={styles.Suspensionframe}  className={styles.candler}/>
      <ReactTooltip />
      <span style={{verticalAlign:"text-bottom",fontSize:'17px',marginTop: '10px',marginLeft: '-6px', color: 'black'}}> {currentUser?.dspYear}{formatMessage({id: 'component.GlobalHeader.MenuDropdown.disYear'})}</span>
     */}
      <span
        className={`${styles.action} ${styles.account}`}
        onClick={() => {
          onMenuClick();
        }}
      >
        <img alt="menuLogo" className={styles.logo} src={LogoutLogo} />
        <span className={`${styles.name} anticon`}></span>
      </span>
    </div>
  );
};

export default connect(({ settings, user,message }: ConnectState) => ({
  currentUser: user.currentUser,
  theme: settings.navTheme,
  layout: settings.layout,
  dspYear:user.currentUser?.dspYear,
  currencyLst:message.currencyLst,
  message
}))(GlobalHeaderRight);
