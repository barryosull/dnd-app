
let currImageIndex = 0;

const locations = [
    'transitions/title.jpeg',
    'maps/world.jpg',
    'transitions/journey.jpeg',
    'maps/road.webp',
    'transitions/trail.jpeg',
    'maps/cave-1.png',
    'maps/cave-2.png',
    'maps/cave-3.png',
    'maps/cave-4.png',
    'maps/cave-5.png',
    'maps/cave-6.png',
    'maps/cave-7.png',
    'maps/cave-8.png',
    'maps/phandalin.jpg',
];

const players = [
    'characters/fighter.png',
    'characters/wizard.png',
    'characters/dwarf.png',
];

const music = {
    intro: 'XbS3tPO9sUs',
    forest: '6Em9tLXbhfo',
    cave: 'E72yDpAfrgY',
    combat: ['8Q7cioftmKs', 'H8n7K3jABhI', 'fq8OSrIUST4'],
};

const npcs = [];

function imageForward() {
    const nextImageIndex = currImageIndex + 1;
    if (!locations[nextImageIndex]) {
        return;
    }
    changeImage(nextImageIndex);
}

function imageBackward() {
    const nextImageIndex = currImageIndex - 1;
    if (!locations[nextImageIndex]) {
        return;
    }
    changeImage(nextImageIndex);
}

function changeImage(imageIndex) {
    let selectElem = document.getElementById('area');
    selectElem.value = imageIndex;

    currImageIndex = imageIndex;
    const image = locations[imageIndex];
    const backgroundElem = document.getElementById('background');
    const imageElem = document.getElementById('image');

    backgroundElem.style['background-image'] = 'url("images/' + image + ' ")';
    imageElem.style['background-image'] = 'url("images/maps/grid.png"), url("images/' + image + ' ")';
}

var preloadedImages = new Array()
function preloadImages() {
    for (var i in locations) {
        preloadedImages[i] = new Image();
        preloadedImages[i].src = 'images/' + locations[i];
    }
}

function prepareAreaControls() {
    let selectElem = document.getElementById('area');
    for (var i in locations) {
        const imageTitle = locations[i].split('.')[0];
        const optionHtml = '<option value="' + i + '">' + imageTitle + '</option>';
        selectElem.innerHTML += optionHtml;
    }

    selectElem.onchange = function() {
        changeImage(parseInt(this.value));
    }
}

function prepareMusicControls() {
    let selectElem = document.getElementById('music-controls');
    for (var key in music) {
        const optionHtml = '<option value="' + key + '">' + key + '</option>';
        selectElem.innerHTML += optionHtml;
    }
    selectElem.onchange = function() {
        playMusic(music[this.value]);
    }
}

function prepareKeyboardShortcuts() {
    document.onkeydown = function (e) {
        e = e || window.event;

        if (e.key == 'p') {
            populatePlayers();
        }
        if (e.key == 'g') {
            addGoblin();
        }
        if (e.key == 'b') {
            addBugbear();
        }
        if (e.key == 's') {
            addSildar();
        }
        if (e.key == 'w') {
            addWolf();
        }
        if (e.key == 'c') {
            clearNpcs();
        }
        if (e.key == 'h') {
            hurtSelected();
        }
        if (e.key == 'd') {
            killSelected();
        }

        if (e.code == 'ArrowLeft') {
            imageBackward();
        }
        if (e.code == 'ArrowRight') {
            imageForward();
        }
    }
}

function dragstartHandler(ev) {
    ev.dataTransfer.setData("text/plain", ev.target.id);
}

function populatePlayers() {

    for (var i in players) {
        drawCharacter(players[i], 'player', players.length, i);
    }
}

function addGoblin() {
    const goblin = drawCharacter('goblin.png', 'enemy');
    npcs.push(goblin);
    return "OK";
}

function addBugbear() {
    const bugbear = drawCharacter('bugbear.png', 'enemy');
    npcs.push(bugbear);
}

function addWolf() {
    const wolf = drawCharacter('wolf.png', 'enemy');
    npcs.push(wolf);
}

function addSildar() {
    const sildar = drawCharacter('sildar.png', 'npc');
    npcs.push(sildar);
}

function clearNpcs() {
    for (var i in npcs) {
        npcs[i].remove();
    }
}

characterId = 0;
function drawCharacter(image, type, batchSize, batchPosition) {

    batchSize = batchSize ?? 1;
    batchPosition = batchPosition ?? 0;

    const charactersElem = document.getElementById('characters');

    ++characterId;

    const characterElem = document.createElement("img");
    characterElem.id = 'character_' + characterId;
    characterElem.className = "character "+type;
    characterElem.src = 'images/' + image;

    const startX = ((batchSize-1)/2) * -80;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const offsetX = batchPosition * 80;
    characterElem.style.left = (startX + (centerX - 35) + offsetX) + 'px';
    characterElem.style.top = (centerY - 35) + 'px';

    charactersElem.appendChild(characterElem);

    makeSelectable(characterElem);
    makeDraggable(characterElem);

    return characterElem;
}

function makeSelectable(characterElem) {
    characterElem.addEventListener("click", function(event) {
        event.preventDefault();
        event.stopPropagation();
        characterElem.classList.add("selected");
    });
}

function makeCharactersDeselectable() {
    document.addEventListener("click", deselectCharacters);
}

function deselectCharacters() {
    Array.from(document.getElementsByClassName('selected')).forEach(characterElem => {
        characterElem.classList.remove("selected");
    });
}

var topCharacterZIndex = 1;
function makeDraggable(characterElem) {

    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    const startDragging = function(e) {
        deselectCharacters();
        e.preventDefault();
        e.stopPropagation();
        characterElem.classList.add("selected");
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = stopDragging;
        document.onmousemove = dragElement;
        topCharacterZIndex++;
        characterElem.style['z-index'] = topCharacterZIndex;
    }

    const dragElement = function(e) {
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        characterElem.style.left = (characterElem.offsetLeft - pos1) + "px";
        characterElem.style.top = (characterElem.offsetTop - pos2) + "px";
    }

    const stopDragging = function() {
        document.onmouseup = null;
        document.onmousemove = null;
    }

    characterElem.addEventListener("mousedown", startDragging);
}

function hurtSelected() {
    Array.from(document.getElementsByClassName('selected')).forEach(characterElem => {
        characterElem.classList.add("hurt");
    });
}

function killSelected() {
    Array.from(document.getElementsByClassName('selected')).forEach(characterElem => {
        characterElem.classList.remove("hurt");
        characterElem.classList.add("dead");
    });
}

function playMusic(youtubeId) {
    if (Array.isArray(youtubeId)) {
        youtubeId = youtubeId[Math.floor(Math.random() * youtubeId.length)];
    }
    document.getElementById('music').src = "https://www.youtube.com/embed/" + youtubeId + "?autoplay=1&t=0";
}


// Do the work
preloadImages();
prepareAreaControls();
prepareKeyboardShortcuts();
changeImage(7);
prepareMusicControls();
makeCharactersDeselectable();
// playMusic(music.intro);
