if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
 const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) {
   entry.target.animate([{opacity:0,transform:'translateY(25px)'},{opacity:1,transform:'translateY(0)'}],{duration:600,easing:'ease-out'});
   observer.unobserve(entry.target);
  }
 }), {threshold:0.08});
 document.querySelectorAll('.card').forEach(card => observer.observe(card));
}
