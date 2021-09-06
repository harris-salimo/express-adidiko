const express = require('express');
const http = require('http');
const cors = require('cors');
const passport = require('passport');

const {sequelize} = require('./models');

const app = express();

app.use(express.json());

function error(status, msg){
    const err = new Error(msg);
    
    err.status = status;
    
    return err;
}

require('./config/passport')(passport);

app.use(passport.initialize());

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(cors());

/* * * * * * * * * * * * * * * * * * * * * * * * * */
/*                                                 */
/*                   DASHBOARD                     */
/*                                                 */
/* * * * * * * * * * * * * * * * * * * * * * * * * */
const indexRouter = require('./routes/index');
app.use('/dashboard', indexRouter);

/* * * * * * * * * * * * * * * * * * * * * * * * * */
/*                                                 */
/*                     USER                        */
/*                                                 */
/* * * * * * * * * * * * * * * * * * * * * * * * * */
const userRouter = require('./routes/user');
app.use('/users', userRouter);

/* * * * * * * * * * * * * * * * * * * * * * * * * * */
/*                                                   */
/*                     MPANDRAY                      */
/*                                                   */
/* * * * * * * * * * * * * * * * * * * * * * * * * * */
const mpandrayRouter = require('./routes/mpandray');
app.use('/mpandray', mpandrayRouter);

/* * * * * * * * * * * * * * * * * * * * * * * * * */
/*                                                 */
/*                      ADIDY                      */
/*                                                 */
/* * * * * * * * * * * * * * * * * * * * * * * * * */
const adidyRouter = require('./routes/adidy');
app.use('/adidy', adidyRouter);

/* * * * * * * * * * * * * * * * * * * * * * * * * * * */
/*                                                     */
/*                        KARTIE                       */
/*                                                     */
/* * * * * * * * * * * * * * * * * * * * * * * * * * * */
const districtRouter = require('./routes/district');
app.use('/districts', districtRouter);

app.use(function(err, req, res, next){
    res.status(err.status || 500);
    res.send({error: err.message});
})

app.use(function(req, res){
    res.status(404);
    res.json({error: "Resource Not Found"});
});

const port = normalizePort(process.env.PORT || '5000');
app.set('port', port);

function normalizePort(val){
    const port = parseInt(val, 10);
    
    if(isNaN(port)) return val;
    
    if(port >= 0) return port;
    
    return false;
}

const server = http.createServer(app);

async function main(){
    try {
        await sequelize.authenticate();
    
        console.log('Connection has been established successfully');
    
        server.listen(port);
        server.on('listening', onListening);
    } catch (err) {
        console.log('Something went wrong');
        console.log(err);
    }
}

function onListening(){
    const addr = server.address();
    const bind = typeof addr === 'string' ? 'pipe' + addr: 'port ' + addr.port;
    
    console.log('Server is listening on port ' + bind);
}

main();