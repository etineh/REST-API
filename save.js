//jshint esversions:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const cors = require("cors")

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"))
app.set("view source", "ejs")
app.use(bodyParser.json())
app.use(express.json());
app.use(cors())
mongoose.connect("mongodb://0.0.0.0:27017/testdb", {useNewUrlParser: true})

const wikiSchema = new mongoose.Schema({
    content: String
})
const ArtModel = mongoose.model("Todo", wikiSchema);

app.route("/test")
    .get((req, res)=>{
        ArtModel.find({}, (err, artDisplay)=>{
            if(!err){
                res.send(artDisplay);
            } else{
                console.log(err);
            }
        });
    })
    .post((req, res)=>{
        const NewTitle = new ArtModel ({
            content: req.body.content
        });
    
        NewTitle.save((err)=>{
            if(!err){
                res.send({success: true});
            }else {
                console.log(err)
            }
        });
    })
    .delete((req, res)=>{
        ArtModel.deleteMany((err)=>{
            if(!err){
                res.send("successfully delete all articles");
            }else{
                res.send(err);
            }
        })
    });

app.route("/test/:ArtTitle")
    .get((req, res)=>{
        let para = req.params.ArtTitle
        ArtModel.findOne({_id: para}, (err, artDisplay2)=>{
            if(!err){
                res.send(artDisplay2);
            } else {
                res.send("Article not found");
            }
        });
    })
    .put((req, res)=>{
        ArtModel.updateOne(
            {_id: req.params.ArtTitle}, 
            {content: req.body.content},
            (err)=>{
                if(!err){
                    res.send({success: true});
                } else {
                    res.send(err);
                }
            }
        );
    })
    .patch((req, res)=>{
        ArtModel.updateOne(
            {content: req.params.ArtTitle}, 
            {$set: req.body},
            (err)=>{
                if(!err){
                    res.send({success: true});
                } else {
                    res.send(err);
                }
            }
        )
    })
    .delete((req, res)=>{
        ArtModel.deleteOne({content: req.params.ArtTitle}, (err)=>{
            if(!err){
                res.send({success: true})
            }else {
                console.log(err)
            }
        })
    });


app.listen(8000, ()=>{
    console.log("Running on port 8000");
});