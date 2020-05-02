module.exports = function (RED) {
  function GoogleAuthConfig(n) {
    RED.nodes.createNode(this, n);

    if (!this.credentials.serviceAccountKey) throw 'Service account key is missing';

    try {
      this.serviceAccountKey = JSON.parse(this.credentials.serviceAccountKey);
    } catch (e) {
      throw 'Bad service account json';
    }
  }

  RED.nodes.registerType('google auth', GoogleAuthConfig, {
    credentials: {
      serviceAccountKey: { type: 'text' },
    },
  });
};
