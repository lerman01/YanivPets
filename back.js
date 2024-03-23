addEventListener('DOMContentLoaded', () => {
    createPlayers();
    const input = document.querySelector('#player-counter')
    input.onchange = () => {
        createPlayers()
    }
})

const createPlayers = (delta) => {
    const input = document.querySelector('#player-counter')
    input.value = Number(input.value) + delta
    input.dispatchEvent(new Event('input', {bubbles: true}))

    const players = input.value

    const playersPlaces = [
        document.querySelector('#top'),
        document.querySelector('#right'),
        document.querySelector('#left')
    ]
    const bottom = document.querySelector('#bottom');
    bottom.innerHTML = ""
    playersPlaces.forEach(place => place.innerHTML = "")

    const player = document.createElement('div')
    player.textContent = `MY PLAYER`
    player.classList.add('player')
    bottom.appendChild(player)

    for (let i = 0; i < players - 1; i++) {
        const player = document.createElement('div')
        player.textContent = `PLAYER ${i}`
        player.classList.add('player')
        playersPlaces[i % 3].appendChild(player)

    }
}
