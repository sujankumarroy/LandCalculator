class HistoryManager {
    initEvents() {
        document.getElementById("exportBtn").addEventListener("click", () => this.exportHistory());
        document.getElementById("clearHistoryBtn").addEventListener("click", () => this.clearHistory());
    }

    showHistory() {
        const historyList = document.getElementById("historyList");
        let history = JSON.parse(localStorage.getItem("history")) || [];

        historyList.innerHTML = "";
        history.forEach(h => {
            historyList.innerHTML += `
                <div>
                    <strong>${h.date}</strong><br>
                    Length: ${(h.lu1 == h.lu2) ? `${h.l1 + h.l2} ${h.lu1}` : `${h.l1} ${h.lu1}, ${h.l2} ${h.lu2}`}<br>
                    Breadth: ${(h.bu1 == h.bu2) ? `${h.b1 + h.b2} ${h.bu1}` : `${h.b1} ${h.bu1}, ${h.b2} ${h.bu2}`}<br>
                    Area: ${h.area} ${h.au}<br>
                    Operator: ${h.op}<br>
                    Total Area: ${h.totalArea} ${h.au}<br>
                    Rate: ${h.rate} ${h.ru}<br>
                    Price: ${h.price}<br><br>
                </div>
            `;
        });

        if (historyList.innerHTML === "") {
            historyList.innerHTML = "No History";
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
            content += `Length: ${(h.lu1 == h.lu2) ? `${h.l1 + h.l2} ${h.lu1}` : `${h.l1} ${h.lu1}, ${h.l2} ${h.lu2}`}\n`;
            content += `Breadth: ${(h.bu1 == h.bu2) ? `${h.b1 + h.b2} ${h.bu1}` : `${h.b1} ${h.bu1}, ${h.b2} ${h.bu2}`}\n`;
            content += `Area: ${h.area} ${h.au}\n`;
            content += `Operator: ${h.op}\n`;
            content += `Total Area: ${h.totalArea} ${h.au}\n`;
            content += `Rate: ${h.rate} ${h.ru}\n`;
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
        historyList.innerHTML = "No History";
        this.showToast("History Cleared!");
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
