addEventListener('DOMContentLoaded', () => {
        const container = document.querySelector('#main-container')
        const playersPlaces = [
            document.querySelector('#right'),
            document.querySelector('#top'),
            document.querySelector('#left')
        ]
        const players = 13

        const bottom = document.querySelector('#bottom');

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
)
