// 学生信息管理系统
const readline = require('readline');

// 定义学生接口
class Student {
  constructor(id, name, age, major) {
    this.id = id; // 学号
    this.name = name; // 姓名
    this.age = age; // 年龄
    this.major = major; // 专业
  }
}

// 内存数组存储学生信息
const students = [];

// 添加学生
function addStudent(id, name, age, major) {
  // 检查学号是否已存在
  const existingStudent = students.find(student => student.id === id);
  if (existingStudent) {
    return { success: false, message: `学号 ${id} 已存在，请使用其他学号。` };
  }
  
  // 增强的输入验证
  function validateStudentInput(id, name, age, major) {
      if (!id || !name || !major) {
          return '所有字段都必须填写';
      }
      if (isNaN(age) || age < 1 || age > 120) {
          return '年龄必须是1-120之间的数字';
      }
      return null;
  }
  
  // 创建新学生并添加到数组
  const newStudent = new Student(id, name, parseInt(age), major);
  students.push(newStudent);
  return { success: true, message: `学生 ${name} 添加成功。` };
}

// 根据学号查询学生
function getStudentById(id) {
  const student = students.find(student => student.id === id);
  if (!student) {
    return { success: false, message: `未找到学号为 ${id} 的学生。` };
  }
  return { success: true, data: student };
}

// 根据学号修改学生信息
function updateStudent(id, age, major) {
  const studentIndex = students.findIndex(student => student.id === id);
  if (studentIndex === -1) {
    return { success: false, message: `未找到学号为 ${id} 的学生。` };
  }
  
  // 验证年龄是否为数字
  if (age && (isNaN(age) || age <= 0)) {
    return { success: false, message: '年龄必须是正整数。' };
  }
  
  // 更新学生信息
  if (age) students[studentIndex].age = parseInt(age);
  if (major) students[studentIndex].major = major;
  
  return { 
    success: true, 
    message: `学号为 ${id} 的学生信息已更新。`,
    data: students[studentIndex]
  };
}

// 根据学号删除学生
function deleteStudent(id) {
  const studentIndex = students.findIndex(student => student.id === id);
  if (studentIndex === -1) {
    return { success: false, message: `未找到学号为 ${id} 的学生。` };
  }
  
  const deletedStudent = students.splice(studentIndex, 1);
  return { 
    success: true, 
    message: `学号为 ${id} 的学生已删除。`,
    data: deletedStudent[0]
  };
}

// 显示所有学生
function showAllStudents() {
  if (students.length === 0) {
    return { success: false, message: '当前没有学生信息。' };
  }
  return { success: true, data: students };
}

// 命令行界面
function startCLI() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  function displayMenu() {
    console.log('\n===== 学生信息管理系统 =====');
    console.log('1. 添加学生');
    console.log('2. 查询学生(按学号)');
    console.log('3. 修改学生信息(按学号)');
    console.log('4. 删除学生(按学号)');
    console.log('5. 显示所有学生');
    console.log('6. 退出系统');
    console.log('=========================');
    rl.question('请选择操作(1-6): ', handleMenuChoice);
  }

  function handleMenuChoice(choice) {
    switch (choice) {
      case '1':
        addStudentPrompt();
        break;
      case '2':
        queryStudentPrompt();
        break;
      case '3':
        updateStudentPrompt();
        break;
      case '4':
        deleteStudentPrompt();
        break;
      case '5':
        showAllStudentsList();
        break;
      case '6':
        console.log('谢谢使用，再见！');
        rl.close();
        break;
      default:
        console.log('无效的选择，请重新输入。');
        displayMenu();
    }
  }

  function addStudentPrompt() {
    rl.question('请输入学号: ', id => {
      rl.question('请输入姓名: ', name => {
        rl.question('请输入年龄: ', age => {
          rl.question('请输入专业: ', major => {
            const result = addStudent(id, name, age, major);
            console.log(result.message);
            displayMenu();
          });
        });
      });
    });
  }

  function queryStudentPrompt() {
    rl.question('请输入要查询的学号: ', id => {
      const result = getStudentById(id);
      if (result.success) {
        console.log('查询结果:');
        console.log(`学号: ${result.data.id}`);
        console.log(`姓名: ${result.data.name}`);
        console.log(`年龄: ${result.data.age}`);
        console.log(`专业: ${result.data.major}`);
      } else {
        console.log(result.message);
      }
      displayMenu();
    });
  }

  function updateStudentPrompt() {
    rl.question('请输入要修改的学生学号: ', id => {
      // 先检查学生是否存在
      const checkResult = getStudentById(id);
      if (!checkResult.success) {
        console.log(checkResult.message);
        displayMenu();
        return;
      }
      
      console.log(`当前信息 - 姓名: ${checkResult.data.name}, 年龄: ${checkResult.data.age}, 专业: ${checkResult.data.major}`);
      
      rl.question('请输入新年龄(直接回车不修改): ', age => {
        rl.question('请输入新专业(直接回车不修改): ', major => {
          const result = updateStudent(id, age, major);
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
          displayMenu();
        });
      });
    });
  }

  function deleteStudentPrompt() {
    rl.question('请输入要删除的学生学号: ', id => {
      const result = deleteStudent(id);
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
      displayMenu();
    });
  }

  function showAllStudentsList() {
    const result = showAllStudents();
    if (result.success) {
      console.log('所有学生信息:');
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
    displayMenu();
  }

  // 启动系统
  console.log('欢迎使用学生信息管理系统！');
  displayMenu();
}

// 导出函数（用于测试或模块引用）
module.exports = {
  addStudent,
  getStudentById,
  updateStudent,
  deleteStudent,
  showAllStudents,
  startCLI
};

// 如果直接运行此文件，则启动CLI
if (require.main === module) {
  startCLI();
}