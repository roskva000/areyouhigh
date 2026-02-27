import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import MasterCollection from './pages/MasterCollection';
import ShaderExperience from './experiences/ShaderExperience';
import GlobalChat from './components/GlobalChat';

function App() {
  return (
    <BrowserRouter>
      {/* Global Elements */}
      <GlobalChat />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gallery" element={<Gallery />} />

        {/*
           Master Collection Route
           Displays all experiences belonging to a specific master shader group
        */}
        <Route path="/gallery/:masterId" element={<MasterCollection />} />

        {/*
          UNIFIED EXPERIENCE ROUTING
        */}
        <Route path="/experience/:id" element={<ShaderExperience />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
