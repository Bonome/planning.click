import sirv from 'sirv';
import polka from 'polka';
import compression from 'compression';
import * as sapper from '@sapper/server';
const {json} = require('body-parser');
import http from 'http';
import {socket} from './socket';
require('dotenv').config();

const {PORT, NODE_ENV} = process.env;
const dev = NODE_ENV === 'development';

const server = http.createServer();

polka({ server }) // You can also use Express
        .use(json())
        .use(
                compression({threshold: 0}),
                sirv('static', {dev}),
                sapper.middleware()
                )
        .listen(PORT, err => {
            if (err)
                console.log('error', err);
        });

socket.init(server);
