var mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://fullstack:${password}@cluster0-qbntr.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.connect(url, { useNewUrlParser: true });

var personSchema = new mongoose.Schema({
  name: String,
  number: String
});

var Person = mongoose.model("Person", personSchema);

if (process.argv.length === 3) {
  console.log("phonebook: ");
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
}

if (process.argv.length === 5) {
  const person = new Person({
    name: String(process.argv[3]),
    number: String(process.argv[4])
  });

  person.save().then(response => {
    console.log(
      `added ${response.name} number ${response.number} to phonebook`
    );
    mongoose.connection.close();
  });
}
