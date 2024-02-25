import React from 'react';
import { describe, expect, it, vi} from 'vitest';
import {screen, render } from '@testing-library/react'
import Notes from '../src/features/Notes/components/Notes'
import { GlobalProvider } from '../src/context/GlobalContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { afterEach} from 'node:test';
import axios from 'axios';
vi.mock('axios', () => {
  const mockNotes =  {
    data: {
      pinnedNotes: [
        {
          _id: '1',
          title: 'note 1',
          body: 'note 1 body',
          labels: [],
          isPinned: true,
          isTrashed: false,
          isArchived: false,
        },
        {
          _id: '2',
          title: 'note 2',
          body: 'note 2 body',
          labels: [],
          isPinned: true,
          isTrashed: false,
          isArchived: false,
        },
      ],
      plainNotes: [
        {
          _id: '3',
          title: 'note 3',
          body: 'note 3 body',
          labels: [],
          isPinned: false,
          isTrashed: false,
          isArchived: false,
        },
      ]
    }
  }

  return {
    default: {
      post: vi.fn(),
      get: vi.fn().mockResolvedValue(mockNotes),
      delete: vi.fn(),
      put: vi.fn(),
      create: vi.fn().mockReturnThis(),
      interceptors: {
        request: {
          use: vi.fn(),
          eject: vi.fn(),
        },
        response: {
          use: vi.fn(),
          eject: vi.fn(),
        },
      },
    },
  };
});


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


  it("notes are displayed", async() => {
    render(
      <QueryClientProvider client={queryClient}>
        <GlobalProvider>
          <Notes/>
        </GlobalProvider>
      </QueryClientProvider>
    )
    const spy = vi.spyOn(axios, 'create')
    expect(spy).toHaveBeenCalled()
    screen.debug();
  });
  
  it("error message is displayed when axios fails", async() => {
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
