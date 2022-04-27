const connection = require("../config/connection");
const { User, Thought } = require("../models");
const { names, appDescriptions } = require("./data");

connection.on("error", (err) => err);

connection.once("open", async () => {
  console.log("connected");

  // Drop existing courses
  await User.deleteMany({});

  // Drop existing students
  await Thought.deleteMany({});

  // Add students to the collection and await the results
  await User.collection.insertMany(names);

  // Add courses to the collection and await the results
  await Thought.collection.insertMany(appDescriptions);

  // Log out the seed data to indicate what should appear in the database
  console.table(names);
  console.info("Seeding complete! 🌱");
  process.exit(0);
});
