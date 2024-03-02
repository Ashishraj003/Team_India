"use strict";

class Instruction {
  latencyMap ={};
  constructor(instruct) {
    this.alias = {};
    
    // 003 repeted code bad practice

    let components = this.#split(instruct);
    this.type = components[0];

    this.alias['ra'] = 'x1';
    this.alias['sp'] = 'x2';
    this.alias['gp'] = 'x3';
    this.alias['tp'] = 'x4';
    this.alias['t0'] = 'x5';
    this.alias['t1'] = 'x6';
    this.alias['t2'] = 'x7';
    this.alias['s0'] = 'x8';
    this.alias['s1'] = 'x9';
    this.alias['a0'] = 'x10';
    this.alias['a1'] = 'x11';
    this.alias['a2'] = 'x12';
    this.alias['a3'] = 'x13';
    this.alias['a4'] = 'x14';
    this.alias['a5'] = 'x15';
    this.alias['a6'] = 'x16';
    this.alias['a7'] = 'x17';
    this.alias['s2'] = 'x18';
    this.alias['s3'] = 'x19';
    this.alias['s4'] = 'x20';
    this.alias['s5'] = 'x21';
    this.alias['s6'] = 'x22';
    this.alias['s7'] = 'x23';
    this.alias['s8'] = 'x24';
    this.alias['s9'] = 'x25';
    this.alias['s1'] = 'x26';
    this.alias['s1'] = 'x27';
    this.alias['t3'] = 'x28';
    this.alias['t4'] = 'x29';
    this.alias['t5'] = 'x30';
    this.alias['t6'] = 'x31';


    // if (components[0]) {
    //   if (components[1]) {
    //     if (components[1].charAt(0) != 'x' && components[0] != "j" && components[0] != "la") {
    //       components[1] = this.alias[components[1]];
    //     }
    //   }
    // }
    //   if (components[1]) {
    //   if (components[1] && components[1].charAt(0) != 'x' && components[0] != "lw" && components[0] != "sw" && components[0] != "li" && components[0] != "jalr" && components[0] != "jal") {
    //     components[2] = this.alias[components[2]];
    //   }
    // }
    this.latency = 1;// map[type]
    this.rsval1=0;
    this.rsval2=0;
    switch (this.type) {
      case "and":
      case "add":
      case "sub":
        this.rd = this.#valueof(components[1]);
        this.rs1 = this.#valueof(components[2]);
        this.rs2 = this.#valueof(components[3]);
        break;
      case "srli":
      case "addi":
        this.rd = this.#valueof(components[1]);
        this.rs1 = this.#valueof(components[2]);
        this.imd = parseInt(components[3]);
        break;
      case "lw":
        this.rd = this.#valueof(components[1]);
        // Assuming format is lw x1 0(x2) -> rd->x1, rs1 -> x2, imd -> 0
        if(components[2].includes("(")){
          let a1 = components[2].split("(");
          this.imd = parseInt(a1[0]);
          this.rs1 = this.#valueof(a1[1].replace(')', ''));
        }else{
          this.label = components[2];
        }
        break;
      case "sw":
        this.rs1 = this.#valueof(components[1]);
        // Assuming format is sw x1 0(x2) -> rs1->x1, rs2 -> x2, imd -> 0
        let a2 = components[2].split("(");
        this.imd = parseInt(a2[0]);
        this.rs2 = this.#valueof(a2[1].replace(')', ''));
        break;
      case "la":
        this.str = components[1];
      case "li":
        this.rd = this.#valueof(components[1]);
        this.imd = parseInt(components[2]);
        break;
      case "beq":
      case "bne":
      case "bgt":
      case "blt":
      case "bgtu":
      case "bltu":
        this.rs1 = this.#valueof(components[1]);
        this.rs2 = this.#valueof(components[2]);
        this.label = components[3];
        break;
      case "jalr":
        this.rd = this.#valueof(components[2]);
        this.rs1 = this.#valueof(components[1]);
        this.offset = parseInt(components[3]);
        break;
      case "jal":
        this.rd = this.#valueof(components[1]);
        this.label = components[2];
        break;

      case "j":
        this.label = components[1];
        break;
      case "jr":
        this.rd = this.#valueof(components[1]);
        break;
      // Add more cases as needed for other instructions
      default:
      // Handle unsupported instruction type

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
      a[j++] = s1;
      i++;
    }
    return a;
  }

  #valueof(s) {
    if(s.includes('x'))
    {
      return parseInt(s.replace('x', ''));
    }
    return parseInt((this.alias[s]).replace('x', ''));
  }
}

export default Instruction;