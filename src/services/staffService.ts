import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy,
  onSnapshot
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { Staff } from "../types";

const COLLECTION_NAME = "staff";

export const staffService = {
  // Real-time listener for staff
  subscribeToStaff: (callback: (staff: Staff[]) => void) => {
    const q = query(collection(db, COLLECTION_NAME), orderBy("created_at", "desc"));
    return onSnapshot(q, (snapshot) => {
      const staff = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Staff[];
      callback(staff);
    });
  },

  // Create a new staff member
  createStaff: async (staffData: Partial<Staff>): Promise<string> => {
    const newStaff = {
      ...staffData,
      active: staffData.active ?? true,
      created_at: new Date().toISOString()
    };
    const docRef = await addDoc(collection(db, COLLECTION_NAME), newStaff);
    return docRef.id;
  },

  // Update a staff member
  updateStaff: async (id: string, updates: Partial<Staff>): Promise<void> => {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, updates);
  },

  // Delete a staff member
  deleteStaff: async (id: string): Promise<void> => {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  }
};
