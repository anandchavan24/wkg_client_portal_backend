var jwt = require('jsonwebtoken');
var privateKey = 'bgkjrwfoewih435445';

exports.getToken = (userData) => {
    var token = jwt.sign(userData, privateKey);
    return token;
}

exports.verifyToken = (req, res, next) => {
    try{
        authToken = req.header('authorization').substring(7, req.header('authorization').length);
        console.log(authToken)
        var decoded = jwt.verify(authToken, privateKey);
    }
    catch(err){
        console.log(err)
        res.status(401).send({
            statusCode:401,
            message: "Invalid Token"
        });
        return
    }

    if (decoded) {
        next();
    } else {
        res.status(401).send({
            message: "Unauthorized user"
        });
        return
    }
}
