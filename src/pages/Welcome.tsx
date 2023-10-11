import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Alert, Typography } from 'antd';
import styles from './Welcome.less';
import DBTable from '@/components/DBTable';

const CodePreview: React.FC<{}> = ({ children }) => (
  <pre className={styles.pre}>
    <code>
      <Typography.Text copyable>{children}</Typography.Text>
    </code>
  </pre>
);

export default (): React.ReactNode => (
  <PageContainer>
    <Card>
      <DBTable tableName ="testAction"></DBTable>      
    </Card>     
    <Card>
      <DBTable tableName ="test"></DBTable>      
    </Card>
  </PageContainer>
);
