import Core from "./Core.js"
import { getValue, EnableEdit, DisableEdit } from "./editor.js";
import {cprint} from "./console_.js";
import Cache from "./cache.js";
import {update} from "./diagram.js";
import { createTable } from "./CacheTable.js";
class Processor {
    constructor() {
        this.memory = [];
        for (let i = 0; i < 1024; i++) {
            this.memory.push(0);
        }
        this.clock = 0;
        this.cache = new Cache();
        this.cores = [new Core(1), new Core(2)];
        this.freeMemInitial = 0;
        this.freeMemfinal = 2 ** 12 - 1;
        this.pcs = [-1, -1]; //pc start
        this.strings = {};
        document.querySelector(".forward_input").addEventListener("click", ()=>{
            if(this.cores[0].EnableForwarding){ 
                this.cores[0].EnableForwarding=false;
                this.cores[1].EnableForwarding = false;
            }else{
                this.cores[0].EnableForwarding=true;
                this.cores[1].EnableForwarding = true;
            }

        });
    }
    init(instructSet1, instructSet2) {

        this.CoreInstructions = [];
        this.pcs = [-1, -1]; //pc start execution after .text 
        this.strings = {};
        for (let i = 0; i < 1024; i++) {
            this.memory[i] = 0;
        }
        this.freeMemInitial = 0;
        this.cache.init();
        this.CoreInstructions[0] = instructSet1;
        this.CoreInstructions[1] = instructSet2;
        this.set(0);
        this.set(1);
        this.cores[0].Initialize(this.CoreInstructions[0], this.pcs[0],this.cache);
        this.cores[1].Initialize(this.CoreInstructions[1], this.pcs[1],this.cache);
    }



