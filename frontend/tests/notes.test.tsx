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

  // it("notes are displayed when present in data", async () => {
  //   render(
  //     <QueryClientProvider client={queryClient}>
  //       <GlobalProvider>
  //         <Notes/>
  //       </GlobalProvider>
  //     </QueryClientProvider>
  //   )
  //   await waitFor(() => {
  //     const notes = screen.getAllByLabelText(/note-item-[a-zA-Z | \d]+/)
  //     expect(notes.length).toBe(3)
  //   })
  // });

  it("note disappears and goes to deleted label when deleted", async () => {
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

    const plainNote = screen.getByLabelText("note-item-1")
    fireEvent.mouseOver(plainNote)
 
    const optionsButton = screen.getByLabelText("options-button-for-1")
    fireEvent.click(optionsButton)
    
    const deleteButton = screen.getByLabelText("trash-button-for-1")
    fireEvent.click(deleteButton)
    await waitFor(() => {
      expect(screen.getAllByLabelText(/note-item-[a-zA-Z | \d]+/).length).toBe(2)
    })
    screen.debug()

  });

//   it("note disappears goes to respective label(s) when restored", () => {
//     //working
//   });

//   it("note disappears when current label is removed from the notes labels", () => {
//     //working
//   });

//   it("notes delete when their labels are deleted", () => {
//     //working
//   });

//   it("note created upon correct trigger", () => {
//     //working
//   });

//   it("note contents mutable", () => {
//     // working
//   });
});
