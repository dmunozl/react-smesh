import FileHandlerFactory from './FileHandlerFactory'
import {vec3} from 'gl-matrix'

export class Model{
    constructor(file, updateCallback) {
        this.status = 'LOADING';
        this.updateCallback = () => updateCallback(this);

        const file_handler = FileHandlerFactory.getFileHandler(file);
        file_handler.getModelData((data) => {
            this.generateFromData(data);
            this.updateCallback();
        })
    }

    generateFromData(data){
        this.status = data['status'];
        if (this.status === 'ERROR'){
            this.error_message = data['error_message'];
            return
        }

        // --- GENERATE MODEL INFO FROM DATA ---
        this.bounds = data['bounds'];
        this.vertices = data['vertices'];
        this.vertices_start = data['vertices_start'];
        this.vertices_normals = [];
        this.faces = data['faces'];
        this.faces_normals = [];
        this.half_edges = data['half_edges'];

        this.completeFacesNormals();
        this.completeVerticesNormals();
        this.completeTwins();
    }

    completeTwins(){
        for (let i = 0; i < this.half_edges.length; i++) {
            const current = this.half_edges[i];
            const next = this.half_edges[current[3]];
            const check_list = this.vertices_start[next[0]];

            if (current[1] !== -1) {continue}

            for (let j = 0; j < check_list.length; j++) {
                const check = this.half_edges[check_list[j]];
                const check_next = this.half_edges[check[3]];

                if (check_next[0] === current[0]){
                    current[1] = check_list[j];
                    check[1] = j;
                    break;
                }
            }
        }
    }

    completeFacesNormals(){
        for (let i = 0; i < this.faces.length; i++){
            const first_he = this.half_edges[this.faces[i]];
            const second_he = this.half_edges[first_he[3]];
            const third_he = this.half_edges[second_he[3]];

            const vertex_1 = this.vertices[first_he[0]];
            const vertex_2 = this.vertices[second_he[0]];
            const vertex_3 = this.vertices[third_he[0]];

            const normal = vec3.create();
            const U = vec3.create();
            const V = vec3.create();

            vec3.subtract(U, vertex_2, vertex_1);
            vec3.subtract(V, vertex_3, vertex_1);
            vec3.cross(normal, U, V);
            vec3.normalize(normal, normal);

            this.faces_normals.push(normal);
        }
    }

    completeVerticesNormals(){
        for (let i = 0; i < this.vertices.length; i++) {
            const normal = vec3.create();
            const he_list = this.vertices_start[i];

            for (let j = 0; j < he_list.length; j++) {
                const face_normal = this.faces_normals[this.half_edges[he_list[j]][2]];
                vec3.add(normal, normal, face_normal);
            }

            vec3.normalize(normal, normal);
            this.vertices_normals.push(normal);
        }
    }
}