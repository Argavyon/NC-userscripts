// ==UserScript==
// @name         Lich Delight
// @version      1.1
// @author       Goliath
// @match        https://www.nexusclash.com/clash.php
// @match        https://nexusclash.com/clash.php
// @icon         https://nexusclash.com/favicon.ico
// @grant        none
// ==/UserScript==
const lichDelight = () => {
    'use strict';

    const petTableTable = document.querySelector('.petTable');
    if (!petTableTable) {
        return;
    }

    // Pets summon buttons
    const petSummons = petTableTable.querySelector('tbody').querySelector('table.summonsButtons>tbody');
    const FM = petSummons.querySelector('input[value="Fossil Monstrosity"]');
    const necro = petSummons.querySelector('input[value="Necrophage"]');

    if (FM) {
        // This is how they currently display by default
        // FM.nextSibling.value = 'Fossil Monstrosity (3 Skeletons) '
        if (petSummons.children.length < 3) petSummons.appendChild(document.createElement('tr'));
        petSummons.children[2].insertBefore(FM.parentNode.parentNode, petSummons.children[2].firstChild);
    }
    if (necro) {
        // This is how they currently display by default
        // necro.nextSibling.value = 'Necrophage (3 Zombies/Ghouls) '
        if (petSummons.children.length < 3) petSummons.appendChild(document.createElement('tr'));
        petSummons.children[2].appendChild(necro.parentNode.parentNode);
    }
}

lichDelight();
