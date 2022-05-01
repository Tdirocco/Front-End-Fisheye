function photographerFactory(data) {
    const { name, portrait, id, city, country, tagline, price } = data;

    const picture = `assets/Media/Photographers_ID_Photos/${portrait}`;

    function getUserCardDOM() {
        const article = document.createElement( 'article' );
        const link = document.createElement('a');
        link.setAttribute('href', `/photographer.html?id=${id}`);
        link.setAttribute('alt', `${name}`);
        const photo = document.createElement('div');
        photo.setAttribute('class', 'photo')
        const img1 = document.createElement( 'img' );
        img1.setAttribute("src", picture);
        img1.setAttribute('alt', name);
        img1.classList.add('fond');
        const img2 = document.createElement('img');
        img2.setAttribute("src", picture);
        img2.setAttribute('alt', name);
        img2.classList.add('top');
        const info = document.createElement('section');
        info.setAttribute('class', 'info');
        const photographName = document.createElement( 'h2' );
        photographName.textContent = name;
        const photographOrigin = document.createElement('h3');
        const originText = `${city}, ${country}`;
        photographOrigin.textContent = originText;
        const photographTag = document.createElement('h4');
        photographTag.textContent = tagline;
        photographPrice = document.createElement('p');
        const priceText = `${price}€/jour`;
        photographPrice.textContent = priceText;
        
        

        article.append(link, info);

        photo.append(img1, img2);
        
        link.append(photo, photographName);

        info.append(photographOrigin, photographTag, photographPrice);
        

        return (article);
    }
    return { name, picture, getUserCardDOM }
}



