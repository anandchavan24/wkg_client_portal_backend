//const sql = require("../config/dbConfig")

// module.exports = {
//     getDetailsByEmail : ({ email }, respone) => {
//         sql.query('call getDetailsByEmail(?);', [email], (err, result) => {
//             if (err) {
//                 sql.end();
//                 respone(err, null);
//                 return//
//             }
//             respone(null, result[0][0])
//         })
//     }
// }

//const logger = require("../../config/logger");
const User = function (user) { }
const { poolPromise } = require('../config/dbConfig')
const sqlms = require('mssql');
const moment = require('moment')


User.getDetailsByEmail = async ({ email }) => {
    try {
        console.log("databaselayer")
        const pool = await poolPromise;
        const result = await pool.request()
            .input('email', sqlms.VarChar(30), email)
            .execute('getDetailsByEmail')
            console.log(result.recordset)
        if (result && result.recordset && result.recordset.length > 0) {
            return (null, result.recordset[0])
        }
        else {
            return (null, null)
        }
        
    } catch (err) {
        console.log("eror", err)
        return (err.message, null)
    }
}

User.updateDetails = async ({ email, IsLocked, LockedTimeStamp, InvalidAttemptCount, Table }) => {
    try {
        console.log(Table)
        const pool = await poolPromise;
        const result = await pool.request()
            .input('email', sqlms.VarChar(30), email)
            .input('IsLocked', sqlms.Bit, IsLocked)
            .input('LockedTimeStamp', sqlms.DateTime, LockedTimeStamp)
            .input('InvalidAttemptCount', sqlms.Int, InvalidAttemptCount)
            .query("update " + Table + " set IsLocked = @IsLocked,LockedTimeStamp = @LockedTimeStamp,InvalidAttemptCount = @InvalidAttemptCount  where WebAccessCode = @email")
        if (result && result.rowsAffected && result.rowsAffected.length > 0 && result.rowsAffected[0] > 0) {
            return true
        }
        else {
            return false;
        }
    } catch (err) {
        console.log(err)
        return (err.message, null)
    }
}


User.updateOTP = async ({ email }) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('email', sqlms.VarChar(30), email)
            .input('Entity', sqlms.VarChar(30), "ADVISORS")
            .query("update " + Table + " set Entity = @Entity where WebAccessCode = @email");

        const result2 = await pool.request()
            .input('email', sqlms.VarChar(30), email)
            .query("select * from Owners where WebAccessCode = @email");

        console.log(result2)
        if (result && result.rowsAffected && result.rowsAffected.length > 0 && result.rowsAffected[0] > 0) {
            return true
        }
        else {
            return false;
        }
    } catch (err) {
        console.log(err)
        return (err.message, null)
    }
}

User.getDetailsForOtp = async ({ email }) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('email', sqlms.VarChar(30), email)
            .query("select * from ClientPortal_OTPLog where Email_Mobile = @email");
        if (result && result.recordset && result.recordset.length > 0) {
            return (null, result.recordset[0])
        }
        else {
            return (null, null)
        }
    }
    catch (err) {
        console.log(err)
        return (err.message, null)
    }
}

User.addDetailsIntoOtp = async ({ Email_Mobile, OTP, CreatedAt }) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('Email_Mobile', sqlms.VarChar(30), Email_Mobile)
            .input('OTP', sqlms.VarChar(30), OTP)
            .input('CreatedAt', sqlms.DateTime, CreatedAt)
            .query("Insert into ClientPortal_OTPLog (Email_Mobile,OTP,CreatedAt) values (@Email_Mobile,@OTP,@createdAt)");
        if (result && result.rowsAffected && result.rowsAffected.length > 0 && result.rowsAffected[0] > 0) {
            return true
        }
        else {
            return false;
        }
    }
    catch (err) {
        console.log(err)
        return (err.message, null)
    }
}

module.exports = User;