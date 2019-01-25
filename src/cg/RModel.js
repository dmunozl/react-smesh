import {vec3, vec4, mat4} from 'gl-matrix'
import {degToRad} from "./cg-utils";

export default class RModel {
    constructor(model, gl) {
        // ORIGINAL MODEL REFERENCE
        this.model = model;
        this.gl = gl;

        // MODEL STATUS
        this.status = 'LOADING';
        this.message = 'Loading RModel';

        // RENDERING INFO
        this.bounds = [];
        this.center = undefined;
        this.width = undefined;
        this.height = undefined;
        this.depth = undefined;

        this.projection = "Perspective";
        this.translation = vec3.fromValues(0, 0, 0);
        this.rotationMatrix = mat4.create();
        this.scale = vec3.fromValues(1, 1, 1);

        this.triangles_count = undefined;
        this.MV = mat4.create();
        this.MVP = mat4.create();
        this.recalculateMV = true;
        this.recalculateMVP = true;
    }

    // MODEL CREATION AND UPDATES

    loadData(){
        this.status = 'SUCCESS';
        this.loadedCallback();
    }

    setLoadedCallback(callback){
        this.loadedCallback = callback;
    }

    determineModelInfo(){
        const vertices = this.model.vertices;
        for (const vertex of vertices) {
            const x = vertex[0], y = vertex[1], z = vertex[2];

            if (!this.bounds.length) this.bounds = [x, y, z, x, y, z];

            if (this.bounds[0] > x) this.bounds[0] = x;
            else if (this.bounds[3] < x) this.bounds[3] = x;

            if(this.bounds[1] > y) this.bounds[1] = y;
            else if(this.bounds[4] < y) this.bounds[4] = y;

            if(this.bounds[2] > z) this.bounds[2] = z;
            else if(this.bounds[5] < z) this.bounds[5] = z;
        }
        this.center = vec3.fromValues((this.bounds[0]+this.bounds[3])/2, (this.bounds[1]+this.bounds[4])/2, (this.bounds[2]+this.bounds[5])/2);
        this.width = Math.abs(this.bounds[3] - this.bounds[0]);
        this.height = Math.abs(this.bounds[4] - this.bounds[1]);
        this.depth = Math.abs(this.bounds[5] - this.bounds[2]);
    }

    setMatrices(){
        // Set View Matrix
        const camera = vec3.fromValues(0, 0, this.depth*2);
        const target = vec3.fromValues(0, 0, 0);
        const up = vec3.fromValues(0, 1, 0);
        this.viewMatrix = mat4.create();
        mat4.lookAt(this.viewMatrix, camera, target, up);
    }

    // RENDERING INFO GETTERS

    getTrianglesArray(){
        const triangles_array = [];
        let triangles_count = 0;
        for (let i = 0; i < this.faces.length; i++) {
            let first_he = this.half_edges[this.faces[i]];
            let second_he = this.half_edges[first_he[3]];
            let third_he = this.half_edges[second_he[3]];

            while (third_he[0] !== first_he[0]) {
                const vertex1 = this.vertices[first_he[0]];
                const vertex2 = this.vertices[second_he[0]];
                const vertex3 = this.vertices[third_he[0]];
                triangles_array.push(vertex1[0], vertex1[1], vertex1[2], vertex2[0], vertex2[1], vertex2[2], vertex3[0], vertex3[1], vertex3[2]);
                second_he = third_he;
                third_he = this.half_edges[third_he[3]];

                triangles_count++;
            }
        }
        if(!this.triangles_count) this.triangles_count = triangles_count;
        return new Float32Array(triangles_array)
    }

    getFacesNormalsArray(){
        const normals_array = [];
        for (let i = 0; i < this.faces.length; i++) {
            const face_normal = this.face_normals[i];

            let first_he = this.half_edges[this.faces[i]];
            let second_he = this.half_edges[first_he[3]];
            let third_he = this.half_edges[second_he[3]];

            while (third_he[0] !== first_he[0]) {
                normals_array.push(face_normal[0], face_normal[1], face_normal[2], face_normal[0], face_normal[1], face_normal[2], face_normal[0], face_normal[1], face_normal[2]);
                second_he = third_he;
                third_he = this.half_edges[third_he[3]];
            }
        }
        return new Float32Array(normals_array)
    }

    getColorsArray(){
        const colors_array = [];
        const color = vec4.fromValues(0.7, 0.7, 0.7, 1);
        for (let i = 0; i < this.faces.length; i++) {
            let first_he = this.half_edges[this.faces[i]];
            let second_he = this.half_edges[first_he[3]];
            let third_he = this.half_edges[second_he[3]];

            while (third_he[0] !== first_he[0]) {
                colors_array.push(color[0], color[1], color[2], color[0], color[1], color[2], color[0], color[1], color[2]);
                second_he = third_he;
                third_he = this.half_edges[third_he[3]];
            }
        }
        return new Float32Array(colors_array)
    }

    getModelMatrix(){
        const modelMatrix = mat4.create();
        const translation = vec3.fromValues(-this.center[0], -this.center[1], -this.center[2]);

        mat4.scale(modelMatrix, modelMatrix, this.scale);
        mat4.translate(modelMatrix, modelMatrix, this.translation);
        mat4.multiply(modelMatrix, modelMatrix, this.rotationMatrix);
        mat4.translate(modelMatrix, modelMatrix, translation);

        return modelMatrix;
    }

    getProjectionMatrix(){
        if(this.projection === "Orthogonal"){
            return this.getOrthogonalProjectionMatrix(this.gl);
        }
        return this.getPerspectiveProjectionMatrix(this.gl);
    }

    getOrthogonalProjectionMatrix(){
        const orthogonalProjectionMatrix = mat4.create();
        const aspect = this.gl.canvas.clientWidth/this.gl.canvas.clientHeight;

        let width, height;
        const margin = 1.5;
        if(this.gl.canvas.clientWidth < this.gl.canvas.clientHeight){
            width = this.width;
            height = this.width/aspect
        }else{
            width = this.height*aspect;
            height = this.height;
        }
        mat4.ortho(orthogonalProjectionMatrix, -(width/2)*margin, (width/2)*margin, -(height/2)*margin, (height/2)*margin, 1, this.depth*50);
        return orthogonalProjectionMatrix;
    }

    getPerspectiveProjectionMatrix(){
      const perspectiveProjectionMatrix = mat4.create();
      const aspect = this.gl.canvas.clientWidth/this.gl.canvas.clientHeight;
      const fieldOfViewRadians = degToRad(60);
      mat4.perspective(perspectiveProjectionMatrix, fieldOfViewRadians, aspect, 1, this.depth*50);

      return perspectiveProjectionMatrix;
    }

    getMV(){
        if(this.recalculateMV){
            mat4.multiply(this.MV, this.viewMatrix, this.getModelMatrix());
            this.recalculateMV = false;
            this.recalculateMVP = true;
        }
        return this.MV;
    }

    getMVP(gl){
        if(this.recalculateMVP){
            mat4.multiply(this.MVP, this.getProjectionMatrix(gl), this.getMV());
            this.recalculateMVP = false
        }
        return this.MVP;
    }
}