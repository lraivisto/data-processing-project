'use strict';

const {lue} = require('./kirjasto/tiedostokasittelija');
const { 
    muodostaMalliOlio, 
    muodostaMallisivu 
} = require('./kirjasto/mallikasittelija');


const data = {
    nimike: 'Testisivu',
    otsikko: 'Viesti',
    viesti: 'Tämä on tekstiä',
    data: { etunimi: 'Matti', sukunimi: 'Puro' }
};

(async ()=>{
    const malliolio = muodostaMalliOlio(data);
    console.log(malliolio);
    const sivuData = await lue('./apu.html');
    console.log(sivuData);
    sivuData.tiedostoData=
        muodostaMallisivu(sivuData.tiedostoData,malliolio);
    console.log(sivuData);

})();

