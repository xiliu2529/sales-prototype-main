/**
 * 用于处理字符串或者数字 格式化
 */
const RenderUtils = {

  /**
   * 金额 千分符格式 无小数
   */
  thousandAmountFormat(amount: string) {
    if (amount.length <= 3) {
      return amount;
    }
    const clearValue = amount.replaceAll(',','');
    if (!/^(\+|-)?(\d+)(\.\d+)?$/.test(clearValue)) {
      return clearValue;
    }
    const a = RegExp.$1;
    let b = RegExp.$2;
    const c = RegExp.$3;
    // @ts-ignore
    const re = new RegExp();
    // @ts-ignore
    re.compile("(\\d)(\\d{3})(,|$)");
    while (re.test(b)) {
      b = b.replace(re, "$1,$2$3");
    }
    return `${a  }${  b  }${  c}`;
  },

  /**
   * 工数 千分符格式 可以有小数
   */
  thousandEffortFormat(effort: string) {
    const num = effort.replaceAll(',','').toString().split(".");  // 分隔小数点
    const arr=num[0].split("").reverse();  // 转换成字符数组并且倒序排列
    let res = [];
    for(let i=0,len=arr.length;i<len;i+=1){
      if(i%3===0&&i!==0){
        res.push(",");   // 添加分隔符
      }
      res.push(arr[i]);
    }
    res.reverse(); // 再次倒序成为正确的顺序
    if(num[1] !== undefined && num[1] !== null){  // 如果有小数的话添加小数部分
      // @ts-ignore
      res = res.join("").concat(`.${num[1]}`);
    }else{
      // @ts-ignore
      res=res.join("");
    }
    return res;
  },

};

export default RenderUtils;
