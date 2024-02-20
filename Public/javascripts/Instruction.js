"use strict";

class Instruction {
  // let rs1;

  // let rs2;
  // let rd;
  // let offset;
  // type
  // imd
  
  constructor(instruct) {
    this.alias = {};
    if (instruct.includes('#')) {
      let k = instruct.split('#');
      instruct = k[0];
    }
    // arr: .zero 80
    // to parse .word etc... base: .word 0x1000000.
    // arr: is handled in porcessor.js
   
    else if(instruct)
    {

    } 
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


    if (components[0]) {
      if(components[1])
      {
        if (components[1].charAt(0) != 'x' && components[0] != "j" && components[0] != "la") {
          components[1] = this.alias[components[1]];
        }
     }
    }
    if (components[2]) {
      if (components[1].charAt(0) != 'x' && components[0] != "lw" && components[0] != "sw" && components[0] != "li" && components[0] != "jalr" && components[0] != "jal") {
        components[2] = this.alias[components[2]];
      }
    }
    console.log(components);
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
        // Assuming format is lw x1 0(x2)
        let a1 = components[2].split("(");
        if (a1.charAt(0)) {
          this.imd = parseInt((a1.charAt(0)));
        }
        else {
          a1.charAt(0) = 0;
        }
        this.rs1 = this.#valueof(a1.charAt(1).replace('(', ''));
        if (this.rs1[0] != 'x') {
          this.rs1 = this.alias[this.rs1];
        }
        break;
      case "sw":
        this.rs1 = this.#valueof(components[1]);
        // Assuming format is sw x1 0(x2)
        let a2 = components[2].split("(");
        if (a2.charAt(0)) {
          this.imd = parseInt((a2.charAt(0)));
        }
        else {
          a2.charAt(0) = 0;
        }
        this.imd = parseInt((a2.charAt(0)));
        this.rs2 = this.#valueof(a2.charAt(1).replace('(', ''));
        if (this.rs2[0] != 'x') { this.rs2 = this.alias[rs2]; }
        break;

      case "la":
        this.str = components[1];
      case "li":
        this.rd = this.#valueof(components[1]);
        this.imd = parseInt(components[2]);
        break;
      case "beq":
      case "bne":
      case "bge":
      case "blt":
      case "bgeu":
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
        this.rs1 = this.#valueof(components[1]);
        break;
      // Add more cases as needed for other instructions
      default:
        // Handle unsupported instruction type
        
    }
  }
  show() {
    console.log(this.rs1);
    console.log(this.rs2);
    console.log(this.label);
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

  #valueof(s) {
    return parseInt(s.replace('x', ''))
  }
}

let s = new Instruction("labelwefwef:bne ,, ,,x5              , x6 , Label");

s.show();

export default Instruction;