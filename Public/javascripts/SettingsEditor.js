
import {latencyMap} from "./Instruction.js";
const closebtn = document.querySelector(".close_set");
const closeOut = document.querySelector(".setOut");
const showbtn = document.querySelector(".show_set");
const latency_select = document.getElementById("latency_input");
const setdiv = document.querySelector(".settings");
const letval = document.getElementById("latencyVal");
closeOut.addEventListener("click", ()=>{
    setdiv.style.display = "none";
});
closebtn.addEventListener("click", ()=>{
    setdiv.style.display = "none";
});
showbtn.addEventListener("click", ()=>{
    setdiv.style.display = "block";
});
letval.onchange = function(){
    debugger;
    latencyMap[latency_select.value] = letval.value;
};