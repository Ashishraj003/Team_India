import Instruction from "./Instruction.js";
import {getBus, setBus} from "./Processor.js";
import {cprint} from "./console_.js";
class Core {
    constructor(num) {
        this.register = new Array(32).fill(0);
        this.Active_reg = new Array(32).fill(0);
        this.pc = 0;
        this.flag = num;
        this.instructions = [];
        this.labels = {};
        this.forwarding={};
    }
    execute(instruction) {
        cprint(instruction, this.flag-1);
        
        if(!this.#writeBack())
        {
            return;
        }
        if(!this.#Memory())
        {
            return;
        }
        if(!this.#execute())
        {
            return;
        }
        if(this.branchTaken)
        {
            this.branchTaken=false;
            this.instructions[0]=undefined;
            return;
        }
        if(!this.#DecodeRegisterFetch())
        {
            return;
        }
        if(!this.#InstructionFetch(instruction))
        {
            return;
        }
        this.pc++;
    }
    #InstructionFetch(instruction){
        const object = new Instruction(instruction);
        if(this.instructions.length>0){
            this.instructions[0]=object;
        }else{
            this.instructions.push(object);
        }
        
        return  true;
    }
    #DecodeRegisterFetch(){
        
        let reg1=0;
        let reg2=0;
        if(this.instructions[0]==undefined)
            return true;
        
        //this else if is for pipeline forwardings....

        if(this.instructions[0].rs1!=undefined && this.Active_reg[this.instructions[0].rs1]!=0)
        {
            return false;
        }
        else if(this.instructions[0].rs1!=undefined && this.Active_reg[this.instructions[0].rs1]!=0)
        {
            if(this.forwarding[this.instructions[0].rs1]!=undefined)
            {
                this.instructions[0].rs1 = this.forwarding[this.instructions[0].rs1];
                reg1++;
            }
        }
        
        if(this.instructions[0].rs2!=undefined && this.Active_reg[this.instructions[0].rs2]!=0)
        {
            return false;
        }
        else if(this.instructions[0].rs2!=undefined && this.Active_reg[this.instructions[0].rs2]!=0)
        {
            if(this.forwarding[this.instructions[0].rs2]!=undefined)
            {
                this.instructions[0].rs2 = this.forwarding[this.instructions[0].rs2];
                reg2++;
            }
        }

        if(this.instructions[0].rs1!=undefined && reg1==0){
            this.instructions[0].rsval1 = this.register[this.instructions[0].rs1];
        }
        if(this.instructions[0].rs2!=undefined && reg2==0){
            this.instructions[0].rsval2 = this.register[this.instructions[0].rs2];
        }
        if(this.instructions.length>1){
            this.instructions[1]=this.instructions[0];
        }
        else{
            this.instructions.push(this.instructions[0]);
        }
        this.instructions[0]=undefined;
        return true;
    }
    #execute(){

        if(this.instructions[1]==undefined)
            return true;
        const instructionObj = this.instructions[1];

        // no latency
        if(this.instructions[1].latency > 1){
            this.instructions[1].latency--;
            return false;
        }
        if(instructionObj.rs1 && this.Active_reg[instructionObj.rs1]!=0){
            return false;
        }
        if(instructionObj.rs2 &&this.Active_reg[instructionObj.rs2]!=0){
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
            default:
                // if (debug)
                //     console.log("Instruction not found");
                break;
        }
        if(this.instructions.length>2)
        {
            this.instructions[2]=this.instructions[1];
        }
        else{
            this.instructions.push(this.instructions[1]);
        }
        if(this.instructions[1]!=undefined && this.instructions[1].valueAfterExecution!=undefined)
        {
            this.forwarding[this.instructions[1].rd]=this.instructions[1].valueAfterExecution;
        }
        this.instructions[1]=undefined;
        return true;
    }
    #Memory(){
        //lw sw only then its req..
        if(this.instructions[2]==undefined)
        {
            return true;
        }
        if(this.instructions[2].type=="lw" ||this.instructions[2].type=="sw" )
        {
            if(this.instructions[2].type=="lw" )//since we are reading only rs1 we need to check it if its in use or not
            {
                this.instructions[2].valueAfterExecution = getBus(this.instructions[2].locationOfPull);
                this.forwarding[this.instructions[2].rd]=this.instructions[2].valueAfterExecution;
            }
            else if(this.instructions[2].type=="sw" )
            {
                setBus(this.instructions[2].locationOfPush, this.instructions[2].rsval1);
                // sw x1 0(x2) -> rs1 -> x1, rs2 ->x2, imd -> 0
                //sw does nothing in wb... everything done here only
            }    
        }
        if(this.instructions.length>2)
        {
            this.instructions[3]=this.instructions[2];
        }
        else{
            this.instructions.push(this.instructions[2]);
        }
        
        this.instructions[2]=undefined;
        // return;
        return true;
    }
    #writeBack() {// writes to the front end ...
        if(this.instructions[3]==undefined)
        {
            return true;
        }
        const instructionObj = this.instructions[3];
        if (instructionObj.rd) {
            const regUpdate = document.getElementById(`reg${this.flag}Text${instructionObj.rd}`);
            regUpdate.value = instructionObj.valueAfterExecution;
            
            this.register[instructionObj.rd] = instructionObj.valueAfterExecution;
        }  
        this.instructions[3]=undefined;
        this.Active_reg[instructionObj.rd]--;
        return true;    
    }
    and(instructionObj)
    {
        instructionObj.valueAfterExecution = instructionObj.rsval1 & instructionObj.rsval2;
    }
    srli(instructionObj)
    {
        instructionObj.valueAfterExecution = (instructionObj.rsval1)>>(instructionObj.imd);
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
        debugger;
        // Assuming format is lw x1 0(x2) -> rd->x1, rs1 -> x2, imd -> 0
        if(instructionObj.imd !=undefined){

            instructionObj.locationOfPull = instructionObj.rsval1/4 + instructionObj.imd/4; 

        }
        else{
            
            instructionObj.locationOfPull = this.labels[instructionObj.label];

        }
    }
    sw(instructionObj) {
        // Assuming format is sw x1 0(x2) -> rs1->x1, rs2 -> x2, imd -> 0
        if(instructionObj.imd !=undefined){
            instructionObj.locationOfPush =instructionObj.rsval2/4 + instructionObj.imd/4;
        }
        else
        {
            //give error here 
        }
    }
    li(instructionObj) {
        // this.register[rd] = instructionObj.imd;
    }
    la(instructionObj) {
        // instructionObj.valueAfterExecution = this.labels[instructionObj.str];
    }
    //without predictor
    //branch instructions by default let you know their taken or not taken at time of execution
    beq(instructionObj) {
        if (instructionObj.rsval1 == instructionObj.rsval2) {
            this.branchTaken=true;
            this.pc = this.labels[instructionObj.label];
        }
    }
    bne(instructionObj) {
        if (instructionObj.rsval1 != instructionObj.rsval2) {
            this.branchTaken=true;
            this.pc = this.labels[instructionObj.label];
        }
    }

