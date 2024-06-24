const express = require("express")
const bodyParser = require("body-parser")
const request = require("request")
const https = require("https")
const app = express()
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended: true}))

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html")
})

app.post("/", (req, res) => {
    let firstName = req.body.first_name
    let lastName = req.body.last_name
    let email = req.body.email

    let data = {
        members: [
            {
                email_address: email,
                email_type: "html",
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }

    let jsonData = JSON.stringify(data)

    const url = "https://us17.api.mailchimp.com/3.0/lists/4084d84853"

    const options = {
        method: "POST",
        auth: "gareth1:5c9e469e43294d43ba75c2b572704754-us17"
    }

    const request = https.request(url, options, function(response){

        if(response.statusCode === 200){
            res.sendFile(__dirname + "/success.html")
        } else {
            res.sendFile(__dirname + "/failure.html")
        }

        response.on("data", function(data){
            console.log(JSON.parse(data))
        })
    })

    

    request.write(jsonData)
    request.end()

})

app.post("/failure", (req, res) => {
    res.redirect("/")
})

app.listen(process.env.PORT || 3000, () => {
console.log("server is running")
})