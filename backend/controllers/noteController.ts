import { NextFunction, Request, Response } from "express";
import { Collection, InsertOneResult, ObjectId } from 'mongodb';
import { db } from "../config/conn.js"

import { AppError } from "../middleware/appErr.js";

interface Note {
  _id: ObjectId;
  title: string;
  body: string;
}

interface Label {
  _id: ObjectId | string;
  title: string;
}

const getQuery = async (req: Request, res: Response, next: NextFunction) => {
  const query: string = req.query.query as string
  const labelId: string = req.query.labelId as string;


  try {
    const notes: Collection<Note> | undefined = await db.collection("notes")
    const plainNotes = await notes?.find({
      $or: [
        { title: { $regex: query, $options: "i" } }, // Case-insensitive search in the title
        { body: { $regex: query, $options: "i" } },  // Case-insensitive search in the body
      ],
      labels: { $elemMatch: { _id: labelId} }
    }).limit(50).toArray()
    if (plainNotes) {
      return res.send(plainNotes).status(200)
    } 
    throw new AppError(500, "Could not get query")
  } catch (error) {
    next(error)
  }
}

const getNote = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  let results;
  try {
    const notes: Collection<Note> | undefined = await db.collection("notes")
    results = await notes?.find({_id: new ObjectId(id)})
    results = results?.limit(50).toArray()
    if (results) {
      return res.send(results).status(200)
    } 
    throw new AppError(500, "Could not get note")
  } catch (error) {
    next(error)
  }
}

const getNotes = async (req: Request, res: Response, next: NextFunction) => {
  const { labelId } = req.params
  let plainNotes: Note[];
  let pinnedNotes: Note[];
  try {
    const notes: Collection<Note> | undefined = await db.collection("notes")

    if (labelId === "Archive") {
      plainNotes = await notes?.find({ isArchived: true }).limit(50).toArray();
      pinnedNotes = []
    } else if (labelId === "Trash") {
      plainNotes = await notes?.find({ isTrashed: true }).limit(50).toArray();
      pinnedNotes = []
    } else if (labelId === "Notes") {
      pinnedNotes = await notes?.find({isPinned: true }).limit(50).toArray();
      plainNotes = await notes?.find({ isArchived: false, isTrashed: false, isPinned: false}).limit(50).toArray();
    } else {
      pinnedNotes = await notes?.find({ labels: { $elemMatch: { _id: labelId} }, isArchived: false, isTrashed: false, isPinned: true }).limit(50).toArray();
      plainNotes = await notes?.find({ labels: { $elemMatch: { _id: labelId} }, isArchived: false, isTrashed: false, isPinned: false }).limit(50).toArray();
    }
    return res.send({plainNotes, pinnedNotes}).status(200)
  } catch (error) {
    next(error)
  }
}




const postNote = async (req: Request, res: Response, next: NextFunction) => {
  const newDoc = req.body;
  console.log(newDoc)
  newDoc.date = new Date();
  newDoc.isTrashed = false
  newDoc.isArchived = false
  newDoc.isPinned = false
  try {
    const notes: Collection<Note> | undefined = db.collection('notes');
    const result: InsertOneResult<Note> | undefined = await notes?.insertOne(newDoc);
    if (result) {
      const insertedNote: Note = {
        ...newDoc,
        _id: result.insertedId,
      };

      return res.status(201).send(insertedNote);
    } else {
      throw new AppError(500, 'Could not insert note');
    }
  } catch (error) {
    next(error)
  }
};

const patchNote = async (req: Request, res: Response, next: NextFunction) => {
  const noteId = req.params.id;
  const updatedFields = req.body
  try {
    const notes: Collection<Note> | undefined = db.collection("notes")
    const result = await notes?.findOneAndUpdate(
      {_id: new ObjectId(noteId)},
      {$set: updatedFields},
      {returnDocument: "after"}
    )

    if (result) {
      return res.send(result.value).status(200)
    } else {
      throw new AppError(500, "Could not update note")
    }
  } catch (error) {
    next(error)
  }
}

const deleteNote = async (req: Request, res: Response, next: NextFunction) => {
  const noteId = req.params.id;

  try {
    const notes: Collection<Note> | undefined = db.collection("notes")
    const result = await notes?.findOneAndDelete(
      {_id: new ObjectId(noteId)}
    )
    if (result) {
      return res.send(result.value).status(200)
    } else {
      throw new AppError(500, "Could not delete note")
    }
  } catch (error) {
    next(error)
  }
}


const getLabels = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const labels: Collection<Label> | undefined = await db.collection("labels")
    const results = await labels.find({}).limit(50).toArray()
    if (results) {
      return res.send(results).status(200)
    } else {
      throw new AppError(500, "Could not get labels")
    }
  } catch (error) {
    next(error)
  }
}

const postLabel = async (req: Request, res: Response, next: NextFunction) => {
    const newDoc = req.body

  try {
    const labels: Collection<Label> | undefined = db.collection("labels")
    const result: InsertOneResult<Label> | undefined = await labels?.insertOne(newDoc);
    if (result) {
      const insertedLabel: Label = {
        ...newDoc,
        _id: result.insertedId,
      };
      return res.status(200).json(insertedLabel)
    } else {
      throw new AppError(500, "Could not create label")
    }
  } catch (error) {
    next(error)
  }
}


const patchLabel = async (req: Request, res: Response, next: NextFunction) => {
  const labelId = req.params.id
  const updatedFields = req.body
  try {
    const labels: Collection<Label> | undefined = db.collection("labels")

    const result = await labels?.findOneAndUpdate(
      {_id: new ObjectId(labelId)},
      {$set: updatedFields},
      {returnDocument: "after"}
    )
    if (result?.value) {
      return res.send(result.value).status(200)
    } else {
      throw new AppError(500, "Could not update label")
    }
  } catch (error) {
    next(error)
  }
}

const deleteLabel = async (req: Request, res: Response, next: NextFunction) => {
  const labelId = req.params.id

  try {
    const labels: Collection<Label> | undefined = db.collection("labels")
    const result = await labels?.findOneAndDelete(
      {_id: new ObjectId(labelId)}
    )
    if (result) {
      console.log(result)
      return res.send(result.value).status(200)
    } else {
      throw new AppError(500, "Could not delete label")
    }
  } catch (error) {
    next(error)
  }
}






export { getNotes, getNote, getQuery, postNote, patchNote, deleteNote, getLabels, postLabel, patchLabel, deleteLabel };
