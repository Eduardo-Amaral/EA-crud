const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('../models/Categoria');
const Categoria = mongoose.model('categorias');


router.get('/', (req, res) => {
  res.render('admin/index')
})

router.get('/posts', (req, res) => {
  res.send('Bem vindo a posts')
})

router.get('/categorias/', (req, res) => {
  Categoria.find().sort({date:'desc'}).then((result) => {
    res.render("admin/categorias", {
      categorias: result.map(result => result.toJSON())
    })
  })

})

router.post('/categorias/nova', (req, res) => {

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



router.get('/categorias/add', (req, res) => {
  res.render('admin/addCategorias')
})



module.exports = router;
