const userService = require('../services/user.service')
const apiResponse = require('../config/statusMessages');
const { emailRegexp } = require('../config/regexp')
const { ERROR_MESSAGES } = require('../config/constant')
const logger = require("../config/logger");


exports.login = (req, res) => {

    if (!req.body.email) {
        logger.error(ERROR_MESSAGES.EmailIsRequired);
        (apiResponse(702, ERROR_MESSAGES.EmailIsRequired, null, null, res));
        return;
    }
    if (!req.body.password) {
        logger.error(ERROR_MESSAGES.PasswordIsRequired);
        (apiResponse(702, ERROR_MESSAGES.PasswordIsRequired, null, null, res));
        return;
    }

    if (!emailRegexp.test(req.body.email)) {
        logger.error(ERROR_MESSAGES.ValidEmail);
        (apiResponse(702, ERROR_MESSAGES.ValidEmail, null, null, res));
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
                res.header('Authorization', data.authToken);
                delete data.authToken
            }
            (apiResponse(statusCode, message, data, null, res));
        }
    })
}


exports.sendOTP = (req, res) => {
    if (!req.body.email) {
        logger.error(ERROR_MESSAGES.EmailIsRequired);
        (apiResponse(420, ERROR_MESSAGES.EmailIsRequired, null, null, res));
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

