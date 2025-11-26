import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Library from "./pages/Library";
import Upgrade from "./pages/Upgrade";
import Charts from "./pages/Charts";
import Layout from "./components/layout/Layout";
import RankingList from "./pages/explorePage/RankingList";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          {/* Routing cơ bản */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/library" element={<Library />} />
            <Route path="/upgrade" element={<Upgrade />} />
            <Route path="/explore/charts" element={<Charts />} />
            <Route path="/explore/charts/playlist" element={<RankingList />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
