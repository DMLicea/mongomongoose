
$.getJSON("/stories", function(data) {

  // For each one
  
  for (var i = 0; i < data.length; i++) 
  
  {
    var html = "";

    var fullLink = "<a href='" + data[i].link + "' target='blank'>[full story]</a>";
  
    html += "<div class='card'><div class='card-header story-title'><h3>";

    html += data[i].title;

    html += "</div><div class='card-body'><h5>";

    html += "<p>";

    html += data[i].summary.replace("[Read More]", fullLink);

    html += "</p>";

    html += "</h5></div><div class='card-footer'>";

    html += "<div class='comments-section' ></div>";

    html += "<button class='btn btn-primary comment-btn' data-id='" + data[i]._id + "'>comment</button>";

    html += "</div>";

    $("#stories").append(html);
  }
});

// scrape button

$(document).on("click", ".scrape-btn", function() 

{
  
  $.get("/scrape").then(function(data) 
  
  {
      console.log(data);
      console.log("scrape went through");
  })

})

// comment button

$(document).on("click", ".comment-btn", function() 

{
  var thisId = $(this).data("id");
  var target = $(this).parent().parent();

  $.get("/stories/"+thisId).then(function(data) {
 
  $(target).append("<textarea id='bodyinput' name='body'></textarea>");
  
  $(target).append("<button class='btn btn-primary' data-id='" + thisId + "' id='add-comment'>Add Comment</button>");

});

})

// add comment

$(document).on("click", "#add-comment", function() {

var thisId = $(this).data("id");
var comment = {body: $("#bodyinput").val().trim()}

  $.post("/stories/"+thisId, comment)

    .then(function(data) {
      console.log(data);
    });
})