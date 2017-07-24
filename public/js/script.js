// connect socket.io
var socket = io.connect();

var app = new Vue({
  el: '#app',
  data: {
    esvalue: false,
    esout: "#000"
  },
  methods: {
    stickerstatus: function (value) {
      if(value) {
        this.esout = 'lime';
      } else {
        this.esout = '#000';
      }
      this.esvalue = value;
    }
  }
});

//update message with sensor value
 socket.on('isMoving', function (data) {
   if (data) {
    console.log(data.value);
    app.stickerstatus(data.value);
  } else {
    console.log('no data');
    app.stickerstatus = "No data from PIR";
  }
 });