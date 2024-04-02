import { getpipeline , getpcs} from "./Processor.js";
const corebtn1 = document.querySelector("#t_side_but1");
const corebtn2 = document.querySelector("#t_side_but2");
const close = document.querySelector(".close_tab");
const table = document.querySelector(".Tables_btn");
const open = document.querySelector(".show_tab");
const PipeDiv = document.querySelector(".Pipe-Table");
const clear = () => {
  for (let i = 0; i <= 10; i++) { 
    for (let j = 0; j <= 18; j++) { 
      document.getElementById('pipe-' + i + ',' + (j)).innerText = " ";
    }
  }
}
function write(kVal){
  let height = 10; 
  let width = 5;
  let value = kVal % 19;
  function write(c, i, j){
    let val = (value+j)%19;
    if(document.getElementById('pipe-' + i + ',' + (val))!=null)
    document.getElementById('pipe-' + i + ',' + (val)).innerText = "##";
  }
  
  const printR = () => { 
    let i, j=0, half = parseInt(height / 2); 
    for (i = 0; i < height; i++) { 
      j = 0
        write("*", i, j);
        for (; j < width; j++) { 
            if ((i == 0 || i == half) 
                && j < (width - 2)) 
                write("*", i, j); 
            else if (j == (width - 2) 
                && !(i == 0 || i == half)) 
                write("*", i, j); 
        }
    } 
  }
    const printU = () => { 
      let i, j = 0; 
      for (i = 0; i < height; i++) { 
        j = 0
          write("*", i, j);  
          for (; j < width; j++) { 
              if ((i == height - 1)) 
                  write("*", i, j);  
              if (j == width - 1) 
                  write("*", i, j);  
          } 
      } 
  }
  const printN = () => { 
    let i, j=0, counter = 0; 
    for (i = 0; i < height; i++) { 
      j = 0
        write("*", i, j); 
        for (; j <= width; j++) { 
          if (j*2 == height) 
          write("*", i, j); 

          if (j == counter) 
          write("*", i, j); 

        }
        if(i%2==0)
        counter++;
      } 
  }
  clear();
  printR();
  value+=width;
  value%=19;
  printU();
  value+=width+1;
  value%=19;
  printN();
}
write(1);
let top = 0;
let left = 0;
const height = 10;
const width = 18;

let data_x = 0;
let data_y = 0;
let pcs = 0;
let data = [];
let button_class_no = 0;
const change = (k) => {
  let val = "b2";
  if(k==1)
  val = "button-85";
  for (let i = 0; i <= 10; i++) { 
    for (let j = 0; j <= 18; j++) { 
      document.getElementById('pipe-' + i + ',' + (j)).classList.remove("button-85");
      document.getElementById('pipe-' + i + ',' + (j)).classList.remove("button-49");
      // document.getElementById('pipe-' + i + ',' + (j)).classList.remove("b2");
      document.getElementById('pipe-' + i + ',' + (j)).classList.add(val);

    }
  }

}
export function update(new_data, pc){
  clear();
  top = 0;
  left = 0;
  pcs = pc;
  data_y=0;
  data_x=0;
  if(new_data)
  data_y = new_data.length;
  if(data_y>0)
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
let xcor = -1;
let id_ = null;
table.addEventListener("click", ()=>{
  // if(xcor == -1){
  //   xcor = 1;
  //   id_ = setInterval(()=>{
  //     write(++xcor);
  //   }, 100);
  //   console.log("start");
  // }else{
  //   clearInterval(id_);
  //   xcor = -1;
  //   console.log("Clear");
  // }
  change((++button_class_no)%3);
});
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