const {login} = require('../services/user.service')
const {apiResponse} = require('../helpers/utils');

module.exports = {
    login: (req,res)=>{
        login(req.body, (err, data, statusCode, message) => {
            if (err) {
                (apiResponse(statusCode, message, data, null, res));        
            } else {
                res.header('Access-Control-Allow-Origin', '*');
                res.header('Access-Control-Allow-Methods', '*'); 
                if(data && data.authToken)
                    res.header('authorization',data.authToken);            
                (apiResponse(statusCode, message, data, null, res));
            }
        })
    }
}