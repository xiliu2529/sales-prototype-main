// @ts-nocheck
import React from 'react';
import { Menu, Dropdown } from 'antd';
import { ClickParam } from 'antd/es/menu';
import { DropDownProps } from 'antd/es/dropdown';

import { ConnectState } from '@/models/connect';
import { connect , ApplyPluginsType } from 'umi';


import {HomeRankOrderModel} from "@/pages/HomePage/data";
import {SelectMenuItem} from "@/models/global";
import {MoneyModal} from "@/models/sendmessage";
import {AlignLeftOutlined} from "@ant-design/icons/lib";
import { plugin } from '../../.umi/core/plugin';
import MoneybigLogo from '../../assets/moneybig.png';

interface HeaderDropdownProps extends DropDownProps {
  overlayClassName?: string;
  placement?: 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topCenter' | 'topRight' | 'bottomCenter';
}

const useLocalStorage = true;
const HeaderDropdown: React.FC<HeaderDropdownProps> = ({ overlayClassName: cls, ...restProps }) => (
  <Dropdown overlayClassName={cls} {...restProps} />
);

interface LocalData {
  lang: string;
  label?: string;
  icon?: string;
  title?: string;
}

interface SelectMoneyProps {
  globalIconClassName?: string;
  postLocalesData?: (locales: LocalData[]) => LocalData[];
  onItemClick?: (params: ClickParam) => void;
  className?: string;
  dspCurrCd?: string;
  currencyLst:[];
}


const transformArrayToObject = (allMoneyUIConfig: LocalData[]) => {
  return allMoneyUIConfig.reduce((obj, item) => {
    if (!item.lang) {
      return obj;
    }
    return {
      ...obj,
      [item.lang]: item,
    };
  }, {});
};



