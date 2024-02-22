import { describe, expect, it, vi} from 'vitest';
import {screen, render } from '@testing-library/react'
import Notes from '../src/features/Notes/components/Notes'
import { GlobalProvider } from '../src/context/GlobalContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { afterEach} from 'node:test';
import axios from 'axios';
import { MockedFunction } from 'vitest';
import makeRequestMock from '../src/utils/__mocks__/makeRequests';


// vi.mock('axios', () => {
//   return {
//     default: {
//       post: vi.fn(),
//       get: vi.fn(),
//       delete: vi.fn(),
//       put: vi.fn(),
//       create: vi.fn().mockReturnThis(),
//       interceptors: {
//         request: {
//           use: vi.fn(),
//           eject: vi.fn(),
//         },
//         response: {
//           use: vi.fn(),
//           eject: vi.fn(),
//         },
//       },
//     },
//   };
// });

vi.mock('../src/utils/makeRequests')

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
    screen.debug()
    
    await makeRequestMock();

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
