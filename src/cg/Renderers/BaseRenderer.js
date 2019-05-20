export default class BaseRenderer{
  constructor(gl, r_model){
    this.gl = gl;
    this.r_model = r_model;
  }

  init(){
    console.log('Method should be implemented by subclasses')
  }

  draw(){
    console.log('Method should be implemented by subclasses')
  }

  updateColor(){
    console.log('Method should be implemented by subclasses')
  }
}