const console2 = ace.edit(document.querySelector("#console2"), {
    theme:"ace/theme/chaos",
});
const console1 = ace.edit(document.querySelector("#console1"), {
    theme:"ace/theme/chaos",

});

console1.setReadOnly(true);
console2.setReadOnly(true);
const consoles = [console1, console2];
console1.setValue("Read Only");
console2.setValue("Read Only");

export function cprint(str, x){
    consoles[x].insert(str+"\n");
    consoles[x].scrollPageDown();
}


