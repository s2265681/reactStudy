import React from "./react";

// jsx 浏览器不能识别运行 需要靠babel转换成javascript
function sayHello() {
  alert("hello");
}
// let element = (
//   <button
//     id="sayHello"
//     style={{ color: "#f00", backgroundColor: "#ff0" }}
//     onClick={sayHello}
//   >
//     say
//     <p>hello</p>
//   </button>
// );
// 会通过 babel 转换成下面的语法树
/*#__PURE__*/
// let element = React.createElement(
//   "button",
//   {
//     id: "sayHello",
//     style: {
//       color: "#f00",
//       backgroundColor: "#ff0",
//     },
//     className:'hello',
//     onClick: sayHello,
//   },
//   "say",
//   React.createElement("span", null, "hello")
// );
// {type:'button',props:{id:'sayHello'}}

// let element = <Count count={0} name="计数器"></Count>

class Count extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 1,
    };
  }
  componentWillMount() {
    console.log("componentWillMount");
  }
  componentDidMount() {
    console.log("componentDidMount");
  }
  handleAddCount() {
    this.setState({
      count: this.state.count++,
    });
  }
  render() {
      console.log(this,'this1')
    let p = React.createElement(
      "p",
      { style: { color: "red" } },
      this.props.name,
      this.state.count
    );
    let button = React.createElement(
      "button",
      {  id: "counter", onClick: this.handleAddCount.bind(this) },
      "+"
    );
    return React.createElement("div", {}, p,button);
  }
}
/*#__PURE__ 自定义组件*/
let element = React.createElement(Count, {
  name: "计数器",
});

React.render(element, document.getElementById("app"));
