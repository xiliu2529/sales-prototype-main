import React, {Component, Dispatch } from "react";
import { notification, Typography, Space } from 'antd';
import {connect} from "umi";
import { WarningTwoTone, InfoCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons';
import {SystemMessageType} from "@/pages/user/login/components/SystemMessage/data";
import {formatMessage} from "@@/plugin-locale/localeExports";

const { Text, Link } = Typography;

interface SystemMessageProps {
  dispatch: Dispatch<any>;
  systemMessage: any;
}

class SystemMessage extends Component<SystemMessageProps> {

  /**
   * システム通知を表示する。
   * @param sysMsg
   */
  openNotification = (sysMsg : SystemMessageType, isEllipsis : boolean) => {
    notification.open({
      duration: null,
      key: sysMsg.msgCd,
      description: this.getDescription(sysMsg, isEllipsis),
      message: this.getTitle(sysMsg),
      // btn: this.getBtn(sysMsgList, idx),
      placement: 'topLeft',
      icon: this.getIcon(sysMsg.msgLevel),
      style: {width: '500px'},
      onClose: () => {this.onClose(sysMsg.msgCd)},
    });
  };

  /**
   * 閉じたシステム通知を覚える。
   * @param msgCd
   */
  onClose = (msgCd : string) => {
    let closed = this.props.systemMessage.login.closedMsg;
    if (closed === undefined) {
      closed = '';
    } else {
      closed = `${closed  },`;
    }
    closed = `${closed  }"sysMsg${  msgCd  }"`;
    this.props.systemMessage.login.closedMsg = closed;
    console.log('closed', this.props.systemMessage.login.closedMsg);
  }

  /**
   * システム通知レベルによって、アイコンを設定する。
   * @param msgLevel
   */
  getIcon = (msgLevel : string) => {
    // 1:普通 2:警告 3:重大
    switch (msgLevel) {
      case '1' :
        return(<InfoCircleTwoTone twoToneColor='#52C41A' />);
        break;
      case '2' :
        return(<WarningTwoTone twoToneColor='orange' />);
        break;
      case '3' :
        return(<CloseCircleTwoTone twoToneColor='red' />);
        break;
      default :
        return(<InfoCircleTwoTone twoToneColor='#52C41A' />);
    }
  };

  /**
   * システム通知レベルによって、タイトルのタイプを設定する。
   * @param sysMsg
   */
  getTitle = (sysMsg : SystemMessageType) => {
    // 1:普通 2:警告 3:重大
    switch (sysMsg.msgLevel) {
      case '1' :
        return(<Text type='success'>{sysMsg.msgTitle}</Text>);
        break;
      case '2' :
        return(<Text type='warning'>{sysMsg.msgTitle}</Text>);
        break;
      case '3' :
        return(<Text type='danger'>{sysMsg.msgTitle}</Text>);
        break;
      default :
        return(<Text type='success'>{sysMsg.msgTitle}</Text>);
    }
  };

  /**
   * システム通知の詳細内容を表示する。
   * @param sysMsg
   * @param isEllipsis true:展開リンクを表示（省略状態）、false:省略リンクを表示（展開状態）
   */
  getDescription = (sysMsg : SystemMessageType, isEllipsis : boolean) =>  {
    const contArr : string[] = sysMsg.msgCont.split('\r\n');
    const end : number = (isEllipsis && contArr.length > 3) ? 2 : contArr.length;
    const items : any[] = [];
    // eslint-disable-next-line no-plusplus
    for (let i : number = 0; i < end; i++) {
      items.push(<Text>{contArr[i]}</Text>)
    }
    if (isEllipsis) {
      if (contArr.length > 3) {
        items.push(<Link onClick={() => {this.openNotification(sysMsg, false)}}>... {formatMessage({id: 'login.notice.more'})}</Link>)
      }
    } else {
      items.push(<Link onClick={() => {this.openNotification(sysMsg, true)}}>{formatMessage({id: 'login.notice.ellipsis'})}</Link>)
    }
    return (
      <Space direction = 'vertical' size={0}>
        {items}
      </Space>
    );
  };

  /**
   * システム通知を取得する。
   * @constructor
   */
  UNSAFE_componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'login/getSysMessage',
    });
  };

  /**
   * 閉じれたシステム通知かどうか、判断する。
   * @param msgCd
   */
  isClosed = (msgCd : string) : boolean => {
    let ret : boolean = true;
    const closed : string = this.props.systemMessage.login.closedMsg;
    if (closed === undefined || closed === null) {
      ret = false;
    } else {
      const key: string = `"sysMsg${  msgCd  }"`;
      if (closed.indexOf(key) === -1) {
        ret = false;
      }
    }
    return ret;
  }

  /**
   * 画面の閉じるとき、システム通知を閉じる。
   */
  componentWillUnmount() {
    notification.destroy();
  }

  render() {
    console.log('props', this.props);
    const sysMgsList : SystemMessageType[] = this.props.systemMessage.login.msgList;
    if (sysMgsList !== undefined && sysMgsList.length > 0) {
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < sysMgsList.length; i++) {
        const sysMsg : SystemMessageType = sysMgsList[i];
        if (!this.isClosed(sysMsg.msgCd)) {
          this.openNotification(sysMsg, true);
        }
      }
    }
    return ("");
  }
}

export default connect((systemMessage) => ({
  systemMessage,
}))(SystemMessage);
