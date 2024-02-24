import Core from "./Core.js"
import { getValue1, getValue2, ChangeColor1, ChangeColor2, EnableEdit, DisableEdit } from "./editor.js";
//

class Processor {
    constructor() {
        this.memory = [];
        for (let i = 0; i < 1024; i++) {
            this.memory.push(0);
        }
        this.clock = 0;
        this.cores = [new Core(1), new Core(2)];
        this.freeMemInitial = 0;
        this.freeMemfinal = 2 ** 12 - 1;
        this.pcs = [-1, -1]; //pc start
        this.strings = {};
    }
    init(instructSet1, instructSet2) {
        console.log(instructSet1);
        console.log(instructSet2);
        this.CoreInstructions = [];
        this.pcs = [-1, -1]; //pc start
        this.strings = {};
        for (let i = 0; i < 1024; i++) {
            this.memory[i] = 0;
        }
        this.freeMemInitial = 0;
        this.CoreInstructions[0] = instructSet1;
        this.CoreInstructions[1] = instructSet2;
        this.set(0);
        this.set(1);
        this.cores[0].pc = this.pcs[0];
        this.cores[1].pc = this.pcs[1];
        console.log(instructSet2);
        console.log("----------------------");
        // var queue = [];
    }
    parseDirective(directive) {
        console.log(directive[0].split('.')[1]);
        console.log("................");

    }
    // arr: .zero 80
    // to parse .word etc... base: .word 0x1000000.
    // arr: is handled in porcessor.js
    set(x) {// labels handelled
        /*
            base: 
            arr: .zero 80 -> done!!!
            str:  .string " "
            str2:  .string "Before sorting : \n"
            str3:  .string "After sorting : \n"
            str1: .string "\n"
        */
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

            if (this.CoreInstructions[x][i].includes(':') && this.pcs[x] != -1) {
                // var instruct = this.#split(this.CoreInstructions[x][i]);

                let k = this.CoreInstructions[x][i].split(':')[0].replaceAll(" ", "");

                this.CoreInstructions[x][i] = k;
                this.cores[x].labels[k] = i;
                console.log(`Instruction parsed is now ${this.CoreInstructions[x][i]} at ${this.cores[x].labels[k]}`);
            }
        }

        // for .data

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
                console.log(string);
                this.strings[label] = string;
            }
            else if (instruct[0] && instruct[0].includes('.')) {

                console.log(instruct[0].split('.')[1]);

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
                            if (instruct[i].includes('0x')) {
                                this.memory[this.freeMemInitial] = parseInt(instruct[i].split('0x')[1], 16);
                            } else {
                                this.memory[this.freeMemInitial] = parseInt(instruct[i], 10);
                            }
                            this.freeMemInitial += 1;
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
        // if statement for string end for both
        if (!this.CoreInstructions) {
            initialization();
        }
        // setTimeout(1000);s
        ChangeColor1(this.cores[0].pc);

        if (this.cores[0].pc < this.CoreInstructions[0].length) {
            this.cores[0].execute(this.CoreInstructions[0][this.cores[0].pc].replaceAll('\r', ''));
        }
        ChangeColor2(this.cores[1].pc);
        if (this.cores[1].pc < this.CoreInstructions[1].length) {
            this.cores[1].execute(this.CoreInstructions[1][this.cores[1].pc].replaceAll('\r', ''));
        }

    }
    play() {

        this.cores[0].pc = this.pcs[0];
        this.cores[1].pc = this.pcs[1];
        let cnt = 0;
        while (this.cores[0].pc < this.CoreInstructions[0].length || this.cores[1].pc < this.CoreInstructions[1].length) {
            console.log(`the reg 2  is ${this.cores[0].register[2]} & 1 is is ${this.cores[0].register[1]}\n`);
            this.run();
            // if (cnt > 5000) {
            //     break;
            // }
            // cnt++;
        }
        console.log(this.memory);
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
            console.log(s1);
            a[j++] = s1;
            i++;
        }
        console.log(a);
        return a;
    }
}

// export default Processor;
const s = document.querySelector('#mytextarea');
const p = new Processor();
// p.init([s], [s]);
console.log("ashish hello");
const run = document.querySelector(".Run");
const step = document.querySelector(".Step_fd");


function initialization() {
    const a1 = getValue1();
    const a2 = getValue2();
    const alist1 = a1.split('\n');
    const alist2 = a2.split('\n');
    // console.log(alist1);
    // console.log(alist2);
    p.init(alist1, alist2);
}


const reset = document.querySelector(".reset");
const edt = document.querySelector(".editBtn");
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
    console.log("buff");
    initialization();
    p.play();
})

step.addEventListener('click', function Fun1() {
    DisableEdit();
    p.run();
})

export function setBus(address, value) {
    console.log(address);
    console.log(value);
    p.setmem(value, address);
}
export function getBus(address) {

    console.log(address);
    console.log(p.getmem(address));

    return p.getmem(address);

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