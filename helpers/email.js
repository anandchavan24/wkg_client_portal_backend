const sgMail = require('../config/email')
const logger = require('../config/logger')

exports.sendEmail = ({EMAIL_OBJECT},response) => {
    console.log("Email Object",EMAIL_OBJECT)
    sgMail.send(EMAIL_OBJECT).then(() => {
        response('Email sent')
    })
        .catch((error) => {
            logger.error("Error while sending email")
            response(error)
        })
}