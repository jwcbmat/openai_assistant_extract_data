import datawarehouse from '../datawarehouse';
import { CollectionReference, DocumentData } from 'firebase-admin/firestore';

interface OperatorbyCNPJ {
  operator: string
  name: string
}

const operatorMap: Record<string, string> = {
 '12345678': 'assistant_00',
};

export default class FirebaseService {
  private storeCollection: CollectionReference<DocumentData>;

  constructor() {
    this.storeCollection = datawarehouse.db.collection('stores');
  }

  async getOperatorByCNPJ(cnpj: string): Promise<OperatorbyCNPJ | null> {
    const cnpjNumbers = cnpj.replace(/\D/g, '');
    const prefix = cnpjNumbers.slice(0, 8);

    const querySnapshot = await this.storeCollection.doc(cnpjNumbers).get();
    if (!querySnapshot.exists) return null;

    return {
      operator: operatorMap[prefix] || 'default',
      name: querySnapshot.data()?.name
    };
  }
}

