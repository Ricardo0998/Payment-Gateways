const express = require('express')
const cors = require('cors');

// * * Class to initialize the server with its configuration
class Server {
    constructor() {
        // * Express
        this.app = express();

        // * Port
        this.port = process.env.PORT;

        // * Path for users
        this.pagosPath = '/api/payments';

        // * Middelewares
        this.middelewares();

        // * Routes
        this.routes();
    }

    // * Method to initialize routes
    routes() {
        this.app.use(this.pagosPath, require('../routes/paymentsRoute'));
    }

    // * Method to initialize the server
    listen() {
        this.app.listen(this.port, () => {
            console.log('Server corriendo en puerto: ', this.port);
        });
    }

    // * Method to initialize the middlewares
    middelewares() {
        // * CORS
        this.app.use(cors(['*']));
        // * Reading and parsing the body
        this.app.use(express.json());
    }
}

module.exports = Server;