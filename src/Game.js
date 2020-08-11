import React, { useState, useEffect, useCallback, useRef } from "react";
import "./Game.css";
import produce from "immer";

function Game() {
  const numRows = 50;
  const numCols = 50;
  const [generation, setGeneration] = useState(0);
  const [running, setRunning] = useState(true);

  // Array of operations
  const operations = [
    [0, 1],
    [0, -1],
    [1, -1],
    [-1, 1],
    [1, 1],
    [-1, -1],
    [1, 0],
    [-1, 0],
  ];

  // Setup the grid's initial state
  const [grid, setGrid] = useState(() => {
    const rows = [];
    // For each row push an array filled initialized to 0
    for (let i = 0; i < numRows; i++) {
      rows.push(Array.from(Array(numCols), () => 0));
    }
    return rows;
  });

  //console.log(grid);

  /* Seed the starting state of each cell */
  useEffect(() => {
    setGrid(
      grid.map((rows, i) =>
        rows.map((col, j) => (grid[i][j] = Math.floor(Math.random() * 2)))
      )
    );
  }, []);

  // useRef gives us a mutable reference object whose current == passed argument
  const runningRef = useRef(running);
  runningRef.current = running;

  /* Function to run the simulation */
  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }

    // Simulate
    setGrid((g) => {
      return produce(g, (gridCopy) => {
        // For each cell
        for (let i = 0; i < numRows; i++) {
          for (let j = 0; j < numCols; j++) {
            let neighbors = 0;
            // For each of the directions in the operations array
            operations.forEach(([x, y]) => {
              const newI = i + x;
              const newJ = j + y;
              // Bounds checking
              if (newI >= 0 && newI < numRows && newJ >= 0 && newJ < numCols) {
                // If there is a neighbor add it to neighbors
                neighbors += g[newI][newJ];
              }
            });

            // Execute game rules.
            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][j] = 0; // Kill cell
            } else if (g[i][j] === 0 && neighbors === 3) {
              gridCopy[i][j] = 1; // Cell spawns
            }
          }
        }
      });
    });

    // Update the generation before each call
    setGeneration((generation) => {
      return generation + 1;
    });
    setTimeout(runSimulation, 20); // Recursive call every 20 milliseconds
  }, []);

  // Start simulation on page load
  useEffect(() => {
    runSimulation();
  }, []);

  const gridRef = useRef(grid);
  gridRef.current = grid;

  return (
    <div>
      <div
        style={{
          display: `grid`,
          gridTemplateColumns: `repeat(${numCols}, 10px)`,
        }}
      >
        {grid.map((rows, i) =>
          rows.map((col, j) => (
            <div
              key={`${i}-${j}`}
              style={{
                width: 10,
                height: 10,
                /* If the cell is alive then green else undefined */
                backgroundColor: grid[i][j] ? "green" : undefined,
                border: "solid 1px black",
              }}
            />
          ))
        )}
      </div>
      <div className="generation__container">
        <h2 className="generation__label">GENERATION: {generation}</h2>
        <button
          className="generation__button"
          onClick={() => {
            setRunning(!running);
            // Race condition
            runningRef.current = true;
            runSimulation();
          }}
        >
          {running ? "STOP" : "PLAY"}
        </button>
        <button
          className="generation__button"
          onClick={() => {
            setRunning(false);
            setGeneration(0);
            setGrid((g) => {
              return produce(g, (gridCopy) => {
                for (let i = 0; i < numRows; i++) {
                  for (let j = 0; j < numCols; j++) {
                    gridCopy[i][j] = Math.floor(Math.random() * 2);
                  }
                }
              });
            });
          }}
        >
          RESET
        </button>
      </div>
    </div>
  );
}

export default Game;
