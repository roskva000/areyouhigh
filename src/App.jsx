import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import MasterCollection from './pages/MasterCollection';
import ShaderExperience from './experiences/ShaderExperience';

function App() {
  return (
    <BrowserRouter>
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
          All experiences, including the previously hardcoded ones (fractal, fluid, etc.),
          are now handled by the dynamic routing system. The IDs (e.g., 'fractal', 'abyss')
          match the IDs in src/data/experiences.js
        */}
        <Route path="/experience/:id" element={<ShaderExperience />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
