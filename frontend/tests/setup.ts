import { beforeAll, afterEach, afterAll } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import { expect } from 'vitest';
import { server } from '../mocks/server'

beforeAll(() => {
  expect.extend(matchers);
  server.listen()
})


afterEach(() => {
  cleanup();
  server.resetHandlers()
});

afterAll(() => server.close())

