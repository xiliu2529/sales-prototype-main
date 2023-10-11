import {Avatar, Form, List, Row, Popconfirm, Tooltip, Col, ConfigProvider} from 'antd';
import { Card } from 'antd';
import React, {useContext} from 'react';
import classNames from 'classnames';
import { NoticeIconData } from './index';
import styles from './NoticeList.less';
import {formatMessage} from "@@/plugin-locale/localeExports";
import message from "@/assets/message.png";
import deleteImg from "@/assets/delete.png";
import InfiniteScroll from 'react-infinite-scroller';
import {SendMessageModel} from "@/components/SendMessageInfo/data";
import {connect, Dispatch} from 'umi';
import {ConnectState} from "@/models/connect";
import {DeleteOutlined, QuestionCircleOutlined} from "@ant-design/icons/lib";

export interface NoticeIconTabProps {
  count?: number;
  name?: string;
  showClear?: boolean;
  showViewMore?: boolean;
  style?: React.CSSProperties;
  title: string;
  tabKey: string;
  data?: NoticeIconData[];
  onClick?: (item: NoticeIconData) => void;
  onClear?: () => void;
  emptyText?: string;
  clearText?: string;
  viewMoreText?: string;
  list: NoticeIconData[];
  onViewMore?: (e: any) => void;
  sendMessageModel:[];
  dispatch:any;
  currentUser:[];
  prefixCls?: string;
}
const NoticeList: React.SFC<NoticeIconTabProps> = ({
  data = [],
  onClick,
  onClear,
  title,
  onViewMore,
  emptyText,
  showClear = true,
  clearText,
  viewMoreText,
  showViewMore = false,
  dispatch,
  currentUser,
}) => {

  const read = async(key: any) =>{
    // @ts-ignore
    //const { dispatch } = this.props;
    let sendMessageModel: string;
     sendMessageModel=params(key);
    if (dispatch) {
      await dispatch({
        type: 'global/fetchRead',
        payload: {
          sendMessageModel,
        },
      });

    sendMessageModel=params("");

      await dispatch({
        type: 'global/fetchNotices',
        payload: {
          sendMessageModel,
        },
      });
    }
  }

  const params=(key:any)=> {
    // @ts-ignore
    //const {currentUser}= this.props;
    // @ts-ignore
    let loginUserCd=currentUser?.userid;
    let to="";
    let toName="";
    let customerName="";
    let caseNm="";
    let message="";
    let email="";
    let msgId;
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


  const deleteMessage= async(key: any)=>{
    // @ts-ignore
   // const { dispatch } = this.props;
    let sendMessageModel: string;
    sendMessageModel=params(key);
    if (dispatch) {
      await dispatch({
        type: 'global/deleteMessageBox',
        payload: {
          sendMessageModel,
        },
      });

    sendMessageModel=params("");

      await dispatch({
        type: 'global/fetchNotices',
        payload: {
          sendMessageModel,
        },
      });
    }
  }


  const deleteMessageSend = async(key: any)=>{
    // @ts-ignore
   // const { dispatch } = this.props;
    let sendMessageModel: string;
    sendMessageModel=params(key);
    if (dispatch) {
      await dispatch({
        type: 'global/deleteSendMessageBox',
        payload: {
          sendMessageModel,
        },
      });

    sendMessageModel=params("");
      await dispatch({
        type: 'global/fetchNotices',
        payload: {
          sendMessageModel,
        },
      });
    }
  }

  const [visible, setVisible] = React.useState(false);

  const showPopconfirm = () => {
    setVisible(true);
  };


  const handleCancel = () => {
    setVisible(false);
  };


  if (!data || data.length === 0) {
    return (
      <div className={styles.notFound}>
        <img
          src="https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg"
          alt="not found"
        />
        <div>{emptyText}</div>
      </div>
    );
  }
  return (


    <div style= {{width:'100%',height:430,overflowY:"auto",backgroundColor: "#F2F2F2"}}>
      <List<NoticeIconData>
        className={styles.list}
        dataSource={data}
        renderItem={(item, i) => {
          const itemCls = classNames(styles.item, {
            [styles.read]: item.read,
          });
          // eslint-disable-next-line no-nested-ternary
          // @ts-ignore
          const rightIcon = item.type === 'notification'? (
            <span style={{marginLeft: '0px'}}><img src={message} alt="not found" onClick={() => read(item.key)}/></span>
            ) : (
            ( item.type === 'send'?
                /*<span style={{marginLeft: '20px'}}> <Popconfirm title="Are you sure？"  visible={visible} onCancel={handleCancel} onConfirm={() => deleteMessageSend(item.key)} icon={<QuestionCircleOutlined style={{ color: 'red' }} />}>
                 <img src={deleteImg} alt="not found" onClick={showPopconfirm} />
                  </Popconfirm>,</span>*/

              <Popconfirm title={formatMessage({ id: 'actualityForecastBottom.message.delete' })}
                          onConfirm={() => deleteMessageSend(item.key)}
              >
                <DeleteOutlined />
              </Popconfirm>
                :
              <Popconfirm title={formatMessage({ id: 'actualityForecastBottom.message.delete' })}
                          onConfirm={() => deleteMessage(item.key)}
              >
                <DeleteOutlined />
              </Popconfirm>
/*
                <span style={{marginLeft: '20px'}}><img src={deleteImg} alt="not found" onClick={() => deleteMessage(item.key)} /></span>
*/
            )
          );

          const titleBold = classNames(styles.titleBold, {
            [styles.bold]: item.read,
          });

          // eslint-disable-next-line no-nested-ternary
          // @ts-ignore
          const formOrTo = item.type === 'send'? (
            <span  className={titleBold} >{formatMessage({id: 'component.sendMessage.to'})}:{item.userNm}</span>
          ) : (
            <span  className={titleBold} >{formatMessage({id: 'component.messagebox.from'})}:{item.userNm}</span>
              );

        /*  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
          // @ts-ignore
          const prefixCls = this.props.prefixCls || getPrefixCls('ant'); */

          return (

            <List.Item
              className={itemCls}
              key={item.key || i}
              onClick={() => onClick && onClick(item)}
            >
              {/* className={`${prefixCls}-ant-card-bordered`} */}
              <Card style={{width:"100%"}} >
              <List.Item.Meta
                className={styles.meta}
                title={
                  <div className={styles.title}>
                    <Row>
                      <Col xl={22} lg={24} md={24} sm={24} xs={24}>
                      {formOrTo}
                      <span  className={titleBold}>{formatMessage({id: 'app.common.Customer'})}:{item.customerNm}</span>
                      <span  className={titleBold}>{formatMessage({id: 'app.common.Case'})}:{item.caseNm}</span>
                      </Col>
                      <Col xl={2} lg={24} md={24} sm={24} xs={24}>
                      {rightIcon}
                      </Col>
                    </Row>

                      <div style={{marginLeft: '5%' ,overflowY:"auto",width:'95%',height:"70px" ,wordBreak:"break-all",whiteSpace:"pre-line"}}>
                        <p>
                        {item.title}
                        </p>
                      </div>
                  </div>
                }
                description={
                  <div>
                    <div className={styles.datetime}>{item.datetime}</div>
                  </div>
                }
              />
              </Card>
            </List.Item>

          );
        }}
      />
    </div>
  );
};

export default connect(({ user, global, loading }: ConnectState) => ({
  currentUser: user.currentUser,
  //collapsed: global.collapsed,
  //fetchingMoreNotices: loading.effects['global/fetchMoreNotices'],
  // fetchingNotices: loading.effects['global/fetchNotices'],
  //notices: global.notices,
  global,
}))(NoticeList);
