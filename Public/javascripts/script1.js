// function for checking only
function myFunction() {
  /////////////
  var x = document.getElementById("myDIV");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}

//var editor = CodeMirror.fromTextArea(document.getElementById('e1'), {
//     lineNumbers: true,
//     mode: 'text/x-perl',
//     matchBrackets: true,
// })/

//
// desc: demonstrates textarea line numbers using canvas paint
// auth: nikola bozovic <nigerija@gmail>
//
var TextAreaLineNumbersWithCanvas = function () {
  var div = document.getElementById("wrapper");
  var cssTable =
    "padding:0px 0px 0px 0px!important; margin:0px 0px 0px 0px!important; font-size:1px;line-height:0px; width:auto;";
  var cssTd1 =
    "border:1px #345 solid; border-right:0px; vertical-align:top; width:1px; background: #303030";
  var cssTd2 = "border:1px #345 solid; border-left:0px; vertical-align:top;";
  var cssButton =
    "width:120px; height:40px; border:1px solid #333 !important; border-bottom-color: #484!important; color:#333; background-color:#222;";
  var cssCanvas =
    "border:0px; background-color:#1c1c20; margin-top:0px; padding-top:0px;";

  // LAYOUT (table 2 panels)
  var table = document.createElement("table");
  table.setAttribute("cellspacing", "0");
  table.setAttribute("cellpadding", "0");
  table.setAttribute("style", cssTable);
  var tr = document.createElement("tr");
  var td1 = document.createElement("td");
  td1.setAttribute("style", cssTd1);
  var td2 = document.createElement("td");
  td2.setAttribute("style", cssTd2);
  tr.appendChild(td1);
  tr.appendChild(td2);
  table.appendChild(tr);

  // TEXTAREA
  var ta = (this.evalnode = document.getElementById("mytextarea"));

  // TEXTAREA NUMBERS (Canvas)
  var canvas = document.createElement("canvas");
  canvas.width = 48; // must not set width & height in css !!!
  canvas.height = 500; // must not set width & height in css !!!
  canvas.setAttribute("style", cssCanvas);
  ta.canvasLines = canvas;
  td1.appendChild(canvas);
  td2.appendChild(ta);
  div.appendChild(table);

  // PAINT LINE NUMBERS
  ta.paintLineNumbers = function () {
    try {
      var canvas = this.canvasLines;
      if (canvas.height != this.clientHeight) canvas.height = this.clientHeight; // on resize
      var ctx = canvas.getContext("2d");
      ctx.fillStyle = "#303030";
      ctx.fillRect(0, 0, 42, this.scrollHeight + 1);
      ctx.fillStyle = "#808080";
      ctx.font = "11px monospace"; // NOTICE: must match TextArea font-size(11px) and lineheight(15) !!!
      var startIndex = Math.floor(this.scrollTop / 15, 0);
      var endIndex = startIndex + Math.ceil(this.clientHeight / 15, 0);
      for (var i = startIndex; i < endIndex; i++) {
        var ph = 10 - this.scrollTop + i * 15;
        var text = "" + (1 + i); // line number
        ctx.fillText(text, 40 - text.length * 6, ph);
      }
    } catch (e) {
      alert(e);
    }
  };
  ta.onscroll = function (ev) {
    this.paintLineNumbers();
  };
  ta.onmousedown = function (ev) {
    this.mouseisdown = true;
  };
  ta.onmouseup = function (ev) {
    this.mouseisdown = false;
    this.paintLineNumbers();
  };
  ta.onmousemove = function (ev) {
    if (this.mouseisdown) this.paintLineNumbers();
  };

  // make sure it's painted
  ta.paintLineNumbers();
  return ta;
};

var ta = TextAreaLineNumbersWithCanvas();
// ta.value = TextAreaLineNumbersWithCanvas.toString();
