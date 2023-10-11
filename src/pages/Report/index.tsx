import React, { Component } from 'react';
import { FormattedMessage, Dispatch } from 'umi';
import { GridContent } from '@ant-design/pro-layout';
import { Menu } from 'antd';
import Report from "./components/Report"
import styles from './style.less';
import {formatMessage} from "@@/plugin-locale/localeExports";

const { Item } = Menu;

interface ReportProps {
  dispatch: Dispatch;
}

type ReportStateKeys = 'Report' | 'Edit' ;

interface ReportState {
  mode: 'inline' | 'horizontal';
  menuMap: {
    [key: string]: React.ReactNode;
  };
  selectKey: ReportStateKeys;
}

class Index extends Component<ReportProps, ReportState> {
  main: HTMLDivElement | undefined = undefined;

  constructor(props: ReportProps) {
    super(props);
    const menuMap = {
      Report: <FormattedMessage id="Report" defaultMessage={formatMessage({ id: 'report.leftMenu.Report' })} />,
      // Edit: (<FormattedMessage id="Edit" defaultMessage={formatMessage({ id: 'report.leftMenu.Edit' })} />)
    };
    this.state = {
      mode: 'inline',
      menuMap,
      selectKey: 'Report',
    };
  }



  componentDidMount() {

    window.addEventListener('resize', this.resize);
    this.resize();

  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  getMenu = () => {
    const { menuMap } = this.state;
    return Object.keys(menuMap).map((item) => <Item key={item}>{menuMap[item]}</Item>);
  };

  getRightTitle = () => {
    const { selectKey, menuMap } = this.state;
    return menuMap[selectKey];
  };

  selectKey = (key: ReportStateKeys) => {
    this.setState({
      selectKey: key,
    });
  };

  resize = () => {
    if (!this.main) {
      return;
    }
    requestAnimationFrame(() => {
      if (!this.main) {
        return;
      }
      let mode: 'inline' | 'horizontal' = 'inline';
      const { offsetWidth } = this.main;
      if (this.main.offsetWidth < 641 && offsetWidth > 400) {
        mode = 'horizontal';
      }
      if (window.innerWidth < 768 && offsetWidth > 400) {
        mode = 'horizontal';
      }
      this.setState({
        mode,
      });
    });
  };

  renderChildren = () => {
    const { selectKey } = this.state;
    switch (selectKey) {
      case 'Report':
        return <Report/>;
      case 'Edit':
        return <div />;

      default:
        break;
    }

    return null;
  };

  render() {

    const { mode, selectKey } = this.state;
    return (
      <GridContent>
        <div
          className={styles.main}
          ref={(ref) => {
            if (ref) {
              this.main = ref;
            }
          }}
        >
          <div className={styles.right}>
            {this.renderChildren()}
          </div>
        </div>
      </GridContent>
    );
  }
}

export default Index;
