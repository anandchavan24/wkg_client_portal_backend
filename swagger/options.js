const { DOMAIN } = require('../config/constant')

const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'WKG',
            version: '1.0.0',
            description: 'WKG API',
            servers: [DOMAIN]
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                }
            }
        },
        security: [{
            bearerAuth: []
        }]
    },
    apis: ['../routes/user.routes.js']
}

module.exports = swaggerOptions
