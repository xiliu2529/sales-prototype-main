// @ts-nocheck
import React from 'react';
import { Menu, Dropdown } from 'antd';
import { ClickParam } from 'antd/es/menu';
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

interface LocalData {
  lang: string;
  label?: string;
  icon?: string;
  title?: string;
}

interface SelectLangProps {
  globalIconClassName?: string;
  postLocalesData?: (locales: LocalData[]) => LocalData[];
  onItemClick?: (params: ClickParam) => void;
  className?: string;
}

const transformArrayToObject = (allLangUIConfig: LocalData[]) => {
  return allLangUIConfig.reduce((obj, item) => {
    if (!item.lang) {
      return obj;
    }

    return {
      ...obj,
      [item.lang]: item,
    };
  }, {});
};

const defaultLangUConfigMap = {
  'ar-EG': {
    lang: 'ar-EG',
    label: 'العربية',
    icon: '🇪🇬',
    title: 'لغة',
  },
  'az-AZ': {
    lang: 'az-AZ',
    label: 'Azərbaycan dili',
    icon: '🇦🇿',
    title: 'Dil',
  },
  'bg-BG': {
    lang: 'bg-BG',
    label: 'Български език',
    icon: '🇧🇬',
    title: 'език',
  },
  'ca-ES': {
    lang: 'ca-ES',
    label: 'Catalá',
    icon: '🇨🇦',
    title: 'llengua',
  },
  'cs-CZ': {
    lang: 'cs-CZ',
    label: 'Čeština',
    icon: '🇨🇿',
    title: 'Jazyk',
  },
  'da-DK': {
    lang: 'da-DK',
    label: 'Dansk',
    icon: '🇩🇰',
    title: 'Sprog',
  },
  'de-DE': {
    lang: 'de-DE',
    label: 'Deutsch',
    icon: '🇩🇪',
    title: 'Sprache',
  },
  'el-GR': {
    lang: 'el-GR',
    label: 'Ελληνικά',
    icon: '🇬🇷',
    title: 'Γλώσσα',
  },
  'en-GB': {
    lang: 'en-GB',
    label: 'English',
    icon: '🇬🇧',
    title: 'Language',
  },
  'en-US': {
    lang: 'en-US',
    label: 'English',
    icon: '🇺🇸',
    title: 'Language',
  },
  'es-ES': {
    lang: 'es-ES',
    label: 'Español',
    icon: '🇪🇸',
    title: 'Idioma',
  },
  'et-EE': {
    lang: 'et-EE',
    label: 'Eesti',
    icon: '🇪🇪',
    title: 'Keel',
  },
  'fa-IR': {
    lang: 'fa-IR',
    label: 'فارسی',
    icon: '🇮🇷',
    title: 'زبان',
  },
  'fi-FI': {
    lang: 'fi-FI',
    label: 'Suomi',
    icon: '🇫🇮',
    title: 'Kieli',
  },
  'fr-BE': {
    lang: 'fr-BE',
    label: 'Français',
    icon: '🇧🇪',
    title: 'Langue',
  },
  'fr-FR': {
    lang: 'fr-FR',
    label: 'Français',
    icon: '🇫🇷',
    title: 'Langue',
  },
  'ga-IE': {
    lang: 'ga-IE',
    label: 'Gaeilge',
    icon: '🇮🇪',
    title: 'Teanga',
  },
  'he-IL': {
    lang: 'he-IL',
    label: 'עברית',
    icon: '🇮🇱',
    title: 'שפה',
  },
  'hi-IN': {
    lang: 'hi-IN',
    label: 'हिन्दी, हिंदी',
    icon: '🇮🇳',
    title: 'भाषा: हिन्दी',
  },
  'hr-HR': {
    lang: 'hr-HR',
    label: 'Hrvatski jezik',
    icon: '🇭🇷',
    title: 'Jezik',
  },
  'hu-HU': {
    lang: 'hu-HU',
    label: 'Magyar',
    icon: '🇭🇺',
    title: 'Nyelv',
  },
  'hy-AM': {
    lang: 'hu-HU',
    label: 'Հայերեն',
    icon: '🇦🇲',
    title: 'Լեզու',
  },
  'id-ID': {
    lang: 'id-ID',
    label: 'Bahasa Indonesia',
    icon: '🇮🇩',
    title: 'Bahasa',
  },
  'it-IT': {
    lang: 'it-IT',
    label: 'Italiano',
    icon: '🇮🇹',
    title: 'Linguaggio',
  },
  'is-IS': {
    lang: 'is-IS',
    label: 'Íslenska',
    icon: '🇮🇸',
    title: 'Tungumál',
  },
  'ja-JP': {
    lang: 'ja-JP',
    label: '日本語',
    icon: '🇯🇵',
    title: '言語',
  },
  'ku-IQ': {
    lang: 'ku-IQ',
    label: 'کوردی',
    icon: '🇮🇶',
    title: 'Ziman',
  },
  'kn-IN': {
    lang: 'zh-TW',
    label: 'ಕನ್ನಡ',
    icon: '🇮🇳',
    title: 'ಭಾಷೆ',
  },
  'ko-KR': {
    lang: 'ko-KR',
    label: '한국어',
    icon: '🇰🇷',
    title: '언어',
  },
  'lv-LV': {
    lang: 'lv-LV',
    label: 'Latviešu valoda',
    icon: '🇱🇮',
    title: 'Kalba',
  },
  'mk-MK': {
    lang: 'mk-MK',
    label: 'македонски јазик',
    icon: '🇲🇰',
    title: 'Јазик',
  },
  'mn-MN': {
    lang: 'mn-MN',
    label: 'Монгол хэл',
    icon: '🇲🇳',
    title: 'Хэл',
  },
  'ms-MY': {
    lang: 'ms-MY',
    label: 'بهاس ملايو‎',
    icon: '🇲🇾',
    title: 'Bahasa',
  },
  'nb-NO': {
    lang: 'nb-NO',
    label: 'Norsk',
    icon: '🇳🇴',
    title: 'Språk',
  },
  'ne-NP': {
    lang: 'ne-NP',
    label: 'नेपाली',
    icon: '🇳🇵',
    title: 'भाषा',
  },
  'nl-BE': {
    lang: 'nl-BE',
    label: 'Vlaams',
    icon: '🇧🇪',
    title: 'Taal',
  },
  'nl-NL': {
    lang: 'nl-NL',
    label: 'Vlaams',
    icon: '🇳🇱',
    title: 'Taal',
  },
  'pt-BR': {
    lang: 'pt-BR',
    label: 'Português',
    icon: '🇧🇷',
    title: 'Idiomas',
  },
  'pt-PT': {
    lang: 'pt-PT',
    label: 'Português',
    icon: '🇵🇹',
    title: 'Idiomas',
  },
  'ro-RO': {
    lang: 'ro-RO',
    label: 'Română',
    icon: '🇷🇴',
    title: 'Limba',
  },
  'ru-RU': {
    lang: 'ru-RU',
    label: 'русский',
    icon: '🇷🇺',
    title: 'язык',
  },
  'sk-SK': {
    lang: 'sk-SK',
    label: 'Slovenčina',
    icon: '🇸🇰',
    title: 'Jazyk',
  },
  'sr-RS': {
    lang: 'sr-RS',
    label: 'српски језик',
    icon: '🇸🇷',
    title: 'Језик',
  },
  'sl-SI': {
    lang: 'sl-SI',
    label: 'Slovenščina',
    icon: '🇸🇱',
    title: 'Jezik',
  },
  'sv-SE': {
    lang: 'sv-SE',
    label: 'Svenska',
    icon: '🇸🇪',
    title: 'Språk',
  },
  'ta-IN': {
    lang: 'ta-IN',
    label: 'தமிழ்',
    icon: '🇮🇳',
    title: 'மொழி',
  },
  'th-TH': {
    lang: 'th-TH',
    label: 'ไทย',
    icon: '🇹🇭',
    title: 'ภาษา',
  },
  'tr-TR': {
    lang: 'tr-TR',
    label: 'Türkçe',
    icon: '🇹🇷',
    title: 'Dil',
  },
  'uk-UA': {
    lang: 'uk-UA',
    label: 'Українська',
    icon: '🇺🇰',
    title: 'Мова',
  },
  'vi-VN': {
    lang: 'vi-VN',
    label: 'Tiếng Việt',
    icon: '🇻🇳',
    title: 'Ngôn ngữ',
  },
  'zh-CN': {
    lang: 'zh-CN',
    label: '简体中文',
    icon: '🇨🇳',
    title: '语言',
  },
  'zh-TW': {
    lang: 'zh-TW',
    label: '繁体中文',
    icon: '🇭🇰',
    title: '語言',
  },
};

