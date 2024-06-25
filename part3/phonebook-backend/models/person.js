const mongoose=require("mongoose")
require('dotenv').config();

mongoose.set("strictQuery", false);
mongoose
    .connect(process.env.MONGODB_URL)
    .then((result) => {
        console.log("Connected to MongoDB");
    })
    .catch((error) => {
        console.log("Error connecting to MongoDB:", error.message);
    });

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
});
personSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

module.exports = mongoose.model('Person', personSchema)

// person.save().then(result=>{
//     console.log(`added ${result.name} number ${result.number} to phonebook`)
// })

// Person.find({}).then(result => {
//     console.log("phonebook:")
//     result.forEach(person => {
//         console.log(`${person.name} ${person.number}`)
//     })
//     mongoose.connection.close()
// })
