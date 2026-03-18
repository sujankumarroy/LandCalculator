class PWAHandler {
    constructor() {
        this.installBtn = document.getElementById('installBtn');
        this.deferredPrompt = null;
    }

    init() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js');
        }

        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            if (this.installBtn) this.installBtn.style.display = 'block';
        });

        window.addEventListener('appinstalled', () => {
            if (this.installBtn) this.installBtn.style.display = 'none';
            this.deferredPrompt = null;
            console.log('PWA was installed');
        });

        if (this.installBtn) {
            this.installBtn.addEventListener("click", () => this.handleInstall());
        }
    }

    async handleInstall() {
        if (!this.deferredPrompt) return;

        this.deferredPrompt.prompt();
        await this.deferredPrompt.userChoice;

        this.deferredPrompt = null;

        if (this.installBtn)
            this.installBtn.style.display = "none";
    }
}

class Calculator {
    fillAllDropdown() {
        this.lengthUnits = ["Meter", "Centimeter", "Foot", "Inch", "Nol", "Haat"];
        this.areaUnits = ["Square Meter", "Square Centimeter", "Square Foot", "Square Inch", "Hectare", "Acre", "Bigha", "Kear", "Josti", "Raak", "Fon", "Kata"];
        this.rateUnits = ["Rs. Per Square Meter", "Rs. Per Square Centimeter", "Rs. Per Square Foot", "Rs. Per Square Inch", "Rs. Per Hectare", "Rs. Per Acre", "Rs. Per Bigha", "Rs. Per Kear", "Rs. Per Josti", "Rs. Per Raak", "Rs. Per Fon", "Rs. Per Kata"];
        this.operatorUnits = ["Multiply"];

        this.fillDropdown("lengthUnit1", this.lengthUnits);
        this.fillDropdown("lengthUnit2", this.lengthUnits);
        this.fillDropdown("breadthUnit1", this.lengthUnits);
        this.fillDropdown("breadthUnit2", this.lengthUnits);

        this.fillDropdown("operatorUnit", this.operatorUnits);
        this.fillDropdown("rateUnit", this.rateUnits);
        this.fillDropdown("areaUnit", this.areaUnits);
    }

    initEvents() {
        const detailsBtn = document.getElementById("detailsBtn");
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

        document.getElementById("btnClear").addEventListener("click", () => {
            this.clearAll();
            this.showToast("Cleared!");
        });
        document.getElementById("btnCalculate").addEventListener("click", () => {
            this.calculate();
            this.showToast("Calculated!");
        });
        document.getElementById("copyResult").addEventListener("click", () => {
            this.copyResult()
            this.showToast("Copied!");
        });
        document.getElementById("viewHistory").addEventListener("click", () => window.location.href = "/history");
        document.getElementById("hideResultCard").addEventListener("click", () => document.getElementById("resultCard").style.display = "none");
    }

    fillDropdown(id, arr) {
        const select = document.getElementById(id);
        arr.forEach(v => {
            let option = document.createElement("option");
            option.text = v;
            option.value = v;
            select.add(option);
        });
    }

    setValues(v) {
        if (!v || Object.keys(v).length === 0) return;
        document.getElementById("lengthUnit1").value = v.lu1;
        document.getElementById("lengthUnit2").value = v.lu2;
        document.getElementById("breadthUnit1").value = v.bu1;
        document.getElementById("breadthUnit2").value = v.bu2;

        document.getElementById("rateUnit").value = v.ru;
        document.getElementById("areaUnit").value = v.au;

        document.getElementById("length1").value = v.l1;
        document.getElementById("length2").value = v.l2;
        document.getElementById("breadth1").value = v.b1;
        document.getElementById("breadth2").value = v.b2;

        document.getElementById("operator").value = v.op;
        document.getElementById("ratePerUnitArea").value = v.rate;
    }

    copyResult() {
        const length = document.getElementById("resultLength").textContent;
        const breadth = document.getElementById("resultBreadth").textContent;
        const area = document.getElementById("resultArea").textContent;
        const operator = document.getElementById("resultOperator").textContent;
        const totalArea = document.getElementById("resultTotalArea").textContent;
        const rate = document.getElementById("resultRate").textContent;
        const price = document.getElementById("resultPrice").textContent;

        let text = "";

        text += `*Land Calculation Result*\n\n`;
        text += `* Length: ${length}\n`;
        text += `* Breadth: ${breadth}\n`;
        text += `* Area: ${area}\n`;
        text += `* Operator: ${operator}\n`;
        text += `* Total Area: ${totalArea}\n`;
        text += `* Rate: ${rate}\n`;
        text += `* Price: ${price}`;

        navigator.clipboard.writeText(text);
    }

