const DB_NAME = 'expense_pwa_db';
const DB_VERSION = 1;
const STORE_NAME = 'entries';

function openDB() {
    return new Promise((res, rej) => {
        const req = indexedDB.open(DB_NAME, DB_VERSION);
        req.onupgradeneeded = () => {
            const db = req.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
            }
        };
        req.onsuccess = () => res(req.result);
        req.onerror = () => rej(req.error);
    });
}

async function getAllEntries() {
    const db = await openDB();
    return new Promise((res, rej) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.getAll();
        req.onsuccess = () => res(req.result);
        req.onerror = () => rej(req.error);
    });
}

async function addEntry(entry) {
    const db = await openDB();
    return new Promise((res, rej) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.add(entry);
        req.onsuccess = () => res(req.result);
        req.onerror = () => rej(req.error);
    });
}

async function deleteEntry(id) {
    const db = await openDB();
    return new Promise((res, rej) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.delete(id);
        req.onsuccess = () => res();
        req.onerror = () => rej(req.error);
    });
}
