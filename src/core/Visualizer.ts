import { DotGraphBuilder } from "./DotGraphBuilder";
import { DotGraph } from "./DotView";
import { ListPointer, Pointer, Step } from "./Execution";
import { DirectedGraph } from "./UndirectedGraph";

type Visualization = Array<DotGraph>;

export class Visualizer {
  private static readonly Nullptr = "0x0";
  private static readonly SelectedAttribute = `color="black"`;
  private readonly _pointers = new Array<ListPointer>();
  private _lastPointer: ListPointer | undefined;

  visualize(step: Step): Visualization {
    let mem: Visualization = [];
    
    step.ops.forEach(op => {
      switch (op.kind) {
        case 'NewListPointer':
          this._pointers.push(op.value);
          break;
        case 'SetListPointerNext': {
          mem = [...mem, ...this.visualizeMemory()];
          const ptr = this._pointers.find(ptr => ptr.address === op.value.address);
          if (ptr) {
            ptr.next = op.value.next;
          }
          break;
        }
        case 'SetListPointerValue': {
          mem = [...mem, ...this.visualizeMemory()];
          const ptr = this._pointers.find(ptr => ptr.address === op.value.address);
          if (ptr) {
            ptr.data = op.value.value;
          }
          break;
        }
        case 'DereferencePointer':
          this._lastPointer = this.getPointerByAddress(op.address);
          break;
      }
    });

    return [...mem, ...this.visualizeMemory()];
  }

  private getPointerByAddress(address: string) {
    return this._pointers.find(ptr => ptr.address === address);
  }

  private visualizeMemory(): Visualization
  {
    const vertexes = new Map<Pointer, ListPointer>();
    const graph = new DirectedGraph<Pointer>();

    for (const ptr of this._pointers) {
      vertexes.set(ptr.address, ptr);
      graph.addVertex(ptr.address);
      if (ptr.next !== Visualizer.Nullptr) {
        graph.addEdge(ptr.address, ptr.next);
      }
    }

    const groupedResults = 
      graph.subGraphs().map(subgraph => subgraph.map(address => vertexes.get(address)!));
    
    const builder = new DotGraphBuilder();
    groupedResults.forEach(group => {
      builder.addList(group);
    });
    builder.addHeads(groupedResults.map(group => group[0]));

    if (this._lastPointer) {
      builder.addPointer(this._lastPointer);
    }

    builder.addPointers(this._pointers);
    return [builder.build()];
  }
}