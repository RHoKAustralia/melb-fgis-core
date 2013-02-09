var socket = io.connect('http://localhost:3000')

socket.on('watchEvents', function(data){
    console.log('watchEvents ' + JSON.stringify(data))
})
