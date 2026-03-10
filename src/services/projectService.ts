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
import { Project, ProjectStatus } from "../types";

const COLLECTION_NAME = "projects";

export const projectService = {
  // Real-time listener for projects
  subscribeToProjects: (callback: (projects: Project[]) => void) => {
    const q = query(collection(db, COLLECTION_NAME), orderBy("created_at", "desc"));
    return onSnapshot(q, (snapshot) => {
      const projects = snapshot.docs.map(doc => ({
        id: doc.id as any, // Firebase IDs are strings, but current types use number. We'll handle this.
        ...doc.data()
      })) as Project[];
      callback(projects);
    });
  },

  // Get all projects once
  getProjects: async (): Promise<Project[]> => {
    const q = query(collection(db, COLLECTION_NAME), orderBy("created_at", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id as any,
      ...doc.data()
    })) as Project[];
  },

  // Create a new project
  createProject: async (projectData: Partial<Project>): Promise<string> => {
    const tracking_number = `SUB-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const newProject = {
      ...projectData,
      tracking_number,
      status: projectData.status || 'Design',
      created_at: new Date().toISOString()
    };
    const docRef = await addDoc(collection(db, COLLECTION_NAME), newProject);
    return docRef.id;
  },

  // Update a project
  updateProject: async (id: string | number, updates: Partial<Project>): Promise<void> => {
    const docRef = doc(db, COLLECTION_NAME, id.toString());
    await updateDoc(docRef, updates);
  },

  // Delete a project
  deleteProject: async (id: string | number): Promise<void> => {
    const docRef = doc(db, COLLECTION_NAME, id.toString());
    await deleteDoc(docRef);
  }
};
