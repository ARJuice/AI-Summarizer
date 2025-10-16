import { useCallback, useEffect, useRef } from 'react';
import { Moon, Sun } from 'lucide-react';
import { flushSync } from 'react-dom';
import { useTheme } from '../contexts/ThemeContext';
import gsap from 'gsap';

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const buttonRef = useRef(null);
  const iconRef = useRef(null);

  const handleToggle = useCallback(async () => {
    if (!buttonRef.current) return;

    // Animate the icon rotation with GSAP for smooth transition
    if (iconRef.current) {
      gsap.to(iconRef.current, {
        rotation: isDarkMode ? 0 : 360,
        scale: 0.8,
        duration: 0.3,
        ease: 'power2.inOut',
        onComplete: () => {
          gsap.to(iconRef.current, {
            scale: 1,
            duration: 0.2,
            ease: 'back.out(1.7)',
          });
        },
      });
    }

    // Check if View Transition API is supported
    if (!document.startViewTransition) {
      toggleTheme();
      return;
    }

    await document.startViewTransition(() => {
      flushSync(() => {
        toggleTheme();
      });
    }).ready;

    const { top, left, width, height } = buttonRef.current.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;
    const maxRadius = Math.hypot(
      Math.max(left, window.innerWidth - left),
      Math.max(top, window.innerHeight - top)
    );

    // Smoother, slower animation with custom easing
    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${maxRadius}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration: 800,
        easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
        pseudoElement: '::view-transition-new(root)',
      }
    );
  }, [toggleTheme, isDarkMode]);

  return (
    <button
      ref={buttonRef}
      onClick={handleToggle}
      className="rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95"
      style={{
        width: '44px',
        height: '44px',
        backgroundColor: 'transparent',
        border: '1px solid',
        borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
        color: isDarkMode ? '#90caf9' : '#ffd700',
        padding: '0',
        margin: '0 8px',
      }}
      aria-label="Toggle theme"
    >
      <div ref={iconRef} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {isDarkMode ? (
          <Moon size={24} strokeWidth={2} style={{ width: '24px', height: '24px', minWidth: '24px', minHeight: '24px' }} />
        ) : (
          <Sun size={24} strokeWidth={2} style={{ width: '24px', height: '24px', minWidth: '24px', minHeight: '24px' }} />
        )}
      </div>
      <span className="sr-only">Toggle theme</span>
    </button>
  );
};

export default ThemeToggle;