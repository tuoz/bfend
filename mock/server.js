require('dotenv').config();

const path = require('path');
const { MockServer } = require('ya-mock-server');

const SERVER = process.env.APP_MOCK_SERVER;

const mockServer = new MockServer(SERVER, path.join(__dirname, 'data', '*.mock.js'));
mockServer.start();
