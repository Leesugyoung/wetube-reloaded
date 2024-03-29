import mongoose from "mongoose";

// database
mongoose.connect(process.env.DB_URL, {
    useNewUrlParser : true, 
    useUnifiedTopology : true,
    // useFindAndModify:false,
});

const db = mongoose.connection;

// db error message
const handleError = (error) => console.log("❌ DB Error", error);
db.on("error", handleError);

// db connection message
const handleOpen = () => console.log("✅ Connected to DB");
db.once("open", handleOpen);
