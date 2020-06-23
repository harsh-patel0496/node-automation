const EventEmitter = require('events')
const emiter = new EventEmitter()
const path = require('path')
const fs = require('fs')
const modelPath = path.join(__dirname,`../models/`)
const controllerPath = path.join(__dirname,`../controllers/`)
const routePath = path.join(__dirname,`../routes/`)

const deleteFiles = (module,file) => {
    let path = ''
    switch(module){
        case 'model':
            path = modelPath + file
            break;
        case 'controller':
            path = controllerPath + file
            break;
        case 'route':
            path = routePath + file
            break;

    }
    if(fs.existsSync(path)){
        fs.unlinkSync(path)
    }
        
}

//Delete file incase of failure
emiter.on('deleteFile',(module,file) => {
    deleteFiles(module,file)
})

module.exports = emiter;