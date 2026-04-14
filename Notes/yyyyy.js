function getProduct() {
  return {
    id: getProductId(),
    name: getProductName(),
    isLiked: getIsLiked(),
    tags: getTags(),
    price: getPrice(),
    oldPrice: getOldPrice(),
    discount: getDiscount(),
    discountPercent: getDiscountPercent(),
    currency: getCurrency(),
    properties: getProperties(),
    description: getDescription(),
    images: getImages()
  };
}



function getProduct() {
  return {
    id: '',
    name: '',
    isLiked: false,
    tags: {},
    price: 0,
    oldPrice: 0,
    discount: 0,
    discountPercent: '',
    currency: '',
    properties: {},
    description: '',
    images: []
  };
}

/*
Мини-план (как делать без стресса)
  Сделай:
  id
  name

  Потом:
  price
  oldPrice

  Потом:
  discount
  discountPercent (через формулу)

  Потом:
  images

  Потом уже:
  tags, properties (самые сложные)
*/


//=========================== Готовая функция getMeta() ============================
function getMeta() {
  // title
  const title = document.querySelector('title')?.textContent.trim();

  // description
  const description = document
    .querySelector('meta[name="description"]')
    ?.getAttribute('content')
    ?.trim();

  // keywords
  const keywordsContent = document
    .querySelector('meta[name="keywords"]')
    ?.getAttribute('content');

  const keywords = keywordsContent
    ? keywordsContent.split(',').map(k => k.trim())
    : [];

  // language
  const language = document.documentElement.lang;

  // Open Graph
  const ogTitle = document
    .querySelector('meta[property="og:title"]')
    ?.getAttribute('content')
    ?.trim();

  const ogImage = document
    .querySelector('meta[property="og:image"]')
    ?.getAttribute('content')
    ?.trim();

  const ogType = document
    .querySelector('meta[property="og:type"]')
    ?.getAttribute('content')
    ?.trim();

  return {
    title,
    description,
    keywords,
    language,
    opengraph: {
      title: ogTitle,
      image: ogImage,
      type: ogType
    }
  };
}


//=========================== Готовые функции Product ============================
//product container
function getRoot() {
  return document.querySelector('.product');
}
//id
function getProductId() {
  return getRoot()?.dataset.id;
}
//name
function getProductName() {
  return getRoot()
    ?.querySelector('.title')
    ?.textContent.trim();
}
//isLiked
function getIsLiked() {
  return getRoot()
    ?.querySelector('.like')
    ?.classList.contains('active');
}

//price
function getPrice() {
    const text = getRoot()?.querySelector('.price')?.textContent?.trim().match(/\d+/);
    const price = Number(text);
    return price;
}
//Old Price
function getOldPrice() {
    const text = getRoot()?.querySelector('.price span')?.textContent?.trim().match(/\d+/);
    const oldPrice = Number(text);
    return oldPrice;
}
//currency
function getCurrency() {
    const symbol = getRoot()?.querySelector('.price')?.textContent.trim()[0];

    const currencyMap = {
        "₽": "RUB",
        "€": "EUR",
        "$": "USD"
    }

    return currencyMap[symbol] || '';
}

//discount
function getDiscount() {
  return getOldPrice() - getPrice();
}
//discountPercent
function getDiscountPercent() {
  const oldPrice = getOldPrice();
  const discount = getDiscount();

  if (!oldPrice) return '';

  return ((discount / oldPrice) * 100).toFixed(2) + '%';
}
//tags
function getTags() {
  const root = getRoot();

  const result = {
    category: [],
    label: [],
    discount: []
  };

  root.querySelectorAll('.tags span').forEach(tag => {
    const text = tag.textContent.trim();

    if (tag.classList.contains('green')) {
      result.category.push(text);
    }

    if (tag.classList.contains('blue')) {
      result.label.push(text);
    }

    if (tag.classList.contains('red')) {
      result.discount.push(text);
    }
  });

  return result;
}
//properties (очень частый паттерн)
function getProperties() {
  const root = getRoot();
  const result = {};

  root.querySelectorAll('.properties li').forEach(item => {
    const key = item.children[0]?.textContent.trim();
    const value = item.children[1]?.textContent.trim();

    if (key) {
      result[key] = value;
    }
  });

  return result;
}
//description
function getDescription() {
  return getRoot()
    ?.querySelector('.description')
    ?.innerHTML.trim();
}

