var pokemons = []; //Object Pokemon
var useStat = [true, true, true, true, true, true]; //What stats should be used when calculationg? HP, Attack, Defence, Special Attacl, Special Defence, Speed
var fetchFinished = false; //Buttons shouldn't work while load isn't finished
var totalStatsOfPokemonId = []; //Push Id of Pokemon and the calculated stat total of relevant stats
var loadetPokemon = 0; //Wenn Scrolled to Button next Pokemon should get Loadet
var loadPokemonAmount = 30; //How many Pokemon should get loadet at the time?
//Load and Show all Pokemon
fetch("pokemon.json").then(function (response) { return response.json(); }).then(function (json) {
    var _a;
    pokemons = json;
    (_a = document.getElementById("header")) === null || _a === void 0 ? void 0 : _a.classList.remove("invisible");
    loadPokemons();
    fetchFinished = true;
});
//If Scrolled to Bottom, Load more Pokemon
window.onscroll = function () {
    if (pokemons.length == loadetPokemon) {
        return;
    }
    if (window.scrollY + 1 >= document.documentElement.scrollHeight - document.documentElement.clientHeight) {
        setTimeout(function () {
            var loadAmount = loadPokemonAmount;
            if ((pokemons.length - loadetPokemon) <= loadPokemonAmount) {
                loadAmount = pokemons.length - loadetPokemon;
            }
            var currentlyLoadetPokemon = loadetPokemon;
            for (var i = currentlyLoadetPokemon; i < loadAmount + currentlyLoadetPokemon; i++) {
                loadetPokemon++;
                createRow(pokemons[totalStatsOfPokemonId[i][0]]);
            }
        }, 500);
    }
};
//Function to show all pokemon
function loadPokemons() {
    totalStatsOfPokemonId = [];
    for (var i = 0; i < pokemons.length; i++) {
        var totalStats = 0;
        //calculate stat Total of relevant Stats
        for (var j = 0; j < useStat.length; j++) {
            if (useStat[j]) {
                totalStats = totalStats + pokemons[i].stats[j];
            }
        }
        //If Attack and Special Attack are turned on, remove Special Attack
        if (useStat[1] && useStat[3]) {
            if (pokemons[i].stats[3] <= pokemons[i].stats[1]) {
                totalStats = totalStats - pokemons[i].stats[3];
            }
            else {
                totalStats = totalStats - pokemons[i].stats[1];
            }
        }
        //Push Relevant Stat Total of pokemon i
        totalStatsOfPokemonId.push([i, totalStats]);
    }
    totalStatsOfPokemonId.sort(function (a, b) {
        return a[1] - b[1];
    });
    totalStatsOfPokemonId.reverse();
    //Create Row for Each Pokemon
    for (var i = 0; i < loadPokemonAmount; i++) {
        createRow(pokemons[totalStatsOfPokemonId[i][0]]);
    }
    loadetPokemon = loadPokemonAmount;
}
//Create Row for Pokemon
function createRow(pokemon) {
    var _a;
    var row = document.createElement("div");
    row.classList.add("divTableRow");
    var cells = [];
    //Append all Cells to Table Row and make sells accesable in cells array
    for (var i = 0; i < 10; i++) {
        var cell = document.createElement("div");
        cell.classList.add("divTableCell");
        row.appendChild(cell);
        cells.push(cell);
    }
    //make name of Pokemon usable for links
    var linkName = pokemon.name;
    if (pokemon.name !== "ting-lu" && pokemon.name !== "chi-yu" && pokemon.name !== "wo-chien" && pokemon.name !== "chien-pao") {
        linkName = pokemon.name.replace(/-/g, '');
    }
    //Cell 0 Image of Pokemon
    var img = document.createElement("img");
    img.src = pokemon.imageSrc;
    img.title = "https://www.serebii.net/pokedex-sv/" + linkName;
    img.onclick = function () {
        window.open("https://www.serebii.net/pokedex-sv/" + linkName, '_blank');
    };
    cells[0].appendChild(img);
    //Cell 1 Name of Pokemon
    var bigName = pokemon.name.replace(/(^|\/|-)(\S)/g, function (s) { return s.toUpperCase(); });
    cells[1].innerHTML = "<a href='https://www.serebii.net/pokedex-sv/" + linkName + "' target='_blank'>" + capitalize(bigName) + "</a>";
    //Cell 2 Abillity of Pokemon
    var abilities = "";
    for (var i = 0; i < pokemon.abilities.length; i++) {
        var ability = pokemon.abilities[i].replace(/(^|\/|-)(\S)/g, function (s) { return s.toUpperCase(); });
        abilities += "<a href='https://www.serebii.net/abilitydex/" + pokemon.abilities[i].replace(/-/g, '') + ".shtml' target='_blank'>" + capitalize(ability) + "</a><br>";
    }
    abilities = abilities.slice(0, -4);
    cells[2].innerHTML = abilities;
    //Cell 3-8 Stats of Pokemon
    var statTotal = 0;
    for (var i = 0; i < pokemon.stats.length; i++) {
        cells[i + 3].innerText = pokemon.stats[i];
        if (useStat[i]) {
            cells[i + 3].classList.add("turnedOn");
            statTotal = statTotal + pokemon.stats[i];
        }
        else {
            cells[i + 3].classList.add("turnedOff");
        }
    }
    if (useStat[1] && useStat[3]) {
        if (pokemon.stats[3] <= pokemon.stats[1]) {
            statTotal = statTotal - pokemon.stats[3];
            cells[6].classList.remove("turnedOn");
            cells[6].classList.add("turnedOff");
        }
        else {
            statTotal = statTotal - pokemon.stats[1];
            cells[4].classList.remove("turnedOn");
            cells[4].classList.add("turnedOff");
        }
    }
    //Cell 9 Total of all Relevant Stats
    cells[9].innerText = statTotal;
    (_a = document.getElementById("divTableBody")) === null || _a === void 0 ? void 0 : _a.appendChild(row);
}
//Make first letter in String big
function capitalize(string) {
    return string && string[0].toUpperCase() + string.slice(1);
}
//A button got clicked. Change clicked Stat und load Pokemon new
function changeStat(statNumber, button) {
    var _a, _b, _c, _d;
    if (!fetchFinished) {
        return;
    }
    if (useStat[statNumber]) {
        useStat[statNumber] = false;
        //You can't Turn off all Buttons
        if (useStat.every(function (element) { return element === false; })) {
            useStat[statNumber] = true;
            return;
        }
        //Stylings for button and header
        button.style.backgroundColor = "#dd6666";
        (_a = document.getElementById("stat" + statNumber)) === null || _a === void 0 ? void 0 : _a.classList.remove("turnedOn");
        (_b = document.getElementById("stat" + statNumber)) === null || _b === void 0 ? void 0 : _b.classList.add("turnedOff");
    }
    else {
        useStat[statNumber] = true;
        //Stylings for button and header
        button.style.backgroundColor = "#66dd66";
        (_c = document.getElementById("stat" + statNumber)) === null || _c === void 0 ? void 0 : _c.classList.remove("turnedOff");
        (_d = document.getElementById("stat" + statNumber)) === null || _d === void 0 ? void 0 : _d.classList.add("turnedOn");
    }
    //Remove all Pokemon before loading new ones
    var divTableRow = document.getElementsByClassName('divTableRow');
    for (var i = divTableRow.length - 1; i > 0; i--) {
        divTableRow[i].remove();
    }
    //After the Relevant Stats changed its time to load everything new
    loadPokemons();
}
