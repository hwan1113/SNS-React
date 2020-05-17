module.exports = {
    init: function(io) {
        let onSocketConnect = (socket) => {
            console.log('a user connected');
            socket.on('disconnect', ()=>{
                console.log('a user disconnected');
            })
            this.addEvent(socket);
            // this.addBroadCast(io);
        }
        io.on('connection', onSocketConnect)

    },
    addEvent : function(socket) {
        console.log(socket.id)
        socket.on('date', (msg) => {
            socket.emit('date', {msg:new Date()})
        });
    },
    addBroadCast: function(io) {
        io.emit('toAll', {msg:'hello'})
    }
}