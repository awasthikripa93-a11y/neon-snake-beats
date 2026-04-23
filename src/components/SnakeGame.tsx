import React, { useState, useEffect, useCallback, useRef } from 'react';

interface Point {
  x: number;
  y: number;
}

const GRID_SIZE = 20;
const INITIAL_SPEED = 100; // Speeded up from 150
const SPEED_INCREMENT = 3; // Increased increment

type GameState = 'START' | 'RUNNING' | 'PAUSED' | 'GAMEOVER';

export const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<'UP' | 'DOWN' | 'LEFT' | 'RIGHT'>('RIGHT');
  const [gameState, setGameState] = useState<GameState>('START');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('snake-high-score-neon');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const [isExploding, setIsExploding] = useState(false);

  const gameLoopRef = useRef<number | null>(null);

  const triggerExplosion = () => {
    setIsExploding(true);
    setTimeout(() => setIsExploding(false), 1500);
  };

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    setFood(newFood);
  }, []);

  const initializeGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setDirection('RIGHT');
    setScore(0);
    setSpeed(INITIAL_SPEED);
    setGameState('RUNNING');
    setIsExploding(false);
    generateFood([{ x: 10, y: 10 }]);
  };

  const moveSnake = useCallback(() => {
    if (gameState !== 'RUNNING') return;

    setSnake(prevSnake => {
      const head = { ...prevSnake[0] };
      switch (direction) {
        case 'UP': head.y -= 1; break;
        case 'DOWN': head.y += 1; break;
        case 'LEFT': head.x -= 1; break;
        case 'RIGHT': head.x += 1; break;
      }

      // Check collisions with walls
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        setGameState('GAMEOVER');
        triggerExplosion();
        return prevSnake;
      }

      // Check collisions with self
      if (prevSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setGameState('GAMEOVER');
        triggerExplosion();
        return prevSnake;
      }

      const newSnake = [head, ...prevSnake];

      // Check food
      if (head.x === food.x && head.y === food.y) {
        setScore(s => s + 10);
        setSpeed(prev => Math.max(40, prev - SPEED_INCREMENT));
        generateFood(newSnake);
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameState, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }
      
      if (e.key === ' ' && (gameState === 'RUNNING' || gameState === 'PAUSED')) {
        setGameState(prev => prev === 'RUNNING' ? 'PAUSED' : 'RUNNING');
        return;
      }

      switch (e.key) {
        case 'ArrowUp': if (direction !== 'DOWN') setDirection('UP'); break;
        case 'ArrowDown': if (direction !== 'UP') setDirection('DOWN'); break;
        case 'ArrowLeft': if (direction !== 'RIGHT') setDirection('LEFT'); break;
        case 'ArrowRight': if (direction !== 'LEFT') setDirection('RIGHT'); break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, gameState]);

  useEffect(() => {
    if (gameState !== 'RUNNING') {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
      return;
    }

    gameLoopRef.current = window.setInterval(moveSnake, speed);
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [moveSnake, speed, gameState]);

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('snake-high-score-neon', score.toString());
    }
  }, [score, highScore]);

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex justify-between w-full max-w-[400px] border-b-2 border-[#00ffff] pb-2">
        <div className="flex flex-col">
          <span className="text-[10px] text-[#ff00ff] font-mono tracking-tighter">DATA_HARVESTED</span>
          <span className="text-3xl font-mono leading-none">{score.toString().padStart(6, '0')}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] text-[#00ffff] font-mono tracking-tighter">ARCHIVE_PEAK</span>
          <span className="text-3xl font-mono leading-none opacity-50">{highScore.toString().padStart(6, '0')}</span>
        </div>
      </div>

      <div className="relative group">
        <div 
          className="grid bg-[#050505] glitch-border overflow-hidden relative p-[2px]"
          style={{ 
            width: '400px', 
            height: '400px',
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
          }}
        >
          {/* SCAN_GRID */}
          <div className="absolute inset-0 pointer-events-none opacity-10" 
               style={{ 
                 backgroundImage: 'linear-gradient(to right, #00ffff 1px, transparent 1px), linear-gradient(to bottom, #00ffff 1px, transparent 1px)',
                 backgroundSize: '20px 20px'
               }} 
          />

          {/* ORGANISM_SNAKE */}
          {snake.map((segment, i) => (
            <div
              key={i}
              className={`border border-black flex items-center justify-center ${
                i === 0 
                  ? 'bg-[#00ffff] z-20 shadow-[0_0_10px_#00ffff]' 
                  : 'bg-[#ff00ff] opacity-80'
              }`}
              style={{
                gridColumnStart: segment.x + 1,
                gridRowStart: segment.y + 1,
                opacity: 1 - (i / (snake.length + 2))
              }}
            >
               {i === 0 && <div className="w-1 h-1 bg-black rounded-full" />}
            </div>
          ))}

          {/* NUTRIENT_FOOD */}
          <div
            className="bg-[#ff00ff] animate-ping"
            style={{
              gridColumnStart: food.x + 1,
              gridRowStart: food.y + 1,
              transform: 'scale(0.8)'
            }}
          />

          {/* EXPLOSION_OVERLAY */}
          {isExploding && (
             <div className="absolute inset-0 bg-[#ff00ff] z-40 animate-flicker flex flex-col items-center justify-center">
                <h1 className="text-5xl font-mono font-bold text-black glitch-text" data-text="SEGMENTATION_FAULT">
                    SEGMENTATION_FAULT
                </h1>
                <p className="text-black font-mono font-bold text-sm tracking-[0.5em] mt-4 animate-tearing">SYSTEM_FAILURE</p>
             </div>
          )}

          {/* SYSTEM_LOCKS */}
          {gameState !== 'RUNNING' && !isExploding && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-10 p-8 border-4 border-[#ff00ff] m-4">
              {gameState === 'GAMEOVER' ? (
                <>
                  <h2 className="text-3xl font-mono font-bold text-[#ff00ff] mb-2 leading-none">SEGMENTATION_FAULT</h2>
                  <p className="text-[10px] mb-8 text-[#00ffff]/60 text-center uppercase">ORGANISM_TERMINATED. DATA_CORRUPTION_PENDING.</p>
                  <button 
                    onClick={initializeGame}
                    className="w-full py-4 bg-[#ff00ff] text-black font-bold text-xl hover:bg-[#00ffff] transition-colors"
                  >
                    RE_INITIALIZE
                  </button>
                </>
              ) : gameState === 'PAUSED' ? (
                <>
                  <h2 className="text-3xl font-mono font-bold text-[#00ffff] mb-2 leading-none">INTERRUPT_SIGNAL</h2>
                  <p className="text-[10px] mb-8 text-[#00ffff]/60 text-center uppercase tracking-widest">AWAITING_USER_COMMAND_SEQUENCE</p>
                  <button 
                    onClick={() => setGameState('RUNNING')}
                    className="w-full py-4 bg-[#00ffff] text-black font-bold text-xl hover:bg-[#ff00ff] transition-colors"
                  >
                    INITIALIZE_SEQUENCE
                  </button>
                </>
              ) : (
                <>
                  <h2 className="text-4xl font-mono font-bold text-[#00ffff] mb-2 leading-none tracking-tighter">NEON_DRIVE</h2>
                  <p className="text-[10px] mb-8 text-[#00ffff]/60 text-center uppercase tracking-[0.3em]">SYNCHRONIZATION_REQUIRED</p>
                  <button 
                    onClick={initializeGame}
                    className="w-full py-4 bg-[#00ffff] text-black font-bold text-xl hover:bg-[#ff00ff] transition-colors animate-pulse"
                  >
                    INITIALIZE_SEQUENCE
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
