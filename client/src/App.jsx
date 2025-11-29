import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Library from "./pages/Library";
import Upgrade from "./pages/Upgrade";
import Charts from "./pages/Charts";
import Layout from "./components/layout/Layout";
import RankingList from "./pages/explorePage/RankingList";
import NewReleased from "./pages/explorePage/NewRelease";
import RealeasedDetails from "./pages/explorePage/ReleasedDetails";
import MoreGenre from "./pages/explorePage/MoreGenre";
import PlaylistDetails from "./pages/details/PlaylistDetails";
import AlbumDetails from "./pages/details/AlbumDetails";
import VideoDetails from "./pages/details/VideoDetails";
import SongDetails from "./pages/details/SongDetails";
import { PlayerProvider } from "./contexts/PlayerContext";
import CateDetail from "./pages/explorePage/moreGenreDetail/CateDetail.jsx";
import LineDetail from "./pages/explorePage/moreGenreDetail/LineDetail.jsx";

function App() {
  return (
    <AuthProvider>
      <PlayerProvider>
        <Router>
          <Layout>
          {/* Routing cơ bản */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/library" element={<Library />} />
            <Route path="/upgrade" element={<Upgrade />} />
            {/* explore page */}
            <Route path="/explore/charts" element={<Charts />} />
            <Route path="/explore/charts/playlist" element={<RankingList />} />
            <Route path="/explore/released" element={<NewReleased />} />
            <Route
              path="/explore/charts/videoCharts"
              element={<RealeasedDetails />}
            />
            <Route path="/explore/moreGenre" element={<MoreGenre />} />
            <Route path="/explore/moreGenre/category/:slug" element={<CateDetail />} />
            <Route path="/explore/moreGenre/line/:slug" element={<LineDetail />} />
            <Route path="/playlists/details/:slug" element={<PlaylistDetails />} />
            <Route path="/albums/details/:slug" element={<AlbumDetails />} />
            <Route path="/videos/details/:id" element={<VideoDetails />} />
            <Route path="/songs/details/:id" element={<SongDetails />} />
          </Routes>
          </Layout>
        </Router>
      </PlayerProvider>
    </AuthProvider>
  );
}

export default App;
