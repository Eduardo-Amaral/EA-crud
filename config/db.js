if (process.env.NODE_ENV == 'production'){
  module.exports = {mongoURI: 'mongodb+srv://EduardoAmaral:<edugamerbr3>@ea-blog.edbda.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'}
}else{
  module.exports =  {mongoURI: 'mongodb://localhost/blognodejs'}
}
