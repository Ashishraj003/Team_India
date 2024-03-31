import { getpipeline , getpcs} from "./Processor.js";
const corebtn1 = document.querySelector("#t_side_but1");
const corebtn2 = document.querySelector("#t_side_but2");
const close = document.querySelector(".close_tab");
const table = document.querySelector(".Tables_btn");
const open = document.querySelector(".show_tab");
const PipeDiv = document.querySelector(".Pipe-Table");

let top = 0;
let left = 0;
const height = 10;
const width = 18;
let data_x = 0;
let data_y = 0;
let pcs = 0;
let data = [];
export function update(new_data, pc){
  top = 0;
  left = 0;
  pcs = pc;
  data_y = new_data.length;
  data_x = new_data[0].length;
  for(let i=0;i<data_y;i++){
    data.push(new Array(data_x));
    for(let j = 0;j<data_x;j++){
      data[i][j] = new_data[i][j]?new_data[i][j]:'-';
    }
  }
  let tp = parseInt(top);
  let lf = parseInt(left);
  for(let j = 1;j <= width;j++){
    document.getElementById('pipe-' + 0 + ',' + j).innerText = lf+j;
  }
  for(let i = 1; i <= height; i++){
    document.getElementById('pipe-' + i + ',' + 0).innerText = tp+i+pcs;
  }
  for (let i = 1; i <= height && i+tp>=0 && i+tp<=data_x; i++) {
    for(let j = 1;j <= width && j+lf>=0 && j+lf<=data_y;j++){
      let val =  data[j+lf-1][i+tp-1];
      document.getElementById('pipe-' + i + ',' + j).innerText = val;
    }
  }
  
  console.log(data);
}

corebtn1.addEventListener("click", ()=>{
  let vl = getpcs(0);
  update(getpipeline(0), vl>=0?vl:0);
})
corebtn2.addEventListener("click", ()=>{
  let vl = getpcs(1);

  update(getpipeline(1), vl>=0?vl:0);
})
close.addEventListener("click", ()=>{
  PipeDiv.style.display = "none";
})
open.addEventListener("click", ()=>{
  PipeDiv.style.display = "block";
})
function updateTable(event) {
  top += (event.deltaY>0?1:-1) * Math.log(Math.abs(event.deltaY)+1) / Math.LN10;
  left += (event.deltaX>0?1:-1) * Math.log(Math.abs(event.deltaX)+1) / Math.LN10;
  
  
  if(top>data_x-height){
    top=data_x-height;
  }
  if(left>data_y-width){
    left = data_y-width;
  }
  if(top<0){
    top=0;
  }
  if(left<0){
    left=0;
  }
  let tp = parseInt(top);
  let lf = parseInt(left);
  console.log(top, left, event.deltaX);
  for(let j = 1;j <= width;j++){
    document.getElementById('pipe-' + 0 + ',' + j).innerText = lf+j;
  }
  for(let i = 1; i <= height; i++){
    document.getElementById('pipe-' + i + ',' + 0).innerText = tp+i+pcs;
  }
  for (let i = 1; i <= height && i+tp>=0 && i+tp<=data_x; i++) {
    for(let j = 1;j <= width && j+lf>=0 && j+lf<=data_y;j++){
      let val =  data[j+lf-1][i+tp-1];
      document.getElementById('pipe-' + i + ',' + j).innerText = val;
    }
  }
  return false;
}
var tbody = document.getElementById('root');
tbody.onwheel = updateTable;