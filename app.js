const express = require("express");
const app = express();
const path = require('path');



app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname, 'public')));


app.use('/views/public', express.static('public'));



app.get('/', (req, res) => {
    res.render('index1');
})

// app.post('/cache', (req, res) => {
//     res.render('cache');
// })

// app.post('/memory', (req, res) => {
//     res.render('memory');
// })



app.listen(3000, () => {
    console.log("ON PORT 3000!")
})
