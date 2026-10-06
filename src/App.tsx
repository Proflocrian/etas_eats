function App() {
  return (
    <main
      className="flex min-h-full flex-col items-center justify-center px-6 text-center"
      style={{
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        paddingLeft: 'max(1.5rem, env(safe-area-inset-left))',
        paddingRight: 'max(1.5rem, env(safe-area-inset-right))',
      }}
    >
      <div className="flex flex-col items-center gap-4">
        <span className="text-6xl" role="img" aria-label="Fork and knife">
          🍴
        </span>
        <h1 className="text-3xl font-bold text-[#e5556e]">Eta's Eats</h1>
        <p className="max-w-xs text-base text-neutral-600">
          Hello, world. The app shell is running.
        </p>
      </div>
    </main>
  )
}

export default App
