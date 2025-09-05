// 测试学生信息管理系统
const studentSystem = require('./studentManagementSystem');

// 模拟内存中的学生数据
let students = [];

console.log('===== 学生信息管理系统测试 =====\n');

// 1. 添加学生测试
console.log('1. 测试添加学生:');
let result = studentSystem.addStudent('2024001', '张三', 20, '计算机科学');
console.log(result.message);

// 2. 查询学生测试
console.log('\n2. 测试查询学生:');
result = studentSystem.getStudentById('2024001');
if (result.success) {
  console.log('查询结果:');
  console.log(`学号: ${result.data.id}`);
  console.log(`姓名: ${result.data.name}`);
  console.log(`年龄: ${result.data.age}`);
  console.log(`专业: ${result.data.major}`);
} else {
  console.log(result.message);
}

// 3. 修改学生信息测试
console.log('\n3. 测试修改学生信息:');
result = studentSystem.updateStudent('2024001', 21, '软件工程');
if (result.success) {
  console.log(result.message);
  console.log('更新后的信息:');
  console.log(`学号: ${result.data.id}`);
  console.log(`姓名: ${result.data.name}`);
  console.log(`年龄: ${result.data.age}`);
  console.log(`专业: ${result.data.major}`);
} else {
  console.log(result.message);
}

// 4. 删除学生测试
console.log('\n4. 测试删除学生:');
result = studentSystem.deleteStudent('2024001');
if (result.success) {
  console.log(result.message);
  console.log('删除的学生信息:');
  console.log(`学号: ${result.data.id}`);
  console.log(`姓名: ${result.data.name}`);
  console.log(`年龄: ${result.data.age}`);
  console.log(`专业: ${result.data.major}`);
} else {
  console.log(result.message);
}

// 5. 尝试查询已删除的学生
console.log('\n5. 尝试查询已删除的学生:');
result = studentSystem.getStudentById('2024001');
console.log(result.message);

// 6. 测试边界情况
console.log('\n6. 测试边界情况:');

// 6.1 重复添加相同学号的学生
console.log('\n6.1 重复添加相同学号的学生:');
studentSystem.addStudent('2024002', '李四', 19, '数学');
result = studentSystem.addStudent('2024002', '王五', 22, '物理');
console.log(result.message);

// 6.2 修改不存在的学生
console.log('\n6.2 修改不存在的学生:');
result = studentSystem.updateStudent('999999', 23, '化学');
console.log(result.message);

// 6.3 删除不存在的学生
console.log('\n6.3 删除不存在的学生:');
result = studentSystem.deleteStudent('999999');
console.log(result.message);

// 6.4 输入无效的年龄
console.log('\n6.4 输入无效的年龄:');
result = studentSystem.addStudent('2024003', '赵六', 'abc', '英语');
console.log(result.message);

// 6.5 显示所有学生
console.log('\n6.5 显示所有学生:');
result = studentSystem.showAllStudents();
if (result.success) {
  console.log('当前系统中的学生信息:');
  result.data.forEach((student, index) => {
    console.log(`\n学生 ${index + 1}:`);
    console.log(`学号: ${student.id}`);
    console.log(`姓名: ${student.name}`);
    console.log(`年龄: ${student.age}`);
    console.log(`专业: ${student.major}`);
  });
} else {
  console.log(result.message);
}

console.log('\n===== 学生信息管理系统测试完成 =====');