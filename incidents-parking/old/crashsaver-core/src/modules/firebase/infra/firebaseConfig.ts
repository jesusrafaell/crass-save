import * as admin from "firebase-admin";
import serviceAccount from "./serviceAccount/service-crashsaver-firabase.json";

const adminApp: admin.app.App = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

export default adminApp;
