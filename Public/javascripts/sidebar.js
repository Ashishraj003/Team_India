import {focus} from "./console_.js";
const button1 = document.querySelector("#side_but1");
const button2 = document.querySelector("#side_but2");
const button3 = document.querySelector("#side_but3");
const button4 = document.querySelector("#side_but4");
const editor = document.querySelector("#editor_id");
const cache = document.querySelector("#cache_id");
const memory = document.querySelector("#memory_id");
const consoles = document.querySelector("#console_id");
const s_button1 = document.querySelector("#s_side_but1");
const s_button2 = document.querySelector("#s_side_but2");
const s_latency = document.querySelector(".s_latency");
const s_cache = document.querySelector(".s_cache");



//
// page switching
button1.addEventListener('click', function () {
    // location.href = "/";
    editor.style.display = "block";
    cache.style.display = "none";
    memory.style.display = "none";
    consoles.style.display = "none";

})

button2.addEventListener('click', function () {
    // location.href = "/cache";
    editor.style.display = "none";
    cache.style.display = "block";
    memory.style.display = "none";
    consoles.style.display = "none";

})
button3.addEventListener('click', function () {
    // location.href = "/memory";
    editor.style.display = "none";
    cache.style.display = "none";
    memory.style.display = "block";
    consoles.style.display = "none";

})

button4.addEventListener('click', function () {
    // location.href = "/memory";
    editor.style.display = "none";
    cache.style.display = "none";
    memory.style.display = "none";
    consoles.style.display = "block";
    focus();
})
s_button1.addEventListener('click', function () {
    s_cache.style.display = "none";
    s_latency.style.display = "block";
})
s_button2.addEventListener('click', function () {
    s_cache.style.display = "block";
    s_latency.style.display = "none";
})

