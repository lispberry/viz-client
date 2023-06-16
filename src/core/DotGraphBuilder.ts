import { DotGraph } from "./DotView";
import { ListPointer } from "./Execution";

export class DotGraphBuilder {
  private _pointers = new Array<string>();
  private _lists = new Array<string>();
  private _connections = new Array<string>();
  private _pointer = "";

  private _propertyMap = new Map<string, string>();

  addPointer(pointer: ListPointer) {
    this._pointer = `pointer[style=invis]; pointer -> "${pointer.address}":data [minlen=2]`;
  }

  addProperty(pointer: ListPointer, property: string) {
    this._propertyMap.set(pointer.address, property);
  }

  addList(pointers: Array<ListPointer>) {
    console.log(pointers);
    
    this._lists.push(`
      {rank=same
        ${pointers.map(ptr => `"${ptr === undefined ? "" : ptr.address}"`).join("\n")}
      }
    `);

    pointers.forEach(pointer => {
      if (pointer.next === "0x0") {
        return;
      }

      this._connections.push(`"${pointer.address}":ref2 -> "${pointer.next}":ref1;`);
    });
  }

  addHeads(heads: Array<ListPointer>) {
    for (let i = 1; i < heads.length; i++) {
      this._connections.push(`"${heads[i - 1].address}":ref1 -> "${heads[i].address}":ref1 [style=invis];`);
    }
  }

  private formatPointer(ptr: ListPointer) {
    const property = this._propertyMap.get(ptr.address) ?? ""; 

    return `"${ptr.address}" [label=<<table border="0" cellspacing="0" cellborder="1"><tr>
    <td port="ref1" width="28" height="36"><FONT POINT-SIZE="24pt">${ptr.address}</FONT></td>
    <td port="data" width="28" height="36"><FONT POINT-SIZE="24pt">${ptr.data}</FONT></td>
    <td port="ref2" width="28" height="36"><FONT POINT-SIZE="24pt">${ptr.next}</FONT></td></tr>
    </table>> ${property}];`;
  }

  addPointers(pointers: Array<ListPointer>) {
      this._pointers = pointers.map(ptr => this.formatPointer(ptr));
  }

  build(): DotGraph {
    return `digraph {
      node [shape=plaintext];
      nodesep=0.5;
      ${this._pointers.join("\n")}
      ${this._lists.join("\n")}
      ${this._pointer + "\n"}
      ${this._connections.join("\n")}
    }`;
  }
}