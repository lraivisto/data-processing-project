'use strict';

const {STATUSKOODIT, STATUSVIESTIT} = require('./statuskoodit');

const {
    haeKaikkiVarastosta,
    haeYksiVarastosta,
    lisaaVarastoon,
    poistaVarastosta,
    paivitaVarasto
} = require('./varastoapufunktiot');

//Tietovarastoluokka

module.exports = class Tietovarasto{

    get STATUSKOODIT(){
        return STATUSKOODIT;
    };

    haeKaikki(){
        return haeKaikkiVarastosta();
    } //haeKaikki loppu

    hae(id){
        return new Promise(async (resolve,reject)=>{
            if(!id){
                reject(STATUSVIESTIT.EI_LOYTYNYT('--tyhjä--'));
            }
            else{
                const tulos = await haeYksiVarastosta(id);
                if(tulos){
                    resolve(tulos);
                }
                else {
                    reject(STATUSVIESTIT.EI_LOYTYNYT(id));
                }
            }
        });
    } //hae loppu

    lisaa(uusi){
        return new Promise(async (resolve, reject)=>{
            if(uusi) {
                if(!uusi.id){
                    reject(STATUSVIESTIT.EI_LISATTY());
                }
                else if (await haeYksiVarastosta(uusi.id)){;
                    reject(STATUSVIESTIT.JO_KAYTOSSA(uusi.id))
                }
                else if(await lisaaVarastoon(uusi)){
                    resolve(STATUSVIESTIT.LISAYS_OK(uusi.id));
                }
                else {
                    reject(STATUSVIESTIT.EI_LISATTY());
                }
            }
            else {
                reject(STATUSVIESTIT.EI_LISATTY());
            }
        });
    }//lisaa loppu

    poista(id){
        return new Promise(async (resolve,reject)=>{
            if (!id) {  //id nolla menee myös tänne
                reject(STATUSVIESTIT.EI_LOYTYNYT('--tyhjä--'));
            }
            else if(await poistaVarastosta(id)){
                resolve(STATUSVIESTIT.POISTO_OK(id));
            }
            else {
                reject(STATUSVIESTIT.EI_POISTETTU());
            }
        });
    }// poista loppu

    paivita(muutettuOlio) {
        return new Promise(async (resolve,reject)=>{
            if(muutettuOlio){
                if(await paivitaVarasto(muutettuOlio)){
                    resolve(STATUSVIESTIT.PAIVITYS_OK(muutettuOlio.id));
                }
                else{
                    reject(STATUSVIESTIT.EI_PAIVITETTY());
                }
            }
            else {
                reject(STATUSVIESTIT.EI_PAIVITETTY());
            }
        });
    } //paivitys loppu


} //luokan loppu