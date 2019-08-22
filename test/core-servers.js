const Mocha = require('mocha');
const assert = require('chai').assert;
const Test = Mocha.Test;
const async = require('async')

const publicIp = require('public-ip')
//const ipAddress = "http://165.227.35.11"
//const ipAddress = `http://${publicIp.v4()}`
const axios = require('axios')

//console.log(ipAddress)

let today = new Date()
let datetime = `${today.getMonth()}/${today.getDate()} ${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`
console.log(datetime)

var userPrime = ""

tests = {
    backendTests: [
      {
        should: 'Should Create An Investment', 
        api: "/backend/investments/create",
        method: "post",
        body: {
          "investment_name": `Test @ ${datetime}`,
          "description":"Test Investment",
          "currency":"Test",
          "username":"admin",
          "rake":0.1,
          "affiliate_rake":0.5,
          "fx_rake":0 
        },
      },
      {
        should: 'Should Retrieve Created Investment',
        api: "/frontend/all_investments",
        method: "post",
        body: {},
        check: function(all_investments){
            all_investments = all_investments.investments
            targetInvestment = all_investments[all_investments.length - 1]
            return targetInvestment['investment_name'] == `Test @ ${datetime}`
        },
        checkMsg: "Investment Not Added!"
      }
    ],
    frontendTests: [
      {
        should: 'Should Create A New User', 
        api: "/frontend/test", 
        method: "post",
        body: {
         test: 0,
        },
      },
   ]
  }

mochaSuites = []
let mochaInstance = new Mocha();

let testKeys = Object.keys(tests)
let testIndex = 0

async function main(){
const ip = await publicIp.v4()
const ipAddress = `http://${ip}`

for (testIndex; testIndex < testKeys.length; testIndex++){
    key = testKeys[testIndex]
    targetTests = tests[key]

    let suiteInstance = Mocha.Suite.create(mochaInstance.suite, `${key}`);
    
    for (let i = 0; i < targetTests.length; i++){
        let test = targetTests[i]
        //console.log(test)

        suiteInstance.addTest(new Test(`${test.should}`, async function(){
            try{
                let res = ""

                if (test.method == 'post'){ //Check which REST method
                    res = await axios.post(`${ipAddress}${test.api}`, test.body)
                } else {
                    res = await axios.get(`${ipAddress}${test.api}`, test.body)
                }
                 
                //Perform test check method if available
                if (test.hasOwnProperty('check')) {
                    assert(test.check(res.data), test.checkMsg)
                    
                } else { //Test if response is okay
                    let resStatus = res.status
                    let data = JSON.stringify(res.data)
                    assert(true, `Response Status: ${resStatus}\nData: ${data}`)
                }

                } catch (error) {
                if (error.response){ //Api returns status != 200
                    resStatus = error.response.status
                    data = JSON.stringify(error.response.data)
                    assert(false, `Response Status: ${resStatus}\nData: ${data}`)
                } else { //Is it an error unrelated to http and api call?
                    assert(false, `${error}`)
                }
                console.log(error)
                }            
        }))
    }
}

mochaInstance.run()
}

main()
