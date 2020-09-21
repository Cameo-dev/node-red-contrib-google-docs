const { google } = require('googleapis');

module.exports = function exportFunc(RED) {
  function GoogleSlidesNode(config) {
    RED.nodes.createNode(this, config);
    this.admin = RED.nodes.getNode(config.admin);
    const auth = new google.auth.GoogleAuth({
      credentials: this.admin.serviceAccountKey,
      scopes: 'https://www.googleapis.com/auth/drive',
    });

    // Init SDK
    const slides = google.slides({
      version: 'v1',
      auth,
    });


    this.on('input', async (msg, send, done) => {
      const operation = msg.payload.operation || config.operation;
      const presentationId = msg.payload.fileId || config.fileId;
      if (!presentationId) done(new Error('You must provide a file ID'));

      try {
        const result = await ((op) => {
          switch (op) {
            case 'get':
              return slides.presentations.get({
                presentationId,
              });
            case 'batch':
              return slides.presentations.batchUpdate({
                presentationId,
                resource: {
                  requests: msg.payload.batch || {
                    [config.batch.method]: {
                      containsText: {
                        text: config.batch.text,
                        matchCase: config.batch.matchCase,
                      },
                      replaceText: config.batch.replaceText,
                    },
                  },
                },
              });
            default: throw new Error(`Unsupported operation ${op}`);
          }
        })(operation);
        msg.payload = result.data;
        this.send(msg);
      } catch (e) {
        if (done) done(e);
        else this.error(e, msg);
      }
    });
  }
  RED.nodes.registerType('google-slides', GoogleSlidesNode);
};
