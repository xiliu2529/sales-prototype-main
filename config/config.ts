// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
const { REACT_APP_ENV } = process.env;
export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  locale: {
    // default zh-CN
    default: 'ja-JP',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: false,
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes: [
    {
      path: '/user',
      component: '../layouts/UserLayout',
      routes: [
        {
          name: 'login',
          path: '/user/login',
          component: './user/login',
        },
      ],
    },

    {
      path: '/error',
      component: '../layouts/ErrorLayout',
      routes: [
        {
          name: '403',
          icon: 'smile',
          path: '/error/403',
          component: './Exception/403',
        },
        {
          name: '404',
          icon: 'smile',
          path: '/error/404',
          component: './Exception/404',
        },
        {
          name: '500',
          icon: 'smile',
          path: '/error/500',
          component: './Exception/500',
        },
      ],
    },

    {
      path: '/',
      component: '../layouts/SecurityLayout',
      routes: [
        {
          path: '/',
          component: '../layouts/BasicLayout',
          authority: ['user', 'busUser', 'sysAdmin'],
          routes: [
            {
              path: '/',
              redirect: '/HomePage',
            },
            {
              name: 'homepage',
              icon: 'smile',
              path: '/homePage',
              component: './HomePage',
            },
            {
              path: '/admin',
              name: 'admin',
              icon: 'crown',
              component: './Admin',
              authority: ['admin'],
              routes: [
                {
                  path: '/admin/sub-page',
                  name: 'sub-page',
                  icon: 'smile',
                  component: './Welcome',
                  authority: ['admin'],
                },
              ],
            },
            {
              name: 'account.settings',
              icon: 'smile',
              path: '/accountsettings',
              component: './AccountSettings',
            },
	          {
              name: 'Actuality Forecast',
              icon: 'smile',
              path: '/formadvancedform',
              component: './FormAdvancedForm',
            },
            {
              name: 'Actuality Forecast',
              icon: 'smile',
              path: '/formadvancedformSea',
              component: './FormAdvancedForm',
            },
            {
              name: 'Actuality Forecast',
              icon: 'smile',
              path: '/formadvancedformSearchRun',
              component: './FormAdvancedForm',
            },
            {
              name: 'Actuality Forecast',
              icon: 'smile',
              path: '/formadvancedformSeaRun',
              component: './FormAdvancedForm',
            },
            {
              name: 'Actuality Forecast',
              icon: 'smile',
              path: '/formadvancedformEditAct',
              component: './FormAdvancedForm',
            },
            {
              name: 'Actuality Forecast',
              icon: 'smile',
              path: '/formadvancedformEditRun',
              component: './FormAdvancedForm',
            },
            {
              name: 'Business Activities',
              icon: 'smile',
              path: '/businessactivities',
              component: './BusinessActivities',
            },
            {
              name: 'Business Activities',
              icon: 'smile',
              path: '/businessactivitiesSearchCase',
              component: './BusinessActivities',
            },
            {
              name: 'Business Activities',
              icon: 'smile',
              path: '/businessactivitiesEditAct',
              component: './BusinessActivities',
            },
            {
              name: 'UploadExcel',
              icon: 'smile',
              path: '/uploadExcel',
              component: './UploadExcel',
            },
            {
              name: 'Report',
              icon: 'smile',
              path: '/report',
              component: './Report',
            },
            {
              component: './404',
            },
          ],
        },
        {
          component: './404',
        },
      ],
    },
    {
      component: './404',
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  // https://www.bejson.com/convert/image_to_svg
  theme: {
    // ...darkTheme,
    'primary-color': defaultSettings.primaryColor,
    //'layout-header-background': '#f4faf2',
  },
  // @ts-ignore
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
});
