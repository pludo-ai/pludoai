import React from 'react';
import { useThemeStore } from '../../store/themeStore';

export const BoltBadge: React.FC = () => {
  const { isDark } = useThemeStore();
  
  const badgeUrl = isDark 
    ? 'https://github.com/kickiniteasy/bolt-hackathon-badge/raw/main/src/public/bolt-badge/white_circle_360x360/white_circle_360x360.svg'
    : 'https://github.com/kickiniteasy/bolt-hackathon-badge/raw/main/src/public/bolt-badge/black_circle_360x360/black_circle_360x360.svg';

  return (
    <a
      href="https://bolt.new"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 left-4 z-40 group transition-all duration-300 hover:scale-110"
      title="Built with Bolt"
    >
      <img
        src={badgeUrl}
        alt="Built with Bolt"
        className="w-12 h-12 transition-all duration-300 group-hover:drop-shadow-lg"
      />
    </a>
  );
};