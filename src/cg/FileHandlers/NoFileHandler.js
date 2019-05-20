export default class NoFileHandler {
    constructor(file) {
        this.file_extension = file.name.split('.').pop()
    }

    getModelData(){
        console.log(`${this.file_extension} extension not supported`)
    }
}

