(function () {
  var video = document.getElementById("promoVideo");
  var videoCard = video ? video.closest(".video-card") : null;
  var playButton = document.querySelector(".video-play");
  var scrollButton = document.querySelector("[data-scroll-target]");

  if (scrollButton) {
    scrollButton.addEventListener("click", function () {
      var target = document.querySelector(scrollButton.getAttribute("data-scroll-target"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }

  if (video && videoCard && playButton) {
    var syncPlayState = function () {
      videoCard.classList.toggle("is-playing", !video.paused && !video.ended);
    };

    var playVideo = function () {
      var playPromise = video.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(syncPlayState);
      }
    };

    var toggleVideo = function () {
      if (video.paused || video.ended) {
        playVideo();
      } else {
        video.pause();
      }
    };

    playButton.addEventListener("click", function () {
      playVideo();
    });

    video.addEventListener("click", function () {
      toggleVideo();
    });

    video.addEventListener("play", syncPlayState);
    video.addEventListener("pause", syncPlayState);
    video.addEventListener("ended", syncPlayState);
  }
})();
