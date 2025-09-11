import { Route, Routes } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import { OverviewPage } from "./pages/OverviewPage";
import { ConnectionsPage } from "./pages/ConnectionsPage";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<OverviewPage />} />
        <Route path="/connections" element={<ConnectionsPage />} />
        {/* Other pages go here */}
      </Route>
    </Routes>
  );
}

export default App;
