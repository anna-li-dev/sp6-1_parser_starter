// @todo: напишите здесь код парсера
//meta
function getMeta() {
    //title
    const titleString = document.querySelector('title')?.textContent.trim();
    const titleArr = titleString?.split('—');
    const title = titleArr?.[0].trim();

    //description
    const description = document.querySelector('meta[name="description"]')?.getAttribute('content')?.trim();

    //keywords
    const keywordsString = document.querySelector('meta[name="keywords"]')?.getAttribute('content');

    const keywords = keywordsString ? keywordsString.split(',').map( (word) => word.trim() ) : [];

    //language
    const language = document.documentElement.lang.trim();

    //opengraph
    const ogTitle = document.querySelector('meta[property="og:title"]')?.getAttribute('content')?.trim()
        .split('—')
        [0]
        .trim();
    const ogImage = document.querySelector('meta[property="og:image"]')?.getAttribute('content')?.trim();
    const ogType = document.querySelector('meta[property="og:type"]')?.getAttribute('content')?.trim();

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

//=============== product ===================
//product container
function getProductContainer() {
    const productContainer = document.querySelector('.product');
    return productContainer;
}
//id
function getProductId() {
    return getProductContainer()?.dataset.id.trim();
}
//name
function getProductName() {
    const title = getProductContainer()?.querySelector('.title')?.textContent.trim();
    return title;
}
//isLiked
function getIsLiked() {
    const btnLike = getProductContainer()?.querySelector('.like');
    const isLiked = btnLike.classList.contains('active');
    return isLiked;
}

//price
function getPrice() {
    const text = getProductContainer()?.querySelector('.price')?.textContent?.trim().match(/\d+/);
    const price = Number(text);
    return price;
}
//Old Price
function getOldPrice() {
    const text = getProductContainer()?.querySelector('.price span')?.textContent?.trim().match(/\d+/);
    const oldPrice = Number(text);
    return oldPrice;
}
//currency
function getCurrency() {
    const symbol = getProductContainer()?.querySelector('.price')?.textContent.trim()[0];

    const currencyMap = {
        "₽": "RUB",
        "€": "EUR",
        "$": "USD"
    }

    return currencyMap[symbol] || '';
}
//discount
function getDiscount() {
    return getOldPrice() - getPrice() || 0;
}
//discountPercent
function getDiscountPercent() {
    const oldPrice = getOldPrice();
    const discount = getDiscount();
    const discountPercent = ((discount / oldPrice) * 100).toFixed(2);

    if (!oldPrice) {
        return '';
    } else {
        return `${discountPercent}%`;
    }
}

//description
function getDescription() {
    const desc = getProductContainer()?.querySelector('.description');
    const clone = desc?.cloneNode(true);
    clone?.querySelectorAll('*').forEach( (element) => {
        for (const attribute of element.attributes) {
            element.removeAttribute(attribute.name) // delete attributes
        }
    } );

    return clone?.innerHTML.trim() || '';
}

//tags
function getTags() {
    const product = getProductContainer();
    const result = {
        "category": [],
        "label": [],
        "discount": []
    };

    product.querySelectorAll('.tags span')
        ?.forEach( (tag) => {
            const text = tag.textContent.trim();

            if(tag.classList.contains('green')) {
                result.category.push(text);
            } else if (tag.classList.contains('blue')) {
                result.label.push(text);
            } else if (tag.classList.contains('red')) {
                result.discount.push(text);
            }
        } )

    return result;
}

//properties
function getProperties() {
    const product = getProductContainer();
    const result = {};

    product.querySelectorAll('.properties li')
        .forEach( (item) => {
            const key = item.children[0]?.textContent.trim();
            const value = item.children[1]?.textContent.trim();

            if(key) {
                result[key] = value;
            }
        } )
    return result;
}

//images
function getImages() {
    const product = getProductContainer();

    // // 1. Main image
    // const mainImg = product?.querySelector('.preview figure img');
    // const main = {
    //     "preview": mainImg.src,
    //     "full": mainImg.src,
    //     "alt": mainImg.alt
    // };

    // 2. thumbnails
    const thumbnailsNodes = product?.querySelectorAll('nav img');
    const thumbnails = Array.from(thumbnailsNodes).map( (img) => {
        const thumbnail = {
            "preview": img.src,
            "full": img.dataset.src,
            "alt": img.alt
        }
        return thumbnail;
    } );

    // 3. Remove duplicates
    // const filtered = thumbnails.filter( (imgGroup) =>  imgGroup.full !== main.full);

    // 4. Result
    // return [main, ...filtered];
    return thumbnails;
}

//=============== product - result ===================
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


//=============== Suggested ===================
function getSuggested() {
    const suggested = document.querySelector('.suggested');
    const suggestedNodes = suggested?.querySelectorAll('.items article');
    const suggestedList = Array.from(suggestedNodes)
        .map( (card) => {
            const image = card.querySelector('img')?.src;
            const name = card.querySelector('h3')?.textContent.trim();
            const description = card.querySelector('p')?.textContent.trim();
            const priceText = card.querySelector('b')?.textContent.trim();
            const price = priceText?.match(/\d+/)?.[0] || '';

            const symbol = priceText?.[0];
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
            }
        } );
    return suggestedList;
}

//fate transform
function formatDate(dateString) {
    if(!dateString) return '';

    const [day, month, year] = dateString.split('/');
    return `${day}.${month}.${year}`
}

//=============== reviews ===================
function getReviews() {
    const reviews = document.querySelector('.reviews');
    const reviewsNodes = reviews?.querySelectorAll('.items article');
    const reviewsList = Array.from(reviewsNodes)
        .map( (card) => {
            const rating = card.querySelectorAll('.rating .filled').length;
            const title = card.querySelector('.title')?.textContent.trim();
            const description = card.querySelector('.title ~ p')?.textContent?.trim();

            //autor
            const authorBlock = card.querySelector('.author');
            const avatar = authorBlock?.querySelector('img')?.src;
            const name = authorBlock?.querySelector('span')?.textContent?.trim();

            //Date
            const rawDate = authorBlock?.querySelector('i')?.textContent?.trim();
            const date = formatDate(rawDate);



            return {
                rating,
                author: {
                    avatar,
                    name
                },
                title,
                description,
                date
            };
        } );

    return reviewsList;
}







function parsePage() {
    return {
        meta: getMeta(),
        product: getProduct(),
        suggested: getSuggested(),
        reviews: getReviews()
    };
}

window.parsePage = parsePage;
