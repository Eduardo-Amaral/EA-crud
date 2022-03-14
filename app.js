//   Carregando módulos
const express = require('express');
const handlebars = require('express-handlebars');
const app = express();
const admin = require('./routes/admin.js');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
require('./models/Postagem');
const Postagem = mongoose.model('postagens'); 
require('./models/Categoria');
const Categoria = mongoose.model('categorias');
const usuarios = require('./routes/usuario');
const passport = require('passport');
require('./config/auth')(passport);
const db = require('./config/db');




//   Configurações
//Sessão
app.use(session({
  secret: '6080',
  resave: true,
  saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())



//Middleware
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
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
mongoose.connect(db.mongoURI).then(() => {
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
app.get('/', (req, res) =>{
  Postagem.find().lean().populate('categoria').sort({data:'desc'}).then((postagens)=>{
    res.render('index', {postagens: postagens})
  }).catch((err)=>{
    req.flash('error_msg', 'Erro interno ao exibir as postagens na home')
  })
});

app.get('/postagem/:slug', (req,res)=>{
  Postagem.findOne({slug: req.params.slug}).lean().then((postagem)=>{
    if(postagem){
      res.render('postagem/index', {postagem:postagem});
    }else{
      req.flash('error_msg', 'Postagem inexistente');
      res.redirect('/');
    }
  }).catch((err)=>{
    req.flash('error_msg', 'Houve um erro interno');
    res.redirect('/');
  })
});

app.get('/categorias', (req, res)=>{
  Categoria.find().lean().then((categorias)=>{
    res.render('categorias/index', {categorias: categorias})
  }).catch((err)=>{
    req.flash('error_msg', 'Houve um erro ao listar as categorias:' + err);
    req.redirect('/');
  })
});

app.get('/categorias/:slug', (req, res)=>{
  Categoria.findOne({slug: req.params.slug}).lean().then((categoria)=>{
    if (categoria) {
      Postagem.find({categoria: categoria}).lean().then((postagens)=>{
        res.render('categorias/postagens', {postagens: postagens, categoria: categoria})
      }).catch((err)=>{
        req.flash('error_msg', 'Erro ao listar postagens: ' + err)
        res.redirect('/')
      })
    }else{
      req.flash('error_msg','Categoria inexistente: ' + err);
      res.redirect('/')
    }
  }).catch((err)=>{
    req.flash('error_msg','Categoria não encontrada');
    res.redirect('/')
  })
})


app.use('/admin', admin);
app.use('/usuarios', usuarios);


//Outros
const PORT = process.env.PORT || 6081;
app.listen(PORT, () => {
  console.log('Servidor ok!')
});
