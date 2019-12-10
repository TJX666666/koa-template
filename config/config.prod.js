/*
 * @Description: 线上环境配置
 * @Author: chenzhen
 * @Date: 2019-11-28 12:30:35
 * @LastEditTime: 2019-12-10 11:08:25
 * @LastEditors: chenzhen
 */

const dbConfig = {
    // 数据库
    MYSQL_DATABASE: 'koa_template',
    MYSQL_HOST: 'localhost',
    MYSQL_PORT: 3306,
    MYSQL_USERNAME: 'root',
    MYSQL_PASSWORD: '123456',
    MYSQL_DIALECT: 'mysql',
    MYSQL_POOL: {
        max: 200,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
    
}



const configProd = {
    ...dbConfig
} 


module.exports = configProd
