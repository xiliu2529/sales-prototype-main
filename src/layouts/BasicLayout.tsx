/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import ProLayout, {
  MenuDataItem,
  BasicLayoutProps as ProLayoutProps,
  Settings,
  DefaultFooter,
} from '../pro-layout';

import React, { useEffect, useState } from 'react';
import { Link, useIntl,  connect, Dispatch, history } from 'umi';
import {Result, Button, Col, Modal} from 'antd';
import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
import SubRightContent from '@/components/GlobalHeader/SubRightContent';
import LeftContent from '@/components/GlobalHeader/LeftContent';
import {ConnectState, GlobalModelState} from '@/models/connect';
import { SelectMenuItem } from '@/models/global';
import { getAuthorityFromRouter } from '@/utils/utils';
// 自定义logo https://www.bejson.com/convert/image_to_svg
// import logo from '../assets/logo.svg';
import logo from '../assets/logo.png';
import styles from "@/layouts/UserLayout.less";
import {formatMessage} from "@@/plugin-locale/localeExports";

const noMatch = (
  <Result
    status={403}
    title="403"
    subTitle="Sorry, you are not authorized to access this page."
    extra={
      <Button type="primary">
        <Link to="/user/login">Go Login</Link>
      </Button>
    }
  />
);
export interface BasicLayoutProps extends ProLayoutProps {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
  route: ProLayoutProps['route'] & {
    authority: string[];
  };
  settings: Settings;
  dispatch: Dispatch;
  global:GlobalModelState;
}
export type BasicLayoutContext = { [K in 'location']: BasicLayoutProps[K] } & {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
};

/**
 * use Authorized check all menu item
 */



const menuDataRender = (menuList: MenuDataItem[]): MenuDataItem[] =>
  menuList.filter((item) =>
    item.path == '/homePage'
  ).map((item) => {
    const localItem = {
      ...item,
      children: item.children ? menuDataRender(item.children) : undefined,
    };
    return Authorized.check(item.authority, localItem, null) as MenuDataItem;
  });

const subMenuDataRender = (menuList: MenuDataItem[]): MenuDataItem[] =>
  menuList.filter((item) =>
    item.path == '/homePage' ||
    item.path == '/formadvancedform'
  ).map((item) => {
    const localItem = {
      ...item,
      children: item.children ? menuDataRender(item.children) : undefined,
    };
    return Authorized.check(item.authority, localItem, null) as MenuDataItem;
  });

  const filterByMenuDate = ( menuList: MenuDataItem[], keyWord: string , selectMenu: SelectMenuItem[] ) =>
  {
    const menuListItem :MenuDataItem[] = [];
    if (menuList.length > 0 ) {
      if (selectMenu !== undefined && selectMenu !== null && selectMenu.length > 0) {
        selectMenu.forEach((item) => {
          const selectItem: MenuDataItem = {
            hideChildrenInMenu: menuList[0].hideChildrenInMenu,
            hideInMenu : menuList[0].hideInMenu,
            icon: menuList[0].icon,
            locale: menuList[0].locale,
            name: item.selectedName,
            key: item.selectedKeys,
            disabled: menuList[0].disabled,
            path :item.path,
            parentKeys:menuList[0].parentKeys,
            // 隐藏自己，并且将子节点提升到与自己平级
            flatMenu: menuList[0].flatMenu,
            // children: item.selectChildrenMenuData,
            menuData: item.selectMenuData,
          };
          // @ts-ignore
          if (null !== item.selectChildrenMenuData && undefined !== item.selectChildrenMenuData && "" !== item.selectChildrenMenuData && item.selectChildrenMenuData.length > 0) {
            selectItem.children = filterByMenuDate(menuList, keyWord, item.selectChildrenMenuData);
          }

          menuListItem.push(selectItem)
        });
      }
    }
    return menuListItem.length > 0 ? menuListItem : menuList as MenuDataItem[];
  }
/*
const filterByMenuDate = (menuList: MenuDataItem[], keyWord: string
  , selectMenu: SelectMenuItem ): MenuDataItem[] =>
    menuList.map((item) => {
      console.log(selectMenu);
      if ( (item.name && item.name.includes(keyWord)) ||
            filterByMenuDate(item.children || [], keyWord , selectMenu ).length > 0 ) {

            item.name = item.name + "AAA"
        return {
          ...item,
          children: filterByMenuDate(item.children || [], keyWord
            , selectMenu
          ),
        };
      }
      return undefined;
    })
  .filter((item) => item) as MenuDataItem[];
*/


const defaultFooterDom = (
  <DefaultFooter
    copyright={`${new Date().getFullYear()} lzt Co.,Ltd. All Rights Reserved.`}
    links={
      [
      ]
    }
  />
);

