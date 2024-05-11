
import {latencyMap} from "./Instruction.js";
const closebtn = document.querySelector(".close_set");
const closeOut = document.querySelector(".setOut");
const showbtn = document.querySelector(".show_set");
const latency_select = document.getElementById("latency_input");
const setdiv = document.querySelector(".settings");
const celebration = document.querySelector(".confetti");
const sim_btn = document.querySelector(".Simulatorbtn");

const showhlp = document.querySelector(".show_hlp");
const closehlp = document.querySelector(".close_hlp");
const helpdiv = document.querySelector(".Help");



closehlp.addEventListener("click", ()=>{
    helpdiv.style.display = "none";
});
showhlp.addEventListener("click", ()=>{
    helpdiv.style.display = "block";
    
});



sim_btn.addEventListener("click", ()=>{
    if (celebration.style.display == "none") {
        celebration.style.display = "flex";
    }
    else {
        celebration.style.display = "none";
    }
});
//
const letval = document.getElementById("latencyVal");
closeOut.addEventListener("click", ()=>{
    setdiv.style.display = "none";
});
closebtn.addEventListener("click", ()=>{
    setdiv.style.display = "none";
});
showbtn.addEventListener("click", ()=>{
    setdiv.style.display = "block";
    if(latencyMap[latency_select.value])
        letval.value = latencyMap[latency_select.value];
    else
        letval.value=1;
});
latency_select.onchange = function(){
    if(latencyMap[latency_select.value])
        letval.value = latencyMap[latency_select.value];
    else
        letval.value=1;
}
letval.onchange = function(){
    // debugger;
    latencyMap[latency_select.value] = letval.value;
};