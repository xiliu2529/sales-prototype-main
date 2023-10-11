
import React, { Component } from 'react';
import { connect, ConnectProps, FormattedMessage } from 'umi';
import { ConnectState } from '@/models/connect';
import styles from './index.less';
import { Switch } from 'antd';

export interface GlobalHeaderLeftProps extends Partial<ConnectProps> {
  selectCollapsed: boolean;
  oncust: boolean;
}

class GlobalHeaderLeft extends Component<GlobalHeaderLeftProps> {
  /**                                                             
   * lzt
   * @param payload 
   */
  //切り替え
  changeReadStateCustom = (payload: boolean): void => {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'global/changeSelectStatus',
        payload,
      });
    }
  };

  changeReadStateOrganization = (payload: boolean): void => {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'global/changeSelectCollapseOrg',
        payload,
      });
    }
  };



  render() {
    const { selectCollapsed, oncust } = this.props;
    return (
      <div className={styles.container}>
        <div className={styles.center} >
          <Switch className={styles.switch} onChange={() => this.changeReadStateCustom(!oncust)}
            checkedChildren={<FormattedMessage id="component.leftContent.subtitle1" defaultMessage="Organization" />}
            unCheckedChildren={<FormattedMessage id="component.leftContent.subtitle2" defaultMessage="Customer" />} defaultChecked={true} />
        </div>
        <div className={styles.left}
          onClick={() => {
            this.changeReadStateOrganization(!selectCollapsed);
          }}
        ><u><FormattedMessage id="component.leftContent.title" defaultMessage="Classification" /></u>
        </div>
      </div>
    )
  }
}


export default connect(({ global, settings }: ConnectState) => ({
  selectCollapsed: global.selectCollapsed,
  oncust: global.oncust,
}))(GlobalHeaderLeft);
