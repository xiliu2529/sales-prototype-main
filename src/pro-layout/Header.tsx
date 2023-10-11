import './Header.less';

import React, { Component } from 'react';
import classNames from 'classnames';
import { Layout } from 'antd';
import GlobalHeader, { GlobalHeaderProps } from './GlobalHeader';
import TopNavHeader from './TopNavHeader';
import SubTopNavHeader from './SubTopNavHeader';
import { WithFalse } from './typings';
import { PrivateSiderMenuProps } from './SiderMenu/SiderMenu';
import { clearMenuItem } from './utils/utils';
import { black } from 'chalk';

const { Header } = Layout;

export type HeaderViewProps = GlobalHeaderProps & {
  isMobile?: boolean;
  collapsed?: boolean;
  logo?: React.ReactNode;

  headerRender?: WithFalse<
    (props: HeaderViewProps, defaultDom: React.ReactNode) => React.ReactNode
  >;
  headerTitleRender?: WithFalse<
    (props: HeaderViewProps, defaultDom: React.ReactNode) => React.ReactNode
  >;
  headerContentRender?: WithFalse<(props: HeaderViewProps) => React.ReactNode>;
  siderWidth?: number;
  hasSiderMenu?: boolean;
};

interface HeaderViewState {
  visible: boolean;
}

class HeaderView extends Component<HeaderViewProps & PrivateSiderMenuProps, HeaderViewState> {
  renderContentFirst = () => {
    const {
      isMobile,
      onCollapse,
      navTheme,
      layout,
      headerRender,
      headerContentRender,
    } = this.props;
    const isTop = layout === 'top';
    const clearMenuData = clearMenuItem([]);
    let defaultDom = (
      <GlobalHeader onCollapse={onCollapse} {...this.props} menuData={clearMenuData}>
        {headerContentRender && headerContentRender(this.props)}
      </GlobalHeader>
    );
    if (isTop && !isMobile) {
      defaultDom = (
        <TopNavHeader
          theme={navTheme as 'light' | 'dark'}
          mode="horizontal"
          onCollapse={onCollapse}
          {...this.props}
          menuData={clearMenuData}
        />
      );
    }
    if (headerRender && typeof headerRender === 'function') {
      return headerRender(this.props, defaultDom);
    }
    return defaultDom;
  };

  renderContentSecond = () => {
    const {
      onCollapse,
      navTheme,
    } = this.props;
    const clearMenuData = clearMenuItem(this.props.menuData || []);

    let defaultDom = (
      <SubTopNavHeader
        theme={navTheme as 'light' | 'dark'}
        mode="horizontal"
        onCollapse={onCollapse}
        {...this.props}
        menuData={clearMenuData}
      />
    );
    return defaultDom;
  };

  render(): React.ReactNode {
    const {
      fixedHeader,
      layout,
      className: propsClassName,
      style,
      collapsed,
      siderWidth,
      hasSiderMenu,
      isMobile,
      prefixCls,
      headerHeight,
    } = this.props;
    const needFixedHeader = fixedHeader || layout === 'mix';
    const isTop = layout === 'top';

    const needSettingWidth = needFixedHeader && hasSiderMenu && !isTop && !isMobile;

    const className = classNames(propsClassName, {
      [`${prefixCls}-fixed-header`]: needFixedHeader,
      [`${prefixCls}-top-menu`]: isTop,
    });

    /**
     * 计算侧边栏的宽度，不然导致左边的样式会出问题
     */
    const width =
      layout !== 'mix' && needSettingWidth
        ? `calc(100% - ${collapsed ? 48 : siderWidth}px)`
        : '100%';

    const right = needFixedHeader ? 0 : undefined;

    return (
      <>
        {needFixedHeader && (
          <Header
            style={{
              height: headerHeight,
              lineHeight: `${headerHeight}px`,
              background: 'transparent',
            }}
          />
        )}
        <Header
          style={{
            padding: 0,
            height: headerHeight,
            lineHeight: `${headerHeight}px`,
            color: '#1890ff',
            background: '#F2F2F2',
            width,
            zIndex: layout === 'mix' ? 100 : 19,
            right,
            ...style,
          }}
          className={className}
        >
          {this.renderContentFirst()}
        </Header>
        <Header
          style={{
            padding: 0,
            height: headerHeight,
            lineHeight: `${headerHeight}px`,
            background: '#003D82',
            width,
            zIndex: layout === 'mix' ? 100 : 19,
            right,
            ...style,
          }}
          className={className}
        >
          {this.renderContentSecond()}
        </Header>
      </>
    );
  }
}

export default HeaderView;
