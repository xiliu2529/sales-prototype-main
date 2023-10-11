import React, { Component } from 'react';
import { connect, ConnectProps } from 'umi';
import { Tag, message } from 'antd';
import groupBy from 'lodash/groupBy';
import { NoticeItem } from '@/models/global';
import { CurrentUser } from '@/models/user';
import { ConnectState } from '@/models/connect';
import NoticeIcon from '../NoticeIcon';
import styles from './index.less';
import  './index.less';
import {formatMessage} from "@@/plugin-locale/localeExports";
import {SendMessageModel} from "@/components/SendMessageInfo/data";
import "@/utils/messageConfig";

export interface GlobalHeaderRightProps extends Partial<ConnectProps> {
  notices?: NoticeItem[];
  currentUser?: CurrentUser;
  fetchingNotices?: boolean;
  onNoticeVisibleChange?: (visible: boolean) => void;
  onNoticeClear?: (tabName?: string) => void;
  sendMessageModel:[];
}

interface GlobalHeaderRightStates {
  notices?: NoticeItem[];
}

class GlobalHeaderRight extends Component<GlobalHeaderRightProps> {
  constructor(props: Readonly<GlobalHeaderRightProps>) {
    super(props);
    this.state = {
      timer:null,
    }
  }

  componentDidMount() {
    const { dispatch } = this.props;
    this.state.timer=setInterval(()=>{
      //需要定时执行的方法
      const sendMessageModel=this.params("");
      if (dispatch) {
        dispatch({
          type: 'global/fetchNotices',
          payload: {
            sendMessageModel,
          },
        });
      }
   }, 60000)

    const sendMessageModel=this.params("");


    if (dispatch) {
      dispatch({
        type: 'global/fetchNotices',
        payload: {
          sendMessageModel,
        },
      });
    }
  }

  componentWillUnmount(){
    // 定时器进行销毁
    if(this.state.timer!= null) {
      clearInterval(this.state.timer);
    }
  }


  params=(key:any)=> {
    // @ts-ignore
    const {currentUser}= this.props;
    // @ts-ignore
    let loginUserCd=  localStorage.getItem('useCd') // currentUser?.userid;
    let to="";
    let toName="";
    let customerName="";
    let caseNm="";
    let message="";
    let msgId;
    let email="";
    let orgGroupId="";
    if(key!==''){
       msgId =key;
    }else {
      msgId="";
    }
    const caseParam: SendMessageModel = {to,toName,customerName,caseNm,loginUserCd,msgId,message,email,orgGroupId};
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const sendMessageModel = JSON.stringify(caseParam);
    return sendMessageModel;
  }




  changeReadState = (clickedItem: NoticeItem): void => {
    const { id } = clickedItem;
    const { dispatch } = this.props;

    if (dispatch) {
      dispatch({
        type: 'global/changeNoticeReadState',
        payload: id,
      });
    }
  };

  handleNoticeClear = (title: string, key: string) => {
    const { dispatch } = this.props;
    message.success(`${'清空了'} ${title}`);

    if (dispatch) {
      dispatch({
        type: 'global/clearNotices',
        payload: key,
      });
    }
  };

  getNoticeData = (): {
    [key: string]: NoticeItem[];
  } => {
    const { notices = [] } = this.props;

    if (!notices || notices.length === 0 || !Array.isArray(notices)) {
      return {};
    }

    const newNotices = notices.map((notice) => {
      const newNotice = { ...notice };

      if (newNotice.datetime) {
        newNotice.datetime = notice.datetime;
      }

      if (newNotice.id) {
        newNotice.key = newNotice.id;
      }

      if (newNotice.extra && newNotice.status) {
        const color = {
          todo: '',
          processing: 'blue',
          urgent: 'red',
          doing: 'gold',
        }[newNotice.status];
        newNotice.extra = (
          <Tag
            color={color}
            style={{
              marginRight: 0,
            }}
          >
            {newNotice.extra}
          </Tag>
        );
      }

      return newNotice;
    });
    return groupBy(newNotices, 'type');
  };

  getUnreadData = (noticeData: { [key: string]: NoticeItem[] }) => {
    const unreadMsg: {
      [key: string]: number;
    } = {};
    Object.keys(noticeData).forEach((key) => {
      const value = noticeData[key];

      if (!unreadMsg[key]) {
        unreadMsg[key] = 0;
      }

      if (Array.isArray(value)) {
        unreadMsg[key] = value.filter((item) => !item.read).length;
      }
    });
    return unreadMsg;
  };

  render() {
    const { currentUser, fetchingNotices, onNoticeVisibleChange } = this.props;
    const noticeData = this.getNoticeData();
    let newMsg:number =0;
    let inbox:number =0;
    let send:number =0;
    if(Object.keys(noticeData).length > 0){
      if(null !==noticeData.notification && undefined !== noticeData.notification && noticeData.notification !== []){
      newMsg =noticeData.notification.length;
      }
      if(null !==noticeData.message && undefined !== noticeData.message  && noticeData.message !== []) {
        inbox = noticeData.message.length;
      }
      if(null !==noticeData.send && undefined !== noticeData.send && noticeData.send !== []) {
        send = noticeData.send.length;
      }
    }
    const unreadMsg = this.getUnreadData(noticeData); //每个标签里面的未读件数 没用到
    const noSendMsg = unreadMsg["notification"];
    return (
      <div className={styles.noticeIconView}>
      <NoticeIcon
        className={styles.action}
        count={currentUser && noSendMsg}   //未讀消息個數
        loading={fetchingNotices}
        onPopupVisibleChange={onNoticeVisibleChange}
        onViewMore={() => message.info('Click on view more')}
        clearClose
      >
        <NoticeIcon.Tab
          tabKey="notification"
          count={newMsg}
          list={noticeData.notification}
          title={formatMessage({id: 'component.messagebox.newMessage'})}
          emptyText={formatMessage({id: 'component.messagebox.unreadMessage'})}
          showViewMore
        />
        <NoticeIcon.Tab
          tabKey="message"
          count={inbox}
          list={noticeData.message}
          title={formatMessage({id: 'component.messagebox.inbox'})}
          emptyText={formatMessage({id: 'component.messagebox.inboxEmpty'})}
          showViewMore
        />
        <NoticeIcon.Tab
          tabKey="send"
          title={formatMessage({id: 'component.messagebox.sent'})}
          emptyText={formatMessage({id: 'component.messagebox.noSend'})}
          count={send}
          list={noticeData.send}
          showViewMore
        />
      </NoticeIcon>
      </div>
    );
  }
}

export default  connect(({ user, global, loading }: ConnectState) => ({
  currentUser: user.currentUser,
  collapsed: global.collapsed,
  fetchingMoreNotices: loading.effects['global/fetchMoreNotices'],
  // fetchingNotices: loading.effects['global/fetchNotices'],
  notices: global.notices,
}))(GlobalHeaderRight);
