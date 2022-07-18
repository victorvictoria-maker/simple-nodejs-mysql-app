const mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config();

let instance = null;

const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DB_PORT
});

connection.connect((err) => {
    if (err) {
        console.log(err.message);
    } else {
        // console.log('db ' + connection.state);
    }
});


class dbService {
    // to avoid creating a new object of the class everytime
    static getDbServiceInstance () {
        return instance ? instance : new dbService();
    }
    
    async getAllData () {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = 'SELECT * FROM app_table';

                connection.query(query, (err, results) => {
                    if (err) {
                        reject(new Error(err.message));
                    } else {
                        resolve(results);
                    }
                });
            });

            return response;
        } catch (error) {
            console.log(error);
        }
    };


    async newNameValue (nameValueFromFrontend) {
        try {
            const dateAdded = new Date();
            const insertId = await new Promise((resolve, reject) => {
                const query = 'INSERT INTO app_table (name, date_added) VALUES (?, ?);';

                connection.query(query, [nameValueFromFrontend, dateAdded],(err, result) => {
                    if (err) {
                        reject(new Error(err.message));
                    } else {
                        resolve(result.insertId);
                    }
                });
            });
            // console.log(insertId);
            // return insertId;
            return {
                id: insertId,
                name: nameValueFromFrontend,
                dateAdded: dateAdded
            };
        } catch (error) {
            console.log(error);
        }
    };


    async deleteRow(id) {
        try {
            id = parseInt(id, 10);
            const response = await new Promise((resolve, reject) => {
                const query = 'DELETE FROM app_table WHERE id = ?;';

                connection.query(query, [id],(err, result) => {
                    if (err) {
                        reject(new Error(err.message));
                    } else {
                        resolve(result.affectedRows);
                    }
                });
            });
            // console.log(response);
            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
            return false;
        }
    };


    async updateName(id, name) {
        try {
            id = parseInt(id, 10);
            const response = await new Promise((resolve, reject) => {
                const query = 'UPDATE app_table SET name = ? WHERE id = ?';

                connection.query(query, [name, id],(err, result) => {
                    if (err) {
                        reject(new Error(err.message));
                    } else {
                        resolve(result.affectedRows);
                    }
                });
            });
            // console.log(response);
            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
            return false;
        }
    };

    async searchByName(name) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = 'SELECT * FROM app_table WHERE name = ?';

                connection.query(query, [name], (err, results) => {
                    if (err) {
                        reject(new Error(err.message));
                    } else {
                        resolve(results);
                    }
                });
            });

            return response;
        } catch (error) {
            console.log(error);
        }
    };
};

module.exports = dbService;