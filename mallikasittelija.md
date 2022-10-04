# Mallikasittelija


## malli html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <title>##NIMIKE##</title>
</head>
<body>
    <h1>##OTSIKKO##</h1>
    <p>##VIESTI##</p>
</body>
</html>
```

## funktio **muodostaMalliOlio(arvot)**

arvot on olio 
```js
{
    nimike:'Testisivu',
    otsikko:'Viesti',
    viesti:'Tämä on tekstiä',
    data:{etunimi:'Matti', sukunimi:'Puro'}
}
```
funktio palauttaa olion
```js
{
    ##NIMIKE##:'Testisivu',
    ##OTSIKKO##:'Viesti',
    ##VIESTI##:'Tämä on tekstiä',
    ##DATA.ETUNIMI##:'Matti',
    ##DATA.SUKUNIMI##:'Puro'
}
```

## funktio **muodostaMallisivu(sivu, malliolio)**

korvaa malliolion arvoilla sivulla olevat mallimerkinnät