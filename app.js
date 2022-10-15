//jshint esversions:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const cors = require("cors")

const app = express();
app.use(express.json())
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"))
app.set("view source", "ejs")
app.use(cors())
mongoose.connect("mongodb://0.0.0.0:27017/wikiDB", {useNewUrlParser: true})

const wikiSchema = new mongoose.Schema({
    title: String,
    content: String
})
const ArtModel = mongoose.model("Article", wikiSchema);

app.route("/articles")
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
            title: req.body.title,
            content: req.body.content
        });
    
        NewTitle.save((err)=>{
            if(!err){
                res.send({success:true});
            }else {
                console.log(err)
            }
        });
    })
    .delete((req, res)=>{
        ArtModel.deleteMany((err)=>{
            if(!err){
                res.send({success:true});
            }else{
                res.send(err);
            }
        })
    });

app.route("/articles/:ArtTitle")
    .get((req, res)=>{
        let para = req.params.ArtTitle
        ArtModel.findOne({title: para}, (err, artDisplay2)=>{
            if(!err){
                res.send({success:true});
            } else {
                res.send("Article not found");
            }
        });
    })
    .put((req, res)=>{
        ArtModel.updateOne(
            {title: req.params.ArtTitle}, 
            {title: req.body.title, content: req.body.content},
            (err)=>{
                if(err){
                 return   console.log(err);
                }
                return res.send({success:true})
            }
        );
    })
    .patch((req, res)=>{
        ArtModel.updateOne({title: req.params.ArtTitle}, {$set: req.body}, (err)=>{
                if(!err){
                    res.send({success:true});
                } else {
                    res.send(err);
                }
            }
        )
    })
    .delete((req, res)=>{
        ArtModel.deleteOne({title: req.params.ArtTitle}, (err)=>{
            if(err){
               return console.log(err)
            }
            return res.send({success:true})
        })
    });


app.listen(5000, ()=>{
    console.log("Running on port 5000");
});