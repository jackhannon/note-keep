import { NextFunction, Request, Response } from "express";
import { Collection, InsertOneResult, ObjectId } from 'mongodb';
import { db } from "../config/conn.js"
import { AppError } from "../middleware/appErr.js";

interface Note {
  _id: ObjectId;
  title: string;
  body: string;
  isPinned: boolean
}

interface Label {
  _id: ObjectId | string;
  title: string;
}

const escapeRegExp = (str: string) => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

const getQuery = async (req: Request, res: Response, next: NextFunction) => {
  const labelId: string = req.params.labelId as string;
  const query: string = decodeURIComponent(req.query.query as string);
  const page: string = req.query.page as string;


  try {
    const notes: Collection<Note> | undefined = await db.collection("notes");
    let zeroBasedPageNumber = Number(page) - 1;
    const escapedQuery = escapeRegExp(query);
    if (["Trash", "Archive"].includes(labelId)) {
      const queriedNotes = await notes?.find({
        $or: [
          { title: { $regex: escapedQuery, $options: "i" } },
          { body: { $regex: escapedQuery, $options: "i" } },
        ],
        isTrashed: labelId === "Trash",
        isArchived: labelId === "Archive",
      })
      .sort({ date: -1 })
      .skip(zeroBasedPageNumber*40)
      .limit(40)
      .toArray();
      return res.send(queriedNotes).status(200);
    }
    
    let labelFilter = {};
    if (labelId !== "Notes") {
      labelFilter = { labels: { $in: [labelId] } };
    }

    const queriedNotes = await notes?.find({
      $or: [
        { title: { $regex: escapedQuery, $options: "i" } },
        { body: { $regex: escapedQuery, $options: "i" } },
      ],
      isTrashed: false,
      isArchived: false,
      ...labelFilter
    })
    .sort({ isPinned: -1, date: -1 })
    .skip(zeroBasedPageNumber*40)
    .limit(40)
    .toArray()

    if (queriedNotes) {
      return res.send(queriedNotes).status(200)
    } 
    throw new AppError(500, "Could not get query")
  } catch (error) {
    next(error)
  }
};


const postNote = async (req: Request, res: Response, next: NextFunction) => {
  const newDoc = req.body;
  newDoc.isTrashed = false
  newDoc.isArchived = false
  
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
};


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
};


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
};


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
};


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
};


const deleteLabel = async (req: Request, res: Response, next: NextFunction) => {
  const labelId = req.params.id
  try {
    const notes: Collection<Label> | undefined = db.collection("notes")

    const notesToDeleteCursor = await notes.find({
      labels: { $size: 1, $in: [labelId] }
    });
   

    const notesToDelete = await notesToDeleteCursor.toArray();
    await notes.deleteMany({ _id: { $in: notesToDelete.map(note => note._id) } });

    const labels: Collection<Label> | undefined = db.collection("labels")
    const result = await labels?.findOneAndDelete(
      {_id: new ObjectId(labelId)}
    )
    if (result) {
      return res.send(result.value).status(200)
    } else {
      throw new AppError(500, "Could not delete label")
    }
  } catch (error) {
    next(error)
  }
};






export { getQuery, postNote, patchNote, deleteNote, getLabels, postLabel, patchLabel, deleteLabel };
