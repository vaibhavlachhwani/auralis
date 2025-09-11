import { Route, Routes } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import { OverviewPage } from "./pages/OverviewPage";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<OverviewPage />} />
        {/* Other pages go here */}
      </Route>
    </Routes>
  );
}

export default App;
