import React from 'react';
import { describe, expect, it, vi} from 'vitest';
import {screen, render, waitFor, fireEvent } from '@testing-library/react'
import Notes from '../src/features/Notes/components/Notes'
import { GlobalProvider } from '../src/context/GlobalContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { afterEach} from 'node:test';
import Header from '../src/features/Header/components/Header';
import { MemoryRouter } from 'react-router';



const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null
});
window.IntersectionObserver = mockIntersectionObserver;

describe('modifying selected notes', () => {
  const queryClient = new QueryClient()
  afterEach(() => {
    queryClient.clear();
  });

  it("multi-select mode turned on when check is clicked on note", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <GlobalProvider>
            <Header/>
            <Notes/>
          </GlobalProvider>
        </MemoryRouter>
      </QueryClientProvider>
    )

    await waitFor(() => {
      expect(screen.getAllByLabelText(/note-item-[a-zA-Z | \d]+/).length).toBeTruthy()
    })

    const note1 = screen.getByLabelText("note-item-1");
    fireEvent.mouseOver(note1)
 
    const checkMark = screen.getByLabelText("check-for-note-1");
    fireEvent.click(checkMark)

    await waitFor(() => {
      expect(screen.getByLabelText("multi-select-off")).toBeTruthy()
    })
    
    await waitFor(() => {
      expect(screen.getByText(/\d+ selected/).textContent).toBe("1 selected")
    })
  });


  it("notes can be added to list of selected and removed", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <GlobalProvider>
            <Header/>
            <Notes/>
          </GlobalProvider>
        </MemoryRouter>
      </QueryClientProvider>
    )

    await waitFor(() => {
      expect(screen.getAllByLabelText(/note-item-[a-zA-Z | \d]+/).length).toBeTruthy()
    })

    const note1 = screen.getByLabelText("note-item-1");
    fireEvent.mouseOver(note1)
 
    const checkMark1 = screen.getByLabelText("check-for-note-1");
    fireEvent.click(checkMark1)

    await waitFor(() => {
      expect(screen.getByLabelText("multi-select-off")).toBeTruthy()
    })
    
    await waitFor(() => {
      expect(screen.getByText(/\d+ selected/).textContent).toBe("1 selected")
    })

    const note2 = screen.getByLabelText("note-item-2");
    fireEvent.mouseOver(note2);
 
    const checkMark2 = screen.getByLabelText("check-for-note-2");
    fireEvent.click(checkMark2);

    await waitFor(() => {
      expect(screen.getByText(/\d+ selected/).textContent).toBe("2 selected")
    })

    fireEvent.click(checkMark2);

    await waitFor(() => {
      expect(screen.getByText(/\d+ selected/).textContent).toBe("1 selected")
    })
  });


  it("multi-select mode turned off when X is clicked", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <GlobalProvider>
            <Header/>
            <Notes/>
          </GlobalProvider>
        </MemoryRouter>
      </QueryClientProvider>
    )

    await waitFor(() => {
      expect(screen.queryAllByLabelText(/note-item-[a-zA-Z | \d]+/).length).toBeTruthy()
    })

    const note1 = screen.getByLabelText("note-item-1");
    fireEvent.mouseOver(note1)
 
    const checkMark1 = screen.getByLabelText("check-for-note-1");
    fireEvent.click(checkMark1)

    await waitFor(() => {
      expect(screen.queryAllByLabelText("multi-select-off")).toBeTruthy()
    })
    
    await waitFor(() => {
      expect(screen.getByText(/\d+ selected/).textContent).toBe("1 selected")
    })

    const multiSelectOffButton = screen.getByLabelText("multi-select-off")
    fireEvent.click(multiSelectOffButton)

    await waitFor(() => {
      expect(screen.queryAllByLabelText("multi-select-off")).toBeTruthy()
    })
  });


  it("selected notes are unpinned on unpin under correct valid conditions", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <GlobalProvider>
            <Header/>
            <Notes/>
          </GlobalProvider>
        </MemoryRouter>
      </QueryClientProvider>
    )

    await waitFor(() => {
      expect(screen.queryAllByLabelText(/note-item-[a-zA-Z | \d]+/).length).toBeTruthy()
    })

    const note1 = screen.getByLabelText("note-item-1");
    fireEvent.mouseOver(note1)

    const checkMark1 = screen.getByLabelText("check-for-note-1");
    fireEvent.click(checkMark1)

    await waitFor(() => {
      expect(screen.queryAllByLabelText("multi-select-off")).toBeTruthy()
    })

    const note2 = screen.getByLabelText("note-item-2");
    fireEvent.mouseOver(note2);

    const checkMark2 = screen.getByLabelText("check-for-note-2");
    fireEvent.click(checkMark2);

    await waitFor(() => {
      expect(screen.getByText(/\d+ selected/).textContent).toBe("2 selected")
    })

    const unpinNotesButton = screen.getByLabelText("multi-select-pin-toggle");
    fireEvent.click(unpinNotesButton)

    await waitFor(() => {
      expect(screen.queryAllByLabelText("multi-select-off")).toBeTruthy()
    })

    await waitFor(() => {
      expect(screen.queryAllByLabelText(/^pinned-for-[a-zA-Z | \d]+/).length).toBe(0)
      expect(screen.queryAllByLabelText(/unpinned-for-[a-zA-Z | \d]+/).length).toBe(3)
    })
  });

  it("selected notes disappear when patched", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <GlobalProvider>
            <Header/>
            <Notes/>
          </GlobalProvider>
        </MemoryRouter>
      </QueryClientProvider>
    )

    await waitFor(() => {
      expect(screen.getAllByLabelText(/note-item-[a-zA-Z | \d]+/).length).toBeTruthy()
    })

    const note1 = screen.getByLabelText("note-item-1");
    fireEvent.mouseOver(note1)
 
    const checkMark1 = screen.getByLabelText("check-for-note-1");
    fireEvent.click(checkMark1)

    await waitFor(() => {
      expect(screen.getByLabelText("multi-select-off")).toBeTruthy()
      expect(screen.getByText(/\d+ selected/).textContent).toBe("1 selected")
    })
    
    const note2 = screen.getByLabelText("note-item-2");
    fireEvent.mouseOver(note2);
 
    const checkMark2 = screen.getByLabelText("check-for-note-2");
    fireEvent.click(checkMark2);

    await waitFor(() => {
      expect(screen.getByText(/\d+ selected/).textContent).toBe("2 selected")
    })

    const optionsButton = screen.getByLabelText("multi-select-options");
    fireEvent.click(optionsButton);
    await waitFor(() => {
      const deleteButton = screen.getByRole('button', { name: 'Delete' })    
      expect(deleteButton).toBeTruthy()
      fireEvent.click(deleteButton);
    })
  
    await waitFor(() => {
      expect(screen.getAllByLabelText(/note-item-[a-zA-Z | \d]+/).length).toBe(1)
    })
  });
});
