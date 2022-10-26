const app = require('express');
let cors = require('cors')
const routes = require('./routes/user.routes')
let express = app();

express.use(cors())
express.use(app.json())
const PORT = process.env.SERVER_PORT || 4500

if(process.env.NODE_ENV = 'prod'){
    express.listen(PORT,()=> console.log(`App is running in this ${PORT}`))
}
express.use('/', routes);


