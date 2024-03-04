"use strict";
export const latencyMap ={};
const alias = {
  'ra': '1',
  'sp': '2',
  'gp': '3',
  'tp': '4',
  't0': '5',
  't1': '6',
  't2': '7',
  's0': '8',
  's1': '9',
  'a0': '10',
  'a1': '11',
  'a2': '12',
  'a3': '13',
  'a4': '14',
  'a5': '15',
  'a6': '16',
  'a7': '17',
  's2': '18',
  's3': '19',
  's4': '20',
  's5': '21',
  's6': '22',
  's7': '23',
  's8': '24',
  's9': '25',
  's1': '26',
  's1': '27',
  't3': '28',
  't4': '29',
  't5': '30',
  't6': '31'
};


class Instruction {
  
  constructor(instruct) {
    
    
    // 003 repeted code bad practice

    let components = this.#split(instruct);
    this.type = components[0];

    


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
    if(latencyMap[this.type]!=undefined){
      this.latency = latencyMap[this.type];
    }
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
    return parseInt(alias[s]);
  }
}

export default Instruction;
