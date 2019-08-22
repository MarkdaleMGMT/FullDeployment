const inquirer = require('inquirer'); //Question and Answer
const publicIp = require('public-ip')
const fs = require('fs') //File Writer
const folder = process.argv[2]

let sampleEcosystemConfig = require(`./${folder}/sample-ecosystem.config`).apps

let inputDict = {} //This will store inputs that have been processed already

//Loop through all the sub-configs in this file
async function main(){
    let configIndex = 0
    for (configIndex; configIndex < sampleEcosystemConfig.length ; configIndex++){
        subConfig = sampleEcosystemConfig[configIndex]
    
        if (subConfig.hasOwnProperty('env')){
            fields = Object.keys(subConfig.env)
            let fieldIndex = 0
    
            for (fieldIndex; fieldIndex < fields.length; fieldIndex++){
                targetField = fields[fieldIndex]
                await processInput(targetField, configIndex)
                
            }
            
        }
    }

    let write = `module.exports = ${JSON.stringify(sampleEcosystemConfig)}`
    
    // Write data in 'Output.txt' . 
    fs.writeFile('ecosystem.config.js', write, (err) => { 
        
    // In case of a error throw err. 
    if (err) throw err; 
    }) 
}

//Processes 
async function processInput(targetField, configIndex){
    const ipAddress = await publicIp.v4()

    if (targetField != 'NODE_ENV'){
        if (targetField in inputDict){ //If we have input it before, use the same answer
            sampleEcosystemConfig[configIndex].env[targetField] = inputDict[targetField]
        } else { //We ask the user to input it

            answer = ""
            if (targetField == 'DB_PASS'){
                answer = await inquirer.prompt({
                    message: `Enter Input For ${targetField}?`,
                    type: 'password',
                    mask: '*',
                    name: 'answer'
                  });
            } else if (targetField == 'DB_HOST') {
                answer = await inquirer.prompt([
                    {
                        message: `Use Default IP Address (${ipAddress}) For ${targetField}?`,
                        type: 'confirm',
                        name: 'confirm'
                    }, 
                    {
                        type: 'input',
                        name: 'answer',
                        message: `Enter IP Address for ${targetField}`,
                        when: (answer) => { return !answer.confirm}
                  }]);
                
                if (answer.confirm){
                    answer.answer = ipAddress
                } 
                
            } else {
                answer = await inquirer.prompt([ {
                    type: 'input',
                    name: 'answer',
                    message: `Enter Input For ${targetField}?`,
                }])
                
                
            }
            answer = answer.answer
            sampleEcosystemConfig[configIndex].env[targetField] = answer
            inputDict[targetField] = answer
            
        }        
                
    }
    
    
}

main()
