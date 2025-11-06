// renderer.js
window.addEventListener('DOMContentLoaded', () => {
  const startPageUrl = 'https://serge-ivamov.github.io/ryoutube-home/';
  const urlInput = document.getElementById('url-input');
  const goButton = document.getElementById('go-button');
  const backButton = document.getElementById('back-button');
  const forwardButton = document.getElementById('forward-button');
  const reloadButton = document.getElementById('reload-button');
  const stopButton = document.getElementById('stop-button');
  const youtubeButton = document.getElementById('youtube-button');
  const navBar = document.getElementById('nav-bar');
  const navigateToUrl = () => { const url = urlInput.value; if (url) { window.electronAPI.navigate(url); } };

  // Нажатие Enter в поле URL
  urlInput.addEventListener('keydown', (event) => { if (event.key === 'Enter') { navigateToUrl(); } });
  goButton.addEventListener('click', navigateToUrl);
  backButton.addEventListener('click', () => { window.electronAPI.back(); });
  forwardButton.addEventListener('click', () => { window.electronAPI.forward(); });
  reloadButton.addEventListener('click', () => { window.electronAPI.reload(); });
  stopButton.addEventListener('click', () => { window.electronAPI.stop(); });
  youtubeButton.addEventListener('click', () => { window.electronAPI.goYoutube(); });

  // Обработка обновления URL из основного процесса
  window.electronAPI.handleUrlUpdate((url) => {
    if (url === startPageUrl || url === startPageUrl + '/') { urlInput.value = '';
    } else { urlInput.value = url; }
  });

  // Обработчик скрытия/показа панели навигации
  window.electronAPI.handleToggleNav((isVisible) => {
    if (isVisible) { navBar.style.display = 'flex';
    } else { navBar.style.display = 'none'; }
  });

});

