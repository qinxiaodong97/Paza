document.addEventListener('DOMContentLoaded', function () {
  var lazyVideos = [...document.querySelectorAll('video.lazy')];

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
          video.target.play();
          video.target.classList.remove('lazy');
          lazyVideoObserver.unobserve(video.target);
          console.log('lazy video in window!');
        }
      });
    });

    lazyVideos.forEach(function (lazyVideo) {
      lazyVideoObserver.observe(lazyVideo);
    });
  }
});

Object.defineProperty(HTMLMediaElement.prototype, 'playing', {
  get: function () {
    return !!(
      this.currentTime > 0 &&
      !this.paused &&
      !this.ended &&
      this.readyState > 2
    );
  },
});

[...document.querySelectorAll('video')].forEach((video) => {
  video.addEventListener('suspend', () => {
    // suspend invoked
    // show play button
  });
  video.addEventListener('play', () => {
    // video is played
    // remove play button UI
  });
});

// $("body").on("click touchstart", function () {
//   [...document.querySelectorAll("video")].foreach((video) => {
//     if (video.playing) {
//       // video is already playing so do nothing
//     } else {
//       // video is not playing
//       // so play video now
//       video.play();
//     }
//   });
// });

document.body.addEventListener('touchstart', function () {
  // console.log("body touchstart");
  [...document.querySelectorAll('video')].forEach((video) => {
    if (video.playing) {
      // video is already playing so do nothing
    } else {
      // video is not playing
      // so play video now
      video.play();
    }
  });
});

document.body.addEventListener('click', function () {
  // console.log('body click');
  [...document.querySelectorAll('video')].forEach((video) => {
    if (video.playing) {
      // video is already playing so do nothing
    } else {
      // video is not playing
      // so play video now
      video.play();
    }
  });
});
