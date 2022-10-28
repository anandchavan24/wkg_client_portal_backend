const { MAX_INVALID_ATTEMPT, DURATION_TO_LOCK_USER, RESPONSE_MESSAGES, OTP_EXPIRE_TIME } = require('../config/constant')
const User = require('../models/user.model');
const jwt = require('../utils/jwtAuth');
const moment = require('moment')
const logger = require("../config/logger");
const { USER_TYPE, TABLES } = require('../config/constant')
const { RESPONSE_CODE } = require('../config/constant')
const { compareTime, generateOTP, sendEmail } = require('../helpers/function')


exports.login = async ({ email, password }, response) => {
    const userDetails = await getUserDetailFromDB(email);
    if (userDetails) {
        const Table = (userDetails.userType == USER_TYPE.OWNER) ? TABLES.OWNER : TABLES.ADVICER;
        if (userDetails.IsLocked) {
            if (compareTime({ timeStamp: userDetails.LockedTimeStamp, duration: DURATION_TO_LOCK_USER })) {
                if (await callUpdateQueryForLock(email, false, null, 0, Table)) {
                    const userDetails = await getUserDetailFromDB(email);
                    checkPasswordAndLockCondition(userDetails, email, password, response, Table);
                }
                else {
                    response(null, null, RESPONSE_CODE.UnknownError, RESPONSE_MESSAGES.UnknownError);
                }
            }
            else {
                response(null, null, RESPONSE_CODE.UserIsLocked, RESPONSE_MESSAGES.UserIsLocked);
            }
        }
        else {
            checkPasswordAndLockCondition(userDetails, email, password, response, Table);
        }
    }
    else {
        logger.error(RESPONSE_MESSAGES.UserDetailsNotExists)
        response(null, null, RESPONSE_CODE.UserDetailsNotExists, RESPONSE_MESSAGES.UserDetailsNotExists);
    }
}

async function checkPasswordAndLockCondition(userDetails, email, password, response, Table) {
    if (userDetails.Pwd == password) {
        if (await callUpdateQueryForLock(email, false, null, 0, Table)) {
            console.log(userDetails)
            const authToken = jwt.getToken({ email, password })
            const responseobject = {
                firstName: userDetails.FirstName,
                lastName: userDetails.LastName,
                userId: userDetails.userId,
                userType: userDetails.userType,
                authToken: authToken,
            }
            response(null, responseobject, RESPONSE_CODE.OK, RESPONSE_MESSAGES.OK);
        }
        else {
            response(null, null, RESPONSE_CODE.UnknownError, RESPONSE_MESSAGES.UnknownError);
        }
    }
    else {
        const reachedToMaxLimit = ((userDetails.InvalidAttemptCount < MAX_INVALID_ATTEMPT - 1) ? ({ status: false, email: email, IsLocked: false, LockedTimeStamp: null, InvalidAttemptCount: userDetails.InvalidAttemptCount + 1 }) : ({ status: true, email: email, IsLocked: true, LockedTimeStamp: moment().toDate(), InvalidAttemptCount: userDetails.InvalidAttemptCount + 1 }));
        try {
            if (await callUpdateQueryForLock(reachedToMaxLimit.email, reachedToMaxLimit.IsLocked, reachedToMaxLimit.LockedTimeStamp, ((reachedToMaxLimit.status) ? MAX_INVALID_ATTEMPT : reachedToMaxLimit.InvalidAttemptCount), Table)) {
                const responseobject = (!reachedToMaxLimit.status) ? ({
                    invalidAttemptCount: userDetails.InvalidAttemptCount + 1,
                    totalInvalidAttemptCount: MAX_INVALID_ATTEMPT
                }) : null
                const dynamicErrorMessage = (!reachedToMaxLimit.status) ? RESPONSE_MESSAGES.InvalidParam : RESPONSE_MESSAGES.UserIsLocked;
                const dynamicErrorCode = (!reachedToMaxLimit.status) ? RESPONSE_CODE.InvalidParam : RESPONSE_CODE.UserIsLocked;
                response(null, responseobject, dynamicErrorCode, dynamicErrorMessage);
            }
            else {
                response(null, null, RESPONSE_CODE.UnknownError, RESPONSE_MESSAGES.UnknownError);
            }
        }
        catch (err) {
            response(err, null, RESPONSE_CODE.UnknownError, RESPONSE_MESSAGES.UnknownError);
        }
    }
}

async function getUserDetailFromDB(email) {
    return await User.getDetailsByEmailsp({ email });

}

async function callUpdateQueryForLock(email, IsLocked, LockedTimeStamp, InvalidAttemptCount, Table) {
    return await User.updateDetails({ email: email, IsLocked: IsLocked, LockedTimeStamp: LockedTimeStamp, InvalidAttemptCount: InvalidAttemptCount, Table: Table });
}

