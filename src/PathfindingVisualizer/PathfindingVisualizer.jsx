import React, {Component} from 'react';
import Node from './Node/Node';
import {dijkstra, getNodesInShortestPathOrder} from '../algorithms/dijkstra';

import './PathfindingVisualizer.css';

export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
      clickType: '',
      startNode: null,
      finishNode: null,
      errorMessage: '',
    };
  }

  componentDidMount() {
    const grid = getInitialGrid();
    this.setState({grid});
  }

  updateGrid(row, col) {
    const {grid, clickType} = this.state;

    const newGrid = grid.slice();
    const node = newGrid[row][col];
    let newNode;

    if (clickType === 'buildWall') {
      newNode = {
        ...node,
        isWall: !node.isWall,
      };
    } else if (clickType === 'pickStartNode') {
      newNode = {
        ...node,
        isStart: !node.isStart,
      };
    } else if (clickType === 'pickFinishNode') {
      newNode = {
        ...node,
        isFinish: !node.isFinish,
      };
    }

    newGrid[row][col] = newNode;

    return newGrid;
  }

  handleMouseDown(row, col) {
    let newGrid;

    if (this.state.clickType === 'buildWall') {
      this.setState({mouseIsPressed: true});
    } else if (this.state.clickType === 'pickStartNode') {
      const {startNode} = this.state;

      // if already picked start node, then remove it from the grid
      if (startNode) {
        newGrid = this.updateGrid(startNode.row, startNode.col);
      }

      this.setState({startNode: {row, col}});
    } else if (this.state.clickType === 'pickFinishNode') {
      const {finishNode} = this.state;

      // if already picked start node, then remove it from the grid
      if (finishNode) {
        newGrid = this.updateGrid(finishNode.row, finishNode.col);
      }

      this.setState({finishNode: {row, col}});
    }

    newGrid = this.updateGrid(row, col);
    this.setState({grid: newGrid});
  }

  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return;
    const newGrid = this.updateGrid(row, col);
    this.setState({grid: newGrid});
  }

  handleMouseUp() {
    this.setState({mouseIsPressed: false});
  }

  animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-visited';
      }, 10 * i);
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-shortest-path';
      }, 50 * i);
    }
  }

  visualizeDijkstra() {
    const {grid} = this.state;
    const startNode = grid[this.state.startNode.row][this.state.startNode.col];
    const finishNode =
      grid[this.state.finishNode.row][this.state.finishNode.col];

    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);

    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  render() {
    const {grid, mouseIsPressed} = this.state;

    return (
      <div style={{marginTop: '30px'}}>
        <div style={{margin: '20px'}}>
          <h3>Choose your click mode</h3>
          <label>
            <input
              type="radio"
              name="clickType"
              value="pickStartNode"
              onClick={e => this.setState({clickType: 'pickStartNode'})}
            />
            Pick Start Node
          </label>
          <label>
            <input
              type="radio"
              name="clickType"
              value="pickFinishNode"
              onClick={e => this.setState({clickType: 'pickFinishNode'})}
            />
            Pick Finish Node
          </label>
          <label>
            <input
              type="radio"
              name="clickType"
              value="buildWall"
              onClick={e => this.setState({clickType: 'buildWall'})}
            />
            Build wall
          </label>
        </div>

        <button
          onClick={() => {
            const {startNode, finishNode} = this.state;

            if (startNode && finishNode) {
              this.setState({errorMessage: ''});
              this.visualizeDijkstra();
            } else {
              this.setState({
                errorMessage: 'Please pick one start node and one finish node',
              });
            }
          }}>
          Run Dijkstra's Algorithm to Find Shortest Path
        </button>
        <p id="errorMessage" style={{color: 'red', backgroundColor: 'yellow'}}>
          {this.state.errorMessage}
        </p>
        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const {row, col, isFinish, isStart, isWall} = node;
                  return (
                    <Node
                      key={nodeIdx}
                      col={col}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) =>
                        this.handleMouseEnter(row, col)
                      }
                      onMouseUp={() => this.handleMouseUp()}
                      row={row}></Node>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < 20; row++) {
    const currentRow = [];
    for (let col = 0; col < 50; col++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
};

const createNode = (col, row) => {
  return {
    col,
    row,
    isStart: null,
    isFinish: null,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    prevNode: null,
  };
};