const BasicLayout: React.FC<BasicLayoutProps> = (props) => {
  const {
    dispatch,
    children,
    settings,
    location = {
      pathname: '/',
    },
    global,
    selectMenu,
  } = props;

  const [keyWord, setKeyWord] = useState('主页');
  const { formatMessage } = useIntl();

  useEffect(() => {
    props.location.state = null;
    if (dispatch) {
      dispatch({
        type: 'user/fetchCurrent',
        // type: 'global/fetchUserData',
      });
    }
  }, []);


  useEffect(() => {
    props.location.state = null;
    if (dispatch) {
      dispatch({
        type: 'cust/fetchCustomer',
        // type: 'global/fetchUserData',
      });
    }
  }, []);

  const handleSelectCollapse = (payload: boolean): void => {
    if (dispatch) {
      dispatch({
      
        type: 'global/changeSelectCollapseOrg',
        payload,
      });
    }
  };

  const authorized = getAuthorityFromRouter(props.route.routes, location.pathname || '/') || {
    authority: undefined,
  };

  const logoTitle =()=>{
    return (
      <div style={{width:'110%'}}>
        <img src={logo} alt="" />
        {/* eslint-disable-next-line @typescript-eslint/no-use-before-define */}
        <span className={styles.titleHome}>{formatMessage({ id: 'login.title' })}</span>
      </div>
    )
  }

  function info() {
    dispatch({
      type: 'global/dialogBoxModeShowFlag',
      payload: true
    });
  }

  function onCancel () {
    dispatch({
      type: 'global/dialogBoxModeShowFlag',
      payload: false
    });
  };

  return (
    <><ProLayout
      logo={logoTitle}
      formatMessage={formatMessage}
      //onCollapse={handleMenuCollapse}
      onMenuHeaderClick={() => history.push('/')}
      menuItemRender={(menuItemProps, defaultDom) => {
        if (menuItemProps.isUrl || !menuItemProps.path) {
          return defaultDom;
        }
        let pathParam;
        let path;
        if( menuItemProps.path.indexOf("?") !== -1){
         path =menuItemProps.path.substring(0,menuItemProps.path.replace(/([^?]+)$/, '').length-1)

          //path =menuItemProps.path.substring(1,menuItemProps.path.length -menuItemProps.path.indexOf("?"),)
          pathParam =menuItemProps.path.substring(path.length+4,menuItemProps.path.length)
        }else{
          path =menuItemProps.path;
          pathParam="";
        }
        // return <Link to ={menuItemProps.path} >{defaultDom}</Link>;
        return <Link to = {
          {
            pathname: path ,
            query: {
              id: pathParam,
            },
            state: {
              key: menuItemProps.key,
              menuData:menuItemProps.menuData,
            }
          }
        }
        >{defaultDom}</Link>;
      }}
      subMenuItemRender={(menuItemProps, defaultDom) => {
        if (menuItemProps.isUrl || !menuItemProps.path) {
          return defaultDom;
        }
        let pathParam;
        let path;
        if( menuItemProps.path.indexOf("?") !== -1){
        //  path =menuItemProps.path.replace(/([^?]+)$/, '')
          path =menuItemProps.path.substring(0,menuItemProps.path.replace(/([^?]+)$/, '').length-1)

          // path =menuItemProps.path.substring(menuItemProps.path.indexOf("?"),menuItemProps.path.length)
          // @ts-ignore
          //path= menuItemProps.path.match(/(\S*)?/)[1];
          pathParam =menuItemProps.path.substring(path.length+4,menuItemProps.path.length)
        }else{
          path =menuItemProps.path;
          pathParam="";
        }
        // return <Link to ={menuItemProps.path} >{defaultDom}</Link>;
        return <Link to = {
          {
            pathname: path,
            query: {
              id: pathParam,
            },
            state: {
              key: menuItemProps.key,
              menuData:menuItemProps.menuData,
            }
          }
        }
        >{defaultDom}</Link>;
      }}
      breadcrumbRender={(routers = []) => [
        {
          path: '/',
          breadcrumbName: formatMessage({ id: 'menu.home' }),
        },
        ...routers,
      ]}
      itemRender={(route, params, routes, paths) => {
        const first = routes.indexOf(route) === 0;
        return first ? (
          <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
        ) : (
            <span>{route.breadcrumbName}</span>
          );
      }}
      footerRender={() => defaultFooterDom}
      menuDataRender={menuDataRender}
      rightContentRender={() => <RightContent />}
      subRightContentRender={() => <SubRightContent menuDataRender={subMenuDataRender} />}
      leftContentRender={() => <LeftContent />}
      postMenuData={(menus) => filterByMenuDate(menus || [], keyWord, selectMenu
      )}
      {...props}
      {...settings}
    >
      <Authorized authority={authorized!.authority} noMatch={noMatch}>
        {children}
      </Authorized>
    </ProLayout>
      {props.global.dialogBoxFlag===true  || !(props.global.uploadFileFlag===false && props.global.editorMarkDownFlag===false) ?(
        <div id='cover' style={{position: 'fixed', opacity: '0.2', top: '0px', width: '100%', height: '97px', backgroundColor: 'black', zIndex: 10009}} onClick={info} />
      ):(<div/>)}
      <Modal
        visible={global.dialogBoxModeShowFlag}
        closable={false}
        centered
        destroyOnClose
        maskClosable={false}
        footer={
          [<Button key="back" onClick={onCancel} >{formatMessage({id: 'components.DialogBox.button.onCancel'})}</Button>] 
        }
      >
        <p>{formatMessage({id: 'components.DialogBox.content'})}</p>
      </Modal>
    </>

  );
};
export default connect(({ global, settings,user,cust }: ConnectState) => ({
  collapsed: global.collapsed,
  selectMenu: global.selectMenu,
  selectCollapsed: global.selectCollapsed,
  userInfoList:user.currentUser,
  custInfoList:cust.customer,
  settings,
  global,
}))(BasicLayout);

