export function dijkstra(grid, startNode, finishNode) {
  /*   
    Find the shorstest path by implementing dijkstra algorithms
    
    @params grid - list[list[Node]]
    @params startNode - Node
    @params finishNode - Node

    @returns a list of sorted visited nodes
  */
  const sortedVisitedNodes = [];
  const unvisitedNodes = gridToList(grid);

  // Initialise the distance of start node
  startNode.distance = 0;

  while (!!unvisitedNodes.length) {
    sortNodesByDistance(unvisitedNodes);

    const closestNode = unvisitedNodes.shift();

    // If we encounter a wall, we skip it.
    if (closestNode.isWall) continue;

    // If the closest node is at a distance of infinity,
    // we must be trapped and should therefore stop.
    if (closestNode.distance === Infinity) return sortedVisitedNodes;

    // Otherwise, mark it as visted
    closestNode.isVisited = true;
    sortedVisitedNodes.push(closestNode);

    // if it's the finish node, we stop and return a sorted visited nodes
    if (closestNode === finishNode) return sortedVisitedNodes;

    // otherwise, update the grid with adjacent neighbors
    updateUnvisitedNeighbors(closestNode, grid);
  }
}

function sortNodesByDistance(nodes) {
  /*   
  Sort a list of Nodes as the parameter by ascending distance
  @params nodes - list[Node] 
*/
  nodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
}

function processNeighbors(node, neighbors, distance) {
  /* 
    Helper function to process unvisited neighbors with distance
    @params node - Node
    @params neighbors - list[Node]
    @params distance - int

    @returns processNeighbors - list[Node]
   */
  let processedNeighbors = [];

  for (const neighbor of neighbors) {
    if (!neighbor.isVisited && neighbor.distance === Infinity) {
      neighbor.distance = node.distance + distance;
      neighbor.prevNode = node;

      processedNeighbors.push(neighbor);
    }
  }

  return processedNeighbors;
}

function updateUnvisitedNeighbors(node, grid) {
  /* 
    Get a list of unvisited neighbors
    @params node - Node
    @params grid - list[list[Node]]

    @returns list[Node]
   */

  // to store neighbors on left, right, bottom, top
  let neighbors = [];
  // to store neighbors on top left, top right, bottom left, bottom right
  let diagonalNeighbors = [];
  const {col, row} = node;

  if (row > 0) neighbors.push(grid[row - 1][col]); // top neighbor node
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]); // bottom neighbor node
  if (col > 0) neighbors.push(grid[row][col - 1]); // left neighbor node
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]); // right neighbor node

  if (row > 0 && col > 0) diagonalNeighbors.push(grid[row - 1][col - 1]); // top left neighbor node
  if (row > 0 && col < grid[0].length - 1)
    diagonalNeighbors.push(grid[row - 1][col + 1]); // top right neighbor node
  if (row < grid.length - 1 && col > 0)
    diagonalNeighbors.push(grid[row + 1][col - 1]); // bottom left neighbor node
  if (row < grid.length - 1 && col < grid[0].length - 1)
    diagonalNeighbors.push(grid[row + 1][col + 1]); // bottom right neighbor node

  neighbors = processNeighbors(node, neighbors, 1);
  diagonalNeighbors = processNeighbors(node, diagonalNeighbors, 1.4);

  return neighbors.concat(diagonalNeighbors);
}

function gridToList(grid) {
  /*   
  Convert 3D array of nodes to 2D array

  @params grid - list[list[Node]]

  @returns nodes - list[Node]
  */

  const nodes = [];

  for (const row of grid) {
    for (const node of row) {
      nodes.push(node);
    }
  }

  return nodes;
}

export function getNodesInShortestPathOrder(finishNode) {
  /* 
    Backtracks from the finishNode to find the shortest path.
    Only works when called * after * the dijkstra method above.
    
    @params finishNode - Node
    
    @returns shortestPathNodes - list[Node]
   */
  const shortestPathNodes = [];
  let currentNode = finishNode;

  while (currentNode !== null) {
    shortestPathNodes.unshift(currentNode);
    currentNode = currentNode.prevNode;
  }

  return shortestPathNodes;
}
