'use strict';

const fs = require('fs').promises;

async function lueVarasto(varastoTiedosto) {
    try{
        const data= await fs.readFile(varastoTiedosto,'utf8');
        return JSON.parse(data);
    }
    catch(virhe){
        return [];
    }
}

async function kirjoitaVarasto(varastoTiedosto, data){
    try{
        await fs.writeFile(varastoTiedosto,
            JSON.stringify(data, null, 4), {
                encoding:'utf8',
                flag:'w'
            });
        return true;
    }
    catch(virhe){
        return false;
    }
}

module.exports={lueVarasto, kirjoitaVarasto};