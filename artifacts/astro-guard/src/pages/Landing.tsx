import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import earth from '@assets/image_search/earth-apollo17.jpg';

export default function Landing() {
  return (
    <main className="landing" data-testid="page-landing">
      <div className="stars" aria-hidden="true" />
      <motion.img src={earth} alt="Earth photographed from Apollo 17, NASA image AS17-148-22727"
        className="earth" data-testid="img-earth"
        initial={{ opacity: 0, scale: 1.12, y: 40 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 2.2, ease: [0.16, 0.8, 0.2, 1] }} />
      <div className="landing-copy">
        <div className="landing-mark">
          <span className="brand-orb" aria-hidden="true" /> Astro-Guard
        </div>
        <h1 data-testid="text-landing-title">
          Earth is behind you.<br /><em>Your body comes along.</em>
        </h1>
        <p>
          Astro-Guard shows how spaceflight touches the heart, lungs, brain, bones and immune system, on a see-through body you can turn and explore.
        </p>
        <div>
          <Link href="/dashboard" className="start-btn" data-testid="button-start">
            <span>Start</span><ArrowRight size={18} />
          </Link>
        </div>
        <p className="landing-fine" data-testid="text-landing-disclaimer">
          Local demo with synthetic values · not NASA readings · not medical advice · Earth: NASA Apollo 17
        </p>
      </div>
    </main>
  );
}
