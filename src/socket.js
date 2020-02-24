import io from 'socket.io';
import {day} from './sockets/day';
import { cfg } from './db/config.js';
const redisAdapter = require('socket.io-redis');

export const socket = {
    init : function (server) {
        
        io(server).adapter(redisAdapter('redis://'+cfg.redis.host+':'+cfg.redis.port+'?db='+cfg.redis.db, { key: 'plng'}));
        
        io(server).on('connection', function (socket) {
            socket.on('join', function(room) {
//                console.log('joining room: '+room);
                socket.join(room);
            });
            socket.on('day', (data) => day(socket, data));
        });
    }
};
