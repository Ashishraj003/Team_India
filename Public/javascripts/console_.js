// defining ace theme
ace.define("ace/mode/console", function (require, exports, module) {
    'use strict';

    var oop = require("ace/lib/oop");
    var TextMode = require("ace/mode/text").Mode;
    var TextHighlightRules = require("ace/mode/text_highlight_rules").TextHighlightRules;

    var RISCHighlightRules = function () {
        this.$rules = {
            "start": [
                {
                    token: "keyword",
                    regex: "\:"
                },
                {
                    token: "string",
                    regex: "\\b(?:0x[0-9A-Fa-f]+|0b[01]+|\\d+)\\b"
                },
                {
                    token: "function",
                    regex: "\\b(?:Read Only)\\b",
                    
                }
                // ,
                // {
                //     token: "function",
                //     regex: "\\b(?:the number of cycle are|the number of stalls are|the value of IPC is|The value of CPI is|No. of misses|No. of access|Missrate)\\b",
                    
                // }
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


const console2 = ace.edit(document.querySelector("#console2"), {
    theme:"ace/theme/chaos",
    mode: "ace/mode/console",
});
const console1 = ace.edit(document.querySelector("#console1"), {
    theme:"ace/theme/chaos",
    mode: "ace/mode/console",

});

var t = ["\n %c %c %c WELCOME "  + " - ✰ "  + " ✰  %c  %c  https://github.com/Ashishraj003/Team_India  %c TEAM %c INDIA \n\n", "background: brown; padding:5px 0;", "background: #efc6c6; padding:5px 0;", "color: brown; background: #efc6c6; padding:5px 0;", "background: brown; padding:5px 0;", "background: rgb(46, 46, 46); padding:5px 0;", " color: #efc6c6; background: brown; padding:5px 0;", "color: brown; background: #efc6c6; padding:5px 0;"];
console.log.apply(console, t);
//
console1.setReadOnly(true);
console2.setReadOnly(true);
const consoles = [console1, console2];
console1.insert("\n");
console2.insert("\n");

export function cprint(str, x){
    const lastRow = consoles[x].session.getLength() - 1;
    const lastColumn = consoles[x].session.getLine(lastRow).length;
    consoles[x].moveCursorTo(lastRow, lastColumn);
    consoles[x].selection.clearSelection();
    consoles[x].insert(str+"\n");
    consoles[x].scrollPageDown();
    consoles[x].setHighlightSelectedWord(true);
}
export function cprintstr(str, x){
    const lastRow = consoles[x].session.getLength() - 1;
    const lastColumn = consoles[x].session.getLine(lastRow).length;
    consoles[x].moveCursorTo(lastRow, lastColumn);
    consoles[x].selection.clearSelection();
    consoles[x].insert(str+" ");
    consoles[x].scrollPageDown();
    consoles[x].setHighlightSelectedWord(true);
}

export function focus(){
    console1.insert("");
    console2.insert("");
}



