

var serialport = require("serialport");
var SerialPort = serialport.SerialPort;

var sp = new SerialPort("/dev/tty.usbserial-AH02MBY6", {baudrate: 9600, buffersize: 1024, parser: serialport.parsers.readline("\n")});


var tagA = '5900108A37F4'; // T93 53be05d504b37af3d04528d1
var tagB = '6A008FC66F4C'; // Z8 53be05d504b37af3d04528ce
var tagC = '6A008F7BB42A'; // Z9 53be05d504b37af3d04528cf
var tagD = '59001D3C552D'; // T67 53be05d504b37af3d04528d0'

sp.on('open', function(){
  console.log('Serial Port Opend');
  sp.on('data', function(data){

  });
});