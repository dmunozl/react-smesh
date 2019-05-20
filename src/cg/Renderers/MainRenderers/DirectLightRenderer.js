import BaseRenderer from '../BaseRenderer'
import {createProgramFromSources} from '../../cgUtils'
import {vertexShader, fragmentShader} from '../../Shaders/normalShader'
import {vec3} from 'gl-matrix';

export default class DirectlightRenderer extends BaseRenderer{
  constructor(gl, r_model) {
    super(gl, r_model);
    this.program = createProgramFromSources(this.gl, [vertexShader, fragmentShader]);
    this.init()
  }

  init() {
    const gl = this.gl;
    gl.useProgram(this.program);
    this.positionAttributeLocation = gl.getAttribLocation(this.program, "a_position");
    this.normalAttributeLocation = gl.getAttribLocation(this.program, "a_normal");
    this.colorAttributeLocation = gl.getAttribLocation(this.program, "a_color");
    this.MVPLocation = gl.getUniformLocation(this.program, "u_worldViewProjection");
    this.modelLocation = gl.getUniformLocation(this.program, "u_world");
    this.reverseLightDirectionLocation = gl.getUniformLocation(this.program, "u_reverseLightDirection");

    this.positionBuffer = this.r_model.getTrianglesBuffer();
    this.normalBuffer = this.r_model.getTrianglesNormalsBuffer();
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
    gl.bufferData(gl.ARRAY_BUFFER, this.r_model.getColorMatrix(), gl.STATIC_DRAW);
    gl.vertexAttribPointer(this.colorAttributeLocation, 3, gl.FLOAT, false, 0, 0);
  }

  updateColor() {
    const gl = this.gl;
    gl.enableVertexAttribArray(this.colorAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.r_model.getColorMatrix(), gl.STATIC_DRAW);
    gl.vertexAttribPointer(this.colorAttributeLocation, 3, gl.FLOAT, false, 0, 0);
  }

  draw(){
    const gl = this.gl;
    gl.useProgram(this.program);
    gl.bindVertexArray(this.vao);
    let light_direction = vec3.fromValues(0.5, 0.7, 1);
    light_direction = vec3.normalize(light_direction, light_direction);

    gl.uniformMatrix4fv(this.MVPLocation, false, this.r_model.getMVP());
    gl.uniformMatrix4fv(this.modelLocation, false, this.r_model.getModelMatrix());

    gl.cullFace(gl.BACK);
    gl.uniform3fv(this.reverseLightDirectionLocation, light_direction);
    gl.drawArrays(gl.TRIANGLES, 0, this.r_model.triangles_count*3);

    gl.cullFace(gl.FRONT);
    gl.uniform3fv(this.reverseLightDirectionLocation, vec3.negate(light_direction, light_direction));
    gl.drawArrays(gl.TRIANGLES, 0, this.r_model.triangles_count*3);
  }
}