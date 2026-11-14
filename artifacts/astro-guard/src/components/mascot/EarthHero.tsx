import { motion } from 'framer-motion';
import earth from '@assets/image_search/earth-apollo17.jpg';

/** Original Earth hero, preserved unchanged for comparison / revert. */
export default function EarthHero() {
  return (
    <motion.img src={earth} alt="Earth photographed from Apollo 17, NASA image AS17-148-22727"
      className="earth" data-testid="img-earth"
      initial={{ opacity: 0, scale: 1.12, y: 40 }} animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 2.2, ease: [0.16, 0.8, 0.2, 1] }} />
  );
}
