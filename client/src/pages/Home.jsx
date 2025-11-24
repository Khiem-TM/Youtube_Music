function Home() {
  // TODO: fetch "Up Next" from API
  const upNext = [
    { title: 'Emma Sameth, Jeremy Zucker & WOLFE - Spin With You', channel: 'Aminium Music', duration: '3:35' },
    { title: 'Griffin Stoller - Liars', channel: 'MrSuicideSheep', duration: '3:26' },
    { title: 'eaJ x keshi - pillows', channel: 'eaJ', duration: '3:56' },
    { title: '[THAISUB] Other half', channel: 'A. lamp', duration: '3:36' },
    { title: 'Take Me', channel: 'Miso', duration: '4:16' },
    { title: 'Floating (filous remix)', channel: 'Alina Baraz', duration: '3:22' },
    { title: 'CHSKA - i know you know', channel: 'CHSKA', duration: '4:29' },
    { title: 'Through With You', channel: 'WOLFE', duration: '3:47' },
  ]

  return (
    <div className="flex h-full px-4 pt-4">
      <div className="flex-1 flex items-start justify-center">
        <div className="w-full max-w-3xl aspect-video bg-black rounded-lg overflow-hidden border border-gray-700">
          {/* TODO: replace with video/cover from current track */}
          <img src="/placeholder-cover.jpg" alt="video" className="w-full h-full object-cover opacity-90" />
        </div>
      </div>

      <aside className="w-[360px] pl-6 hidden lg:block">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs text-gray-400">Playing from Emma Sameth, Jeremy Zucker & WOLFE - Spin With You</div>
          <button className="px-3 py-1 rounded-full bg-white text-black text-sm">Save</button>
        </div>

        <div className="flex gap-2 mb-3">
          {['All','Familiar','Discover','Popular','Deep cuts'].map((f) => (
            <button key={f} className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-sm text-gray-200">{f}</button>
          ))}
        </div>

        <div className="space-y-1">
          {upNext.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/10">
              <div className="min-w-0">
                <div className="text-sm text-white truncate">{item.title}</div>
                <div className="text-xs text-gray-400 truncate">{item.channel}</div>
              </div>
              <div className="text-xs text-gray-400 ml-3">{item.duration}</div>
            </div>
          ))}
        </div>
      </aside>
    </div>
  )
}

export default Home
