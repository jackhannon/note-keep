import { beforeAll, afterEach, afterAll, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import { expect } from 'vitest';
import { server } from '../mocks/server'


global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null
}));

beforeAll(() => {
  expect.extend(matchers);
  server.listen()
})

afterEach(() => {
  cleanup();
  server.resetHandlers()
});

afterAll(() => server.close())
