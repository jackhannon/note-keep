import { NoteType } from "../interfaces";

export function findIndexWhereDateIsClosest(notes: NoteType[], date: number): number {
  if (notes.length < 1) {
    return 0;
  }
  let pointerA = 0;
  let pointerB = notes.length - 1;
  let middle = Math.floor((pointerA + pointerB) / 2);

  while ((pointerB - pointerA) > 1) {
    if (notes[middle].date < date) {
      pointerB = middle;
    } else {
      pointerA = middle;
    }
    middle = Math.floor((pointerA + pointerB) / 2);
  }
  if (notes[pointerA].date <= date) {
    return pointerA
  }
  if (notes[pointerA].date >= date && notes[middle].date <= date) {
    return middle
  }
  if (notes[middle].date >= date && notes[pointerB].date <= date) {
    return pointerB
  }
  if (notes[pointerB].date >= date) {
    return pointerB + 1
  }
  return 0
}