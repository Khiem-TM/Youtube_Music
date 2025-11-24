import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Library from "./pages/Library";
import Search from "./pages/Search";
import Layout from "./components/layout/Layout";

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
            <Route path="/search" element={<Search />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
