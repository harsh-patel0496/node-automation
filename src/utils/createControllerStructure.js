const path = require('path')
const fs = require('fs')
const assert = require('assert')
const eventEmitter = require('../events/eventBus')
const controllerPath = path.join(__dirname,`../controllers/`)
const createRoutes = require('./createRoutes')
const createModelStructure = require('./createModelStructure')
const indexPath = path.join(__dirname,`../index.js`)
const capitialize = (str) => {
    const fc = str[0].toUpperCase();
    return fc+str.substring(1,str.length)
}

const createControllerStructure = (name,{ resource }) => {
    return new Promise(async(resolve,reject) => {
        const file = `${name}Controller.js`;
        if (!fs.existsSync(controllerPath)){
            fs.mkdirSync(controllerPath);
        }
        const controller = capitialize(name)+'Controller'
        if(!fs.existsSync(controllerPath + file)){
            let methods = [];
            let preDefinedMethods = ['index','save','view','edit','delete']
            if(resource){
                //Prepare array for controller's methods
                preDefinedMethods.map((method) => {
                    const line = `\n\n\t${method}(req,res){\n\n\t\t// List\n\t\treturn new Promise(async (resolve,reject) => {\n\n\t\t}) \n\n\t}\n\n`
                    methods.push(line)
                })
                try{
                    await createRoutes(name)
                    var lines = fs.readFileSync(indexPath).toString().split("\n");

                    lines.map((line,index,arr) => {
                        if(line === "const express = require(\'express\')\r"){
                            const isInclude = arr.some((line,index,arr) => {
                                //Check the route is already added to the index file
                                return line.split(";")[0].trim() === `const ${name}Router = require('./routes/${name}')`
                            })
                            if(!isInclude){
                                lines.splice(index + 1,0,`const ${name}Router = require('./routes/${name}')`)
                            }
                        }
                         
                        if(line === "const app = express()\r"){
                            const isDeclare = arr.some((line,index,arr) => {
                                //Check the router middleware is already created.
                                return line.split(";")[0].trim() === `app.use(${name}Router)')`
                            })
                            if(!isDeclare){
                                lines.splice(index + 1,0,`\napp.use(${name}Router)`)
                            }
                            // if(!lines.includes(`app.use(${name}Router)`)){
                            //     lines.splice(index + 1,0,`\napp.use(${name}Router)`)
                            // }
                        }
                        
                    })

                    const writeLines = lines.join('\n');
                    fs.writeFileSync(indexPath, writeLines, function (err) {
                        if (err) console.log(err);
                    });
                } catch(e){
                    console.log(e)
                    reject('Route already exist!')
                    assert.fail();
                }
                
                try{
                    await createModelStructure(name)
                } catch(e){
                    eventEmitter.emit('deleteFile','route',`${name}.js`)
                    reject(e)
                    assert.fail()
                }
            }

            //Initialize the statics e.g(import model,initialize controller class)
            const statics = [
                `// const ${capitialize(name)} = require('../models/${name}')`,
                "\n\n",
                `class ${controller} {`,
                `\n\n\tconstructor() {`,
                `\n\n\t\t// Construct your own variables here\n\n\t}`

            ]

            const posts = [
                `}\n\nmodule.exports = new ${controller}()`
            ]
            
            statics.map((static) => {
                fs.appendFileSync(controllerPath + file,static,(err) => {})
            })

            methods.map((method) => {
                fs.appendFileSync(controllerPath + file,method,(err) => {})
            })

            posts.map((post) => {
                fs.appendFileSync(controllerPath + file,post,(err) => {})
            })
            resolve('Controller created successfully')
        } else {
            reject('Controller already exist')
        }
    })
}

module.exports = createControllerStructure