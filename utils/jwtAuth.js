var jwt = require('jsonwebtoken');
var privateKey = 'bgkjrwfoewih435445';

exports.getToken = (userData) => {
    var token = jwt.sign(userData, privateKey);
    return token;
}

exports.verifyToken = (req, res, next) => {
    var authToken = req.rawHeaders[1]
    try{
        var decoded = jwt.verify(authToken, privateKey);
    }
    catch(err){
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
