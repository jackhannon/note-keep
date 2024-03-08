import { describe, expect, it} from 'vitest';
import { notesData } from '../mocks/data/notesData';
import { removeNote, removeSelectedNotes } from '../src/features/Notes/services/optimisticUpdates';

describe("note removal", () => {
  it("specifed note is removed from object", async () => {
    let prevNotes = notesData;
    let newPages = removeNote("1", [notesData]);
    expect(prevNotes.length).toBe(3)
    expect(newPages[0].length).toBe(2)
  });

  it("specifed notes are removed from object", async () => {
    let prevNotes = notesData;
    let newPages = removeSelectedNotes(["1", "2"], [notesData]);
    expect(prevNotes.length).toBe(3)
    expect(newPages[0].length).toBe(1)
  });
}) 