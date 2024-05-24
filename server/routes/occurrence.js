import express from "express";
import db from "../database/dbConnection.js";
import { ObjectId } from "mongodb";

const router = express.Router();
//Listing all the occurrences
router.get("/", async (req, res) => {
  let collection = await db.collection("occurrences");
  let results = await collection.find({}).toArray();
  res.send(results).status(200);
});

// Get a single occurrence by id
router.get("/:id", async (req, res) => {
  let collection = await db.collection("occurrences");
  let query = { _id: new ObjectId(req.params.id) };
  let result = await collection.findOne(query);

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

// Create a new occurrence.
router.post("/", async (req, res) => {
  try {
    let newDocument = {
      date: req.body.date,
      description: req.body.description,
      //name: req.body.name,
      fixed: req.body.fixed,
    };
    let collection = await db.collection("occurrences");
    let result = await collection.insertOne(newDocument);
    res.send(result).status(204);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding occurrence");
  }
});

// Update occurrence by id.
router.patch("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const updates = {
      $set: {
        date: req.body.date,
        description: req.body.description,
        //name: req.body.name,
        fixed: require.body.fixed,
      },
    };

    let collection = await db.collection("occurrences");
    let result = await collection.updateOne(query, updates);
    res.send(result).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating occurrence");
  }
});

// Delete occurrence
router.delete("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };

    const collection = db.collection("occurrences");
    let result = await collection.deleteOne(query);

    res.send(result).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting occurrence");
  }
});

export default router;
