import Core from "./Core.js"
import { getValue1, getValue2 } from "./editor.js";


class Processor {
    constructor() {
        this.memory = new Array(2 ** 5).fill(0);
        this.clock = 0;
        this.cores = [new Core(1), new Core(2)];
        this.freeMemInitial = 0;
        this.freeMemfinal = 2**5 -1;
    }
    init(instructSet1, instructSet2) {
        console.log(instructSet1);
        console.log(instructSet2);
        this.CoreInstructions = [];
        this.CoreInstructions[0] = instructSet1;
        this.CoreInstructions[1] = instructSet2;
        this.set(0);
        this.set(1);
        console.log(instructSet2);
        console.log("----------------------");
        // var queue = [];
    }
    parseDirective(directive) {
        
        switch (directive[0].split('.')[1]) {
            
            case "zero":
            let size = parseInt(directive[1]);
            if(this.freeMemInitial+size < this.freeMemfinal)
            {
                let arr = new Array(size).fill(0);
                this.memory.splice(freeMemInitial, arr.length, ...arr);
                this.freeMemInitial += size;
            }
            break;

            case "word": //handles .word 0x1000,0x1111, 0x101,...
            let i=1; 
            while(i<directive.length)
            {
                this.memory[this.freeMemInitial]= parseInt(directive[i],16);
                this.freeMemInitial++;
                i++;
            }
            break;
          
            default:
            
          break;
        }

    }
    set(x) {// labels handelled
        /*
            base: .word 0x10000000
            arr: .zero 80 -> done!!!
            str:  .string " "
            str2:  .string "Before sorting : \n"
            str3:  .string "After sorting : \n"
            str1: .string "\n"
        */ 
        let labels = {};
        for (let i = 0; i < this.CoreInstructions[x].length; i++) {
            
            if (this.CoreInstructions[x][i].includes(':')) {
                
                var instruct = this.#split(this.CoreInstructions[x][i]);
                
                let k = instruct[0].split(':')[0];
                
                if (k.toLowerCase().includes('base:')) {//check if its a base instruction....
                
                    instruct = this.#split(this.CoreInstructions[x][i]);
                    labels[k] =i;
                    this.freeMemInitial= parseInt(instruct[2],16);
                }
                else if(instruct[1])//check if later half exists...
                {
                    if (instruct[1]==".string") {
                        var string = "";
                        let j=0;
                        while(j<instruct[2].length)
                        {
                            if(instruct[2][j]=="\"")
                            {
                                j++;
                                continue;
                            }
                            string+=instruct[2][j];
                        }
                        
                    }
                    else if(instruct[1].includes('.'))
                    {
                        this.parseDirective(instruct.slice(1));// sends part of array starting from 1st index till end to parseDirectives.
                    }
                }
                this.CoreInstructions[x][i] = k;
                labels[k] = i+1;
                console.log(`Instruction parsed is now ${this.CoreInstructions[x][i]} at ${labels[k]}`);
            }
            else if(this.CoreInstructions[x][i].includes('.word'))//handles .word written directly....
            {
                this.parseDirective(this.#split(this.CoreInstructions[x][i]));
            }
        }
        this.cores[x].labels = labels;
    }
    run() {
        // if statement for string end for both
        if (this.cores[0].pc < this.CoreInstructions[0].length) {
            this.cores[0].execute(this.CoreInstructions[0][this.cores[0].pc]);
        }
        if (this.cores[1].pc < this.CoreInstructions[1].length) {
            this.cores[1].execute(this.CoreInstructions[1][this.cores[1].pc]);
        }
    }
    play() {
        while (this.cores[0].pc < this.CoreInstructions[0].length || this.cores[1].pc < this.CoreInstructions[1].length) {
            console.log(`the reg 2  is ${this.cores[0].register[2]} & 1 is is ${this.cores[0].register[1]}\n`);
            this.run(); 
        }
    }
    static setBus(value, address) {
        if (address) {
            this.memory[address] = value;
        }
    }
    static getBus(address) {
        if (address) {
            return this.memory[address];
        }
    }
    #split(s) {
        let i = 0;
        let a = [];
        let j = 0;
        while (i < s.length) {
          let s1 = "";
          while (s.charAt(i) !== " " && s.charAt(i) !== "," && i < s.length) {
            s1 += s[i++];
          }
          if (s1 === " " || s1 === "," || s1 === "") {
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
// const reset = document.getElementById("restart");

reset.addEventListener('click', () => {
    for (let i = 0; i < 31; i++) {
        const reg1Update = document.getElementById(`reg1Text${i}`);
        const reg2Update = document.getElementById(`reg2Text${i}`);
        reg1Update.value = "0";
        reg2Update.value = "0";
    }
})

run.addEventListener('click', function Fun1() {
    console.log("buff");
    initialization();
    p.play();
})

step.addEventListener('click', function Fun1() {
    initialization();
    p.run();
})

export default Processor;
// p.run();