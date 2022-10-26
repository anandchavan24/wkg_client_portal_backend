const MAX_INVALID_ATTEMPT = 5;
const DURATION_TO_LOCK_USER = 1;
const OTP_EXPIRE_TIME = 1;

const EMAIL_SUBJCTS = {
    "OTP":"OTP From  WKG"
}

const EMAIL_CONTENT = {
    "OTP":" is your OTP,<br> DO not share OTP to anyone <b>"
}

const ERROR_MESSAGES = {
    OK : "Success",
    NotFound : "Not found",
    UnknownError : "Something went wrong",
    InvalidParam : "Invalid parameter",
    NullRequest : "Null request parameter",
    UnsupportedMediaType : "Unsupported MediaType",
    UserIsLocked:"User is locked",
    UserDetailsNotExists:"User details does not exists",
    EmailIsRequired:"Email Is Required",
    PasswordIsRequired:"Password Is Required",
    ValidEmail:"PLease enter valid email",
    OTPsent:"OTP sent successfullly"
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
module.exports = {MAX_INVALID_ATTEMPT,DURATION_TO_LOCK_USER,ERROR_MESSAGES,TIME_FORMAT,EMAIL_OBJECT,USER_TYPE,TABLES,OTP_EXPIRE_TIME,EMAIL_SUBJCTS,EMAIL_CONTENT}