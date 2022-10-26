const logger = require("./logger");
var dbValues = require('./db.config');
const sqlms = require('mssql');

const { DATABASE, SERVER, PASSWORD, USER, OPTIONS } = dbValues;

const config = {
    user: USER,
    password: PASSWORD,
    database: DATABASE,
    server: SERVER,
    options: {
        trustedConnection: OPTIONS.TRUSTED_CONNECTION,
        encrypt: OPTIONS.ENCRYPT,
        enableArithAbort: OPTIONS.ENABLEARITHABORT,
        trustServerCertificate: OPTIONS.TRUST_SERVER_CERTIFICATE,
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