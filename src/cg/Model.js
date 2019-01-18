import FileHandlerFactory from './FileHandlerFactory'

export class Model{
    constructor(file){
        const file_handler = FileHandlerFactory.getFileHandler(file);
        const data = file_handler.getModelData()
    }
}