    convertToMeter(value, unit) {
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

    calculate() {
        try {
            document.getElementById("resultCard").style.display = "block";

            const length1 = document.getElementById("length1");
            const length2 = document.getElementById("length2");
            const breadth1 = document.getElementById("breadth1");
            const breadth2 = document.getElementById("breadth2");

            const lengthUnit1 = document.getElementById("lengthUnit1");
            const lengthUnit2 = document.getElementById("lengthUnit2");
            const breadthUnit1 = document.getElementById("breadthUnit1");
            const breadthUnit2 = document.getElementById("breadthUnit2");

            const operator = document.getElementById("operator");
            const ratePerUnitArea = document.getElementById("ratePerUnitArea");

            const rateUnit = document.getElementById("rateUnit");
            const areaUnit = document.getElementById("areaUnit");

            let l1 = parseFloat(length1.value) || 0;
            let l2 = parseFloat(length2.value) || 0;
            let b1 = parseFloat(breadth1.value) || 0;
            let b2 = parseFloat(breadth2.value) || 0;

            let lu1 = lengthUnit1.value;
            let lu2 = lengthUnit2.value;
            let bu1 = breadthUnit1.value;
            let bu2 = breadthUnit2.value;

            let op = parseFloat(operator.value) || 0;
            let rate = parseFloat(ratePerUnitArea.value) || 0;

            let ru = rateUnit.value;
            let au = areaUnit.value;

            let lengthM = this.convertToMeter(l1, lu1) + this.convertToMeter(l2, lu2);
            let breadthM = this.convertToMeter(b1, bu1) + this.convertToMeter(b2, bu2);

            let areaSm = lengthM * breadthM;
            let area = this.areaConverter(areaSm, au);
            let totalArea = area * op;
            let price = this.areaConverter(areaSm, ru.replace("Rs. Per ", "")) * op * rate;

            const result = { 
                l1, l2, b1, b2, 
                lu1, lu2, bu1, bu2, 
                op, rate, ru, au, 
                lengthM, breadthM, 
                areaSm: areaSm.toFixed(4), 
                area: area.toFixed(4), 
                totalArea: totalArea.toFixed(4), 
                price: price.toFixed(2) 
            };

            this.showResult(result);
            if (area) this.saveHistory(result);
        } catch(e) {
            console.error(e);
        }
    }

    saveHistory(result) {
        let history = JSON.parse(localStorage.getItem("history")) || [];
        if (history.length != 0) {
            let { date, ...lastResult } = history[0]
            if (JSON.stringify(result) == JSON.stringify(lastResult)) return;
        }
        history.unshift({
            date: new Date().toLocaleString(),
            ...result
        });
        localStorage.setItem("history", JSON.stringify(history));
    }

    clearAll() {
        document.querySelectorAll("input").forEach(i => i.value = "");
        document.getElementById("resultCard").style.display = "none";
    }

    showResult(r) {
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

    areaConverter(area, unit2, unit1 = "Square Meter") {
        if (unit1 !== "Square Meter") {
            switch (unit1) {
                case "Square Centimeter": return this.areaConverter(area / 10000, unit2);
                case "Square Foot": return this.areaConverter(area / 10.7639, unit2);
                case "Square Inch": return this.areaConverter(area / 1550.0031, unit2);
                case "Hectare": return this.areaConverter(area * 10000, unit2);
                case "Acre": return this.areaConverter(area * 4046.86, unit2);
                case "Bigha": return this.areaConverter(area * 1600, unit2);
                case "Kear": return this.areaConverter(area * (0.4572 * 0.4572 * 8 * 8 * 4 * 28), unit2);
                case "Josti": return this.areaConverter(area * (0.4572 * 0.4572 * 8 * 8 * 4), unit2);
                case "Raak": return this.areaConverter(area * (0.4572 * 0.4572 * 8 * 8), unit2);
                case "Fon": return this.areaConverter(area * (0.4572 * 0.4572), unit2);
                case "Square Meter": return this.areaConverter(area, unit2);
                default: return area;
            }
        }
        switch (unit2) {
            case "Square Meter": return area;
            case "Square Centimeter": return area * 10000;
            case "Square Foot": return area * 10.7639;
            case "Square Inch": return area * 1550.0031;
            case "Hectare": return area / 10000;
            case "Acre": return area / 4046.86;
            case "Bigha": return area / 1600;
            case "Kear": return area / (0.4572 * 0.4572 * 8 * 8 * 4 * 28);
            case "Josti": return area / (0.4572 * 0.4572 * 8 * 8 * 4);
            case "Raak": return area / (0.4572 * 0.4572 * 8 * 8);
            case "Fon": return area / (0.4572 * 0.4572);
            default: return area;
        }
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
    const pwa = new PWAHandler();
    const calc = new Calculator();

    pwa.init();
    calc.fillAllDropdown();

    let values;

    const sessionValues = JSON.parse(sessionStorage.getItem("redirectValues")) || {};
    const history = JSON.parse(localStorage.getItem("history")) || [];

    if (sessionValues && sessionValues.use) {
        values = sessionValues;

        sessionValues.use = false;
        sessionStorage.setItem("redirectValues", JSON.stringify(sessionValues));
    } else if (history.length != 0) {
        values = history[0];
    }

    calc.setValues(values);
    calc.initEvents();
});
