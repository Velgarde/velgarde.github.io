import React, { useEffect, useRef, useState } from 'react';
import { Planet } from '../App';

interface AnimatedBulletProps {
    startX: number;
    startY: number;
    angle: number;
    planets: Planet[];
    onPlanetHit: (planet: Planet) => void;
    onBulletOffscreen: () => void;
}

const AnimatedBullet: React.FC<AnimatedBulletProps> = ({
                                                           startX,
                                                           startY,
                                                           angle,
                                                           planets,
                                                           onPlanetHit,
                                                           onBulletOffscreen
                                                       }) => {
    const bulletRef = useRef<SVGCircleElement>(null);
    const [position, setPosition] = useState({ x: startX, y: startY });
    const [isCollided, setIsCollided] = useState(false);
    const speed = 5;

    useEffect(() => {
        if (isCollided) {
            const timeout = setTimeout(() => {
                onBulletOffscreen();
            }, 100);
            return () => clearTimeout(timeout);
        }

        const animationFrame = requestAnimationFrame(() => {
            const newX = position.x + Math.cos(angle) * speed;
            const newY = position.y + Math.sin(angle) * speed;

            for (const planet of planets) {
                const dx = newX - planet.x;
                const dy = newY - planet.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < planet.radius) {
                    setIsCollided(true);
                    onPlanetHit(planet);
                    return;
                }
            }

            if (
                newX < 0 ||
                newX > window.innerWidth ||
                newY < 0 ||
                newY > window.innerHeight
            ) {
                onBulletOffscreen();
                return;
            }

            setPosition({ x: newX, y: newY });
        });

        return () => cancelAnimationFrame(animationFrame);
    }, [position, angle, planets, onPlanetHit, onBulletOffscreen, isCollided]);

    if (isCollided) return null;

    return (
        <circle
            ref={bulletRef}
            cx={position.x}
            cy={position.y}
            r="3"
            fill="white"
        />
    );
};

export default AnimatedBullet;