const test = require('ava');
const helper = require('node-red-node-test-helper');
const slidesNode = require('../slides');
const authNode = require('../auth');

helper.init(require.resolve('node-red'));

test.beforeEach.cb((t) => {
  helper.startServer(t.end);
});

test.afterEach.cb((t) => {
  helper.unload();
  helper.stopServer(t.end);
});

test('should be loaded', async (t) => {
  const flow = [
    {
      id: 'n1', type: 'google-slides', name: 'google-slides', admin: 'n2',
    },
    {
      id: 'n2', type: 'google auth', name: 'google-auth', credentials: { serviceAccountKey: '{"a": "aaa"}' },
    },
  ];
  await helper.load([authNode, slidesNode], flow, { n2: { serviceAccountKey: '{"a": "aaa"}' } });
  const n1 = helper.getNode('n1');
  t.assert(n1);
  t.is(n1.name, 'google-slides');
});
