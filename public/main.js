var socket = io.connect('http://localhost:8080', {'forceNew': true});

var appVue = new Vue({
  el: '#app_vue',
  data: {
    titulo         : 'Chat Real-Time',
    ListCometarios : [],
    nuevoComentario: ''
  },
  created: function () {
    var $this = this;
    socket.on('mensaje', function (data)  {
        $this.ListCometarios = data.data;
    });
  },
  methods:{
    addComentario: function () {
        var $this = this;
        socket.emit('nuevos-mensajes',{texto: $this.nuevoComentario});
        $this.nuevoComentario = '';
    }
  }
});


