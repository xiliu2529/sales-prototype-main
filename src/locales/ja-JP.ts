import component from './ja-JP/component';
import globalHeader from './ja-JP/globalHeader';
import menu from './ja-JP/menu';
import pwa from './ja-JP/pwa';
import settingDrawer from './ja-JP/settingDrawer';
import settings from './ja-JP/settings';
import orgTree from "./ja-JP/orgTree";
import login from  "./ja-JP/login";
import sendMessage from "@/locales/ja-JP/sendMessage";
import personalSetting from "@/locales/ja-JP/personalSetting";

export default {
  'navBar.lang': 'Idiomas',
  'layout.user.link.help': 'ajuda',
  'layout.user.link.privacy': 'política de privacidade',
  'layout.user.link.terms': 'termos de serviços',
  'app.preview.down.block': 'Download this page to your local project',

  'app.common.Total': '合計',
  'app.common.Customer': '顧客',
  'app.common.customer': '顧客',
  'app.common.CustomerName': '顧客名',
  'app.common.Case': '案件',
  'app.common.case': '案件',
  'app.common.EndUser': 'エンドユーザー',
  'app.common.enduser': 'エンドユーザー',
  'app.common.Edit': '編集',
  'app.common.Delete': '削除',
  'app.common.Copy': 'コピー',
  'app.common.OK': 'はい',
  'app.common.Cancel': 'いいえ',
  'app.common.industry': '業種',
  'app.common.remarks': '備考',
  'app.common.probability': '確率',
  'app.common.No.': '番号',

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
