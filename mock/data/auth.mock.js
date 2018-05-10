const { Result } = require('ya-mock-server');

const token = {
  access_token: 'fake-token'
};

module.exports = {
  'POST /api/auth/login': ctx => {
    if (Math.random() > 0.8) {
      return new Result(null, 1, '用户名或密码错误');
    } else {
      return  token;
    }
  }
};
