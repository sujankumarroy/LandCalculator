class HistoryManager {
    initEvents() {
        document.getElementById("exportBtn").addEventListener("click", () => this.exportHistory());
        document.getElementById("clearHistoryBtn").addEventListener("click", () => this.clearHistory());
        document.getElementById("historyList").addEventListener("click", (e) => this.redirectValues(e));
    }

    showHistory() {
        const historyList = document.getElementById("historyList");
        let history = JSON.parse(localStorage.getItem("history")) || [];

        historyList.innerHTML = "";
        history.forEach((h, index) => {
            historyList.innerHTML += `
                <div data-index="${index}" class="history-item">
                    <div class="history-header">
                        <span class="history-date">${h.date}</span>
                        <span class="history-area">${h.area}</span>
                    </div>

                    <div class="history-body">
                        <div><b>Length</b>: ${h.length}</div>
                        <div><b>Breadth</b>: ${h.breadth}</div>
                        <div><b>Area</b>: ${h.area}</div>
                        <div><b>Operator</b>: ${h.op}</div>
                        <div><b>Total Area</b>: ${h.totalArea}</div>
                        <div><b>Rate</b>: ${h.rate}</div>
                        <div><b>Price</b>: ${h.price}</div>
                    </div>

                    <div class="history-footer">
                        <span class="price">${h.price}</span>
                    </div>
                </div>
            `;
        });

        if (historyList.innerHTML === "") {
            historyList.innerHTML = `<div class="history-empty">No calculations saved yet.</div>`;
            this.showToast("No History!");
        }
    }

    exportHistory() {
        let history = JSON.parse(localStorage.getItem("history")) || [];

        if(history.length === 0){
            alert("No history to export.");
            return;
        }

        let content = "Land Calculator History\n\n";

        history.forEach(h => {
            content += `Date: ${h.date}\n`;
            content += `Length: ${h.length}\n`;
            content += `Breadth: ${h.breadth}}\n`;
            content += `Area: ${h.area}\n`;
            content += `Operator: ${h.op}\n`;
            content += `Total Area: ${h.totalArea}\n`;
            content += `Rate: ${h.rate}\n`;
            content += `Price: ${h.price}\n`;
            content += "--------------------------------------\n";
        });

        let blob = new Blob([content], { type: "text/plain" });
        let url = URL.createObjectURL(blob);

        let a = document.createElement("a");
        a.href = url;
        a.download = "Land_History.txt";
        a.click();

        URL.revokeObjectURL(url);
    }

    clearHistory() {
        localStorage.removeItem("history");
        historyList.innerHTML = `<div class="history-empty">No calculations saved yet.</div>`;
        this.showToast("History Cleared!");
    }

    redirectValues(e) {
        const historyItem = e.target.closest(".history-item");
        if (!historyItem) return;

        const index = historyItem.dataset.index;
        const history = JSON.parse(localStorage.getItem("history")) || [];
        const values = history[index];

        sessionStorage.setItem("redirectValues", JSON.stringify({ use: true, ...values }));
        window.location.href = "/";
    }

    showToast(msg,time=1600){
        const t=document.getElementById('toast');
        if(!t)return;
        t.textContent=msg;
        t.classList.add('show');
        t.style.display='block';
        clearTimeout(t._to);
        t._to=setTimeout(()=>{t.classList.remove('show');setTimeout(()=>t.style.display='none',220);},time);
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    const hm = new HistoryManager();

    hm.initEvents();
    hm.showHistory();
});
