const express = require("express");
const app = express();
const path = require('path');



app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname, 'Public')));


app.use('/views/Public', express.static('Public'));



app.get('/', (req, res) => {
    res.render('Index1.ejs');
})

// app.post('/cach', (req, res) => {
//     res.render('cache');
// })//

// app.post('/memory', (req, res) => {
//     res.render('memory');
// })



app.listen(3000, () => {
    console.log("ON PORT 3000!");
})
