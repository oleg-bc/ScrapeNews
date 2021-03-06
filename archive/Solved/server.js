var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");
// Require all models
var db = require("./models");
var PORT = 3002;
// Initialize Express
var app = express();
// Configure middleware
// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));
// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/unit18Populater", { useNewUrlParser: true });
// Routes

// A GET route for scraping the echoJS website
app.get("/scrape", function (req, res) {
  // First, we grab the body of the html with axios
  axios.get("http://www.echojs.com/").then(function (response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);

    // Now, we grab every h2 within an article tag, and do the following:
    $("article h2").each(function (i, element) {
      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this)
        .children("a")
        .text();
      result.link = $(this)
        .children("a")
        .attr("href");

      // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
        .then(function (dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(function (err) {
          // If an error occurred, log it
          console.log(err);
        });
    });

    // Send a message to the client
    res.send("Scrape Complete");
  });
});

app.get("/allnotes", function (req, res) {
  // Grab every document in the Articles collection
  db.Note.find({})
    .then(function (dbNote) {
      // If we were able to successfully find Articles, send them back to the client
      console.log("allnotes hit it ran dbnote is ****" +dbNote);
      res.json(dbNote);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});






// Route for getting all Articles from the db
app.get("/articles", function (req, res) {
  // Grab every document in the Articles collection
  db.Article.find({})
    .then(function (dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(dbArticle);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});


///BELOW code only returns JSON of what user saved: TODO: POPULATE HTML
app.get("/saved", function (req, res) {
  db.Article.find({ saved: true })
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    });
});




app.get("/notesTwo/:id", function (req, res) {
  var req1 = req.params.id.split(",");
  console.log(req1);
  // for each res1 db.note find
  for (var i = 0; i < req1.length; i++) {
    db.Note.find({ article: req1[i] })//recieves multiple IDS from params //queries the DB for each
      // gets back multiple notes for each ID
      // console.log(res)
      .then(function (dbNote) {
        // If we were able to successfully update an Article, send it back to the client
        res.json(dbNote);
      })
      .catch(function (err) {
        // If an error occurred, send it to the client
        res.json(err);
        // db.Note.find({
        // })
      });
  }
});

app.get("/notesOne/:id", function (req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Note.findOne({ _id: req.params.id })
  // {user: req.user._id}
  // db.Note.findOne({ article:  req.params.id })
   
  // ..and populate all of the notes associated with it
    // .populate("note")
    .then(function (dbNode) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbNode);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});






// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function (req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article.findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("note")
    .then(function (dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function (req, res) {
  // Create a new note and pass the req.body to the entry
  var st= JSON.stringify(req.params);
  console.log("IN THE TARGET ROUTE REQ.PARAMS   "+st);
  var st1= JSON.stringify(req.body);
  console.log("IN THE TARGET ROUTE REQ.BODY   "+st1);
  db.Note.create(req.body)  
  
    .then(function (dbNote) {
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function (dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});


//validate that something happens when route gets hit
app.post("/deletenote/:id", function(req, res){

  db.Note.findByIdAndRemove(req.params.id)
  .then(function (dbNote) {
    // If we were able to successfully update an Article, send it back to the client
    res.json(dbNote);
    console.log("remove NOTE ===>  " + req.params.id);
  })
  .catch(function (err) {
    // If an error occurred, send it to the client
    res.json(err);
  });
});




//validate that something happens when route gets hit
app.post("/deletearticle/:id", function(req, res){

  db.Article.findByIdAndRemove(req.params.id)
  .then(function (dbArticle) {
    // If we were able to successfully update an Article, send it back to the client
    res.json(dbArticle);
    console.log("removed " + req.params.id);
  })
  .catch(function (err) {
    // If an error occurred, send it to the client
    res.json(err);
  });
});


app.post("/addtosavedlist/:id", function (req, res) {
  // Create a new note and pass the req.body to the entry
  console.log("req is >>>>>>   " + req.params.id);
  db.Article.findOneAndUpdate({ _id: req.params.id }, { $set: { "saved": true } })

    .then(function (dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});


// Start the server
app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});
