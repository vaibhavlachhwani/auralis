# Dashboard - Auralis Frontend

![Auralis Logo](./docs/auralis-logo.svg)

This directory contains the source code for the Auralis dashboard, a modern and responsive web application built with React. It serves as the user interface for visualizing real-time network monitoring data provided by the Auralis backend services.

## Features

-   **Real-Time Data Visualization**: Connects to the `packet-collector-service` via WebSockets to display live network metrics.
-   **Interactive Charts**: Utilizes Recharts to render dynamic and interactive charts for bandwidth usage, protocol distribution, and more.
-   **Detailed Connection Information**: Displays a comprehensive table of active network connections, allowing for easy inspection of traffic.
-   **Responsive Design**: Built with Tailwind CSS, the dashboard is designed to work seamlessly across different screen sizes.
-   **Theming**: Includes a theme toggle for switching between light and dark modes.

## Technologies Used

-   **Framework**: [React](https://reactjs.org/)
-   **Build Tool**: [Vite](https://vitejs.dev/)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components**: [Shadcn/ui](https://ui.shadcn.com/)
-   **Charting**: [Recharts](https://recharts.org/)
-   **WebSocket Communication**: [stompjs](https://stomp-js.github.io/)

## Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or higher recommended)
-   [npm](https://www.npmjs.com/) or a compatible package manager

### Installation and Running

1.  **Navigate to the directory**:
    ```bash
    cd dashboard
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Run the development server**:
    ```bash
    npm run dev
    ```

    This will start the Vite development server, and the dashboard will be available at `http://localhost:5173` by default.

## Component Overview

-   **`App.tsx`**: The root component of the application. It establishes the WebSocket connection and manages the routing between different pages.

-   **`MainLayout.tsx`**: Provides the main layout structure for the application, including the sidebar and header.

-   **`OverviewPage.tsx`**: The main dashboard page that displays the key performance indicators (KPIs) and charts.

-   **`ConnectionsPage.tsx`**: Displays a detailed table of all active network connections.

-   **`KpiCardsSection.tsx`**: A component that displays a series of `KpiCard` components, each showing a single metric (e.g., total bandwidth, packets per second).

-   **`ChartArea.tsx`**: A container for the various charts used to visualize the network data.

-   **`DataTable.tsx`**: A reusable component for displaying tabular data, used here to show the list of connections.

-   **Custom Hooks**: The application uses custom hooks like `useDashboardData` and `useConnectionData` to encapsulate the logic for subscribing to WebSocket topics and managing the data.

## Project Structure

```
/dashboard
├── public/                 # Static assets
├── src/
│   ├── assets/             # Images and other static assets
│   ├── components/         # Reusable React components
│   │   ├── graphs/         # Chart components for data visualization
│   │   ├── site-header/    # Components for the main site header
│   │   └── ui/             # UI primitives and components from Shadcn/ui
│   ├── config/             # Application configuration
│   ├── hooks/              # Custom React hooks
│   ├── layout/             # Layout components (e.g., MainLayout)
│   ├── lib/                # Utility functions
│   ├── pages/              # Top-level page components
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Utility functions
├── index.html              # Main HTML entry point
├── package.json            # Project metadata and dependencies
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite configuration
```

## Building for Production

To create a production-ready build of the dashboard, you can run the following command:

```bash
npm run build
```

This will generate a `dist` directory containing the optimized and minified static assets for deployment.
