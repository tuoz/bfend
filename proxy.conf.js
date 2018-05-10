require('dotenv').config();

const MOCK = JSON.parse(process.env.APP_MOCK_DATA) || false;

const SERVER = MOCK ? process.env.APP_MOCK_SERVER : process.env.APP_PROXY_SERVER;

module.exports = {
  '/api': {
    target: SERVER,
    changeOrigin: true,
    secure: false
  },
  '/uploads/ueditor': {
    target: SERVER,
    changeOrigin: true,
    secure: false
  }
};
