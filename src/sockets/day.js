export const day = (socket, data) => {
    console.log('server socket on day');
    console.log(data.data);
    socket.to(data.slug).emit('day', data.data);//emit to all others
    socket.emit('day', data.data);//emit
};