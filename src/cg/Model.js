import FileHandlerFactory from './FileHandlerFactory'
import Vertex from "./Elements/Vertex";
import Polygon from "./Elements/Polygon";

export default class Model{
    constructor(file, updateCallback) {
        this.status = 'LOADING';
        this.updateCallback = () => updateCallback(this);

        this.vertices = [];
        this.faces = [];

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

        data['vertices'].forEach((vertex, index) => this.vertices.push(new Vertex(index+1, ...vertex)));
        data['faces'].forEach((face, index) => {
            const polygon = new Polygon(index+1);
            face.forEach(vertex_index => {
                const vertex = this.vertices[vertex_index];
                polygon.vertices.push(vertex);
                vertex.polygons.push(polygon);
            });
            this.faces.push(polygon)
        });

        this.completeFacesNormals();
        this.completeVerticesNormals();
    }

    completeFacesNormals(){
        this.faces.forEach(face => face.calculateNormal())
    }

    completeVerticesNormals(){
        this.vertices.forEach(vertex => vertex.calculateNormal())
    }
}