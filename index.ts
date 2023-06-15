let pokemons: { name: string, abilities: string[], imageSrc: string, stats: number[] }[] = []; //Object Pokemon
let useStat: boolean[] = [true, true, true, true, true, true]; //What stats should be used when calculationg? HP, Attack, Defence, Special Attacl, Special Defence, Speed
let allowUserInteraction: boolean = false; //Buttons shouldn't work while load isn't finished
let totalStatsOfPokemonId: number[][] = []; //Push Id of Pokemon and the calculated stat total of relevant stats
let loadetPokemon: number = 0; //Wenn Scrolled to Button next Pokemon should get Loadet
let loadPokemonAmount: number = 52; //How many Pokemon should get loadet at the time?
//Load and Show all Pokemon
fetch("pokemon.json").then(response => response.json()).then(json => {
    pokemons = json;
    document.getElementById("header")?.classList.remove("invisible");
    loadPokemons();
});
//If Scrolled to Bottom, Load more Pokemon
window.onscroll = function() {
    if(!allowUserInteraction){
        return;
    }
    if(pokemons.length == loadetPokemon){
        return;
    }
    if (document.documentElement.scrollHeight - document.documentElement.scrollTop - 1 <= document.documentElement.clientHeight) {
        setTimeout(function () {
            let loadAmount: number = loadPokemonAmount;
            if ((pokemons.length - loadetPokemon) <= loadPokemonAmount) {
                loadAmount = pokemons.length - loadetPokemon;
            }
            let currentlyLoadetPokemon = loadetPokemon;
            for (let i = currentlyLoadetPokemon; i < loadAmount + currentlyLoadetPokemon; i++) {
                loadetPokemon++;
                createRow(pokemons[totalStatsOfPokemonId[i][0]]);
            }
        }, 500);
    }
};
//Function to show all pokemon
function loadPokemons() {
    let startTimer:Date = new Date();
    totalStatsOfPokemonId = [];
    for (let i = 0; i < pokemons.length; i++) {
        let totalStats: number = 0;
        //calculate stat Total of relevant Stats
        for (let j = 0; j < useStat.length; j++) {
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
    for (let i = 0; i < loadPokemonAmount; i++) {
        createRow(pokemons[totalStatsOfPokemonId[i][0]]);
    }
    loadetPokemon = loadPokemonAmount;
    //If the Computer is Slow, Not everything should be loadet at once
    if(new Date().getTime() - startTimer.getTime() < 50){
        for (let i = loadetPokemon; i < pokemons.length; i++) {
            createRow(pokemons[totalStatsOfPokemonId[i][0]]);
        }
        loadetPokemon = pokemons.length;
    }
    allowUserInteraction = true;
}
//Create Row for Pokemon
function createRow(pokemon: { name: string, abilities: string[], imageSrc: string, stats: number[] }) {
    let row = document.createElement("div");
    row.classList.add("divTableRow");
    let cells: any[] = [];
    //Append all Cells to Table Row and make sells accesable in cells array
    for (let i = 0; i < 10; i++) {
        let cell = document.createElement("div");
        cell.classList.add("divTableCell");
        row.appendChild(cell);
        cells.push(cell);
    }
    //make name of Pokemon usable for links
    let linkName = pokemon.name;
    if (pokemon.name !== "ting-lu" && pokemon.name !== "chi-yu" && pokemon.name !== "wo-chien" && pokemon.name !== "chien-pao") {
        linkName = pokemon.name.replace(/-/g, '');
    }
    //Cell 0 Image of Pokemon
    let img: any = document.createElement("img");
    img.src = pokemon.imageSrc;
    img.title = "https://www.serebii.net/pokedex-sv/" + linkName;
    img.onclick = function () {
        window.open("https://www.serebii.net/pokedex-sv/" + linkName, '_blank');
    }
    cells[0].appendChild(img);
    //Cell 1 Name of Pokemon
    let bigName: string = pokemon.name.replace(/(^|\/|-)(\S)/g, s => s.toUpperCase());
    cells[1].innerHTML = "<a href='https://www.serebii.net/pokedex-sv/" + linkName + "' target='_blank'>" + capitalize(bigName) + "</a>";
    //Cell 2 Abillity of Pokemon
    let abilities: string = "";
    for (let i = 0; i < pokemon.abilities.length; i++) {
        let ability: string = pokemon.abilities[i].replace(/(^|\/|-)(\S)/g, s => s.toUpperCase());
        abilities += "<a href='https://www.serebii.net/abilitydex/" + pokemon.abilities[i].replace(/-/g, '') + ".shtml' target='_blank'>" + capitalize(ability) + "</a><br>";
    }
    abilities = abilities.slice(0, -4);
    cells[2].innerHTML = abilities;
    //Cell 3-8 Stats of Pokemon
    let statTotal: number = 0;
    for (let i = 0; i < pokemon.stats.length; i++) {
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
    document.getElementById("divTableBody")?.appendChild(row);
}

//Make first letter in String big
function capitalize(string: string) {
    return string && string[0].toUpperCase() + string.slice(1);
}
//A button got clicked. Change clicked Stat und load Pokemon new
function changeStat(statNumber: number, button: HTMLElement) {
    if (!allowUserInteraction) {
        return;
    }
    allowUserInteraction = false;
    if (useStat[statNumber]) {
        useStat[statNumber] = false;
        //You can't Turn off all Buttons
        if (useStat.every(element => element === false)) {
            useStat[statNumber] = true;
            allowUserInteraction = true;
            return;
        }
        //Stylings for button and header
        button.style.backgroundColor = "#dd6666";
        document.getElementById("stat" + statNumber)?.classList.remove("turnedOn");
        document.getElementById("stat" + statNumber)?.classList.add("turnedOff");
    }
    else {
        useStat[statNumber] = true;
        //Stylings for button and header
        button.style.backgroundColor = "#66dd66";
        document.getElementById("stat" + statNumber)?.classList.remove("turnedOff");
        document.getElementById("stat" + statNumber)?.classList.add("turnedOn");
    }
    //Remove all Pokemon before loading new ones
    var divTableRow = document.getElementsByClassName('divTableRow');
    for (let i = divTableRow.length - 1; i > 0; i--) {
        divTableRow[i].remove();
    }
    //After the Relevant Stats changed its time to load everything new
    loadPokemons();
}

