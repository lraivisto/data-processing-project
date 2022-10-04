'use strict';

const sallitutTyypit=[
    'application/x-www-form-urlencoded',
    'application/json'
];

const kasittelePostData = req => new Promise((resolve,reject)=>{
    const tyyppi = req.headers['content-type'];

    if(sallitutTyypit.includes(tyyppi)){
        const datapuskuri=[];
        req.on('data', datapala=>datapuskuri.push(datapala));
        req.on('end', ()=>{
            const data=Buffer.concat(datapuskuri).toString();
            if(tyyppi==='application/json'){
                return resolve(JSON.parse(data));
            }
            else{
                const params=new URLSearchParams(data);
                const tulos = {};
                for (const [nimi, arvo] of params) {
                    tulos[nimi] = arvo;
                }
                return resolve(tulos);
            }
        });
        req.on('error', ()=>reject('Virhe tiedonsiirrossa'));
    }
    else {
        return reject('Virheellinen tyyppi');
    }
});

module.exports = { kasittelePostData};