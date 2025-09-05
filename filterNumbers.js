// 从数组中筛选出大于10的数字
function filterNumbersGreaterThanTen(arr) {
  // 使用filter方法筛选出大于10的数字
  return arr.filter(num => num > 10);
}

// 示例数组
const numbersArray = [5, 12, 8, 15, 3, 20];

// 调用函数筛选数字
const filteredNumbers = filterNumbersGreaterThanTen(numbersArray);

// 注意：根据代码规范，已移除console.log输出