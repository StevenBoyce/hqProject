import React from 'react';
import * as Icons from '../icons';

export type IconName = keyof typeof Icons;

interface IconProps {
  name: IconName;
  className?: string;
  size?: number;
  color?: string;
  onClick?: () => void;
}

export const Icon: React.FC<IconProps> = ({ 
  name, 
  className = '', 
  size = 24, 
  color = 'currentColor',
  onClick 
}) => {
  const IconComponent = Icons[name];
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  return (
    <IconComponent
      className={className}
      size={size}
      color={color}
      onClick={onClick}
    />
  );
}; 