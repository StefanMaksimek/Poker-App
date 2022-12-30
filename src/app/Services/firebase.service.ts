import { Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  docData,
  Firestore,
  setDoc,
} from '@angular/fire/firestore';
import { doc } from '@firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  constructor(private fire: Firestore) {}

  getCollData(collPath: string) {
    return collectionData(this.setRef(collPath));
  }

  /**
   *
   * @param collPath A slash-separated path to a collection.
   * @param docPath A slash-separated path to a document.
   * @returns
   */
  getDocData(collPath: string, docPath: string) {
    return docData(doc(this.setRef(collPath), docPath));
  }

  /**
   *
   * @param collPath A slash-separated path to a collection.
   * @param docPath A slash-separated path to a document.
   * @param upData A map of the fields and values for the UPDATED document.
   */
  updateDocData(collPath: string, docPath: string, upData: object) {
    setDoc(doc(this.setRef(collPath), docPath), upData);
  }

  /**
   *
   * @param ref A slash-separated path to a collection.
   * @returns The CollectionReference instance.
   */
  setRef(ref: string) {
    return collection(this.fire, ref);
  }
}
