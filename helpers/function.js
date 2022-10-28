const moment = require('moment');
const otpGenerator = require('otp-generator');
const emailHelper = require('../helpers/email');
const { EMAIL_OBJECT, EMAIL_CONTENT, EMAIL_SUBJCTS } = require('../config/constant')


function compareTime({ timeStamp, duration }) {
    return moment(moment(timeStamp).add(duration, 'm').format('YYYY-MM-DD HH:mm:ss')).isSameOrBefore(moment().format('YYYY-MM-DD HH:mm:ss'))
}

function generateOTP() {
    return otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false, digits: true });
}

function sendEmail({ email, OTP }) {
    EMAIL_OBJECT.to = email;
    EMAIL_OBJECT.subject = EMAIL_SUBJCTS.OTP
    EMAIL_OBJECT.html = OTP + EMAIL_CONTENT.OTP
    emailHelper.sendEmail({ EMAIL_OBJECT: EMAIL_OBJECT }, (err, res) => {
    })
}

module.exports = { compareTime, generateOTP, sendEmail }