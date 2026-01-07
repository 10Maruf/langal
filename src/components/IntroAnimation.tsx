import React, { useEffect, useState } from 'react';

interface IntroAnimationProps {
    onComplete: () => void;
    duration?: number; // Duration in milliseconds
}

const IntroAnimation: React.FC<IntroAnimationProps> = ({
    onComplete,
    duration = 3000
}) => {
    const [isVisible, setIsVisible] = useState(true);
    const [animationPhase, setAnimationPhase] = useState(0);

    useEffect(() => {
        // Phase 1: Logo fade in and scale
        const phase1Timer = setTimeout(() => {
            setAnimationPhase(1);
        }, 300);

        // Phase 2: Text appear
        const phase2Timer = setTimeout(() => {
            setAnimationPhase(2);
        }, 1000);

        // Phase 3: Complete animation and fade out
        const completeTimer = setTimeout(() => {
            setAnimationPhase(3);
            setTimeout(() => {
                setIsVisible(false);
                onComplete();
            }, 500);
        }, duration - 500);

        return () => {
            clearTimeout(phase1Timer);
            clearTimeout(phase2Timer);
            clearTimeout(completeTimer);
        };
    }, [onComplete, duration]);

    if (!isVisible) return null;

    return (
        <div className={`
      fixed inset-0 z-[9999] flex items-center justify-center
      bg-white dark:bg-gray-900
      transition-opacity duration-500 intro-container
      ${animationPhase === 3 ? 'opacity-0' : 'opacity-100'}
    `}>
            {/* Gradient overlay for visual appeal */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20" />

            {/* Background overlay with subtle pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary)/0.15),transparent_50%)]" />

            {/* Animated background particles */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary/20 rounded-full animate-ping delay-1000" />
                <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-accent/30 rounded-full animate-ping delay-2000" />
                <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-primary/15 rounded-full animate-ping delay-1500" />
            </div>

            <div className="relative flex flex-col items-center justify-center text-center px-4 sm:px-6 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
                {/* Logo Animation */}
                <div className={`
          relative mb-4 sm:mb-6 md:mb-8
          transition-all duration-1000 ease-out
          ${animationPhase >= 1
                        ? 'opacity-100 scale-100 translate-y-0'
                        : 'opacity-0 scale-75 translate-y-8'
                    }
        `}>
                    {/* Multiple animated rings around logo */}
                    <div className={`
            absolute inset-0 rounded-full border-2 border-primary/30 intro-pulse-ring
            transition-all duration-2000 ease-out
            ${animationPhase >= 1 ? 'opacity-100' : 'opacity-0'}
          `} />
                    <div className={`
            absolute inset-0 rounded-full border border-accent/20 intro-pulse-ring
            transition-all duration-2000 ease-out delay-300
            ${animationPhase >= 1 ? 'opacity-100' : 'opacity-0'}
          `} style={{ animationDelay: '0.5s' }} />

                    {/* Logo with glow effect */}
                    <div className={`
            ${animationPhase >= 1 ? 'intro-float intro-glow' : ''}
          `}>
                        <img
                            src="/img/Asset 3.png"
                            alt="লাঙল লোগো"
                            className={`
                w-16 h-16 xs:w-18 xs:h-18 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 xl:w-32 xl:h-32
                object-contain drop-shadow-lg
                transition-transform duration-1000 ease-out
                ${animationPhase >= 1 ? 'rotate-0' : 'rotate-12'}
              `}
                        />
                    </div>
                </div>

                {/* App Name */}
                <div className={`
          mb-3 sm:mb-4 transition-all duration-800 delay-300 ease-out
          ${animationPhase >= 2
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-4'
                    }
        `}>
                    <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-2 tracking-tight">
                        লাঙল
                    </h1>
                    <div className="h-0.5 sm:h-1 w-12 sm:w-16 md:w-20 bg-gradient-to-r from-primary to-accent mx-auto rounded-full transition-all duration-500" />
                </div>

                {/* Slogan */}
                <div className={`
          transition-all duration-800 delay-500 ease-out
          ${animationPhase >= 2
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-4'
                    }
        `}>
                    <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground font-medium mb-1">
                        কৃষকের ডিজিটাল হাতিয়ার
                    </p>
                </div>

                {/* Loading indicator */}
                <div className={`
          mt-6 sm:mt-8 md:mt-10 lg:mt-12 transition-all duration-500 delay-700
          ${animationPhase >= 2
                        ? 'opacity-100'
                        : 'opacity-0'
                    }
        `}>
                    <div className="flex space-x-1.5 sm:space-x-2">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full animate-bounce" />
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full animate-bounce delay-100" style={{ animationDelay: '0.1s' }} />
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full animate-bounce delay-200" style={{ animationDelay: '0.2s' }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IntroAnimation;