export const SelectLang: React.FC<SelectLangProps> = (props) => {
  const { globalIconClassName, postLocalesData, onItemClick, style, ...restProps } = props;
  const selectedLang = getLocale();

  const changeLang = ({ key }: ClickParam): void => setLocale(key);

  const defaultLangUConfig = getAllLocales().map(
    (key) =>
      defaultLangUConfigMap[key] || {
        lang: key,
        label: key,
        icon: '🌐',
        title: key,
      },
  );

  const allLangUIConfig = transformArrayToObject(
    postLocalesData ? postLocalesData(defaultLangUConfig) : defaultLangUConfig,
  );

  const handleClick = onItemClick ? (params: ClickParam) => onItemClick(params) : changeLang;

  const menuItemStyle = { minWidth: '160px' };
  const langMenu = (
    <Menu selectedKeys={[selectedLang]} onClick={handleClick}>
      <Menu.Item key={'en-US'} style={menuItemStyle}>
        <span role="img" aria-label={allLangUIConfig['en-US']?.label || 'en-US'}>
          {allLangUIConfig['en-US']?.icon || '🌐'}
        </span>{' '}
        {allLangUIConfig['en-US']?.label || 'en-US'}
      </Menu.Item>
      <Menu.Item key={'ja-JP'} style={menuItemStyle}>
        <span role="img" aria-label={allLangUIConfig['ja-JP']?.label || 'ja-JP'}>
          {allLangUIConfig['ja-JP']?.icon || '🌐'}
        </span>{' '}
        {allLangUIConfig['ja-JP']?.label || 'ja-JP'}
      </Menu.Item>
       <Menu.Item key={'zh-CN'} style={menuItemStyle}>
        <span role="img" aria-label={allLangUIConfig['zh-CN']?.label || 'zh-CN'}>
          {allLangUIConfig['zh-CN']?.icon || '🌐'}
        </span>{' '}
        {allLangUIConfig['zh-CN']?.label || 'zh-CN'}
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
    <HeaderDropdown overlay={langMenu} placement="bottomRight" {...restProps}>
      <span className={globalIconClassName} style={inlineStyle}>
        <i className="anticon" title={allLangUIConfig[selectedLang]?.title}>
          <img alt="menuLogo" className={globalIconClassName} src={LanguageLogo} />
          <span style={{verticalAlign:"text-bottom"}}>{allLangUIConfig[selectedLang]?.icon || '🌐'}</span>
        </i>
      </span>
    </HeaderDropdown>
  );
  return <></>;
};
