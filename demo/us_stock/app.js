const apiKey = 'E0Z58TSTYDH2TDIP';
const symbol = 'NVDA';
const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;

async function fetchStockPrice() {
  try {
    const response = await fetch(url);
    const data = await response.json();
    const price = data['Global Quote']['05. price'];
    document.getElementById('price').textContent = `$${parseFloat(price).toFixed(2)}`;
  } catch (error) {
    console.error('Error fetching stock price:', error);
  }
}

function updateStockPrice() {
  fetchStockPrice();
  setInterval(fetchStockPrice, 7200000); // 60000=每分鐘更新一次
}

updateStockPrice();
