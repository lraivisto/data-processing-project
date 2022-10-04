'use strict';

const laheta = (res,resurssi,statuskoodi=200)=>{
    res.writeHead(statuskoodi, {
        'Content-Type':resurssi.mime.tyyppi,
        'Content-Length':Buffer.byteLength(resurssi.tiedostoData,
            resurssi.mime.koodaus)
    });
    res.end(resurssi.tiedostoData, resurssi.mime.koodaus);
};

const onJoukossa = (reitti, ...reittienAlkuosat)=>{
    for(let alku of reittienAlkuosat){
        if(reitti.startsWith(alku)) return true;
    }
    return false;
};

module.exports={laheta, onJoukossa};