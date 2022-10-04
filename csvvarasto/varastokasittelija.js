'use strict';

const fs = require('fs');
const readline = require('readline');

async function lueVarasto(varastotiedosto){
    const linereader = readline.createInterface({
        input: fs.createReadStream(varastotiedosto)
    });

    const rivit=[];
    try{
        for await (const rivi of linereader){
            rivit.push(rivi);
        }
        // console.log(rivit);
        const data=[];
        for( let rivi of rivit){
            // console.log(rivi.split('","'));
            data.push(rivi.split('","').map(d=>d.replace(/["]/g,'')));
        }
        // console.log(data);
        return csvToJson(data);

    }
    catch(virhe){
        return [];
    }
}

async function kirjoitaVarasto(varastotiedosto, data){
    try{
        await fs.promises.writeFile(varastotiedosto, luoCsv(data),{
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

//muunnosfunktiot
function csvToJson(data){
    const [otsikot, ...tiedot] = data;
    // console.log(otsikot);
    // console.log(tiedot);
    const jsonData=[];
    for(let alkio of tiedot){
        if(alkio.length===otsikot.length) {
            const olio={};
            for(let i=0; i<otsikot.length; i++){
                olio[otsikot[i]]=alkio[i];
            }
            jsonData.push(olio);
        }
    }
    // console.log(jsonData);
    return jsonData;
}

function luoCsv(data){
    let csvmerkkijono='';
    if(data.length>0){
        csvmerkkijono='"'+Object.keys(data[0]).join('","')+'"\n';
        for (let alkio of data) {
            csvmerkkijono += '"' + Object.values(alkio).join('","') + '"\n';
        }
    }
    // console.log(csvmerkkijono);
    return csvmerkkijono;
}


// (async ()=>{
//     const tulos=await lueVarasto('./henkilot.csv');
//     console.log(tulos);
//     await kirjoitaVarasto('./henkilot2.csv',tulos);
// })();