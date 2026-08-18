import { Routes, Route } from 'react-router-dom'
import SmoothScroll from './components/SmoothScroll'
import Experience from './experience/Experience'
import PromptPage from './components/PromptPage'

export default function App() {
  return (
    <SmoothScroll>
      <Routes>
        <Route path="/" element={<Experience />} />
        <Route path="/prompt" element={<PromptPage />} />
      </Routes>
    </SmoothScroll>
  )
}
