import React from 'react';
import { describe, expect, it} from 'vitest';
import {screen, render, waitFor, fireEvent } from '@testing-library/react'
import Notes from '../src/features/Notes/components/Notes'
import { GlobalProvider } from '../src/context/GlobalContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { afterEach} from 'node:test';



describe('notes rendering behaviour', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  afterEach(() => {
    queryClient.clear();
  });


  it("notes are displayed when present in data", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <GlobalProvider>
          <Notes/>
        </GlobalProvider>
      </QueryClientProvider>
    )
    await waitFor(() => {
      const notes = screen.getAllByLabelText(/note-item-[a-zA-Z | \d]+/)
      expect(notes.length).toBe(3)
    })
  });


  it("note disappears when deleted", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <GlobalProvider>
          <Notes/>
        </GlobalProvider>
      </QueryClientProvider>
    )

    await waitFor(() => {
      expect(screen.getAllByLabelText(/note-item-[a-zA-Z | \d]+/).length).toBe(3)
    })

    const note = screen.getByLabelText("note-item-1")
    fireEvent.mouseOver(note)
 
    const optionsButton = screen.getByLabelText("options-button-for-1")
    fireEvent.click(optionsButton)
    
    const deleteButton = screen.getByLabelText("trash-button-for-1")
    fireEvent.click(deleteButton)

    await waitFor(() => {
      expect(screen.getAllByLabelText(/note-item-[a-zA-Z | \d]+/).length).toBe(2)
    })
    // screen.debug()
  });


  it("note created upon correct trigger", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <GlobalProvider>
          <Notes/>
        </GlobalProvider>
      </QueryClientProvider>
    )

    await waitFor(() => {
      expect(screen.getAllByLabelText(/note-item-[a-zA-Z | \d]+/).length).toBe(3)
    })

    const createNoteField = screen.getByLabelText("new-note-body")
    fireEvent.focus(createNoteField)
 
    const newNoteText = "This is a new note!";
    fireEvent.change(createNoteField, { target: { value: newNoteText } });
    await waitFor(() => {
      expect(createNoteField.textContent).toBe(newNoteText)
    })
    fireEvent.click(document.body);
    await waitFor(() => {
      expect(screen.getAllByLabelText(/note-item/).length).toBe(4)
    })
    screen.debug()
  });

  
  it("note content is mutable", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <GlobalProvider>
          <Notes/>
        </GlobalProvider>
      </QueryClientProvider>
    )

    await waitFor(() => {
      expect(screen.getAllByLabelText(/note-item-[a-zA-Z | \d]+/).length).toBeTruthy()
    })

    const note1 = screen.getByLabelText("note-item-1");
    fireEvent.click(note1);

    const newNoteTitle = "New title!"
    const noteTitle = screen.getByLabelText("active-note-title");
 
    fireEvent.focus(noteTitle)

    fireEvent.change(noteTitle, { target: { value: newNoteTitle } });
    
    await waitFor(() => {
      expect(noteTitle.value).toBe(newNoteTitle)
    })
    fireEvent.click(document.body);

    await waitFor(() => {
      expect(screen.getByLabelText("note-title-for-note-1").value).toBe(newNoteTitle)
    })
  });
});