export const SelectMoney: React.FC<SelectMoneyProps> = (props) => {
  const { globalIconClassName, postLocalesData, onItemClick, style, dspCurrCd,currencyLst, ...restProps } = props;
   if(currencyLst === undefined){
     return null;
   }

  const map = new Map();
  const mapLocal = new Map();
  currencyLst.forEach((item:any)=>{
  const moneyInner: moneyInnerModal = {
    lang:item.cdVal,
    label:item.cdVal,
    icon:item.cdVal,
    title:item.cdVal,
  };
    const localeInfoModal: localeInfoModal = {
      locale: item.cdVal,
      momentLocale: item.cdVal,
    };
    if(item.cdExchVal !=="1" ){
      moneyInner.icon =`${item.cdExchVal}${item.cdVal}`;
    }
    map.set(item.cdVal,moneyInner)
    mapLocal.set(item.cdVal,localeInfoModal)
  }
)
  const obj= Object.create(null);
  // eslint-disable-next-line no-restricted-syntax
  for (const[k,v] of map) {
    obj[k] = v;
  }

  const objLocal= Object.create(null);
  // eslint-disable-next-line no-restricted-syntax
  for (const[k,v] of mapLocal) {
    objLocal[k] = v;
  }
  let defaultMoneyUConfigMap;
  // eslint-disable-next-line prefer-const
  defaultMoneyUConfigMap =obj;

  let localeInfo;
  // eslint-disable-next-line prefer-const
  localeInfo =objLocal;

 // const defaultMoneyUConfigMap = JSON.stringify(caseParam);
  /* const defaultMoneyUConfigMap = {
/!*    USD: {
      lang: currencyLst,
      label: 'USD',
      icon: 'USD',
      title: 'USD',
    },
    EUR: {
      lang: 'EUR',
      label: 'EUR',
      icon: 'EUR',
      title: 'EUR',
    },
    JPY: {
      lang: 'JPY',
      label: 'JPY',
      icon: '1000 JPY',
      title: 'JPY',
    },
    CNY: {
      lang: 'CNY',
      label: 'CNY',
      icon: '1000 CNY',
      title: 'CNY',
    }, *!/
  }; */

  /**
   * 获取当前选择的货币
   * @returns string
   */
  const getLocale = () => {
    const runtimeLocale = plugin.applyPlugins({
      key: 'locale',
      type: ApplyPluginsType.modify,
      initialValue: {},
    });
    // runtime getLocale for user define
    if (typeof runtimeLocale?.getLocale === 'function') {
      return runtimeLocale.getLocale();
    }

    // please clear localStorage if you change the baseSeparator config
    // because changing will break the app
    let lang ="";
    if (typeof localStorage !== 'undefined' && useLocalStorage){
      lang = window.localStorage.getItem('umi_locale_money');
    } else{
      lang = "JPY";
    }
    return lang;
  };

  /**
   * 切换货币
   * @param lang 货币的 key
   * @param realReload 是否刷新页面，默认刷新
   * @returns string
   */
  const setLocale = (lang: string, realReload: boolean = true) => {
    const localeExp = new RegExp(`^[A-Z]`);

    const runtimeLocale = plugin.applyPlugins({
      key: 'locale',
      type: ApplyPluginsType.modify,
      initialValue: {},
    });
    if (typeof runtimeLocale?.setLocale === 'function') {
      runtimeLocale.setLocale({
        lang,
        realReload,
        updater: (updateLang = lang) => event.emit(LANG_CHANGE_EVENT, updateLang),
      });
      return;
    }
    if (lang !== undefined && !localeExp.test(lang)) {
      // for reset when lang === undefined
      throw new Error('setLocale lang format error');
    }
    if (getLocale() !== lang) {
      if (typeof window.localStorage !== 'undefined' && useLocalStorage) {
        window.localStorage.setItem('umi_locale_money', lang || '');
      }
      if (realReload) {
        window.location.reload();
      } else {
        event.emit(LANG_CHANGE_EVENT, lang);
        // chrome 不支持这个事件。所以人肉触发一下
        if (window.dispatchEvent) {
          const event = new Event('languagechange');
          window.dispatchEvent(event);
        }
      }
    }
  };

  /* const localeInfo: { [key: string]: any } = {
    USD: {
      locale: 'USD',
      momentLocale: 'USD',
    },
  /!*  EUR: {
      locale: 'EUR',
      momentLocale: 'EUR',
    }, *!/
    JPY: {
      locale: 'JPY',
      momentLocale: 'JPY',
    },
    CNY: {
      locale: 'CNY',
      momentLocale: 'CNY',
    },
  }; */
  const getAllLocales = () => Object.keys(localeInfo);

  const selectedMoney = getLocale();

  const changeMoney = ({ key }: ClickParam): void => setLocale(key);
  const defaultMoneyUConfig = getAllLocales().map(
    (key) =>
      defaultMoneyUConfigMap[key] || {
        lang: 'JPY',
        label: 'JPY',
        icon: 'JPY',
        title: 'JPY',
      },
  );

  const allMoneyUIConfig = transformArrayToObject(
    postLocalesData ? postLocalesData(defaultMoneyUConfig) : defaultMoneyUConfig,
  );

  const handleClick = onItemClick ? (params: ClickParam) => onItemClick(params) : changeMoney;

  const menuItemStyle = { minWidth: '160px' };
  const MoneyMenu = (
      <Menu selectedKeys={[selectedMoney]} onClick={handleClick}>
        {currencyLst.map((item:any) => (
        <Menu.Item key={item.cdVal} style={menuItemStyle}>
          {allMoneyUIConfig[item.cdVal]?.label || 'JPY'}
        </Menu.Item>
        ))}
      </Menu>
    );


  const inlineStyle = {
    cursor: 'pointer',
    padding: '12px',
    paddingBottom: '0px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 17,
    verticalAlign: 'middle',
    ...style,
  };

  const inlineStyleColor1 = {
    color: '#0000FF',
    ...style,
  };
  const inlineStyleColor2 = {
    color: '#000000',
    ...style,
  };
  return (
    <HeaderDropdown overlay={MoneyMenu} placement="bottomRight" {...restProps}>
      <span className={globalIconClassName} style={inlineStyle}>
        <i className="anticon" title={allMoneyUIConfig[selectedMoney]?.title}
        style={
          allMoneyUIConfig[selectedMoney]?.title === 'JPY' ||
          allMoneyUIConfig[selectedMoney]?.title === 'CNY'?
          inlineStyleColor1 : inlineStyleColor2 }
          >
          <img alt="MoneybigLogo" className={globalIconClassName} src={MoneybigLogo} />
          <span style={{verticalAlign:"bottom"}}>{allMoneyUIConfig[selectedMoney]?.icon }</span>
        </i>
      </span>
    </HeaderDropdown>
  );
  return <></>;
};

export default connect(({ global, user }: ConnectState) => ({
  dspCurrCd: user.dspCurrCd,
}))(SelectMoney);

