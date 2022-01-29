function mediaFactory(data) {
    const { title, image, likes, date} = data;

    const picture = `assets/Media/${selectedPhotographerInfo.name}/${image}`;

    function getMediaCardDOM() {
        const article = document.createElement( 'article' );
        const img = document.createElement( 'img' );
        img.setAttribute("src", picture)
        const h2 = document.createElement( 'h2' );
        h2.textContent = title;
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
        
        article.appendChild(link);
        link.appendChild(img);
        link.appendChild(h2);

        article.appendChild(info);
        info.appendChild(origin);
        info.appendChild(tag);
        info.appendChild(tarif);        

       
        return (article);
    }
    return { title, picture, getMediaCardDOM }
}