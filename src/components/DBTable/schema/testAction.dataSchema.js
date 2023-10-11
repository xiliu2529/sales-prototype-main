
module.exports = [
  {
    key: 'id',
    title: 'ID',
    dataType: 'int',
    primary: true,
    width: 160,    
    render(text) {
      // 只是一个例子, 说明下render函数中可以用this, 甚至可以this.setState之类的
      // 我会把this绑定到当前的InnerTable组件上
      // 但需要注意, 如果要使用this, render必须是普通的函数, 不能是箭头函数, 因为箭头函数不能手动绑定this
      // this不要滥用, 搞出内存泄漏就不好了
      // render应该尽量是一个纯函数, 不要有副作用
      // console.log(this.props.tableName);
      return text + "sfsdfsd";
    },
  },
  {
    key: 'name',
    title: '姓名',
    dataType: 'varchar',
    validator: [{type: 'string', max: 10, message: '最多10个字符'}],
    width: 160,        
  },
  {
    key: 'touxiang',
    title: '头像',
    dataType: 'varchar',
    showType: 'image',
    width: 60,
  },
  {
    key: 'desc',
    title: '描述',
    dataType: 'varchar',
  },
  {
    key: 'score',
    title: '分数',
    dataType: 'int',
    max: 18,
    validator: [{required: true, message: '必填'}],
  },
  {
    key: 'gpa',
    title: 'GPA',
    dataType: 'float',
  },
  {
    key: 'birthday',
    title: '生日',
    dataType: 'datetime',
  },
  {
    key: 'marriage',
    title: '婚否',
    dataType: 'varchar',
    showType: 'select',
    options: [{key: 'yes', value: '已婚'}, {key: 'no', value: '未婚'}],
    validator: [{type: 'string', required: true, message: '必须选择婚否!'}],
  },
  {
    key: 'interest',
    title: '兴趣爱好',
    dataType: 'int',
    showType: 'checkbox',
    options: [{key: '1', value: '吃饭'}, {key: '2', value: '睡觉'}, {key: '3', value: '打豆豆'}],
    defaultValue: ['1', '2'],
    validator: [{type: 'array', required: true, message: '请至少选择一项兴趣'}],
    width: 120,  // 指定这一列的宽度
  },  

  {
    key: 'good',
    title: '优点',
    dataType: 'varchar',
    showType: 'multiSelect',
    options: [{key: 'lan', value: '懒'}, {key: 'zhai', value: '宅'}],
    validator: [{type: 'array', required: true, message: '请选择优点'}],
  },
  {
    key: 'pic1',
    title: '头像',
    dataType: 'varchar',
    showType: 'image',  // 后端必须提供图片上传接口
    showInTable: false,
  },
  {
    key: 'desc',
    title: '个人简介',
    dataType: 'varchar',
    showType: 'textarea',  // 用于编辑大段的文本
    showInTable: false,
    defaultValue: '个人简介个人简介个人简介',
    validator: [{type: 'string', max: 20, message: '最长20个字符'}],
  },
  {
    key: 'score',
    title: '分数',
    dataType: 'int',
    max: 99,
    min: 9,
  },
  {
    key: 'gpa',
    title: 'GPA',
    dataType: 'float',
    max: 9.9,
    placeholder: '哈哈',
    width: 50,
  },
  {
    key: 'birthday',
    title: '生日',
    // 对于日期类型要注意下, 在js端日期被表示为yyyy-MM-dd HH:mm:ss的字符串, 在java端日期被表示为java.util.Date对象
    // fastjson反序列化时可以自动识别
    // 序列化倒是不用特别配置, 看自己需求, fastjson会序列化为一个字符串, 前端原样展示
    dataType: 'datetime',
    // 对于datetime而言, 配置showType是无意义的
    placeholder: 'happy!',
  },  
  // 定义针对单条记录的操作
  // 常见的针对单条记录的自定义操作有哪些? 无非是更新和删除
  // 注意, 如果没有定义主键, 是不允许更新和删除的
  {
    // 这个key是我预先定义好的, 注意不要冲突
    key: 'singleRecordActions',
    title: '我是自定义操作',  // 列名
    width: 300,  // 宽度
    actions: [
      {
        name: '更新姓名',
        type: 'update',  // 更新单条记录
        keys: ['name'],  // 允许更新哪些字段, 如果不设置keys, 就允许更所有字段
      },
      {
        name: '更新分数和GPA',
        type: 'update',
        keys: ['score', 'gpa'],  // 弹出的modal中只会有这两个字段
      },
      {
        name: '更新生日',
        type: 'update',
        keys: ['birthday'],
        visible: (record) => record.id >= 1010,  // 所有action都可以定义visible函数, 返回false则对这行记录不显示这个操作
      },
      {
        name: '更新头像',
        type: 'update',
        keys: ['touxiang'],
      },
      {
        type: 'newLine',  // 换行, 纯粹用于排版的, 更美观一点
      },
      {
        type: 'newLine',
      },
      {
        name: '删除',
        type: 'delete',  // 删除单条记录
      },
      {
        type: 'newLine',
      },
      {
        type: 'newLine',
      },

    ],
  },
  
];
