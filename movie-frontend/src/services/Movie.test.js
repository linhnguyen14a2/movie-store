import { render, waitFor, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import mockServer from "../_mocks_/mockServer";
import Movie from "../components/Movie";

beforeAll(() => mockServer.listen());
afterEach(() => mockServer.resetHandlers());
afterAll(() => mockServer.close());

test("displays the title of the movie and the correct number of reviews", async () => {
    const TITLE_OF_MOVIE = "Blacksmith Scene";
    const EXPECTED_NUMBER_OF_REVIEWS = 3; // Update this with the expected number of reviews

    render(
        <MemoryRouter initialEntries={["/movies/id/573a1390f29313caabcd4135"]}>
            <Movie />
        </MemoryRouter>
    );

    await waitFor(() => {
        const movieTitle = screen.getByRole("heading", { name: TITLE_OF_MOVIE });
        expect(movieTitle).toBeInTheDocument();

        const reviewsContainer = screen.getByRole("list", { name: "Reviews" });
        const reviews = within(reviewsContainer).getAllByRole("listitem");
        expect(reviews.length).toBe(EXPECTED_NUMBER_OF_REVIEWS);
    });
});
