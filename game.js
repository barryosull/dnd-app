
const locations = [
    'transitions/title.jpeg',
    'locations/world.jpg',
    'transitions/journey.jpeg',
    'locations/road.webp',
    'transitions/trail.jpeg',
    'locations/cave-1.png',
    'locations/cave-2.png',
    'locations/cave-3.png',
    'locations/cave-4.png',
    'locations/cave-5.png',
    'locations/cave-6.png',
    'locations/cave-7.png',
    'locations/cave-8.png',
    'locations/phandalin.jpg',
    'locations/barthens.webp',
    'locations/alderleaf-farm.png',
    'locations/minors-exchange.png',
    'locations/lionshield-closter.jpeg',
    'locations/shrine-of-luck.jpeg',
    'locations/edermath-orchard.jpeg',
    'locations/townmasters-hall.jpeg',
    'locations/sleeping-giant.webp',
    'locations/sleeping-giant-map.jpeg',
    'locations/tresendar-manor.jpeg',
    'locations/redbrand-courtyard.jpeg',
    'locations/redbrand-1.png',
    'locations/redbrand-2.png',
    'locations/redbrand-3.png',
    'locations/redbrand-4.png',
    'locations/redbrand-5.png',
    'locations/redbrand-6.png',
    'locations/redbrand-7.png',
    'locations/redbrand-8.png',
    'locations/redbrand-9.png',
    'locations/redbrand-10.png',
    'locations/redbrand-11.png',
    'locations/redbrand-12.png',
];

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
