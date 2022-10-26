const logger = require("../config/logger");
var dbValues = require('../config/db.config');
const sqlms = require('mssql');

const { DATABASE, SERVER, PASSWORD, USER, PORT } = dbValues;

const config = {
    user: USER,
    password: PASSWORD,
    database: DATABASE,
    server: SERVER,
    port: PORT,
    options: {
        trustedConnection: true,
        encrypt: true,
        enableArithAbort: true,
        trustServerCertificate: true,
    },
}

const poolPromise = new sqlms.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('Connected to MSSQL')
        return pool
    })
    .catch(err => console.log('Database Connection Failed! Bad Config: ', err))

module.exports = {
    sqlms, poolPromise
}