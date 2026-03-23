class DBHandler {
    constructor() {
        this.db = null;
    }

    init() {
        return new Promise((resolve, reject) => {
            const dbRequest = indexedDB.open("LandCalculator", 1);

            dbRequest.onupgradeneeded = (event) => {
                const db = event.target.result;
                db.createObjectStore("CalculationHistory", { keyPath: "id", autoIncrement: true });
            };

            dbRequest.onsuccess = (event) => {
                this.db = event.target.result;
                resolve(this);
            };

            dbRequest.onerror = () => {
                reject("Error opening DB");
            };
        });
    }

    setHistory(obj) {
        return new Promise((resolve, reject) => {
            const ts = this.db.transaction("CalculationHistory", "readwrite");
            const store = ts.objectStore("CalculationHistory");
            const addReq = store.add(obj);
            addReq.onsuccess = () => resolve("History Added");
            addReq.onerror = () => reject("Failed to Add");
        });
    }

    getHistory() {
        return new Promise((resolve, reject) => {
            const ts = this.db.transaction("CalculationHistory", "readonly");
            const store = ts.objectStore("CalculationHistory");
            const getReq = store.getAll();
            getReq.onsuccess = () => resolve(addReq.result);
            getReq.onerror = () => reject("Failed to Get");
        });
    }

    deleteHistory(id) {
        return new Promise((resolve, reject) => {
            const ts = this.db.transaction("CalculationHistory", "readwrite");
            const store = ts.objectStore("CalculationHistory");
            const deleteReq = store.delete(id);
            deleteReq.onsuccess = () => resolve("Deleted successfully");
            deleteReq.onerror = () => reject("Delete failed");
        });
    }

    clearHistory() {
        return new Promise((resolve, reject) => {
            const ts = this.db.transaction("CalculationHistory", "readwrite");
            const store = ts.objectStore("CalculationHistory");
            const clearReq = store.clear();
            clearReq.onsuccess = () => resolve("All history cleared");
            clearReq.onerror = () => reject("Clear failed");
        });
    }
}
