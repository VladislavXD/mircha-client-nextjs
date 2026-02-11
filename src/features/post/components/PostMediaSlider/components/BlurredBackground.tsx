import React from 'react';

type Props = {
  src: string;
  type: 'image' | 'video';
  opacity?: string;
};

export const BlurredBackground: React.FC<Props> = ({ 
  src, 
  type, 
  opacity = 'opacity-50' 
}) => {
  const commonClasses = `absolute inset-0 w-full h-full object-cover blur-3xl ${opacity} scale-110`;
  
  if (type === 'image') {
    return (
      <img
        src={src}
        alt="Background"
        className={commonClasses}
        style={{ pointerEvents: 'none' }}
      />
    );
  }
  
  return (
    <video
      src={src}
      className={commonClasses}
      muted
      loop
      playsInline
      style={{ pointerEvents: 'none' }}
    />
  );
};
