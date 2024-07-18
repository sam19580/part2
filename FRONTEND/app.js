let userId;
const socket = io();

function login() {
    const email = document.getElementById('email').value;
    fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
    })
    .then(response => response.json())
    .then(data => {
        userId = data.userId;
        document.getElementById('subscribeSection').style.display = 'block';
        socket.emit('userConnected', userId);
    })
    .catch(err => alert('Login failed'));
}

function subscribe() {
    const stock = document.getElementById('stockTicker').value;
    fetch('/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, stock })
    })
    .then(response => response.text())
    .then(data => {
        const stockDiv = document.createElement('div');
        stockDiv.className = 'stock';
        stockDiv.id = stock;
        stockDiv.innerHTML = `<h3>${stock}</h3><p id="${stock}-price">Price: </p>`;
        document.getElementById('stocks').appendChild(stockDiv);
    })
    .catch(err => alert('Subscription failed'));
}

socket.on('stockUpdate', (stockPrices) => {
    for (let stock in stockPrices) {
        const priceElement = document.getElementById(`${stock}-price`);
        if (priceElement) {
            priceElement.textContent = `Price: ${stockPrices[stock]}`;
        }
    }
});
