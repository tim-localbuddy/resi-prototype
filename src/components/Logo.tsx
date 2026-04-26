import React from 'react';

type LogoVariant = 'default' | 'footer' | 'sidebar' | 'auth';

interface LogoProps {
  variant?: LogoVariant;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export function Logo({ variant = 'default', onClick, className = '', style, children }: LogoProps) {
  const isDarkBg = variant === 'footer' || variant === 'sidebar';
  
  const width = variant === 'auth' ? 38 : variant === 'footer' || variant === 'sidebar' ? 26 : 34;
  const height = variant === 'auth' ? 36 : variant === 'footer' || variant === 'sidebar' ? 25 : 32;

  const color1 = variant === 'footer' ? 'rgba(255,255,255,0.2)' : variant === 'sidebar' ? 'rgba(255,255,255,0.25)' : '#1b2d4f';
  const color2 = variant === 'footer' ? 'rgba(255,255,255,0.35)' : variant === 'sidebar' ? 'rgba(255,255,255,0.45)' : '#2e4575';
  const color3 = isDarkBg ? '#4fb8e8' : '#3698cf';
  const color4 = isDarkBg ? '#8dd9f5' : '#72c4e4';

  const svg = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 46 44" width={width} height={height} style={{flexShrink:0}}>
      <rect x="0" y="4" width="26" height="40" fill={color1}/>
      <rect x="3" y="7" width="5" height="4" fill={color2}/><rect x="10" y="7" width="5" height="4" fill={color2}/><rect x="17" y="7" width="5" height="4" fill={color2}/>
      <rect x="3" y="14" width="5" height="4" fill={color2}/><rect x="10" y="14" width="5" height="4" fill={color2}/><rect x="17" y="14" width="5" height="4" fill={color2}/>
      <rect x="3" y="21" width="5" height="4" fill={color2}/><rect x="10" y="21" width="5" height="4" fill={color2}/><rect x="17" y="21" width="5" height="4" fill={color2}/>
      <rect x="3" y="28" width="5" height="4" fill={color2}/><rect x="10" y="28" width="5" height="4" fill={color2}/><rect x="17" y="28" width="5" height="4" fill={color2}/>
      <rect x="19" y="16" width="27" height="28" fill={color3}/>
      <rect x="22" y="20" width="6" height="5" fill={color4}/><rect x="31" y="20" width="6" height="5" fill={color4}/>
      <rect x="22" y="28" width="6" height="5" fill={color4}/><rect x="31" y="28" width="6" height="5" fill={color4}/>
      <rect x="22" y="36" width="6" height="5" fill={color4}/><rect x="31" y="36" width="6" height="5" fill={color4}/>
    </svg>
  );

  if (variant === 'auth') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', ...style }} className={className} onClick={onClick}>
        {svg}
        <div>
          <div className="bofast-wordmark">Bofast</div>
          <div style={{ fontSize: '10px', color: '#94A3B8', letterSpacing: '.3px' }}>resident transparency platform</div>
        </div>
        {children}
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div className={`logo-wrap ${className}`} style={style} onClick={onClick}>
        {svg}
        <span style={{ fontWeight: 700, fontSize: '15px', color: '#64748B' }}>Bofast</span>
        {children}
      </div>
    );
  }

  if (variant === 'sidebar') {
    return (
      <div className={`sb-logo ${className}`} style={style} onClick={onClick}>
        {svg}
        <span className="sb-logo-txt">Bofast</span>
        {children}
      </div>
    );
  }

  // Default
  return (
    <div className={`logo-wrap ${className}`} style={style} onClick={onClick}>
      {svg}
      <span className="bofast-wordmark">Bofast</span>
      {children}
    </div>
  );
}
