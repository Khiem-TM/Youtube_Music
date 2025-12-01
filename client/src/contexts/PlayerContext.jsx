import { createContext, useContext, useMemo, useReducer } from "react";
import axios from "axios";

const BASE_URL = "https://youtube-music.f8team.dev/api";

const PlayerContext = createContext(null);

const initialState = {
  isVisible: false,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  track: null,
  queue: [],
  index: -1,
  volume: 1,
  repeatMode: "none", // none | all | one
  shuffle: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "PLAY_TRACK": {
      const { track, queue } = action.payload;
      const q = Array.isArray(queue) ? queue : [track].filter(Boolean);
      const idx = q.findIndex((t) => (t._id || t.id || t.slug) === (track._id || track.id || track.slug));
      return {
        ...state,
        isVisible: true,
        isPlaying: true,
        currentTime: 0,
        duration: track.duration || 0,
        track,
        queue: q,
        index: idx >= 0 ? idx : 0,
      };
    }
    case "TOGGLE_PLAY":
      return { ...state, isPlaying: !state.isPlaying, isVisible: true };
    case "STOP":
      return { ...state, isPlaying: false, isVisible: false, track: null, index: -1, queue: [] };
    case "NEXT": {
      if (state.repeatMode === "one") {
        const track = state.queue[state.index] || state.track;
        return { ...state, track, isPlaying: true };
      }
      let nextIndex = state.index + 1;
      if (state.shuffle) {
        const len = state.queue.length;
        if (len > 1) {
          let r = Math.floor(Math.random() * len);
          if (r === state.index) r = (r + 1) % len;
          nextIndex = r;
        }
      }
      if (nextIndex >= state.queue.length) {
        if (state.repeatMode === "all") nextIndex = 0; else return { ...state, isPlaying: false };
      }
      const track = state.queue[nextIndex];
      return { ...state, index: nextIndex, track, isPlaying: true, currentTime: 0, duration: track?.duration || 0 };
    }
    case "PREV": {
      if (state.repeatMode === "one") {
        const track = state.queue[state.index] || state.track;
        return { ...state, track, isPlaying: true };
      }
      let prevIndex = state.index - 1;
      if (prevIndex < 0) {
        if (state.repeatMode === "all") prevIndex = Math.max(state.queue.length - 1, 0); else return state;
      }
      const track = state.queue[prevIndex];
      return { ...state, index: prevIndex, track, isPlaying: true, currentTime: 0, duration: track?.duration || 0 };
    }
    case "SET_PROGRESS":
      return { ...state, currentTime: action.payload };
    case "SET_VOLUME":
      return { ...state, volume: Math.max(0, Math.min(1, action.payload)) };
    case "CYCLE_REPEAT": {
      const order = ["none", "all", "one"];
      const i = order.indexOf(state.repeatMode);
      const next = order[(i + 1) % order.length];
      return { ...state, repeatMode: next };
    }
    case "TOGGLE_SHUFFLE":
      return { ...state, shuffle: !state.shuffle };
    default:
      return state;
  }
}

export function PlayerProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const recordPlayEvent = async (track) => {
    try {
      const token = localStorage.getItem("token");
      if (!token || !track) return;
      const id = track._id || track.id || track.slug;
      const type = track.type || "song";
      const body = { playedAt: new Date().toISOString() };
      if (type === "playlist") body.playlistId = id;
      else if (type === "album") body.albumId = id;
      else body.songId = id;
      await axios.post(`${BASE_URL}/events/play`, body, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (_) {}
  };

  const actions = useMemo(() => ({
    playTrack: (track, queue) => {
      dispatch({ type: "PLAY_TRACK", payload: { track, queue } });
      recordPlayEvent(track);
    },
    togglePlay: () => dispatch({ type: "TOGGLE_PLAY" }),
    stop: () => dispatch({ type: "STOP" }),
    next: () => dispatch({ type: "NEXT" }),
    prev: () => dispatch({ type: "PREV" }),
    setProgress: (time) => dispatch({ type: "SET_PROGRESS", payload: time }),
    setVolume: (v) => dispatch({ type: "SET_VOLUME", payload: v }),
    cycleRepeat: () => dispatch({ type: "CYCLE_REPEAT" }),
    toggleShuffle: () => dispatch({ type: "TOGGLE_SHUFFLE" }),
  }), []);

  return (
    <PlayerContext.Provider value={{ state, actions }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used within PlayerProvider");
  return ctx;
}
