import { UserOutlined ,DatabaseOutlined,ShoppingOutlined,SendOutlined,MenuUnfoldOutlined,FileTextOutlined} from '@ant-design/icons';
import { Menu, Spin } from 'antd';
import React, {useState} from 'react';
import { history, ConnectProps, connect, FormattedMessage } from 'umi';
import { ConnectState } from '@/models/connect';
import {CurrentUser, MenuInfo} from '@/models/user';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import menuLogo from '../../assets/menu.png';
import SendMessage from "@/components/SendMessageInfo";
import {SendMessageModel} from "@/components/SendMessageInfo/data";
import {EditOutlined, KeyOutlined, SearchOutlined} from "@ant-design/icons/lib";
import {SelectMenuItem} from "@/models/global";
import {formatMessage} from "@@/plugin-locale/localeExports";
import {UserType} from "@/pages/FormAdvancedForm/data";


export interface GlobalHeaderRightProps extends Partial<ConnectProps> {
  currentUser?: CurrentUser;
  menu?: boolean;
}

class MenuDropdown extends React.Component<GlobalHeaderRightProps> {

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

  // ページの最初のレンダリングの後に呼び出します
  componentDidMount() {
    console.log("initMenuDropDown")
    const urlKey =window.location.pathname.substring(1,window.location.pathname.length);
    const searchId = window.location.search.substring(4,window.location.search.length);

    if(urlKey === "formadvancedform" || urlKey==="formadvancedformSearchRun" || urlKey==="businessactivities" || urlKey==="businessactivitiesSearchCase"){
      this.changeRightMenu(true,false,false,false,false,false);
    }

    if(urlKey === "formadvancedformEditAct" || urlKey==="formadvancedformEditRun" || urlKey==="businessactivitiesEditAct" ){
      this.changeRightMenu(false,true,false,false,false,false);
    }

    if(urlKey === "report"){
      this.changeRightMenu(false,false,true,false,false,false);
    }
    if(urlKey === "uploadExcel"){
      this.changeRightMenu(false,false,false,true,false,false);
    }
    if(urlKey === "accountSettings" && searchId ==="base"){
      this.changeRightMenu(false,false,false,false,true,false);
    }
    if(urlKey === "accountSettings" && searchId ==="security"){
      this.changeRightMenu(false,false,false,false,false,true);
    }
    if (!urlKey && !searchId) {
      this.changeRightMenu(false,false,false,false,false,false);
    }
  }


  onMenuClick = (event: {
    key: React.Key;
    keyPath: React.Key[];
    item: React.ReactInstance;
    domEvent: React.MouseEvent<HTMLElement>;
  }) => {
    const { key } = event;
    // メッセージを送信します
    // @ts-ignore
    const changeSendMessageShowState = (payload: boolean): void => {
      const { dispatch } = this.props;
      if (dispatch) {
        dispatch({
          type: 'message/changeSendMessageFlag',
          payload
        });
      }
    };
    // ページの先頭にあるメニューが表示されますか
    // @ts-ignore
    const changeBaseMenuShowState = (payload: boolean): void => {
      const { dispatch } = this.props;
      if (dispatch) {
        dispatch({
          type: 'global/displayBaseMenuFlag',
          payload
        });
      }
    };

    /**
     * 设置title菜单
     * @param payload
     */
    const  changeSelectMenuState = (payload: SelectMenuItem[]): void => {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const { dispatch } =this.props;
      if (dispatch) {
        dispatch({
          type: 'global/changeSelectMenu',
          payload
        });
      }
    };


    if (key === 'logout') {
      // @ts-ignore
      const { dispatch } = this.props;
      if (dispatch) {
        dispatch({
          type: 'login/logout',
        });
      }
      if (dispatch) {
        dispatch({
          type: 'global/saveNotices',
          payload:[],
        });
      }


      return;
    }
    if (key === 'inputData') {
      // eslint-disable-next-line consistent-return
      changeBaseMenuShowState(true);
      changeSelectMenuState([]);
      this.changeRightMenu(true,false,false,false,false,false);
      history.push(`/formadvancedform?id=SearchActualityForecast`);
      return;
    }
    if (key === 'sendMessage') {
      // eslint-disable-next-line consistent-return
      changeSendMessageShowState(true);
      const {dispatch, currentUser} = this.props;

      // @ts-ignore
      const loginUserCd = currentUser.userid;
      const to = "";
      const toName="";
      const customerName = "";
      const caseNm = "";
      const message1 = "";
      const msgId = "";
      const email = ""
      const from ="";
      const orgGroupId=currentUser?.orgGroupId;
      // @ts-ignore
      const {caseYear,inputUserCd,authOrgCd} = currentUser;
      const caseParam: SendMessageModel = {to, toName,customerName, caseNm, loginUserCd, message:message1, msgId, email,from,orgGroupId,caseYear,inputUserCd,authOrgCd};
      const sendMessageModel = JSON.stringify(caseParam);

      dispatch({
        type: 'message/fetchGetSendMessageInfo',
        payload: {
          sendMessageModel,
        },
      });

        return;
    }
    if (key === 'businessActivities') {
      // eslint-disable-next-line consistent-return
      changeBaseMenuShowState(true);
      changeSelectMenuState([]);
      this.changeRightMenu(false,true,false,false,false,false);
      history.push(`/formadvancedformEditAct?id=EditActualityForecast`);
      return;
    }
    if (key === 'uploadExcel') {
      // eslint-disable-next-line consistent-return
      changeBaseMenuShowState(false);
      this.changeRightMenu(false,false,false,true,false,false);
      history.push(`/uploadExcel`);
      return;
    }
    if (key === 'personalSetting') {
      // eslint-disable-next-line consistent-return
      changeBaseMenuShowState(false);
      this.changeRightMenu(false,false,false,false,true,false);
     // selectKeysMenu("base");
      history.push(`/accountSettings?id=base`);
      return;
    }
    if (key === 'passwordChange') {
      // eslint-disable-next-line consistent-return
      changeBaseMenuShowState(false);
      this.changeRightMenu(false,false,false,false,false,true);
      // selectKeysMenu("security");
      history.push(`/accountSettings?id=security`);
      return;
    }

    if (key === 'report') {
      // eslint-disable-next-line consistent-return
      changeBaseMenuShowState(false);
      history.push(`/report`);
      this.changeRightMenu(false,false,true,false,false,false);
      return;
    }
    history.push(`/account${key}`);
  };


