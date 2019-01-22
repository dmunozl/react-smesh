export default class Model{
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
    }

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

    updateVertexStart(vertex_index, value) {
        this.vertices_start[vertex_index].push(value);
    }

    updateVertexNormal(vertex_index, normal){
        this.vertices_normals[vertex_index] = normal;
    }

    updateFaceNormal(face_index, normal){
        this.face_normals[face_index] = normal;
    }
}