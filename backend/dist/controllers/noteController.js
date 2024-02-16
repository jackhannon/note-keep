"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLabel = exports.patchLabel = exports.postLabel = exports.getLabels = exports.deleteNote = exports.patchNote = exports.postNote = exports.getQuery = exports.getNote = exports.getNotes = void 0;
const mongodb_1 = require("mongodb");
const conn_js_1 = require("../config/conn.js");
const appErr_js_1 = require("../middleware/appErr.js");
const getQuery = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const labelId = req.params.labelId;
    const query = req.query.query;
    try {
        const notes = yield conn_js_1.db.collection("notes");
        if (["Trash", "Archive"].includes(labelId)) {
            const plainNotes = yield (notes === null || notes === void 0 ? void 0 : notes.find({
                $or: [
                    { title: { $regex: query, $options: "i" } },
                    { body: { $regex: query, $options: "i" } },
                ],
                isTrashed: labelId === "Trash",
                isArchived: labelId === "Archive",
            }).limit(50).toArray());
            return res.send({ pinnedNotes: [], plainNotes }).status(200);
        }
        const pinnedNotes = yield (notes === null || notes === void 0 ? void 0 : notes.find({
            $or: [
                { title: { $regex: query, $options: "i" } },
                { body: { $regex: query, $options: "i" } },
            ],
            isPinned: true,
            isTrashed: false,
            isArchived: false,
            labels: { $elemMatch: { _id: labelId } }
        }).limit(50).toArray());
        const plainNotes = yield (notes === null || notes === void 0 ? void 0 : notes.find({
            $or: [
                { title: { $regex: query, $options: "i" } },
                { body: { $regex: query, $options: "i" } },
            ],
            isPinned: false,
            isTrashed: false,
            isArchived: false,
            labels: { $elemMatch: { _id: labelId } }
        }).limit(50).toArray());
        if (pinnedNotes && plainNotes) {
            return res.send({ pinnedNotes, plainNotes }).status(200);
        }
        throw new appErr_js_1.AppError(500, "Could not get query");
    }
    catch (error) {
        next(error);
    }
});
exports.getQuery = getQuery;
const getNote = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    let results;
    try {
        const notes = yield conn_js_1.db.collection("notes");
        results = yield (notes === null || notes === void 0 ? void 0 : notes.find({ _id: new mongodb_1.ObjectId(id) }));
        results = results === null || results === void 0 ? void 0 : results.limit(50).toArray();
        if (results) {
            return res.send(results).status(200);
        }
        throw new appErr_js_1.AppError(500, "Could not get note");
    }
    catch (error) {
        next(error);
    }
});
exports.getNote = getNote;
const getNotes = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { labelId } = req.params;
    let plainNotes;
    let pinnedNotes;
    try {
        const notes = yield conn_js_1.db.collection("notes");
        if (labelId === "Archive") {
            plainNotes = yield (notes === null || notes === void 0 ? void 0 : notes.find({ isArchived: true }).limit(50).toArray());
            pinnedNotes = [];
        }
        else if (labelId === "Trash") {
            plainNotes = yield (notes === null || notes === void 0 ? void 0 : notes.find({ isTrashed: true }).limit(50).toArray());
            pinnedNotes = [];
        }
        else if (labelId === "Notes") {
            pinnedNotes = yield (notes === null || notes === void 0 ? void 0 : notes.find({ isPinned: true }).limit(50).toArray());
            plainNotes = yield (notes === null || notes === void 0 ? void 0 : notes.find({ isArchived: false, isTrashed: false, isPinned: false }).limit(50).toArray());
        }
        else {
            pinnedNotes = yield (notes === null || notes === void 0 ? void 0 : notes.find({ labels: { $elemMatch: { _id: labelId } }, isArchived: false, isTrashed: false, isPinned: true }).limit(50).toArray());
            plainNotes = yield (notes === null || notes === void 0 ? void 0 : notes.find({ labels: { $elemMatch: { _id: labelId } }, isArchived: false, isTrashed: false, isPinned: false }).limit(50).toArray());
        }
        return res.send({ plainNotes, pinnedNotes }).status(200);
    }
    catch (error) {
        next(error);
    }
});
exports.getNotes = getNotes;
const postNote = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const newDoc = req.body;
    console.log(newDoc);
    newDoc.date = new Date();
    newDoc.isTrashed = false;
    newDoc.isArchived = false;
    newDoc.isPinned = false;
    if (!newDoc.labels.some((label) => label._id === "Notes")) {
        newDoc.labels.push({ title: 'Notes', _id: 'Notes' });
    }
    try {
        const notes = conn_js_1.db.collection('notes');
        const result = yield (notes === null || notes === void 0 ? void 0 : notes.insertOne(newDoc));
        if (result) {
            const insertedNote = Object.assign(Object.assign({}, newDoc), { _id: result.insertedId });
            return res.status(201).send(insertedNote);
        }
        else {
            throw new appErr_js_1.AppError(500, 'Could not insert note');
        }
    }
    catch (error) {
        next(error);
    }
});
exports.postNote = postNote;
const patchNote = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const noteId = req.params.id;
    const updatedFields = req.body;
    try {
        const notes = conn_js_1.db.collection("notes");
        const result = yield (notes === null || notes === void 0 ? void 0 : notes.findOneAndUpdate({ _id: new mongodb_1.ObjectId(noteId) }, { $set: updatedFields }, { returnDocument: "after" }));
        if (result) {
            return res.send(result.value).status(200);
        }
        else {
            throw new appErr_js_1.AppError(500, "Could not update note");
        }
    }
    catch (error) {
        next(error);
    }
});
exports.patchNote = patchNote;
const deleteNote = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const noteId = req.params.id;
    try {
        const notes = conn_js_1.db.collection("notes");
        const result = yield (notes === null || notes === void 0 ? void 0 : notes.findOneAndDelete({ _id: new mongodb_1.ObjectId(noteId) }));
        if (result) {
            return res.send(result.value).status(200);
        }
        else {
            throw new appErr_js_1.AppError(500, "Could not delete note");
        }
    }
    catch (error) {
        next(error);
    }
});
exports.deleteNote = deleteNote;
const getLabels = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const labels = yield conn_js_1.db.collection("labels");
        const results = yield labels.find({}).limit(50).toArray();
        if (results) {
            return res.send(results).status(200);
        }
        else {
            throw new appErr_js_1.AppError(500, "Could not get labels");
        }
    }
    catch (error) {
        next(error);
    }
});
exports.getLabels = getLabels;
const postLabel = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const newDoc = req.body;
    try {
        const labels = conn_js_1.db.collection("labels");
        const result = yield (labels === null || labels === void 0 ? void 0 : labels.insertOne(newDoc));
        if (result) {
            const insertedLabel = Object.assign(Object.assign({}, newDoc), { _id: result.insertedId });
            return res.status(200).json(insertedLabel);
        }
        else {
            throw new appErr_js_1.AppError(500, "Could not create label");
        }
    }
    catch (error) {
        next(error);
    }
});
exports.postLabel = postLabel;
const patchLabel = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const labelId = req.params.id;
    const updatedFields = req.body;
    try {
        const labels = conn_js_1.db.collection("labels");
        const result = yield (labels === null || labels === void 0 ? void 0 : labels.findOneAndUpdate({ _id: new mongodb_1.ObjectId(labelId) }, { $set: updatedFields }, { returnDocument: "after" }));
        if (result === null || result === void 0 ? void 0 : result.value) {
            return res.send(result.value).status(200);
        }
        else {
            throw new appErr_js_1.AppError(500, "Could not update label");
        }
    }
    catch (error) {
        next(error);
    }
});
exports.patchLabel = patchLabel;
const deleteLabel = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const labelId = req.params.id;
    try {
        const notes = conn_js_1.db.collection("notes");
        const notesToDeleteCursor = yield notes.find({
            labels: { $size: 2, $all: [labelId] }
        });
        const notesToDelete = yield notesToDeleteCursor.toArray();
        yield notes.deleteMany({ _id: { $in: notesToDelete.map(note => note._id) } });
        const labels = conn_js_1.db.collection("labels");
        const result = yield (labels === null || labels === void 0 ? void 0 : labels.findOneAndDelete({ _id: new mongodb_1.ObjectId(labelId) }));
        if (result) {
            return res.send(result.value).status(200);
        }
        else {
            throw new appErr_js_1.AppError(500, "Could not delete label");
        }
    }
    catch (error) {
        next(error);
    }
});
exports.deleteLabel = deleteLabel;
