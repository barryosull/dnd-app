
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

    let mousePos;
    this.trackMousePosition = function() {
        document.addEventListener('mousemove', (e) => {
            mousePos = new Position(e.clientX, e.clientY);
        })
    }

    this.prepareKeyboardShortcuts = function() {
        function keyDown(e) {
            e = e || window.event;

            if (e.key === 'p') {
                Actions.populatePlayers(mousePos);
            }
            if (e.key === 'g') {
                Actions.addGoblin(mousePos);
            }
            if (e.key === 'b') {
                Actions.addBugbear(mousePos);
            }
            if (e.key === 's') {
                Actions.addSildar(mousePos);
            }
            if (e.key === 'w') {
                Actions.addWolf(mousePos);
            }
            if (e.key === 'c') {
                Actions.clearCharacters();
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

    /**
     * @param {string} image
     * @param {string} type
     * @param {Position} position
     * @returns {HTMLImageElement}
     */
    this.addCharacter = function (image, type, position) {

        const charactersElem = document.getElementById('characters');

        ++characterId;

        const charRadius = 35;

        const characterElem = document.createElement("img");
        characterElem.id = 'character_' + characterId;
        characterElem.className = "character "+type;
        characterElem.src = 'images/characters/' + image;
        characterElem.style.left = (position.x - charRadius) + 'px';
        characterElem.style.top = (position.y - charRadius) + 'px';

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

        mousePos = new Position(200, 200);

        this.prepareAreaControls();
        this.prepareKeyboardShortcuts();
        this.prepareMusicControls();
        this.makeCharactersDeselectable();
        this.trackMousePosition();
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

    const characters = [];

    /**
     * @param {Position} position
     */
    this.populatePlayers = function(position) {
        characters.push(Controller.addCharacter('cleric.png', 'player', position.shiftLeft(100)));
        characters.push(Controller.addCharacter('fighter.png', 'player', position));
        characters.push(Controller.addCharacter('wizard.png', 'player', position.shiftRight(100)));
    };

    /**
     * @param {Position} position
     */
    this.addGoblin = function(position) {
        const goblin = Controller.addCharacter('goblin.png', 'enemy', position);
        characters.push(goblin);
    }

    /**
     * @param {Position} position
     */
    this.addBugbear = function(position) {
        const bugbear = Controller.addCharacter('bugbear.png', 'enemy', position);
        characters.push(bugbear);
    }

    /**
     * @param {Position} position
     */
    this.addWolf = function(position) {
        const wolf = Controller.addCharacter('wolf.png', 'enemy', position);
        characters.push(wolf);
    }

    /**
     * @param {Position} position
     */
    this.addSildar = function(position) {
        const sildar = Controller.addCharacter('sildar.png', 'npc', position);
        characters.push(sildar);
    }

    this.clearCharacters = function() {
        characters.forEach(npc => npc.remove());
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

class Position {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    /**
     * @param {int} amount
     * @returns {Position}
     */
    shiftLeft(amount) {
        return new Position(
            this.x - amount,
            this.y
        )
    }

    /**
     * @param {int} amount
     * @returns {Position}
     */
    shiftRight(amount) {
        return new Position(
            this.x + amount,
            this.y
        )
    }
}

Controller.boot();
