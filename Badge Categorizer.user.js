// ==UserScript==
// @name         Badge Categorizer
// @namespace    http://github.com/Argavyon
// @version      1.0
// @description  Categorizes badges in NC character descriptions
// @author       Goliath
// @match        https://www.nexusclash.com/clash.php?op=character*
// @icon         https://nexusclash.com/favicon.ico
// @grant        none
// ==/UserScript==

const Badges = {
	"Career" : {
		"Alcohol Drunk" : ["Low Tolerance", "Frat Boy", "Alcoholic", "Sinatra", "Friend of Bill"],
		"Angels Killed" : ["Perverter", "Ruiner", "Nightmare Whisperer", "Voice of Armageddon", "The End of Hope"],
		"Books Read" : ["Reader", "Bookworm", "Librarian", "Bibliophile", "Teacher's Pet"],
		"Deaths" : ["Buried", "Wormfood", "Aspect Hunter", "Lich Pet", "Coffinmaker's Friend"],
		"Demons Killed" : ["Cleanser", "Demonslayer", "Hammer of Light", "Justicebringer", "Blade of the Word"],
		"Doors Destroyed" : ["Opportunity Knocks", "Big Bad Wolf", "Here's Johnny", "Landshark", "Homewrecker"],
		"Doors Repaired" : ["Apprentice Carpenter", "Woodworker", "Journeyman Carpenter", "Architect", "Master Carpenter"],
		"Food Eaten" : ["Taste Tester", "Gourmand", "Glutton", "Masticator", "Food Critic"],
		"Items Crafted" : ["Sweat Shop Worker", "Journeyman Blacksmith", "Factory Foreman", "Artisan", "Artifex"],
		"Items Repaired" : ["Tinker", "Mender", "Fixer", "Handyman", "80s Action Hero"],
		"Kills" : ["Killer", "Warrior", "Disciple of Death", "Master of Death", "Gravemaker"],
		"Locks Picked" : ["Thief", "Burglar", "Second-Story Man", "Locksmith", "Master of Tumblers"],
		"Pets Killed" : ["Dogkiller", "Exterminator", "Pest Control", "Trophy Hunter", "Director of Animal Testing"],
		"Pills Taken" : ["I Have a Headache", "Pill-popper", "Living the High Life", "Monster Addict", "Slave to the Habit"],
		"Power Removed" : ["Wiresnipper", "Fusebreaker", "Circuitbreaker", "Blackout", "Degenerate"],
		"Power Restored" : ["Apprentice Electrician", "Fusemaker", "Journeyman Electrician", "Circuitmaker", "Master Electrician"],
		"Targets Shot" : ["Barn Assassin", "Sharpshooter", "Deadeye", "Gunslinger", "Hickok"],
		"Damage Dealt" : ["Crusher", "Smasher", "Bloodletter", "Assassin", "Surgeon's Lament", "Widowmaker"],
		"Damage Taken" : ["Punching Bag", "Bruised", "Crushed", "All Stitched Up", "Keeping Healers in Business", "Constantly in Traction"],
		"HP Healed" : ["Medic", "Doctor", "Surgeon", "Healer", "Bodyweaver", "Lifesaver"]
	},
	"Exploration" : {
		"Breath 4" : [
			"A New Chapter", "Academic Probation", "All In The Family", "And I Must Scream", "At All Costs", "Baraas Ascends", "Birthing Pool", "Broken Alliance",
			"Broken Promises", "Circumnavigation", "Citadel", "Clinging to Life", "Cloudwatching", "Cops and Robbers", "Dedicated Few", "Enthroned", "Explosive Yield",
			"Fall of the Watcher", "Four Corners", "Fragmented Return", "Halls of the Scholar", "Halls of Wrath", "Idle Hands", "In The Name Of Science", "Institute of Arts",
			"Into the Dark", "Last Confession", "Reasons to Live", "Remorse", "Stolen Victory", "Tapestry of Time", "The Earth Shudders", "The Legend", "The Little King",
			"The Rise of Kafa-El", "The Voice", "Under The Boot", "Untouched Wilderness", "Well of Truth", "What Once Was Lost"
		],
		"Breath 3" : [
			"Bloodlines", "Common Touch", "Cromahl-Hult", "Deluge", "Effervescence", "Eresius Rest", "Fatigued", "Favored of Baraas", "Fire and Ice", "Flakes of Delight",
			"Fought the Law", "Four Winds", "Harmonious Joining", "Hole in None", "Immutable Law", "Landfall", "Netherland", "Paradise Lost", "Riptide", "Shades of Black",
			"Shades of Grey", "Sincerest Flattery", "Tainted Fruit", "The Crypt of Maeval", "View from the Top"
		],
		"Breath 2" : [
			"A Whole New World", "All Ye All Ye Outs In Free", "Beginning of the End", "Blinded by Lust", "Bloodlust", "Bridge Magic Built", "Captain Bloodbeards Folly",
			"Crystal Farm", "Deck of Cards", "Goldlust", "Ground Zero", "Impassable Dream", "Last Ship Leaving", "Mene Mene Tekel Upharsin", "Smiles All Around", "Snicker-Snack",
			"Time Sink", "Tree Hugger", "Viva La Revolucion", "Walking Home", "Watery Grave", "When The Walls Came Tumbling Down"
		],
		"Breath 1" : [
			"Altar of the Ancients", "Big Bang", "Confluence", "Founding Father", "Great Bowl", "Hermits Repose", "Iron Barracks", "Lord Mayor", "Shrine of the Wound", "Slowpoke"
		]
	},
	"Monster Hunting" : {
		"Crystal Guardian" : ["Shardbreaker", "Crystal Smasher", "Entropy Incarnate"],
		"Great Wyrm" : ["Wyrm Hunter", "Wyrm Slayer", "Wyrmsbane"],
		"Maeval" : ["Stalker of Death", "Hunter of Death", "Foe of Death"]
	}
}

