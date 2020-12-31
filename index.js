const express = require('express')
const app = express()
const axios = require('axios')
const port = 3030
const {
    clientId,
    secret,
}= require('./keys')
const REDIRECT_URI = 'http://localhost:3000'
//TODO: move this to the server
const userName = clientId 
const password = secret 
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

const postData = async (baseURL, path, data = {}) => {
    const options = {
        baseURL,
        url: path,
        method: 'post',
        headers: {
            // 'Content-Type': 'application/json',
            'Authorization': 'Basic ' + Buffer.from(userName + ":" + password).toString('base64'),
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          data
      }
      return axios(options).then(res => res).catch(e => e)
}

app.get('/login', (req, res) => {
    const {
        query: {
            code = ''
        },
    } = req;
    (async () => { 
        const body = `grant_type=authorization_code&code=${code}&redirect_uri=${REDIRECT_URI}`
            const token = await postData('https://www.reddit.com', '/api/v1/access_token', body);
            const {
                status,
                data, 
            } = token;
            const {
                error,
            } = data;
           if (status === 200) {
               if (error === 'invalid_grant') return res.status(401).json(data)
               res.status(200).json(data)
           } else {
               res.status(500)
           }
      })();
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})