import {Button, Result} from 'antd';
import React from 'react';
import {history} from 'umi';
import {formatMessage} from "@@/plugin-locale/localeExports";

const NoFoundPage: React.FC<{}> = () => (
  <div>
    <Result
      status="404"
      title="404"
      subTitle={formatMessage({ id: 'exception404.description.404' })}
      extra={
        <Button type="primary" onClick={() => history.push('/user/login')}>
          {formatMessage({ id: 'exception500.exception.back' })}
        </Button>
      }
    />
  </div>
);

export default NoFoundPage;
