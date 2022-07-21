const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
const { request, response } = require('express');
dotenv.config();

// database
const databaseService = require('./databaseService');
const dbService = require('./databaseService');

// cors is for when we have an API call, it doesn't block so we can send data to the data
app.use(cors());
// in order to send in json folder
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// creating routes
// create
app.post('/insert', (request, response) => {
    const { nameValueFromFrontend } = request.body;
    // console.log(nameValueFromFrontend);

    const db = dbService.getDbServiceInstance();
    const result = db.newNameValue(nameValueFromFrontend);

    result
    .then(data => response.json({ dataFromDb: data }))
    .catch(error => console.log(error));


});

// read
app.get('/getAll', (request, response) => {
    const db = dbService.getDbServiceInstance();
    const result = db.getAllData();

    result
    .then(data => response.json({dataFromDb: data}))
    .catch(error => console.log(error));

    // response.json({
        // success: true
    // });
});


// delete
app.get('/delete/:id', (request, response) => {
    // console.log(request.params);
    const { id } = request.params;

    const db = dbService.getDbServiceInstance();
    const result = db.deleteRow(id);

    result
    .then(data => response.json({ success: data}))
    .catch(error => console.log(error));
});

// updateEditedName
app.patch('/update', (request, response) => {
    const { id, name } = request.body;

    const db = dbService.getDbServiceInstance();
    const result = db.updateName(id, name);

    result
    .then(data => response.json({ success: data}))
    .catch(error => console.log(error));
});


// search
app.get('/search/:name', (request, response) => {
    const { name } = request.params;

    const db = dbService.getDbServiceInstance();
    const result = db.searchByName(name);

    result
    .then(data => response.json({ dataFromDb: data}))
    .catch(error => console.log(error));
}); 



app.listen(process.env.PORT, () => {
    console.log(`App is running on PORT ${process.env.PORT}`);
});
