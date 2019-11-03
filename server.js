const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const config = require('config');
const log = require('log4js').getLogger('application');
const errorHandler = require('./lib/shared/error-handler');
const logging = require('./lib/logging');
const app = express();

logging.initialize();
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(cors());

app.use('/users', require('./lib/users/user.controller'));
app.use('/movies', require('./lib/movies/movie.controller'));
app.use(errorHandler);

const port = process.env.PORT || config.get('port');
app.listen(port, () => {
    log.info("Application Server is running on port:" + port);
});
