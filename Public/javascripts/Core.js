import Instruction from "./Instruction.js";
import { getBus, setBus } from "./Processor.js";
import { cprint } from "./console_.js";
import { ChangeColor , highlightError} from "./editor.js";
import Predictor from "./Predictor.js";
import Cache from "./cache.js";
function IfBranch(type) {
    if (type == "bne" || type == "beq" || type == "blt" || type == "bgtu" || type == "bltu" || type == "bgt") {
        return true;
    }
    return false;
}
const Message = ["Type Undefined", "Incorrect Register", "Incorrect Imediate value", "Label not-defined", "Incorrect syntax", "Label not correct"]
class Core {
    constructor(num) {
        this.id = num;
        this.regUpdateArr = new Array(32);
        for (let i = 0; i < 32; i++) {
            this.regUpdateArr[i] = document.getElementById(`reg${this.id}Text${i}`);
        }
        this.labels = {};
        this.EnableForwarding = false;
        this.predictor = new Predictor();
    }
    Initialize(CoreInstructions, pcs, cache) {
        
        this.ipc = 0;
        this.fast = false;
        this.register = new Array(32).fill(0);
        this.Active_reg = new Array(32).fill(0);
        this.line_no = {};
        this.InstructionMap = {};
        this.instructions = [];
        this.instruction_pc = [0,0,0,0,0];
        this.preforwarding = {};
        this.pc = -1;
        this.pcs = pcs;
        this.cache = cache;
        this.pip_data = [];
        // console.log(pcs);
        this.End = false;
        this.NumberofInstructions = 0;
        this.TotalInstuctionsLenght = CoreInstructions.length;
        this.numberofCycles = 0;
        this.cacheStallCycles1 = 0;
        this.cacheStallCycles = 0;
        this.mappc = {};
        this.error = false;
        for (let z = 1; z < 6; z++)
            ChangeColor(-1, this.id, z);
        let j = 0;
        for (let i = pcs; i < CoreInstructions.length; i++) {
            let instruct = new Instruction(CoreInstructions[i]);
            if(instruct.label && !this.labels[instruct.label]){
                instruct.error[3] = true;// label does not exist
            }
            instruct.pc = i;
            if (instruct.type == undefined) {
                continue;
            }
            if(this.pc === -1){
                this.pc = j;
            }
            for(let er = 0; er < instruct.error.length ;er++){
                if(instruct.error[er]){
                    // console.log(instruct);
                    this.#ShowError(i, er);
                    this.error = true;
                }
            }
            // if(this.error){
            //     break;
            // }
            this.mappc[i] = j;
            this.InstructionMap[j++] = instruct;
        }
    }
    #ShowError(lineNo, Error){
        highlightError(lineNo, Message[Error], this.id);
    }
    #ShowAlert(){
        alert("There is an Error Run terminated");
    }
    update_textHiglight(){
        if(this.instruction_pc[0])
        ChangeColor(this.instruction_pc[0], this.id, 1);
        if(this.instruction_pc[1])
        ChangeColor(this.instruction_pc[1], this.id, 2);
        if(this.instruction_pc[2])
        ChangeColor(this.instruction_pc[2], this.id, 3);
        if(this.instruction_pc[3])
        ChangeColor(this.instruction_pc[3], this.id, 4);
        if(this.instruction_pc[4])
        ChangeColor(this.instruction_pc[4], this.id, 5);
    }
    execute() {
        if(this.error){
            this.End = true;
            this.#ShowAlert();
            return;
        }
        // cprint(this.instructions, this.id-1); //prints instructions on console 
        // this.cache.check();
        while (this.#CheckEmptyLine()) {
            
            this.pc++;
        }
        this.End = this.#CheckEnd();
        if (this.End) {
            return;
        }

        this.numberofCycles++;
        // console.log(this.TotalInstuctionsLenght - this.pcs + 1);
        this.pip_data.push(new Array(this.TotalInstuctionsLenght));
        if (!this.#writeBack()) {
            return;
        }
        if (!this.#Memory()) {
            return;
        }
        if (!this.#execute()) {
            return;
        }
        if(this.branchTaken)
            {
                this.branchTaken=false;
                this.instructions[0]=undefined;
                // this.NumberofInstructions++;
                return;
            }
        if (!this.#DecodeRegisterFetch()) {
            return;
        }
        if (!this.#InstructionFetch()) {
            return;
        }

        this.pc++;
        this.End = this.#CheckEnd();

    }
    #CheckEmptyLine() {
        if (this.TotalInstuctionsLenght > this.pc && this.InstructionMap[this.pc] == undefined) {
            return true;
        }
        return false;
    }
    #CheckEnd() {
        if (this.TotalInstuctionsLenght > this.pc) return false;
        for (let i = 0; i < this.instructions.length; i++) {
            if (this.instructions[i] != undefined) {
                return false;
            }
        }
        return true;
    }
    #InstructionFetch() {
        while (this.#CheckEmptyLine()) {
            this.pc++;
        }
        

        const object = this.InstructionMap[this.pc];
        if (object) {


            object.latency_var = object.latency;
            // cprint(object.type, this.id-1);
            // cprint(this.pc, this.id-1);
            this.pip_data[this.pip_data.length - 1][object.pc - this.pcs] = "IF";
            this.instruction_pc[0] = object.pc;
            if (!this.fast)
                ChangeColor(object.pc, this.id, 1);
       }
        if (this.cacheStallCycles != 0) {
            this.NumberofStalls++;
            this.cacheStallCycles--;
            if (this.cacheStallCycles != 0) {
                return false;
            }
        }
        else {
            this.cacheStallCycles = this.cache.fetchVal(this.pc * 4 + (this.id - 1) * 16777216);//this handles storage of pc as well as returns stall cycles
            this.cache.storeVal(this.pc * 4 + (this.id - 1) * 16777216);
            if (this.cacheStallCycles != 0) {
                this.NumberofStalls++;
                this.cacheStallCycles--;
                if (this.cacheStallCycles != 0) {
                    return false;
                }
            }
        }
        this.cacheStallCycles = 0;
        //we will pass the pc to cache and it will return the clock cycles to stall...
        this.cache.storeVal(this.pc * 4 + (this.id - 1) * 16777216);

        if (this.instructions.length > 0) {
            this.instructions[0] = object;
        } else {
            this.instructions.push(object);
        }
        if (this.instructions[0] != undefined && IfBranch(this.instructions[0].type)) {
            if (this.predictor.predict(this.pc))//branch taken
            {
                this.pc = this.#pcfinder(this.labels[this.instructions[0].label]);
            }
        }
        return true;
    }
    #DecodeRegisterFetch() {
        let reg1 = 0;
        let reg2 = 0;

        if (this.instructions[0] == undefined)
            return true;
        //this else if is for pipeline forwardings....
        this.pip_data[this.pip_data.length - 1][this.instructions[0].pc - this.pcs] = "ID/Rf";
        this.instruction_pc[1] = this.instructions[0].pc;
        if (!this.fast)
            ChangeColor(this.instructions[0].pc, this.id, 2);
        if (this.instructions[0].rs1 != undefined && this.Active_reg[this.instructions[0].rs1] != 0) {
            if (!this.EnableForwarding) {
                this.NumberofStalls++;
                return false;
            }
            else {
                if (this.preforwarding[this.instructions[0].rs1] != undefined) {
                    this.instructions[0].rsval1 = this.preforwarding[this.instructions[0].rs1];
                    reg1++;
                }
                else {
                    this.NumberofStalls++;
                    return;
                }
            }
        }
        if (this.instructions[0].rs2 != undefined && this.Active_reg[this.instructions[0].rs2] != 0) {
            if (!this.EnableForwarding) {
                this.NumberofStalls++;
                return false;
            }
            else {
                if (this.preforwarding[this.instructions[0].rs2] != undefined) {
                    this.instructions[0].rsval2 = this.preforwarding[this.instructions[0].rs2];
                    reg2++;
                }
                else {
                    this.NumberofStalls++;
                    return;
                }
            }
        }

        if (this.instructions[0].rs1 != undefined && reg1 == 0) {

            this.instructions[0].rsval1 = this.register[this.instructions[0].rs1];
            reg1++;
        }
        if (this.instructions[0].rs2 != undefined && reg2 == 0) {
            this.instructions[0].rsval2 = this.register[this.instructions[0].rs2];
            reg2++;
        }
        // to remove from forwadding
        if (this.instructions[0].rd) {
            if (this.instructions[0].rd == 5 && this.instructions[0].type == 'lw') {
            }
            this.preforwarding[this.instructions[0].rd] = undefined;
        }

        if (this.instructions.length > 1) {
            this.instructions[1] = this.instructions[0];
        }
        else {
            this.instructions.push(this.instructions[0]);
        }
        //

        this.instructions[0] = undefined;
        return true;

    }
    #execute() {
        if (this.instructions[1] == undefined)
            return true;
        //
        this.pip_data[this.pip_data.length - 1][this.instructions[1].pc - this.pcs] = "EXE";
        this.instruction_pc[2] = this.instructions[1].pc;
        if (!this.fast)
            ChangeColor(this.instructions[1].pc, this.id, 3);
        const instructionObj = this.instructions[1];
        // no latency
        if (this.instructions[1].latency_var > 1) {
            this.instructions[1].latency_var--;
            return false;
        }
        this.Active_reg[instructionObj.rd]++;//VVIP dont delete... because after I write back the instruction I earse the 
        switch (this.instructions[1].type) { //hashMap...so I must add it again here to avoid rewritting by subsequent instructions
            case "srli":
                this.srli(this.instructions[1]);
                break;
            case "and":
                this.and(this.instructions[1]);
                break;
            case "add":
                this.add(this.instructions[1]);
                break;
            case "sub":
                this.sub(this.instructions[1]);
                break;
            case "addi":
                this.addi(this.instructions[1]);
                break;
            case "lw":
                this.lw(this.instructions[1]);
                break;
            case "sw":
                this.sw(this.instructions[1]);
                break;
            case "la":
                this.la(this.instructions[1]);
                break;
            case "li":
                this.li(this.instructions[1]);
                break;
            case "beq":
                this.beq(this.instructions[1]);
                break;
            case "bne":
                this.bne(this.instructions[1]);
                break;
            case "bgt":
                this.bgt(this.instructions[1]);
                break;
            case "blt":
                this.blt(this.instructions[1]);
                break;
            case "bgeu":
                this.bgeu(this.instructions[1]);
                break;
            case "bltu":
                this.bltu(this.instructions[1]);
                break;
            case "jalr":
                this.jalr(this.instructions[1]);
                break;
            case "jal":
                this.jal(this.instructions[1]);
                break;
            case "j":
                this.j(this.instructions[1]);
                break;
            case "jr":
                this.jr(this.instructions[1]);
                break;
            case "ecall":
                this.ecall();
                break;
            case "mul":
                this.mul(this.instructions[1]);
                break;
            case "div":
                this.div(this.instructions[1]);
                break;
            case "xor":
                this.xor(this.instructions[1]);
                break;
            case "or":
                this.or(this.instructions[1]);
                break;
            case "and":
                this.and(this.instructions[1]);
                break;
            default:
                break;
        }
        if (this.instructions.length > 2) {
            this.instructions[2] = this.instructions[1];
        }
        else {
            this.instructions.push(this.instructions[1]);
        }
        // this.numberofCycles++;
        if (this.instructions[1] != undefined && this.instructions[1].valueAfterExecution != undefined && this.instructions[1].type != 'lw') {
            this.preforwarding[this.instructions[1].rd] = this.instructions[1].valueAfterExecution;
        }
        this.instructions[1] = undefined;
        return true;
    }

    #Memory() {
        //lw sw only then its req..
        if (this.instructions[2] == undefined) {
            return true;
        }
        this.pip_data[this.pip_data.length - 1][this.instructions[2].pc - this.pcs] = "MEM";
        this.instruction_pc[3] = this.instructions[2].pc;
        if (!this.fast)
            ChangeColor(this.instructions[2].pc, this.id, 4);

        // for cycles/stalls
        if (this.instructions[2].type == "lw" || this.instructions[2].type == "sw") {

            if (this.cacheStallCycles1 > 0) {
                this.NumberofStalls++;
                this.cacheStallCycles1--;
                if (this.cacheStallCycles1 > 0) {
                    return false;
                }
            }
            else {
                this.cacheStallCycles1 = this.cache.fetchVal(4 * (this.instructions[2].locationOfPull + 268435456));//this handles storage of pc as well as returns stall cycles
                if (this.cacheStallCycles1 > 0)// 4* because we send byte there not word index
                {
                    this.NumberofStalls++;
                    this.cacheStallCycles1--;
                    if (this.cacheStallCycles1 > 0) {
                        return false;
                    }
                }
            }
            this.cacheStallCycles1 = 0;
            if (this.instructions[2].type == "lw")//since we are reading only rs1 we need to check it if its in use or not
            {
                this.instructions[2].valueAfterExecution = getBus(this.instructions[2].locationOfPull);
                if (this.EnableForwarding) {
                    this.preforwarding[this.instructions[2].rd] = this.instructions[2].valueAfterExecution;
                }
            }
            else if (this.instructions[2].type == "sw") {
                setBus(this.instructions[2].locationOfPush, this.instructions[2].rsval1);
                // sw x1 0(x2) -> rs1 -> x1, rs2 ->x2, imd -> 0
                //sw does nothing in wb... everything done here only
            }
        }

        if (this.instructions.length > 2) {
            this.instructions[3] = this.instructions[2];
        }
        else {
            this.instructions.push(this.instructions[2]);
        }


        if (this.cacheStallCycles1 == 0 && (this.instructions[2].type == "lw" || this.instructions[2].type == "sw")) {
            this.cache.storeVal(4 * (this.instructions[2].locationOfPull + 268435456));
            this.cacheStallCycles1 = -1;
            this.instructions[2] = undefined;
            return false;
        }
        this.instructions[2] = undefined;
        // return;
        return true;
    }
    #writeBack() {// writes to the front end ...

        if (this.instructions[3] == undefined) {
            return true;
        }
        this.NumberofInstructions++;
        this.pip_data[this.pip_data.length - 1][this.instructions[3].pc - this.pcs] = "WB";
        this.instruction_pc[4] = this.instructions[3].pc;
        if (!this.fast)
            ChangeColor(this.instructions[3].pc, this.id, 5);
        const instructionObj = this.instructions[3];
        if (instructionObj.rd) {
            const regUpdate = this.regUpdateArr[instructionObj.rd];
            regUpdate.value = instructionObj.valueAfterExecution;
            this.register[instructionObj.rd] = instructionObj.valueAfterExecution;
        }
        this.instructions[3] = undefined;
        // if(instructionObj.rd)
        this.Active_reg[instructionObj.rd]--;
        return true;
    }

    and(instructionObj) {
        instructionObj.valueAfterExecution = instructionObj.rsval1 & instructionObj.rsval2;
    }
    srli(instructionObj) {
        instructionObj.valueAfterExecution = (instructionObj.rsval1) >> (instructionObj.imd);
        // printing
    }
    sub(instructionObj) {
        instructionObj.valueAfterExecution = instructionObj.rsval1 - instructionObj.rsval2;
    }
    add(instructionObj) {
        instructionObj.valueAfterExecution = instructionObj.rsval1 + instructionObj.rsval2;
    }
    addi(instructionObj) {
        instructionObj.valueAfterExecution = instructionObj.rsval1 + instructionObj.imd;
    }
    lw(instructionObj) {
        // Assuming format is lw x1 0(x2) -> rd->x1, rs1 -> x2, imd -> 0
        if (instructionObj.imd != undefined) {

            // instructionObj.locationOfPull = instructionObj.rsval1/4 + instructionObj.imd/4; 
            instructionObj.locationOfPull = instructionObj.rsval1 / 4 + instructionObj.imd / 4;
            // this.NumberofInstructions++;
        }
        else {
            //pseudo instruction
            // if(!this.EnableForwarding)
            this.NumberofInstructions += 1;
            this.numberofCycles += 1;
            if (!this.EnableForwarding) {
                this.numberofCycles += 2;
            }
            instructionObj.locationOfPull = this.labels[instructionObj.label];
        }
    }
    sw(instructionObj) {
        // Assuming format is sw x1 0(x2) -> rs1->x1, rs2 -> x2, imd -> 0
        if (instructionObj.imd != undefined) {
            // this.NumberofInstructions++;
            instructionObj.locationOfPush = instructionObj.rsval2 / 4 + instructionObj.imd / 4;
        }
        else {
            //give error here 
        }
    }
    la(instructionObj) {
        // la a0 lable || la a0 0(x2)
        
        if((typeof this.labels[instructionObj.label]) !== 'string')
            this.register[instructionObj.rd] = instructionObj.imd + this.register[instructionObj.rs1];
        else
        {
            instructionObj.valueAfterExecution = 0;
            this.stringBuffer = this.labels[instructionObj.label];
        }
    }
    li(instructionObj) {
        this.register[instructionObj.rd] = parseInt(instructionObj.imd);
        instructionObj.valueAfterExecution = parseInt(instructionObj.imd);
    }
    //without predictor
    //branch instructions by default let you know their taken or not taken at time of execution
    beq(instructionObj) {
        if (instructionObj.rsval1 == instructionObj.rsval2) {
            this.branchTaken = true;
            this.pc = this.#pcfinder(this.labels[instructionObj.label]);
        }
        else
        {
            this.branchTaken = false;
        }
    }
    bne(instructionObj) {
        if (instructionObj.rsval1 != instructionObj.rsval2) {
            this.branchTaken = true;
            this.pc = this.#pcfinder(this.labels[instructionObj.label]);
        }
        else
        {
            this.branchTaken = false;
        }
    }

    // need to correct and add bge
    bgt(instructionObj) {
        if (instructionObj.rsval1 >= instructionObj.rsval2) {
            this.branchTaken = true;
            this.pc = this.#pcfinder(this.labels[instructionObj.label]);
        }
        else
        {
            this.branchTaken = false;
        }
    }
    blt(instructionObj) {
        if (instructionObj.rsval1 < instructionObj.rsval2) {
            this.branchTaken = true;
            this.pc = this.#pcfinder(this.labels[instructionObj.label]);
        }
        else
        {
            this.branchTaken = false;
        }
    }
    bgeu(instructionObj) {
        if (instructionObj.rsval1 >= instructionObj.rsval2) {
            this.branchTaken = true;
            this.pc = this.#pcfinder(this.labels[instructionObj.label]);
        }
        else
        {
            this.branchTaken = false;
        }
    }
    bltu(instructionObj) {
        if (instructionObj.rsval1 < instructionObj.rsval2) {
            this.branchTaken = true;
            this.pc = this.#pcfinder(this.labels[instructionObj.label]);
        }
        else
        {
            this.branchTaken = false;
        }
    }
    // li(instructionObj) {
    //     // this.rd = this.#valueof(components[1]);
    //     // this.im d = parseInt(components[2]);
    //     instructionObj.valueAfterExecution = instructionObj.imd;
    // }

    jal(instructionObj) {
        this.branchTaken = true;
        instructionObj.valueAfterExecution = this.pc + 1;//as insturctions are stored as arrays.... so pc + 1 is req
        this.pc = this.#pcfinder(this.labels[instructionObj.label]);
    }
    j(instructionObj) {
        this.branchTaken = true;
        this.pc = this.#pcfinder(this.labels[instructionObj.label]);
    }
    jr(instructionObj) {
        this.branchTaken = true;
        this.pc = this.register[instructionObj.rd];
    }
    ecall(){
        if(this.register[17]== 4 && this.stringBuffer!=undefined)
            {
                cprint(this.stringBuffer, this.id-1);
            }
            else if(this.register[17]== 1)
            {
                cprint(this.register[10], this.id-1);
            }else if(this.register[17]==10){
                cprint("Program terminated\nExit code 0\n", this.id-1);
            }
    }
    mul(instructionObj) {
        instructionObj.valueAfterExecution = instructionObj.rsval1 * instructionObj.rsval2;
    }
    div(instructionObj) {
        instructionObj.valueAfterExecution = instructionObj.rsval1 / instructionObj.rsval2;
    }
    xor(instructionObj) {
        instructionObj.valueAfterExecution = instructionObj.rsval1 ^ instructionObj.rsval2;
    }
    or(instructionObj) {
        instructionObj.valueAfterExecution = instructionObj.rsval1 | instructionObj.rsval2;
    }
    #pcfinder(position) {
        while (this.mappc[position] == undefined) {
            position++;
        }
        return this.mappc[position];
    }

}

export default Core;