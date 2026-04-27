import React, { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_FOOD = { x: 5, y: 5 };
const INITIAL_DIRECTION = { x: 0, y: -1 };
const GAME_SPEED = 120;

interface SnakeGameProps {
  onScoreUpdate: (score: number) => void;
}

export default function SnakeGame({ onScoreUpdate }: SnakeGameProps) {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState(INITIAL_FOOD);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  
  const directionRef = useRef(direction);
  const scoreRef = useRef(0);

  const generateFood = useCallback(() => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
      if (!snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, [snake]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default scrolling for arrow keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ') {
        setIsPaused(p => !p);
        return;
      }

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (directionRef.current.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (directionRef.current.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (directionRef.current.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (directionRef.current.x === 0) setDirection({ x: 1, y: 0 });
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y
        };

        // Check collision with walls
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        // Check collision with self
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check collision with food
        if (newHead.x === food.x && newHead.y === food.y) {
          setFood(generateFood());
          const newScore = newSnake.length - 1;
          scoreRef.current = newScore;
          onScoreUpdate(newScore);
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const intervalId = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(intervalId);
  }, [gameOver, isPaused, food, generateFood, onScoreUpdate]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(INITIAL_FOOD);
    setDirection(INITIAL_DIRECTION);
    setGameOver(false);
    setIsPaused(false);
    scoreRef.current = 0;
    onScoreUpdate(0);
  };

  return (
    <div className="relative border-4 border-cyan-500/50 rounded-lg shadow-[0_0_25px_rgba(6,182,212,0.3)] bg-zinc-950 p-2">
      <div 
        className="grid bg-zinc-900 overflow-hidden rounded-sm"
        style={{ 
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          width: 'min(100vw - 3rem, 400px)',
          height: 'min(100vw - 3rem, 400px)'
        }}
      >
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
          const x = i % GRID_SIZE;
          const y = Math.floor(i / GRID_SIZE);
          
          const isSnake = snake.some(s => s.x === x && s.y === y);
          const isHead = snake[0].x === x && snake[0].y === y;
          const isFood = food.x === x && food.y === y;

          return (
            <div 
              key={i} 
              className={`
                border border-zinc-800/30
                ${isHead ? 'bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)] z-10' : ''}
                ${isSnake && !isHead ? 'bg-cyan-600/80 shadow-[0_0_5px_rgba(8,145,178,0.5)]' : ''}
                ${isFood ? 'bg-fuchsia-500 shadow-[0_0_10px_rgba(217,70,239,0.8)] animate-pulse' : ''}
              `} 
            />
          );
        })}
      </div>

      {gameOver && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm rounded-lg backdrop-filter">
          <h2 className="text-4xl font-black text-rose-500 mb-2 drop-shadow-[0_0_10px_rgba(244,63,94,0.8)]">GAME OVER</h2>
          <p className="text-zinc-300 mb-6 text-lg">Score: <span className="text-cyan-400 font-bold">{scoreRef.current}</span></p>
          <button 
            onClick={resetGame}
            className="px-6 py-2 bg-transparent border-2 border-cyan-400 text-cyan-400 font-bold rounded-full hover:bg-cyan-400 hover:text-black transition-all shadow-[0_0_15px_rgba(34,211,238,0.5)] hover:shadow-[0_0_25px_rgba(34,211,238,0.8)] cursor-pointer"
          >
            PLAY AGAIN
          </button>
        </div>
      )}

      {isPaused && !gameOver && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-lg">
          <h2 className="text-3xl font-black text-yellow-400 tracking-widest drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]">PAUSED</h2>
        </div>
      )}
    </div>
  );
}
