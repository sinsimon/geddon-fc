var objTeam = {};
var pairingArray = [];
var colonnaOrdinata = 1;

// Nomi autorizzati da filtrare
const nomiAutorizzati = [
    "Gasperi Michele",
    "Nobili Luca",
    "Galeotti Gregorio",
    "Cortesi Marco",
    "Bosi Federico",
    "Vanitelli Raimondo",
    "Fantini Enrico",
    "Zoli Mattia",
    "Bertozzi Alessandro",
    "Limongiello Lorenzo",
    "Malvasi Alessandro",
    "Romagnoli Fabio",
    "Bachiorri Lorenzo",
    "Mazzotti Simone",
    "Gardini Luca",
    "Garompolo Francesco",
    "Ghiselli Jean Marie",
    "Casanova Enrico",
    "Tentoni Daniele",
    "Foschi Francesco",
    "Ceredi Marco",
    "Lega Davide",
    "Fantini Alessandro",
    "Lugaresi Matteo",
    "Spagnoletti Marco",
    "Drudi Manuel",
    "Zoppi Jacopo",
    "Bonetti Fabrizio",
    "Tioli Mirco",
    "Ciuffolini Luca",
    "Pazzi Francesco",
    "Mosconi Luca",
    "Monti Ercolani Silvio",
    "Babbi Matteo",
    "Apollonio Daniele",
    "Alvisi Federico",
    "Di Vincenzo Giuseppe",
    "Maggiori Franco",
    "Carlotti Emanuele",
    "Erokhin Konstantin",
    "Tiselli Francesco",
    "Biondi Simone",
    "Furani Matteo",
    "D'Anna Alessandro",
    "Cardi Paolo",
    "Fabbri Stefania",
    "Ballauri Edoardo",
    "Pasqualini Marcello",
    "Piccoli Andrea",
    "Rocca Lorenzo",
    "Ragazzini Paolo",
    "Verità Mattia",
    "Servadei Sebastiano",
    "Laurenzi Alberto",
    "Ceccarelli Canali Ruben",
    "Ricci Alex",
    "Kubik Peter",
    "Agatensi Tommaso",
    "Campana Giovanni",
    "Battistini Serafino",
    "Bettini Biancamaria",
    "Padulazzi Massimiliano",
    "Matani Matteo",
    "Galeotti Stefano",
    "Grattoni Federico",
    "Bucciotti Andrea",
    "Masutti Stefano",
    "Ricci Elia",
    "Bombardi Daniele",
    "Garattoni Federico",
    "Gori Davide",
    "Baroni Enea",
    "Rocchi Alessandro",
    "Longhi Giulio",
    "Bonora Luca",
    "Amati Federico",
    "Baruffini Riccardo",
    "Sbraci Luca",
    "Scaringella Lucia",
    "Giunchi Alessandro"
];

async function richiestaJson() {
    const nomeJson = "/.netlify/functions/proxy?v=" + Date.now();
    const rispostaJson = await fetch(nomeJson);
    const datiJson = await rispostaJson.json();
    modificaTitolo(datiJson.data);
    arrayGiocatori(datiJson.data);
    generaPairings(datiJson.data);
    stampaPairings(pairingArray);
}

richiestaJson()

function modificaTitolo(dati) {
    var titolo = document.getElementById('titolo');
    var titoloTorneo = dati.EventName;
    var roundAttuale = dati.CurrentRoundNumber;
    titolo.innerHTML = titoloTorneo + ' - Round ' + roundAttuale;
}

function arrayGiocatori(dati) {
    var giocatori = {};
    for (var i = 0; i < dati.Persons.length; i++) {
        giocatori[dati.Persons[i]._id] = dati.Persons[i].LastName + ' ' + dati.Persons[i].FirstName;
    }
    for (var i = 0; i < dati.Teams.length; i++) {
        var idTeam = dati.Teams[i]._id;
        objTeam[idTeam] = dati.Teams[i];
        objTeam[idTeam].PlayerName = giocatori[objTeam[idTeam].Players[0]];
    }
}

