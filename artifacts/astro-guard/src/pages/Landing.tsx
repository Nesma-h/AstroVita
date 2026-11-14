import { useState } from 'react';
import { Link } from 'wouter';
import { ArrowRight } from 'lucide-react';
import EarthHero from '@/components/mascot/EarthHero';
import AstronautStage from '@/components/mascot/AstronautStage';

type Hero = 'astronaut' | 'earth';

export default function Landing() {
  const [hero, setHero] = useState<Hero>('astronaut');
  return (
    <main className={`landing hero-${hero}`} data-testid="page-landing">
      <div className="stars" aria-hidden="true" />
      {hero === 'earth' ? <EarthHero /> : <AstronautStage onShowEarth={() => setHero('earth')} />}
      <div className="hero-switch" role="group" aria-label="Hero visual">
        {(['astronaut', 'earth'] as const).map((h) => (
          <button key={h} type="button" aria-pressed={hero === h} onClick={() => setHero(h)} data-testid={`button-hero-${h}`}>
            {h === 'astronaut' ? 'Astronaut' : 'Earth'}
          </button>
        ))}
      </div>
      <div className="landing-copy">
        <div className="landing-mark">
          <img src={`${import.meta.env.BASE_URL}astro-vita-icon.png`} className="brand-icon" alt="" aria-hidden="true" width={30} height={30} data-testid="img-brand-icon" /> AstroVita
        </div>
        <h1 data-testid="text-landing-title">
          Earth is behind you.<br /><em>Your body comes along.</em>
        </h1>
        <p>
          AstroVita shows how spaceflight touches the heart, lungs, brain, bones and immune system, on a see-through body you can turn and explore.
        </p>
        <div>
          <Link href="/dashboard" className="start-btn" data-testid="button-start">
            <span>Start</span><ArrowRight size={18} />
          </Link>
        </div>
        <p className="landing-fine" data-testid="text-landing-disclaimer">
          Local demo with synthetic values · not NASA readings · not medical advice
          {hero === 'earth' ? ' · Earth: NASA Apollo 17' : ' · Astronaut: original 3D illustration'}
        </p>
      </div>
    </main>
  );
}
