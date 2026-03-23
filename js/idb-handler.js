class DBHandler {
    constructor() {
        this.dbRequest = null;
        this.db = null;
    }

    init() {
        return new Promise((resolve, reject) => {
            this.dbRequest = indexedDB.open("LandCalculator", 1);

            this.dbRequest.onupgradeneeded = (event) => {
                const db = event.target.result;
                db.createObjectStore("CalculationHistory", { keyPath: "id", autoIncrement: true });
            };

            this.dbRequest.onsuccess = (event) => {
                this.db = event.target.result;
                console.log("DB Opened");
                resolve(this);
            };

            this.dbRequest.onerror = () => {
                console.log("Error opening DB");
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
        });
    }

    getHistory() {
        return new Promise((resolve, reject) => {
            const ts = this.db.transaction("CalculationHistory", "readonly");
            const store = ts.objectStore("CalculationHistory");
            const addReq = store.getAll();
            addReq.onsuccess = () => resolve(addReq.result);
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
