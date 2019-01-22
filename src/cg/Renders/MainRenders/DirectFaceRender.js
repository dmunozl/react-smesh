import Render from '../Render'
import {vec3} from "gl-matrix";

import {createProgramFromSources} from "../../cg-utils";
import {normalVertexShader, normalFragmentShader} from "../shaders";

class DirectFaceRender extends Render {
    constructor(model, gl){
        super(model, gl);
        this.program = createProgramFromSources(gl, [normalVertexShader, normalFragmentShader]);
    }

    init(){
        const gl = this.gl;
        gl.useProgram(this.program);
        this.positionAttributeLocation = gl.getAttribLocation(this.program, "a_position");
        this.normalAttributeLocation = gl.getAttribLocation(this.program, "a_normal");
        this.colorAttributeLocation = gl.getAttribLocation(this.program, "a_color");
        this.MVPLocation = gl.getUniformLocation(this.program, "u_worldViewProjection");
        this.modelLocation = gl.getUniformLocation(this.program, "u_world");
        this.reverseLightDirectionLocation = gl.getUniformLocation(this.program, "u_reverseLightDirection");

        this.positionBuffer = this.rModel.getTrianglesBuffer();
        this.normalBuffer = this.rModel.getTrianglesNormalsBuffer();
        this.colorBuffer = gl.createBuffer();
        this.vao = gl.createVertexArray();

        gl.bindVertexArray(this.vao);

        gl.enableVertexAttribArray(this.positionAttributeLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.vertexAttribPointer(this.positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

        gl.enableVertexAttribArray(this.normalAttributeLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.vertexAttribPointer(this.normalAttributeLocation, 3, gl.FLOAT, false, 0, 0);

        gl.enableVertexAttribArray(this.colorAttributeLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.rModel.getColorMatrix(), gl.STATIC_DRAW);
        gl.vertexAttribPointer(this.colorAttributeLocation, 3, gl.FLOAT, false, 0, 0);
    }

    draw(){
        const gl = this.gl;
        gl.useProgram(this.program);
        gl.bindVertexArray(this.vao);
        let lightDirection = vec3.fromValues(0.5, 0.7, 1);
        vec3.normalize(lightDirection, lightDirection);

        gl.uniformMatrix4fv(this.MVPLocation, false, this.rModel.getMVP());
        gl.uniformMatrix4fv(this.modelLocation, false, this.rModel.getModelMatrix());

        gl.cullFace(gl.BACK);
        gl.uniform3fv(this.reverseLightDirectionLocation, lightDirection);
        gl.drawArrays(gl.TRIANGLES, 0, this.rModel.getTrianglesCount()*3);

        gl.cullFace(gl.FRONT);
        gl.uniform3fv(this.reverseLightDirectionLocation, vec3.negate(lightDirection, lightDirection));
        gl.drawArrays(gl.TRIANGLES, 0, this.rModel.getTrianglesCount()*3);
    }
}