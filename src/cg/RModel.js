import {vec3, mat4} from 'gl-matrix';
import {degToRad} from "./cgUtils";
import Rotator from "./Modifiers/Rotator";

export class RModel {
  constructor(model, render_type, gl) {
    // ----- GL reference -----
    this.gl = gl;

    // ----- MODEL GENERAL INFO -----
    this.render_type = render_type;
    this.center = vec3.fromValues(
      (model.bounds[0] + model.bounds[3]) / 2,
      (model.bounds[1] + model.bounds[4]) / 2,
      (model.bounds[2] + model.bounds[5]) / 2);

    this.model_width = Math.abs(model.bounds[3] - model.bounds[0]);
    this.model_height = Math.abs(model.bounds[4] - model.bounds[1]);
    this.model_depth = Math.abs(model.bounds[5] - model.bounds[2]);

    this.view_type = 'perspective';
    this.aspect = this.gl.canvas.clientWidth / this.gl.canvas.clientHeight;

    this.scale = vec3.fromValues(1, 1, 1);
    this.translation = vec3.fromValues(0, 0, 0);
    this.rotation_matrix = mat4.create();

    // ----- ARRAYS WITH BUFFER INFO -----

    this.triangles_buffer = gl.createBuffer();
    this.triangles_normals_buffer = gl.createBuffer();
    this.vertices_normals_buffer = gl.createBuffer();
    this.colors_buffer = gl.createBuffer();
    this.setTriangles(model);

    // ----- NECESSARY MATRICES CREATION -----

    this.MV = mat4.create();
    this.MVP = mat4.create();
    this.recalculate_MV = true;
    this.recalculate_MVP = true;
    this.setMatrices();

    // ----- MODIFIERS -----
    this.rotator = new Rotator(gl)
  }

  // ----- RModel initial setup methods -----

  setMatrices() {
    // --- Model Matrix ---
    const translation = vec3.fromValues(
      -this.center[0],
      -this.center[1],
      -this.center[2]);

    this.model_matrix = mat4.create();
    mat4.translate(this.model_matrix, this.model_matrix, translation);

    // --- View Matrix ---
    const camera = vec3.fromValues(0, 0, this.model_depth * 2);
    const target = vec3.fromValues(0, 0, 0);
    const up = vec3.fromValues(0, 1, 0);
    this.viewMatrix = mat4.create();
    mat4.lookAt(this.viewMatrix, camera, target, up);
  }

  setTriangles(model) {
    const faces = model.faces;
    const color = vec3.fromValues(0.7, 0.7, 0.7);

    const triangles_array = [];
    const triangles_normals_array = [];
    const vertices_normals_array = [];
    const colors_array = [];

    let triangles_count = 0;

    faces.forEach(face => {
      const face_normal = face.getNormal();
      for (let i = 1; i < face.vertices.length-1; i++) {
        const vertex_1 = face.vertices[0];
        const vertex_2 = face.vertices[i];
        const vertex_3 = face.vertices[i+1];

        triangles_array.push(...vertex_1.coords, ...vertex_2.coords, ...vertex_3.coords);
        triangles_normals_array.push(...face_normal, ...face_normal, ...face_normal);
        vertices_normals_array.push(...vertex_1.getNormal(), ...vertex_2.getNormal(), ...vertex_3.getNormal());
        colors_array.push(...color, ...color, ...color);
        triangles_count += 1;
      }
    });

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.triangles_buffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(triangles_array), this.gl.STATIC_DRAW);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.triangles_normals_buffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(triangles_normals_array), this.gl.STATIC_DRAW);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertices_normals_buffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices_normals_array), this.gl.STATIC_DRAW);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colors_buffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(colors_array), this.gl.STATIC_DRAW);

    this.triangles_count = triangles_count;
  }

  // ----- RModels updaters -----

  updateRotation(){
    this.rotation_matrix = this.rotator.getRotationMatrix();
    this.recalculate_MV = true;
    this.recalculate_MVP = true;
  };

  updateRenderType(new_render_type){
    this.render_type = new_render_type
  }

  updateAspect() {
    this.aspect = this.gl.canvas.clientWidth / this.gl.canvas.clientHeight;
  }

  toggleProjection(){
    if (this.view_type === 'orthogonal') {
      this.view_type = 'perspective'
    } else {
      this.view_type = 'orthogonal'
    }
    this.recalculate_MVP = true;
  }

  rescale() {
    this.updateAspect();
    this.recalculate_MV = true;
    this.recalculate_MVP = true;
  }

  // ----- RModel necessary getters -----

  getModelMatrix() {
    const model_matrix = mat4.create();
    const translation = vec3.fromValues(-this.center[0], -this.center[1], -this.center[2]);

    mat4.scale(model_matrix, model_matrix, this.scale);
    mat4.translate(model_matrix, model_matrix, this.translation);
    mat4.multiply(model_matrix, model_matrix, this.rotation_matrix);
    mat4.translate(model_matrix, model_matrix, translation);

    return model_matrix
  }

  getOrthogonalProjectionMatrix() {
    const orthogonal_projection_matrix = mat4.create();
    let width = this.model_width;
    let height = this.model_height;
    const margin = 1.5;

    if (this.gl.canvas.clientWidth > this.gl.canvas.clientHeight) {
      width = this.model_height * this.aspect;
    }

    mat4.ortho(
      orthogonal_projection_matrix,
      -(width / 2) * margin, (width / 2) * margin,
      -(height / 2) * margin, (height / 2) * margin,
      1, this.model_depth * 50);

    return orthogonal_projection_matrix;
  }

  getPerspectiveProjectionMatrix() {
    const perspective_projection_matrix = mat4.create();
    const field_of_view_radians = degToRad(60);

    mat4.perspective(
      perspective_projection_matrix,
      field_of_view_radians, this.aspect,
      1, this.model_depth * 50);

    return perspective_projection_matrix
  }

  getProjectionMatrix() {
    if (this.view_type === 'orthogonal') {
      return this.getOrthogonalProjectionMatrix();
    }
    return this.getPerspectiveProjectionMatrix();
  }

  getMV() {
    if (this.recalculate_MV) {
      mat4.multiply(this.MV, this.viewMatrix, this.getModelMatrix());
      this.recalculate_MV = false;
      this.recalculate_MVP = true;
    }
    return this.MV
  }

  getMVP() {
    if (this.recalculate_MVP) {
      mat4.multiply(this.MVP, this.getProjectionMatrix(), this.getMV());
      this.recalculate_MVP = false;
    }
    return this.MVP
  }

  getTrianglesBuffer() {
    return this.triangles_buffer
  }

  getNormalsBuffer() {
    let normals_buffer = this.triangles_normals_buffer;
    if (this.render_type === 'VertexRender') {
      normals_buffer = this.vertices_normals_buffer;
    }

    return normals_buffer
  }

  getColorBuffer() {
    return this.colors_buffer
  }
}