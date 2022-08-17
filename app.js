const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongooose = require("mongoose");
const _ = require("lodash");

mongooose.connect("mongodb+srv://roshan-admin:8802@cluster0.jyeag.mongodb.net/todolistDB", { useNewUrlParser: true,});
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

const itemsSchema = {
    name: String,
};

const itemModel = mongooose.model("item", itemsSchema);

const item1 = new itemModel({
    name: "Enter below your enteries.",
});

const itemArray1 = [item1];

const listSchema = {
    name: String,
    items: [itemsSchema],
};

const listModel = mongooose.model("list", listSchema);

app.get("/", function (req, res) {
    itemModel.find({}, function (err, foundItems) {
        if (err) console.log(err);
        // else console.log(foundItems);

        if (foundItems.length === 0) {
            itemModel.insertMany(itemArray1, function (err) {
                if (err) console.log(err);
                else console.log("data successfully added to the database.");
            });
            res.render("index", { listTitle: "Today", newListItems: foundItems });
        } else res.render("index", { listTitle: "Today", newListItems: foundItems });
    });
});

app.get("/:customListName", function (req, res) {
    const customRouteName = _.capitalize(req.params.customListName);

    listModel.findOne({ name: customRouteName }, function (err, foundList) {
        if (!err) {
            if (!foundList) {
                const list = new listModel({
                    name: customRouteName,
                    items: itemArray1,
                });

                list.save();
                res.redirect("/" + customRouteName);
            } else {
                res.render("index", {
                    listTitle: foundList.name,
                    newListItems: foundList.items,
                });
            }
        }
    });
});

app.post("/", function (req, res) {
    const bodyItem = req.body.listItem;
    const listHeadingName = req.body.listHeading;

    const newMongoDocument = new itemModel({
        name: bodyItem,
    });

    if (listHeadingName === "Today") {
        newMongoDocument.save();
        res.redirect("/");
    } else {
        listModel.findOne({ name: listHeadingName }, function (err, foundList) {
            foundList.items.push(newMongoDocument);
            foundList.save();
            res.redirect("/" + listHeadingName);
        });
    }
});

app.post("/delete", function (req, res) {
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;

    if (listName === "Today") {
        itemModel.findByIdAndRemove(checkedItemId, function (err) {
            if (err) console.log(err);
            else console.log("Checked item successfully removed.");
        });

        res.redirect("/");
    } else {
        listModel.findOneAndUpdate(
            { name: listName },
            { $pull: { items: { _id: checkedItemId } } },
            function (err, foundList) {
                if (!err) {
                    res.redirect("/" + listName);
                }
            }
        );
    }
});



let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}

app.listen(port, function () {
    console.log("Server is started successfully.");
});
 