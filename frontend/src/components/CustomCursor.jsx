import { useState, useEffect } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

const CustomCursor = () => {
  const [isHovering, setIsHovering] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 30, stiffness: 200 };
  const x = useSpring(cursorX, springConfig);
  const y = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseOver = (e) => {
      if (
        e.target.tagName === 'BUTTON' || 
        e.target.tagName === 'A' || 
        e.target.closest('button') || 
        e.target.closest('a') ||
        e.target.getAttribute('role') === 'button'
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [cursorX, cursorY]);

  return (
    <>
      <style>
        {`
          body {
            cursor: none !important;
          }
          button, a, [role="button"], input, textarea {
            cursor: none !important;
          }
        `}
      </style>
      
      {/* Compass Cursor Container */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          x,
          y,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          animate={{
            rotate: isHovering ? 45 : 0,
            scale: isHovering ? 1.2 : 1,
          }}
          transition={{ type: 'spring', damping: 20, stiffness: 150 }}
          className="relative w-10 h-10 flex items-center justify-center"
        >
          {/* Compass Arrows (North, South, East, West) */}
          {[0, 90, 180, 270].map((rotation, i) => (
            <motion.div
              key={rotation}
              className="absolute"
              style={{ rotate: rotation }}
              animate={{
                y: isHovering ? -14 : -10,
              }}
            >
              {/* Arrow Head (Vintage Triangle) */}
              <div 
                className="w-0 h-0 border-l-[4px] border-r-[4px] border-b-[8px] border-l-transparent border-r-transparent"
                style={{ borderBottomColor: i % 2 === 0 ? '#1a1a1a' : '#c4a484' }} // Dark and muted gold/cream
              />
            </motion.div>
          ))}

          {/* Central Core */}
          <motion.div 
            className="w-2 h-2 rounded-full bg-[#1a1a1a] border border-[#f4f1ea] shadow-sm z-10"
            animate={{
              scale: isHovering ? 0.5 : 1,
              backgroundColor: isHovering ? '#c4a484' : '#1a1a1a',
            }}
          />

          {/* Decorative Outer Ring */}
          <motion.div 
            className="absolute w-6 h-6 rounded-full border border-[#1a1a1a]/10"
            animate={{
              scale: isHovering ? 1.5 : 1,
              opacity: isHovering ? 0.5 : 0.2,
            }}
          />
        </motion.div>
      </motion.div>

      {/* Trailing Soft Glow */}
      <motion.div
        className="fixed top-0 left-0 w-20 h-20 bg-accent/5 rounded-full pointer-events-none z-[9998] blur-3xl"
        style={{
          x: useSpring(cursorX, { damping: 50, stiffness: 80 }),
          y: useSpring(cursorY, { damping: 50, stiffness: 80 }),
          translateX: '-50%',
          translateY: '-50%',
        }}
      />
    </>
  );
};

export default CustomCursor;