function generaPairings(dati) {
    var roundAttuale = dati.CurrentRoundNumber;

    for (var incontro of dati.MatchingTables) {
        if (incontro.RoundNumber != roundAttuale) {
            continue;
        }

        if (incontro.GameByes1 == 1) {
            var row = { 'table': '0', 'player1': objTeam[incontro.Team1].PlayerName, 'puntiPlayer1': objTeam[incontro.Team1].MatchPoints, 'player2': 'BYE', 'puntiPlayer2': '-' };
            pairingArray.push(row);
            continue;
        }

        if (incontro.Player1 == null) {
            var row = { 'table': '0', 'player1': objTeam[incontro.Team1].PlayerName, 'puntiPlayer1': objTeam[incontro.Team1].MatchPoints, 'player2': 'LOSS', 'puntiPlayer2': '-' };
            pairingArray.push(row);
            continue;
        }

        var row = { 'table': incontro.Number, 'player1': objTeam[incontro.Team1].PlayerName, 'puntiPlayer1': objTeam[incontro.Team1].MatchPoints, 'player2': objTeam[incontro.Team2].PlayerName, 'puntiPlayer2': objTeam[incontro.Team2].MatchPoints };
        pairingArray.push(row);

        var row = { 'table': incontro.Number, 'player1': objTeam[incontro.Team2].PlayerName, 'puntiPlayer1': objTeam[incontro.Team2].MatchPoints, 'player2': objTeam[incontro.Team1].PlayerName, 'puntiPlayer2': objTeam[incontro.Team1].MatchPoints };
        pairingArray.push(row);
    }
    pairingArray = pairingArray.sort(function (a, b) {
        var nameA = a.player1.toUpperCase(); // ignore upper and lowercase
        var nameB = b.player1.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        // names must be equal
        return 0;
    });
}

function stampaPairings(data) {
    var table = document.getElementById('mioTable');
    var contenutoTable = '';
    for (var i = 0; i < data.length; i++) {
        // Filtra solo i giocatori autorizzati
        if (!nomiAutorizzati.includes(data[i].player1) && !nomiAutorizzati.includes(data[i].player2)) {
            continue;  // Salta la riga se nessun giocatore è autorizzato
        }

        var puntiP1 = data[i].puntiPlayer1;
        if (puntiP1 == undefined) { puntiP1 = 0 };
        var puntiP2 = data[i].puntiPlayer1;
        if (puntiP2 == undefined) { puntiP1 = 0 };

        var row = `<tr>
                        <td>${data[i].table}</td>
                        <td>${data[i].player1}</td>
                        <td>${puntiP1}</td>
                        <td>${data[i].player2}</td>
                        <td>${puntiP2}</td>
                  </tr>`;
        contenutoTable += row;
    }
    table.innerHTML = contenutoTable;
}

function sortTable(colonna) { //da migliorare per qualsiasi numero di colonne
    if (colonna != colonnaOrdinata) {
        colonnaOrdinata = colonna;
        var titoloTavolo = document.getElementById('titoloNumTav');
        var titoloGiocatore = document.getElementById('titoloNomeP1');
        var nuovoTitoloTavolo = '';
        var nuovoTitoloGiocatore = '';
        if (colonna == 0) {
            pairingArray = pairingArray.sort(function (a, b) {
                return a.table - b.table;
            });
            nuovoTitoloTavolo = 'Table &#9660';
            nuovoTitoloGiocatore = 'Player 1';
        }
        if (colonna == 1) {
            pairingArray = pairingArray.sort(function (a, b) {
                var nameA = a.player1.toUpperCase(); // ignore upper and lowercase
                var nameB = b.player1.toUpperCase(); // ignore upper and lowercase
                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }

                // names must be equal
                return 0;
            });
            nuovoTitoloTavolo = 'Table';
            nuovoTitoloGiocatore = 'Player 1 &#9660';
        }
        stampaPairings(pairingArray);
        titoloTavolo.innerHTML = nuovoTitoloTavolo;
        titoloGiocatore.innerHTML = nuovoTitoloGiocatore;
    }
}
