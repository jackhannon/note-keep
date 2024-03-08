import React from 'react';
import { describe, expect, it, vi} from 'vitest';
import {screen, render, waitFor, fireEvent } from '@testing-library/react'
import Notes from '../src/features/Notes/components/Notes'
import { GlobalProvider } from '../src/context/GlobalContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { afterEach} from 'node:test';
import Sidebar from '../src/features/Labels/components/Sidebar';
import { MemoryRouter } from 'react-router';



const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null
});
window.IntersectionObserver = mockIntersectionObserver;

describe('modifying labels', () => {
  const queryClient = new QueryClient()
  afterEach(() => {
    queryClient.clear();
  });

  it("labels display in modal", async () => {
    render(
      <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <GlobalProvider>
          <Sidebar/>
          <Notes/>
        </GlobalProvider>
      </MemoryRouter>
  </QueryClientProvider>
    )

    await waitFor(() => {
      expect(screen.getAllByLabelText(/note-item-[a-zA-Z | \d]+/).length).toBeTruthy()
    })

    const editLabelButton = screen.getByLabelText("edit-labels");
    fireEvent.click(editLabelButton)
 
    await waitFor(() => {
      expect(screen.queryAllByLabelText(/input-label-title-for-[a-zA-Z | \d]+/).length).toBe(3)
    })
  });


  it("label dissapears when deleted", async () => {
    render(
      <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <GlobalProvider>
          <Sidebar/>
          <Notes/>
        </GlobalProvider>
      </MemoryRouter>
  </QueryClientProvider>
    )

    await waitFor(() => {
      expect(screen.getAllByLabelText(/note-item-[a-zA-Z | \d]+/).length).toBeTruthy()
    })

    const editLabelButton = screen.getByLabelText("edit-labels");
    fireEvent.click(editLabelButton)
 
    await waitFor(() => {
      expect(screen.queryAllByLabelText(/input-label-title-for-[a-zA-Z | \d]+/).length).toBe(3)
    })

    const trashButtonForLabel1 = screen.getByLabelText("trash-button-for-label-1");
    fireEvent.click(trashButtonForLabel1)

    await waitFor(() => {
      expect(screen.queryByLabelText(`confirm-delete-label`)).toBeTruthy
    })

    const deleteButton = screen.queryByLabelText(`confirm-delete-label`);
    fireEvent.click(deleteButton)

    await waitFor(() => {
      expect(screen.queryByLabelText(`confirm-delete-label`)).toBeFalsy()
      expect(screen.queryAllByLabelText(/input-label-title-for-[a-zA-Z | \d]+/).length).toBe(2)
    })
  });

  
  it("label name mutable", async () => {
    render(
      <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <GlobalProvider>
          <Sidebar/>
          <Notes/>
        </GlobalProvider>
      </MemoryRouter>
  </QueryClientProvider>
    )

    await waitFor(() => {
      expect(screen.getAllByLabelText(/note-item-[a-zA-Z | \d]+/).length).toBeTruthy()
    })

    const editLabelButton = screen.getByLabelText("edit-labels");
    fireEvent.click(editLabelButton);

    await waitFor(() => {
      expect(screen.queryAllByLabelText(/input-label-title-for-[a-zA-Z | \d]+/).length).toBe(3);
    })

    const labelTitleInput = screen.getByLabelText(`input-label-title-for-1`);
    fireEvent.focus(labelTitleInput)

    const confirmEditButton = screen.queryByLabelText("confirm-edit-button-for-label-1");

    await waitFor(() => {
      expect(confirmEditButton).toBeTruthy();
    });

    const newTitle = "New, better title";
    fireEvent.change(labelTitleInput, { target: { value: newTitle } });
    fireEvent.click(confirmEditButton)

    await waitFor(() => {
      expect(labelTitleInput.value).toBe(newTitle);
    });
  });

  
  it("can create new label", async () => {
    render(
      <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <GlobalProvider>
              <Sidebar/>
              <Notes/>
            </GlobalProvider>
          </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getAllByLabelText(/note-item-[a-zA-Z | \d]+/).length).toBeTruthy()
    })

    const editLabelButton = screen.getByLabelText("edit-labels");
    fireEvent.click(editLabelButton);

    await waitFor(() => {
      expect(screen.queryAllByLabelText(/input-label-title-for-[a-zA-Z | \d]+/).length).toBe(3);
    })

    const newLabelInput = screen.getByLabelText(`create-new-label`);
    fireEvent.focus(newLabelInput)

    const confirmCreateButton = screen.queryByLabelText("confirm-new-label-creation");

    await waitFor(() => {
      expect(confirmCreateButton).toBeTruthy();
    });

    const newTitle = "New, better label";
    fireEvent.change(newLabelInput, { target: { value: newTitle } });
    fireEvent.click(confirmCreateButton)

    await waitFor(() => {
      expect(screen.queryAllByLabelText(/input-label-title-for-[a-zA-Z | \d]+/).length).toBe(4);
    })
  })
})