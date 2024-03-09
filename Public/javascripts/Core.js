import Instruction from "./Instruction.js";
import {getBus, setBus} from "./Processor.js";
import {cprint} from "./console_.js";
import { ChangeColor } from "./editor.js";
import Predictor from "./Predictor.js";
function IfBranch(type){
    if(type=="bne" || type=="beq" || type=="blt" || type=="bgtu" || type=="bltu" || type=="bgt"){
        return true;
    }
    return false;
}
class Core {
    constructor(num) {
        
        this.id = num;
        this.labels = {};
        this.ipc=0;
        this.EnableForwarding=false;
        this.predictor=new Predictor();
        
    }
    Initialize(CoreInstructions, pcs)
    {
        this.register = new Array(32).fill(0);
        this.Active_reg = new Array(32).fill(0);
        this.InstructionMap={};
        this.instructions = [];
        this.preforwarding={};
        this.pc = pcs;
        console.log(pcs);
        this.End=false;
        this.NumberofInstructions=0;
        this.TotalInstuctionsLenght = CoreInstructions.length;
        this.numberofCycles=0;
        for(let i=0;i<CoreInstructions.length;i++)
        {
            let instruct = new Instruction(CoreInstructions[i]);
            instruct.pc = i;
            if(instruct.type==undefined)
            {
                continue;
            }
            this.InstructionMap[i]=instruct;
        }
    }
    execute() {
        // cprint(this.instructions, this.id-1); //prints instructions on console 
        console.log(this.instructions, this.id, this.pc);
        this.numberofCycles++;
        while (this.#CheckEmptyLine()){
            this.pc++;
        }
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
            // this.NumberofInstructions++;
            return;
        }
        if(!this.#DecodeRegisterFetch())
        {
            return;
        }
        if(!this.#InstructionFetch())
        {
            return;
        }
        
        this.pc++;
        this.End = this.#CheckEnd();
        
    }
    #CheckEmptyLine()
    {
        if(this.TotalInstuctionsLenght>this.pc && this.InstructionMap[this.pc]==undefined)
        {
            return true;
        }
        return false;
        
    }
    #CheckEnd(){
        if(this.TotalInstuctionsLenght>this.pc) return false;
        for(let i=0;i<this.instructions.length;i++)
        {
            if(this.instructions[i]!=undefined)
            {
                return false;
            }
        }
        return true;
    }
    #InstructionFetch(){
        while(this.#CheckEmptyLine()){
            this.pc++;
        }
        const object = this.InstructionMap[this.pc];
        if(object){
            ChangeColor(object.pc, this.id, 0);
            object.latency_var = object.latency;
            cprint(object.type, this.id-1);
            cprint(this.pc, this.id-1);
            
        }
        if(this.instructions.length>0){
            this.instructions[0]=object;
        }else{
            this.instructions.push(object);
        }
        if(this.instructions[0]!=undefined && IfBranch(this.instructions[0].type))
        {
            if(this.predictor.predict(this.pc))//branch taken
            {
                this.pc = this.labels[this.instructions[0].label];
            }
        }
        return  true;
    }
    #DecodeRegisterFetch(){
        let reg1=0;
        let reg2=0;
        if(this.instructions[0]==undefined)
            return true;
        //this else if is for pipeline forwardings....
        ChangeColor(this.instructions[0].pc, this.id, 1);
        if(this.instructions[0].rs1!=undefined && this.Active_reg[this.instructions[0].rs1]!=0){
        if(!this.EnableForwarding)
        {
            this.NumberofStalls++;
            return false;
        }
        else
        {
            if(this.preforwarding[this.instructions[0].rs1]!=undefined)
            {
                this.instructions[0].rsval1 = this.preforwarding[this.instructions[0].rs1];
                reg1++;
            }
            else
            {
                this.NumberofStalls++;
                return;
            }
        }
    }
    if(this.instructions[0].rs2!=undefined && this.Active_reg[this.instructions[0].rs2]!=0){
        if(!this.EnableForwarding)
        {
            this.NumberofStalls++;
            return false;
        }
        else
        {
            if(this.preforwarding[this.instructions[0].rs2]!=undefined)
            {
                this.instructions[0].rsval2 = this.preforwarding[this.instructions[0].rs2];
                reg2++;
            }
            else
            {
                this.NumberofStalls++;
                return;
            }
        }
    }
        if(this.instructions[0].rs1!=undefined && reg1==0 ){

            this.instructions[0].rsval1 = this.register[this.instructions[0].rs1];
            reg1++;
        }
        if(this.instructions[0].rs2 !=undefined && reg2==0 )
        {
            this.instructions[0].rsval2 = this.register[this.instructions[0].rs2];
            reg2++;
        }

        if(this.instructions.length>1){
            this.instructions[1]=this.instructions[0];
        }
        else{
            this.instructions.push(this.instructions[0]);
        }
        //
        
        this.instructions[0]=undefined;
        return true;
        
    }
    #execute(){
        if(this.instructions[1]==undefined)
            return true;
        //
        ChangeColor(this.instructions[1].pc, this.id, 2);
        const instructionObj = this.instructions[1];

        // no latency
        if(this.instructions[1].latency_var > 1){
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
        // this.numberofCycles++;
        if(this.instructions[1]!=undefined && this.instructions[1].valueAfterExecution!=undefined)
        {
            this.preforwarding[this.instructions[1].rd]=this.instructions[1].valueAfterExecution;
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
        ChangeColor(this.instructions[2].pc, this.id, 3);
        if(this.instructions[2].type=="lw" ||this.instructions[2].type=="sw" )
        {
            if(this.instructions[2].type=="lw" )//since we are reading only rs1 we need to check it if its in use or not
            {
                this.instructions[2].valueAfterExecution = getBus(this.instructions[2].locationOfPull);
                this.preforwarding[this.instructions[2].rd]=this.instructions[2].valueAfterExecution;
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
        this.NumberofInstructions++;
        ChangeColor(this.instructions[3].pc, this.id, 4);
        const instructionObj = this.instructions[3];
        if (instructionObj.rd) {
            const regUpdate = document.getElementById(`reg${this.id}Text${instructionObj.rd}`);
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
        // debugger;
        // Assuming format is lw x1 0(x2) -> rd->x1, rs1 -> x2, imd -> 0
        if(instructionObj.imd !=undefined){

            instructionObj.locationOfPull = instructionObj.rsval1/4 + instructionObj.imd/4; 
            // this.NumberofInstructions++;
        }
        else{
            //pseudo instruction
            this.NumberofInstructions+=1;
            this.numberofCycles+=3;
            instructionObj.locationOfPull = this.labels[instructionObj.label];
        }
    }
    sw(instructionObj) {
        // Assuming format is sw x1 0(x2) -> rs1->x1, rs2 -> x2, imd -> 0
        if(instructionObj.imd !=undefined){
            // this.NumberofInstructions++;
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
            // this.NumberofInstructions--;
            // this.numberofCycles-=2;
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