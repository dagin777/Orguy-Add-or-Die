let title = document.getElementById("title")
let playButton = document.getElementById("play")
let sword = localStorage.getItem("sword") === "true"
let shield = localStorage.getItem("shield") === "true"
let victorySound = document.getElementById("victory")
let defeatSound = document.getElementById("defeat")
let mathInput = document.getElementById("mathProblem")
let orguy = document.getElementById("orguy")
let enemy = document.getElementById("enemy")
let startButton = document.getElementById("start")
let question = document.getElementById("question")
let answerInput = document.getElementById("answerInput")
let damageSound = document.getElementById("damageSound")
let orguyHPVisual = document.getElementById("orguyHP")
let enemyHPVisual = document.getElementById("enemyHP")
let submit = document.getElementById("submit")
let shopButton = document.getElementById("shopButton")
let orguyHP = 0
let enemyHP = 0
let a = 0
let b = 0
let answer = 0
let money = Number(localStorage.getItem("money")) || 0
let moneyLabel = document.getElementById("moneyLabel")
let shop = document.getElementById("shop")
let shopItems = [{
    Name: "Shield",
    Price: 10000,
    Info: "gives you 50% less taken damage"
},
{
    Name: "Sword",
    Price: 25000,
    Info: "gives you 25% more damage"
}]
let shopVisibility = false
shop.style.display = "none"
moneyLabel.style.display = "none"
shopButton.style.display = "none"
startButton.style.display = "none"
shopButton.addEventListener("click", function() {
    if (shopVisibility === false) {
        shop.style.display = "block"
        shopVisibility = true
    } else {
        shop.style.display = "none"
        shopVisibility = false
    }
})

let messageTimer

function showMessage(text, color) {
    moneyLabel.textContent = text
    moneyLabel.style.color = color
    clearTimeout(messageTimer)
    messageTimer = setTimeout(function() {
        moneyLabel.textContent = "$" + money
        moneyLabel.style.color = "green"
    }, 1000)
}

function isOwned(name) {
    if (name === "Shield") {
        return shield
    }
    if (name === "Sword") {
        return sword
    }
    return false
}

function buyItem(item) {
    if (isOwned(item.Name)) {
        showMessage("You already own this item!", "red")
        return
    }
    if (money < item.Price) {
        showMessage("Not enough money!", "red")
        return
    }

    money = money - item.Price
    localStorage.setItem("money", money)

    if (item.Name === "Shield") {
        shield = true
        localStorage.setItem("shield", shield)
    } else if (item.Name === "Sword") {
        sword = true
        localStorage.setItem("sword", sword)
    }

    renderShop()
    showMessage("Purchased!", "green")
}

function renderShop() {
    shop.innerHTML = ""
    for (let i = 0; i < shopItems.length; i++) {
        let item = shopItems[i]
        let itemFrame = document.createElement("div")
        itemFrame.classList.add("item")
        let itemLabel = document.createElement("div")
        itemLabel.textContent = item.Name + ": " + item.Info + ". Price: " + item.Price
        let buyButton = document.createElement("button")
        if (isOwned(item.Name)) {
            buyButton.classList.add("Owned")
            buyButton.textContent = "OWNED"
        } else {
            buyButton.classList.add("buy")
            buyButton.textContent = "BUY"
        }
        buyButton.addEventListener("click", function() {
            buyItem(item)
        })
        shop.appendChild(itemFrame)
        itemFrame.appendChild(itemLabel)
        itemFrame.appendChild(buyButton)
    }
}
renderShop()

startButton.addEventListener("click", function() {
    startButton.style.display = "none"
    shopButton.style.display = "none"
    shop.style.display = "none"
    shopVisibility = false
    question.style.display = "block"
    orguy.style.display = "block"
    enemy.style.display = "block"

    orguyHP = 150
    enemyHP = 150

    enemyHPVisual.textContent = enemyHP
    orguyHPVisual.textContent = orguyHP

    math()
})

function resetGame() {
    setTimeout(function() {
        question.style.display = "none"
        orguy.style.display = "none"
        enemy.style.display = "none"
        startButton.style.display = "block"
        shopButton.style.display = "block"
    }, 5000)
}

let enemyHitTimer
let orguyHitTimer

function attack(dmg) {
    damageSound.currentTime = 0
    damageSound.play()

    enemy.style.background = 'url("styles/orguy.hit.png") center / contain no-repeat'
    clearTimeout(enemyHitTimer)
    enemyHitTimer = setTimeout(function() {
        enemy.style.background = 'url("styles/enemy.gif") center / contain no-repeat'
    }, 1000)

    enemyHP = Math.max(0, enemyHP - dmg)
    enemyHPVisual.textContent = enemyHP
}

function took(dmg) {
    damageSound.currentTime = 0
    damageSound.play()

    orguy.style.background = 'url("styles/enemy.hit.png") center / contain no-repeat'
    clearTimeout(orguyHitTimer)
    orguyHitTimer = setTimeout(function() {
        orguy.style.background = 'url("styles/orguy.gif") center / contain no-repeat'
    }, 1000)

    orguyHP = Math.max(0, orguyHP - dmg)
    orguyHPVisual.textContent = orguyHP
}

function math() {
    if (enemyHP > 0 && orguyHP > 0) {
        a = Math.floor(Math.random() * 100) + 1
        b = Math.floor(Math.random() * 100) + 1

        mathInput.textContent = a + "+" + b + "= ?"
        answer = a + b

        answerInput.value = ""
    }
}

submit.addEventListener("click", function() {
    if (enemyHP <= 0 || orguyHP <= 0) {
        return
    }

    if (Number(answerInput.value) === answer && answerInput.value !== "") {
        let damage = 50
        if (sword) {
            damage = Math.round(damage * 1.25)
        }
        attack(damage)
    } else {
        let damage = 50
        if (shield) {
            damage = Math.round(damage * 0.5)
        }
        took(damage)
    }

    math()

    if (enemyHP <= 0) {
        mathInput.textContent = "YOU WIN!"
        resetGame()
        victorySound.play()
        money = money + orguyHP - enemyHP
    } else if (orguyHP <= 0) {
        mathInput.textContent = "YOU LOSE!"
        resetGame()
        defeatSound.play()
        money = money + orguyHP - enemyHP
    }

    if (enemyHP <= 0 || orguyHP <= 0) {
        if (money < 0) {
            money = 0
        }
        moneyLabel.textContent = "$" + money
        localStorage.setItem("money", money)
    }
})

moneyLabel.style.color = "green"
moneyLabel.textContent = "$" + money
playButton.addEventListener("click", function() {
    title.style.display = "none"
    playButton.style.display = "none"
    moneyLabel.style.display = "block"
    shopButton.style.display = "block"
    startButton.style.display = "block"
})