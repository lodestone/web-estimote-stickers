const socket = io.connect();

const Debug = { 
  template: '<textarea id="debug" class="debug">Stikers: {{nearablesData()}}</textarea>',
  methods: {
    nearablesData() {
      return this.$parent.nearables;
    }
  }
};

const routes = [{ path: '/debug', component: Debug }];

const router = new VueRouter({ routes });

const app = new Vue({
  el: '#app',
  router,
  data: {
    nearables: null,
    nearableId: null,
    libero: true
  },
  methods: {
    stickers: function (value) {  
      if (value.nearableId === '70d4d79ad2f3cd43') {
        this.nearables = value;
      }  
      if(value.isMoving && this.libero) {
        this.libero = false;
        this.nearableId = (value.nearableId === '70d4d79ad2f3cd43') ? 'planettwo' : 'planetone';
        this.idle();
      } else {
        console.log('nearable not moving', value);
      }
    },
    idle: function () {
      if (!this.libero) {
        console.log('FINE', this.libero);
        clearTimeout(this.timer);
        this.timer = setTimeout(this.free, 3000);
      }  
    },
    free: function () {
      console.log('FREE 2');
      this.nearableId = null;
      this.libero = true;
    }
  }
});

//update data with sensor value
 socket.on('isMoving', function (data) {
   if (data) {
    app.stickers(data.nearablePacket);
  } else {
    console.log('no data');
  }
 });