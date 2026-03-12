function showHistory() {
    const historyList = document.getElementById("historyList");
    let history = JSON.parse(localStorage.getItem("history")) || [];

    historyList.innerHTML = "";
    history.forEach(h => {
        historyList.innerHTML += `
            <div>
                <strong>${h.date}</strong><br>
                Area: ${h.area}<br>
                Amount: ${h.amount}<br><br>
            </div>
        `;
    });
}

function exportHistory() {
    let history = JSON.parse(localStorage.getItem("history")) || [];

    if(history.length === 0){
        alert("No history to export.");
        return;
    }

    let content = "Land Calculator History\n\n";

    history.forEach(h => {
        content += `Date: ${h.date}\n`;
        content += `Area: ${h.area}\n`;
        content += `Amount: ${h.amount}\n`;
        content += "--------------------------\n";
    });

    let blob = new Blob([content], { type: "text/plain" });
    let url = URL.createObjectURL(blob);

    let a = document.createElement("a");
    a.href = url;
    a.download = "Land_History.txt";
    a.click();

    URL.revokeObjectURL(url);
}

function clearHistory() {
    localStorage.removeItem("history");
    historyList.innerHTML = "No History";
}

function showToast(msg,time=1600){
    const t=document.getElementById('toast');
    if(!t)return;
    t.textContent=msg;
    t.classList.add('show');
    t.style.display='block';
    clearTimeout(t._to);
    t._to=setTimeout(()=>{t.classList.remove('show');setTimeout(()=>t.style.display='none',220);},time);
}

showHistory();
