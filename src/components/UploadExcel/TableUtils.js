import {notification} from 'antd';
import globalConfig from './config.js';
import ajax from './ajax';
import Logger from './Logger';

const logger = Logger.getLogger('TableUtils');

// 缓存, key是tableName, value是{querySchema, dataSchema}
const tableMap = new Map();
// 缓存, key是tableName, value是tableConfig
const configMap = new Map();

/**
 * 用于解析表schema的工具类
 */
export default {

  // 将getSchema的函数分为3个, 分别用于不同情况
  // 其实就是从远程加载schema时比较特殊, 要显示一个loading提示给用户, 必须是async函数, 其他的就是普通的同步函数

  /**
   * 从缓存中获取schema
   *
   * @param tableName
   * @returns {V}
   */
  getCacheSchema(tableName){
    return tableMap.get(tableName);
  },

  /**
   * 从本地的js文件中读取schema, 会更新缓存
   *
   * @param tableName
   */
  getLocalSchema(tableName) {
    const ignoreCache = this.shouldIgnoreSchemaCache(tableName);
    let dataSchema;

/*    try {
      querySchema = require(`./schema/${tableName}.querySchema.js`);
      // 如果是忽略cache, 每次读取的schema都必须是全新的
      if (ignoreCache) {
        querySchema = querySchema.map(item => Object.assign({}, item));  // Object.assign是浅拷贝, 不过没啥影响
      }
    } catch (e) {
      logger.error('load query schema error: %o', e);
    } */

    try {
      // eslint-disable-next-line global-require,import/no-dynamic-require
      dataSchema = require(`./schema/${tableName}.dataSchema.js`);
      if (ignoreCache) {
        dataSchema = dataSchema.map(item => ({ ...item}));
      }
    } catch (e) {
      logger.error('load data schema error: %o', e);
    }

    // 注意这里会更新缓存
/*    const toCache = {querySchema, dataSchema};
    if (!ignoreCache) {
      tableMap.set(tableName, toCache);
    } */
    // 不更新cachse
    return dataSchema;
  },


  /**
   * 合并本地的schema和解析excel的schema, 其实就是合并两个array
   *
   * @param excelData 解析完excel的数据
   * @param resultSchema 合并本地schema和数据库后的
   * @returns {*}
   */
  mergeExcel(excelData, resultSchema) {
    // 注意local和excelData都可能是undefined
    // 只有二者都不是undefined时, 才需要merge
    if (excelData && resultSchema) {
      const result = [];  // 合并后的结果

      const map = new Map();
      // 获取所有的 日文 标题
      excelData.forEach(item => map.set(item.title, item));

      // 注意合并的逻辑: 如果远程的title本地也有, 就更新; 否则新增, 新增的列都放在最后
      resultSchema.forEach(item => {
        if (map.has(item.title)) {
          // 注意传值vs传引用的区别
          Object.assign(map.get(item.title), item);
          result.push(item);
        }
      });
      return result;
    }
    // 注意这个表达式
    return excelData || resultSchema;
  },

  /**
   * 合并本地的schema和远程的schema, 其实就是合并两个array
   *
   * @param local 本地schema
   * @param remote 远程schema
   * @returns {*}
   */
  merge(local, remote) {
    // 注意local和remote都可能是undefined
    // 只有二者都不是undefined时, 才需要merge
    if (local && remote) {
      const result = [];  // 合并后的结果

      const map = new Map();
      // 获取所有的 日文 标题
      local.forEach(item => map.set(item.title, item));

      result.push(local.filter((item)=>item.title==='No')[0]);

      // 注意合并的逻辑: 如果远程的title本地也有, 就更新; 否则新增, 新增的列都放在最后
      remote.forEach(item => {
        if (map.has(item.title)) {
          // 注意传值vs传引用的区别
          Object.assign(map.get(item.title), item);
          result.push(item);
        }else if(item.title !== ''){
            result.push(item);
          }
      });
      return result;
    }
      // 注意这个表达式
      return local || remote;

  },

  /**
   * 弹出一个错误信息提示用户
   *
   * @param errorMsg
   */
  error(errorMsg) {
    notification.error({
      message: '出错啦!',
      description: `请联系管理员, 错误信息: ${errorMsg}`,
      duration: 0,
    });
  },

  /**
   * 获取某个表的个性化配置, 会合并默认配置
   *
   * @param tableName
   * @returns {*}
   */
  getTableConfig(tableName) {
    if (configMap.has(tableName)) {
      return configMap.get(tableName);
    }

    let tableConfig;
    try {
      const tmp = require(`./schema/${tableName}.config.js`);  // 个性化配置加载失败也没关系
      tableConfig = { ...globalConfig.DBTable.default, ...tmp};  // 注意合并默认配置
    } catch (e) {
      logger.warn('can not find config for table %s, use default instead', tableName);
      tableConfig = { ...globalConfig.DBTable.default};
    }

    configMap.set(tableName, tableConfig);
    return tableConfig;
  },

  /**
   * 某个表是否应该忽略缓存
   *
   * @param tableName
   * @returns {boolean}
   */
  shouldIgnoreSchemaCache(tableName) {
    const tableConfig = this.getTableConfig(tableName);
    return tableConfig.asyncSchema === true && tableConfig.ignoreSchemaCache === true;
  },

}
