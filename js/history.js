function showHistory() {
    const historyList = document.getElementById("historyList");
    let history = JSON.parse(localStorage.getItem("history")) || [];

    historyList.innerHTML = "";
    history.forEach(h => {
        historyList.innerHTML += `
            <div>
                <strong>${h.date}</strong><br>
                Length: ${(h.lu1 == h.lu2) ? `${h.l1 + h.l2} ${h.lu1}` : `${h.l1} ${h.lu1}, ${h.l2} ${h.lu2}`}<br>
                Breadth: ${(h.bu1 == h.bu2) ? `${h.b1 + h.b2} ${h.bu1}` : `${h.b1} ${h.bu1}, ${h.b2} ${h.bu2}`}<br>
                Area: ${h.areaSm} ${h.au}<br>
                Operatoe: ${h.op}<br>
                Total Area: ${h.finalArea} ${h.au}<br>
                Rate: ${h.rate} ${h.ru}<br>
                Price: ${h.price}<br><br>
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
        content += `Length: ${(h.lu1 == h.lu2) ? `${h.l1 + h.l2} ${h.lu1}` : `${h.l1} ${h.lu1}, ${h.l2} ${h.lu2}`}\n`;
        content += `Breadth: ${(h.bu1 == h.bu2) ? `${h.b1 + h.b2} ${h.bu1}` : `${h.b1} ${h.bu1}, ${h.b2} ${h.bu2}`}\n`;
        content += `Area: ${h.areaSm} ${h.au}\n`;
        content += `Operatoe: ${h.op}\n`;
        content += `Total Area: ${h.finalArea} ${h.au}\n`;
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
