import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

export async function uploadProfileImage(userId: string, file: File): Promise<string> {
  const storageRef = ref(storage, `profiles/${userId}/${Date.now()}_${file.name}`);
  const snapshot = await uploadBytes(storageRef, file);
  return getDownloadURL(snapshot.ref);
}

export async function uploadPageImage(pageId: string, file: File): Promise<string> {
  const storageRef = ref(storage, `pages/${pageId}/${Date.now()}_${file.name}`);
  const snapshot = await uploadBytes(storageRef, file);
  return getDownloadURL(snapshot.ref);
}
