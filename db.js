const DB_NAME    = 'expense_pwa_db';
const DB_VERSION = 1;
const STORE_NAME = 'entries';

function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = () => {
            const db = request.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror   = () => reject(request.error);
    });
}

async function getAllEntries() {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx      = db.transaction(STORE_NAME, 'readonly');
        const store   = tx.objectStore(STORE_NAME);
        const request = store.getAll();

        request.onsuccess = () => resolve(request.result);
        request.onerror   = () => reject(request.error);
    });
}

async function addEntry(entry) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx      = db.transaction(STORE_NAME, 'readwrite');
        const store   = tx.objectStore(STORE_NAME);
        const request = store.add(entry);

        request.onsuccess = () => resolve(request.result);
        request.onerror   = () => reject(request.error);
    });
}

async function deleteEntry(id) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx      = db.transaction(STORE_NAME, 'readwrite');
        const store   = tx.objectStore(STORE_NAME);
        const request = store.delete(id);

        request.onsuccess = () => resolve();
        request.onerror   = () => reject(request.error);
    });
}
