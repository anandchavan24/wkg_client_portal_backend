const logger = require("../config/logger");
const User = function (user) { }
const { poolPromise } = require('../config/db.connection')
const sqlms = require('mssql');
const moment = require('moment')


User.getDetailsByEmailsp = async ({ email }) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('email', sqlms.VarChar(30), email)
            .execute('getDetailsByEmail')
        if (result && result.recordset && result.recordset.length > 0) {
            return (null, result.recordset[0])
        }
        else {
            return (null, null)
        }
    } catch (err) {
        return (err.message, null)
    }
}

User.updateDetails = async ({ email, IsLocked, LockedTimeStamp, InvalidAttemptCount, Table }) => {
    try {
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
        return (err.message, null)
    }
}


User.updateOTP = async ({ Email_Mobile, OTP, CreatedAt }) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('Email_Mobile', sqlms.VarChar(30), Email_Mobile)
            .input('OTP', sqlms.VarChar(6), OTP)
            .input('CreatedAt', sqlms.DateTime, CreatedAt)
            .query("update ClientPortal_OTPLog set CreatedAt = @CreatedAt,OTP=@OTP where Email_Mobile = @Email_Mobile")
        if (result && result.rowsAffected && result.rowsAffected.length > 0 && result.rowsAffected[0] > 0) {
            return true
        }
        else {
            return false;
        }
    } catch (err) {
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
        return (err.message, null)
    }
}

User.unlockUser = async ({ Email_Mobile, tableToModify }) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('Email_Mobile', sqlms.VarChar(30), Email_Mobile)
            .query("Update " + tableToModify + " SET LockedTimeStamp = null,IsLocked = 0 ,InvalidAttemptCount = 0  where WebAccessCode = @Email_Mobile");
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

User.resetPassword = async ({ email, tableToModify, passwordToReset }) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('passwordToReset', sqlms.VarChar(30), passwordToReset)
            .input('email', sqlms.VarChar(30), email)
            .query("Update " + tableToModify + " SET WebAccessPassword = @passwordToReset  where WebAccessCode = @email");
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

User.changePassword = async ({ email, tableToModify, newPassword }) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('newPassword', sqlms.VarChar(30), newPassword)
            .input('email', sqlms.VarChar(30), email)
            .query("Update " + tableToModify + " SET WebAccessPassword = @newPassword  where WebAccessCode = @email");
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