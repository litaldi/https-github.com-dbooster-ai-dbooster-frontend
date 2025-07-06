
import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Hand, MousePointer, Zap, Sparkles } from 'lucide-react';

interface GestureState {
  isActive: boolean;
  currentGesture: string | null;
  confidence: number;
}

interface GestureHint {
  gesture: string;
  description: string;
  icon: React.ElementType;
}

export function GestureController() {
  const [gestureState, setGestureState] = useState<GestureState>({
    isActive: false,
    currentGesture: null,
    confidence: 0
  });
  
  const [showHints, setShowHints] = useState(false);
  const [mouseTrail, setMouseTrail] = useState<Array<{ x: number; y: number; id: number }>>([]);
  const mouseIdRef = useRef(0);

  const gestureHints: GestureHint[] = [
    { gesture: 'Swipe Right', description: 'Navigate to next section', icon: MousePointer },
    { gesture: 'Double Tap', description: 'Expand metric details', icon: Hand },
    { gesture: 'Long Press', description: 'Show contextual menu', icon: Zap },
    { gesture: 'Pinch', description: 'Zoom in/out on charts', icon: Sparkles }
  ];

  // Mouse trail effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const newPoint = {
        x: e.clientX,
        y: e.clientY,
        id: mouseIdRef.current++
      };
      
      setMouseTrail(prev => {
        const updated = [...prev, newPoint];
        return updated.slice(-20); // Keep only last 20 points
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Gesture detection simulation
  useEffect(() => {
    let startX = 0;
    let startY = 0;
    let startTime = 0;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        startTime = Date.now();
        setGestureState(prev => ({ ...prev, isActive: true }));
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1 && gestureState.isActive) {
        const deltaX = e.touches[0].clientX - startX;
        const deltaY = e.touches[0].clientY - startY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        if (distance > 50) {
          if (Math.abs(deltaX) > Math.abs(deltaY)) {
            setGestureState({
              isActive: true,
              currentGesture: deltaX > 0 ? 'Swipe Right' : 'Swipe Left',
              confidence: Math.min(95, 60 + distance / 5)
            });
          } else {
            setGestureState({
              isActive: true,
              currentGesture: deltaY > 0 ? 'Swipe Down' : 'Swipe Up',
              confidence: Math.min(95, 60 + distance / 5)
            });
          }
        }
      }
    };

    const handleTouchEnd = () => {
      const duration = Date.now() - startTime;
      if (duration > 1000 && !gestureState.currentGesture) {
        setGestureState({
          isActive: true,
          currentGesture: 'Long Press',
          confidence: 92
        });
      }
      
      setTimeout(() => {
        setGestureState({
          isActive: false,
          currentGesture: null,
          confidence: 0
        });
      }, 2000);
    };

    // Mouse gesture detection (for desktop)
    const handleMouseDown = (e: MouseEvent) => {
      startX = e.clientX;
      startY = e.clientY;
      startTime = Date.now();
      setGestureState(prev => ({ ...prev, isActive: true }));
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (e.buttons === 1) { // Mouse is being dragged
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        if (distance > 100) {
          setGestureState({
            isActive: true,
            currentGesture: 'Mouse Drag',
            confidence: Math.min(95, 60 + distance / 10)
          });
        }
      }
    };

    const handleMouseUp = () => {
      setTimeout(() => {
        setGestureState({
          isActive: false,
          currentGesture: null,
          confidence: 0
        });
      }, 1500);
    };

    // Add event listeners
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [gestureState.isActive, gestureState.currentGesture]);

  return (
    <>
      {/* Mouse Trail */}
      {mouseTrail.map((point, index) => (
        <motion.div
          key={point.id}
          className="fixed pointer-events-none w-2 h-2 bg-purple-400 rounded-full"
          style={{ left: point.x - 4, top: point.y - 4 }}
          initial={{ opacity: 0.8, scale: 1 }}
          animate={{ opacity: 0, scale: 0 }}
          transition={{ duration: 1 }}
        />
      ))}

      {/* Gesture Recognition Indicator */}
      <AnimatePresence>
        {gestureState.isActive && gestureState.currentGesture && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 backdrop-blur-xl p-4 rounded-2xl shadow-2xl border border-purple-400/30">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="p-2 bg-white/20 rounded-lg"
                >
                  <Hand className="h-5 w-5 text-white" />
                </motion.div>
                <div>
                  <div className="text-white font-semibold">
                    {gestureState.currentGesture} Detected
                  </div>
                  <div className="text-purple-200 text-sm">
                    Confidence: {Math.round(gestureState.confidence)}%
                  </div>
                </div>
                <Badge className="bg-white/20 text-white border-white/30">
                  <Sparkles className="h-3 w-3 mr-1" />
                  AI Powered
                </Badge>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gesture Hints Toggle */}
      <motion.button
        onClick={() => setShowHints(!showHints)}
        className="fixed bottom-20 left-6 p-3 bg-gradient-to-r from-purple-600 to-indigo-700 rounded-full shadow-xl z-40"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Hand className="h-5 w-5 text-white" />
      </motion.button>

      {/* Gesture Hints Panel */}
      <AnimatePresence>
        {showHints && (
          <motion.div
            initial={{ opacity: 0, x: -20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.9 }}
            className="fixed bottom-36 left-6 z-40"
          >
            <div className="bg-gradient-to-br from-slate-900/95 to-purple-900/95 backdrop-blur-xl p-4 rounded-2xl shadow-2xl border border-purple-400/30 w-72">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-300" />
                Smart Gestures
              </h3>
              <div className="space-y-3">
                {gestureHints.map((hint, index) => {
                  const Icon = hint.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <Icon className="h-4 w-4 text-purple-300" />
                      <div>
                        <div className="text-white text-sm font-medium">
                          {hint.gesture}
                        </div>
                        <div className="text-gray-300 text-xs">
                          {hint.description}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
