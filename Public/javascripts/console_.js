const console2 = ace.edit(document.querySelector("#console2"), {
    theme:"ace/theme/chaos",
});
const console1 = ace.edit(document.querySelector("#console1"), {
    theme:"ace/theme/chaos",

});
//
console1.setReadOnly(true);
console2.setReadOnly(true);
const consoles = [console1, console2];
console1.insert("Read Only\n");
console2.insert("Read Only\n");

export function cprint(str, x){
    const lastRow = consoles[x].session.getLength() - 1;
    const lastColumn = consoles[x].session.getLine(lastRow).length;
    consoles[x].moveCursorTo(lastRow, lastColumn);
    consoles[x].selection.clearSelection();
    consoles[x].insert(str+"\n");
    consoles[x].scrollPageDown();
    consoles[x].setHighlightSelectedWord(true);
}

export function focus(){
    console1.insert("");
    console2.insert("");
}

