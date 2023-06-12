const playerContainer = document.getElementById('all-players-container');
const newPlayerFormContainer = document.getElementById('new-player-form');

// Add your cohort name to the cohortName variable below, replacing the 'COHORT-NAME' placeholder
const cohortName = '2302-ACC-PT-WEB-PT-D';
// Use the APIURL variable for fetch requests
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/`;

/**
 * It fetches all players from the API and returns them
 * @returns An array of objects.
 */
// Fetch all players
const fetchAllPlayers = async () => {
    try {
        const response = await fetch(`${APIURL}/players`);
        const players = await response.json();
        return players;
    } catch (err) {
        console.error('Uh oh, trouble fetching players!', err);
    }
};

// Fetch Single player by Id
const fetchSinglePlayer = async (playerId) => {
    try {
        const response = await fetch(`${APIURL}/players/${playerId}`);
        const result = await response.json();
        const player = result.data.player;
        console.log(player);

        const playerIdHTML = `
      <div class="single-player-view">
        <div class="player">
          <h4>Name: ${player.name}</h4>
          <h4>Breed: ${player.breed}</h4>
          <h4>Status: ${player.status}</h4>
          <img src="${player.imageUrl}" alt="${player.name}"></img>
        </div>
        <button class="back-button">BACK</button>
      </div>`;

      playerContainer.innerHTML = playerIdHTML; 
        // back button
      const backButton = playerContainer.querySelector(".back-button");
    backButton.addEventListener("click", async () => {
      const players = await fetchAllPlayers();
      renderAllPlayers(players);
    });
    } catch (err) {
        console.error(`Oh no, trouble fetching player #${playerId}!`, err);
    }
};

// Add new player
const addNewPlayer = async (playerObj) => {
    try {
        const response = await fetch(`${APIURL}/players`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: playerObj.name,
              breed: playerObj.breed,
            }),
          }
        );
        const result = await response.json();
        const player = result.data.newPlayer;
        const playerElement = document.createElement('div');

        playerElement.classList.add('player');
        playerElement.innerHTML = 
            `<div class="player-card">
                <h2>${player.name}</h2>
                <p>Breed: ${player.breed}</p>
                <p>Team: ${player.teamId}</p>
                <p>Status: ${player.status}</p>
                <img src="${player.imageUrl}" alt="${player.name}">
                <button class="details-button" data-player-id="${player.id}">See details</button>
                <button class="remove-button" onclick="removePlayer(${player.id})">Remove from roster</button>
            </div>`;
        playerContainer.insertBefore(playerElement, playerContainer.firstChild);
    } catch (err) {
        console.error('Oops, something went wrong with adding that player!', err);
    }
};

function submitForm(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const breed = document.getElementById('breed').value;

    addNewPlayer({ name, breed });
    document.getElementById('addPlayerForm').reset();
}
// Remove player
const removePlayer = async (playerId) => {
    try {
        if (confirm("Are you sure you want to remove this player from the roster?")) {
            const response = await fetch(`${APIURL}/players/${playerId}`, { method: 'DELETE' });
            const result = await response.json();
            alert('Player removed successfully!');
            init();
        }
    } catch (err) {
        console.error(
            `Whoops, trouble removing player #${playerId} from the roster!`,
            err
        );
    }
};

/**
 * It takes an array of player objects, loops through them, and creates a string of HTML for each
 * player, then adds that string to a larger string of HTML that represents all the players. 
 * 
 * Then it takes that larger string of HTML and adds it to the DOM. 
 * 
 * It also adds event listeners to the buttons in each player card. 
 * 
 * The event listeners are for the "See details" and "Remove from roster" buttons. 
 * 
 * The "See details" button calls the fetchSinglePlayer function, which makes a fetch request to the
 * API to get the details for a single player. 
 * 
 * The "Remove from roster" button calls the removePlayer function, which makes a fetch request to
 * the API to remove a player from the roster. 
 * 
 * The fetchSinglePlayer and removePlayer functions are defined in the
 * @param playerList - an array of player objects
 * @returns the playerContainerHTML variable.
 */

//render All players
const renderAllPlayers = (playerList) => {
    try {
        playerContainer.innerHTML = '';
        playerList.data.players.forEach(player => {
            const playerElement = document.createElement('div');
            playerElement.classList.add('player');
            playerElement.innerHTML = 
                `<div class="player-card" id="${player.id}">
                    <h2>${player.name}</h2>
                    <p>Breed: ${player.breed}</p>
                    <p>Team: ${player.teamId}</p>
                    <p>Status: ${player.status}</p>
                    <img src="${player.imageUrl}" alt="${player.name}">
                    <button class="details-button" data-player-id="${player.id}">See details</button>
                    <button class="remove-button" onclick="removePlayer(${player.id})">Remove from roster</button>
                </div>`;
            playerContainer.appendChild(playerElement);
        });
          //details button with event listener
    const detailsButtons = document.querySelectorAll('.details-button');
    detailsButtons.forEach((button) => {
      button.addEventListener('click', async (event) => {
        const playerId = event.target.dataset.playerId;
        const player = await fetchSinglePlayer(playerId);
        console.log(player);
      });
    });
        
    } catch (err) {
        console.error('Uh oh, trouble rendering players!', err);
    }
};


/**
 * It renders a form to the DOM, and when the form is submitted, it adds a new player to the database,
 * fetches all players from the database, and renders them to the DOM.
 */
const renderNewPlayerForm = () => {
    try {
        
    } catch (err) {
        console.error('Uh oh, trouble rendering the new player form!', err);
    }
}

const init = async () => {
    const players = await fetchAllPlayers();
    renderAllPlayers(players);

}

init();