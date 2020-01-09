import io from 'socket.io';
import {day} from './sockets/day';

export const socket = {
    init : function (server) {
        io(server).on('connection', function (socket) {
            socket.on('join', function(room) {
                console.log('joining room: '+room);
                socket.join(room);
            });
            socket.on('day', (data) => day(socket, data));
        });
    }
};
