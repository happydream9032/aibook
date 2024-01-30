import { openDB } from 'idb';

// Function to save a file to IndexedDB
export async function saveFileToIndexedDB(file : any) {
  // Open the database
  const db = await openDB('myDatabase', 1, {
    upgrade(db) {
      db.createObjectStore('files');
    },
  });

  // Create a new transaction and access the object store
  const tx = db.transaction('files', 'readwrite');
  const store = tx.objectStore('files');

  // Convert the file to a Blob object
  const blob = new Blob([file]);

  // Create a new file object with metadata
  const fileObject = {
    name: file.name,
    type: file.type,
    data: blob,
  };
  console.log("store file is = ", fileObject);

  // Add the file object to the object store
  await store.add(fileObject);

  // Close the transaction and the database
  tx.done;
  db.close();
}

export async function getFileFromIndexedDB(fileName : string) {
  // Open the database
  const db = await openDB('myDatabase', 1);

  // Create a new transaction and access the object store
  const tx = db.transaction('files', 'readonly');
  const store = tx.objectStore('files');

  // Get the file object by its name
  const fileObject = await store.get(fileName);

  // Close the transaction and the database
  tx.done;
  db.close();

  // Return the file object data (Blob object)
  return fileObject.data;
}