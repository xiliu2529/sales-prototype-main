import { Link } from 'umi';
import { Result, Button } from 'antd';
import React from 'react';
import {formatMessage} from "@@/plugin-locale/localeExports";

export default () => (
  <div>

    <Result
      status="403"
      title="403"
      subTitle={formatMessage({ id: 'exception403.description.403' })}
      extra={
        <Link to="/user/login">
          <Button type="primary">{formatMessage({ id: 'exception500.exception.back' })}</Button>
        </Link>
      }
    />
  </div>
);
