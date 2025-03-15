import React, { FC } from 'react';

const Water: FC = () => {
  return (
    <div className="container">
      <div className="text">WATER EFFECT</div>
      <div className="reflection">WATER EFFECT</div>
      <style jsx>{`
        .container {
          position: relative;
          margin: 50px;
        }
        .text {
          font-size: 4em;
          font-weight: bold;
          color: #1a73e8;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        .reflection {
          position: absolute;
          top: 100%;
          left: 0;
          transform: scaleY(-0.6) skew(30deg);
          opacity: 0.5;
          background: linear-gradient(to bottom,
            rgba(255,255,255,0.3) 0%,
            rgba(255,255,255,0.1) 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          filter: blur(1px);
          animation: ripple 3s infinite;
        }
        @keyframes ripple {
          0%, 100% { transform: scaleY(-0.6) skew(0deg); }
          50% { transform: scaleY(-0.6) skew(5deg); }
        }
      `}</style>
    </div>
  );
};

export default Water;