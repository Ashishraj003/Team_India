const button1 = document.querySelector("#side_but1");
const button2 = document.querySelector("#side_but2");
const button3 = document.querySelector("#side_but3");

const editor = document.querySelector("#editor_id");
const cache = document.querySelector("#cache_id");
const memory = document.querySelector("#memory_id");

//
// page switching
button1.addEventListener('click', function () {
    // location.href = "/";
    editor.style.display = "block";
    cache.style.display = "none";
    memory.style.display = "none";
})

button2.addEventListener('click', function () {
    // location.href = "/cache";
    editor.style.display = "none";
    cache.style.display = "block";
    memory.style.display = "none";
})
button3.addEventListener('click', function () {
    // location.href = "/memory";
    editor.style.display = "none";
    cache.style.display = "none";
    memory.style.display = "block";
})