//images (самый важный паттерн для собесов)
function getImages() {
  const root = getRoot();

  // 1. Главное изображение
  const mainImg = root.querySelector('.preview figure img');

  const main = {
    preview: mainImg.getAttribute('src'),
    full: mainImg.getAttribute('src'),
    alt: mainImg.getAttribute('alt')
  };

  // 2. Миниатюры
  const thumbs = Array.from(root.querySelectorAll('nav img')).map(img => ({
    preview: img.getAttribute('src'),
    full: img.dataset.src,
    alt: img.getAttribute('alt')
  }));

  // 3. Убираем дубликат (первую картинку)
  const filtered = thumbs.filter(img => img.full !== main.full);

  return [main, ...filtered];
}

//=========================== Готовая функция Product - все в одном ============================
function getProduct() {
  const root = document.querySelector('.product');

  // id
  const id = root?.dataset.id;

  // name
  const name = root.querySelector('.title')?.textContent.trim();

  // isLiked
  const isLiked = root.querySelector('.like')?.classList.contains('active') || false;

  // tags
  const tags = {
    category: [],
    label: [],
    discount: []
  };

  root.querySelectorAll('.tags span').forEach(tag => {
    const text = tag.textContent.trim();

    if (tag.classList.contains('green')) {
      tags.category.push(text);
    }
    if (tag.classList.contains('blue')) {
      tags.label.push(text);
    }
    if (tag.classList.contains('red')) {
      tags.discount.push(text);
    }
  });

  // price и oldPrice
  const priceBlock = root.querySelector('.price');

  const priceText = priceBlock?.childNodes[0]?.textContent.trim(); // ₽50
  const oldPriceText = priceBlock?.querySelector('span')?.textContent.trim(); // ₽80

  const price = priceText ? Number(priceText.replace(/[^\d]/g, '')) : 0;
  const oldPrice = oldPriceText ? Number(oldPriceText.replace(/[^\d]/g, '')) : 0;

  // currency
  const currency = priceText?.includes('₽') ? 'RUB' : '';

  // discount
  const discount = oldPrice - price;

  // discountPercent
  const discountPercent = oldPrice
    ? ((discount / oldPrice) * 100).toFixed(2) + '%'
    : '';

  // properties
  const properties = {};

  root.querySelectorAll('.properties li').forEach(item => {
    const key = item.children[0]?.textContent.trim();
    const value = item.children[1]?.textContent.trim();

    if (key) {
      properties[key] = value;
    }
  });

  // description (ВАЖНО: innerHTML, не textContent)
  const description = root.querySelector('.description')?.innerHTML.trim();

  // images
  const images = Array.from(root.querySelectorAll('nav img')).map(img => ({
    preview: img.getAttribute('src'),
    full: img.dataset.src,
    alt: img.getAttribute('alt')
  }));

  return {
    id,
    name,
    isLiked,
    tags,
    price,
    oldPrice,
    discount,
    discountPercent,
    currency,
    properties,
    description,
    images
  };
}



//=========================== Готовая функция Suggested - все в одном ============================
function getSuggested() {
  const root = document.querySelector('.suggested');

  return Array.from(root.querySelectorAll('.items article')).map(item => {
    // name
    const name = item.querySelector('h3')?.textContent.trim();

    // description
    const description = item.querySelector('p')?.textContent.trim();

    // image
    const image = item.querySelector('img')?.src;

    // price + currency
    const priceText = item.querySelector('b')?.textContent.trim();

    const price = priceText?.match(/\d+/)?.[0] || '';
    const symbol = priceText?.match(/[€$₽]/)?.[0];

    const currencyMap = {
      "₽": "RUB",
      "€": "EUR",
      "$": "USD"
    };

    const currency = currencyMap[symbol] || '';

    return {
      name,
      description,
      image,
      price,
      currency
    };
  });
}
