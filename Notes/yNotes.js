function getCurrency() {
  const text = getProductContainer()
    ?.querySelector('.price')
    ?.textContent;

  const symbol = text?.trim()[0];

  const currencyMap = {
    '$': 'USD',
    '€': 'EUR',
    '₽': 'RUB'
  };

  return currencyMap[symbol] || '';
}

// или так:

function getCurrency() {
  const symbol = getProductContainer()
    ?.querySelector('.price')
    ?.textContent
    ?.match(/[€$₽]/);

  const map = {
    "₽": "RUB",
    "€": "EUR",
    "$": "USD"
  };

  return map[symbol?.[0]] || '';
}


