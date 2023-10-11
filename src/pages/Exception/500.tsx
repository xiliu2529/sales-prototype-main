import {Link} from 'umi';
import {Button, Result} from 'antd';
import React from 'react';
import {formatMessage} from "@@/plugin-locale/localeExports";

export default () => (
  <div>
    <Result
      status="500"
      title="500"
      subTitle={formatMessage({ id: 'exception500.description.500' })}
      extra={
        <Link to="/user/login">
          <Button type="primary">{formatMessage({ id: 'exception500.exception.back' })}</Button>
        </Link>
      }
    />
  </div>
);
