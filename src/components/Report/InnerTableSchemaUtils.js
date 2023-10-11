import React from 'react';
import {
  Form,
  Input,
  DatePicker,
  Select,
  Radio,
  InputNumber,
  Checkbox,
  Cascader
} from 'antd';
import TableUtils from './TableUtils.js';
import FileUploader from './FileUploader';
import Logger from './Logger';
import {ACTION_KEY} from './InnerTableRenderUtils';
import styles from './style.less';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
const {Option} = Select;

const logger = Logger.getLogger('InnerTableSchemaUtils');

// 跟InnerForm类似, InnerTable也将parse schema的过程独立出来
// FIXME: 这种缓存也许用weak map更合适
const tableSchemaMap = new Map();  // key是tableName, value是表格的schema, 还有一些额外信息
const formSchemaMap = new Map();  // key是tableName, value是表单的schema callback
const formMap = new Map();  // key是tableName, value是对应的react组件

/**
 * 跟InnerFormSchemaUtils非常类似, 但不用考虑布局相关的东西了
 */
const SchemaUtils = {
  /**
   * 解析表格的schema
   *
   * @param schema
   * @returns {*}
   */
  getTableSchema(schema,index) {

    const toCache = {};
    const newCols = [];
    const fieldMap = new Map();
    schema.forEach((field) => {

      // 有点类似索引
      fieldMap.set(field.key, field);
      // 当前列是否是主键?
      if (field.primary) {
        toCache.primaryKey = field.key;
      }
      const col = {};
/*      let className = '';
      // 紫色
      if(field.backColor==='#B1A0C7'){
        // 加粗
        if(field.fontFormat==='BOLD'){
          className = styles.BackColor_Purple_Bold;
          // 不加粗
        }else{
          className = styles.BackColor_Purple_No;
        }
        // 青色
      }else if(field.backColor==='#B7DEE8') {
        // 加粗
        if(field.fontFormat==='BOLD'){
          className = styles.BackColor_Blue_Bold;
          // 不加粗
        }else{
          className = styles.BackColor_Blue_No;
        }
      } */

      let colAlign = '';
      if(field.align==='1'){
        colAlign ='left';
      }else if(field.align==='2'){
        colAlign ='right';
      }else{
        colAlign ='center';
      }
      let styleObj;
      if(index !== "" && index !== null && index !== undefined) {
         styleObj = (new Function("", `return ${  field.colType}`))();
      }

      col.key = field.key;
      col.dataIndex = field.key;
      // col.title = <span style={{display:'table',margin:'0 auto'}}>{field.title}</span>;
      if(index !== "" && index !== null && index !== undefined){
        col.title = <div style={styleObj}>{field.title}</div>;
      }else{
        col.title = field.title;
      }
      const classesNm=['red','bold'].join(" ");

      col.className = classesNm;
      col.rowMarge = field.rowMarge;
   /*   if((schema.length-1).toString() !== field.key){
        col.width = field.width+"%";
      }*/
      col.width = field.width+"px";
      col.align = 'center';
      // col.dataAlign = field.align;
      col.colType = field.colType;
      col.render = field.render;
      newCols.push(col);
    });

    toCache.tableSchema = newCols;
    toCache.fieldMap = fieldMap;

    return toCache;
  },

  /**
   * 解析表格的schema
   *
   * @param schema
   * @returns {*}
   */
  getSumTableSchema(schema) {

    const toCache = {};
    const newCols = [];
    const fieldMap = new Map();
    schema.forEach((field) => {

      // 有点类似索引
      fieldMap.set(field.key, field);
      // 当前列是否是主键?
      if (field.primary) {
        toCache.primaryKey = field.key;
      }

      const col = {};
      let className = '';

      // 加粗
      if(field.fontFormat==='BOLD'){
        className = styles.BackColor_Blue_Bold;
        // 不加粗
      }else{
        className = styles.BackColor_Blue_No;
      }

      col.key = field.key;
      col.dataIndex = field.key;
      col.title = '';
      col.className = className;
      col.rowMarge = field.rowMarge;
      col.width = `${field.width}px`;
      col.align = 'center';
      col.dataAlign = field.align;
      col.render = field.render;
      newCols.push(col);
    });

    toCache.tableSchema = newCols;
    toCache.fieldMap = fieldMap;

    return toCache;
  },

  /**
   * 和getTableSchema配合的一个方法, 用于解析optionMap
   *
   * @param options
   * @param showType
   * @returns {{}}
   */
  transformOptionMap(options, showType){
    const optionMap = {};

    // 对于级联选择要特殊处理下
    if (showType === 'cascader') {
      const browseOption = (item) => {  // dfs
        optionMap[item.value] = item.label;
        if (item.children) {
          item.children.forEach(browseOption);
        }
      };
      options.forEach(browseOption);
    } else {
      for (const option of options) {
        optionMap[option.key] = option.value;
      }
    }

    return optionMap;
  },

  /**
   * 获取某个表单对应的react组件
   *
   * @param tableName
   * @param schema
   * @returns {*}
   */
  getForm(tableName, schema) {
    const ignoreCache = TableUtils.shouldIgnoreSchemaCache(tableName);

    if (formMap.has(tableName)) {
      return formMap.get(tableName);
    }
      const newForm = this.createForm(tableName, schema);
      if (!ignoreCache) {
        formMap.set(tableName, newForm);
      }
      return newForm;

  },

  /**
   * 动态生成表单
   *
   * @param tableName
   * @param schema
   * @returns {*}
   */
  createForm(tableName, schema) {
    const ignoreCache = TableUtils.shouldIgnoreSchemaCache(tableName);
    const that = this;

    class tmpComponent extends React.Component {
      constructor(props) {
        super(props);
      }

      componentWillMount() {
        if (formSchemaMap.has(tableName)) {
          this.schemaCallback = formSchemaMap.get(tableName);
          return;
        }
        const schemaCallback = that.parseFormSchema(schema);
        if (!ignoreCache) {
          formSchemaMap.set(tableName, schemaCallback);
        }
        this.schemaCallback = schemaCallback;
      }

      // 表单挂载后, 给表单一个初始值
      componentDidMount(){
        if (this.props.initData) {  // 这种方法都能想到, 我tm都佩服自己...
          this.props.form.setFieldsValue(this.props.initData);
        }
      }

      render() {
        return this.schemaCallback(this.props.forUpdate, this.props.keysToUpdate);
      }
    }
    return tmpComponent;
  },

  /**
   * 这是最主要的方法
   *
   * @param schema
   * @returns {function()}
   */
  parseFormSchema(schema) {
    this.parseValidator(schema);

    const rows = [];
    schema.forEach((field) => {
      // 有一些列不需要在表单中展示
      if (field.showInForm === false)
        return;
      if (field.key === ACTION_KEY)
        return;
      rows.push(this.transFormField(field));
    });

    // 返回的schemaCallback有3个参数
    // 1. getFieldDecorator, 表单组件对应的getFieldDecorator函数
    // 2. forUpdate, 当前表单是用于insert还是update, 影响到校验规则
    // 3. keysToUpdate, 允许更新哪些字段, 影响到modal中显示哪些字段, 仅当forUpdate=true时生效
    return ( ) => {
      const formRows = []; // 最终的表单中的一行
      for (const row of rows) {
        formRows.push(row());
      }

      return (<Form horizontal>
        {formRows}
      </Form>);
    };
  },

  /**
   * 有点蛋疼的一件事, dataSchema定义的表单, 要同时用于insert和update, 但二者需要的校验规则是不同的
   * 比如insert时某个字段是必填的, 但update时是不需要填的
   *
   * @param schema
   */
  parseValidator(schema){
    schema.forEach((field) => {
      if (!field.validator)
        return;

      const newRules = [];
      for (const rule of field.validator) {
        newRules.push({ ...rule, required: false}); // update时没有字段是必填的
      }
      // 这种$$开头的变量都被我用作内部变量
      field.$$updateValidator = newRules;
    });
  },


  colWrapper(formItem, field) {
    return () => (
      <FormItem  key={field.key} label={field.title} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
        {formItem}
      </FormItem>
    );
  },

  transFormField(field) {
    // 对于主键, 直接返回一个不可编辑的textarea, 因为主键一般是数据库自增的
    // 如果有特殊情况需要自己指定主键, 再说吧
    if (field.primary === true) {
      logger.debug('key %o is primary, transform to text area', field);
      return this.colWrapper(
        <Input type="textarea" autosize={{ minRows: 1, maxRows: 10 }} disabled size="default"/>
        , field)
    }

    switch (field.showType) {
      case 'select':
        return this.transformSelect(field);
      case 'radio':
        return this.transformRadio(field);
      case 'checkbox':
        return this.transformCheckbox(field);
      case 'multiSelect':
        return this.transformMultiSelect(field);
      case 'textarea':
        return this.transformTextArea(field);
      case 'image':
        return this.transformImage(field);
      case 'file':
        return this.transformFile(field);
      case 'cascader':
        return this.transformCascader(field);
      default:
        return this.transformNormal(field);
    }
  },

  /**
   * 将schema中的一列转换为下拉框
   *
   * @param field
   */
  transformSelect(field) {
    logger.debug('transform field %o to Select component', field);
    const options = [];
    field.options.forEach((option) => {
      options.push(<Option key={option.key} value={option.key}>{option.value}</Option>);
    });
    return this.colWrapper(
      <Select placeholder={field.placeholder || '请选择'} size="default" disabled={field.disabled}>
        {options}
      </Select>
      , field )
  },

  /**
   * 将schema中的一列转换为单选框
   *
   * @param field
   */
  transformRadio(field) {
    logger.debug('transform field %o to Radio component', field);
    const options = [];
    field.options.forEach((option) => {
      options.push(<Radio key={option.key} value={option.key}>{option.value}</Radio>);
    });

    return this.colWrapper(
      <RadioGroup disabled={field.disabled}>
        {options}
      </RadioGroup>
      , field);
  },

  /**
   * 将schema中的一列转换为checkbox
   *
   * @param field
   */
  transformCheckbox(field) {
    logger.debug('transform field %o to Checkbox component', field);
    const options = [];
    field.options.forEach((option) => {
      options.push({label: option.value, value: option.key});
    });

    return this.colWrapper(
      <CheckboxGroup options={options} disabled={field.disabled}/>
      , field);
  },

  /**
   * 转换为下拉多选框
   *
   * @param field
   * @returns {XML}
   */
  transformMultiSelect(field) {
    logger.debug('transform field %o to MultipleSelect component', field);
    const options = [];
    field.options.forEach((option) => {
      options.push(<Option key={option.key} value={option.key}>{option.value}</Option>);
    });

    return this.colWrapper(
      <Select multiple placeholder={field.placeholder || '请选择'} size="default" disabled={field.disabled}>
        {options}
      </Select>
      , field);
  },

  /**
   * 转换为textarea
   *
   * @param field
   * @returns {XML}
   */
  transformTextArea(field) {
    logger.debug('transform field %o to textarea component', field);
    return this.colWrapper(
      <Input type="textarea" placeholder={field.placeholder || '请输入'} autosize={{ minRows: 2, maxRows: 10 }}
             disabled={field.disabled} size="default"/>
      , field);
  },

  /**
   * 转换为图片上传组件
   *
   * @param field
   * @returns {XML}
   */
  transformImage(field) {
    logger.debug('transform field %o to image component', field);
    return this.colWrapper(
      <FileUploader max={field.max} url={field.url} sizeLimit={field.sizeLimit} accept={field.accept}
                    placeholder={field.placeholder} type="image"/>
      , field);
  },

  /**
   * 转换为文件上传组件
   *
   * @param field
   * @returns {XML}
   */
  transformFile(field) {
    logger.debug('transform field %o to file component', field);
    return this.colWrapper(
      <FileUploader max={field.max} url={field.url} sizeLimit={field.sizeLimit} accept={field.accept}
                    placeholder={field.placeholder}/>
      , field);
  },

  /**
   * 转换为级联选择
   *
   * @param field
   * @returns {XML}
   */
  transformCascader(field) {
    logger.debug('transform field %o to Cascader component', field);
    return this.colWrapper(
      <Cascader options={field.options} expandTrigger="hover" placeholder={field.placeholder || '请选择'} size="default"
                disabled={field.disabled}/>
      , field);
  },

  /**
   * 将schema中的一列转换为普通输入框
   *
   * @param field
   * @returns {XML}
   */
  transformNormal(field) {
    switch (field.dataType) {
      case 'int':
        logger.debug('transform field %o to integer input component', field);
        return this.colWrapper(
          <InputNumber size="default" max={field.max} min={field.min} placeholder={field.placeholder}
                       disabled={field.disabled}/>
          , field);
      case 'float':
        logger.debug('transform field %o to float input component', field);
        return this.colWrapper(
          <InputNumber step={0.01} size="default" max={field.max} min={field.min} placeholder={field.placeholder}
                       disabled={field.disabled}/>
          , field);
      case 'datetime':
        logger.debug('transform field %o to datetime input component', field);
        return this.colWrapper(
          <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" placeholder={field.placeholder || '请选择日期'}
                      disabled={field.disabled}/>
          , field);
      default:  // 默认就是普通的输入框
        logger.debug('transform field %o to varchar input component', field);
        return this.colWrapper(
          <Input placeholder={field.placeholder} size="default" addonBefore={field.addonBefore}
                 addonAfter={field.addonAfter} disabled={field.disabled}/>
          , field);
    }
  },
};



export default SchemaUtils;
