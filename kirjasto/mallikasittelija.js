'use strict';

function muodostaMalliOlio(arvot){
    const malliavaimet={};
    for(let kentta of Object.keys(arvot)){
        if(typeof arvot[kentta] === 'object'){
            for(let avain of Object.keys(arvot[kentta])){
                malliavaimet[`##${kentta.toUpperCase()}.${avain.toUpperCase()}##`]=
                        arvot[kentta][avain]
            }
        }
        else {
            malliavaimet[`##${kentta.toUpperCase()}##`]=arvot[kentta];
        }
    }
    return malliavaimet;
}

function muodostaMallisivu(sivu, malliolio){
    for(let kentta of Object.keys(malliolio)){
        // sivu = sivu.replaceAll(kentta, malliolio[kentta]); //node versio 15->
        do{
            sivu=sivu.replace(kentta, malliolio[kentta]);
        } while(sivu.indexOf(kentta)>0);
    }
    return sivu;
}

function muodostaTaulukonRivit(taulukko){
    let rivit='';
    for(let alkio of taulukko){
        rivit+='<tr>';
        for(let soluarvo of Object.values(alkio)){
            rivit+=`<td>${soluarvo}</td>`;
        }
        rivit+='</tr>';
    }
    return rivit;
}

module.exports = { muodostaMalliOlio, muodostaMallisivu, muodostaTaulukonRivit};


