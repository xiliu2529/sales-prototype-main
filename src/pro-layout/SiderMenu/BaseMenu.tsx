import './index.less';
import Icon, { createFromIconfontCN } from '@ant-design/icons';
import { Menu } from 'antd';
import React, { useEffect, useState, useRef, useMemo } from 'react';
import classNames from 'classnames';
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import { isUrl, isImg } from '@ant-design/pro-utils';

import { MenuMode, MenuProps } from 'antd/lib/menu';
import { MenuTheme } from 'antd/lib/menu/MenuContext';
import defaultSettings, { PureSettings } from '../defaultSettings';
import { getOpenKeysFromMenuData } from '../utils/utils';

import { MenuDataItem, MessageDescriptor, Route, RouterTypes, WithFalse } from '../typings';
import MenuCounter from './Counter';
import { PrivateSiderMenuProps } from './SiderMenu';
import { PageLoading } from '..';

export interface BaseMenuProps
  extends Partial<RouterTypes<Route>>,
    Omit<MenuProps, 'openKeys' | 'onOpenChange' | 'title'>,
    Partial<PureSettings> {
  className?: string;
  /**
   *默认的是否展开，会受到 breakpoint 的影响
   */
  defaultCollapsed?: boolean;
  collapsed?: boolean;
  splitMenus?: boolean;
  isMobile?: boolean;
  menuData?: MenuDataItem[];
  mode?: MenuMode;
  onCollapse?: (collapsed: boolean) => void;
  openKeys?: WithFalse<string[]> | undefined;
  handleOpenChange?: (openKeys: string[]) => void;

  /**
   * 要给菜单的props, 参考antd-menu的属性。https://ant.design/components/menu-cn/
   */
  menuProps?: MenuProps;
  style?: React.CSSProperties;
  theme?: MenuTheme;
  formatMessage?: (message: MessageDescriptor) => string;
  subMenuItemRender?: WithFalse<
    (
      item: MenuDataItem & {
        isUrl: boolean;
      },
      defaultDom: React.ReactNode,
    ) => React.ReactNode
  >;
  menuItemRender?: WithFalse<
    (
      item: MenuDataItem & {
        isUrl: boolean;
      },
      defaultDom: React.ReactNode,
    ) => React.ReactNode
  >;
  postMenuData?: (menusData?: MenuDataItem[]) => MenuDataItem[];
}

const { SubMenu } = Menu;

let IconFont = createFromIconfontCN({
  scriptUrl: defaultSettings.iconfontUrl,
});

// Allow menu.js config icon as string or ReactNode
//   icon: 'setting',
//   icon: 'icon-geren' #For Iconfont ,
//   icon: 'http://demo.com/icon.png',
//   icon: '/favicon.png',
//   icon: <Icon type="setting" />,
const getIcon = (icon?: string | React.ReactNode): React.ReactNode => {
  if (typeof icon === 'string' && icon !== '') {
    if (isUrl(icon) || isImg(icon)) {
      return (
        <Icon component={() => <img src={icon} alt="icon" className="ant-pro-sider-menu-icon" />} />
      );
    }
    if (icon.startsWith('icon-')) {
      return <IconFont type={icon} />;
    }
  }
  return icon;
};

class MenuUtil {
  constructor(props: BaseMenuProps) {
    this.props = props;
  }

  props: BaseMenuProps;

  getNavMenuItems = (menusData: MenuDataItem[] = [], isChildren: boolean): React.ReactNode[] =>
    menusData.map((item) => this.getSubMenuOrItem(item, isChildren)).filter((item) => item);

  /**
   * get SubMenu or Item
   */
  getSubMenuOrItem = (item: MenuDataItem, isChildren: boolean): React.ReactNode => {
    if (Array.isArray(item.children) && item && item.children.length > 0) {
      const name = this.getIntlName(item);
      const { subMenuItemRender, prefixCls } = this.props;
      //  get defaultTitle by menuItemRender
      const defaultTitle = item.icon ? (
        <span className={`${prefixCls}-menu-item`}>
          <span className={`${prefixCls}-menu-item-title`}>{name}</span>
        </span>
      ) : (
        <span className={`${prefixCls}-menu-item`}>{name}</span>
      );

      // subMenu only title render
      const title = subMenuItemRender
        ? subMenuItemRender({ ...item, isUrl: false }, defaultTitle)
        : defaultTitle;

      return (
        <SubMenu title={title} key={item.key} onTitleClick={item.onTitleClick}>
          {this.getNavMenuItems(item.children, true)}
        </SubMenu>
      );
    }

    return (
      <Menu.Item inlineIndent={24} disabled={item.disabled} key={item.key}>
        {this.getMenuItemPath(item, isChildren)}
      </Menu.Item>
    );
  };