exports.sendOTP = async ({ email }, response) => {
    const userDetails = await getUserDetailFromDB(email);
    if (userDetails) {
        const userDetailsInOtpTable = await User.getDetailsForOtp({ email: email })
        try {
            if (userDetailsInOtpTable != null) {
                if (!compareTime({ timeStamp: userDetailsInOtpTable.CreatedAt, duration: OTP_EXPIRE_TIME })) {
                    sendEmail({ email: email, OTP: userDetailsInOtpTable.OTP });
                    response(null, null, RESPONSE_CODE.OK, RESPONSE_MESSAGES.OTPsent);
                }
                else {
                    const newOTP = generateOTP();
                    if (await User.updateOTP({ Email_Mobile: email, OTP: newOTP, CreatedAt: moment().toDate() })) {
                        sendEmail({ email: email, OTP: newOTP })
                        response(null, null, RESPONSE_CODE.OK, RESPONSE_MESSAGES.OTPsent);
                    }
                    else {
                        response(err, null, RESPONSE_CODE.UnknownError, RESPONSE_MESSAGES.UnknownError);
                    }
                }
            }
            else {
                const newOTP = generateOTP();
                if (await User.addDetailsIntoOtp({ Email_Mobile: email, OTP: newOTP, CreatedAt: moment().toDate() })) {
                    sendEmail({ email: email, OTP: newOTP })
                    response(null, null, RESPONSE_CODE.OK, RESPONSE_MESSAGES.OTPsent);
                }
                else {
                    response(err, null, RESPONSE_CODE.UnknownError, RESPONSE_MESSAGES.UnknownError);
                }
            }
        }
        catch (err) {
            response(err, null, 701, RESPONSE_MESSAGES.UnknownError);
        }
    }
    else {
        logger.error(RESPONSE_MESSAGES.UserDetailsNotExists)
        response(null, null, 701, RESPONSE_MESSAGES.UserDetailsNotExists);
    }
}

exports.verifyOTP = async ({ OTP, email }, response) => {
    const userDetails = await getUserDetailFromDB(email);
    if (userDetails) {
        const userDetailsInOtpTable = await User.getDetailsForOtp({ email: email })
        console.log(userDetailsInOtpTable)
        try {
            if (userDetailsInOtpTable != null) {
                if (userDetailsInOtpTable.OTP == OTP) {
                    if (!compareTime({ timeStamp: userDetailsInOtpTable.CreatedAt, duration: OTP_EXPIRE_TIME })) {
                        response(null, { matched: true }, 200, RESPONSE_MESSAGES.OK);
                    }
                    else {
                        response(null, { matched: false }, 703, RESPONSE_MESSAGES.OTPExpire);
                    }
                }
                else {
                    response(null, { matched: false }, 703, RESPONSE_MESSAGES.InvalidOTP);
                }
            }
            else {
                response(null, null, 703, RESPONSE_MESSAGES.InvalidOTP);
            }
        }
        catch (err) {
            console.log(err);
            response(err, null, 701, RESPONSE_MESSAGES.UnknownError);
        }
    }
    else {
        logger.error(RESPONSE_MESSAGES.UserDetailsNotExists)
        response(null, null, 701, RESPONSE_MESSAGES.UserDetailsNotExists);
    }
}


exports.unlockUser = async ({ email }, response) => {
    const userDetails = await getUserDetailFromDB(email);
    if (userDetails) {
        const tableToModify = (userDetails.userType == USER_TYPE.OWNER) ? TABLES.OWNER : TABLES.ADVICER;
        if (userDetails.IsLocked) {
            if (await User.unlockUser({ Email_Mobile: email, tableToModify: tableToModify })) {
                response(null, null, RESPONSE_CODE.OK, RESPONSE_MESSAGES.UnlockUser);
            }
            else {
                response(null, null, RESPONSE_CODE.UnknownError, RESPONSE_MESSAGES.UnknownError);
            }
        }
        else {
            response(null, null, RESPONSE_CODE.userIsNotLocked, RESPONSE_MESSAGES.userIsNotLocked);
        }
    }
    else {
        logger.error(RESPONSE_MESSAGES.UserDetailsNotExists)
        response(null, null, RESPONSE_CODE.UserDetailsNotExists, RESPONSE_MESSAGES.UserDetailsNotExists);
    }
}


exports.resetPassword = async ({ email,passwordToReset }, response) => {
    const userDetails = await getUserDetailFromDB(email);
    if (userDetails) {
        const tableToModify = (userDetails.userType == USER_TYPE.OWNER) ? TABLES.OWNER : TABLES.ADVICER;
        if (await User.resetPassword({ email: email, tableToModify: tableToModify,passwordToReset:passwordToReset })) {
            response(null, null, RESPONSE_CODE.OK, RESPONSE_MESSAGES.PasswordResetSucessfully);
        }
        else {
            response(null, null, RESPONSE_CODE.UnknownError, RESPONSE_MESSAGES.UnknownError);
        }
    }
    else {
        logger.error(RESPONSE_MESSAGES.UserDetailsNotExists)
        response(null, null, RESPONSE_CODE.UserDetailsNotExists, RESPONSE_MESSAGES.UserDetailsNotExists);
    }
}

exports.changePassword = async ({ email,newPassword,oldPassword }, response) => {
    const userDetails = await getUserDetailFromDB(email);
    if (userDetails) {
        if(userDetails.Pwd == oldPassword){
            const tableToModify = (userDetails.userType == USER_TYPE.OWNER) ? TABLES.OWNER : TABLES.ADVICER;
            if (await User.changePassword({ email: email, tableToModify: tableToModify,newPassword:newPassword})) {
                response(null, null, RESPONSE_CODE.OK, RESPONSE_MESSAGES.PasswordChangeSucessfully);
            }
            else {
                response(null, null, RESPONSE_CODE.UnknownError, RESPONSE_MESSAGES.UnknownError);
            }
        }
        else{
            response(null, null, RESPONSE_CODE.passwordNotMatched, RESPONSE_MESSAGES.passwordNotMatched);
        }
    }
    else {
        logger.error(RESPONSE_MESSAGES.UserDetailsNotExists)
        response(null, null, RESPONSE_CODE.UserDetailsNotExists, RESPONSE_MESSAGES.UserDetailsNotExists);
    }
}

