import { describe, expect, it} from 'vitest';
import { notesData } from '../mocks/data/notesData';
import { removeNote } from '../src/features/Notes/services/optimisticUpdates';

describe("note removal", () => {
  it("specifed note is removed from object", async () => {
    let prevNotes = notesData;
    let newNotes = removeNote("1", notesData);
    expect(prevNotes.pinnedNotes.length).toBe(2)
    expect(newNotes.pinnedNotes.length).toBe(1)
    expect(prevNotes.plainNotes.length).toEqual(prevNotes.plainNotes.length)
  });

  it("specifed notes are removed from object", async () => {
    
  });
}) 