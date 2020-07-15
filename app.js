const bodyParser = require('body-parser');
const mongoose   = require('mongoose');
const express    = require('express');
const app        = express();

// app config
mongoose.connect('mongodb://localhost/blog_app', { useUnifiedTopology: true, useNewUrlParser: true });
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded( {extended: true }));

// mongoose model config
const blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

const Blog = mongoose.model('Blog', blogSchema);

//RESTful routes
app.get('/', function(req, res){
    res.redirect('/blogs');
});

//index route
app.get('/blogs', function(req, res){
    Blog.find({}, function(err, blogs){
        if(err) {
            console.log(err);
        } else {
            res.render('index', {blogs: blogs});
        }
    });
});

app.get('/blogs/new', function(req, res){
    res.render('new');
});


//create route
app.post('/blogs', function(req, res){
    Blog.create(req.body.blog, function(err, newBlog){
        if(err) {
            res.render('new');
        } else {
            res.redirect('/blogs');
        }
    });
});

//show route
app.get('/blogs/:id', function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err) {
            res.redirect('/blogs');
        } else {
            res.render('show', {blog: foundBlog});
        };
    })
});





app.listen(3000, process.env.IP, function(){
    console.log("Blog App listening on Port 3000");
});