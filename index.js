const app = require('express');
let cors = require('cors')
const routes = require('./routes/user.routes')
let express = app();

express.use(cors())
express.use(app.json())
const PORT = process.env.SERVER_PORT || 4500

const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger/swagger_output.json');

express.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

if(process.env.NODE_ENV = 'prod'){
    express.listen(PORT,()=> console.log(`App is running in this ${PORT}`))
}
express.use('/', routes);


