// var sql = require('mssql');
// //var dbValues = require('../../config/db.config');
// //const { DATABASE, HOST, PASSWORD, USER } = dbValues

// const db = new sql.ConnectionPool({
//             user: 'sa',
//             password: 'Compass2022$$',
//             server: '192.168.21.97',
//             database: 'Compass',
//             options: {
//                 trustedConnection: true,
//                 encrypt: true,
//                 enableArithAbort: true,
//                 trustServerCertificate: true,
            
//               }
// })
//   .connect()
//   .then(pool => {
//     console.log('Connected to MSSQL')
//     return pool
//   })
//   .catch(err => console.log('Database Connection Failed! Bad Config: ', err))

// module.exports = db;
//const logger = require("../../config/logger");
// const sql = require('node-mssql').mssql;


const sqlms = require('mssql');



const config = {
            user: 'sa',
            password: 'Compass2022$$',
            server: '192.168.21.97',
            database: 'Compass',
            options: {
                trustedConnection: true,
                encrypt: true,
                enableArithAbort: true,
                trustServerCertificate: true,
              }
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


//module.exports = connection
