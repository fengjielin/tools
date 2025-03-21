const fs = require('fs');
const path = require('path');
const Mock = require('mockjs'); // mockjs 导入依赖模块
const bodyParser = require('body-parser');

// 读取json文件
function getJsonFile(filePath) {
  console.log('\n[Mock] 正在读取文件:', filePath);
  try {
    // 每次请求时重新读取文件
    const json = fs.readFileSync(path.resolve(__dirname, filePath), 'utf-8');
    return JSON.parse(json);
  } catch (error) {
    console.error('[Mock] 读取文件失败:', error);
    return {
      code: 500,
      msg: '读取mock数据失败',
      data: null,
    };
  }
}

function checkToken(token) {
  console.log('\n[Mock] 正在验证token:', token);
  if (!token || token === 'null' || token === 'undefind') {
    console.log('[Mock] Token验证失败: token为空');
    return false;
  }
  let adminToken =
    'Bearer eyJhbGciOiJIUzUxMiJ9.eyJsb2dpbl91c2VyX2tleSI6IjY5ZjBjMDQ3LThkMjMtNDViOS1iMDkwLWNiMjU3Mzg2NzFjNSJ9.7jATd1EUxSszr7hZKsWKomoD7FSgge-_lws1y-o1hX8n4H1J_KWHewCKkIZGftiTNrP7fucsul8fnPzyluo7Xg';
  if (token === adminToken) {
    console.log('[Mock] Token验证成功');
    return true;
  }
  console.log('[Mock] Token验证失败: token无效');
  return false;
}

// 返回一个函数
module.exports = function (app) {
  if (process.env.MOCK == 'true') {
    console.log('\n[Mock] Mock服务已启动');
    app.use(bodyParser.json()); //数据JSON类型
    app.use(bodyParser.urlencoded({ extended: false }));

    const API_PREFIX = '/dev-api';

    // 监听http请求

    // 获取验证码
    app.get(API_PREFIX + '/captchaImage', function (req, res) {
      console.log('\n[Mock] 收到获取验证码请求');
      let json = getJsonFile('./captchaImage.json');
      res.json(Mock.mock(json));
    });

    // 登录
    app.post(API_PREFIX + '/login', function (req, res) {
      console.log('\n[Mock] 收到登录请求');
      console.log('[Mock] 请求体:', req.body);
      // 每次响应请求时读取mock data的json文件

      let username = req.body.username;
      let password = req.body.password;

      let json = '';
      if (username === 'admin' && password === 'admin123') {
        console.log('[Mock] 管理员登录成功');
        // getJsonFile方法定义了如何读取json文件并解析成数据对象
        json = getJsonFile('./login.json');
      } else {
        console.log('[Mock] 登录失败：用户名或密码错误');
        json = getJsonFile('./error.json');
      }

      // 将json传入 Mock.mock 方法中，生成的数据返回给浏览器
      res.json(Mock.mock(json));
    });

    // 获取用户信息
    app.get(API_PREFIX + '/getInfo', function (req, res) {
      console.log('\n[Mock] 收到获取用户信息请求');
      console.log('[Mock] 请求体:', req.body);
      // 每次响应请求时读取mock data的json文件

      let token = req.headers.authorization;
      if (!checkToken(token)) {
        let errorJson = getJsonFile('./tokenerror.json');
        res.json(Mock.mock(errorJson));
        return;
      }
      let json = getJsonFile('./userInfo1.json');
      res.json(Mock.mock(json));
    });

    // 获取路由
    app.get(API_PREFIX + '/getRouters', function (req, res) {
      console.log('\n[Mock] 收到获取路由请求');
      console.log('[Mock] 请求体:', req.body);
      // 每次响应请求时读取mock data的json文件

      let token = req.headers.authorization;
      if (!checkToken(token)) {
        let errorJson = getJsonFile('./tokenerror.json');
        res.json(Mock.mock(errorJson));
        return;
      }
      let json = getJsonFile('./routers.json');
      res.json(Mock.mock(json));
    });

    app.get(API_PREFIX + '/users', function (req, res) {
      console.log('\n[Mock] 收到获取用户列表请求');
      console.log('[Mock] 请求头:', req.headers);

      let token = req.headers.authorization;
      if (!checkToken(token)) {
        let errorJson = getJsonFile('./tokenerror.json');
        res.json(Mock.mock(errorJson));
        return;
      }
      let json = getJsonFile('./userlist.json');
      console.log('[Mock] 返回用户列表数据');
      res.json(Mock.mock(json));
    });

    app.delete(API_PREFIX + '/users/:id', function (req, res) {
      console.log('\n[Mock] 收到删除用户请求');
      console.log('[Mock] 删除用户ID:', req.params.id);
      let json = getJsonFile('./success.json');
      res.json(Mock.mock(json));
    });

    app.get(API_PREFIX + '/goods', function (req, res) {
      console.log('\n[Mock] 收到获取商品列表请求');
      let json = getJsonFile('./goods.json');
      console.log('[Mock] 返回商品列表数据');
      res.json(Mock.mock(json));
    });

    app.delete(API_PREFIX + '/goods/:id', function (req, res) {
      console.log('\n[Mock] 收到删除商品请求');
      console.log('[Mock] 删除商品ID:', req.params.id);
      let json = getJsonFile('./success.json');
      res.json(Mock.mock(json));
    });

    app.get(API_PREFIX + '/roles', function (req, res) {
      console.log('\n[Mock] 收到获取角色列表请求');
      let json = getJsonFile('./roles.json');
      console.log('[Mock] 返回角色列表数据');
      res.json(Mock.mock(json));
    });

    app.delete(API_PREFIX + '/roles/:id', function (req, res) {
      console.log('\n[Mock] 收到删除角色请求');
      console.log('[Mock] 删除角色ID:', req.params.id);
      let json = getJsonFile('./success.json');
      res.json(Mock.mock(json));
    });
  } else {
    console.log('\n[Mock] Mock服务未启动，因为 MOCK 环境变量不为 true');
  }
};