    set(x) {// labels handelled here
        /*
            base: 
            arr: .zero 80 -> done!!!
            str:  .string " "
            str2:  .string "Before sorting : \n"
            str3:  .string "After sorting : \n"
            str1: .string "\n"
        */
        
        console.log(this.cores[x].EnableForwarding);
        for (let i = 0; i < this.CoreInstructions[x].length; i++) {
            
            if (this.CoreInstructions[x][i].includes('#')) {
                this.CoreInstructions[x][i] = this.CoreInstructions[x][i].split('#')[0];
            }

            if (this.CoreInstructions[x][i].includes('.text') && this.pcs[x] == -1) {
                this.pcs[x] = i + 1;
            }
        }
        if (this.pcs[x] == -1) {
            this.pcs[x] = 0;
        }

        for (let i = this.pcs[x]; i < this.CoreInstructions[x].length; i++) {
            this.CoreInstructions[x][i] = this.CoreInstructions[x][i].replaceAll("  ", " ");
            if (this.CoreInstructions[x][i].includes(':') && this.pcs[x] != -1) {
                let temp = this.CoreInstructions[x][i].split(':');
                let k = temp[0].replaceAll(" ", "");
                this.CoreInstructions[x][i]= temp[1];
                this.cores[x].labels[k] = i;
            }
        }
        for (let i = 0; i < this.pcs[x]; i++) {
            let instruct = this.CoreInstructions[x][i];
            let label = "+";
            // 003 no instruct[0]
            if (!instruct) {
                continue;
            }

            if (instruct.includes(':')) {//check if its a base instruction....
                label = instruct.split(':')[0].replaceAll(" ", '');

                instruct = instruct.split(':')[1];
            }

            instruct = this.#split(instruct.replaceAll('\r', ''));
            //check if later half exists...

            if (instruct[0] && instruct[0].replaceAll(".", "") === "string") {
                string = instruct[1].replaceAll('\"', "");
                this.strings[label] = string;
            }
            else if (instruct[0] && instruct[0].includes('.')) {
                switch (instruct[0].split('.')[1]) {

                    case "zero":
                        if (label != "+") {
                            this.cores[x].labels[label] = parseInt(this.freeMemInitial);
                        }
                        let size = parseInt(instruct[1]);
                        if (this.freeMemInitial + size < this.freeMemfinal) {
                            let array = [];
                            for (let i = 0; i < size; i++) {
                                array.push(0);
                            }
                            this.memory.splice(this.freeMemInitial, array.length, ...array);
                            this.freeMemInitial += size;
                        }
                        break;

                    case "word":
                        let i = 1;
                        // 003 kept label inside if
                        if (label != "+") {
                            this.cores[x].labels[label] = parseInt(this.freeMemInitial);
                        }

                        while (i < instruct.length) {
                            if (instruct[i].includes('0x1')) {
                                this.memory[this.freeMemInitial] = parseInt(instruct[i].split('0x1')[1], 16);
                            // }else if (instruct[i].includes('0x')) {
                            //     this.memory[this.freeMemInitial] = parseInt(instruct[i].split('0x')[1], 16);
                            } else {
                                this.memory[this.freeMemInitial] = parseInt(instruct[i], 10);
                            }
                            this.freeMemInitial++;
                            i++;
                        }

                        break;

                    default:

                        break;
                }
            }

        }
    }
    run() {
        if (!this.CoreInstructions){
            initialization();
        }
        if(!this.cores[0].End){
            this.cores[0].execute();
        }
        if (!this.cores[1].End){
            this.cores[1].execute();
        }
    }
    play() {
        this.cores[0].fast = true;
        this.cores[1].fast = true;

        // debugger;
        while (!this.cores[0].End || !this.cores[1].End) {
            this.run();
        }
        this.cores[0].ipc = this.cores[0].NumberofInstructions/(this.cores[0].numberofCycles);
        this.cores[1].ipc = this.cores[1].NumberofInstructions/(this.cores[1].numberofCycles);
        cprint("Number of instruction are: "+this.cores[0].NumberofInstructions,0);
        cprint("the number of cycle are: "+this.cores[0].numberofCycles,0);
        cprint("the number of stalls are: "+(this.cores[0].numberofCycles-this.cores[0].NumberofInstructions-4),0);
        cprint("Number of instruction are: "+this.cores[1].NumberofInstructions,1);
        cprint("the number of cycle are: "+this.cores[1].numberofCycles, 1);
        cprint("the number of stalls are: "+(this.cores[1].numberofCycles-this.cores[1].NumberofInstructions-4),1);
        
        cprint("the value of IPC is: "+this.cores[0].ipc+"\nThe value of CPI is: "+1/this.cores[0].ipc,0);
        cprint("the value of IPC is: "+this.cores[1].ipc+"\nThe value of CPI is: "+1/this.cores[1].ipc,1);
        cprint("No. of misses : " + (this.cache.misses), 0);
        cprint("No. of misses : " + (this.cache.misses), 1);
        cprint("No. of access : " + (this.cache.acceses), 0);
        cprint("No. of access : " + (this.cache.acceses), 1);
        cprint("Missrate : " + (this.cache.misses/this.cache.acceses), 0);
        cprint("Missrate : " + (this.cache.misses/this.cache.acceses), 1);

        
        
        update(this.cores[0].pip_data, this.cores[0].pcs);
        createTable(this.cache.storage);
        if(this.cache.acceses != 0){
            document.querySelector("#miss").innerText = "No. of misses : " + (this.cache.misses);
            document.querySelector("#access").innerText = "No. of access : " + (this.cache.acceses);
            document.querySelector("#missrate").innerText = "No. of misses : " + (this.cache.acceses/this.cache.misses);
        }
        // console.log(this.cores[0].pip_data);
        console.log(this.cache.storage);
    }
    setmem(value, address) {
        this.memory[address] = value;
    }
    getmem(address) {
        return this.memory[address];
    }

