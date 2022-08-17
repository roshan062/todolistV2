const express = require("express")
const app = express()
const bodyParser = require("body-parser");
const ejs = require("ejs")

app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine', 'ejs');
app.use(express.static("public"))

var newItem = ["Read", "Write"];
var workItems = [];


app.get("/", function(req, res){
    var today = new Date();
   
    var options = { 
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    }

    var day = today.toLocaleDateString("en-US", options);
    console.log("Today's date " + day);
    res.render("index", {listTitle: day, newListItems: newItem});

})

app.post("/", function(req, res){
    bodyItem = req.body.listItem;
    var newListHeading = req.body.buttonList;
    // console.log("button name: "+ newListHeading);
    if(newListHeading === "Work"){
        workItems.push(bodyItem);
        res.redirect("/work")
    }

    else{
        newItem.push(bodyItem);
    res.redirect("/");
    }
})

app.get("/work", function(req, res){
    res.render("index", {listTitle: "Work Item", newListItems: workItems});
})

app.get("/about", function(req, res){
    res.render("about");
})

app.listen(3000, function(){
    console.log("Server is running on port 3000.")
})