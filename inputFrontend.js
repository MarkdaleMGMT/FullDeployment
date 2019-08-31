const inquirer = require('inquirer'); //Question and Answer
const publicIp = require('public-ip')
const fs = require('fs') //File Writer

//Argv index starts at 2 starts at 2!
let filePath = process.argv[2]
let configObject = require(filePath)

skipKeys = ['multipleStatements', 'connectionLimit']
ipKeys = ['ipAddress', 'host', 'Host', 'ip-address', 'serverIP']
passwordKeys = ['password']
//filePath is a .js file that exports a module

async function main(){
    const ipAddress = await publicIp.v4()

    let i = 0
    keys = Object.keys(configObject)
    for (i; i < keys.length; i++){
        key = keys[i]
        answer = ""

        if (skipKeys.includes(key)) {
            //Do nothing
        } else if (passwordKeys.includes(key)) { //Ask password related question
            answer = await inquirer.prompt({
                message: `Enter ${key}?`,
                type: 'password',
                mask: '*',
                name: 'answer'
              });
        } else if (ipKeys.includes(key)){ //Ask IP related questions
            answer = await inquirer.prompt([ 
                {
                    message: `Use Default IP Address (${ipAddress}) For ${key}? Type No to enter Domain`,
                    type: 'confirm',
                    name: 'confirm'
                }, 
                {
                    type: 'input',
                    name: 'answer',
                    message: `Enter IP Address or Domain for ${key}:`,
                    when: (answer) => { return !answer.confirm}
                },
                {
                    type: 'list',
                    name: 'http',
                    choices: ['http://', 'https://', 'None'],
                    message: `Do You Want To Prepend Anything to IP/Domain?`,
                }
            ]);
            
            if (answer.confirm){ //Did they want to use default ip?
                answer.answer = ipAddress
            } 

            //Prepend http or https based on user input
            if (answer.http == 'http://' || answer.http == 'https://'){
                answer.answer = `${answer.http}${answer.answer}`
            }

        } else { //Ask anything else in the config file
            answer = await inquirer.prompt(
                {
                    type: "input",
                    name: "answer",
                    message: `Enter ${key}?`
                })
              
        }
        configObject[key] = answer.answer
    }

    let write = `module.exports = ${JSON.stringify(configObject)}`
    
    // Write data to filePath
    fs.writeFile(`${filePath}.js`, write, (err) => { 
        
    // In case of a error throw err. 
    if (err) throw err; 
    }) 

}

main()
