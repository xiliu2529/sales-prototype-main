/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import {extend} from 'umi-request';

//liao
// export const HttpUrlStr = "http://192.168.25.18:1310/api";
// export const HttpUrlStrAuth = "http://192.168.25.18:1310/auth";
// export const HttpUrlStrUplod =  "http://192.168.25.18:1310/easyfile";


//export const HttpUrlStr = "/v1/api";
//export const HttpUrlStrAuth = "/v1/auth";
//export const HttpUrlStrUplod =  "/v1/easyfile";


// export const HttpUrlStr = "http://192.168.25.246:1310/api";
export const HttpUrlStr = "http://localhost:1310/api";
export const HttpUrlStrAuth = "http://localhost:1310/auth";
export const HttpUrlStrUplod =  "http://192.168.11.26:1310/easyfile";

//git push test by Mao
//git push test by H 2 



// export const HttpUrlStr = "http://localhost:1301";
// export const HttpUrlStrAuth = "http://localhost:1302";

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/**
 * 异常处理程序
 */
const errorHandler = (error: { response: Response }): Response => {
  const { response } = error;
  if(response.status === 401){
    window.location.href = '/homePage';
    window.location.href = '/user/login';
  }else if (response && response.status) {
    if(
      response.status === undefined
      || response.status === 500
      || response.status === 502
      || response.status === 503
      || response.status === 504
    ){
      window.location.href = '/error/500';
      // localStorage.setItem("access_token", '');
      sessionStorage.setItem('access_token',"");
    }else if(
      response.status === 400
      || response.status === 403
    ){
      window.location.href = '/error/403';
      // localStorage.setItem("access_token", '');
      sessionStorage.setItem('access_token',"");
    }
  } else if (!response) {
    window.location.href = '/error/404';
    // localStorage.setItem("access_token", '');
    sessionStorage.setItem('access_token',"");
  }
  return response;
};

/**
 * 配置request请求时的默认参数
 */
const request = extend({
  errorHandler, // 默认错误处理
  credentials: 'include', // 默认请求是否带上cookie
});


// request拦截器, 改变url 或 options.
request.interceptors.request.use(async (url, options) => {

  if (window.location.href.indexOf("192.168.25.246") > 0) {
    url = url.replace('210.12.119.176', '192.168.25.246');
  }

  let c_token = sessionStorage.getItem("access_token");
  let lang =  localStorage.getItem("umi_locale");
  let money = localStorage.getItem('umi_locale_money');
  const useCd = localStorage.getItem('useCd');
  const refresh_token = localStorage.getItem('refresh_token');
  if (lang === null) {
    lang = 'ja_JP';
    localStorage.setItem("umi_locale",'ja-JP');
  }else{
    lang = lang.replace('-', '_');
  }
  if (money === null) {
    money = 'JPY';
  }

  if (c_token) {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Basic bHp0Omx6dA==',
      'access_token': c_token,
      'refresh_token': refresh_token,
      'Accept-Lang':lang,
      'Accept-money':money,
      'useCd': useCd,
    };
    return (
      {
        url: url,
        options: { ...options, headers: headers },
      }
    );
  } else {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Basic bHp0Omx6dA==',
      'access_token': '',
      'Accept-Lang':lang,
      'Accept-money':money,
      'useCd': useCd,
    };
    return (
      {
        url: url,
        options: { ...options, headers: headers },
      }
    );
  }
})

// response拦截器, 处理response
request.interceptors.response.use((response, options) => {
  let token = response.headers.get("access_token");
  if (token) {
    sessionStorage.setItem("access_token", token);
  }
  return response;
});

export default request;
