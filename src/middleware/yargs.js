const yargs = require('yargs')
const createModelStructure = require('../utils/createModelStructure')
const createControllerStructure = require('../utils/createControllerStructure')

    yargs.command({
        command: 'create',
        describe: 'Add a new note',
        builder:{
            model: {
                describe: 'Model Name',
                type: 'string'
            },
            controller: {
                describe: 'Controller Name',
                type: 'string'
            }
        },
        handler: function (argv) {
            if(argv.model){
                const model = argv.model
                createModelStructure(model).then((result) => {
                    console.log(result)
                }).catch((error)=> {
                    console.log(error)
                })
            }
            
            if(argv.controller){
                options = {
                    resource:false
                }
                if(argv.resource){
                    options = {
                        resource:true
                    }    
                }
                const controller = argv.controller
                createControllerStructure(controller,options).then((result) => {
                    console.log(result)
                }).catch((error) => {
                    console.log(error)
                })
            }
        }
    })

    //yargs.parse()
    
module.exports = yargs.parse();