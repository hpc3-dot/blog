import express from "express";
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from "body-parser";

const port = 3000;
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const blogPosts = [];

app.get('/', (req, res) => {
  res.render('index.ejs', {blogposts: blogPosts});
});

app.use('/public', express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


app.post('/submit', (req, res) => {
  const newPost = {
  id: blogPosts.length + 1,
  postTitle: req.body.postTitle, 
  postContent: req.body.postContent,
  uName: req.body.uName,
  date: new Date().toLocaleString(),
  fishType: req.body.fishType,
  edit: false
}; 
  blogPosts.push(newPost);
  console.log('New blog post submitted:', blogPosts);
  res.redirect('/');
});

app.post('/edit', (req, res) => {
  const post = blogPosts.find(post => post.id == req.body.id);

  if (post) {
    post.edit = true;
  }
  res.redirect('/')

  
});

app.post('/update', (req, res) => {
  const post = blogPosts.find(post => post.id == req.body.id);

  if (post) {
    post.postTitle = req.body.postTitle;
    post.postContent = req.body.postContent;
    post.postName = req.body.postName;
    post.date = new Date().toLocaleString();
    post.fishType = req.body.fishType;
    post.edit = false;
  }
  res.redirect('/')
 
});

app.post('/delete', (req, res) =>{
  const index = blogPosts.findIndex(post => post.id == req.body.id);
  if (index !== -1) {
        blogPosts.splice(index, 1);
    }

    res.redirect("/");

});

app.post('/cancel', (req, res) => {
  const post = blogPosts.find(post => post.id == req.body.id);

  if (post) {
    post.edit = false;
  }
  res.redirect('/')
 
});

app.get('/filter', (req, res) => {
  const fishType = req.query.fishType;

  if (fishType === 'all') {
    res.render('index.ejs', { blogposts: blogPosts });
  } else {
    const filterFish = [];
    for (let i = 0; i < blogPosts.length; i++) {
      if (blogPosts[i].fishType === fishType) {
        filterFish.push(blogPosts[i]);
      }
    }

    res.render('index.ejs', { blogposts: filterFish });
  }
});