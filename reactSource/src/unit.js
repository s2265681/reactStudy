import $ from "jquery";
import { Element, createElement } from "./element";
// 父类
class Unit {
  constructor(element) {
    // 凡是挂在到私有属性上的都以_开头
    this._currentElement = element;
  }
  getHTMLString() {
    throw Error("此方法不能被调用");
  }
}

// 返回一个用span包裹的数字或者文字
class TextUnit extends Unit {
  getHTMLString(reactid) {
    this._reactid = reactid;
    return `<span data-reactid="${reactid}">${this._currentElement}</span>`;
  }
}

// 处理原生DOM元素 将虚拟DOM ：
// {type:'button',props:{id:'sayHello'}} => 转换成元素字符串返回
// “<button id="sayHello" style="color:red;"><span>say</span><b>hello</></button>”
class NativeUnit extends Unit {
  getHTMLString(reactid) {
    this._reactid = reactid;
    let { type, props } = this._currentElement;
    let tagStart = `<${type} data-reactid="${this._reactid}"`;
    let childString = "";
    let tagEnd = `</${type}>`;
    //{id:'sayHello', style:{color:'red'},onClick:sayHello}
    for (const propName in props) {
      if (Object.hasOwnProperty.call(props, propName)) {
        if (/^on[A-Z]/.test(propName)) {
          // 处理绑定⌚事件 onClick:sayHello => click="" 通过delegate绑定到document上，利用事件冒泡 hasClass 的机制找到我们要触发的类
          let eventName = propName.slice(2).toLowerCase(); // click
          $(document).delegate(
            `[data-reactid="${this._reactid}"]`,
            `${eventName}.${this.reactid}`,
            props[propName]
          );
        //   tagStart+= (`${eventName}="${props[propName].name}"`)
        } else if (propName === "style") {
          // 处理样式 style:{color:'red', backgroundColor:'#f00'} => style="color = #f00"
          let styleObj = props[propName];
          let styles = Object.entries(styleObj).map(([attr,value])=>{
              return `${attr.replace(/[A-Z]/g,m=>`-${m.toLowerCase()}`)}:${value}`;
          }).join(';');
          tagStart+=(` style="${styles}" `)
        } else if (propName === "className") {
          // 处理类名 className => class
          tagStart += (` class="${props[propName]}" `);
        } else if (propName === "children") {
          // 处理孩子
           let children = props[propName];
           // eslint-disable-next-line no-loop-func
           children.forEach((child,index)=>{
                let childUnit = createUnit(child)  // 可能是字符串也可能是一个react元素 虚拟DOM 
                let childHTMLString =  childUnit.getHTMLString(`${this._reactid}.${index}`)
                childString+=childHTMLString
           })
        } else {
          tagStart += ` ${propName}="${props[propName]}" `;
        }
      }
    }
    tagStart = tagStart + ">" + childString + tagEnd; // <button  id=sayHello ></button>
    return tagStart;
  }
}


// 处理自定义组件compositeUnit
class compositeUnit extends Unit{
    getHTMLString(reactid){
        this._reactid = reactid;
        let { type:Component , props } = this._currentElement;
        let compositeInstance = this._compositeInstance = new Component(props);
        // 让组件的实力的currentUnit属性等于当前的unit
        compositeInstance.currentUnit = this;
        // 如果有组件有渲染的函数的话让他执行
        compositeInstance.componentWillMount&&compositeInstance.componentWillMount();
        // 调用组件的render方法，或得要渲染的元素
        let renderedElement = compositeInstance.render();
        // 得到这个原色对应的unit
        let renderedUnitInstance = this._renderedUnitInstance =  createUnit(renderedElement);
        // 通过unit可以或得他的html 标记markup
        let renderedHTMLString = renderedUnitInstance.getHTMLString(this._reactid)
        // 给document绑定事件 当mounted的时候执行
        $(document).on('mounted',()=>{
            compositeInstance.componentDidMount&&compositeInstance.componentDidMount();
        })
        return renderedHTMLString;
    }
}

// createUnit 是一个创建不同对象的工厂函数 根据不同的条件返回不同的类对象
function createUnit(element) {
  if (typeof element === "string" || typeof element === "number") {
    return new TextUnit(element);
  } else if (element instanceof Element && typeof element.type === "string") {
    return new NativeUnit(element); // return  <button id="sayHello" style="color:red;"><span>say</span><b>hello</></button>
  } else if(element instanceof Element && typeof element.type === "function"){
     return new compositeUnit(element)
  }
}

export { createUnit };
