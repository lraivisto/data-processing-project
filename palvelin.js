'use strict';
//noden kirjastot
const http = require('http');
const path = require('path');

//asetukset
const {
    port, 
    host, 
    sivumallit, 
    varastokansio, 
    kirjastokansio} = require('./config.json');

//omat kirjastot
const kirjastopolku=path.join(__dirname,kirjastokansio);
const {lue} = require(path.join(kirjastopolku,'tiedostokasittelija'));
const {
    kasittelePostData
} = require(path.join(kirjastopolku,'postkasittelija'));

const {
    laheta,
    onJoukossa} = require(path.join(kirjastopolku,'apufunktiot'));
const { 
    muodostaMalliOlio, 
    muodostaMallisivu,
    muodostaTaulukonRivit
} = require(path.join(kirjastopolku,'mallikasittelija'));

const Tietovarasto = 
    require(path.join(__dirname,varastokansio,'tietovarastokerros'));

const tietovarasto= new Tietovarasto();

const resurssiReitit=['/favicon','/tyylit/','/js/','/kuvat/'];

//polut
const sivumallitPolku = path.join(__dirname,sivumallit.kansio);
const valikkoPolku=path.join(sivumallitPolku, sivumallit.valikko);
const kaikkiPolku=path.join(sivumallitPolku,sivumallit.kaikki);
const statusPolku= path.join(sivumallitPolku,sivumallit.status);
const haePolku = path.join(sivumallitPolku, sivumallit.hae);
const tulosPolku = path.join(sivumallitPolku, sivumallit.tulos);
const lomakePolku = path.join(sivumallitPolku, sivumallit.lomake);

const palvelin = http.createServer(async (req,res)=>{
    const {pathname} = new URL(`http://${host}:${port}${req.url}`);
    const reitti = decodeURIComponent(pathname);

    const metodi = req.method.toUpperCase();

    if(metodi==='GET') {
        try{
            if(reitti==='/'){
                //lähetä valikko
                const tulos= await lue(valikkoPolku);
                laheta(res,tulos);
            }
            else if(reitti==='/kaikki'){
                //läheta kaikki
                const kaikkiHenkilot = await tietovarasto.haeKaikki();
                lahetaSivu(res, kaikkiPolku,{rivit:muodostaTaulukonRivit(kaikkiHenkilot)});
            }
            else if(reitti==='/hae'){
                //lähetä hakulomake
                lahetaSivu(res,haePolku, {
                    nimike:'Hae',
                    otsikko:'Hae',
                    toiminto:'/haehenkilo'
                });
            }
            else if(reitti==='/poistahenkilo'){
                lahetaSivu(res,haePolku,{
                    nimike:'Poisto',
                    otsikko:'Poista',
                    toiminto:'/poistahenkilo'
                });
            }
            else if(reitti==='/lisaalomake'){
                const data={
                    otsikko:'Lisää uusi henkilö',
                    toiminto:'/lisaa',
                    id:{value:'', readonly:''},
                    etunimi:{value:'', readonly:''},
                    sukunimi:{value:'', readonly:''},
                    osasto:{value:'', readonly:''},
                    palkka:{value:'', readonly:''}
                };
                lahetaSivu(res,lomakePolku,data);
            }
            else if(reitti==='/paivitalomake'){
                const data = {
                    otsikko: 'Muuta tietoja',
                    toiminto: '/paivita',
                    id: { value: '', readonly: '' },
                    etunimi: { value: '', readonly: 'readonly' },
                    sukunimi: { value: '', readonly: 'readonly' },
                    osasto: { value: '', readonly: 'readonly' },
                    palkka: { value: '', readonly: 'readonly' }
                };
                lahetaSivu(res, lomakePolku, data);
            }
            else if(onJoukossa(reitti, ...resurssiReitit)){
                const resurssi = await lue(path.join(__dirname,reitti));
                laheta(res,resurssi);
            }
            else{
                lahetaStatusSivu(res,'Resurssi ei ole käytössä');
            }

        }
        catch(virhe){
            lahetaStatusSivu(res,'Virhe luettaessa resurssia');
        }
    }
    else if(metodi==='POST'){
        try{
            if(reitti==='/haehenkilo'){
                const postData = await kasittelePostData(req);
                tietovarasto.hae(postData.id)
                    .then(tulos=>lahetaSivu(res,tulosPolku,{nimike:'Hakutulos',tulos}))
                    .catch(virhe=>lahetaStatusSivu(res,virhe.viesti,virhe.tyyppi));
            }
            else if(reitti==='/poistahenkilo'){
                const postData = await kasittelePostData(req);
                tietovarasto.poista(postData.id)
                    .then(status=>lahetaStatusSivu(res,status.viesti, status.tyyppi))
                    .catch(status=>lahetaStatusSivu(res,status.viesti,status.tyyppi));
            }
            else if (reitti === '/lisaa') {
                const postData = await kasittelePostData(req);
                tietovarasto.lisaa(postData)
                    .then(status => lahetaStatusSivu(res, status.viesti, status.tyyppi))
                    .catch(status => lahetaStatusSivu(res, status.viesti, status.tyyppi));
            }
            else if(reitti==='/paivita'){
                try{
                    const postData = await kasittelePostData(req);
                    const henkilo = await tietovarasto.hae(postData.id);
                    const data={
                        otsikko: 'Muuta tietoja',
                        toiminto: '/paivitatiedot',
                        id: { value: henkilo.id, readonly: 'readonly' },
                        etunimi: { value: henkilo.etunimi, readonly: '' },
                        sukunimi: { value: henkilo.sukunimi, readonly: '' },
                        osasto: { value: henkilo.osasto, readonly: '' },
                        palkka: { value: henkilo.palkka, readonly: '' }
                    };
                    lahetaSivu(res,lomakePolku,data);
                }
                catch(virhe){
                    lahetaStatusSivu(res, virhe.viesti, virhe.tyyppi);
                }
                
            }
            else if (reitti === '/paivitatiedot') {
                const postData = await kasittelePostData(req);
                tietovarasto.paivita(postData)
                    .then(status => lahetaStatusSivu(res, status.viesti, status.tyyppi))
                    .catch(status => lahetaStatusSivu(res, status.viesti, status.tyyppi));
            }
            else{
                lahetaStatusSivu(res,`Reitti ${reitti} ei ole käytössä`);
            }
        }
        catch(virhe){
            lahetaStatusSivu(res,'Virhe luettaessa resurssia');
        }
    }
    else {
        lahetaStatusSivu(res,'Metodi ei ole käytössä');
    }
}); //palvelimen loppu

palvelin.listen(port,host,
    ()=>console.log(`palvelin ${host}:${port} kuuntelee`));

async function lahetaStatusSivu(res, viesti, tyyppi='virhe'){
    await lahetaSivu(res,statusPolku,{
        nimike:'Status',
        otsikko:'Status',
        status:{viesti, tyyppi}
    });
};

async function lahetaSivu(res, polku, data){
    const sivuData= await lue(polku);
    const malliolio = muodostaMalliOlio(data);
    sivuData.tiedostoData=muodostaMallisivu(sivuData.tiedostoData, malliolio);
    laheta(res, sivuData);
}