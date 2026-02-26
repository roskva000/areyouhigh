import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import FractalExperience from './experiences/FractalExperience';
import FluidExperience from './experiences/FluidExperience';
import ParticlesExperience from './experiences/ParticlesExperience';
import TunnelExperience from './experiences/TunnelExperience';
import PlexusExperience from './experiences/PlexusExperience';
import MandalaExperience from './experiences/MandalaExperience';
import AbyssExperience from './experiences/AbyssExperience';
import ShaderExperience from './experiences/ShaderExperience';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gallery" element={<Gallery />} />

        {/* Fixed Experiences */}
        <Route path="/experience/fractal" element={<FractalExperience />} />
        <Route path="/experience/fluid" element={<FluidExperience />} />
        <Route path="/experience/particles" element={<ParticlesExperience />} />
        <Route path="/experience/tunnel" element={<TunnelExperience />} />
        <Route path="/experience/plexus" element={<PlexusExperience />} />
        <Route path="/experience/mandala" element={<MandalaExperience />} />
        <Route path="/experience/abyss" element={<AbyssExperience />} />

        {/* Dynamic Shader Experiences for the remaining 23 */}
        <Route path="/experience/:id" element={<ShaderExperience />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
