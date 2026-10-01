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
 if (destination.origin !== window.location.origin || destination.pathname !== window.location.pathname || destination.search !== window.location.search) {
  pauseVideosExcept(null);
  document.querySelectorAll('video').forEach(video => {
   video.removeAttribute('src');
   video.querySelectorAll('source').forEach(source => source.removeAttribute('src'));
   video.load();
  });
 }
});
window.addEventListener('pagehide', () => pauseVideosExcept(null));
document.addEventListener('visibilitychange', () => {
 if (document.hidden) pauseVideosExcept(null);
});

// Warm only HTML pages, never large video or image files.
const preparedPages = new Set();
function preparePage(link) {
 if (!link || link.target === '_blank' || link.hasAttribute('download')) return;
 const url = new URL(link.href, location.href);
 if (url.origin !== location.origin || !url.pathname.endsWith('.html') || url.pathname === location.pathname) return;
 url.hash = '';
 if (preparedPages.has(url.href)) return;
 preparedPages.add(url.href);
 const hint = document.createElement('link');
 hint.rel = 'prefetch';
 hint.as = 'document';
 hint.href = url.href;
 document.head.appendChild(hint);
}
document.addEventListener('pointerover', event => preparePage(event.target.closest?.('a[href]')), {passive:true});
document.addEventListener('focusin', event => preparePage(event.target.closest?.('a[href]')));
const prepareLinkedPages = () => {
 if (navigator.connection?.saveData) return;
 document.querySelectorAll('a[href]').forEach(preparePage);
};
if ('requestIdleCallback' in window) requestIdleCallback(prepareLinkedPages, {timeout:2000});
else setTimeout(prepareLinkedPages, 1000);
// Restore source URLs if the browser brings a page back from its history cache.
const videoSources = Array.from(document.querySelectorAll('video source'), source => [source, source.getAttribute('src')]);
window.addEventListener('pageshow', event => {
 if (event.persisted) videoSources.forEach(([source, src]) => { if (src) source.setAttribute('src', src); });
});
