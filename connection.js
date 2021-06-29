const mysql = require('mysql');

const configDB = {
    host: '{aws-rds-endpoint}',
    user: '{user}',
    password: '{password}',
    port: '{port',
    database: '{database}',
    debug: true
};

function initializeConnection(config) {
    function addDisconnectionHandler(connection) {
        connection.on('error', function (error) {
            if (error instanceof Error) {
                if (error.code === 'PROTOCOL_CONNECTION_LOST') {
                    console.error(error.stack);
                    console.log('Lost connection. Reconnecting...');
                    initializeConnection(connection.config);
                } else if (error.fatal) {
                    throw error;
                }
            }
        });
    }
    const connection = mysql.createConnection(config);

    // add handlers
    addDisconnectionHandler(connection);
    connection.connect();
    return connection;
}

const connection = initializeConnection(configDB);

module.exports = connection;
