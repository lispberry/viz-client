import * as React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { graphviz, GraphvizOptions } from 'd3-graphviz';
import { transition } from "d3-transition";
import { easeLinear } from "d3-ease";

interface GraphViewProps {
  dots: Array<string>;
}

let id = 0;
const getId = () => `graphviz${id++}`;

export const GraphView = ({dots}: GraphViewProps) => {
  const transitionFactory = () => {
    return transition("main")
        .ease(easeLinear)
        .delay(500)
        .duration(500);
  };

  const render = (dot: string) => {
    return new Promise<void>((resolve, reject) => {
      const viz = graphviz(`#${id}`, {
        width: 2000,
        height: 2000
      });

      viz
        .transition(transitionFactory as any)
        .renderDot(dot, () => {
          resolve();
        })
    });
  }

  const id = useMemo(getId, []);

  useEffect(() => {
    (async () => {
      for (const dot of dots) {
        await render(dot);
      }
    })();
  }, [dots]);

  return <div id={id}></div>
};