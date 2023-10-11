import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Badge, Menu, Spin } from 'antd';
import React from 'react';
import { history, ConnectProps, connect } from 'umi';
import { ConnectState } from '@/models/connect';
import { CurrentUser } from '@/models/user';
import styles from './index.less';
import PersonLogo from '../../assets/person.png';

export interface GlobalHeaderRightProps extends Partial<ConnectProps> {
  currentUser?: CurrentUser;
  menu?: boolean;
}

class AvatarDropdown extends React.Component<GlobalHeaderRightProps> {
  onMenuClick = (event: {
    key: React.Key;
    keyPath: React.Key[];
    item: React.ReactInstance;
    domEvent: React.MouseEvent<HTMLElement>;
  }) => {
    const { key } = event;

    if (key === 'logout') {
      const { dispatch } = this.props;

      if (dispatch) {
        dispatch({
          type: 'login/logout',
        });
      }

      return;
    }

    history.push(`/account/${key}`);
  };

  render(): React.ReactNode {
    const {
      currentUser = {
        avatar: '',
        name: '',
      },
    } = this.props;

    return currentUser && currentUser.name ? (
      <span className={`${styles.action} ${styles.account}`}>
        <span className={`${styles.name} anticon`}>{currentUser.name}</span>
        <Badge count={1}>
          <Avatar
            size="small"
            shape="square"
            style={{
              marginLeft: 0,
              marginRight: 0,
              padding: 0,
            }}
            className={styles.avatar}
            src={PersonLogo}
            alt="avatar"
          />
        </Badge>
      </span>
    ) : (
      <span className={`${styles.action} ${styles.account}`}>
        <Spin
          size="large"
          style={{
            marginLeft: 0,
            marginRight: 0,
          }}
        />
      </span>
    );
  }
}

export default connect(({ user }: ConnectState) => ({
  currentUser: user.currentUser,
}))(AvatarDropdown);
