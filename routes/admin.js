const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('../models/Categoria');
require('../models/Postagem')
const Postagem = mongoose.model('postagens');
const Categoria = mongoose.model('categorias');
const {eAdmin} = require('../helpers/eAdmin');




router.get('/', eAdmin, (req, res) => {
  res.render('admin/index');
})

router.get('/postagens', eAdmin, (req, res) => {
  Postagem.find().populate('categoria').sort({date:'desc'}).then((postagem)=>{
    res.render('admin/postagens', {postagens: postagem.map(postagem => postagem.toJSON())})
  })
})

router.post('/postagens/nova', eAdmin, (req,res)=>{
  var erros = [];

  if(req.body.categoria == '0'){
    erros.push({texto:'Você precisa registrar uma categoria.'})

  }

  if(erros.length > 0){
    res.render('admin/addPostagens', {erros: erros})
  }else{
    const novaPostagem = {
      titulo: req.body.titulo,
      descricao: req.body.descricao,
      conteudo: req.body.conteudo,
      categoria: req.body.categoria,
      slug: req.body.slug
  };

    new Postagem(novaPostagem).save().then(()=>{
      req.flash('success_msg', 'Postagem salva com sucesso')
      res.redirect('/admin/postagens')
    }).catch((err)=>{
      req.flash('error_msg', 'Houve um erro ao salvar a postagem'+err)
      res.redirect('/admin/postagens')
    })
  }})

router.get('/postagens/add', eAdmin, (req, res) => {
  Categoria.find().lean().then((categorias)=>{
      res.render('admin/addPostagens', {categorias:categorias})
  }).catch((err)=>{
    req.flash('error_msg', 'Houveu um erro ao carregar o formulário' + err)
    res.redirect('/admin');
  })
})

router.get('/postagens/edit/:id', eAdmin, (req, res)=>{
  Postagem.findOne({_id: req.params.id}).lean().then((postagem)=>{

Categoria.find().lean().then((categorias)=>{
    res.render('admin/editpostagens', {categorias: categorias, postagem:postagem})
})

  }).catch((err)=>{
    req.flash('error_msg', 'Houve um erro ao carregador o formulário de edição')
    res.redirect('/admin/postagens')
  })




})

router.post('/postagens/edit', eAdmin, (req, res) => {
  Postagem.findOne({_id: req.body.id}).then((postagem) => {
    postagem.titulo = req.body.titulo;
    postagem.slug = req.body.slug;
    postagem.descricao = req.body.descricao;
    postagem.conteudo = req.body.conteudo;
    postagem.categoria = req.body.categoria;

    postagem.save().then(() => {
      req.flash('success_msg', 'Postagem editada com sucesso')
      res.redirect('/admin/postagens')
    }).catch((err)=>{
      req.flash('error_msg', 'Erro interno ao editar postagem: '+err);
      res.redirect('/admin/postagens')
    })
}).catch((err) => {
    req.flash('error_msg', 'Houve um erro ao editar'+err);
    res.redirect('/admin/postagens');
  })
})

router.post('/postagens/deletar', eAdmin, (req, res) => {
  Postagem.deleteOne({
    _id: req.body.id
  }).then(() => {
    req.flash('success_msg', 'Postagem Deletada com sucesso');
    res.redirect('/admin/postagens');
  }).catch((err) => {
    req.flash('error_msg', 'Houve um erro ao deletar a postagem');
    res.redirect('/admin/postagens');
  })
})





router.get('/categorias/', eAdmin, (req, res) => {
  Categoria.find().then((categoria) => {
    res.render("admin/categorias", {
      categorias: categoria.map(categoria => categoria.toJSON())
    })
  })
})

router.post('/categorias/nova', eAdmin, (req, res) => {

  var erros = [];
  if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
    erros.push({
      texto: 'Nome inválido'
    })
  }
  if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
    erros.push({
      texto: 'Slug inválido'
    })
  }
  if (req.body.nome.length <= 2) {
    erros.push({
      texto: 'O nome é curto demais curto'
    })
  }

  if (erros.length > 0) {
    res.render('admin/addCategorias', {
      erros: erros
    })
  } else {
    const novaCategoria = {
      nome: req.body.nome,
      slug: req.body.slug
    }

    new Categoria(novaCategoria).save().then(() => {
      req.flash('success_msg', 'Sua categoria foi adicionada com sucesso')
      res.redirect('/admin/categorias')
    }).catch((err) => {
      req.flash('error_msg', 'Erro ao salvar categoria:' + err)
      res.redirect('/admin')
    })
  }
})

router.get('/categorias/add', eAdmin, (req, res) => {
  res.render('admin/addCategorias')
})

router.get('/categorias/edit/:id', eAdmin, (req, res) => {
  Categoria.findOne({_id: req.params.id}).lean().then((categoria) => {
    res.render('admin/editcategorias', {categoria: categoria})
  }).catch(() => {
    req.flash('error_msg', 'Essa categoria não existe')
    res.redirect('/admin/categorias')
  })

})

router.post('/categorias/edit', eAdmin, (req, res) => {
  Categoria.findOne({_id: req.body.id}).then((categoria) => {
    categoria.nome = req.body.nome;
    categoria.slug = req.body.slug;

    categoria.save().then(() => {
      req.flash('success_msg', 'Categoria editada com sucesso')
      res.redirect('/admin/categorias')
    }).catch((err)=>{
      req.flash('error_msg', 'Erro interno ao editar categoria');
      res.redirect('/admin/categorias')
    })
}).catch((err) => {
    req.flash('error_msg', 'Houve um erro ao editar'+err);
    res.redirect('/admin/categorias');
  })
})

router.post('/categorias/deletar', eAdmin, (req, res) => {
  Categoria.deleteOne({
    _id: req.body.id
  }).then(() => {
    req.flash('success_msg', 'Categoria Deletada com sucesso');
    res.redirect('/admin/categorias');
  }).catch((err) => {
    req.flash('error_msg', 'Houve um erro ao deletar a categoria');
    res.redirect('/admin/categorias');
  })
})
module.exports = router;