  getIntlName = (item: MenuDataItem) => {
    const { name, locale } = item;
    const {
      menu = {
        locale: false,
      },
      formatMessage,
    } = this.props;
    if (locale && menu.locale !== true && formatMessage) {
      return formatMessage({
        id: locale,
        defaultMessage: name,
      });
    }
    return name;
  };

  /**
   * 判断是否是http链接.返回 Link 或 a
   * Judge whether it is http link.return a or Link
   * @memberof SiderMenu
   */
  getMenuItemPath = (item: MenuDataItem, isChildren: boolean) => {
    const itemPath = this.conversionPath(item.path || '/');
    const { location = { pathname: '/' }, isMobile, onCollapse, menuItemRender } = this.props;
    const { target } = item;
    // if local is true formatMessage all name。
    const name = this.getIntlName(item);
    const { prefixCls } = this.props;
    const icon = isChildren ? null : getIcon(item.icon);
    let defaultItem = (
      <span className={`${prefixCls}-menu-item`}>
        <span className={`${prefixCls}-menu-item-title`}>{name}</span>
      </span>
    );
    const isHttpUrl = isUrl(itemPath);

    // Is it a http link
    if (isHttpUrl) {
      defaultItem = (
        <a href={itemPath} target={target} className={`${prefixCls}-menu-item`}>
          {icon}
          <span className={`${prefixCls}-menu-item-title`}>{name}</span>
        </a>
      );
    }

    if (menuItemRender) {
      const renderItemProps = {
        ...item,
        isUrl: isHttpUrl,
        itemPath,
        isMobile,
        replace: itemPath === location.pathname,
        onClick: () => onCollapse && onCollapse(true),
      };
      return menuItemRender(renderItemProps, defaultItem);
    }
    return defaultItem;
  };

  conversionPath = (path: string) => {
    if (path && path.indexOf('http') === 0) {
      return path;
    }
    return `/${path || ''}`.replace(/\/+/g, '/');
  };
}

/**
 * 生成openKeys 的对象，因为设置了openKeys 就会变成受控，所以需要一个空对象
 * @param BaseMenuProps
 */
const getOpenKeysProps = (
  openKeys: React.ReactText[] | false,
  { layout, collapsed }: BaseMenuProps,
): {
  openKeys?: undefined | string[];
} => {
  let openKeysProps = {};
  if (openKeys && !collapsed && ['side', 'mix'].includes(layout || 'mix')) {
    openKeysProps = {
      openKeys,
    };
  }
  return openKeysProps;
};

