const fs = require('fs');
const path = require('path');
// In newer Node.js versions where process is already global this isn't necessary.
const process = require("process");
//Replaces regex matching strings in files
const replace = require('replace-in-file');
const publicIp = require('public-ip')

const inquirer = require('inquirer')
var ipAddress

/**
 * Matches IP address regex and changes it to the public ip address of the
 * local server
 */
async function configureIP(filePath) {
    let options = {
        files: filePath,
        //Finda all instances that matches the ip address regex
        from: /(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)/g,
        //Replace matches to to
        to: ipAddress,
    }

    try {
        await replace(options)
    } catch (err) {
        console.log(err)
    }
}

/**
 * Recursivily traverses the root folder
 * Adjusted from https://stackoverflow.com/questions/32511789/looping-through-files-in-a-folder-node-js
 * @param {*} rootFolder 
 */
async function traverse(rootFolder) {
    fs.readdir(rootFolder, function (err, files) {
        if (err) {
            console.error("Could not list the directory.", err);
            process.exit(1);
        }

        files.forEach(function (file, index) {
            // Make one pass and make the file complete
            var fromPath = path.join(rootFolder, file);

            fs.stat(fromPath, async function (error, stat) {
                if (error) {
                    console.error("Error stating file.", error);
                    return;
                }

                if (stat.isFile()) { //If it is a file, change all ip instances
                    //console.log("Changing IP at %s", fromPath)
                    await configureIP(fromPath)
                } else if (stat.isDirectory()) { //If directory recursively traverse
                    traverse(fromPath)
                }
            });
        });
    });
}


/**
 * Run the algorithm on the command line argument
 * i.e node consistentIP.js rootFolder
 */
async function main() {

    ipAddress = await publicIp.v4()
    answer = await inquirer.prompt([ 
        {
            message: `Use Default IP Address (${ipAddress}) frontEndApp?`,
            type: 'confirm',
            name: 'confirm'
        }, 
        {
            type: 'input',
            name: 'answer',
            message: `Enter IP Address for FrontendApp`,
            when: (answer) => { return !answer.confirm}
        },
    ])

    if (!answer.confirm){
        ipAddress = answer.answer
    }
    rootFolder = process.argv[2]
    traverse(rootFolder)
    

}

main()