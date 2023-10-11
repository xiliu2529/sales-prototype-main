import component from './zh-CN/component';
import globalHeader from './zh-CN/globalHeader';
import menu from './zh-CN/menu';
import pwa from './zh-CN/pwa';
import settingDrawer from './zh-CN/settingDrawer';
import settings from './zh-CN/settings';
import orgTree from "./zh-CN/orgTree";
import login from "./zh-CN/login";
import sendMessage from "@/locales/zh-CN/sendMessage";
import personalSetting from "@/locales/zh-CN/personalSetting";

export default {
  'navBar.lang': '语言',
  'layout.user.link.help': '帮助',
  'layout.user.link.privacy': '隐私',
  'layout.user.link.terms': '条款',
  'app.preview.down.block': '下载此页面到本地项目',
  'app.welcome.link.fetch-blocks': '获取全部区块',
  'app.welcome.link.block-list': '基于 block 开发，快速构建标准页面',

  'app.common.Total': '总计',
  'app.common.Customer': '客户',
  'app.common.customer': '客户',
  'app.common.CustomerName': '客户名',
  'app.common.Case': '项目',
  'app.common.case': '项目',
  'app.common.EndUser': '最终用户',
  'app.common.enduser': '最终用户',
  'app.common.Edit': '编辑',
  'app.common.Delete': '删除',
  'app.common.Copy': '复制',
  'app.common.OK': '确定',
  'app.common.Cancel': '取消',
  'app.common.industry': '行业',
  'app.common.remarks': '评论',
  'app.common.probability': '可能性',
  'app.common.No.': '编号',

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
