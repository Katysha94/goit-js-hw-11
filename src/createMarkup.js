export function renderImageList(images) {
  const markup = images
    .map((image) => {
      return `
        <div class="photo-card">
        <a href="${image.largeImageURL}">
          <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy"/></a>
          <div class="stats">
            <p class="stats-item">
              Likes: ${image.likes}
            </p>
            <p class="stats-item">
              Views: ${image.views}
            </p>
            <p class="stats-item">
              Comments: ${image.comments}
            </p>
            <p class="stats-item">
              Downloads: ${image.downloads}
            </p>
          </div>
        </div>
      `;
    })
      .join('');
    
 return markup;
}