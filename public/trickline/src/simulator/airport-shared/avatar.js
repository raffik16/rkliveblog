// The operator in the top bar.
// Trickline: upstream ships a generated headshot here (a 112 px JPEG); this copy holds a drawn silhouette instead, so
// the page never shows a face. The person in the top bar is made up.
export const OPERATOR_AVATAR = 'data:image/svg+xml,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 88 88"><rect width="88" height="88" fill="#3166ea"/>' +
  '<circle cx="44" cy="35" r="16" fill="#cfdcfb"/><path d="M13 88c3-19 15-28 31-28s28 9 31 28z" fill="#cfdcfb"/>' +
  '<path d="M27 31c1-11 8-17 17-17s16 6 17 17c-6-5-11-7-17-7s-11 2-17 7z" fill="#1a2440"/></svg>'
);
