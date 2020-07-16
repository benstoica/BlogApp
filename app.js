const methodOverride = require('method-override');
const bodyParser     = require('body-parser');
const mongoose       = require('mongoose');
const express        = require('express');
const app            = express();

// app config
mongoose.connect('mongodb://localhost/blog_app', { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false });
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded( {extended: true }));
app.use(methodOverride('_method'));

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

//edit route
app.get('/blogs/:id/edit', function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect('/blogs')
        } else {
            res.render('edit', {blog: foundBlog})
        }
    });
});

//update route
app.put('/blogs/:id', function(req, res) {
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err) {
            res.redirect('/blogs');
        } else {
            res.redirect('/blogs/' + req.params.id);
        }
    });
});

//delete route
app.delete('/blogs/:id', function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    })
});



app.listen(3000, process.env.IP, function(){
    console.log("Blog App listening on Port 3000");
});