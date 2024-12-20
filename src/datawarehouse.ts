import * as admin from 'firebase-admin';
import { resolve } from 'path';

class Datawarehouse {
  public db: admin.firestore.Firestore;

  constructor() {
    admin.initializeApp({
      credential: admin.credential.cert(resolve(process.cwd(), './dev.json')) 
    });

    this.db = admin.firestore();
  }
}

export default new Datawarehouse();

