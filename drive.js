const { google } = require('googleapis');

const mimeType = {
  slides: 'application/vnd.google-apps.presentation',
  spreadsheet: 'application/vnd.google-apps.spreadsheet',
  form: 'application/vnd.google-apps.form',
  folder: 'application/vnd.google-apps.folder',
  file: 'application/vnd.google-apps.file',
  drawing: 'application/vnd.google-apps.drawing',
  document: 'application/vnd.google-apps.document',
};

module.exports = function exportFunc(RED) {
  function GoogleDriveNode(config) {
    RED.nodes.createNode(this, config);
    this.admin = RED.nodes.getNode(config.admin);
    const auth = new google.auth.GoogleAuth({
      credentials: this.admin.serviceAccountKey,
      scopes: 'https://www.googleapis.com/auth/drive',
    });
    const drive = google.drive({
      version: 'v3',
      auth,
    });

    this.on('input', async (msg, send, done) => {
      const operation = msg.payload.operation || config.operation;
      const fileId = msg.payload.fileId || config.fileId;
      const supportsAllDrives = msg.payload.allDrives || config.allDrives;

      try {
        const result = await ((op) => {
          switch (op) {
            case 'get':
              return drive.files.get({
                fileId,
                supportsAllDrives,
              });
            case 'copy':
              return drive.files.copy({
                fileId,
                supportsAllDrives,
                requestBody: {
                  name: msg.payload.targetName || config.targetName,
                  mimeType: mimeType[msg.payload.mime || config.mime],
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
  RED.nodes.registerType('google-drive', GoogleDriveNode);
};
