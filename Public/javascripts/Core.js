import Instruction from "./Instruction.js";
import {getBus, setBus} from "./Processor.js";
class Core {
    constructor(num) {
        this.register = new Array(32).fill(0);
        this.pc = 0;
        this.flag = num;
        this.labels = {};
    }
    
    execute(instruction) {
        const object = new Instruction(instruction);
        console.log(object.type);
        switch (object.type) {
            case "srli":
                console.log("FOund");
                this.srli(object);
                break;
            case "and":
                this.and(object);
                break;
            case "add":
                this.add(object);
                break;
            case "sub":
                this.sub(object);
                break;
            case "addi":
                this.addi(object);
                break;
            case "lw":
                this.lw(object);
                break;
            case "sw":
                this.sw(object);
                break;
            case "la":
                this.la(object);
                break;
            case "li":
                li(object);
                break;
            case "beq":
                this.beq(object);
                break;
            case "bne":
                this.bne(object);
                break;
            case "bgt":
                this.bgt(object);
                break;
            case "blt":
                this.blt(object);
                break;
            case "bgeu":
                this.bgeu(object);
                break;
            case "bltu":
                this.bltu(object);
                break;
            case "jalr":
                this.jalr(object);
                break;
            case "jal":
                this.jal(object);
                break;
            case "j":
                this.j(object);
                break;
            case "jr":
                this.jr(object);
                break;
            default:
                console.log("Instruction not found");
                console.log("---+++++++++++++++++++");
                break;
        }
        this.register[0] = 0;
        this.writeBack(object);
        this.pc += 1;
    }

    writeBack(object) {// writes to the front end ...

        if ((object.type !== "sw"  && object.type !== "lw") && object.rd) {
            if (object.rd != 0) {
                const regUpdate = document.getElementById(`reg${this.flag}Text${object.rd}`);
                regUpdate.value = this.register[object.rd];
                console.log(this.register[object.rd]);
                console.log(`reg${this.flag}Text${object.rd}`);
                console.log("ajskdkjsbdsjkckbdkbdsb");
            }
        }
        else if (object.type === "lw") {
            // will store the word
            const regUpdate = document.getElementById(`reg${this.flag}Text${object.rd}`);
            console.log(this.register[object.rd]);
            console.log(object.rd);
            regUpdate.value = this.register[object.rd];
        }
    }
    and(instructionObj)
    {
        this.register[instructionObj.rd] = this.register[instructionObj.rs1] & this.register[instructionObj.rs2];
    }
    srli(instructionObj)
    {
        this.register[instructionObj.rd] = (this.register[instructionObj.rs1])>>(instructionObj.imd);

        // printing
        console.log(this.register[instructionObj.rd]);
        console.log("=============");
        console.log(this.register[instructionObj.rs1]>>instructionObj.imd);
    }
    add(instructionObj) {
        this.register[instructionObj.rd] = this.register[instructionObj.rs1] + this.register[instructionObj.rs2];
    }
    sub(instructionObj) {
        this.register[instructionObj.rd] = this.register[instructionObj.rs1] - this.register[instructionObj.rs2];
    }
    addi(instructionObj) {
        this.register[instructionObj.rd] = this.register[instructionObj.rs1] + instructionObj.imd;
    }
    lw(instructionObj) {
        //lw x1 4(x2) rd -> x1, rs1 -> x2 , imd ->4
        if(instructionObj.imd !=undefined){
            let val =this.register[instructionObj.rs1]/4 + instructionObj.imd/4;
            console.log(this.register[instructionObj.rs1]/4 + instructionObj.imd/4);
            console.log(instructionObj.rd);
            console.log("1234567890-");
            
            this.register[instructionObj.rd] = getBus(val);
            console.log(this.register[instructionObj.rd]);
        }else{
            
            this.register[instructionObj.rd] = getBus(this.labels[instructionObj.label]);
        }
    }
    sw(instructionObj) {
        //sw x1 0(x2) rs1 -> x1, rs2 -> x2 , imd ->0
        let val = this.register[instructionObj.rs1];
        // this.register[instructionObj.rs2 + instructionObj.imd] = this.register[instructionObj.rs1];
        console.log(instructionObj.rs1);
        setBus(this.register[instructionObj.rs2]/4 + instructionObj.imd/4, val);
    }
    li(instructionObj) {
        this.register[rd] = instructionObj.imd;
    }
    la(instructionObj) {
        this.register[rd] = instructionObj.imd;
    }
    beq(instructionObj) {
        if (this.register[instructionObj.rs1] == this.register[instructionObj.rs2]) {
            this.pc = this.labels[instructionObj.label];
        }
    }
    bne(instructionObj) {
        if (this.register[instructionObj.rs1] != this.register[instructionObj.rs2]) {
            this.pc = this.labels[instructionObj.label];
            console.log(this.pc);
        }
    }
    bgt(instructionObj) {
        console.log("====================================================");
        console.log(this.register[instructionObj.rs1]);
        console.log(this.register[instructionObj.rs2]);
        if (this.register[instructionObj.rs1] >= this.register[instructionObj.rs2]) {
            this.pc = this.labels[instructionObj.label];
            console.log(this.pc);
        }
    }
    blt(instructionObj) {
        if (this.register[instructionObj.rs1] < this.register[instructionObj.rs2]) {
            this.pc = this.labels[instructionObj.label];
        }
    }
    bgeu(instructionObj) {
        if (this.register[instructionObj.rs1] >= this.register[instructionObj.rs2]) {
            this.pc = this.labels[instructionObj.label];
        }
    }
    bltu(instructionObj) {
        if (this.register[instructionObj.rs1] < this.register[instructionObj.rs2]) {
            this.pc = this.labels[instructionObj.label];
        }
    }
    
    li(instructionObj) {
        // this.rd = this.#valueof(components[1]);
        // this.imd = parseInt(components[2]);
        this.register[instructionObj.rd] = instructionObj.imd;
    }
    jal(instructionObj) {
        debugger;
        this.register[instructionObj.rs1] = this.pc + 1;//as insturctions are stored as arrays.... so pc + 1 is req
        this.pc = this.labels[instructionObj.label];
    }
    j(instructionObj) {
        this.pc= this.labels[instructionObj.label];
    }
}

export default Core;