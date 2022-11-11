
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
    new Map('locations/thundertree.jpg'),
    new Map('locations/banshee.webp'),
    new Map('locations/old-owl-well.jpeg'),
    new Level([
        new Room('locations/cragmaw-castle-1-and-2.png'),
        new Room('locations/cragmaw-castle-3-and-6.png'),
        new Room('locations/cragmaw-castle-3-4-and-7.png'),
        new Room('locations/cragmaw-castle-8-and-9.png'),
        new Room('locations/cragmaw-castle-5.png'),
        new Room('locations/cragmaw-castle-10.png'),
        new Room('locations/cragmaw-castle-11.png'),
        new Room('locations/cragmaw-castle-12.png'),
        new Room('locations/cragmaw-castle-13.png'),
        new Room('locations/cragmaw-castle-14.png'),
    ]),
];

const game = new Game(locations);

const KeysToActions = {
    characterSelected: function(e) {
        if (e.key === 'h') {
            Actions.hurtSelected();
        }
        if (e.key === 'H') {
            Actions.healSelected();
        }
        if (e.key === 'd') {
            Actions.killSelected();
        }
    },

    noCharacterSelected: function(e, mousePos) {
        // Players
        if (e.key === 'p') {
            Actions.populatePlayers(mousePos);
        }

        // NPCs
        if (e.key === 'B') {
            Actions.addNpc('banshee.png', mousePos);
        }
        if (e.key === 'C') {
            Actions.addNpc('cultist.png', mousePos);
        }
        if (e.key === 'G') {
            Actions.addNpc('garaele.png', mousePos);
        }
        if (e.key === 'h') {
            Actions.addNpc('hamun.png', mousePos);
        }
        if (e.key === 'i') {
            Actions.addNpc('iarno.png', mousePos);
        }
        if (e.key === 'R') {
            Actions.addNpc('reidoth.png', mousePos);
        }
        if (e.key === 's') {
            Actions.addNpc('sildar.png', mousePos);
        }

        // Enemies
        if (e.key === 'b') {
            Actions.addEnemy('bugbear.png', mousePos);
        }
        if (e.key === 'd') {
            Actions.addEnemy('dragon.png', mousePos, 'gargantuan');
        }
        if (e.key === 'g') {
            Actions.addEnemy('goblin.png', mousePos);
        }
        if (e.key === 'H') {
            Actions.addEnemy('hobgoblin.png', mousePos);
        }

        if (e.key === 'n') {
            Actions.addEnemy('nothic.png', mousePos);
        }
        if (e.key === 'o') {
            Actions.addEnemy('orc.png', mousePos);
        }
        if (e.key === 'O') {
            Actions.addEnemy('owlbear.png', mousePos, 'large');
        }
        if (e.key === 'r') {
            Actions.addEnemy('redbrand.jpeg', mousePos);
        }
        if (e.key === 'S') {
            Actions.addEnemy('spider.png', mousePos, 'large');
        }
        if (e.key === 't') {
            Actions.addEnemy('twig-blight.png', mousePos, 'small');
        }
        if (e.key === 'w') {
            Actions.addEnemy('wolf.png', mousePos);
        }
        if (e.key === 'z') {
            Actions.addEnemy('zombie.png', mousePos);
        }

        if (e.key === 'c') {
            Actions.clearCharacters();
        }

        // Character scaling
        if (e.key === '[') {
            Renderer.scaleCharactersDown();
        }
        if (e.key === ']') {
            Renderer.scaleCharactersUp();
        }

        // Zoom
        if (e.key === '{') {
            Renderer.zoomOut();
        }
        if (e.key === '}') {
            Renderer.zoomIn();
        }

        // Location navigation
        if (e.code === 'ArrowLeft') {
            Renderer.imageBackward();
        }
        if (e.code === 'ArrowRight') {
            Renderer.imageForward();
        }
    }
};

