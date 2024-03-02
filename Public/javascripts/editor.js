const edt1 = document.querySelector("#mytextarea");

ace.define("ace/mode/risc", function (require, exports, module) {
    'use strict';

    var oop = require("ace/lib/oop");
    var TextMode = require("ace/mode/text").Mode;
    var TextHighlightRules = require("ace/mode/text_highlight_rules").TextHighlightRules;

    var RISCHighlightRules = function () {
        this.$rules = {
            "start": [
                {
                    token: "keyword",
                    regex: ".*\:"
                },
                {
                    token: "variable",
                    regex: "\\b(?:x|a)\\d+\\b"
                },
                {
                    token: "string",
                    regex: "\\b(?:0x[0-9A-Fa-f]+|0b[01]+|\\d+)\\b"
                },
                {
                    token: "comment",
                    regex: "#.*$"
                },
                {
                    token: "comment",
                    regex: ","
                },
                {
                    token: "function",
                    regex: "\\b(?:add|sub|srli|and|addi|lw|sw|la|li|beq|bne|bgt|blt|bgeu|bltu|jalr|jal|j|jr)\\b"
                }
                // Add more rules for other instructions and keywords
            ]
        };
    };

    oop.inherits(RISCHighlightRules, TextHighlightRules);

    var Mode = function () {
        this.HighlightRules = RISCHighlightRules;
    };
    oop.inherits(Mode, TextMode);

    (function () {
        // Extra setup goes here. (optional)
    }).call(Mode.prototype);

    exports.Mode = Mode;
});


ace.edit(edt1, {
    theme: "ace/theme/chaos",
    mode: "ace/mode/risc",
});

const edt2 = document.querySelector("#mytextarea2");


// Set the modified theme back to the editor
// edit1.setTheme(editorTheme);
ace.edit(edt2, {
    theme: "ace/theme/chaos",
    mode: "ace/mode/risc",
    // Add sme custom RISC-V highlighting rules
});

const edit1 = ace.edit(edt1);
const edit2 = ace.edit(edt2);
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
const pscroller1 = document.getElementById("mytextarea").querySelector(".ace_scrollbar");
const pscroller2 = document.getElementById("mytextarea2").querySelector(".ace_scrollbar");
const lasts = [0, 0];
pscroller1.addEventListener("scroll", ()=>{
 
    debugger;
    const parent = document.getElementById("mytextarea").querySelector(".ace_text-layer");
    var ele = document.getElementById("mytextarea").querySelector(".ace_gutter").querySelector(".ace_gutter-layer");
    var first_ele = ele.children[0].innerText - 1;
    if (lasts[1] < first_ele) {
        return;
    }
    var pc2 = lasts[1] - parseInt(first_ele)

    if (parent && parent.children)
        var child = parent.children[pc2];
    if (child)
        child.classList.add("my-custom-class");
    
});
pscroller2.addEventListener("scroll", ()=>{
 
    debugger;
    const parent = document.getElementById("mytextarea2").querySelector(".ace_text-layer");
    var ele = document.getElementById("mytextarea2").querySelector(".ace_gutter").querySelector(".ace_gutter-layer");
    var first_ele = ele.children[0].innerText - 1;
    if (lasts[2] < first_ele) {
        return;
    }
    var pc2 = lasts[2] - parseInt(first_ele)

    if (parent && parent.children)
        var child = parent.children[pc2];
    if (child)
        child.classList.add("my-custom-class");
    
});
export function ChangeColor(pc,number)
{   
    lasts[number] = pc;
    var previoueEle,parent,ele;
    if(number==1)
    {
        previoueEle = document.getElementById("mytextarea").querySelector(".my-custom-class");
        parent = document.getElementById("mytextarea").querySelector(".ace_text-layer");
        ele = document.getElementById("mytextarea").querySelector(".ace_gutter").querySelector(".ace_gutter-layer");
    }
    else
    {
        previoueEle = document.getElementById("mytextarea2").querySelector(".my-custom-class");
        parent = document.getElementById("mytextarea2").querySelector(".ace_text-layer");
        ele = document.getElementById("mytextarea2").querySelector(".ace_gutter").querySelector(".ace_gutter-layer");
    }

    if (previoueEle)
        previoueEle.classList.remove("my-custom-class");
    debugger;
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

export function getValue(i){
    
    if(i==1){
        return edit1.getValue();
    }
    return edit2.getValue();
}

export function setValue1(code1) {
    let edit1 = ace.edit(edt1);
    edit1.setValue(code1);
}

export function setValue2(code1) {
    let edit2 = ace.edit(edt2);
    edit2.setValue(code1);
}

