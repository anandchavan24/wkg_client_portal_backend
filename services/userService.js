const { MAX_INVALID_ATTEMPT, DURATION_TO_LOCK_USER, ERROR_MESSAGES, TIME_FORMAT, OTP_EXPIRE_TIME, EMAIL_CONTENT, EMAIL_SUBJCTS } = require('../config/constant')
const User = require('../models/user.model');
const jwt = require('../utils/jwtAuth');
const moment = require('moment')
const logger = require("../config/logger");
const { USER_TYPE, TABLES } = require('../config/constant')
const emailHelper = require('../helpers/email');
const otpGenerator = require('otp-generator')
const { EMAIL_OBJECT } = require('../config/constant')


exports.login = async ({ email, password }, response) => {
    const userDetails = await getUserDetailFromDB(email);
    const Table = (userDetails.userType == USER_TYPE.OWNER) ? TABLES.OWNER : TABLES.ADVICER;
    if (userDetails) {
        if (userDetails.IsLocked) {
            if (compareTime({ timeStamp: userDetails.LockedTimeStamp, checkTime: DURATION_TO_LOCK_USER })) {
                if (await callUpdateQueryForLock(email, false, null, 0, Table)) {
                    checkPasswordAndLockCondition(userDetails, email, password, response, Table);
                }
                else {
                    response(null, null, 701, ERROR_MESSAGES.UnknownError);
                }
            }
            else {
                response(null, null, 422, ERROR_MESSAGES.UserIsLocked);
            }
        }
        else {
            checkPasswordAndLockCondition(userDetails, email, password, response, Table);
        }
    }
    else {
        logger.error(ERROR_MESSAGES.UserDetailsNotExists)
        response(null, null, 701, ERROR_MESSAGES.UserDetailsNotExists);
    }
}

function compareTime(timeStamp, duration) {
    return moment(moment(timeStamp).add(duration, 'minutes')).isSameOrBefore(moment())
}


async function checkPasswordAndLockCondition(userDetails, email, password, response, Table) {
    if (userDetails.Pwd == password) {
        if (await callUpdateQueryForLock(email, false, null, 0, Table)) {
            const authToken = jwt.getToken({ email, password })
            const responseobject = {
                FirstName: userDetails.FirstName,
                LastName: userDetails.LastName,
                authToken: authToken
            }
            response(null, responseobject, 200, ERROR_MESSAGES.OK);
        }
        else {
            response(null, null, 701, ERROR_MESSAGES.UnknownError);
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
                const dynamicErrorMessage = (!reachedToMaxLimit.status) ? ERROR_MESSAGES.InvalidParam : ERROR_MESSAGES.UserIsLocked;
                response(null, responseobject, 700, dynamicErrorMessage);
            }
            else {
                response(null, null, 701, ERROR_MESSAGES.UnknownError);
            }
        }
        catch (err) {
            response(err, null, 701, ERROR_MESSAGES.UnknownError);
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
        const Table = (userDetails.userType == USER_TYPE.OWNER) ? TABLES.OWNER : TABLES.ADVICER;
        const userDetailsInOtpTable = await User.getDetailsForOtp({ email: email, Table: Table })
        try {
            if (userDetailsInOtpTable != null) {
                if (compareTime({ timeStamp: userDetailsInOtpTable.CreatedAt, checkTime: OTP_EXPIRE_TIME })) {
                    sendEmail({ email: email, OTP: userDetailsInOtpTable.OTP });
                    response(null, null, 200, ERROR_MESSAGES.OTPsent);
                }
                else {
                    const newOTP = generateOTP();
                    if (await User.updateOTP({ Email_Mobile: email, OTP: newOTP, CreatedAt: new Date() })) {
                        sendEmail({ email: email, OTP: newOTP })
                        response(null, null, 200, ERROR_MESSAGES.OTPsent);
                    }
                    else {
                        response(err, null, 701, ERROR_MESSAGES.UnknownError);
                    }
                }
            }
            else {
                const newOTP = generateOTP();
                if (await User.addDetailsIntoOtp({ Email_Mobile: email, OTP: newOTP, CreatedAt: new Date() })) {
                    sendEmail({ email: email, OTP: newOTP })
                    response(null, null, 200, ERROR_MESSAGES.OTPsent);
                }
                else {
                    response(err, null, 701, ERROR_MESSAGES.UnknownError);
                }
            }
        }
        catch (err) {
            response(err, null, 701, ERROR_MESSAGES.UnknownError);
        }
    }
    else {
        logger.error(ERROR_MESSAGES.UserDetailsNotExists)
        response(null, null, 701, ERROR_MESSAGES.UserDetailsNotExists);
    }
}

function generateOTP() {
    return otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, specialChars: false, digits: true });
}

function sendEmail({ email, OTP }) {
    EMAIL_OBJECT.to = email;
    EMAIL_OBJECT.subject = EMAIL_SUBJCTS.OTP
    EMAIL_OBJECT.html = OTP + EMAIL_CONTENT.OTP
    emailHelper.sendEmail({ EMAIL_OBJECT: EMAIL_OBJECT }, (err, res) => {
    })
}
