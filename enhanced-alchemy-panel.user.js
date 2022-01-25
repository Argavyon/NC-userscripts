// ==UserScript==
// @name         Enhanced Alchemy Panel
// @namespace    https://github.com/Argavyon/
// @version      1.1
// @author       Goliath
// @match        *://nexusclash.com/clash.php*
// @match        *://www.nexusclash.com/clash.php*
// @icon         https://nexusclash.com/favicon.ico
// @grant        GM.setValue
// @grant        GM.getValue
// @run-at       document-idle
// ==/UserScript==

async function EnhancedAlchemyNode(node, grade, researchButton, researchComp, researchPotion, forgetNode) {
    const recipeName = node.children[0].textContent.trim()
    const recipeId = 'alchemy-' + recipeName.replace(' ', '-')

    node.children[0].style.width = '59.69%'
    node.children[0].childNodes[1].nodeValue = node.children[0].childNodes[1].nodeValue + ' [' + grade + '/6]'

    node.children[0].appendChild(document.createElement('br'))
    const span = node.children[0].appendChild(document.createElement('span'))
    span.style.display = 'block-inline'
    span.style.width = '100%'
    span.hidden = true

    const collapseButton = document.createElement('input')
    collapseButton.type = 'Button'
    collapseButton.value = node.children[0].children[0].value
    collapseButton.title = node.children[0].children[0].title
    node.children[0].replaceChild(collapseButton, node.children[0].children[0])

    collapseButton.onclick = function(event) {
        const wasCollapsed = collapseButton.value == '+'

        collapseButton.value = wasCollapsed ? '-' : '+'
        collapseButton.title = wasCollapsed ? 'Collapse' : 'Expand'
        span.hidden = wasCollapsed ? false : true
        node.children[1].children[0].classList.toggle('toggled')

        GM.setValue(recipeId, !wasCollapsed)
    }
    if (!(await GM.getValue(recipeId))) collapseButton.click()

    if (grade < 6) { // At least one of the components hasn't been found
        const rComp = span.appendChild(researchComp.cloneNode(true))
        rComp.style.width = '100%'

        const rButton = span.appendChild(researchButton.cloneNode(true))
        rButton.style.width = '100%'
        rButton.onclick = function() {
            researchComp.value = rComp.value
            researchPotion.value = recipeName
            researchButton.click()
            researchButton.click()
        }
    }
    if (grade > 0) { // At least one of the components has been found
        span.appendChild(document.createElement('hr'))
        const forButton = span.appendChild(document.createElement('input'))
        forButton.value = 'Forget Recipe (5 AP, 5 MP)'
        forButton.type = 'Button'
        forButton.style.width = '100%'
        forButton.onclick = function() {
            if (confirm('Confirm forgetting: ' + recipeName + ' (5 AP, 5 MP)')) {
                const forgetList = forgetNode.querySelector('select')
                const forgetButton = forgetList.nextSibling
                const opt = forgetList.appendChild(document.createElement('option'))
                opt.value = recipeName
                opt.textContent = recipeName
                // opt.selected = ''

                const i1 = forgetNode.insertBefore(document.createElement('input'), forgetList)
                i1.type = 'hidden'
                i1.name = 'op'
                i1.value = 'alchemy'

                const i2 = forgetNode.insertBefore(document.createElement('input'), forgetList)
                i2.type = 'hidden'
                i2.name = 'forget'
                i2.value = 'forget'

                forgetList.selectedIndex = forgetList.options.length - 1
                forgetList.options[forgetList.selectedIndex].setAttribute('selected', '')
                forgetList.name = 'potion'

                forgetButton.type = 'submit'
                forgetButton.value = 'Confirm Forget Recipe (5 AP, 5 MP)'
                forgetList.dispatchEvent(new Event('change'))
                forgetButton.click()
            }
        }
    }
}

async function SimpleAlchemyNode(node) {
    const recipeName = node.children[0].textContent.trim()
    const recipeId = 'alchemy-' + recipeName.replace(' ', '-')

    const collapseButton = document.createElement('input')
    collapseButton.type = 'Button'
    collapseButton.value = node.children[0].children[0].value
    collapseButton.title = node.children[0].children[0].title
    node.children[0].replaceChild(collapseButton, node.children[0].children[0])

    collapseButton.onclick = function(event) {
        const wasCollapsed = collapseButton.value == '+'

        collapseButton.value = wasCollapsed ? '-' : '+'
        collapseButton.title = wasCollapsed ? 'Collapse' : 'Expand'
        node.children[1].children[0].classList.toggle('toggled')

        GM.setValue(recipeId, !wasCollapsed)
    }
    if (!(await GM.getValue(recipeId))) collapseButton.click()
}

function EnhancedAlchemyPanel(trackerNode) {
    const alchemyResearch = document.getElementById('main-left').querySelector('form[name="alchemyresearch"]')
    if (alchemyResearch) {
        const alchemyForget = document.getElementById('main-left').querySelector('form[name="alchemyforget"]')
        const resButton = alchemyResearch.children[1]
        const resComp = alchemyResearch.children[2]
        const resPotion = alchemyResearch.children[3]

        for (let node = trackerNode.nextSibling; node && node.children[1]; node = node.nextSibling) {
            const grade = 6 - node.children[1].querySelectorAll('li[title="unknown"').length
            EnhancedAlchemyNode(node, grade, resButton, resComp, resPotion, alchemyForget)
        }
    } else {
        for (let node = trackerNode.nextSibling; node && node.children[1]; node = node.nextSibling) {
            SimpleAlchemyNode(node)
        }
    }
}

function main() {
    'use strict'
    const trackerNode = document.getElementById('recipe-tracker')
    if (trackerNode) EnhancedAlchemyPanel(trackerNode)
}

main()
