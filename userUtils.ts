interface User {
    id: string;     //用户ID
    name: string;   //用户名        
    age: number;    //用户年龄
    email: string;  //用户邮箱
}
/**
 * 根据用户ID获取用户信息
 * @param id 用户ID
 * @param users 用户列表
 * @returns {User | undefined} 用户对象
 */
async function getUserById(id: string, users: User[]): Promise<User | undefined> {
    return users.find(user => user.id === id);
}
// 根据用户邮箱获取用户信息
function getUserByEmail(email: string, users: User[]): User | undefined {
    return users.find(user => user.email === email);
}
