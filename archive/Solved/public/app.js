// Grab the articles as a json
//var notesObj = {};
var notesarr = [];
$.getJSON("/articles", function (data) {
  // For each one
  $.getJSON("/allnotes", function (data1) {
    // return allNotes;
    for (var j = 0; j < data1.length; j++) {
      if (data1[j].article) {

        console.log("data1[1]._id is");
        console.log(data1[j]._id);


        var notesObj = {};
        notesObj["note"] = data1[j].title + " " + data1[j].body;
        // notesObj["id"] = data1[j].article;
        notesObj["id"] = data1[j]._id;
        notesObj["article"] = data1[j].article
        notesarr.push(notesObj);
        // var tempObj = {"notesArr": notesarr};      
        console.log("ntoesarr is >>>> " + JSON.stringify(notesarr));
        // console.log("NOTESARR COUNT IS   >>"+notesarr.length);
      }
      // console.log("1***>>>>" + notesarr[1]);  
    }
  });

  // console.log("NOTES ARR at 0 IS is    **" + notesarr[0]);
  // console.log("1***>>>>" + notesarr.note);  
  console.log("below is notesarr");
  console.log(notesarr);


  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br/>" + data[i].link + "<br/>" + "saved: <span class='saved'>" + data[i].saved + "</span> <button data-id='" + data[i]._id + "' id='savearticle'>ADD TO SAVED</button>  </p>");
    // $("#articles").append("<button data-id='" + data[i]._id +"' id='savearticle'>ADD TO SAVED</button>");
  }
});

///THIS LOADS THE VIEW OF ONLY THE SAVED ARTICLES
$(document).on("click", "#savedview", function () {
  $("#articles").empty();
  $.getJSON("/saved", function (data) {
    // For each one 
    //  console.log(data);
    for (var e = 0; e < data.length; e++) {
      $("#articles").append("<p data-id='" + data[e]._id + "'>" + data[e].title + "<br />" + data[e].link + "</p>");
      for (var x = 0; x < notesarr.length; x++) {
        // if (notesarr[x].id == data[e]._id) {
          
        if (notesarr[x].article == data[e]._id) {
          // console.log("notesarr[x].id is ");
          // console.log(notesarr[x].id);
          // console.log("notesarr[x].story is ");
          // console.log(notesarr[x].story);
          // var checkme = notesar[x];
          // console.log("the whole object is ");
          // console.log(checkme); 
          // if (notesarr[x].story == data[e]._id) {
          console.log("  AFTER LOOP IS DONE NOTESARR COUNT IS   >>" + notesarr.length);
          console.log(notesarr);
          // Display the apropos information on the page
          // $("#articles").append("<p data-id='" + data[e]._id + "'>" + data[e].title + "<br />" + data[e].link + "</p>");
          //button data-id='" + data[i]._id + "' id='savearticle'
          //button'>ADD NOTES button</button>

          $("#articles").append("<div id='prevnotes' data-id='" + data[e]._id + "' data2-id='" + notesarr[x].id + "'>NOTE: " + notesarr[x].note + "<button data-id='" + data[e]._id + "' data2-id='" + notesarr[x].id + "' id='deletenote'>DELETE NOTE</button></div>");
          // $("#articles").append("<button data-id='" + data[e]._id + "' id='addnote'>ADD NOTES button</button>");
          // $("#articles").append("<button data-id='" + data[e]._id + "' id='deletearticle'>DELETE Article</button>");
          
        } 
        


          
        
      }
      // $("#articles").append("<button data-id='" + data[e]._id + "' id='addnote'>ADD NOTES button</button>");
      // $("#articles").append("<button data-id='" + data[e]._id + "' id='deletearticle'>DELETE Article</button>");
      // Display the apropos information on the page
      // $("#articles").append("<p data-id='" + data[e]._id + "'>" + data[e].title + "<br />" + data[e].link + "</p>");
      //button data-id='" + data[i]._id + "' id='savearticle'
      //button'>ADD NOTES button</button>

      // $("#articles").append("<div id='prevnotes' data-id='" + data[e]._id + "'>***no notes yet****</div>");
      $("#articles").append("<button data-id='" + data[e]._id + "' id='addnote'>ADD NOTES button</button>");
      $("#articles").append("<button data-id='" + data[e]._id + "' id='deletearticle'>DELETE Article</button>");
    }
  });

});

// Whenever someone clicks a p tag
//$(document).on("click", "p", function () {
$(document).on("click", "#addnote", function () {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function (data) {
      console.log(data);
      // The title of the article
      $("#notes").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});




///WHEN CLICKING THE SAVE ARTICLE
$(document).on("click", "#savearticle", function () {
  // Grab the id associated with the article from the SAVE button
  var thisId = $(this).attr("data-id");


  // console.log("CONSOLE LOG SELECTOR      "+JSON.stringify(
  $("[data-id=" + thisId + "]").next().text("true");

  // $( "li.third-item" ).next().css( "background-color", "red" );


  // Run a POST request to FIND and UPDATE the article saved value to TRUE
  $.ajax({
    method: "POST",
    url: "/addtosavedlist/" + thisId,
  })
    // With that done
    .then(function (data) {
      // Log the response
      console.log(data);
    });
});

$(document).on("click", "#deletearticle", function () {
  var thisId = $(this).attr("data-id");///grab the data-id of the Article to delete
  console.log("SELECTION FOR DELETE ");
  //  ("p data-[id*="+thisId+"]")    
  // console.log("#p data-id="+thisId);
  console.log("p[data-id*=" + thisId + "]");
  //example $("div[id*="+idTarget+"]").click(function(){ 
  $("p[data-id*=" + thisId + "]").empty();///empty the article container 
  $("div[data-id=" + thisId + "]").empty();
  $("button[data-id*=" + thisId + "]").remove();

  $.ajax({ ///Run a POST request to find and delete the note using the ID
    method: "POST",
    url: "/deletearticle/" + thisId
  })
    .then(function (data) {
      console.log(data);///logresponse
      // <p data-id="5c40fa4d98b9526940db756c">
      // console.log("#articles > p data-id=+thisId  ");
      // console.log("#p data-id="+thisId);
      // $("#p data-id="+thisId).empty();///empty the article container section displayed on screen
    });
});

$(document).on("click", "#deletenote", function () {
  var thisId = $(this).attr("data2-id");///grab the data-id of the Article to delete
  console.log("SELECTION FOR DELETE NOTE ");
  //  ("p data-[id*="+thisId+"]")    
  // console.log("#p data-id="+thisId);
  console.log("div[data2-id*=" + thisId + "]");
  //example $("div[id*="+idTarget+"]").click(function(){ 
  $("div[data2-id*=" + thisId + "]").empty();///empty the article container 
  $("div[data2-id=" + thisId + "]").empty();
  // $("button[data-id*=" + thisId + "]").remove();

  $.ajax({ ///Run a POST request to find and delete the note using the ID
    method: "POST",
    url: "/deletenote/" + thisId
  })
    .then(function (data) {
      console.log(data);///logresponse
      // <p data-id="5c40fa4d98b9526940db756c">
      // console.log("#articles > p data-id=+thisId  ");
      // console.log("#p data-id="+thisId);
      // $("#p data-id="+thisId).empty();///empty the article container section displayed on screen
    });
});





// When you click the savenote button
$(document).on("click", "#savenote", function () {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");
  console.log("THIS ID TO APPEND TO NOTE BELOW");
  console.log(thisId);
  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val(),
      article: thisId
    }
  })
    // With that done
    .then(function (data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});
