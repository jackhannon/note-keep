import { describe, it} from 'vitest';
import {screen, render, fireEvent} from '@testing-library/react'
import Notes from '../src/features/Notes/components/Notes'
import { GlobalProvider } from '../src/context/GlobalContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { afterEach} from 'node:test';


describe('modifying individual notes', () => {
  const queryClient = new QueryClient()
  afterEach(() => {
    queryClient.clear();
  });


  it("note disappears when trashed", async() => {
    const noteDetails = {
      _id: "abcd",
      title: "note 1",
      body: "note 1 body",
      labels: [],
      isPinned: false,
      isTrashed: false,
      isArchived: false
    }
  
    render(
      <QueryClientProvider client={queryClient}>
        <GlobalProvider>
          <Notes/>
        </GlobalProvider>
      </QueryClientProvider>
    )
    fireEvent.mouseOver(screen.getByPlaceholderText("Title"));
    fireEvent.click(screen.getByLabelText("optionsButton"));
    fireEvent.click(screen.getByText("Delete"));

    screen.debug()
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