  render(): React.ReactNode {
    // @ts-ignore
    const {
      currentUser = {
        avatar: '',
        name: '',
      },
      menu,
      message
    } = this.props;

    const getMenuOption = (item: MenuInfo) => {
      if (item.menuCd === '100') {
        return (
          <Menu.Item key="inputData" disabled={message.formadvancedformFlag && message.formadvancedformEditActFlag === false &&
            message.reportFlag === false && message.uploadExcelFlag === false && message.accountSettingsBaseFlag === false &&
            message.accountSettingsSecurityFlag === false}>
            <SearchOutlined/>
            {item.menuNm}
          </Menu.Item>
        )
      } else if(item.menuCd === '200') {
        return (
          <Menu.Item key="businessActivities"  disabled={message.formadvancedformEditActFlag && message.formadvancedformFlag === false &&
          message.reportFlag === false && message.uploadExcelFlag === false && message.accountSettingsBaseFlag === false &&
          message.accountSettingsSecurityFlag === false}>
            <EditOutlined />
            {item.menuNm}
          </Menu.Item>
          )
      } else if (item.menuCd === '300') {
        return (
          <Menu.Item key="report" disabled={message.reportFlag && message.formadvancedformEditActFlag===false && message.formadvancedformFlag === false &&
          message.uploadExcelFlag === false && message.accountSettingsBaseFlag === false &&
          message.accountSettingsSecurityFlag === false}>
            <FileTextOutlined />
            {item.menuNm}
          </Menu.Item>
           )
      }else if (item.menuCd === '400') {
          return (
            <Menu.Item key="uploadExcel" disabled={message.uploadExcelFlag &&  message.formadvancedformEditActFlag ===false && message.formadvancedformFlag === false &&
            message.reportFlag === false && message.accountSettingsBaseFlag === false &&
            message.accountSettingsSecurityFlag === false}>
              <MenuUnfoldOutlined />
              {item.menuNm}
            </Menu.Item>
          )
        } else if(item.menuCd === '500') {
          return (
            <Menu.Item key="sendMessage">
              <SendOutlined />
              {item.menuNm}
            </Menu.Item>
          )
        } else if(item.menuCd === '600') {
          return (
            <Menu.Item key="personalSetting" disabled={message.accountSettingsBaseFlag && message.formadvancedformEditActFlag===false && message.formadvancedformFlag === false &&
            message.reportFlag === false && message.uploadExcelFlag === false  &&
            message.accountSettingsSecurityFlag === false}>
              <UserOutlined />
              {item.menuNm}
            </Menu.Item>
            )
        } else if(item.menuCd === '700') {
          return (
            <Menu.Item key="passwordChange" disabled={message.accountSettingsSecurityFlag && message.formadvancedformEditActFlag===false && message.formadvancedformFlag === false &&
            message.reportFlag === false && message.uploadExcelFlag === false && message.accountSettingsBaseFlag === false
            }>
              <KeyOutlined />
              {item.menuNm}
            </Menu.Item>
          )
        }
      return (<div/>)
    };

    // @ts-ignore
    const menuInfoVos = this.props.currentUser?.menuInfoVos ? this.props.currentUser?.menuInfoVos:[];
    const menuHeaderDropdown = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
        {menuInfoVos.map((item:any) => (getMenuOption(item)))}
      </Menu>
    );
    return currentUser && currentUser.name ? (
      <div>
        <SendMessage/>
        <HeaderDropdown overlay={menuHeaderDropdown}>

        <span className={`${styles.action} ${styles.account}`}>
          <img alt="menuLogo" className={styles.logo} src={menuLogo} />
          <span className={`${styles.name} anticon`}></span>
        </span>
        </HeaderDropdown>
      </div>
    ) : (
      <span className={`${styles.action} ${styles.account}`}>
        <Spin
          size="small"
          style={{
            marginLeft: 8,
            marginRight: 8,
          }}
        />
      </span>
    );
  }
}

// @ts-ignore
export default connect(({ user ,message,global}: ConnectState) => ({
  currentUser: user.currentUser,
  sendMessageFlag:message.sendMessageFlag,
  selectMenu: global.selectMenu,
  message
}))(MenuDropdown);
