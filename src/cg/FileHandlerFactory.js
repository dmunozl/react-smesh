import OffFileHandler from './FileHandlers/OffFileHandler'
import NoFileHandler from './FileHandlers/NoFileHandler'

class FileHandlerFactory{
    getFileHandler(file){
        const file_extension = file.name.split('.').pop();
        switch(file_extension){
            case 'off':
                return new OffFileHandler(file);
            default:
                return new NoFileHandler(file);
        }
    }
}

const instance = new FileHandlerFactory();
Object.freeze(instance);

export default instance;