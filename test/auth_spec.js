const test = require('ava');
const helper = require('node-red-node-test-helper');
const authNode = require('../auth.js');

helper.init(require.resolve('node-red'));

test.beforeEach.cb((t) => {
  helper.startServer(t.end);
});

test.afterEach.cb((t) => {
  helper.unload();
  helper.stopServer(t.end);
});

test('should be loaded', async (t) => {
  const flow = [{
    id: 'n1', type: 'google auth', name: 'google-auth',
  }];
  await helper.load(authNode, flow, { n1: { serviceAccountKey: '{"a": "aaa"}' } });
  const n1 = helper.getNode('n1');
  t.assert(n1);
  t.is(n1.name, 'google-auth');
});
