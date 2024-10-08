const admin = require('firebase-admin');
const serviceAccount = require('./smart-waste-management-s-1e6bf-firebase-adminsdk-zv8u7-674e344bfe.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
module.exports = { db };
