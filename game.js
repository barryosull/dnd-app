
class Game {
    constructor(locations) {
        this.locatons = locations;
    }
}

class Backdrop {
    /**
     * @param {string} image
     */
    constructor(image) {
        this.image = image;
    }
}

class Map {
    /**
     * @param {string} image
     */
    constructor(image) {
        this.image = image;
    }
}

class Level {
    /**
     * @param {Room[]} rooms
     */
    constructor(rooms) {
        this.rooms = rooms;
    }
}

class Room {
    /**
     * @param {string} image
     */
    constructor(image) {
        this.image = image;
    }
}


////////////////////////////////////////////////
// Boot the game
////////////////////////////////////////////////

const locations = [
    new Backdrop('transitions/title.jpeg'),
    new Map('locations/world.jpg'),
    new Backdrop('transitions/journey.jpeg'),
    new Map('locations/road.webp'),
    new Backdrop('transitions/trail.jpeg'),
    new Level([
        new Room('locations/cave-1.png'),
        new Room('locations/cave-2.png'),
        new Room('locations/cave-3.png'),
        new Room('locations/cave-4.png'),
        new Room('locations/cave-5.png'),
        new Room('locations/cave-6.png'),
        new Room('locations/cave-7.png'),
        new Room('locations/cave-8.png'),
    ]),
    new Map('locations/phandalin.jpg'),
    new Backdrop('locations/stonehill-inn.jpeg'),
    new Backdrop( 'locations/barthens.webp'),
    new Backdrop( 'locations/alderleaf-farm.png'),
    new Backdrop( 'locations/minors-exchange.png'),
    new Backdrop( 'locations/lionshield-closter.jpeg'),
    new Backdrop( 'locations/shop-weapons.jpg'),
    new Backdrop('locations/shop-armour.jpg'),
    new Backdrop('locations/shop-gear.jpg'),
    new Backdrop('locations/shrine-of-luck.jpeg'),
    new Backdrop( 'locations/edermath-orchard.jpeg'),
    new Backdrop('locations/townmasters-hall.jpeg'),
    new Backdrop('locations/sleeping-giant.webp'),
    new Map('locations/sleeping-giant-map.jpeg'),
    new Backdrop('locations/tresendar-manor.jpeg'),
    new Backdrop('locations/redbrand-courtyard.jpeg'),
    new Level([
        new Room('locations/redbrand-1.png'),
        new Room('locations/redbrand-2.png'),
        new Room('locations/redbrand-3.png'),
        new Room('locations/redbrand-4.png'),
        new Room('locations/redbrand-5.png'),
        new Room('locations/redbrand-6.png'),
        new Room('locations/redbrand-7.png'),
        new Room('locations/redbrand-8.png'),
        new Room('locations/redbrand-9.png'),
        new Room('locations/redbrand-10.png'),
        new Room('locations/redbrand-11.png'),
        new Room('locations/redbrand-12.png'),
    ]),
    new Map('locations/forest.jpeg'),
];

const game = new Game(locations);


