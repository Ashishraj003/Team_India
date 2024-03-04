const radioRegister1 = document.querySelector("#radio_reg1");
const radioRegister2 = document.querySelector("#radio_reg2");

///
const table1 = document.querySelector("#reg1_table");
const table2 = document.querySelector("#reg2_table");

//register  switching
radioRegister1.addEventListener('click', function () {
    if (table2.style.display !== "none") {
        table2.style.display = "none";
        table1.style.display = "block";
    }
    else {
        table1.removeAttribute("none");
    }
})


radioRegister2.addEventListener('click', function () {
    if (table1.style.display !== "none") {
        table1.style.display = "none";
        table2.style.display = "block";
    }
    else {
        table2.removeAttribute("none");
    }
})




