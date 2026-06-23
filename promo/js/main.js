(function () {
  var video = document.getElementById("promoVideo");
  var videoCard = video ? video.closest(".video-card") : null;
  var playButton = document.querySelector(".video-play");
  var scrollButton = document.querySelector("[data-scroll-target]");

  var warmVideo = function () {
    if (!video || video.dataset.warmed === "true" || video.currentTime > 0 || !video.paused) {
      return;
    }

    video.dataset.warmed = "true";
    video.preload = "auto";
    try {
      video.load();
    } catch (error) {
      video.preload = "metadata";
    }
  };

  if (video) {
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(warmVideo, { timeout: 2600 });
    } else {
      window.addEventListener("load", function () {
        window.setTimeout(warmVideo, 1200);
      });
    }
  }

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
