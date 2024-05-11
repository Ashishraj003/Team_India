
let top = 0;
const height = 10;
const width = 1;
let data = [];
let bolckSize = 1;
export function createTable(arr, size){
    bolckSize = size;
    data = [];
    // top = 0;
    for(let i = 0;i<arr.length;i++){
        data[i] = arr[i]!=-1?arr[i]:'-';
    }
    let tp = parseInt(top);
    for (let i = 0; i <= height;i++){
        document.getElementById('cache-' + i + ',' + 0).innerText = "-";
        document.getElementById('cache-' + i + ',' + 1).innerText = "-";
    }
    for (let i = 0; i+tp>=0 && i+tp<=height; i++) {
        //   for(let j = 0;j <= width;j++){
            let val =  data[i+tp-1];
            
            if(val!=undefined){
                document.getElementById('cache-' + i + ',' + 0).innerText = i+tp;
                document.getElementById('cache-' + i + ',' + 1).innerText = convert(val);
            }
            else{
                document.getElementById('cache-' + i + ',' + 0).innerText = "-";
                document.getElementById('cache-' + i + ',' + 1).innerText = "-";
            }
        }
}
function updateTable(event) {
    top += (event.deltaY>0?1:-1) * Math.log(Math.abs(event.deltaY)+1) / Math.LN10;
    // left += (event.deltaX>0?1:-1) * Math.log(Math.abs(event.deltaX)+1) / Math.LN10;
    
    
    if(top>data.length-height){
      top=data.length-height;
    }
    if(top<0){
      top=0;
    }
    let tp = parseInt(top);
    console.log(tp);
    console.log(data);
    
    for (let i = 0; i <= height && i+tp>=0 && i+tp<=data.length; i++) {
    //   for(let j = 0;j <= width;j++){
        let val =  data[i+tp-1];
        if(val!=undefined){

            document.getElementById('cache-' + i + ',' + 0).innerText = i+tp;
            document.getElementById('cache-' + i + ',' + 1).innerText = convert(val);
        }
        else{
            document.getElementById('cache-' + i + ',' + 0).innerText = "-";
            document.getElementById('cache-' + i + ',' + 1).innerText = "-";
        }
    //   }
    }
    return false;
  }
  function convert(val){
    // return val;
    if(val=='-'){
        return "-";
    }
    val = parseInt(val);
    if(val>=268435456/bolckSize){
        // val *= 4;
        var hexString = val.toString(16);
        while (hexString.length < 8) {
            hexString = '0' + hexString;
        }
        hexString = '0' + 'x' + hexString;
        return hexString;
    }
    else if(val>=16777216/bolckSize){
        return "CORE 2: " + (val-16777216/bolckSize);
    }else{
        return "CORE 1: " + val;
    }
}
  var tbody = document.getElementById('cache_table_root');
  tbody.onwheel = updateTable;