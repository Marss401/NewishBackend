const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");

const app = express(); //stored in a variable "app"
const Connection = "mongodb+srv://Maryam11244:Windows_7@maryam195890.42xm9.mongodb.net/?retryWrites=true&w=majority&appName=Maryam195890"; /*mongodb connection string*/

mongoose.connect(Connection).then(() => console.log("connected to db"));

const FormSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false
  },
  email: {
    type: String,
    required: true,
    unique: true
  }
});

const PostSchema = new mongoose.Schema({
    user: {
      type: String,
      required: false, // Now optional
    },
    title: {
      type: String,
      required: false,
    },
    body: {
      type: String,
      required: false,
    },
    media: {
      type: String,
      required: false,
    },
    Impressions: {
      likes: {
        type: [String],
        default: [],
      },
      reposts: {
        type: [String],
        default: [],
      },
      comments: {
        type: [String],
      },
      createdAT: {
        type: Date,
        default: Date.now,
      },
    },
  });
  

// Define the Post model correctly
const Post = mongoose.model('Post', PostSchema);

const FormDataRulesforcollection = mongoose.model("formDataCollection", FormSchema);

app.use(cors({
  origin: "http://localhost:5173",
  methods: 'GET, POST, PUT, DELETE',
}));

app.use(express.json());
const PORT = 4000;

// Configure storage for the media file (e.g., image)
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'C:/Users/USER/coder/FrontEnd/vite-project/public'); // store in 'uploads' folder
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname); // use original file name
  }
});

const upload = multer({ storage: storage }); /*call the function*/

// Sample user profile
const myProfile = {
  "name": "John Doe",
  "age": "60",
  "gender": "male",
  "occupation": "Lawyer",
  "marital_status": "married"
};

app.get("/username", async (req, res) => {
  res.send(myProfile);
});

// Upload form data (same as the original logic)
app.post('/Upload', async (req, res) => {
  try {
    const newEntry = new FormDataRulesforcollection(req.body);
    console.log(req.body);
    await newEntry.save();
    res.json({ message: "Data saved successfully", data: newEntry });
  } catch (error) {
    res.json({ message: "Server failed to save data" });
  }
});

app.post('/Post', upload.single('media'), async (req, res) => {
    try {
      console.log("Received Data:", req.body);
      console.log("Received File:", req.file);
  
      const { title, body } = req.body;
      const media = req.file ? req.file.path : '';
  
      const user = req.body.user || 'Anonymous'; // Default user value
  
      const newPost = new Post({
        title,
        body,
        media,
        user, // Now using the user value (either from frontend or default)
        Impressions: {
          likes: [],
          reposts: [],
          comments: [],
        }
      });
  
      await newPost.save();
      res.json({ message: "Post saved successfully", data: newPost });
    } catch (error) {
      console.error("Error saving post:", error);
      res.status(500).json({ error: "Failed to save post" });
    }
  });
/*To update and Find general data in the database without specifying*/

  app.get('/getMarvel', async (req, res)=>{
    try {
      const getMarvel = await FormDataRulesforcollection.find()
      res.json(getMarvel)
    } catch (error) {
      console.log(getMarvel)
    }
  })
/*Find specific*/

  app.get('/getMarvel', async (req, res)=>{
    try {
      const getMarvel = await FormDataRulesforcollection.find({name:'wema'})
      res.json(getMarvel)
    } catch (error) {
      console.log(getMarvel)
    }
  })

  /* recreate this with an API: db.unicorns.updateOne({_id: ObjectId('67aa097f72138b1a13a81626')}, {$set:{gender:'f'}})*/

  /*Update*/
  app.put("/update/:id", async (req, res)=>{
    try{
      const updatedEntry = await FormDataRulesforcollection.findByIdAndUpdate(
        req.params.id.trim(),
        {name: "Eddie", email: "semo@gmail.com"},{new: true}
      )
      if(!updatedEntry) return res.status(404).json({message: "Entry not found"})
      res.json({message: "Entry Updated", data: updatedEntry})
    }catch(error){
      res.status(500).json({message: "Error updating entry", error})
    }
  })
/*to delete*/
  app.delete("/api/forms/:id", async (req, res) => {
    try {
      const deleteEntry = await FormDataRulesforcollection.findByIdAndDelete(req.params.id)
      if (!deletedEntry) return res.status(404).json({ message: "Entry not found" });
      res.json({ message: "Entry deleted", data: deletedEntry });
  
    } catch (error) {
      res.status(500).json({ message: "Error deleting entry", error });

    }
  })

/*
let salmi = ""
  if(!salmi){....//not nothing
    console.log("true")
  }else{ 
    console.log("false")
  }*/

app.listen(PORT, () => console.log(`listening on port ${PORT}`));
