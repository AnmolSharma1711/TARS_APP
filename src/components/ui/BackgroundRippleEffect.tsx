import { useEffect, useRef, useState } from 'react';
import './BackgroundRippleEffect.css';

interface Box {
  id: number;
  x: number;
  y: number;
  ripple: boolean;
}

export function BackgroundRippleEffect() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [boxes, setBoxes] = useState<Box[]>([]);

  useEffect(() => {
    const generateBoxes = () => {
      const cols = Math.floor(window.innerWidth / 40);
      const rows = Math.floor(window.innerHeight / 40);
      const newBoxes: Box[] = [];
      
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          newBoxes.push({
            id: i * cols + j,
            x: j * 40,
            y: i * 40,
            ripple: false,
          });
        }
      }
      
      setBoxes(newBoxes);
    };

    generateBoxes();
    window.addEventListener('resize', generateBoxes);
    
    return () => window.removeEventListener('resize', generateBoxes);
  }, []);

  const handleBoxClick = (clickedId: number) => {
    const clickedBox = boxes.find(box => box.id === clickedId);
    if (!clickedBox) return;

    setBoxes(prevBoxes =>
      prevBoxes.map(box => {
        const distance = Math.sqrt(
          Math.pow(box.x - clickedBox.x, 2) + Math.pow(box.y - clickedBox.y, 2)
        );
        
        if (distance < 200) {
          setTimeout(() => {
            setBoxes(prev => 
              prev.map(b => b.id === box.id ? { ...b, ripple: false } : b)
            );
          }, 600);
          
          return { ...box, ripple: true };
        }
        return box;
      })
    );
  };

  return (
    <div className="background-ripple-container" ref={canvasRef}>
      {boxes.map(box => (
        <div
          key={box.id}
          className={`ripple-box ${box.ripple ? 'ripple-active' : ''}`}
          style={{
            left: `${box.x}px`,
            top: `${box.y}px`,
          }}
          onClick={() => handleBoxClick(box.id)}
          onMouseEnter={() => handleBoxClick(box.id)}
        />
      ))}
    </div>
  );
}
