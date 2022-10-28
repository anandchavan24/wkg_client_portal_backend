const userService = require('../services/user.service')
const apiResponse = require('../config/statusMessages');
const { emailRegexp } = require('../config/regexp')
const { RESPONSE_MESSAGES, RESPONSE_CODE } = require('../config/constant')
const logger = require("../config/logger");


exports.login = (req, res) => {
    if (!req.body.email) {
        logger.error(RESPONSE_MESSAGES.EmailIsRequired);
        (apiResponse(RESPONSE_CODE.NullRequest, RESPONSE_MESSAGES.EmailIsRequired, null, null, res));
        return;
    }
    if (!req.body.password) {
        logger.error(RESPONSE_MESSAGES.PasswordIsRequired);
        (apiResponse(RESPONSE_CODE.error, RESPONSE_MESSAGES.PasswordIsRequired, null, null, res));
        return;
    }

    if (!emailRegexp.test(req.body.email)) {
        logger.error(RESPONSE_MESSAGES.InValidEmail);
        (apiResponse(RESPONSE_CODE.InValidEmail, RESPONSE_MESSAGES.InValidEmail, null, null, res));
        return;
    }

    userService.login({ email: req.body.email, password: req.body.password }, (err, data, statusCode, message) => {
        if (err) {
            logger.error({
                statusCode: statusCode,
                message: message,
                data: data
            });
            (apiResponse(statusCode, message, data, null, res));
        }
        else {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', '*');
            if (data && data.authToken) {
                res.header('authToken', data.authToken);
                delete data.authToken
            }
            (apiResponse(statusCode, message, data, null, res));
        }
    })
}


exports.sendOTP = (req, res) => {
    if (!req.body.email) {
        logger.error(RESPONSE_MESSAGES.EmailIsRequired);
        (apiResponse(RESPONSE_CODE.NullRequest, RESPONSE_MESSAGES.EmailIsRequired, null, null, res));
        return;
    }
    if (!emailRegexp.test(req.body.email)) {
        logger.error(RESPONSE_MESSAGES.InValidEmail);
        (apiResponse(RESPONSE_CODE.InValidEmail, RESPONSE_MESSAGES.InValidEmail, null, null, res));
        return;
    }
    userService.sendOTP({ email: req.body.email }, (err, data, statusCode, message) => {
        if (err) {
            logger.error({
                statusCode: statusCode,
                message: message,
                data: data
            });
            (apiResponse(statusCode, message, data, null, res));
        }
        else {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', '*');
            (apiResponse(statusCode, message, data, null, res));
        }
    })
}

exports.verifyOTP = (req, res) => {
    if (!req.body.OTP) {
        logger.error(RESPONSE_MESSAGES.OTPIsRequired);
        (apiResponse(RESPONSE_CODE.NullRequest, RESPONSE_MESSAGES.OTPIsRequired, null, null, res));
        return;
    }
    if (!req.body.email) {
        logger.error(RESPONSE_MESSAGES.EmailIsRequired);
        (apiResponse(RESPONSE_CODE.NullRequest, RESPONSE_MESSAGES.EmailIsRequired, null, null, res));
        return;
    }
    if (!emailRegexp.test(req.body.email)) {
        logger.error(RESPONSE_MESSAGES.InValidEmail);
        (apiResponse(RESPONSE_CODE.InValidEmail, RESPONSE_MESSAGES.InValidEmail, null, null, res));
        return;
    }
    userService.verifyOTP({ OTP: req.body.OTP, email: req.body.email }, (err, data, statusCode, message) => {
        if (err) {
            logger.error({
                statusCode: statusCode,
                message: message,
                data: data
            });
            (apiResponse(statusCode, message, data, null, res));
        }
        else {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', '*');
            (apiResponse(statusCode, message, data, null, res));
        }
    })
}



exports.unlockUser = (req, res) => {
    if (!req.body.email) {
        logger.error(RESPONSE_MESSAGES.EmailIsRequired);
        (apiResponse(RESPONSE_CODE.NullRequest, RESPONSE_MESSAGES.EmailIsRequired, null, null, res));
        return;
    }
    if (!emailRegexp.test(req.body.email)) {
        logger.error(RESPONSE_MESSAGES.InValidEmail);
        (apiResponse(RESPONSE_CODE.InValidEmail, RESPONSE_MESSAGES.InValidEmail, null, null, res));
        return;
    }
    userService.unlockUser({ email: req.body.email }, (err, data, statusCode, message) => {
        if (err) {
            logger.error({
                statusCode: statusCode,
                message: message,
                data: data
            });
            (apiResponse(statusCode, message, data, null, res));
        }
        else {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', '*');
            (apiResponse(statusCode, message, data, null, res));
        }
    })
}

exports.resetPassword = (req, res) => {
    if (!req.body.newPassword) {
        logger.error(RESPONSE_MESSAGES.NullRequest);
        (apiResponse(RESPONSE_CODE.NullRequest, RESPONSE_MESSAGES.PasswordIsRequired, null, null, res));
        return;
    }
    if (!req.body.email) {
        logger.error(RESPONSE_MESSAGES.EmailIsRequired);
        (apiResponse(RESPONSE_CODE.NullRequest, RESPONSE_MESSAGES.EmailIsRequired, null, null, res));
        return;
    }
    if (!emailRegexp.test(req.body.email)) {
        logger.error(RESPONSE_MESSAGES.InValidEmail);
        (apiResponse(RESPONSE_CODE.InValidEmail, RESPONSE_MESSAGES.InValidEmail, null, null, res));
        return;
    }
    userService.resetPassword({ email: req.body.email, passwordToReset: req.body.newPassword }, (err, data, statusCode, message) => {
        if (err) {
            logger.error({
                statusCode: statusCode,
                message: message,
                data: data
            });
            (apiResponse(statusCode, message, data, null, res));
        }
        else {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', '*');
            (apiResponse(statusCode, message, data, null, res));
        }
    })
}


