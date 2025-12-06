'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const ParticleEffect = ({ trigger, type = 'success' }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (trigger) {
      const colors = {
        success: ['#10b981', '#34d399', '#6ee7b7'],
        combo: ['#a855f7', '#c084fc', '#d8b4fe'],
        streak: ['#f97316', '#fb923c', '#fdba74'],
        match: ['#3b82f6', '#60a5fa', '#93c5fd']
      };

      const newParticles = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        color: colors[type]?.[Math.floor(Math.random() * colors[type].length)] || colors.success[0],
        delay: i * 0.05,
      }));

      setParticles(newParticles);

      // Clear particles after animation
      setTimeout(() => setParticles([]), 2000);
    }
  }, [trigger, type]);

  if (particles.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-2 h-2 rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            backgroundColor: particle.color,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
            x: (Math.random() - 0.5) * 200,
            y: (Math.random() - 0.5) * 200,
          }}
          transition={{
            duration: 1.5,
            delay: particle.delay,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
};

export default ParticleEffect;
