module.exports = (io)=>{
    let i=0;
    io.on('connection',(socket)=>{
        socket.on('refresh',data=>{
    
            io.emit('refreshPage',{})
        })
     
    })
}