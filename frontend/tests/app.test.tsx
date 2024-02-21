import { describe, it } from 'vitest';

describe('switching labels', () => {
  it("current label and notes switches when another label is clicked", () => {
    //working
  });
});


describe('modifying individual notes', () => {
  it("note disappears when trashed", () => {
    // working
  });

  it("note disappears when archived", () => {
    //working
  });

  it("note disappears and goes to deleted label when deleted", () => {
    //working
  });

  it("note disappears goes to respective label(s) when restored", () => {
    //working
  });

  it("note disappears when current label is removed from the notes labels", () => {
    //working
  });

  it("notes delete when their labels are deleted", () => {
    //working
  });

  it("note created upon correct trigger", () => {
    //working
  });

  it("note contents mutable", () => {
    // working
  });
});


describe('modifying multiple notes', () => {
  it("selected notes disappears when trashed", () => {
    //working
  });

  it("selected notes disappear when archived", () => {
    //working
  });

  it("selected notes disappear when deleted", () => {
    //working
  });

  it("selected notes disappears when restored", () => {
    //working 
  });

  it("selected notes copy when copied", () => {
    //working 
  });

});


describe('modifying labels', () => {
  it("default labels present", () => {
    //working
  });

  it("label name mutable", () => {
    //working
  });

  it("label removable", () => {
    // working
  });

  it("add a label", () => {
    // working
  });
});


describe('querying', () => {
  it("only notes within labels are retrieved when searching", () => {
    //working
  });

  it("query dissapears when label switches", () => {
    //working
  });
  
  it("'No notes found!' message displayed when no nots are present after query", () => {
    //working
  });
});


//validate inputs and make add an ellipsis cutoff for the labels modal on notes

//fixed the modals overlaying, they are not spanning the entire height of the page
 

//when clicking outside new label field onto other label when 
// field isnot empty it will flicker

//be VERY careful with useoutsideclick, can cause subtle bugs