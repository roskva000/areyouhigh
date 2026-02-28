import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <div className="w-screen h-screen bg-black text-white flex flex-col items-center justify-center font-mono text-center px-4">
            <h1 className="text-4xl text-accent mb-4">404</h1>
            <p className="text-white/60 mb-8">Signal lost. The endpoint you are looking for does not exist.</p>
            <Link
                to="/"
                className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-accent/50 rounded-full transition-all duration-300 text-sm tracking-widest uppercase"
            >
                Return to Origin
            </Link>
        </div>
    );
}
