import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './layouts/Layout';
import Dashboard from './pages/Dashboard';
import Analysis from './pages/Analysis';
import Chat from './pages/Chat';
import JobMatcher from './pages/JobMatcher';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="analysis" element={<Analysis />} />
          <Route path="chat" element={<Chat />} />
          <Route path="match" element={<JobMatcher />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
