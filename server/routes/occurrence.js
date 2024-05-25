import express from "express"; // Importing express module
import db from "../database/dbConnection.js"; // For database connection
import { ObjectId } from "mongodb"; // For changing id string to objectId

const router = express.Router(); // Creating router instance

// Route for listing occurrences
router.get("/", async (req, res) => {
  try {
    let collection = await db.collection("occurrences");
    let results = await collection.find({}).toArray(); // Finding all occurrences
    res.status(200).send(results); // Sending results with status 200
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving occurrences"); // Sending error message with status 500
  }
});

// Route for getting a single occurrence by id
router.get("/:id", async (req, res) => {
  try {
    let collection = await db.collection("occurrences");
    let query = { _id: new ObjectId(req.params.id) }; // Creating query object with provided id
    let result = await collection.findOne(query); // Finding occurrence by id

    if (!result) {
      res.status(404).send("Occurrence not found"); // Sending error message with status 404 if occurrence not found
    } else {
      res.status(200).send(result); // Sending occurrence data with status 200 if found
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving occurrence"); // Sending error message with status 500
  }
});

// Route for creating a new occurrence
router.post("/", async (req, res) => {
  try {
    let newDocument = {
      date: req.body.date,
      description: req.body.description,
      fixed: req.body.fixed,
    };
    let collection = await db.collection("occurrences");
    let result = await collection.insertOne(newDocument); // Inserting new occurrence
    res.status(201).send(result); // Sending result with status 201 (Created)
  } catch (error) {
    console.error(error);
    res.status(500).send("Error adding occurrence"); // Sending error message with status 500
  }
});

// Route for updating occurrence by id
router.patch("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const updates = {
      $set: {
        date: req.body.date,
        description: req.body.description,
        fixed: req.body.fixed,
      },
    };
    let collection = await db.collection("occurrences");
    let result = await collection.updateOne(query, updates); // Updating occurrence
    res.status(200).send(result); // Sending result with status 200
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating occurrence"); // Sending error message with status 500
  }
});

// Route for deleting occurrence by id
router.delete("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const collection = db.collection("occurrences");
    let result = await collection.deleteOne(query); // Deleting occurrence
    res.status(200).send(result); // Sending result with status 200
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting occurrence"); // Sending error message with status 500
  }
});

export default router; // Exporting router instance
