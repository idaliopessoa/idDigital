
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { DocumentData } from '../types';

const DOCUMENTS_COLLECTION = 'documents';

/**
 * A centralized handler for Firestore errors.
 * It logs the error and returns a user-friendly Error object.
 * @param error The original error object from Firebase.
 * @param context A string describing the operation that failed (e.g., "checking document").
 * @returns A new Error with a user-friendly message.
 */
const handleFirebaseError = (error: any, context: string): Error => {
    console.error(`DB: Error ${context}:`, error);
    if (error.code === 'unavailable') {
        return new Error("Could not connect to the database. Please check your internet connection and try again.");
    }
    return new Error(`An error occurred while communicating with the database (${context}).`);
};

/**
 * Checks if a document with the given ID exists in Firestore.
 * @param documentId The ID of the document to check.
 * @returns A boolean indicating if the document exists.
 */
export const checkDocumentExists = async (documentId: string): Promise<boolean> => {
  console.log(`DB: Checking for document with ID: ${documentId}`);
  try {
    const docRef = doc(db, DOCUMENTS_COLLECTION, documentId);
    const docSnap = await getDoc(docRef);
    const exists = docSnap.exists();
    console.log(`DB: Document with ID ${documentId} ${exists ? 'exists' : 'does not exist'}.`);
    return exists;
  } catch (error) {
    throw handleFirebaseError(error, `checking existence for doc ID ${documentId}`);
  }
};

/**
 * Retrieves a document from Firestore.
 * @param documentId The ID of the document to retrieve.
 * @returns The document data or null if it doesn't exist.
 */
export const getDocument = async (documentId: string): Promise<DocumentData | null> => {
  console.log(`DB: Getting document with ID: ${documentId}`);
  try {
    const docRef = doc(db, DOCUMENTS_COLLECTION, documentId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log(`DB: Successfully retrieved document ${documentId}.`);
      return docSnap.data() as DocumentData;
    }
    console.log(`DB: Document ${documentId} not found in Firestore.`);
    return null;
  } catch (error) {
    throw handleFirebaseError(error, `getting document data for doc ID ${documentId}`);
  }
};

/**
 * Saves or updates a document in Firestore.
 * @param documentId The ID of the document to save.
 * @param data The data to be saved.
 */
export const saveDocument = async (documentId: string, data: Omit<DocumentData, 'createdAt'>): Promise<void> => {
  console.log(`DB: Saving document with ID: ${documentId}`);
  try {
    const docRef = doc(db, DOCUMENTS_COLLECTION, documentId);
    const dataToSave = {
      ...data,
      createdAt: serverTimestamp()
    };
    await setDoc(docRef, dataToSave);
    console.log(`DB: Successfully saved document ${documentId}.`);
  } catch (error) {
    throw handleFirebaseError(error, `saving document for doc ID ${documentId}`);
  }
};