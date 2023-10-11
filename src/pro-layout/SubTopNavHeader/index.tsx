import React, { useRef, useState } from 'react';
import classNames from 'classnames';
import ResizeObserver from 'rc-resize-observer';
import {
  SiderMenuProps,
  defaultRenderLogoAndTitle,
  PrivateSiderMenuProps,
} from '../SiderMenu/SiderMenu';
import './index.less';

import BaseMenu from '../SiderMenu/BaseMenu';
import { GlobalHeaderProps } from '../GlobalHeader';
import {connect} from "umi";
import {ConnectState} from "@/models/connect";

export type TopNavHeaderProps = SiderMenuProps & GlobalHeaderProps & PrivateSiderMenuProps & {};

/**
 * 抽离出来是为了防止 rightSize 经常改变导致菜单 render
 * @param param0
 */
const LeftContent: React.FC<TopNavHeaderProps> = ({ leftContentRender, ...props }) => {
  const [rightSize, setRightSize] = useState<number | string>('auto');

  return (
    <div
      style={{
        minWidth: rightSize,
      }}
    >
      <div
        style={{
          paddingRight: 8,
        }}
      >
        <ResizeObserver
          onResize={({ width }: { width: number }) => {
            setRightSize(width);
          }}
        >
          {leftContentRender && (
            <div>
              {leftContentRender({
                ...props,
              })}
            </div>
          )}
        </ResizeObserver>
      </div>
    </div>
  );
};

/**
 * 抽离出来是为了防止 rightSize 经常改变导致菜单 render
 * @param param0
 */
const SubRightContent: React.FC<TopNavHeaderProps> = ({ subRightContentRender, ...props }) => {
  const [rightSize, setRightSize] = useState<number | string>('auto');

  return (
    <div
      style={{
        minWidth: rightSize,
      }}
    >
      <div
        style={{
          paddingRight: 8,
        }}
      >
        <ResizeObserver
          onResize={({ width }: { width: number }) => {
            setRightSize(width);
          }}
        >
          {subRightContentRender && (
            <div>
              {subRightContentRender({
                ...props,
              })}
            </div>
          )}
        </ResizeObserver>
      </div>
    </div>
  );
};

const SubTopNavHeader: React.FC<TopNavHeaderProps> = (props) => {
  const ref = useRef(null);
  // @ts-ignore
  const {
    theme,
    onMenuHeaderClick,
    contentWidth,
    leftContentRender,
    subRightContentRender,
    className: propsClassName,
    style,
    layout,
    displayBaseMenuFlag,
  } = props;
  const prefixCls = `${props.prefixCls || 'ant-pro'}-top-nav-header`;
  const headerDom = defaultRenderLogoAndTitle(
    { ...props, collapsed: false },
    layout === 'mix' ? 'headerTitleRender' : undefined,
  );

  const className = classNames(prefixCls, propsClassName, {
    light: theme === 'light',
  });

  return (
    <div className={className} style={style}>
      <div ref={ref} className={`${prefixCls}-main ${contentWidth === 'Fixed' ? 'wide' : ''}`}>
        {headerDom && (
          <div className={`${prefixCls}-main-left`} >
            <div className={`${prefixCls}-logo`} key="logo" id="logo">
              {leftContentRender && (
                <LeftContent leftContentRender={leftContentRender} {...props} />
              )}
            </div>
          </div>
        )}
        { props.displayBaseMenuFlag === true ?
           <div style={{ flex: 1 }} className={`${prefixCls}-menu`}>
             <BaseMenu {...props} {...props.menuProps} />
           </div>
          :
          <div style={{width:'100%'}}/>
        }
        <div className={`${prefixCls}-main-right`}>
          {subRightContentRender && (
            <SubRightContent subRightContentRender={subRightContentRender} {...props} />
          )}
        </div>
      </div>
    </div>
  );
};

// @ts-ignore
export default connect(({ global}: ConnectState) => ({
  displayBaseMenuFlag:global.baseMenuFlag,
}))(SubTopNavHeader);