    //  remove "," " " and return array of instructions  
    #split(s) {
        let i = 0;
        let a = [];
        let j = 0;
        while (i < s.length) {
            let s1 = "";
            while (s.charAt(i) !== " " && s.charAt(i) !== "," && i < s.length) {
                s1 += s[i++];
            }
            // extra " " and ","
            if (s1 === "") {
                i++;
                continue;
            }
            a[j++] = s1;
            i++;
        }
        return a;
    }
}

// export default Processor;
const s = document.querySelector('#mytextarea');
const p = new Processor();
const run = document.querySelector(".Run");
const step = document.querySelector(".Step_fd");
const reset = document.querySelector(".reset");
const edt = document.querySelector(".editBtn");
const blk_size_input = document.getElementById("block_size_input");
const cache_size_input = document.getElementById("cache_size_input");
const mem_latency_input = document.getElementById("mem_latencyVal");
const cache_latency_input = document.getElementById("cache_latencyVal");
const associative_input = document.getElementById("associativity");
const policy_input = document.getElementById("policy");

blk_size_input.onchange = function(){
    p.cache.blockSize = blk_size_input.value;
    check(p.cache.size, p.cache.associativity, blk_size_input.value);
};
cache_size_input.onchange = function(){
    p.cache.size = cache_size_input.value;
    check(cache_size_input.value, p.cache.associativity, p.cache.blockSize);
};
associative_input.onchange = function(){
    let temp = associative_input.value;
    if(temp == 100){
        temp = p.cache.size/p.cache.blockSize;
    }
    p.cache.associativity = temp;
    check(p.cache.size, temp, p.cache.blockSize);
};
policy_input.onchange = function(){
    p.cache.replacementPolicy=policy_input.value;
};
mem_latency_input.value = p.cache.memoryLatency;
cache_latency_input.value = p.cache.cacheLatency;
associative_input.value = p.cache.associativity;
// console.log(p.cache.size/p.cache.blockSize);
cache_size_input.value = p.cache.size;
blk_size_input.value = p.cache.blockSize;
mem_latency_input.onchange = function(){
    p.cache.memoryLatency = mem_latency_input.value;
};
cache_latency_input.onchange = function(){
    p.cache.cacheLatency = cache_latency_input.value;
};
function initialization() {
    const a1 = getValue(1);
    const a2 = getValue(2);
    const alist1 = a1.split('\n');
    const alist2 = a2.split('\n');
    p.init(alist1, alist2);
}

edt.addEventListener("click", () => {
    initialization();
    EnableEdit();
});
reset.addEventListener('click', () => {
    for (let i = 0; i < 31; i++) {
        const reg1Update = document.getElementById(`reg1Text${i}`);
        const reg2Update = document.getElementById(`reg2Text${i}`);
        reg1Update.value = "0";
        reg2Update.value = "0";
    }
    initialization();
    EnableEdit();
})

run.addEventListener('click', function Fun1() {
    initialization();
    p.play();
})

step.addEventListener('click', function Fun1() {
    DisableEdit();
    p.run();
})
function check(size, associativity, blocksize){
    console.log(size, associativity, blocksize);
    if(size/blocksize < associative_input.value && associative_input.value!=100){
        p.cache.associativity = p.cache.blockSize;
        associative_input.value = 1;
    }
}
export function setBus(address, value) {
    p.setmem(value, address);
}
export function getBus(address) {
    return p.getmem(address);
}
export function getpipeline(id){
    return p.cores[id].pip_data;
}
export function getpcs(id){
    return p.cores[id].pcs;
}
export function getHexMem(address, byte) {
    // Convert the decimal number to hexadecimal
    let num = p.getmem(address);

    var hexString = num.toString(16);

    // Pad with leading zeros to ensure 32 bits
    while (hexString.length < 8) {
        hexString = '0' + hexString;
    }
    hexString = hexString;

    return hexString.charAt(2 * byte) + hexString.charAt(2 * byte + 1);
}
export default Processor;
// p.run();