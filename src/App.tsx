import './App.css'
import ColorDemo from './ColorDemo'; // 引入 ColorDemo 组件

function App() {

  return (
    <>
     {/* 移除原有 Vite + React 示例内容 */}
     {/* <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </> */}

      {/* 渲染 ColorDemo 组件 */}
      <ColorDemo />
    </>
  )
}

export default App