const BaseMenu: React.FC<BaseMenuProps & PrivateSiderMenuProps> = (props) => {
  const {
    theme,
    mode,
    className,
    handleOpenChange,
    style,
    menuData,
    menu,
    matchMenuKeys,
    iconfontUrl,
    collapsed,
    selectedKeys: propsSelectedKeys,
    onSelect,
    openKeys: propsOpenKeys,
  } = props;

  // @ts-ignore
  const selectKey =props.location.query.id;
  const pathname =props.location.pathname.substring(1,props.location.pathname.length)
  const openKeysRef = useRef<string[]>([]);
  // 用于减少 defaultOpenKeys 计算的组件
  const defaultOpenKeysRef = useRef<string[]>([]);

  const { flatMenuKeys } = MenuCounter.useContainer();
  const [defaultOpenAll, setDefaultOpenAll] = useState(menu?.defaultOpenAll);

  const [openKeys, setOpenKeys] = useMergedState<WithFalse<React.ReactText[]>>(
    () => {
      if (menu?.defaultOpenAll) {
        return getOpenKeysFromMenuData(menuData) || [];
      }
      if (propsOpenKeys === false) {
        return false;
      }
      return [];
    },
    {
      value: propsOpenKeys === false ? undefined : propsOpenKeys,
      onChange: handleOpenChange as any,
    },
  );

  const [selectedKeys, setSelectedKeys] = useMergedState<string[] | undefined>([], {
    value: propsSelectedKeys,
    onChange: onSelect
      ? (keys) => {
          if (onSelect && keys) {
            onSelect(keys as any);
          }
        }
      : undefined,
  });

  useEffect(() => {
    if (menu?.defaultOpenAll || propsOpenKeys === false || flatMenuKeys.length) {
      return;
    }
    if (matchMenuKeys) {
      openKeysRef.current = matchMenuKeys;
      setOpenKeys(matchMenuKeys);
      setSelectedKeys(matchMenuKeys);
    }
  }, [matchMenuKeys.join('-')]);
  useEffect(() => {
    // reset IconFont
    if (iconfontUrl) {
      IconFont = createFromIconfontCN({
        scriptUrl: iconfontUrl,
      });
    }
  }, [iconfontUrl]);

  useEffect(() => {
    // if pathname can't match, use the nearest parent's key
    const keys = matchMenuKeys;
    const animationFrameId = requestAnimationFrame(() => {
      if (keys.join('-') !== (selectedKeys || []).join('-')) {
        setSelectedKeys(keys);
      }
      if (
        !defaultOpenAll &&
        propsOpenKeys !== false &&
        keys.join('-') !== (openKeysRef.current || []).join('-')
      ) {
        setOpenKeys(keys);
        openKeysRef.current = keys;
      } else if (flatMenuKeys.length > 0) {
        setDefaultOpenAll(false);
      }
    });
    return () => window.cancelAnimationFrame && window.cancelAnimationFrame(animationFrameId);
  }, [matchMenuKeys.join('-'), collapsed]);

  const openKeysProps = useMemo(() => getOpenKeysProps(openKeys, props), [
    openKeys && openKeys.join(','),
    props.layout,
    props.collapsed,
  ]);

  const [menuUtils] = useState(() => new MenuUtil(props));

  if (menu?.loading) {
    return <PageLoading />;
  }

  const cls = classNames(className, {
    'top-nav-menu': mode === 'horizontal',
  });

  // sync props
  menuUtils.props = props;

  // 这次 openKeys === false 的时候的情况，这种情况下帮用户选中一次
  // 第二此不会使用，所以用了 defaultOpenKeys
  // 这里返回 null，是为了让 defaultOpenKeys 生效
  if (props.openKeys === false && !props.handleOpenChange) {
    defaultOpenKeysRef.current = matchMenuKeys;
  }

  let finallyData = props.postMenuData ? props.postMenuData(menuData) : menuData;
  if(menuUtils.props.selectMenu === null || menuUtils.props.selectMenu===undefined || menuUtils.props.selectMenu ===[]
    ||menuUtils.props.selectMenu.length ===0){
   finallyData =[];
 }

  if (finallyData && finallyData?.length < 1) {
    return null;
  }

  let defaultOpenKeys: any[] | undefined = [];

  //panx
  // @ts-ignore
  if(menuUtils.props.location.state === null || menuUtils.props.location.state === undefined
    // @ts-ignore
    || menuUtils.props.location.state.key === null || undefined === menuUtils.props.location.state.key ){
    // @ts-ignore
      if (menuUtils.props.selectMenu !== null && undefined !== menuUtils.props.selectMenu && menuUtils.props.selectMenu.length > 0){
        const selectMenuList:any[]=[];
        let path="";
        let pathParam="";
        menuUtils.props.selectMenu.map((item:any) => {
          if(item.path !== null && item.path !== "" && item.path.length>0 && item.path.indexOf("homePage") !== -1){
            selectMenuList.push(item);
          }
          if(item.path !== null && item.path !== "" && item.path.length>0 && item.path.indexOf("?") !== -1 && item.path.replace(/([^?]+)$/, '').length !==item.path.length){
            selectMenuList.push(item);
          }
         if(item.selectChildrenMenuData !== []  && item.selectChildrenMenuData !== undefined && item.selectChildrenMenuData.length>0){
           item.selectChildrenMenuData.map((itemChild:any)=>{
             if(itemChild.path !== null && itemChild.path !== "" && itemChild.path.length>0 &&  itemChild.path.indexOf("?") !== -1 && itemChild.path.replace(/([^?]+)$/, '').length !==itemChild.path.length){
               selectMenuList.push(itemChild);
             }
           })
         }
        })
        if(selectMenuList !== [] && selectMenuList.length>0){
          selectMenuList.some((item:any)=>{
            if(pathname.indexOf("homePage") !== -1){
              pathParam ==="homePage";
            }else{
            path =item.path.substring(0,item.path.replace(/([^?]+)$/, '').length-1)
            pathParam =item.path.substring(path.length+4,item.path.length)
            }
            if(selectKey === pathParam){
              defaultOpenKeys =[item.selectedKeys];
              return true;
            }else if(item.path !== null && item.path !== "" && item.path.length>0 &&
              item.path.indexOf("homePage") !== -1 && pathname.indexOf(pathParam) !==-1){
              defaultOpenKeys =[selectMenuList[0].selectedKeys];
              return true;
            }
          })
        }else{
        // @ts-ignore
        defaultOpenKeys = [menuUtils.props.selectMenu[0].selectedKeys];
        }
      }
    }else {
    // @ts-ignore
    defaultOpenKeys = [menuUtils.props.location.state.key]
  }


  return (
    <Menu
      {...openKeysProps}
      key="Menu"
      mode={mode}
      // defaultOpenKeys={defaultOpenKeys}
      selectedKeys={defaultOpenKeys}
      theme={theme}
    //  inlineIndent={16}
     // selectedKeys={selectedKeys}
   //   style={style}
    //  className={cls}
      onOpenChange={(keys) => {
        openKeysRef.current = keys as string[];
        setOpenKeys(keys as string[]);
      }}
      {...props.menuProps}
    >
      {menuUtils.getNavMenuItems(finallyData, false)}
    </Menu>
  );
};

BaseMenu.defaultProps = {
  postMenuData: (data) => data || [],
};

export default BaseMenu;
