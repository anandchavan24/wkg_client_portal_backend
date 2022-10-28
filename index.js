const app = require('express');
const cors = require('cors');
const routes = require('./routes/user.routes');
const express = app();

const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
// const swaggerOptions = require('./swagger/options');

const { DOMAIN } = require('./config/constant')
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
    apis: ['./routes/user.routes.js']
}

express.use(cors())
express.use(app.json())
const PORT = process.env.SERVER_PORT || 4500

const swaggerDocs = swaggerJSDoc(swaggerOptions);
express.use('/doc', swaggerUI.serve, swaggerUI.setup(swaggerDocs));



if (process.env.NODE_ENV = 'prod') {
    express.listen(PORT, () => console.log(`App is running in this ${PORT}`))
}
express.use('/', routes);


