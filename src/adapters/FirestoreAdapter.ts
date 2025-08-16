import { db } from "@/firebase"
import type { DataStoreAdapter } from "./DataStoreAdapter"
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  writeBatch,
} from "firebase/firestore"

export class FirestoreAdapter<T extends { id: string }> implements DataStoreAdapter<T> {
  constructor(
    private collectionName: string,
    private uid: string,
  ) {}

  async get(id: string): Promise<T | null> {
    const docRef = doc(db, "users", this.uid, this.collectionName, id)
    const docSnap = await getDoc(docRef)
    if (!docSnap.exists()) return null
    return { ...(docSnap.data() as T), id: docSnap.id }
  }

  async getAll(): Promise<T[]> {
    const querySnapshot = await getDocs(collection(db, "users", this.uid, this.collectionName))
    return querySnapshot.docs.map((docSnap) => ({
      ...(docSnap.data() as T),
      id: docSnap.id,
    }))
  }

  async create(itemBody: Omit<T, "id">): Promise<string> {
    const docRef = await addDoc(collection(db, "users", this.uid, this.collectionName), itemBody)
    return docRef.id
  }

  async update(item: T): Promise<void> {
    const docRef = doc(db, "users", this.uid, this.collectionName, item.id)
    const docSnap = await getDoc(docRef)
    if (!docSnap.exists()) throw new Error(`Item ${item.id} not found`)
    await setDoc(docRef, item)
  }

  async updateAll(items: T[]): Promise<void> {
    const batch = writeBatch(db)
    items.forEach((item) => {
      const docRef = doc(db, "users", this.uid, this.collectionName, item.id)
      batch.set(docRef, item)
    })
    await batch.commit()
  }

  async delete(id: string): Promise<void> {
    const docRef = doc(db, "users", this.uid, this.collectionName, id)
    await deleteDoc(docRef)
  }

  async restoreAll(items: T[]): Promise<void> {
    const colRef = collection(db, "users", this.uid, this.collectionName)
    const snapshot = await getDocs(colRef)
    const batch = writeBatch(db)

    snapshot.docs.forEach((docSnap) => batch.delete(docSnap.ref))
    items.forEach((item) => {
      const docRef = doc(db, "users", this.uid, this.collectionName, item.id)
      batch.set(docRef, item)
    })

    await batch.commit()
  }
}
