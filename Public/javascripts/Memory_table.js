import { getHexMem } from "./Processor.js";
const values = ["Address", "Word", "Byte 0", "Byte 1", "Byte 2", "Byte 3"];
for(let i = 0;i<=5;i++){
    document.getElementById("mem-0_"+i+"").value = values[i];
    console.log(document.getElementById("mem-0_"+i+"").value);
}
function decimalToHex32Bit(decimalNumber) {
    // Convert the decimal number to hexadecimal
    var hexString = decimalNumber.toString(16);

    // Pad with leading zeros to ensure 32 bits
    while (hexString.length < 8) {
        hexString = '0' + hexString;
    }
    hexString = '0' + 'x' + hexString;
    return hexString;
}

const row = 10;
let top = 0;
function change_table(){
    if(top>1024-row-1){
        top=1024-row-1;
    }
    if(top<0){
        top=0;
    }
    let tp = parseInt(top);
    console.log(tp, 'mem-' + tp + ',' + 0);
    for(let i = 0; i <= row; i++){
        document.getElementById('mem-' + (i+1) + '_' + 0+"").value = decimalToHex32Bit(268435456 + (i + tp)*4);
        document.getElementById('mem-' + (i+1) + '_' + 1+"").value = "0x"+ getHexMem((i + tp),0) +getHexMem((i + tp),1)+getHexMem((i + tp),2)+getHexMem((i + tp),3);
        document.getElementById('mem-' + (i+1) + '_' + 2+"").value = "0x"+ getHexMem((i + tp),3);
        document.getElementById('mem-' + (i+1) + '_' + 3+"").value = "0x"+ getHexMem((i + tp),2);
        document.getElementById('mem-' + (i+1) + '_' + 4+"").value = "0x"+ getHexMem((i + tp),1);
        document.getElementById('mem-' + (i+1) + '_' + 5+"").value = "0x"+ getHexMem((i + tp),0);
    }
}
function update(event){
    top += (event.deltaY>0?1:-1) * Math.log(Math.abs(event.deltaY)+1) / Math.LN10;
    
    change_table();
}
document.getElementById("memory_id").onwheel = update;
document.getElementById("side_but3").addEventListener('click', change_table);
document.querySelector(".Run").addEventListener('click', change_table);
document.querySelector(".Step_fd").addEventListener('click', change_table);
document.querySelector(".Step_bk").addEventListener('click', change_table);
document.querySelector(".reset").addEventListener('click', change_table);
const strt_val = 300;
let start = strt_val;
function holdit(btn, speedup, min, x) {
    var t;

    var repeat = function () {
        top+=x;
        change_table();
        t = setTimeout(repeat, start);
        start = start / speedup;
        if(start<min) start = min;
    }

    btn.onmousedown = function() {
        repeat();
    }

    btn.onmouseup = function () {
        start = strt_val;
        clearTimeout(t);
    }
};
document.getElementById("mem_top").addEventListener('click', ()=>{
    top = 0;
    change_table();
});
document.getElementById("mem_bottom").addEventListener('click', ()=>{
    top = Infinity;
    change_table();
});
holdit(document.getElementById("mem_up"), 2, 60, -1);
holdit(document.getElementById("mem_down"), 2, 60, 1);