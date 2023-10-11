import { Settings as ProSettings } from '../../pro-layout';
import React from 'react';
import { history ,connect, ConnectProps } from 'umi';
import { ConnectState } from '@/models/connect';
import Menu from './MenuDropdown';
import styles from './index.less';
import HomeLogo from '../../assets/home.png';
import { MenuDataItem } from '@ant-design/pro-layout';
import {SelectMenuItem} from "@/models/global";

export interface GlobalHeaderSubRightProps
  extends Partial<ConnectProps>,
    Partial<ProSettings>,
    Partial<MenuDataItem> {
  theme?: ProSettings['navTheme'] | 'realDark';
}

const ENVTagColor = {
  dev: 'orange',
  test: 'green',
  pre: '#87d068',
};

const GlobalHeaderSubRight: React.SFC<GlobalHeaderSubRightProps> = (props) => {
  const { theme, layout, menuDataRender } = props;
  let className = styles.right;

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


  /**
   * 设置title菜单
   * @param payload
   */
  const changeSelectMenuState = (payload: SelectMenuItem[]): void => {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const { dispatch } =props;
    if (dispatch) {
      dispatch({
        type: 'global/changeSelectMenu',
        payload
      });
    }
  };
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
    const{homePageMenu}=props;
    changeRightMenu(false,false,false,false,false,false)

    // eslint-disable-next-line consistent-return
    changeBaseMenuShowState(true);
    changeSelectMenuState(homePageMenu)
    history.push(`/homePage`);
  };

  if (theme === 'dark' && layout === 'top') {
    className = `${styles.right}  ${styles.dark}`;
  }

  return (
    <div className={className}>
      <Menu menuDataRender={menuDataRender} />
      <span className={`${styles.action} ${styles.account}`}
         onClick={() => { onMenuClick(); }}
      >
        <img alt="HomeLogo" className={styles.logo} src={HomeLogo}/>
        <span className={`${styles.name} anticon`}></span>
      </span>
    </div>
  );
};

export default connect(({ settings,message,global}: ConnectState) => ({
  theme: settings.navTheme,
  layout: settings.layout,
  homePageMenu: global.homePageMenu,
  message
}))(GlobalHeaderSubRight);
