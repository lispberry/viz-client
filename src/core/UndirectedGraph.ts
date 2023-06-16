function swap<F, T>(fromMap: Map<F, T>): Map<T, Array<F>> {
  const toMap = new Map<T, Array<F>>();
  for (const fromKey of fromMap.keys()) {
      const toKey = fromMap.get(fromKey)!;
      if (!toMap.has(toKey)) {
          toMap.set(toKey, []);
      }
      toMap.get(toKey)!.push(fromKey);
  }
  return toMap;
}

export class DirectedGraph<Vertex> {  
  private readonly _graph = new Map<Vertex, Array<Vertex>>();

  addVertex(vertex: Vertex) {
    if (this._graph.has(vertex)) {
      return;
    }

    this._graph.set(vertex, []);
  }

  addEdge(to: Vertex, from: Vertex) {
    this.addVertex(to);
    this.addVertex(from);
    this._graph.get(to)!.push(from);
    this._graph.get(from)!.push(to);
  }

  subGraphs() {
    let unusedColor = 0;
    const colored = new Map<Vertex, number>();

    const dfs = (vertex: Vertex) => {
      if (colored.has(vertex)) {
        return;
      }
      colored.set(vertex, unusedColor);
      const adjs = this._graph.get(vertex)!;
      adjs.forEach(adj => dfs(adj));
    };

    for (const vertex of this._graph.keys()) {
        dfs(vertex);
        unusedColor++;
    }

    return [...swap(colored).values()];
  }
}