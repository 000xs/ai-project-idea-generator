// src/components/BeatLoader.jsx
import React from 'react';

const BeatLoader = ({ color = "#5f7edb", size = 12, margin = 4 }) => {
  const dotStyle = {
    display: 'inline-block',
    backgroundColor: color,
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: '50%',
    margin: `0 ${margin}px`,
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div 
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          padding: '20px 0',
        }}
      >
        <div 
          style={{
            animation: 'beat 1.4s ease-in-out 0s infinite both',
            ...dotStyle,
          }}
        />
        <div 
          style={{
            animation: 'beat 1.4s ease-in-out 0.2s infinite both',
            ...dotStyle,
          }}
        />
        <div 
          style={{
            animation: 'beat 1.4s ease-in-out 0.4s infinite both',
            ...dotStyle,
          }}
        />
      </div>
    </div>
  );
};

export default BeatLoader;