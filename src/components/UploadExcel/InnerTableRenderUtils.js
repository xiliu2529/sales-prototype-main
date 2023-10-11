import React from 'react';
import TableUtils from './TableUtils.js';
import styles from "@/components/UploadExcel/style.less";

// 自定义操作字段, 在dataSchema中是用一个特殊的key来标识的
const ACTION_KEY = 'singleRecordActions';

/**
 * 表格的render函数有个比较蛋疼的问题, 就是this绑定, 专门写个工具类去处理
 */
const RenderUtils = {

  // 这个utils是有状态的
  // 用一个set保存目前已经处理过哪些表的render, 已经处理过的就不用再处理了
  tableNameSet: new Set(),

  /**
   * 处理表格的schema, 根据情况赋值render函数
   *
   * @param tableSchema 表格的schema
   * @param tableName 表名
   * @param innerTableComponent 对应的InnerTable组件, 换句话说, 要绑定的this对象
   * @returns {*}
   */
  bindRender(tableSchema, tableName) {
    // 命中缓存
    if (this.tableNameSet.has(tableName)) {
      return tableSchema;
    }
    tableSchema.forEach(col => {
      // 没有子节点的场合
      if(col.dataAlign !== undefined){
        if(col.dataAlign === 1){
          // eslint-disable-next-line no-param-reassign
          col.render = this.alignLeft()(col.title);
        }else if(col.dataAlign === 2){
          // eslint-disable-next-line no-param-reassign
          col.render = this.alignRight()(col.title);
        }else if(col.dataAlign === 3){
          // eslint-disable-next-line no-param-reassign
          col.render = this.alignCenter()(col.title);
        }else{
          // eslint-disable-next-line no-param-reassign
          col.render = this.alignLeft()(col.title);
        }
      }else{
        col.children.forEach((childer)=>{
          if(childer.dataAlign === 1){
            // eslint-disable-next-line no-param-reassign
            childer.render = this.alignLeft()(childer.title);
          }else if(childer.dataAlign === 2){
            // eslint-disable-next-line no-param-reassign
            childer.render = this.alignRight()(childer.title);
          }else if(childer.dataAlign === 3){
            // eslint-disable-next-line no-param-reassign
            childer.render = this.alignCenter()(childer.title);
          }else{
            // eslint-disable-next-line no-param-reassign
            childer.render = this.alignLeft()(childer.title);
          }
        })
      }
    });

    const ignoreCache = TableUtils.shouldIgnoreSchemaCache(tableName);
    if (!ignoreCache) {
      this.tableNameSet.add(tableName);
    }
    return tableSchema;
  },

  /**
   * 数据居左显示
   *
   * @returns {function(): function()}
   */
  alignLeft() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return onClickImagePreview => text => {
      return <div className={styles.alignLeft}>{text}</div>;
    }
  },

  /**
   * 数据居右显示
   *
   * @returns {function(): function()}
   */
  alignRight() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return onClickImagePreview => text => {
      return <div className={styles.alignRight}>{text}</div>;
    }
  },

  /**
   * 数据居中显示
   *
   * @returns {function(): function()}
   */
  alignCenter() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return onClickImagePreview => text => {
      return <div className={styles.alignCenter}>{text}</div>;
    }
  },
};

export default RenderUtils;
export {ACTION_KEY};
