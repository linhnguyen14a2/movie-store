import { render, screen } from '@testing-library/react';
import { MemoryRouter } from "react-router-dom";

import mockServer from "../_mocks_/mockServer";

import App from '../App';

beforeAll(() => mockServer.listen())
afterEach(() => mockServer.resetHandlers())
afterAll(() => mockServer.close())

test('renders learn react link', () => {
  const  APP_TEXT = 'MOVIE TIME';

  render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
  );

  const textElement = screen.getByText(APP_TEXT);
  expect(textElement).toBeInTheDocument();
});
