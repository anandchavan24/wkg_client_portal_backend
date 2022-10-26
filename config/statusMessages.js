// const { encrypt, decrypt } = require('../api/utils/crypto')

apiResponse = (statusCode, message, data, errors, res) => {
    // let response =
    //     encrypt(JSON.stringify({
    //         statusCode: statusCode,
    //         message: message,
    //         data: data
    //     }))
    let response = {
                statusCode: statusCode,
                message: message,
                data: data
            }
    res.status(statusCode).send(response)
}

apiResponseForPagination = (statusCode, message, data, errors, res) => {
    res.status(statusCode).send({
        statusCode: statusCode,
        message: message,
        data: {
            list: data,
            totalCount: totalCount,
            pageIndex: pageIndex,
            pageSize: pageSize
        }
    })
}

module.exports = apiResponse