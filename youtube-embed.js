function loadYouTubeEmbeds() {
  document.querySelectorAll('iframe[data-youtube-id]').forEach((frame) => {
    const videoId = frame.dataset.youtubeId;
    if (!/^[a-zA-Z0-9_-]{11}$/.test(videoId)) return;

    const playerUrl = new URL(`https://www.youtube.com/embed/${videoId}`);
    playerUrl.searchParams.set('enablejsapi', '1');
    playerUrl.searchParams.set('origin', window.location.origin);
    frame.src = playerUrl.href;
  });
}

if (document.readyState === 'complete') {
  loadYouTubeEmbeds();
} else {
  window.addEventListener('load', loadYouTubeEmbeds, { once: true });
}
