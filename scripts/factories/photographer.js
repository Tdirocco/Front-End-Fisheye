function photographerFactory(data) {
    const { name, portrait, id, city, country, tagline, price } = data;

    const picture = `assets/photographers/${portrait}`;

    function getUserCardDOM() {
        const article = document.createElement( 'article' );
        const img = document.createElement( 'img' );
        img.setAttribute("src", picture)
        const h2 = document.createElement( 'h2' );
        h2.textContent = name;
        const link = document.createElement('a');
        link.setAttribute("href", `/photographer.html?id=${id}`);

        const info = document.createElement('section');
        const origin = document.createElement('h3');
        const originText = `${city}, ${country}`;
        origin.textContent = originText;
        const tag = document.createElement('h4');
        tag.textContent = tagline;
        const tarif = document.createElement('p');
        const priceText = `${price}€/jour`;
        tarif.textContent = priceText;
        
        article.append(link, info);
        link.append(img, h2);
    
        info.append(origin);
        info.append(tag);
        info.append(tarif);        

       
        return (article);
    }
    return { name, picture, getUserCardDOM }
}