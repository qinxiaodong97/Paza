const VIDEO_URLS = [
  'https://cdn.shopify.com/videos/c/o/v/d685f469cb114eaf912b294a53fed374.mp4',
  'https://cdn.shopify.com/videos/c/o/v/b7504a7e11714cc7a3f8956d6969170e.mp4',
  'https://cdn.shopify.com/videos/c/o/v/524319ad5eb74bbcb489f33c21987fc3.mp4',
  'https://cdn.shopify.com/videos/c/o/v/bf447523135b43bbac0b748fc2519e31.mp4',
  'https://cdn.shopify.com/videos/c/o/v/e2ca209713f549c6b5c95b192562554f.mp4',
];

//shuffle the array

function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;
  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

console.log(VIDEO_URLS);
console.log(shuffle(VIDEO_URLS));

document.addEventListener('DOMContentLoaded', function () {
  let lazyVideos = [...document.querySelectorAll('[data-src=random]')];
  console.log('videos with data-src=random: ', lazyVideos);

  if ('IntersectionObserver' in window) {
    var lazyVideoObserver = new IntersectionObserver(function (
      entries,
      observer
    ) {
      entries.forEach(function (video) {
        if (video.isIntersecting) {
          for (var source in video.target.children) {
            var videoSource = video.target.children[source];
            if (
              typeof videoSource.tagName === 'string' &&
              videoSource.tagName === 'SOURCE'
            ) {
              videoSource.src = videoSource.dataset.src;
            }
          }

          video.target.load();
          lazyVideoObserver.unobserve(video.target);
        }
      });
    });

    lazyVideos.forEach(function (lazyVideo) {
      lazyVideoObserver.observe(lazyVideo);
    });
  }
});
