import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import FractalExperience from './experiences/FractalExperience';
import FluidExperience from './experiences/FluidExperience';
import ParticlesExperience from './experiences/ParticlesExperience';
import TunnelExperience from './experiences/TunnelExperience';
import PlexusExperience from './experiences/PlexusExperience';
import MandalaExperience from './experiences/MandalaExperience';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/experience/fractal" element={<FractalExperience />} />
        <Route path="/experience/fluid" element={<FluidExperience />} />
        <Route path="/experience/particles" element={<ParticlesExperience />} />
        <Route path="/experience/tunnel" element={<TunnelExperience />} />
        <Route path="/experience/plexus" element={<PlexusExperience />} />
        <Route path="/experience/mandala" element={<MandalaExperience />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
