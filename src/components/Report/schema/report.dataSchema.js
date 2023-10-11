// 定义某个表的dataSchema, 结构跟querySchema很相似, 见下面的例子
// 注意: 所有的key不能重复
// 这个配置不只决定了table的schema, 也包括用于新增/删除的表单的schema

module.exports = [
  {
    key: '0',
    render: (value, row, index) => {
      const obj = {
        children: value,
        props: {},
      };
      if (index % 2 === 0) {
        obj.props.rowSpan = 2;
      }
      // These two are merged into above cell
      if (index % 2 === 1) {
        obj.props.rowSpan = 0;
      }
      return obj;
    },
  },
];
