const express = require('express');
const mongoose = require('mongoose');

const mongoUrl = 'mongodb+srv://schedules:schedules@cluster0.wg1yd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

mongoose.connect(mongoUrl, {useNewUrlParser: true, useUnifiedTopology: true  });

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    return res.json({
        message: 'welcome'
    })
});
app.use('/schedule', require('./schedules'));

app.listen(8000);
console.log(`Server started on: ${8000}`);