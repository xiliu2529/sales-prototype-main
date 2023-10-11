import {DefaultFooter, getMenuData, getPageTitle, MenuDataItem} from '../pro-layout';
import {Helmet, HelmetProvider} from 'react-helmet-async';
import {connect, ConnectProps, useIntl} from 'umi';
import React from 'react';
import {ConnectState} from '@/models/connect';

import styles from './UserLayout.less';

export interface ErrLayoutProps extends Partial<ConnectProps> {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
}

const ErrorLayout: React.FC<ErrLayoutProps> = (props) => {
  const {
    route = {
      routes: [],
    },
  } = props;
  const { routes = [] } = route;
  const {
    children,
    location = {
      pathname: '',
    },
  } = props;
  const { formatMessage } = useIntl();
  const { breadcrumb } = getMenuData(routes);
  const title = getPageTitle({
    pathname: location.pathname,
    formatMessage,
    breadcrumb,
    ...props,
  });
  return (
    <HelmetProvider>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={title} />
      </Helmet>

      <div className={styles.container}>
        <div className={styles.content}>
          {children}
        </div>
        <DefaultFooter />
      </div>
    </HelmetProvider>
  );
};

export default connect(({ settings }: ConnectState) => ({ ...settings }))(ErrorLayout);
