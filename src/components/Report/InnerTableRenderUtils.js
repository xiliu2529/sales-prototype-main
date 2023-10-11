import React from 'react';
import TableUtils from './TableUtils.js';
import styles from "@/components/Report/style.less";
import {Checkbox, ConfigProvider, DatePicker, Input, Select, Button} from 'antd';
import locale from "antd/lib/locale/zh_CN";
import moment from "moment";

const { Option } = Select;

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
   * 重置状态, InnerTable组件unmount时调用
   * 因为只有组件unmount后才可能需要重新绑定this
   */
  reset() {
    this.tableNameSet.clear();
  },

  /**
   * 处理表格的schema, 根据情况赋值render函数
   *
   * @param tableSchema 表格的schema
   * @param tableName 表名
   * @param innerTableComponent 对应的InnerTable组件, 换句话说, 要绑定的this对象
   * @returns {*}
   */
  bindRender1(tableSchema, tableName, innerTableComponent,props) {
    const {fieldMap} = innerTableComponent;

    tableSchema.forEach(col => {
      const field = fieldMap.get(col.key);
      if (!field) {
        return;
      }

/*
      const str = "{'background' : '#f0f0f0',}";
      const styleStr = {'background' : '#f0f0f0',};

      const colStyle = JSON.parse(JSON.stringify(styleStr));

      console.log("str"+JSON.parse(JSON.stringify(str)))
      console.log("styleStr"+JSON.parse(JSON.stringify(styleStr)));

      console.log("props.data[0]"+props.schema[0]);
*/

   /*   const styleStr="{'background':'red','width':'50px'}";


      const styleO =(new Function("","return " + styleStr))(); */

      const styleObj =(new Function("","return " + col.colType))();
      if(field.rowMarge !== '1'){
        col.render = this.colStyle(styleObj,field.rowMarge)();
      }else{
        col.render = this.colStyleDefault(styleObj)();
      }

    });
    return tableSchema;
  },


  /**
   * 处理表格的schema, 根据情况赋值render函数
   *
   * @param tableSchema 表格的schema
   * @param tableName 表名
   * @param innerTableComponent 对应的InnerTable组件, 换句话说, 要绑定的this对象
   * @returns {*}
   */
  bindRender(tableSchema, tableName, innerTableComponent) {
    const {fieldMap} = innerTableComponent;

    tableSchema.forEach(col => {
      const field = fieldMap.get(col.key);
      if (!field) {
        return;
      }

      if(col.key !== '0'){
        if(col.dataAlign !== undefined){
          if(col.dataAlign === "1"){
            // eslint-disable-next-line no-param-reassign
            col.render = this.alignLeft()(col.title);
          }else if(col.dataAlign === "2"){
            // eslint-disable-next-line no-param-reassign
            col.render = this.alignRight()(col.title);
          }else if(col.dataAlign === "3"){
            // eslint-disable-next-line no-param-reassign
            col.render = this.alignCenter()(col.title);
          }else{
            // eslint-disable-next-line no-param-reassign
            col.render = this.alignLeft()(col.title);
          }
        }
      }



      /*      if(col.key !== '0'  && col.key !== '00' && col.key !== '97' && col.key !== '98' && col.key !== '99') {
              // eslint-disable-next-line no-param-reassign
              col.render = this.addButton()(col.title);
            } */
      /*      if(col.key !== '0'  && col.key !== '00' && col.key !== '97' && col.key !== '98' && col.key !== '99') {
              // eslint-disable-next-line no-param-reassign
              col.render = this.addButton()(col.title);
            } */

      // 添加input组件
      /*      if(col.key !== '0'  && col.key !== '00' && col.key !== '97' && col.key !== '98' && col.key !== '99'){
              // eslint-disable-next-line no-param-reassign
              col.render = this.addInput()(col.title);
            } */
      // 添加input组件
      /*      if(col.key !== '0'  && col.key !== '00' && col.key !== '97' && col.key !== '98' && col.key !== '99'){
              // eslint-disable-next-line no-param-reassign
              col.render = this.addInput()(col.title);
            } */

      /*      if(col.key !== '0'  && col.key !== '00' && col.key !== '97' && col.key !== '98' && col.key !== '99'){
              // eslint-disable-next-line no-param-reassign
              col.render = this.addSelect()(col.title);
            } */
      /*      if(col.key !== '0'  && col.key !== '00' && col.key !== '97' && col.key !== '98' && col.key !== '99'){
              // eslint-disable-next-line no-param-reassign
              col.render = this.addSelect()(col.title);
            } */

      /*      if(col.key !== '0'  && col.key !== '00' && col.key !== '97' && col.key !== '98' && col.key !== '99'){
              // eslint-disable-next-line no-param-reassign
              col.render = this.addCalendar()(col.title);
            } */
      /*      if(col.key !== '0'  && col.key !== '00' && col.key !== '97' && col.key !== '98' && col.key !== '99'){
              // eslint-disable-next-line no-param-reassign
              col.render = this.addCalendar()(col.title);
            } */

      /*      if(col.key !== '0'  && col.key !== '00' && col.key !== '97' && col.key !== '98' && col.key !== '99') {
              // eslint-disable-next-line no-param-reassign
              col.render = this.addCheckBox()(col.title);
            } */
    /*      if(col.key !== '0'  && col.key !== '00' && col.key !== '97' && col.key !== '98' && col.key !== '99') {
            // eslint-disable-next-line no-param-reassign
            col.render = this.addCheckBox()(col.title);
          } */
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
   * 列样式
   *
   * @returns {function(): function()}
   */
  colStyle(colStyle,rowMerge) {

// eslint-disable-next-line @typescript-eslint/no-unused-vars
    return onClickImagePreview => (text, row, index,) => {
      if (index % rowMerge === 0) {
        if (text === undefined || text === "" || text === null) {
          return {
            children: <div style={colStyle}>&nbsp;</div>,
            props: {
              rowSpan: rowMerge,
            },
          };
        } else {
          return {
            children: <div style={colStyle}>{text}</div>,
            props: {
              rowSpan: rowMerge,
            },
          };
        }
      } else {
        if (text === undefined || text === "" || text === null) {
          return {
            children: <div style={colStyle}>&nbsp;</div>,
            props: {
              rowSpan: 0,
            },
          }
        } else {
          return {
            children: <div style={colStyle}>{text}</div>,
            props: {
              rowSpan: 0,
            },
          };
        }
      }
    }
  },
  /**
   * 列样式
   *
   * @returns {function(): function()}
   */
  colStyleDefault(colStyle) {

// eslint-disable-next-line @typescript-eslint/no-unused-vars
    return onClickImagePreview => (text,row,index,) => {
      if(text === undefined || text === "" || text === null){
        return <div style={colStyle}>&nbsp;</div>;
      }
           return <div style={colStyle}>{text}</div>;
      }
    },



  /**
   * 添加 checkbox 组件
   *
   * @returns {function(): function()}
   */
  addButton() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return onClickImagePreview => text => {
      return <div className={styles.inputStyle}>
        <Button type="primary">{text}</Button>
      </div>;
    }
  },

  /**
   * 添加input组件
   *
   * @returns {function(): function()}
   */
  addInput() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return onClickImagePreview => text => {
      return <div className={styles.inputStyle}>
        <Input  defaultValue={text}/>
      </div>;
    }
  },

  /**
   * 添加 select 组件
   *
   * @returns {function(): function()}
   */
  addSelect() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return onClickImagePreview => text => {
      return <div className={styles.inputStyle}>
        <Select
          defaultValue={text}
        >
          <Option key={1} value={text}>{text}</Option>
        </Select>
      </div>;
    }
  },

  /**
   * 添加 calendar 组件
   *
   * @returns {function(): function()}
   */
  addCalendar() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return onClickImagePreview => text => {
      return <div className={styles.inputStyle}>
        <ConfigProvider locale={locale}>
          <DatePicker
            picker="month"
            placeholder=''
            defaultValue={moment()}
            // value={text === '' ? null : moment(text, 'YYYY/MM')}
            format="YYYY/MM"
          />
        </ConfigProvider>
      </div>;
    }
  },

  /**
   * 添加 checkbox 组件
   *
   * @returns {function(): function()}
   */
  addCheckBox() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return onClickImagePreview => text => {
      return <div className={styles.inputStyle}>
        <Checkbox
          defaultChecked={false}
        />
      </div>;
    }
  },

};

export default RenderUtils;
export {ACTION_KEY};
