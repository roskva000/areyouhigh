# uHigh — Visual Feast Portals

uHigh is an immersive, shader-driven web application designed to provide a transcendent visual experience. It features a curated collection of high-performance fragment and vertex shaders, categorized into various algorithmic domains ranging from organic fractals to glitchy digital nightmares.

## ✨ Features

- **🌀 Immersive Portals**: Explore over 100+ unique shader experiences.
- **💬 Global Pulse Chat**: Real-time interaction with other explorers via Supabase integration.
- **🎨 Interactive Parameters**: Fine-tune shader complexity, flow, and intensity in real-time.
- **📂 Master Collections**: Deep dives into specific shader families (Fractals, Fluid Dynamics, etc.).
- **🎭 Responsive Design**: Optimized for premium viewing across all modern devices.
- **⚡ High Performance**: Built with Vite and React 19 for instantaneous transitions and HMR.

## 🛠️ Technology Stack

- **Frontend**: [React 19](https://react.dev/), [Vite](https://vitejs.dev/)
- **Animation**: [GSAP](https://greensock.com/gsap/) with [`@gsap/react`](https://www.npmjs.com/package/@gsap/react)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/), [PostCSS](https://postcss.org/)
- **Backend/Real-time**: [Supabase](https://supabase.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Routing**: [React Router v7](https://reactrouter.com/)

## 📂 Project Structure

- `src/components/`: Core UI blocks (Navbar, Hero, GlobalChat, etc.)
- `src/experiences/`: The main shader engine and interactive lobby.
- `src/pages/`: Main application views (Home, Gallery, MasterCollection).
- `src/data/`: The heart of the content—`experiences.js` and `shaders.js`.
- `src/lib/`: External service configurations (Supabase).
- `src/hooks/`: Custom React hooks for state and interaction.

## 🚀 Getting Started

### Prerequisites

- Node.js (Latest LTS recommended)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone [repository-url]
   cd areyouhigh
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env` file based on `.env.example` and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run development server:**
   ```bash
   npm run dev
   ```

5. **Build for production:**
   ```bash
   npm run build
   ```

## 🌌 Experience Categories

- **Fractal**: Mathematical infinities and recursive beauty.
- **Organic**: Biomechanical textures and cellular growth.
- **Physics**: Space-time warps, black holes, and gravity waves.
- **Fluid**: Plasma, noise mountains, and liquid chrome.
- **Light**: Prism refractions and digital auroras.
- **Industrial**: Brutalist algorithms and mechanical DNA.
- **Glitch**: Databend flows and digital nightmares.

---

*“Dive into the infinite depth. Experience the geometry of a limitless dimension.”*
