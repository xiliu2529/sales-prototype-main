// @ts-nocheck
import React from 'react';
import { Menu, Dropdown } from 'antd';
import { ClickParam } from 'antd/es/menu';
import { connect, ConnectProps, FormattedMessage} from 'umi';
import { DropDownProps } from 'antd/es/dropdown';
import { getLocale, getAllLocales, setLocale } from '../../.umi/plugin-locale/localeExports';
import LanguageLogo from '../../assets/language.png';
export interface HeaderDropdownProps extends DropDownProps {
  overlayClassName?: string;
  placement?: 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topCenter' | 'topRight' | 'bottomCenter';
}

const HeaderDropdown: React.FC<HeaderDropdownProps> = ({ overlayClassName: cls, ...restProps }) => (
  <Dropdown overlayClassName={cls} {...restProps} />
);

interface SelectLeftMenuProps {
    globalIconClassName?: string;
    postLocalesData?: (locales: LocalData[]) => LocalData[];
    onItemClick?: (params: ClickParam) => void;
    className?: string;
  }
  
export const SelectLeftMenu: React.FC<SelectLeftMenuProps> = (props) => {
  const { globalIconClassName, postLocalesData, onItemClick, style, ...restProps } = props;


//   const changeLang = ({ key }: ClickParam): void => setLocale(key);
   const changeReadState = (payload: boolean): void => {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        // add Org
        type: 'global/changeSelectCollapseOrg',     // sales 的树状图
        payload
      });
    }
  };

  const handleClick = (params: ClickParam) => {
    if (onItemClick) {
      onItemClick(params);
    } else {
      changeReadState();
    }
  };

  const menuItemStyle = { minWidth: '160px' };
  const langMenu = (
    <Menu onClick={handleClick}>
      <Menu.Item key="subTitle1" style={menuItemStyle}>
  <FormattedMessage id="component.leftContent.subTitle1" defaultMessage="Sales" />
</Menu.Item>
<Menu.Item key="subTitle2" style={menuItemStyle}>
  <FormattedMessage id="component.leftContent.subTitle2" defaultMessage="Sales" />
</Menu.Item>
    </Menu>
  );

  const inlineStyle = {
    cursor: 'pointer',
    padding: '12px',
    paddingBottom: '0px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 24,
    verticalAlign: 'middle',
    ...style,
  };
  return (
    <HeaderDropdown overlay={langMenu} placement="topLeft" {...restProps}>
      <span className={globalIconClassName} style={inlineStyle}>
        <i className="anticon" >
          <span style={{verticalAlign:"text-bottom"}}></span>
        </i>
      </span>
    </HeaderDropdown>
  );
  return <></>;
};
