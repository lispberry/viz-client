import { useEffect, useState } from "react";
import { CodeView } from "./CodeView";
import { GraphView } from "./GraphView";

const sourceCode = `void insertEnd(List * head, int val)
{
  while (head->n != nullptr)
  {
    head = head->n;
  }
  List * var;
  var = new List;
  var->val = val;
  head->n = var;
}`

export const MainView = () => {
  const [dots, setDots] = useState<Array<string>>([]);
  const [selectedLine, setSelectedLine] = useState<number>(1);

  const handleStart = async() => {
    await fetch("http://localhost:7071/api/v0/start");
    console.log(`started`);
  };

  const handleNext = async () => {
    const resp = await fetch("http://localhost:7071/api/v0/next");
    const body = await resp.json() as any;
    console.log(`handleNext`, body);
    setDots(body["dots"]);
    setSelectedLine(body["lineNumber"]);
  };

  return <div className="container">
    <div className="container-panel">
      <div className="container-button" onClick={handleStart}>Start</div>
      <div className="container-button" onClick={handleNext}>Next</div>
    </div>

    <div className="container-left">
      <GraphView dots={dots}></GraphView>
    </div>

    <div className="container-right">
      <CodeView value={sourceCode} selectedLine={ dots.length === 0 ? 1 : Math.max(1, selectedLine-2)} onChange={() => {}}></CodeView>
    </div>
  </div>;
};
