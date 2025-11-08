# PixelPop FM

A retro-themed online radio player to discover and stream stations from around the world.

[cloudflarebutton]

PixelPop FM is a visually striking online radio streaming application with a retro, 90s-inspired 'pixel art' and 'vaporwave' aesthetic. It allows users to discover, listen to, and favorite thousands of internet radio stations from around the world. The application leverages the public Radio Browser API to provide a comprehensive and filterable directory of stations. The entire experience is wrapped in a stunning, nostalgic UI with neon glows, pixelated fonts, and glitch effects, designed to be both a functional tool and a piece of interactive art.

## Key Features

-   **Global Radio Directory**: Access thousands of internet radio stations via the Radio Browser API.
-   **Discover & Filter**: Browse stations by genre and country, or use the search to find specific stations.
-   **Persistent Audio Player**: A global audio player that remains active while you navigate the application.
-   **Station Details**: SEO-friendly dedicated pages for each station with detailed information.
-   **Favorites**: Save your favorite stations for quick and easy access.
-   **Retro UI**: A unique, nostalgic user interface inspired by 90s pixel art and vaporwave aesthetics.

## Technology Stack

-   **Frontend**:
    -   [React](https://react.dev/)
    -   [React Router](https://reactrouter.com/)
    -   [Zustand](https://zustand-demo.pmnd.rs/) for state management
    -   [Tailwind CSS](https://tailwindcss.com/)
    -   [shadcn/ui](https://ui.shadcn.com/) for UI components
    -   [Framer Motion](https://www.framer.com/motion/) for animations
    -   [Lucide React](https://lucide.dev/) for icons
-   **Backend**:
    -   [Cloudflare Workers](https://workers.cloudflare.com/)
    -   [Hono](https://hono.dev/) for routing on the edge
    -   [Cloudflare Durable Objects](https://developers.cloudflare.com/durable-objects/) for stateful storage
-   **Tooling**:
    -   [Vite](https://vitejs.dev/) for frontend tooling
    -   [TypeScript](https://www.typescriptlang.org/)
    -   [Bun](https://bun.sh/) as the runtime and package manager

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   [Bun](https://bun.sh/docs/installation) installed on your machine.
-   A [Cloudflare account](https://dash.cloudflare.com/sign-up).
-   [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) installed and authenticated.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/pixelpop_fm.git
    cd pixelpop_fm
    ```

2.  **Install dependencies:**
    This project uses Bun for package management.
    ```bash
    bun install
    ```

### Running the Development Server

To start the local development server, which includes both the Vite frontend and the Wrangler backend, run:

```bash
bun dev
```

The application will be available at `http://localhost:3000`.

## Project Structure

-   `src/`: Contains the frontend React application source code.
    -   `pages/`: Main application views/pages.
    -   `components/`: Reusable React components.
    -   `store/`: Zustand state management stores.
    -   `lib/`: Utility functions and API client.
-   `worker/`: Contains the Cloudflare Worker backend code, built with Hono.
-   `shared/`: Contains TypeScript types that are shared between the frontend and the backend.

## Development

-   **Linting**: To check for code quality and style issues, run:
    ```bash
    bun lint
    ```

## Deployment

This project is designed for easy deployment to Cloudflare Pages.

1.  **One-Click Deploy:**
    You can deploy this project to your Cloudflare account with a single click.

    [cloudflarebutton]

2.  **Manual Deployment with Wrangler:**
    To deploy the application manually, run the following command:
    ```bash
    bun deploy
    ```
    This script will build the Vite application and deploy it along with the worker to your Cloudflare account using Wrangler.

## License

This project is licensed under the MIT License.