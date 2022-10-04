'use strict';

const STATUSKOODIT = {
    OHJELMAVIRHE:0,
    EI_LOYTYNYT:1,
    LISAYS_OK:2,
    EI_LISATTY:3,
    JO_KAYTOSSA:4,
    POISTO_OK:5,
    EI_POISTETTU:6,
    PAIVITYS_OK:7,
    EI_PAIVITETTY:8
};

const STATUSVIESTIT = {
    OHJELMAVIRHE: () => ({
        viesti:'Anteeksi! Virhe ohjelmassamme',
        statuskoodi: STATUSKOODIT.OHJELMAVIRHE,
        tyyppi:'virhe'
    }),
    EI_LOYTYNYT: id => ({
        viesti:`Annetulla id:llä ${id} ei löytynyt tietoja`,
        statuskoodi:STATUSKOODIT.EI_LOYTYNYT,
        tyyppi:'virhe'
    }),
    LISAYS_OK: id=> ({
        viesti:`Tieto id:llä ${id} lisättiin`,
        statuskoodi:STATUSKOODIT.LISAYS_OK,
        tyyppi:'info'
    }),
    EI_LISATTY: ()=>({
        viesti:'Tietoja ei lisätty',
        statuskoodi:STATUSKOODIT.EI_LISATTY,
        tyyppi:'virhe'
    }),
    JO_KAYTOSSA: id =>({
        viesti:`Id ${id} oli jo käytössä`,
        statuskoodi:STATUSKOODIT.JO_KAYTOSSA,
        tyyppi:'virhe'
    }),
    POISTO_OK: id =>({
        viesti:`Tieto id:llä ${id} poistettiin`,
        statuskoodi:STATUSKOODIT.POISTO_OK,
        tyyppi:'info'
    }),
    EI_POISTETTU: ()=>({
        viesti:'Annetulla id:llä ei löytynyt tietoja. Mitään ei poistettu',
        statuskoodi:STATUSKOODIT.EI_POISTETTU,
        tyyppi:'virhe'
    }),
    PAIVITYS_OK: id =>({
        viesti:`Tiedot id:llä ${id} päivitettiin`,
        statuskoodi:STATUSKOODIT.PAIVITYS_OK,
        tyyppi:'info'
    }),
    EI_PAIVITETTY: ()=>({
        viesti:'Tietoja ei muutettu',
        statuskoodi:STATUSKOODIT.EI_PAIVITETTY,
        tyyppi:'virhe'
    })
};

module.exports={STATUSKOODIT, STATUSVIESTIT};

