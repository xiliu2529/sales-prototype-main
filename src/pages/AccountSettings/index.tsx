import React, { Component } from 'react';

import { FormattedMessage, Dispatch, connect } from 'umi';
import { GridContent } from '@ant-design/pro-layout';
import {Col, Menu, Row} from 'antd';
import BaseView from './components/base';
import BindingView from './components/binding';
import {ChangePassModel, CurrentUser} from './data.d';
import NotificationView from './components/notification';
import SecurityView from './components/security';
import styles from './style.less';
import {ConnectState} from "@/models/connect";

const { Item } = Menu;

interface AccountSettingsProps {
  dispatch: Dispatch;
  currentUser: CurrentUser;
}

type AccountSettingsStateKeys = 'base' | 'security' | 'binding' | 'notification';
interface AccountSettingsState {
  mode: 'inline' | 'horizontal';
  menuMap: {
    [key: string]: React.ReactNode;
  };
  selectKey: AccountSettingsStateKeys;
}

class AccountSettings extends Component<
  AccountSettingsProps,
  AccountSettingsState
> {
  main: HTMLDivElement | undefined = undefined;

  constructor(props: AccountSettingsProps) {
    super(props);
    const menuMap = {
      base: <FormattedMessage id="accountsettings.PersonalSettings" defaultMessage="Personal settings" />,
      security: (
        <FormattedMessage id="accountsettings.ChangePassword" defaultMessage="Change password" />
      ) /* ,
      binding: (
        <FormattedMessage id="accountsettings.menuMap.binding" defaultMessage="Account Binding" />
      ),
      notification: (
        <FormattedMessage
          id="accountsettings.menuMap.notification"
          defaultMessage="New Message Notification"
        />
      ), */
    };
    this.state = {
      mode: 'inline',
      menuMap,
      selectKey: 'base',
    };
  }

  async componentDidMount() {
    const {dispatch} = this.props;
    // @ts-ignore
    const {user} = this.props;
    const oldPassword = "";
    const newPassword = "";
    const confirmPassword = "";
    const email = "";
    const dispYear = "";
    const loginUserCd = user.currentUser.userid;

    const caseParam: ChangePassModel = {loginUserCd, oldPassword, newPassword, confirmPassword, email, dispYear};
    const changePassModel = JSON.stringify(caseParam);

    await dispatch({
      type: 'accountSettings/fetchCurrentInfo',
      payload: {
        changePassModel,
      },
    })

    window.addEventListener('resize', this.resize);
    this.resize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  getMenu = () => {
    const { menuMap } = this.state;
    return Object.keys(menuMap).map((item) => <Item key={item}>{menuMap[item]}</Item>);
  };

  getRightTitle = () => {
    const { selectKey, menuMap } = this.state;
    return menuMap[selectKey];
  };

   selectKey = (key: AccountSettingsStateKeys) => {
    this.setState({
      selectKey: key,
    });
  };

  resize = () => {
    if (!this.main) {
      return;
    }
    requestAnimationFrame(() => {
      if (!this.main) {
        return;
      }
      let mode: 'inline' | 'horizontal' = 'inline';
      const { offsetWidth } = this.main;
      if (this.main.offsetWidth < 641 && offsetWidth > 400) {
        mode = 'horizontal';
      }
      if (window.innerWidth < 768 && offsetWidth > 400) {
        mode = 'horizontal';
      }
      this.setState({
        mode,
      });
    });
  };

  renderChildren = () => {
    // const { selectKey } = this.state;
    // @ts-ignore
    const { currentUser,user} = this.props;
    const selectKey =this.props.location.query.id;
    switch (selectKey) {
      case 'base':
        return <BaseView />;
      case 'security':
        return <SecurityView name={currentUser.name} userId={user.currentUser.userid}/>;
      case 'binding':
        return <BindingView />;
      case 'notification':
        return <NotificationView />;
      default:
        break;
    }

    return null;
  };

  render() {
    const { currentUser } = this.props;
    if (!currentUser) {
      return '';
    }
    const { mode, selectKey } = this.state;
    return (
      <GridContent>
        <div
          className={styles.main}
          ref={(ref) => {
            if (ref) {
              this.main = ref;
            }
          }}
        >

   {/*   <div className={styles.leftMenu}>
            <Menu
              mode={mode}
              selectedKeys={[selectKey]}
              onClick={({ key }) => this.selectKey(key as AccountSettingsStateKeys)}
            >
              {this.getMenu()}
            </Menu>
          </div> */}

          <div className={styles.right}>
            {/* <div className={styles.title}>{this.getRightTitle()}</div> */}
            {this.renderChildren()}
          </div>
        </div>
      </GridContent>
    );
  }
}

// @ts-ignore
export default connect(
  ({ accountSettings,user,global }: { accountSettings: { currentUser: CurrentUser };user:ConnectState; }) => ({
    currentUser: accountSettings.currentUser,
    user,
    selectKey:global.selectKey,
  }),
)(AccountSettings);
