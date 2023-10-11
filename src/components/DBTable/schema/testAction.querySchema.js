// 定义某个表的querySchema
// schema的结构和含义参考下面的例子
// 注意: 所有的key不能重复

module.exports = [
  {
    key: 'id',  // 传递给后端的字段名
    title: 'ID',  // 前端显示的名称
    dataType: 'int',
  },
  {
    key: 'haha',
    title: '测试',
    dataType: 'varchar',
  },
  {
    key: 'type',
    title: '类型',
    dataType: 'int',
    showType: 'select',
    options: [{key: '1', value: '类型1'}, {key: '2', value: '类型2'}],
    defaultValue: '1',
  },
  {
    key: 'type',
    title: 'AAA',
    dataType: 'int',
    showType: 'select',
    options: [{key: '1', value: '类型1'}, {key: '2', value: '类型2'}],
    defaultValue: '1',
  },
  {
    key: 'content',
    title: '内容',
    dataType: 'varchar',
  },
  {
    key: 'phoneModel',
    title: '手机型号',
    dataType: 'varchar',
  },
  {
    key: 'experience',
    title: '使用经验',
    dataType: 'varchar',
  },
  {
    key: 'frequency',
    title: '使用频率',
    dataType: 'varchar',
  },
  {
    key: 'isNative',
    title: '是否母语',
    dataType: 'varchar',
    showType: 'radio',
    options: [{key: 'yes', value: '是'}, {key: 'no', value: '否'}],
  },  
  {
    key: 'location',
    title: '地理位置',
    dataType: 'varchar',  // 一般而言dataType是字符串, 但也可以是数字
    showType: 'cascader',
    defaultValue: ['zhejiang', 'hangzhou', 'xihu'],
    options: [{
      value: 'zhejiang',   // option的value必须是字符串, 和select类似
      label: '浙江',
      children: [{
        value: 'hangzhou',
        label: '杭州',
        children: [{
          value: 'xihu',
          label: '西湖',
        }],
      }],
    }, {
      value: 'yuzhou',
      label: '宇宙中心',
      children: [{
        value: 'wudaokou',
        label: '五道口',
      }],
    }],
  },  
  {
    key: 'work',
    title: '工作年限',
    dataType: 'int',
    min: 3,
  },
  {
    key: 'duoxuan3',
    title: '多选3',
    dataType: 'varchar',
    showType: 'multiSelect',
    options: [{key: 'K', value: '开'}, {key: 'F', value: '封'}, {key: 'C', value: '菜'}],
    defaultValue: ['K', 'F', 'C'],
  },
  {
    key: 'xxbirthday',
    title: 'XX日期',
    dataType: 'datetime',  // 日期等值查询
  },  
  {
    key: 'score',
    title: '分数',
    dataType: 'int',
    showType: 'between',  // 整数范围查询, 对于范围查询, 会自动生成xxBegin/xxEnd两个key传递给后端
    defaultValueBegin: 9,  // 对于between类型不搞max/min了, 太繁琐
    defaultValueEnd: 99,
  },
  {
    key: 'gpa',
    title: 'GPA',
    dataType: 'float',
    showType: 'between',  // 小数也可以范围查询, 固定两位小数
    placeholderBegin: '哈哈',  // 对于范围查询, 可以定义placeholderBegin和placeholderBegin, 用于两个框的提示语
    placeholderEnd: '切克闹',  // 如果不定义, 对于int/float的范围查询, 提示语是"最小值"/"最大值", 对于日期的范围查询, 提示语是"开始日期"/"结束日期"
    defaultValueEnd: 99.9,
  },
  {
    key: 'height',
    title: '身高(cm)',
    placeholder: '哈哈哈',
    dataType: 'float',  // 小数等值查询
  },
  {
    key: 'duoxuan1',
    title: '多选1',
    dataType: 'int',  // 跟select一样, 这里的值其实也可以是int/float/varchar/datetime
    showType: 'checkbox',  // checkbox
    options: [{key: '1', value: '类型1'}, {key: '2', value: '类型2'}],  // 同样注意, option的key必须是字符串
    defaultValue: ['1', '2'], // 多选的defaultValue是个数组
  },
  {
    key: 'duoxuan2',
    title: '多选2',
    dataType: 'varchar',
    showType: 'multiSelect',  // 另一种多选
    options: [{key: 'type1', value: '类型1'}, {key: 'type2', value: '类型2'}],
    defaultValue: ['type1'],
  },  
  {
    key: 'blog',
    title: 'BLOG',
    placeholder: '请输入网址',
    dataType: 'varchar',
    showType: 'normal',
    addonBefore: 'http://',  // 这个前置和后置标签的值不能被传到后端, 其实作用很有限, 也就是美观点而已, antd官方的例子中还有用select做addon的, 感觉也没啥大用...
    addonAfter: '.me',
    defaultValue: 'jxy',
  },
  {
    key: 'age',
    title: '年龄',
    placeholder: '请输入年龄',
    dataType: 'int',
    defaultValue: 18,
    // 对于数字类型(int/float), 可以配置max/min
    min: 0,
    max: 99,
  },
  {
    key: 'weight',
    title: '体重(kg)',
    dataType: 'float',  // 小数会统一保留2位
    defaultValue: 50.1,
    min: 0,
    max: 99.9,
  },
  {
    key: 'type',
    title: '类型',
    dataType: 'int',
    showType: 'select',  // 下拉框选择, antd版本升级后, option的key要求必须是string, 否则会有个warning, 后端反序列化时要注意
    options: [{key: '1', value: '类型1'}, {key: '2', value: '类型2'}],
    defaultValue: '1', // 这个defaultValue必须和options中的key是对应的
  },
  {
    key: 'userType',
    title: '用户类型',
    dataType: 'varchar',   // 理论上来说, 这里的dataType可以是int/float/varchar甚至datetime, 反正对前端而言都是字符串, 只是后端反序列化时有区别
    showType: 'radio',  // 单选框, 和下拉框schema是一样的, 只是显示时有差别
    options: [{key: 'typeA', value: '类型A'}, {key: 'typeB', value: '类型B'}],
    defaultValue: 'typeB',
  },  
];
