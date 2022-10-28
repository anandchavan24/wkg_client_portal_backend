const MAX_INVALID_ATTEMPT = 5;
const DURATION_TO_LOCK_USER = 1;
const OTP_EXPIRE_TIME = 1;
const DOMAIN = "http://localhost:4500"

const EMAIL_SUBJCTS = {
    "OTP":"OTP From  WKG"
}

const EMAIL_CONTENT = {
    "OTP":" is your OTP,<br> DO not share OTP to anyone <b>"
}

const RESPONSE_MESSAGES = {
    OK : "Success",
    NotFound : "Not found",
    UnknownError : "Something went wrong",
    InvalidParam : "Invalid Credentials",
    NullRequest : "Null request parameter",
    UnsupportedMediaType : "Unsupported MediaType",
    UserIsLocked:"User is locked",
    UserDetailsNotExists:"User details does not exists",
    EmailIsRequired:"Email Is Required",
    PasswordIsRequired:"Password Is Required",
    InValidEmail:"PLease enter valid email",
    OTPsent:"OTP sent successfullly",
    OTPIsRequired:"OTP is required",
    InvalidOTP:"Invalid OTP",
    OTPExpire:"OTP is expired",
    UnlockUser:"User unlock successfully",
    userIsNotLocked:"User is not locked",
    PasswordResetSucessfully:"Password Reset Sucessfully",
    PasswordChangeSucessfully:"Password Change Sucessfully",
    passwordNotMatched:"Old password does not matched"
}

const RESPONSE_CODE = {
    OK : 200,
    NotFound : 700,
    InValidEmail:701,
    NullRequest : 702,
    InvalidParam : 703,
    UserIsLocked:704,
    InvalidOTP:705,
    OTPExpire:706,
    UnknownError : 707,
    UserDetailsNotExists:708,
    userIsNotLocked:709,
    passwordNotMatched:801
}

const EMAIL_OBJECT = {
    to: 'anand.chavan@joshsoftware.com',
    from: 'anand.chavan@joshsoftware.com',
    subject: 'Sending with SendGrid is Fun',
    text: 'and easy to do anywhere, even with Node.js',
    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
}

const USER_TYPE = {
    OWNER:'OWNERS',
    ADVICER:'ADVISORS'
}

const TABLES = {
    OWNER:"Owners",
    ADVICER:"Advisors"
}

const TIME_FORMAT = "YYYY-MM-DD HH:mm:ss"
module.exports = {MAX_INVALID_ATTEMPT,DURATION_TO_LOCK_USER,RESPONSE_MESSAGES,TIME_FORMAT,EMAIL_OBJECT,USER_TYPE,TABLES,OTP_EXPIRE_TIME,EMAIL_SUBJCTS,EMAIL_CONTENT,DOMAIN,RESPONSE_CODE}