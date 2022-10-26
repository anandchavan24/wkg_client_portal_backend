module.exports = {
    apiResponse : (statusCode,message,data,errors,res) =>{
        res.status(statusCode).send({
            statusCode:statusCode,
            message:message,
            data:data
        })
    }
}