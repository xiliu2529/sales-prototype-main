import { CopyrightOutlined, GithubOutlined } from '@ant-design/icons';
import { Layout } from 'antd';
import React, { Fragment, CSSProperties } from 'react';

import GlobalFooter from './GlobalFooter';
import { WithFalse } from './typings';
import {formatMessage} from "@@/plugin-locale/localeExports";

const { Footer } = Layout;

const defaultLinks = [

];

const defaultCopyright = `${new Date().getFullYear()} lzt Co.,Ltd. All Rights Reserved.`;
export interface FooterProps {
  links?: WithFalse<
    {
      key?: string;
      title: React.ReactNode;
      href: string;
      blankTarget?: boolean;
    }[]
  >;
  copyright?: WithFalse<String>;
  style?: CSSProperties;
  className?: string;
}

const FooterView: React.FC<FooterProps> = ({ links, copyright, style, className }: FooterProps) => (
  <Footer className={className} style={{ padding: 0, ...style }}>
    <GlobalFooter
      links={links !== undefined ? links : defaultLinks}
      copyright={
        copyright === false ? null : (
          <Fragment>
            Copyright <CopyrightOutlined /> {copyright || defaultCopyright}
          </Fragment>
        )
      }
    />
  </Footer>
);

export default FooterView;
