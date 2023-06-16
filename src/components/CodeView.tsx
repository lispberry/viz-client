import CodeMirror, { ReactCodeMirrorRef } from '@uiw/react-codemirror';
import { cpp } from '@codemirror/lang-cpp';
import React from 'react';

interface CodeViewProps {
  selectedLine: number;
  value: string;
  onChange: (code: string) => void;
  children?: []
}


export const CodeView = ({selectedLine, value, onChange}: CodeViewProps) => {
  const refs = React.useRef<ReactCodeMirrorRef>({});
  
  const selectLine = (ln: number) => {
    if (!refs.current) {
      return;
    }
    const line = refs.current?.state?.doc.line(ln);
    refs.current.view?.dispatch({selection: {anchor: line?.from ?? 0 }});
  };

  React.useEffect(() => {
    selectLine(selectedLine);     
  }, [selectedLine]);

  React.useEffect(() => {
    setTimeout(() => {
      selectLine(selectedLine);
    }, 1000);     
  }, []);
  
  return <CodeMirror
    ref={refs}
    value={value}
    extensions={[cpp()]}
    onChange={onChange}
  />;
};