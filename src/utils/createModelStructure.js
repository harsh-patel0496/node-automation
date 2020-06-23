const path = require('path')
const fs = require('fs')
const modelPath = path.join(__dirname,`../models/`)
const eventEmitter = require('../events/eventBus')
const capitialize = (str) => {
    const fc = str[0].toUpperCase();
    return fc+str.substring(1,str.length)
}

const createModelStructure = (name) => {
    return new Promise((resolve,reject) => {
        const file = `${name}.js`;
        if (!fs.existsSync(modelPath)){
            fs.mkdirSync(modelPath);
        }
        const model = capitialize(name)
        if(!fs.existsSync(modelPath + file)){
            const statics = [
                "const mongoose = require('mongoose')",
                "\n",
                "const Schema = mongoose.Schema",
                "\n\n",
                `class ${model} {`,
                "\n",
                "\tconstructor() {",
                "\n",
                "\t\tthis.fields = {}",
                "\n",
                "\t\tthis.schema = Schema(this.fields,{ timestamps : true })",
                "\n",
                `\t\tthis.model = mongoose.model("${model}" , this.schema)`,
                "\n",
                "\t}",
                "\n",
                "}",
                "\n\n",
                `module.exports = new ${model}()`
            ]
        
            statics.map((static) => {
                fs.appendFileSync(modelPath + file,static,(err) => {})
            })
            resolve('Model created successfully')
        } else {
            reject('Model already exist')
        }
    })
    
        
}

module.exports = createModelStructure