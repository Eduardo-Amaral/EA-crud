//Carregando módulos
const express = require('express');
const handlebars = require('express-handlebars');
const app = express();
const admin = require('./routes/admin.js');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');


//Configurações
//Sessão
app.use(session({
  secret: '6080',
  resave: true,
  saveUninitialized: true
}))

app.use(flash())
//Middleware
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  next()
})

//Body parser
app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());


//handlebars
app.engine('handlebars', handlebars.engine({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//Mongoose
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/blognodejs').then(() => {
  console.log('Conectado ao mongo')}).catch((err) => {
  console.log('Ocorreu um erro ao conectar' + err)
})


//Public
app.use(express.static(path.join(__dirname, 'public')));


app.use((req, res, next) => {
  console.log('Middleware ativo.')
  next()
});







//Rotas
app.use('/admin', admin);


//Outros
const PORT = 6081;
app.listen(PORT, () => {
  console.log('Servidor ok! ' + 'http://localhost:' + PORT)
})
