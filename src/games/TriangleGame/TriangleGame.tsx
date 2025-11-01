import { useState } from "react";
import "./TriangleGame.css";

type Player = "red" | "green";
type Edge = { v1: number; v2: number; player: Player };

function TriangleGame() {
  const GRID_RADIUS = 2;
  const [edges, setEdges] = useState<Edge[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<Player>("red");
  const [winner, setWinner] = useState<Player | null>(null);

  const generateVertices = () => {
    const vertices: { x: number; y: number; id: number }[] = [];
    let id = 0;
    const SPACING = 120;
    const centerX = 300;
    const centerY = 250;

    for (let q = -GRID_RADIUS; q <= GRID_RADIUS; q++) {
      const r1 = Math.max(-GRID_RADIUS, -q - GRID_RADIUS);
      const r2 = Math.min(GRID_RADIUS, -q + GRID_RADIUS);
      for (let r = r1; r <= r2; r++) {
        const x = centerX + SPACING * (q + r / 2);
        const y = centerY + SPACING * r * (Math.sqrt(3) / 2);
        vertices.push({ x, y, id: id++ });
      }
    }
    return vertices;
  };

  const vertices = generateVertices();

  const generatePossibleEdges = () => {
    const possibleEdges: { v1: number; v2: number }[] = [];
    const vertexMap = new Map<string, number>();

    let id = 0;
    for (let q = -GRID_RADIUS; q <= GRID_RADIUS; q++) {
      const r1 = Math.max(-GRID_RADIUS, -q - GRID_RADIUS);
      const r2 = Math.min(GRID_RADIUS, -q + GRID_RADIUS);
      for (let r = r1; r <= r2; r++) {
        vertexMap.set(`${q},${r}`, id++);
      }
    }

    for (let q = -GRID_RADIUS; q <= GRID_RADIUS; q++) {
      const r1 = Math.max(-GRID_RADIUS, -q - GRID_RADIUS);
      const r2 = Math.min(GRID_RADIUS, -q + GRID_RADIUS);
      for (let r = r1; r <= r2; r++) {
        const currentId = vertexMap.get(`${q},${r}`)!;

        const neighbors = [
          [q + 1, r],
          [q - 1, r],
          [q, r + 1],
          [q, r - 1],
          [q + 1, r - 1],
          [q - 1, r + 1],
        ];

        for (const [nq, nr] of neighbors) {
          const neighborId = vertexMap.get(`${nq},${nr}`);
          if (neighborId !== undefined && currentId < neighborId) {
            possibleEdges.push({ v1: currentId, v2: neighborId });
          }
        }
      }
    }

    return possibleEdges;
  };

  const possibleEdges = generatePossibleEdges();

  const edgeExists = (v1: number, v2: number) => {
    return edges.find(
      (e) => (e.v1 === v1 && e.v2 === v2) || (e.v1 === v2 && e.v2 === v1)
    );
  };

  const checkTriangle = (newEdges: Edge[]): Player | null => {
    for (let i = 0; i < vertices.length; i++) {
      for (let j = i + 1; j < vertices.length; j++) {
        for (let k = j + 1; k < vertices.length; k++) {
          const edge1 = newEdges.find(
            (e) => (e.v1 === i && e.v2 === j) || (e.v1 === j && e.v2 === i)
          );
          const edge2 = newEdges.find(
            (e) => (e.v1 === j && e.v2 === k) || (e.v1 === k && e.v2 === j)
          );
          const edge3 = newEdges.find(
            (e) => (e.v1 === k && e.v2 === i) || (e.v1 === i && e.v2 === k)
          );

          if (
            edge1 &&
            edge2 &&
            edge3 &&
            edge1.player === edge2.player &&
            edge2.player === edge3.player
          ) {
            return edge1.player;
          }
        }
      }
    }
    return null;
  };

  const handleEdgeClick = (v1: number, v2: number) => {
    if (winner || edgeExists(v1, v2)) return;

    const newEdge: Edge = { v1, v2, player: currentPlayer };
    const newEdges = [...edges, newEdge];
    setEdges(newEdges);

    const gameWinner = checkTriangle(newEdges);
    if (gameWinner) {
      setWinner(gameWinner);
    } else {
      setCurrentPlayer(currentPlayer === "red" ? "green" : "red");
    }
  };

  const resetGame = () => {
    setEdges([]);
    setCurrentPlayer("red");
    setWinner(null);
  };

  return (
    <div className="triangle-game">
      <div className="game-info">
        {winner ? (
          <h2 style={{ color: winner }}>🎉 {winner.toUpperCase()} WINS! 🎉</h2>
        ) : (
          <h2 style={{ color: currentPlayer }}>
            Current Player: {currentPlayer.toUpperCase()}
          </h2>
        )}
        <button onClick={resetGame}>Reset Game</button>
      </div>

      <svg width="600" height="500">
        {possibleEdges.map((edge, idx) => {
          const existing = edgeExists(edge.v1, edge.v2);
          if (existing) return null;

          const v1 = vertices[edge.v1];
          const v2 = vertices[edge.v2];

          return (
            <line
              key={idx}
              x1={v1.x}
              y1={v1.y}
              x2={v2.x}
              y2={v2.y}
              stroke="rgba(200, 200, 200, 0.3)"
              strokeWidth="12"
              style={{ cursor: winner ? "default" : "pointer" }}
              onClick={() => handleEdgeClick(edge.v1, edge.v2)}
              onMouseEnter={(e) =>
                !winner && (e.currentTarget.style.stroke = currentPlayer)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.stroke = "rgba(200, 200, 200, 0.3)")
              }
            />
          );
        })}

        {edges.map((edge, idx) => {
          const v1 = vertices[edge.v1];
          const v2 = vertices[edge.v2];

          return (
            <line
              key={idx}
              x1={v1.x}
              y1={v1.y}
              x2={v2.x}
              y2={v2.y}
              stroke={edge.player}
              strokeWidth="10"
              strokeLinecap="round"
            />
          );
        })}

        {vertices.map((v) => (
          <circle key={v.id} cx={v.x} cy={v.y} r="8" fill="black" />
        ))}
      </svg>
    </div>
  );
}

export default TriangleGame;
