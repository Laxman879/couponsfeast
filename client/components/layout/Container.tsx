'use client';
import React, { memo } from 'react';
import { Container as MuiContainer } from '@mui/material';

interface ContainerProps {
  children: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const Container: React.FC<ContainerProps> = ({ children, maxWidth = 'xl' }) => {
  return (
    <MuiContainer maxWidth={maxWidth} className="py-8">
      {children}
    </MuiContainer>
  );
};

export default memo(Container);
