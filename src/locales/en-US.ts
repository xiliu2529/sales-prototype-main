import component from './en-US/component';
import globalHeader from './en-US/globalHeader';
import menu from './en-US/menu';
import pwa from './en-US/pwa';
import settingDrawer from './en-US/settingDrawer';
import settings from './en-US/settings';
import orgTree from "./en-US/orgTree";
import login from "./en-US/login";
import sendMessage from "@/locales/en-US/sendMessage";
import personalSetting from "@/locales/en-US/personalSetting";

export default {
  'navBar.lang': 'Languages',
  'layout.user.link.help': 'Help',
  'layout.user.link.privacy': 'Privacy',
  'layout.user.link.terms': 'Terms',
  'app.preview.down.block': 'Download this page to your local project',
  'app.welcome.link.fetch-blocks': 'Get all block',
  'app.welcome.link.block-list': 'Quickly build standard, pages based on `block` development',

  'app.common.Total': 'Total',
  'app.common.Customer': 'Customer',
  'app.common.customer': 'customer',
  'app.common.CustomerName': 'Customer',
  'app.common.Case': 'Case',
  'app.common.case': 'case',
  'app.common.EndUser': 'End User',
  'app.common.enduser': 'end user',
  'app.common.Edit': 'Edit',
  'app.common.Delete': 'Delete',
  'app.common.Copy': 'Copy',
  'app.common.OK': 'Yes',
  'app.common.Cancel': 'No',
  'app.common.industry': 'industry',
  'app.common.remarks': 'remarks',
  'app.common.probability': 'probability',
  'app.common.No.': 'No.',

  ...globalHeader,
  ...menu,
  ...settingDrawer,
  ...settings,
  ...pwa,
  ...component,
  ...orgTree,
  ...login,
  ...sendMessage,
  ...personalSetting,
};
