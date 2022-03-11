if (process.env.NODE_ENV == 'production'){
  module.exports = {mongoURI: 'mongodb+srv://EduardoAmaral:<password>@ea-blog.edbda.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'}
}else{
  module.exports =  {mongoURI: 'mongodb://localhost/blognodejs'}
}
