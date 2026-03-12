const lengthUnits = ["Meter","Centimeter","Foot","Inch","Nol","Haat"];
const areaUnits = ["Square Meter","Square Centimeter","Square Foot","Square Inch","Hectare","Acre","Bigha"];

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
fillDropdown("areaUnit", areaUnits);
fillDropdown("areaUnitForPrice", areaUnits);

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

        let l1 = parseFloat(length1.value);
        let l2 = parseFloat(length2.value);
        let b1 = parseFloat(breadth1.value);
        let b2 = parseFloat(breadth2.value);
        let op = parseFloat(operator.value);
        let priceVal = parseFloat(price.value);

        let length = convertToMeter(l1, lengthUnit1.value) + convertToMeter(l2, lengthUnit2.value);
        let breadth = convertToMeter(b1, breadthUnit1.value) + convertToMeter(b2, breadthUnit2.value);

        let area = length * breadth;

        let finalArea = area;
        let unit = areaUnit.value;

        if(unit === "Square Foot") finalArea = area * 10.7639;
        if(unit === "Square Centimeter") finalArea = area * 10000;
        if(unit === "Acre") finalArea = area / 4046.86;
        if(unit === "Bigha") finalArea = area / 1600;

        let amount = op * area * priceVal;

        result.innerHTML =
            "Area: " + finalArea.toFixed(2) + " " + unit +
            "<br>Amount: ₹" + amount.toFixed(2);

        saveHistory(finalArea, unit, amount);

    } catch(e) {
        result.innerHTML = "Enter valid numbers";
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
    result.innerHTML = "";
}
