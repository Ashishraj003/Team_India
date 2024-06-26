import { text_update } from "./Processor.js";

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
                    token: "function",
                    regex: "\\.[^\\s]+"
                },
                {
                    token: "variable",
                    regex: "\\b(?:x[0-9]|a[0-9]|x1\\d|x2\\d|x31|x30)\\b"
                },
                {
                    token: "string",
                    regex: "\\b(?:0x[0-9A-Fa-f]+|0b[01]+|\\d+)\\b"
                },
                {
                    token: "string",
                    regex: "\".*\""
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
                    regex: "\\b(?:add|sub|srli|and|addi|lw|sw|la|li|beq|bne|bgt|blt|bgeu|bltu|jalr|jal|j|jr|and|or|xor|not|div|mul)\\b",
                    // onMatch: function(value, state, stack, line) {
                    //     // Suggestions for functions
                    //     var functionSuggestions = ['ad', 'su', 'sr', 'a', 'ad', 'l', 's', 'l', 'l', 'be', 'bn', 'bg', 'bl', 'bg', 'bl', 'ja', 'ja', 'j', 'jr'];
                    //     return {
                    //         value: value,
                    //         meta: "function",
                    //         completions: functionSuggestions
                    //     };
                    // }
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
        //Extra setup goes here. (optional)
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

edit1.resize(false);
let last = [-1, -1];
var p2 = document.getElementById("mytextarea2").querySelector(".ace_text-layer");
var p1 = document.getElementById("mytextarea").querySelector(".ace_text-layer");

p1.addEventListener("click", () => {
    update();
});
p2.addEventListener("click", update);
function update() {
    let ele = document.getElementById("mytextarea2").querySelector(".ace_gutter").querySelector(".ace_gutter-layer");
    let first_ele = ele.children[0].innerText - 1;
    if (last[0] < first_ele) {
        return;
    }
    let pc2 = last[0] - parseInt(first_ele);

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
    // debugger;

}

const run = document.querySelector(".Run");
const pscroller1 = document.getElementById("mytextarea").querySelector(".ace_scrollbar");
const pscroller2 = document.getElementById("mytextarea2").querySelector(".ace_scrollbar");
const lasts = [[-1,-1,-1,-1,-1], [-1,-1,-1,-1,-1]];
pscroller1.addEventListener("scroll", ()=>{
 
    // debugger;
    const parent = document.getElementById("mytextarea").querySelector(".ace_text-layer");
    var ele = document.getElementById("mytextarea").querySelector(".ace_gutter").querySelector(".ace_gutter-layer");
    var first_ele = ele.children[0].innerText - 1;
    for(let x=1;x<6;x++){
        if (lasts[0][x] < first_ele) {
            continue;
        }
        var pc2 = lasts[0][x] - parseInt(first_ele)
        if (parent && parent.children)
            var child = parent.children[pc2];
        if (child)
            child.classList.add("my-custom-class"+x);

    }
    
});
pscroller2.addEventListener("scroll", ()=>{
 
    // debugger;
    const parent = document.getElementById("mytextarea2").querySelector(".ace_text-layer");
    var ele = document.getElementById("mytextarea2").querySelector(".ace_gutter").querySelector(".ace_gutter-layer");
    var first_ele = ele.children[0].innerText - 1;
    if (lasts[1] < first_ele) {
        return;
    }
    var pc2 = lasts[1] - parseInt(first_ele)

    if (parent && parent.children)
        var child = parent.children[pc2];
    if (child)
        child.classList.add("my-custom-class");
    for(let x=1;x<6;x++){
        if (lasts[1][x] < first_ele) {
            continue;
        }
        var pc2 = lasts[1][x] - parseInt(first_ele)
        if (parent && parent.children)
            var child = parent.children[pc2];
        if (child)
            child.classList.add("my-custom-class"+x);

    }
    
});
export function ChangeColor(pc,number,level)
{
    lasts[number-1][level] = pc;
    let Textarea = document.getElementById("mytextarea");
    if(number!=1)
    {
        Textarea = document.getElementById("mytextarea2");
    }
    const previoueEle = Textarea.querySelector(".my-custom-class"+level);
    const parent = Textarea.querySelector(".ace_text-layer");
    const ele = Textarea.querySelector(".ace_gutter").querySelector(".ace_gutter-layer");
    if (previoueEle)
        previoueEle.classList.remove("my-custom-class"+level);
    // debugger;
    var first_ele = ele.children[0].innerText - 1;
    if (pc < first_ele) {
        return;
    }
    var pc2 = pc - parseInt(first_ele)

    if (parent)
        var child = parent.children[pc2];
    if (child)
        child.classList.add("my-custom-class"+level);
}

const li = document.createElement("button");
const topBut = document.querySelector(".Top_buttons");
li.classList.add("editBtn");
// debugger;
li.innerText = "Edit";
topBut.appendChild(li);

li.style.display = "none";
export function EnableEdit() {
    // let edit1 = ace.edit(edt1);
    // let edit2 = ace.edit(edt2);
    // edit1.setReadOnly(false);
    // edit2.setReadOnly(false);
    // li.style.display = "none";
}
export function DisableEdit() {
    // let edit1 = ace.edit(edt1);
    // let edit2 = ace.edit(edt2);
    // edit1.setReadOnly(true);
    // edit2.setReadOnly(true);
    // li.style.display = "Block";
}

export function getValue(i){
    
    if(i==1){
        return edit1.getValue();
    }
    return edit2.getValue();
}

export function setValue1(code1) {
    // let edit1 = ace.edit(edt1);
    edit1.setValue(code1);
    edit1.focus();
}

export function setValue2(code1) {
    // let edit2 = ace.edit(edt2);
    edit2.setValue(code1);
    edit2.focus();
}
edit1.getSession().on('change', function(e) {
    text_update();
});
edit2.getSession().on('change', function(e) {
    text_update();
});
let ErrorArray = [[], []];
export function clearAnotation(){
    ErrorArray = [[], []];
    edit1.getSession().clearAnnotations();
    edit2.getSession().clearAnnotations();
}
export function highlightError(lineNumber, errorMessage, index) {
    console.log(lineNumber, errorMessage);
    var session = edit1.getSession();
    if(index == 2){
        session = edit2.getSession();
    }
    var errorAnnotation = {
        row: lineNumber, // Ace Editor lines are zero-indexed
        column: 0,
        text: errorMessage,
        type: "error"
    };
    // session.
    ErrorArray[index-1].push(errorAnnotation);
    session.setAnnotations(ErrorArray[index-1]);
}

