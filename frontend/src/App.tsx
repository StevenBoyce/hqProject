import { useState, useEffect, useRef } from 'react'

type ElementType = "text" | "image" | "button";

interface DraggableElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
};

const GRID_SIZE = 10;

function App() {
  const [elements, setElements] = useState<DraggableElement[]>([]);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const canvasRef = useRef<HTMLDivElement>(null);
  const elementsRef = useRef<DraggableElement[]>([]);

  // Keep the ref in sync with the state
  useEffect(() => {
    elementsRef.current = elements;
  }, [elements]);

  const addElement = (type: ElementType) => {
    setElements((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        type,
        x: 0,
        y: 0,
        width: GRID_SIZE * 5,
        height: GRID_SIZE * 4,
      },
    ]);
  };

  const startDrag = (id: string, e: React.MouseEvent) => {
    const elementsSnapshot = [...elements];
    const startX = e.clientX;
    const startY = e.clientY;

    const el = elements.find((el) => el.id === id);
    if (!el) return;

    const origX = el.x;
    const origY = el.y;

    const onMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      setElements((prev) =>
        prev.map((el) =>
          el.id === id
            ? {
                ...el,
                x: Math.max(0, Math.min(800 - el.width, Math.round((origX + dx) / GRID_SIZE) * GRID_SIZE)),
                y: Math.max(0, Math.min(600 - el.height, Math.round((origY + dy) / GRID_SIZE) * GRID_SIZE)),
              }
            : el
        )
      );
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      const movedElement = elementsRef.current.find((el) => el.id === id);
      if (willMoveCollide(movedElement)) {
        setElements(elementsSnapshot);
      }
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const startResize = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering drag
    const elementsSnapshot = [...elements];
    const startX = e.clientX;
    const startY = e.clientY;

    const el = elements.find((el) => el.id === id);
    if (!el) return;

    const origWidth = el.width;
    const origHeight = el.height;

    const onMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      // Calculate new dimensions (only increase from bottom-right)
      const newWidth = Math.max(GRID_SIZE, origWidth + Math.round(dx / GRID_SIZE) * GRID_SIZE);
      const newHeight = Math.max(GRID_SIZE, origHeight + Math.round(dy / GRID_SIZE) * GRID_SIZE);

      // Clamp to canvas bounds
      const clampedWidth = Math.min(800 - el.x, newWidth);
      const clampedHeight = Math.min(600 - el.y, newHeight);

      setElements((prev) =>
        prev.map((el) =>
          el.id === id
            ? {
                ...el,
                width: clampedWidth,
                height: clampedHeight,
              }
            : el
        )
      );
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      const resizedElement = elementsRef.current.find((el) => el.id === id);
      if (willMoveCollide(resizedElement)) {
        setElements(elementsSnapshot);
      }
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const willMoveCollide = (element: DraggableElement | undefined, currentElements: DraggableElement[] = elementsRef.current) => {
    let willCollide = false;
    if (!element) return false;
    for (const el of currentElements) {
      if (element.id !== el.id) {
        if (element.x + element.width > el.x && element.x < el.x + el.width && element.y + element.height > el.y && element.y < el.y + el.height) {
          willCollide = true;
          break;
        }
      }
    }
    return willCollide;
  }

  return (
    <div>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="p-4 flex gap-4">
        <div className="flex flex-col gap-2">
          <button className="bg-blue-500 text-white px-4 py-2" onClick={() => addElement("text")}>
            Add Text
          </button>
          <button className="bg-green-500 text-white px-4 py-2" onClick={() => addElement("image")}>
            Add Image
          </button>
          <button className="bg-purple-500 text-white px-4 py-2" onClick={() => addElement("button")}>
            Add Button
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {/* Preview Toggle */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Preview</label>
            <input
              type="checkbox"
              checked={isPreviewMode}
              onChange={(e) => setIsPreviewMode(e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
          </div>

          <div
            ref={canvasRef}
            className="relative w-[800px] h-[600px] bg-gray-100 border border-gray-400"
            style={{ 
              backgroundSize: isPreviewMode ? '0px 0px' : `${GRID_SIZE}px ${GRID_SIZE}px`, 
              backgroundImage: isPreviewMode ? 'none' : "linear-gradient(to right, #ccc 1px, transparent 1px), linear-gradient(to bottom, #ccc 1px, transparent 1px)" 
            }}
          >
            {elements.map((el) => (
              <div
                key={el.id}
                onMouseDown={(e) => startDrag(el.id, e)}
                className="absolute cursor-move bg-white border border-black p-1 text-xs overflow-hidden"
                style={{
                  left: el.x,
                  top: el.y,
                  width: el.width,
                  height: el.height,
                }}
              >
                {el.type === "text" && <span>Text Box</span>}
                {el.type === "image" && <div className="w-full h-full bg-gray-300">Image</div>}
                {el.type === "button" && <button className="bg-blue-400 w-full h-full">Button</button>}
                
                {/* Resize handles - only show when not in preview mode */}
                {!isPreviewMode && (
                  <div
                    className="absolute bottom-0 right-0 w-2 h-2 bg-blue-500 cursor-se-resize"
                    onMouseDown={(e) => startResize(el.id, e)}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </div>
  
  )
}

export default App 