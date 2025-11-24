import { useState } from 'react'
import { FiPlay, FiPause, FiSkipBack, FiSkipForward, FiVolume2, FiRepeat, FiShuffle } from 'react-icons/fi'

function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(40)
  const [duration] = useState(215)

  const togglePlay = () => setIsPlaying(!isPlaying)

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const progressPercentage = (currentTime / duration) * 100

  return (
    <div className="px-4 py-2">
      <div className="grid grid-cols-[400px_1fr_300px] items-center gap-4">
        <div className="flex items-center gap-3 overflow-hidden">
          {/* TODO: replace with current track cover from API */}
          <img src="/placeholder-cover.jpg" alt="cover" className="w-10 h-10 rounded object-cover" />
          <div className="min-w-0">
            {/* TODO: bind track title/artist from player state */}
            <div className="text-sm font-medium truncate">Emma Sameth, Jeremy Zucker & WOLFE - Spin With You</div>
            <div className="text-xs text-gray-400">Aminium Music • 2.5M views • 31K likes</div>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-300 hover:text-white">
              <FiShuffle className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-300 hover:text-white">
              <FiSkipBack className="w-5 h-5" />
            </button>
            <button onClick={togglePlay} className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white">
              {isPlaying ? <FiPause className="w-6 h-6" /> : <FiPlay className="w-6 h-6" />}
            </button>
            <button className="p-2 text-gray-300 hover:text-white">
              <FiSkipForward className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-300 hover:text-white">
              <FiRepeat className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-3 w-full max-w-xl mt-2">
            <span className="text-xs text-gray-400">{formatTime(currentTime)}</span>
            <div className="h-1 bg-white/10 rounded w-full">
              <div className="h-1 bg-primary-500 rounded" style={{ width: `${progressPercentage}%` }} />
            </div>
            <span className="text-xs text-gray-400">{formatTime(duration)}</span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <FiVolume2 className="w-5 h-5 text-gray-300" />
          <div className="h-1 bg-white/10 rounded w-24">
            <div className="h-1 bg-white rounded w-3/4" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default MusicPlayer