function classifyBadges(badgesText) {
    const badgeTexts = badgesText.trim().split(",").map(str => str.trim())
    let classifiedBadges = {"Career": {}, "Exploration": {}, "Monster Hunting": {}, "Others": []}

    for (let bT of badgeTexts) {
        let found = false
        for (let firstLevel in Badges) {
            for (let secondLevel in Badges[firstLevel]) {
                if (Badges[firstLevel][secondLevel].includes(bT)) {
                    if (!(firstLevel in classifiedBadges)) classifiedBadges[firstLevel] = {}
                    if (!(secondLevel in classifiedBadges[firstLevel])) classifiedBadges[firstLevel][secondLevel] = []
                    classifiedBadges[firstLevel][secondLevel].push(bT)
                    found = true
                    continue
                }
            }
            if (found) continue
        }
        if (!found) {
            if (!classifiedBadges.Others) classifiedBadges.Others = []
            classifiedBadges.Others.push(bT)
        }
    }

    return classifiedBadges
}

function insertAfter(newNode, afterNode) {
    return afterNode.parentNode.insertBefore(newNode, afterNode.nextSibling)
}

function printClassifiedBadges(classifiedBadges, insertCallback) {
    if (Object.keys(classifiedBadges.Career).length > 0) {
        insertCallback("Career:")
        Object.entries(classifiedBadges.Career).forEach(e => {
            insertCallback("- " + e[0] + ":")
            insertCallback("-- " + e[1].join(", "))
        })
    }
    if (Object.keys(classifiedBadges.Exploration).length > 0) {
        insertCallback("Exploration:")
        Object.entries(classifiedBadges.Exploration).forEach(e => {
            insertCallback("- " + e[0] + ":")
            insertCallback("-- " + e[1].join(", "))
        })
    }
    if (Object.keys(classifiedBadges["Monster Hunting"]).length > 0) {
        insertCallback("Monster Hunting:")
        Object.entries(classifiedBadges["Monster Hunting"]).forEach(e => {
            insertCallback("- " + e[0] + ":")
            insertCallback("-- " + e[1].join(", "))
        })
    }
    if (classifiedBadges.Others.length > 0) {
        insertCallback("Others:")
        insertCallback("- " + classifiedBadges.Others.join(", "))
    }
}

function main() {
    const previousNode = [...document.querySelectorAll("div.panetitle")].find(div => div.textContent == "Badges Earned:")
    const badgesText = previousNode.nextSibling.textContent
    const classifiedBadges = classifyBadges(badgesText)
    previousNode.parentNode.removeChild(previousNode.nextSibling)
    var after = previousNode
    printClassifiedBadges(classifiedBadges, text => { after = insertAfter(document.createElement('br'), insertAfter(document.createTextNode(text), after))})
}

main()