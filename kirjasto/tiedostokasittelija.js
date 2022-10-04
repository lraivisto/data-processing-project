'use strict';

const fs = require('fs').promises;
const path = require('path');

// jos tunniste ei ole alla olevassa oliossa,
// tulkitaan tyypiksi: application/octet-stream
const MIMETYYPIT = {
    '.html':{tyyppi:'text/html', koodaus:'utf8'},
    '.js':{tyyppi:'text/javascript', koodaus:'utf8'},
    '.css':{tyyppi:'text/css', koodaus:'utf8'},
    '.json':{tyyppi:'application/json', koodaus:'utf8'},
    '.png':{tyyppi:'image/png', koodaus:'binary'},
    '.jpg':{tyyppi:'image/jpeg', koodaus:'binary'},
    '.jpeg':{tyyppi:'image/jpeg', koodaus:'binary'},
    '.gif':{tyyppi:'image/gif', koodaus:'binary'},
    '.ico':{tyyppi:'image/vnd.microsoft.icon', koodaus:'binary'}
};

function lue(polku){
    const tunniste=path.extname(polku).toLowerCase();
    let mime = MIMETYYPIT[tunniste] || {
        tyyppi:'application/octet-stream',
        koodaus:'binary'
    }
    return new Promise(async (resolve, reject)=>{
        try{
            const tiedostoData= await fs.readFile(polku,mime.koodaus);
            resolve({tiedostoData, mime});
        }
        catch(virhe){
            reject(virhe);
        }
    });
}

module.exports={lue}