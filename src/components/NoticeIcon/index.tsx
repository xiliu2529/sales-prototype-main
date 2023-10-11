import { BellOutlined } from '@ant-design/icons';
import { Badge, Spin, Tabs } from 'antd';
import useMergeValue from 'use-merge-value';
import React from 'react';
import classNames from 'classnames';
import NoticeList, { NoticeIconTabProps } from './NoticeList';
import PersonLogo from '../../assets/person.png';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import { connect } from 'umi';
import { ConnectState } from '@/models/connect';
import {SendMessageModel} from "@/components/SendMessageInfo/data";

const { TabPane } = Tabs;

export interface NoticeIconData {
  avatar?: string | React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  datetime?: React.ReactNode;
  extra?: React.ReactNode;
  style?: React.CSSProperties;
  key?: string | number;
  read?: boolean;
  form:string;
  caseNm:string;
  customerNm:string,
  to:string,
}

export interface NoticeIconProps {
  count?: number;
  bell?: React.ReactNode;
  className?: string;
  loading?: boolean;
  onClear?: (tabName: string, tabKey: string) => void;
  onViewMore?: (tabProps: NoticeIconTabProps, e: MouseEvent) => void;
  onTabChange?: (tabTile: string) => void;
  style?: React.CSSProperties;
  onPopupVisibleChange?: (visible: boolean) => void;
  popupVisible?: boolean;
  clearClose?: boolean;
  emptyImage?: string;
  children: React.ReactElement<NoticeIconTabProps>[];
  currentUser:[];
}

const NoticeIcon: React.FC<NoticeIconProps> & {
  Tab: typeof NoticeList;
} = (props) => {
  const getNotificationBox = (): React.ReactNode => {
    const {
      children,
      loading,
      onClear,
      onTabChange,
      onItemClick,
      onViewMore,
      clearText,
      viewMoreText,
      currentUser,
    } = props;
    if (!children) {
      return null;
    }
    const panes: React.ReactNode[] = [];
    React.Children.forEach(children, (child: React.ReactElement<NoticeIconTabProps>): void => {
      if (!child) {
        return;
      }
      const { list, title, count, tabKey, showClear, showViewMore } = child.props;
      const len = list && list.length ? list.length : 0;
      const msgCount = count || count === 0 ? count : len;
      const tabTitle: string = msgCount > 0 ? `${title} (${msgCount})` : title;
      panes.push(
        <TabPane tab={tabTitle} key={tabKey}>
          <NoticeList
            {...child.props}
            clearText={clearText}
            viewMoreText={viewMoreText}
            data={list}
            onClear={(): void => onClear && onClear(title, tabKey)}
            onClick={(item): void => onItemClick && onItemClick(item, child.props)}
            onViewMore={(send): void => onViewMore && onViewMore(child.props, send)}
            showClear={showClear}
            showViewMore={showViewMore}
            title={title}
          />
        </TabPane>,
      );
    });
    return (
      <Spin spinning={true} delay={300}>
        <Tabs className={styles.tabs} onChange={() => {onMenuClick()}}>
          {panes}
        </Tabs>
      </Spin>
    );
  };

  const { className, count, bell ,
    currentUser = {
      avatar: '',
      name: '',
    },
  } = props;

  const [visible, setVisible] = useMergeValue<boolean>(false, {
    value: props.popupVisible,
    onChange: props.onPopupVisibleChange,
  });
  const noticeButtonClass = classNames(className, styles.noticeButton);
  const notificationBox = getNotificationBox();
  const NoticeBellIcon = bell || <BellOutlined className={styles.icon} />;

  const inlineStyleColor2 = {
    color: '#000000'
  };
  const onMenuClick = (): void => {
    const { dispatch ,currentUser} = props;
    // @ts-ignore
    let loginUserCd=currentUser?.userid;
    let to="";
    let toName="";
    let customerName="";
    let caseNm="";
    let message="";
    let msgId="";
    let email="";
    let orgGroupId="";


    const caseParam: SendMessageModel = {to,toName,customerName,caseNm,loginUserCd,msgId,message,email,orgGroupId};
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const sendMessageModel = JSON.stringify(caseParam);
   /*   //需要定时执行的方法
      const sendMessageModel=this.params("");*/
      if (dispatch) {
        dispatch({
          type: 'global/fetchNotices',
          payload: {
            sendMessageModel,
          },
        });
      }
    return;
  };

  const trigger = (
    <span className={classNames(noticeButtonClass, { opened: visible })} style={inlineStyleColor2}
          onClick={() => {
            onMenuClick();
          }}
    >

      <span style={{verticalAlign:"text-bottom",paddingTop:'20px',paddingRight:'2px'}}>{currentUser.name} </span>
      <Badge count={count} style={{ boxShadow: 'none' }} className={styles.badge}>
         <img alt="PersonLogo" className={styles.logo} src={PersonLogo} />
      </Badge>
    </span>
  );
  if (!notificationBox) {
    return trigger;
  }

  return (
    <HeaderDropdown
      placement="bottomRight"
      overlay={notificationBox}
      overlayClassName={styles.popover}
      trigger={['click']}
      visible={visible}
      onVisibleChange={setVisible}
    >
      {trigger}
    </HeaderDropdown>
  );
};

NoticeIcon.defaultProps = {
  emptyImage: '../../assets/moneybig.png',
};
NoticeIcon.Tab = NoticeList;

export default connect(({ user,global }: ConnectState) => ({
  currentUser: user.currentUser,
  notices: global.notices,
}))(NoticeIcon);