const Controller = new (function() {
    ///////////////////////////////////
    // Methods
    ///////////////////////////////////
    this.prepareAreaControls = function() {
       Renderer.renderLocationSelect();

        document.addEventListener('dblclick', e => {
            const locationElem = document.getElementById('location');
            const backgroundElem = document.getElementById('background');
            const isZoomingIn = locationElem.style.width !== '200%';

            function zoomIn() {
                backgroundElem.style.display = 'none';
                locationElem.style.width = '200%';
                locationElem.style.height = '200%';
                locationElem.style.position = 'relative';
            }

            function zoomOut() {
                backgroundElem.style.display = 'block';
                locationElem.style.width = '100%';
                locationElem.style.height = '100%';
                locationElem.style.position = 'fixed';
            }

            if (isZoomingIn) {
                zoomIn();
                return;
            }
            zoomOut();
        });
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
                Actions.addEnemy('goblin.png', mousePos);
            }
            if (e.key === 'b') {
                Actions.addEnemy('bugbear.png', mousePos);
            }
            if (e.key === 'w') {
                Actions.addEnemy('wolf.png', mousePos);
            }
            if (e.key === 'r') {
                Actions.addEnemy('redbrand.jpeg', mousePos);
            }
            if (e.key === 's') {
                Actions.addSildar(mousePos);
            }

            if (e.key === 'n') {
                Actions.addEnemy('nothic.png', mousePos);
            }
            if (e.key === 'i') {
                Actions.addEnemy('iarno.png', mousePos);
            }

            if (e.key === '[') {
                Renderer.scaleCharactersDown();
            }
            if (e.key === ']') {
                Renderer.scaleCharactersUp();
            }

            if (e.key === 'c') {
                Actions.clearCharacters();
            }
            if (e.key === 'h') {
                Actions.hurtSelected();
            }
            if (e.key === 'H') {
                Actions.healSelected();
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

        ++characterId;
        const characterElem = Renderer.drawCharacter(characterId, type, image, position)

        this.makeSelectable(characterElem);
        this.makeDraggable(characterElem);
        this.makeHoverable(characterElem);

        return characterElem;
    }

    this.makeCharactersDeselectable = function() {
        document.addEventListener("click", deselectCharacters);
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

    this.makeHoverable = function(characterElem) {
        characterElem.addEventListener("mouseover", e => {
            let id = characterElem.attributes['data-enemy-id'];
            if (!id) {
                return;
            }
            console.clear();
            console.log('Enemy ID: ' + id);
        });
    }

    this.boot = function() {

        mousePos = new Position(200, 200);

        this.prepareAreaControls();
        this.prepareKeyboardShortcuts();
        this.makeCharactersDeselectable();
        this.trackMousePosition();
        Renderer.preloadImages();
        Renderer.changeLocation(0);
    }

    ///////////////////////////////////
    // Boot
    ///////////////////////////////////
})();

const Renderer = new (function() {

    let locations = [];
    game.locatons.forEach(location => {
        if (location instanceof Backdrop || location instanceof Map) {
            locations.push(location.image);
        }
        if (location instanceof Level) {
            location.rooms.forEach(room => {
                locations.push(room.image);
            });
        }
    });

    let currImageIndex = null;

    this.renderLocationSelect = function() {

        let selectElem = document.getElementById('area');

        function addOptions(id, title) {
            const optionHtml = '<option value="' + id + '">' + title + '</option>';
            selectElem.innerHTML += optionHtml;
        }

        locations.forEach((location, index) => {
            const title = location.split('.')[0];
            addOptions(index, title);
        });

        selectElem.onchange = function() {
            Renderer.changeLocation(parseInt(this.value));
        }
    }

    this.imageForward = function() {
        const nextImageIndex = currImageIndex + 1;
        if (!locations[nextImageIndex]) {
            return;
        }
        this.changeLocation(nextImageIndex);
    };

    this.imageBackward = function() {
        const nextImageIndex = currImageIndex - 1;
        if (!locations[nextImageIndex]) {
            return;
        }
        this.changeLocation(nextImageIndex);
    };

    const backgroundElem = document.getElementById('background');
    const locationElem = document.getElementById('location');

    this.changeLocation = function(imageIndex) {
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

    let characterRadius = 35;

    this.drawCharacter = function(characterId, type, image, position) {
        const charactersElem = document.getElementById('characters');

        const characterElem = document.createElement("img");
        characterElem.id = 'character_' + characterId;
        characterElem.className = "character "+type;
        characterElem.src = 'images/characters/' + image;
        characterElem.style.left = (position.x - characterRadius) + 'px';
        characterElem.style.top = (position.y - characterRadius) + 'px';
        characterElem.style.width = (characterRadius * 2) + 'px';
        characterElem.style.height = (characterRadius * 2) + 'px';
        characterElem.style['border-radius'] = characterRadius + 'px';

        charactersElem.appendChild(characterElem);

        return characterElem;
    }

    this.scaleCharactersUp = function() {
        characterRadius += 5;
        Array.from(document.getElementsByClassName('character')).forEach(characterElem => {
            characterElem.style.width = (characterRadius * 2) + 'px';
            characterElem.style.height = (characterRadius * 2) + 'px';
            characterElem.style['border-radius'] = characterRadius + 'px';
        });
    }

    this.scaleCharactersDown = function() {
        characterRadius -= 5;
        Array.from(document.getElementsByClassName('character')).forEach(characterElem => {
            characterElem.style.width = (characterRadius * 2) + 'px';
            characterElem.style.height = (characterRadius * 2) + 'px';
            characterElem.style['border-radius'] = characterRadius + 'px';
        });
    }
})();

const Actions = new (function(){

    let characters = [];
    let enemyCountByType = {};

    /**
     * @param {Position} position
     */
    this.populatePlayers = function(position) {
        characters.push(Controller.addCharacter('cleric.png', 'player', position.shiftLeft(100)));
        characters.push(Controller.addCharacter('fighter.png', 'player', position));
        characters.push(Controller.addCharacter('wizard.png', 'player', position.shiftRight(100)));
    };

    /**
     * @param {string} type
     * @param {Position} position
     */
    this.addEnemy = function(type, position) {
        const enemy = Controller.addCharacter(type, 'enemy', position);
        enemyCountByType[type] ??= 0;
        enemyCountByType[type]++;
        enemy.attributes['data-enemy-id'] = enemyCountByType[type];
        characters.push(enemy);
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
        characters = [];
        enemyCountByType = {};
    }

    this.healSelected = function() {
        Array.from(document.getElementsByClassName('selected')).forEach(characterElem => {
            characterElem.classList.remove("hurt");
            characterElem.classList.remove("dead");
        });
    }

    this.hurtSelected = function() {
        Array.from(document.getElementsByClassName('selected')).forEach(characterElem => {
            characterElem.classList.remove("dead");
            characterElem.classList.add("hurt");
        });
    }

    this.killSelected = function() {
        Array.from(document.getElementsByClassName('selected')).forEach(characterElem => {
            characterElem.classList.remove("hurt");
            characterElem.classList.add("dead");
        });
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
