function SiteHeader() {
  return (
    <header className="pointer-events-none fixed top-0 right-0 left-0 z-10 flex items-start justify-between p-6">
      <div className="flex flex-col">
        <span className="font-mono text-xs tracking-[0.3em] text-zinc-400 uppercase">
          Erick Cuá
        </span>
        <span className="font-mono text-xs tracking-[0.3em] text-[#3B70B0] uppercase">
          ckncm
        </span>
      </div>
      <span className="font-mono text-xs tracking-[0.3em] text-zinc-600 uppercase">
        v0.1 — dev
      </span>
    </header>
  )
}

export default SiteHeader
