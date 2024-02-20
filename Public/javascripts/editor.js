let edt1 = document.querySelector("#mytextarea");


ace.edit(edt1, {
    theme: "ace/theme/cobalt",
    // mode: "ace/mode/mips_assembler",
});


let edt2 = document.querySelector("#mytextarea2");


ace.edit(edt2, {
    theme: "ace/theme/cobalt",
    // Add some custom RISC-V highlighting rules
});





const run = document.querySelector(".Run");
export function getValue1() {
    let edit1 = ace.edit(edt1);
    let edit2 = ace.edit(edt2);

    let valueOfEdt1 = edit1.getValue();
    let valueOfEdt2 = edit2.getValue();
    console.log(valueOfEdt1);
    console.log(valueOfEdt2);
    return edit1.getValue();
}

export function getValue2() {
    let edit1 = ace.edit(edt1);

    let edit2 = ace.edit(edt2);
    return edit2.getValue();
}
// console.log(valueOfEdt1);
// console.log("---------------------");
console.log("okok");




