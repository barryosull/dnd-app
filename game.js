
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
    'characters/cleric.png',
];

const music = {
    intro: 'XbS3tPO9sUs',
    forest: '6Em9tLXbhfo',
    cave: 'E72yDpAfrgY',
    combat: ['8Q7cioftmKs', 'H8n7K3jABhI', 'fq8OSrIUST4'],
};

const Controller = new (function() {
    ///////////////////////////////////
    // Methods
    ///////////////////////////////////
    this.prepareAreaControls = function() {
        let selectElem = document.getElementById('area');
        for (var i in locations) {
            const imageTitle = locations[i].split('.')[0];
            const optionHtml = '<option value="' + i + '">' + imageTitle + '</option>';
            selectElem.innerHTML += optionHtml;
        }

        selectElem.onchange = function() {
            Renderer.changeImage(parseInt(this.value));
        }
    }

    this.prepareMusicControls = function() {
        let selectElem = document.getElementById('music-controls');
        for (var key in music) {
            const optionHtml = '<option value="' + key + '">' + key + '</option>';
            selectElem.innerHTML += optionHtml;
        }
        selectElem.onchange = function() {
            Controller.playMusic(music[this.value]);
        }
    }

    this.prepareKeyboardShortcuts = function() {
        function keyDown(e) {
            e = e || window.event;

            if (e.key === 'p') {
                Actions.populatePlayers();
            }
            if (e.key === 'g') {
                Actions.addGoblin();
            }
            if (e.key === 'b') {
                Actions.addBugbear();
            }
            if (e.key === 's') {
                Actions.addSildar();
            }
            if (e.key === 'w') {
                Actions.addWolf();
            }
            if (e.key === 'c') {
                Actions.clearNpcs();
            }
            if (e.key === 'h') {
                Actions.hurtSelected();
            }
            if (e.key === 'd') {
                Actions.killSelected();
            }

            if (e.code === 'ArrowLeft') {
                Renderer.imageBackward();
            }
            if (e.code === 'ArrowRight') {
                Renderer.imageForward();
            }
        }
        document.onkeydown = keyDown;
    }


    let characterId = 0;

    this.addCharacter = function (image, type, batchSize, batchPosition) {

        batchSize = batchSize ?? 1;
        batchPosition = batchPosition ?? 0;

        const charactersElem = document.getElementById('characters');

        ++characterId;

        const characterElem = document.createElement("img");
        characterElem.id = 'character_' + characterId;
        characterElem.className = "character "+type;
        characterElem.src = 'images/characters/' + image;

        const startX = ((batchSize-1)/2) * -80;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const offsetX = batchPosition * 80;
        characterElem.style.left = (startX + (centerX - 35) + offsetX) + 'px';
        characterElem.style.top = (centerY - 35) + 'px';

        charactersElem.appendChild(characterElem);

        this.makeSelectable(characterElem);
        this.makeDraggable(characterElem);

        return characterElem;
    }

    this.makeCharactersDeselectable = function() {
        document.addEventListener("click", deselectCharacters);
    }


    function dragstartHandler(ev) {
        //ev.dataTransfer.setData("text/plain", ev.target.id);
    }

    this.makeSelectable = function(characterElem) {
        characterElem.addEventListener("click", function(event) {
            event.preventDefault();
            event.stopPropagation();
            characterElem.classList.add("selected");
        });
    }

    function deselectCharacters() {
        Array.from(document.getElementsByClassName('selected')).forEach(characterElem => {
            characterElem.classList.remove("selected");
        });
    }

    let topCharacterZIndex = 1;
    this.makeDraggable = function(characterElem) {

        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        const startDragging = function (e) {
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

        const dragElement = function (e) {
            e.preventDefault();
            // calculate the new cursor position:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            characterElem.style.left = (characterElem.offsetLeft - pos1) + "px";
            characterElem.style.top = (characterElem.offsetTop - pos2) + "px";
        }

        const stopDragging = function () {
            document.onmouseup = null;
            document.onmousemove = null;
        }

        characterElem.addEventListener("mousedown", startDragging);
    }

    this.boot = function() {
        this.prepareAreaControls();
        this.prepareKeyboardShortcuts();
        this.prepareMusicControls();
        this.makeCharactersDeselectable();
        Renderer.preloadImages();
        Renderer.changeImage(0);
    }

    ///////////////////////////////////
    // Boot
    ///////////////////////////////////
})();

const Renderer = new (function() {

    let currImageIndex = 0;

    this.imageForward = function() {
        const nextImageIndex = currImageIndex + 1;
        if (!locations[nextImageIndex]) {
            return;
        }
        this.changeImage(nextImageIndex);
    };

    this.imageBackward = function() {
        const nextImageIndex = currImageIndex - 1;
        if (!locations[nextImageIndex]) {
            return;
        }
        this.changeImage(nextImageIndex);
    };

    const backgroundElem = document.getElementById('background');
    const locationElem = document.getElementById('location');

    this.changeImage = function(imageIndex) {
        let selectElem = document.getElementById('area');
        selectElem.value = imageIndex;

        currImageIndex = imageIndex;
        const image = locations[imageIndex];


        backgroundElem.style['background-image'] = 'url("images/' + image + ' ")';
        locationElem.style['background-image'] = 'url("images/' + image + ' ")';
    };

    let preloadedImages = [];

    this.preloadImages = function() {
        locations.forEach((location, i) => {
            preloadedImages[i] = new Image();
            preloadedImages[i].src = 'images/' + location;
        });
    }
})();

const Actions = new (function(){

    const npcs = [];

    this.populatePlayers = function() {
        players.forEach((player, i) =>  Controller.addCharacter(player, 'player', players.length, i));
    };

    this.addGoblin = function() {
        const goblin = Controller.addCharacter('goblin.png', 'enemy');
        npcs.push(goblin);
    }

    this.addBugbear = function() {
        const bugbear = Controller.addCharacter('bugbear.png', 'enemy');
        npcs.push(bugbear);
    }

    this.addWolf = function() {
        const wolf = Controller.addCharacter('wolf.png', 'enemy');
        npcs.push(wolf);
    }

    this.addSildar = function() {
        const sildar = Controller.addCharacter('sildar.png', 'npc');
        npcs.push(sildar);
    }

    this.clearNpcs = function() {
        npcs.forEach(npc => npc.remove());
    }

    this.hurtSelected = function() {
        Array.from(document.getElementsByClassName('selected')).forEach(characterElem => {
            characterElem.classList.add("hurt");
        });
    }

    this.killSelected = function() {
        Array.from(document.getElementsByClassName('selected')).forEach(characterElem => {
            characterElem.classList.remove("hurt");
            characterElem.classList.add("dead");
        });
    }

    this.playMusic = function(youtubeId) {
        if (Array.isArray(youtubeId)) {
            youtubeId = youtubeId[Math.floor(Math.random() * youtubeId.length)];
        }
        document.getElementById('music').src = "https://www.youtube.com/embed/" + youtubeId + "?autoplay=1&t=0";
    }

})();

Controller.boot();
