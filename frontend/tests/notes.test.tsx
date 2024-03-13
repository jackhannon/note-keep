import React from 'react';
import { describe, expect, it} from 'vitest';
import {screen, render, waitFor } from '@testing-library/react'
import Notes from '../src/features/Notes/components/Notes'
import { GlobalProvider } from '../src/context/GlobalContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { afterEach} from 'node:test';
import { MemoryRouter } from 'react-router';

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
  it("notes display", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <GlobalProvider>
            <Notes/>
          </GlobalProvider>
        </MemoryRouter>
      </QueryClientProvider>
    )
    await waitFor(() => {
      const notes = screen.getAllByLabelText(/note-item-[a-zA-Z | \d]+/)
      expect(notes.length).toBe(3)
    })
  });
});
