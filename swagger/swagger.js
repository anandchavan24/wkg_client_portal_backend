
const swaggerAutogen = require('swagger-autogen')()
const outputFile = "./swagger_output.json"
const endpointsFiles = ['./endpoints.js']

const doc = {
    info: {
        version: "1.0.0",
        title: "My API",
        description: ""
    },
    host: process.env.URL || "http://localhost:4500",
    basePath: "/",
    schemes: ['http', 'https'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
        {
            "name": "User",
            "description": "Endpoints"
        }
    ],
    securityDefinitions: {
        api_key: {
            type: "apiKey",
            name: "api_key",
            in: "header"
        }
    },
    definitions: {
    }
}

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    require('../index')
})