class Component {
  constructor(props) {
    this.props = props;
  }
  setState(){
      console.log(this,'this222')
      console.log(this.currentUnit._compositeInstance,'currentUnit')
      this.render()
    //   console.log(this.props,'props1111')
    //   console.log(this.state,'state111')
    //   console.log(newState,'newState')
      //   {count: 3}
    //   Object.assign({},this.state)
  }
}

export { Component };
