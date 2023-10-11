import React, { CSSProperties } from 'react';
import { Layout } from 'antd';
import { ConfigProviderWrap } from '@ant-design/pro-provider';
import SelectDrawer from "@/components/SelectDrawer";

const WrapContent: React.FC<{
  isChildrenLayout?: boolean;
  className?: string;
  style?: CSSProperties;
  location?: any;
  contentHeight?: number | string;
}> = (props) => {
  const { style, className, children } = props;
  return (
    <ConfigProviderWrap>

      <Layout.Content id ={'ant-layout-content1975'}  className={className} style={style} >
        <SelectDrawer/>
        {children}
      </Layout.Content>

    </ConfigProviderWrap>
  );
};

export default WrapContent;
