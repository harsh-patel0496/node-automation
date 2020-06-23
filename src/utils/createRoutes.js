const path = require('path')
const fs = require('fs')
const eventEmitter = require('../events/eventBus')
const routePath = path.join(__dirname,`../routes/`)

const capitialize = (str) => {
    const fc = str[0].toUpperCase();
    return fc+str.substring(1,str.length)
}

const createRoutes = (name) => {
    return new Promise((resolve,reject) => {
        const file = `${name}.js`;
        if (!fs.existsSync(routePath)){
            fs.mkdirSync(routePath);
        }
        if(!fs.existsSync(routePath + file)){
            const routes = [`const express = require('express')\nconst router = new express.Router()\nconst ${capitialize(name)} = require('../controllers/${name}Controller')\n\n\n`];
            const methods = ['index','save']
            const methodsWithParams = ['view','edit','delete']

            methods.map((method) => {
                let route = ''; 
                if(method == 'index'){
                    route = `router.get('/${name}/',async (req,res) => {\n\n\ttry{\n\t\tawait ${capitialize(name)}.${method}(req,res)\n\t} catch(e){\n\t\tconsole.log(e.message)\n\t}\n\n})\n\n\n`
                    routes.push(route);
                }
                if(method == 'save'){
                    route = `router.post('/${name}/save',async (req,res) => {\n\n\ttry{\n\t\tawait ${capitialize(name)}.${method}(req,res)\n\t} catch(e){\n\t\tconsole.log(e.message)\n\t}\n\n})\n\n\n`
                    routes.push(route);
                }
            })

            methodsWithParams.map((methodWithParam) => {
                if(methodWithParam == 'view'){
                    route = `router.get('/${name}/${methodWithParam}/:id',async (req,res) => {\n\n\ttry{\n\t\tawait ${capitialize(name)}.${methodWithParam}(req,res)\n\t} catch(e){\n\t\tconsole.log(e.message)\n\t}\n\n})\n\n\n`
                    routes.push(route);
                }
                if(methodWithParam == 'edit'){
                    route = `router.put('/${name}/${methodWithParam}/:id',async (req,res) => {\n\n\ttry{\n\t\tawait ${capitialize(name)}.${methodWithParam}(req,res)\n\t} catch(e){\n\t\tconsole.log(e.message)\n\t}\n\n})\n\n\n`
                    routes.push(route);
                }
                if(methodWithParam == 'delete'){
                    route = `router.patch('/${name}/${methodWithParam}/:id',async (req,res) => {\n\n\ttry{\n\t\tawait ${capitialize(name)}.${methodWithParam}(req,res)\n\t} catch(e){\n\t\tconsole.log(e.message)\n\t}\n\n})\n\n\n`
                    routes.push(route);
                }
            })
            routes.push(`module.exports = router`)
            routes.map((route) => {
                fs.appendFileSync(routePath + file,route,(err) => {})
            })
            resolve()
        } else {
            reject()
        }
    })
}

module.exports = createRoutes