import React, { useContext, useEffect, useMemo, ReactNode } from 'react';
import { ConfigProvider } from 'antd';
import classNames from 'classnames';
import omit from 'omit.js';

import './index.less';
import { RouteContext, RouteContextType } from '../index';

export interface FooterToolbarProps {
  extra?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  renderContent?: (
    props: FooterToolbarProps & RouteContextType & { leftWidth?: string },
    dom: JSX.Element,
  ) => ReactNode;
  prefixCls?: string;
}
const FooterToolbar: React.FC<FooterToolbarProps> = (props) => {
  const { children, className, extra, style, renderContent, ...restProps } = props;
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);

  const prefixCls = props.prefixCls || getPrefixCls('pro');
  const baseClassName = `${prefixCls}-footer-bar`;
  const value = useContext(RouteContext);
  const width = useMemo(() => {
    const { hasSiderMenu, isMobile, siderWidth } = value;
    if (!hasSiderMenu) {
      return undefined;
    }
    // 0 or undefined
    if (!siderWidth) {
      return '100%';
    }
    return isMobile ? '100%' : `calc(100% - ${siderWidth}px)`;
  }, [value.collapsed, value.hasSiderMenu, value.isMobile, value.siderWidth]);

  const dom = (
    <>
      <div className={`${baseClassName}-left`}>{extra}</div>
      <div className={`${baseClassName}-right`}>{children}</div>
    </>
  );

  /**
   * 告诉 props 是否存在 footerBar
   */
  useEffect(() => {
    if (!value || !value?.setHasFooterToolbar) {
      return () => {};
    }
    value?.setHasFooterToolbar(true);
    return () => {
      if (!value || !value?.setHasFooterToolbar) {
        return;
      }
      value?.setHasFooterToolbar(false);
    };
  }, []);

  return (
    <div
      className={classNames(className, `${baseClassName}`)}
      style={{ width, ...style }}
      {...omit(restProps, ['prefixCls'])}
    >
      {renderContent
        ? renderContent(
            {
              ...props,
              ...value,
              leftWidth: width,
            },
            dom,
          )
        : dom}
    </div>
  );
};

export default FooterToolbar;