    // need to correct and add bge
    bgt(instructionObj) {
        if (instructionObj.rsval1 >= instructionObj.rsval2) {
            this.branchTaken=true;
            this.pc = this.labels[instructionObj.label];
        }
    }
    blt(instructionObj) {
        if (instructionObj.rsval1 < instructionObj.rsval2) {
            this.branchTaken=true;
            this.pc = this.labels[instructionObj.label];
        }
    }
    bgeu(instructionObj) {
        if (instructionObj.rsval1 >= instructionObj.rsval2) {
            this.branchTaken=true;
            this.pc = this.labels[instructionObj.label];
        }
    }
    bltu(instructionObj) {
        if (instructionObj.rsval1 < instructionObj.rsval2) {
            this.branchTaken=true;
            this.pc = this.labels[instructionObj.label];
        }
    }
    
    // li(instructionObj) {
    //     // this.rd = this.#valueof(components[1]);
    //     // this.im d = parseInt(components[2]);
    //     instructionObj.valueAfterExecution = instructionObj.imd;
    // }
    
    jal(instructionObj) {
        this.branchTaken=true;
        instructionObj.valueAfterExecution = this.pc + 1;//as insturctions are stored as arrays.... so pc + 1 is req
        this.pc = this.labels[instructionObj.label];
    }
    j(instructionObj) {
        this.branchTaken=true;
        this.pc = this.labels[instructionObj.label];
    }
    jr(instructionObj) {
        this.branchTaken=true;
        this.pc = this.register[instructionObj.rd];
    }
    
}

export default Core;