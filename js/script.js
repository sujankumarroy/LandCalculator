const lengthUnits = ["Meter", "Centimeter", "Foot", "Inch", "Nol", "Haat"];
const areaUnits = ["Square Meter", "Square Centimeter", "Square Foot", "Square Inch", "Hectare", "Acre", "Bigha", "Kear", "Josti", "Raak", "Fon", "Kata"];
const rateUnits = ["Rs. Per Square Meter", "Rs. Per Square Centimeter", "Rs. Per Square Foot", "Rs. Per Square Inch", "Rs. Per Hectare", "Rs. Per Acre", "Rs. Per Bigha", "Rs. Per Kear", "Rs. Per Josti", "Rs. Per Raak", "Rs. Per Fon", "Rs. Per Kata"];
const operatorUnits = ["Multiply"];

const detailsBtn = document.getElementById("detailsBtn");
const installBtn = document.getElementById('installBtn');

let deferredPrompt;

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
}

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installBtn.style.display = 'block';

    installBtn.addEventListener('click', async () => {
        if (!deferredPrompt) return;
    
        deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
    
        deferredPrompt = null;
        installBtn.style.display = "none";
    });
});

window.addEventListener('appinstalled', () => {
    installBtn.style.display = 'none';
    deferredPrompt = null;
    console.log('PWA was installed');
});

function fillDropdown(id, arr) {
    const select = document.getElementById(id);
    arr.forEach(v => {
        let option = document.createElement("option");
        option.text = v;
        select.add(option);
    });
}

fillDropdown("lengthUnit1", lengthUnits);
fillDropdown("lengthUnit2", lengthUnits);
fillDropdown("breadthUnit1", lengthUnits);
fillDropdown("breadthUnit2", lengthUnits);

fillDropdown("operatorUnit", operatorUnits);
fillDropdown("rateUnit", rateUnits);
fillDropdown("areaUnit", areaUnits);

detailsBtn.addEventListener("click", () => {
    if (detailsBtn.textContent == "More Details") {
        document.querySelectorAll(".result-minor").forEach(v => {
            v.style.display = "flex";
            detailsBtn.textContent = "Less Details";
        });
    } else {
        document.querySelectorAll(".result-minor").forEach(v => {
            v.style.display = "none";
            detailsBtn.textContent = "More Details";
        });
    }
});

document.getElementById("copyResult").addEventListener("click", () => {
    const area = document.getElementById("resultArea").textContent;
    const price = document.getElementById("resultPrice").textContent;

    const text = `Land Calculation Result
Area: ${area}
Price: ${price}`;

    navigator.clipboard.writeText(text);
});

document.getElementById("viewHistory").addEventListener("click", () => {
    window.location.href = "/history";
});

document.getElementById("hideResultCard").addEventListener("click", () => {
    document.getElementById("resultCard").style.display = "none";
});

function convertToMeter(value, unit) {
    switch(unit) {
        case "Meter": return value;
        case "Centimeter": return value * 0.01;
        case "Foot": return value * 0.3048;
        case "Inch": return value * 0.0254;
        case "Nol": return value * 3.6576;
        case "Haat": return value * 0.4572;
        default: return value;
    }
}

function calculate() {
    try {
        document.getElementById("resultCard").style.display = "block";

        let l1 = parseFloat(length1.value) || 0;
        let l2 = parseFloat(length2.value) || 0;
        let b1 = parseFloat(breadth1.value) || 0;
        let b2 = parseFloat(breadth2.value) || 0;

        let lu1 = lengthUnit1.value;
        let lu2 = lengthUnit2.value;
        let bu1 = breadthUnit1.value;
        let bu2 = breadthUnit2.value;

        let op = parseFloat(operator.value) || 1;
        let rate = parseFloat(ratePerUnitArea.value) || 0;

        let ru = rateUnit.value;
        let au = areaUnit.value;

        let lengthM = convertToMeter(l1, lu1) + convertToMeter(l2, lu2);
        let breadthM = convertToMeter(b1, bu1) + convertToMeter(b2, bu2);

        let areaSm = lengthM * breadthM;
        let area = areaConverter(areaSm, au);
        let totalArea = area * op;
        let price = areaConverter(totalArea, ru.replace("Rs. Per ", "")) * rate;

        const result = { l1, l2, b1, b2, lu1, lu2, bu1, bu2, op, rate, ru, au, lengthM, breadthM, areaSm, area, totalArea, price };

        showResult(result);
        if (area) saveHistory(result);
    } catch(e) {
        console.error(e);
    }
}

function saveHistory(result) {
    let history = JSON.parse(localStorage.getItem("history")) || [];
    history.push({
        date: new Date().toLocaleString(),
        ...result
    });
    localStorage.setItem("history", JSON.stringify(history));
}

function clearAll() {
    document.querySelectorAll("input").forEach(i => i.value = "");
    document.getElementById("resultCard").style.display = "none";
}

function showResult(r) {
    document.getElementById("resultLength").textContent = (r.lu1 == r.lu2) ? `${r.l1 + r.l2} ${r.lu1}` : `${r.l1} ${r.lu1}, ${r.l2} ${r.lu2}`;
    document.getElementById("resultBreadth").textContent = (r.bu1 == r.bu2) ? `${r.b1 + r.b2} ${r.bu1}` : `${r.b1} ${r.bu1}, ${r.b2} ${r.bu2}`;
    document.getElementById("resultArea").textContent = `${r.area} ${r.au}`;
    document.getElementById("resultOperator").textContent = `${r.op}`;
    document.getElementById("resultTotalArea").textContent = `${r.totalArea} ${r.au}`;
    document.getElementById("resultRate").textContent = `${r.rate} ${r.ru}`;
    document.getElementById("resultPrice").textContent = `₹ ${r.price.toLocaleString("en-IN")}`;

    const card = document.getElementById("resultCard");

    card.style.display = "block";
    card.scrollIntoView({ behavior: "smooth", block: "center" });
}

function areaConverter(areaSm, unit) {
    switch (unit) {
        case "Square Meter": return areaSm;
        case "Square Centimeter": return areaSm * 10000;
        case "Square Foot": return areaSm * 10.7639;
        case "Square Inch": return areaSm * 1550.0031;
        case "Hectare": return areaSm / 10000;
        case "Acre": return areaSm / 4046.86;
        case "Bigha": return areaSm / 1600;
        case "Kear": return areaSm / (0.4572 * 0.4572 * 8 * 8 * 4 * 28);
        case "Josti": return areaSm / (0.4572 * 0.4572 * 8 * 8 * 4);
        case "Raak": return areaSm / (0.4572 * 0.4572 * 8 * 8);
        case "Fon": return areaSm / (0.4572 * 0.4572);
        default: return areaSm;
    }
}
