import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Routes, Route } from 'react-router-dom';
import SmoothScroll from './components/SmoothScroll';
import Experience from './experience/Experience';
import PromptPage from './components/PromptPage';
export default function App() {
    return (_jsx(SmoothScroll, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Experience, {}) }), _jsx(Route, { path: "/prompt", element: _jsx(PromptPage, {}) })] }) }));
}
