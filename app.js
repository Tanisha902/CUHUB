const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const ejs = require("ejs");





const app = express();

app.set('view engine','ejs');
app.use(express.static("public"));  //used to show the style of css and image in window
app.use(bodyParser.urlencoded({extended:true})); //This will help to get the input of name and email from user


mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true,useUnifiedTopology: true,useFindAndModify:true});

const articleSchema = {
  title: String,
  content: String
};



const signupSchema = {
  uid: String,
  password: String
};




const Article = mongoose.model("Article", articleSchema);
const Signup = mongoose.model("Signup", signupSchema);





// const posts = [];
var searches = [];
// var deleteItems = [];







app.get("/",function(req,res)
{
  res.render("home");
})



app.get("/post",function(req,res)
{
  Article.find({},function(err,foundArticle)
{
  console.log(foundArticle);
    res.render("post",{newItems: foundArticle});
})

});











//------------------------------Upload files to database------------------------



app.get("/upload",function(req,res)
{
  res.render("upload");
});




app.post("/upload",function(req, res){

  const newArticle = new Article({
    title: req.body.postTitle,
    content: req.body.postBody
  });
   newArticle.save(function(err){
    if (!err){
      console.log("Successfully added a new article.");
      res.redirect("/post");
    } else {
      console.log(err);
    }
  });
})






//-------------------------Searching files from database------------------------


app.get("/search",function(req,res)
{
  res.render("search");
})


app.get("/result",function(req,res)
{
  res.render("result",{searchItems : searches});
});


app.get("/notfound",function(req,res)
{
  res.render("notfound",{searchItems : searches});
});


app.post("/search",function (req,res) {
  var item = req.body.searchItem;
  console.log(item);
  Article.findOne({title: item}, function(err, foundArticle){
     if (foundArticle) {
       console.log(foundArticle)
       searches.push(foundArticle);
       res.redirect("/result");
     } else {
       res.redirect("/notfound")
      console.log("No articles matching that title was found.");
     }
   });
})




//-----------------------------------Sign Up Page-------------------------------


app.get("/signup",function(req,res)
{
  res.render("signup");
})



app.get("/uperror",function(req,res)
{
  res.render("uperror");
})


app.post("/signup",function(req, res){

  const signup = new Signup({
    uid : req.body.luid,
    password : req.body.lpassword
  });
  Signup.findOne({uid: signup.uid }, function(err, foundArticle){
     if (foundArticle) {
       console.log("Use another uid");
       res.redirect("/uperror");
     } else {
       signup.save(function(err){
       if (!err){
         res.redirect("/search");
       } else {
       console.log(err);
       }
     });
       console.log("Signup successful!.");
     }
   });
})






//----------------------------------------Log in page--------------------------


app.get("/signin",function(req,res)
{
  res.render("signin");
})

app.get("/error",function(req,res)
{
  res.render("error");
})



app.post("/signin",function (req,res) {
  const signin = {
    uid : req.body.inuid,
    password : req.body.inpassword
  };
console.log(signin);
  Signup.findOne({uid : signin.uid, password: signin.password}, function(err, foundArticle){
     if (foundArticle) {
       res.redirect("/search");
     } else {
      res.redirect("/error");
     }
   });
})








//---------------------------- delete files-------------------------------------


app.get("/delete",function(req,res)
{
  Article.find({},function(err,foundArticle)
{
  console.log(foundArticle);
    res.render("delete",{newItems: foundArticle});
})

});

app.post("/delete",function(req,res)
{
  const checkedItemId = req.body.checkbox;
  Article.findByIdAndRemove(checkedItemId,function (err) {
    if(!err)
    {
      console.log("Successfully deleted!")
      res.redirect("/post")
    }
  })
})

















//----------------------- To get (post..see more)-------------------------------


app.get("/posts/:postId", function(req, res){

const requestedPostId = req.params.postId;

  Article.findOne({_id: requestedPostId}, function(err, post){

    console.log(post);
      res.render("single",{newItems: post});
    });
});


















app.listen(3000,function()   //process.env.port is a dynamic port and will help heroku to choose port according to them as port no 3000 may not available to them

{
  console.log("Server is running on port 3000");
});
