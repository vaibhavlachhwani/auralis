import { Route, Routes } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import { OverviewPage } from "./pages/OverviewPage";
import { ConnectionsPage } from "./pages/ConnectionsPage";
import { AboutPage } from "./pages/AboutPage";
import { HistoryPage } from "./pages/HistoryPage";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<OverviewPage />} />
        <Route path="/connections" element={<ConnectionsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/history" element={<HistoryPage />} />
      </Route>
    </Routes>
  );
}

export default App;
