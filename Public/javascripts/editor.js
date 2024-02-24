let edt1 = document.querySelector("#mytextarea");


ace.edit(edt1, {
    theme: "ace/theme/cobalt",
    mode: "ace/mode/mips_assembler",
});


let edt2 = document.querySelector("#mytextarea2");


ace.edit(edt2, {
    theme: "ace/theme/cobalt",

    // Add some custom RISC-V highlighting rules
});

let last = [-1, -1];
var p2 = document.getElementById("mytextarea2").querySelector(".ace_text-layer");
var p1 = document.getElementById("mytextarea").querySelector(".ace_text-layer");
p1.addEventListener("click", () => {
    update();
});
p2.addEventListener("click", update);
function update() {
    var ele = document.getElementById("mytextarea2").querySelector(".ace_gutter").querySelector(".ace_gutter-layer");
    var first_ele = ele.children[0].innerText - 1;
    if (last[0] < first_ele) {
        return;
    }
    var pc2 = last[0] - parseInt(first_ele)
    debugger;

    if (p1)
        var child = p1.children[pc2];
    if (child)
        child.classList.add("my-custom-class");

    ele = document.getElementById("mytextarea").querySelector(".ace_gutter").querySelector(".ace_gutter-layer");
    first_ele = ele.children[0].innerText - 1;
    if (pc < first_ele) {
        return;
    }
    pc2 = pc - parseInt(first_ele);
    if (p2)
        child = p2.children[pc2];
    if (child)
        child.classList.add("my-custom-class");
    debugger;

}

const run = document.querySelector(".Run");


export function ChangeColor2(pc) {
    var previoueEle = document.getElementById("mytextarea2").querySelector(".my-custom-class");

    if (previoueEle)
        previoueEle.classList.remove("my-custom-class");
    var parent = document.getElementById("mytextarea2").querySelector(".ace_text-layer");
    var ele = document.getElementById("mytextarea2").querySelector(".ace_gutter").querySelector(".ace_gutter-layer");
    var first_ele = ele.children[0].innerText - 1;
    if (pc < first_ele) {
        return;
    }
    var pc2 = pc - parseInt(first_ele)

    if (parent)
        var child = parent.children[pc2];
    if (child)
        child.classList.add("my-custom-class");
}
export function ChangeColor1(pc) {
    var previoueEle = document.getElementById("mytextarea").querySelector(".my-custom-class");
    if (previoueEle)
        previoueEle.classList.remove("my-custom-class");
    var parent = document.getElementById("mytextarea").querySelector(".ace_text-layer");
    var ele = document.getElementById("mytextarea").querySelector(".ace_gutter").querySelector(".ace_gutter-layer");
    var first_ele = ele.children[0].innerText - 1;
    if (pc < first_ele) {
        return;
    }
    var pc2 = pc - parseInt(first_ele);
    if (parent)
        var child = parent.children[pc2];
    if (child)
        child.classList.add("my-custom-class");
}
const li = document.createElement("button");
const topBut = document.querySelector(".Top_buttons");
li.classList.add("editBtn");
// debugger;
li.innerText = "Edit";
topBut.appendChild(li);

li.style.display = "none";
export function EnableEdit() {
    let edit1 = ace.edit(edt1);
    let edit2 = ace.edit(edt2);
    edit1.setReadOnly(false);
    edit2.setReadOnly(false);
    li.style.display = "none";
}
export function DisableEdit() {
    let edit1 = ace.edit(edt1);
    let edit2 = ace.edit(edt2);
    edit1.setReadOnly(true);
    edit2.setReadOnly(true);
    li.style.display = "Block";
}
export function getValue1() {
    let edit1 = ace.edit(edt1);
    let edit2 = ace.edit(edt2);

    let valueOfEdt1 = edit1.getValue();
    let valueOfEdt2 = edit2.getValue();
    // edit1.setValue("kjfksjkfsdjfn");
    // debugger;
    console.log(valueOfEdt1);
    console.log(valueOfEdt2);

    return edit1.getValue();
}
export function getValue2() {
    let edit2 = ace.edit(edt2);

    return edit2.getValue();
}
// console.log(valueOfEdt1);
// console.log("---------------------");

export function setValue1(code1) {
    let edit1 = ace.edit(edt1);
    edit1.setValue(code1);
}

export function setValue2(code1) {
    let edit2 = ace.edit(edt2);
    edit2.setValue(code1);
}





console.log("okok");




