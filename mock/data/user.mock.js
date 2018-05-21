const { Result } = require('ya-mock-server');

function randomName(length = 5) {
  const t = 'qwertyuiopasdfghjklzxcvbnm1234567890';
  const r = [];
  for (let i = 0; i < length; i++) {
    r.push(t[Math.round(Math.random() * (t.length - 1))]);
  }

  return 'user-' + r.join('');
}

module.exports = {
  'GET /api/user/:id': ctx => ({
    id: ctx.req.params.id,
    name: `user-with-id-${ctx.req.params.id}`,
    age: 20 + Math.round(Math.random() * 10),
    address: '重庆'
  }),

  'GET /api/user': ctx => {
    const size = ctx.query.page_size || 20;
    const total = 150;
    const page = Math.min(10, Math.max(1, ctx.query.page || 1));
    const data = [];

    for (let i = 0; i < size; i++) {
      data.push({
        id: i,
        name: `${randomName()}-${page}`,
        age: 20 + Math.round(Math.random() * 10),
        address: '重庆'
      });
    }

    return {
      data,
      meta: {
        current_page: page,
        total
      }
    }
  }
};
