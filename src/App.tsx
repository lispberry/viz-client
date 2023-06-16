import React, {useState} from 'react';
import './App.css';
import { MainView } from './components/MainView';

const ENPOINT = "http://localhost:8080/api/v1/compile";

const PROGRAM = `void insertEnd(List * l, int val) {
  while (l->n != nullptr) {
    l = l->n;
  }
  List * newEl = new List(val);
  l->n = newEl;
}
`;

function App() {
  return <>
    <MainView></MainView>
  </>;
}

export default App;
