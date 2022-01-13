import { useState } from "react";

const buttonList = [
  { id: 0, name: "AC", type: "function" },
  { id: 1, name: "DELL", type: "function" },
  { id: 2, name: "%", type: "function" },
  { id: 3, name: "/", type: "function" },
  { id: 4, name: "7" },
  { id: 5, name: "8" },
  { id: 6, name: "9" },
  { id: 7, name: "*", type: "function" },
  { id: 8, name: "4" },
  { id: 9, name: "5" },
  { id: 10, name: "6" },
  { id: 11, name: "-", type: "function" },
  { id: 12, name: "1" },
  { id: 13, name: "2" },
  { id: 14, name: "3" },
  { id: 15, name: "+", type: "function" },
  { id: 16, name: "0" },
  { id: 17, name: " ", type: "disabled" },
  { id: 18, name: ".", type: "function" },
  { id: 19, name: "=", type: "equals" }
];

function RenderMonitor(props) {
  return (
    <div className="monitor">
      <div className="dots">
        <div className="insideDots"> </div>
        <div className="insideDots"> </div>
        <div className="insideDots"> </div>
      </div>
      <div className="result">
        {props.monitorText === " " ? "0" : props.monitorText}
      </div>
      <div className="transactions">
        {props.transectionText === " " ? "0" : props.transectionText}
      </div>
    </div>
  );
}

function RenderButton(props) {
  return (
    <div className="functionSection">
      {props.buttons.map(buton => {
        return (
          buton.type === "disabled" ? <div key={buton.id}> {buton.name} </div> :
            buton.type === "function" ?
              <button key={buton.id} className="function" onClick={() => ButtonClick(buton, props)}> {buton.name} </button>
              :
              <button key={buton.id} className="number" onClick={() => ButtonClick(buton, props)}> {buton.name} </button>
        );
      })}
    </div>
  );
}

function ButtonClick(button, props) {
  if (button.type === "equals") {
    calculateResult(props);
  } else if (button.type === "function") {
    if (button.name === "AC") {
      props.setTransectionText(" ");
      props.setMonitorText(" ");
      props.setResult(0);
    } else if (button.name === ".") {
      props.setMonitorText(props.monitorText + button.name);
      props.setTransectionText(props.transectionText + button.name);
      checkTransectionText(props.transectionText, props.setTransectionText, button);
    } else if (button.name === "DELL") {
      props.setMonitorText((props.monitorText.slice(0,-1)));
      props.setTransectionText(props.transectionText.slice(0,-1));
      checkTransectionText(props, button);
    }
    else if (button.name !== "AC") {
      props.setMonitorText(" ");
      props.setTransectionText(props.transectionText + button.name);
      checkTransectionText(props, button);
    }
  } else {
    if(props.result!==0){
      props.setTransectionText(" ");
      props.setMonitorText(" ");
      props.setResult(0);
    }
    props.setMonitorText(props.monitorText + button.name);
    props.setTransectionText(props.transectionText + button.name);
  }
  //console.log("button:",button,"monitorText: ",props.monitorText,"transectionText: ",props.transectionText,"result: ",props.result);
}

function checkTransectionText(props, button) {
  const last = props.transectionText.charAt(props.transectionText.length - 1);
  if (last === "+" || last === "-" || last === "*" || last === "%" || last === "/") {
    console.log(`iki kere arka arkaya ${last} kullandı`); // 👉️ e
    props.setTransectionText(props.transectionText + "0" + button.name);
  }
}

function calculateResult(props) {
  var lastOperatorLocation = 0;
  var firstRun = true;
  var previousOperator = "";
  var leftNum = 0;
  var left = "";
  var rightNum = 0;
  var right = "";
  for (var i = 0; i < props.transectionText.length; i++) {
    if (firstRun) {
      if (props.transectionText[i] === "+" || props.transectionText[i] === "-" || props.transectionText[i] === "*" || props.transectionText[i] === "%" || props.transectionText[i] === "/") {
        previousOperator = props.transectionText[i];
        for (var j = 0; j < i; j++) {
          left += props.transectionText[j];
        }
        if (left.includes("."))
          leftNum = parseFloat(left);
        else
          leftNum = parseInt(left);
        firstRun = false;
        lastOperatorLocation = i;
        console.log(leftNum);
      }
    } else {
      if (props.transectionText[i] === "+" || props.transectionText[i] === "-" || props.transectionText[i] === "*" || props.transectionText[i] === "%" || props.transectionText[i] === "/") {
        for (var j = lastOperatorLocation + 1; j < i; j++) {
          right += props.transectionText[j];
        }
        if (right.includes("."))
          rightNum = parseFloat(right);
        else
          rightNum = parseInt(right);
        leftNum = doSomeMath(leftNum, rightNum, previousOperator);
        previousOperator = props.transectionText[i];
        lastOperatorLocation = i;
        props.setMonitorText(leftNum.toString());
        console.log(rightNum);
        right="";
      }
    }
  }
  console.log(lastOperatorLocation);
  for (var j = lastOperatorLocation + 1; j < props.transectionText.length; j++) {
    right += props.transectionText[j];
    if (right.includes("."))
      rightNum = parseFloat(right);
    else
      rightNum = parseInt(right);
  }
  console.log(rightNum.toString());
  leftNum = doSomeMath(leftNum, rightNum, previousOperator);
  props.setMonitorText(leftNum.toString());
  props.setResult(leftNum);
}

function doSomeMath(leftNum, rightNum, previousOperator) {
  var result;
  switch (previousOperator) {
    case "*":
      result = leftNum * rightNum;
      break;
    case "/":
      result = leftNum / rightNum;
      break;
    case "+":
      result = leftNum + rightNum;
      break;
    case "-":
      result = leftNum - rightNum;
      break;
    case "%":
      result = leftNum % rightNum;
      break;
  }
  return result;
}

function App() {
  const [buttons, setButtons] = useState(buttonList);
  const [result, setResult] = useState(0);
  const [monitorText, setMonitorText] = useState(" ");
  const [transectionText, setTransectionText] = useState(" ");
  return (
    <main className="container">
      <div className="calculator">
        <RenderMonitor result={result} monitorText={monitorText} transectionText={transectionText} />
        <RenderButton buttons={buttons} result={result} monitorText={monitorText} transectionText={transectionText} setMonitorText={setMonitorText} setResult={setResult} setTransectionText={setTransectionText} />
      </div>
    </main>
  );
}

export default App;
