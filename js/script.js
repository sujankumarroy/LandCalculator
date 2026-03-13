const lengthUnits = ["Meter", "Centimeter", "Foot", "Inch", "Nol", "Haat"];
const areaUnits = ["Square Meter", "Square Centimeter", "Square Foot", "Square Inch", "Hectare", "Acre", "Bigha", "Kear", "Josti", "Raak", "Fon", "Kata"];
const rateUnits = ["Per Square Meter", "Per Square Centimeter", "Per Square Foot", "Per Square Inch", "Per Hectare", "Per Acre", "Per Bigha", "Kear", "Per Josti", "Per Raak", "Per Fon", "Per Kata"];
const operatorUnits = ["Multiply"];

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

document.getElementById("detailsBtn").addEventListener("click", () => {

    const box = document.getElementById("resultDetails");

    if (box.style.display === "none") {
        box.style.display = "block";
    } else {
        box.style.display = "none";
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

        let op = parseFloat(operator.value) || 0;
        let rate = parseFloat(price.value) || 0;

        let ru = rateUnit.value;
        let au = areaUnit.value;

        let length = convertToMeter(l1, lu1) + convertToMeter(l2, lu2);
        let breadth = convertToMeter(b1, bu1) + convertToMeter(b2, bu2);

        let areaSm = length * breadth;

        let finalArea = areaConverter(areaSm, au);
        let amount = areaConverter(areaSm, ru) * op * rate;

        document.getElementById("detailDimensions").textContent =
        "Lengths: " + l1 + ", " + l2 + " | Breadths: " + b1 + ", " + b2;

        document.getElementById("detailArea").textContent =
        "Calculated Area: " + finalArea;

        document.getElementById("detailPrice").textContent =
        "Total Price: ₹ " + amount.toLocaleString("en-IN");

        showResult(finalArea, au, amount);
        if (finalArea) saveHistory(finalArea, au, amount);

    } catch(e) {
        console.error(e);
    }
}

function saveHistory(area, unit, amount) {
    let history = JSON.parse(localStorage.getItem("history")) || [];
    history.push({
        date: new Date().toLocaleString(),
        area: area + " " + unit,
        amount: "₹" + amount.toFixed(2)
    });
    localStorage.setItem("history", JSON.stringify(history));
}

function clearAll() {
    document.querySelectorAll("input").forEach(i => i.value = "");
    showResult(0, 0)
}

function showResult(area, unit, price) {

    document.getElementById("resultArea").textContent =
        area + " " + unit;

    document.getElementById("resultPrice").textContent =
        "₹ " + price.toLocaleString("en-IN");

    const card = document.getElementById("resultCard");

    card.style.display = "block";

    card.scrollIntoView({
        behavior: "smooth"
    });
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
        default: console.error("unit doesn't mathced")
    }
}
