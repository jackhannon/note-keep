import { describe, it } from 'vitest';

describe('switching labels', () => {
  it("current label and notes switches when another label is clicked", () => {

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
    //prob working
  });

  it("notes delete when their labels are deleted", () => {
    
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
    
  });

  it("selected notes disappear when archived", () => {
    
  });

  it("selected notes disappear when deleted", () => {
    
  });

  it("selected notes disappears when restored", () => {
    
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

//validate inputs and make add an ellipsis cutoff for the labels modal on notes

//fixed the modals overlaying, they are not spanning the entire height of the page

//fix the note hover issue: 
// when you click the options button on notes and then click outside to close the modal,
// the check will not go away until another mouse exit even occurs, this can lead to highlighting
// multiple notes when multi select mode is not even on 



//be VERY careful with useoutsideclick, can cause subtle bugs