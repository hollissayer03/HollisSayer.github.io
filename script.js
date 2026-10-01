// Keep only one video playing and stop media before leaving a page.
function pauseVideosExcept(activeVideo) {
 document.querySelectorAll('video').forEach(video => {
  if (video !== activeVideo && !video.paused) video.pause();
 });
}
document.addEventListener('play', event => {
 if (event.target instanceof HTMLVideoElement) pauseVideosExcept(event.target);
}, true);
document.addEventListener('click', event => {
 const link = event.target.closest?.('a[href]');
 if (!link || event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || link.target === '_blank' || link.hasAttribute('download')) return;
 const destination = new URL(link.href, window.location.href);
 if (destination.origin !== window.location.origin || destination.pathname !== window.location.pathname || destination.search !== window.location.search) pauseVideosExcept(null);
});
window.addEventListener('pagehide', () => pauseVideosExcept(null));
document.addEventListener('visibilitychange', () => {
 if (document.hidden) pauseVideosExcept(null);
});