const Controller = new (function() {
    ///////////////////////////////////
    // Methods
    ///////////////////////////////////
    this.prepareAreaControls = function() {
        Renderer.renderLocationSelect();
    }

    let mousePos;
    let activeKeysToActions;

    this.trackMousePosition = function() {
        document.addEventListener('mousemove', (e) => {
            mousePos = new Position(e.clientX, e.clientY);
        })
    }

    this.prepareKeyboardShortcuts = function() {
        activeKeysToActions = KeysToActions.noCharacterSelected;
        function keyDown(e) {
            activeKeysToActions(e, mousePos);
        }
        document.onkeydown = keyDown;
    }


    let characterId = 0;

    /**
     * @param {string} image
     * @param {string} type
     * @param {Position} position
     * @param {null|string} [size]
     * @returns {HTMLImageElement}
     */
    this.addCharacter = function (image, type, position, size) {

        size = size ?? 'medium';

        ++characterId;
        const characterElem = Renderer.drawCharacter(characterId, type, image, position, size)

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
            activeKeysToActions = KeysToActions.characterSelected;
        });
    }

    function deselectCharacters() {
        Array.from(document.getElementsByClassName('selected')).forEach(characterElem => {
            characterElem.classList.remove("selected");
        });
        activeKeysToActions = KeysToActions.noCharacterSelected;
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

    let characterScale = 1;

    this.drawCharacter = function(characterId, type, image, position, size) {
        const charactersElem = document.getElementById('characters');

        const medianCharRadius = 35;

        const characterElem = document.createElement("img");
        characterElem.id = 'character_' + characterId;
        characterElem.className = "character "+ type + " " + size;
        characterElem.src = 'images/characters/' + image;
        characterElem.style.left = (position.x - medianCharRadius) + 'px';
        characterElem.style.top = (position.y - medianCharRadius) + 'px';
        characterElem.style.transform = "scale(" + characterScale + ")";

        charactersElem.appendChild(characterElem);

        return characterElem;
    }

    this.scaleCharactersUp = function() {
        characterScale += 0.2;
        Array.from(document.getElementsByClassName('character')).forEach(characterElem => {
            characterElem.style.transform = "scale(" + characterScale + ")";
        });
    }

    this.scaleCharactersDown = function() {
        characterScale -= 0.2;
        Array.from(document.getElementsByClassName('character')).forEach(characterElem => {
            characterElem.style.transform = "scale(" + characterScale + ")";
        });
    }

    let locationZoom = 1;

    this.zoomIn = function() {
        locationZoom += 0.2;
        backgroundElem.classList.add('zoom');
        locationElem.classList.add('zoom');
        locationElem.style.transform = "scale(" + locationZoom + ")";
    }

    this.zoomOut = function() {
        locationZoom = 1;
        backgroundElem.classList.remove('zoom');
        locationElem.classList.remove('zoom');
        locationElem.style.transform = "scale(" + locationZoom + ")";
    }
})();

const Actions = new (function(){

    let characters = [];
    let enemyCountByType = {};

    /**
     * @param {Position} position
     */
    this.populatePlayers = function(position) {
        const left = position.shiftLeft(35).shiftDown(27);
        const center = position.shiftUp(27);
        const right = position.shiftRight(35).shiftDown(27);
        characters.push(Controller.addCharacter('cleric.png', 'player', left));
        characters.push(Controller.addCharacter('fighter.png', 'player', center));
        characters.push(Controller.addCharacter('wizard.png', 'player', right));
    };

    /**
     * @param {string} type
     * @param {Position} position
     * @param {string} size
     */
    this.addEnemy = function(type, position, size) {
        const enemy = Controller.addCharacter(type, 'enemy', position, size);
        enemyCountByType[type] ??= 0;
        enemyCountByType[type]++;
        enemy.attributes['data-enemy-id'] = enemyCountByType[type];
        characters.push(enemy);
    }

    /**
     * @param {string} image
     * @param {Position} position
     */
    this.addNpc = function(image, position) {
        const npc = Controller.addCharacter(image, 'npc', position, 'medium');
        characters.push(npc);
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
    shiftUp(amount) {
        return new Position(
            this.x,
            this.y - amount
        )
    }

    /**
     * @param {int} amount
     * @returns {Position}
     */
    shiftDown(amount) {
        return new Position(
            this.x,
            this.y + amount
        )
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
