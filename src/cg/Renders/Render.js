export default class Render {
    constructor(model, gl){
        this.model = model;
        this.gl = gl;
    }

    init(){
        throw new Error('Render init not implemented')
    }

    draw(){
        throw new Error('Render draw not implemented')
    }

    updateColor(){
        throw new Error('Render update not implemented')
    }
}
