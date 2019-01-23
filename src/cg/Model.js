import {vec4, mat4} from 'gl-matrix'

export default class Model {
    constructor() {
        // MODEL STATUS
        this.status = 'LOADING';
        this.message = 'Loading Model';

        // MODEL INFO
        this.vertices = [];
        this.vertices_start = [];
        this.vertices_normals = [];
        this.faces = [];
        this.half_edges = [];
        this.face_normals = [];

        // RENDERING INFO
        this.triangles_count = undefined;
        this.modelMaltrix = undefined;
        this.MV = mat4.create();
        this.MVP = mat4.create();
    }

    // MODEL CREATION AND UPDATES

    updateStatus(status, message){
        this.status = status;
        this.message = message;
    }

    addVertex(vertex){
        this.vertices.push(vertex);
        this.vertices_start.push([]);
        this.vertices_normals.push([]);
    }

    addHalfEdge(half_edge){
        this.half_edges.push(half_edge);
    }

    addFace(face){
        this.faces.push(face);
        this.face_normals.push([]);
    }

    updateVertexStart(vertex_index, value){
        this.vertices_start[vertex_index].push(value);
    }

    updateVertexNormal(vertex_index, normal){
        this.vertices_normals[vertex_index] = normal;
    }

    updateFaceNormal(face_index, normal){
        this.face_normals[face_index] = normal;
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
}