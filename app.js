//Carregando módulos
const express = require('express');
const handlebars = require('express-handlebars');
const app = express();
const admin = require('./routes/admin.js');
const path = require('path');
const mongoose = require('mongoose');



//Configurações
  //Body parser
    app.use(express.urlencoded({extended: true}));
    app.use(express.json());


  //handlebars
    app.engine('handlebars', handlebars.engine({defaultLayout: 'main'}));
    app.set('view engine', 'handlebars');

  //Mongoose
   mongoose.Promise = global.Promise;
   mongoose.connect('mongodb://localhost/blognodejs').then(()=>{
     console.log('Conectado ao mongo')
   }).catch((err)=>{
     console.log('Ocorreu um erro ao conectar'+ err)
   })


  //Public
    app.use(express.static(path.join(__dirname,'public')));








//Rotas
app.use('/admin', admin);


//Outros
    const PORT = 9000;
    app.listen(PORT, () => {console.log('Servidor ok! '+ 'http://localhost:9000')})
