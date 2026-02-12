import { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';

const SectionDivider = ({ color = '#F97316' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const dividerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (dividerRef.current) {
      observer.observe(dividerRef.current);
    }

    return () => {
      if (dividerRef.current) {
        observer.unobserve(dividerRef.current);
      }
    };
  }, []);

  return (
    <Box
      ref={dividerRef}
      sx={{
        height: '80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          width: '60%',
          height: '1px',
          background: `linear-gradient(90deg, transparent 0%, ${color} 50%, transparent 100%)`,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'scaleX(1)' : 'scaleX(0)',
          transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          width: '60%',
          height: '40px',
          background: `radial-gradient(ellipse at center, ${color}15 0%, transparent 70%)`,
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 1s cubic-bezier(0.4, 0, 0.2, 1) 0.2s',
        }}
      />
    </Box>
  );
};

export default SectionDivider;
