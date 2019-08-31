const util = require('util');
const exec = util.promisify(require('child_process').exec);
const sleep = require('util').promisify(setTimeout)

const ora = require('ora'); //Fancy Loading Spinner
const dashboardFolder = process.argv[2]

const commands = [ //Shell Commands To Be Executed
    //Instance of command object:
    //{message: user friendly message, command: commands run on shell}
    // {
    //     command: [
    //         `touch ./${dashboardFolder}/src/config.js`,
    //         `node inputFrontend.js ./${dashboardFolder}/src/config`
    //     ], 
    //     message: 'Setting up config file'
    // },
    {
        command: [
            `cd ${dashboardFolder}`,
            'sudo npm install --verbose', 

        ],
        message: 'Installing Folder Dependancies'
    },
    {
        command: [
            `sudo npm run build`
        ], 
        message: 'Building Production Build'
    },
    {
        command: [
            `sudo cp -r "./${dashboardFolder}/build" "/var/www/"`
        ], 
        message: 'Copying Production Build'
    },
    {
        command: [
            "sudo service nginx restart",
            "sudo systemctl restart nginx",
            "sudo systemctl reload nginx"
        ], 
        message: 'Restarting NGINX'
    },

]

async function main() {
  
    let i = 0
    for (i; i < commands.length ; i++){//Iterate through all of the commands
        let tempCommand = commands[i]
        let tempSpinner = ora(tempCommand.message).start()

        let stdout = ""
        let stderr = ""
        try {
            for (j = 0; j < tempCommand.command.length; j++){
                stdout, stderr = await exec(tempCommand.command[j])
                console.log(stdout)
            }
            
            tempSpinner.succeed()

        } catch (err) { //Any Exit Code other than 0
            tempSpinner.fail()
            console.log(err)
            console.log(stderr)
            break
        }
    
    }
}



main()