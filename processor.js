function loadProcessor() {
  // Your code that depends on the GSAP library goes here
  console.log('processor.js loaded');
}


document.addEventListener('DOMContentLoaded', function () {
  var canvas1 = document.getElementById('canvas1');
  var ctx1 = canvas1.getContext('2d');
  const video1 = document.querySelector('#video1');

  var canvas2 = document.getElementById('canvas2');
  var ctx2 = canvas2.getContext('2d');
  const video2 = document.querySelector('#video2');
  // video2.src = 'media/1-6.mp4'; // set the video source

  var fadeOutTime = 0.5; // seconds
  var duration = null;
  var lastFadeTime = null;

  var fps = 25;
  var alpha = 1;

  var videoState = {};
  videoState.vid1 = 3;
  videoState.vid2 = 3;
  console.log(videoState)

  /* video states
  *   1: playing:    z-index: 20; alpha = 1; video.play(); 
  *   2: fade OUT:   z-index: 20; alpha<0; video.play();
  *   3: waiting:    z-index: 10; alpha = 1; video.pause(); video.curentTime = 0;
  *   4: fade IN:    z-index: 10; alpha = 1; video.play();
  * 
  * we start with:  3-3
  * vid1 plays:     1-3
  * 
  * vid1 fade out:  2-1
  * vid1 finish:    3-1
  * vid2 plays:     3-1
  * vid2 fade out:  1-2
  * vid2 finish:    1-3
  */

  const toggleCanvas1Button = document.querySelector('#toggle-canvas1');
  const toggleCanvas2Button = document.querySelector('#toggle-canvas2');
  // const canvas1 = document.querySelector('#canvas1');
  // const canvas2 = document.querySelector('#canvas2');

  toggleCanvas1Button.addEventListener('click', () => {
    canvas1.hidden = !canvas1.hidden;
  });

  toggleCanvas2Button.addEventListener('click', () => {
    canvas2.hidden = !canvas2.hidden;
  });

  const playButton = document.getElementById('play-button');
    playButton.addEventListener('click', function() {
      console.log(video2.paused)
      if (videoState.vid1 == 3 && videoState.vid2 == 3){
        
        videoState.vid1 = 1;
        videoState.vid2 = 3;

        setStateAttribute(1, 1)
        setStateAttribute(2, 3)
        video1.play();
        playVideo();

      } else if (videoState.vid1 == 1 && !video1.paused) {
          video1.pause();
          playButton.textContent = 'Pause1';
      } else if ( videoState.vid1 == 1 && video1.paused) { 
        video1.play();
        playButton.textContent = 'Play1';
      } else if ( videoState.vid2 == 1 && !video2.paused) { 
        video2.pause();
        playButton.textContent = 'Pause2';
      } else if (videoState.vid2 == 1 && video2.paused) {
        video2.play();
        playButton.textContent = 'Play2';
      }
    });

  function setStateAttribute(videoNum, stateNum, zIndex) {
    // Get the video and canvas elements based on the videoNum argument
    const video = document.querySelector(`#video${videoNum}`);
    const canvas = document.querySelector(`#canvas${videoNum}`);
  
    console.log(video)
    console.log(canvas)

    // Set the state based on the stateNum argument
    switch (stateNum) {
      case 1:
        video.play();
        canvas.style.zIndex = 20;
        canvas.style.opacity = 1;
        break;
      case 2:
        // Handle state 2
        break;
      case 3:
        if (typeof zIndex === 'undefined'){
          zIndex = 10;
        }
        video.play();
        playVideo();
        canvas.style.zIndex = zIndex;
        canvas.style.opacity = 1;
        //video.pause();
        video.currentTime = 0;
        break;
      case 4:
        video.play();
        canvas.style.zIndex = 10;
        canvas.style.opacity = 1;
        break;
      default:
        console.error('Invalid state number');
    }
  }
    
  video1.addEventListener('loadedmetadata', function() {
    /*  get video duration
    *   let's see how this works when switching video's
    *   video 1 and 2 need to be the same
    */

    canvas1.width = video1.videoWidth;
    canvas1.height = video1.videoHeight;

    // debug to make test shorter
    video1.currentTime = video1.duration - 3; // start 5 seconds before end

    duration = video1.duration;
    lastFadeTime = video1.duration - fadeOutTime;

    initVideo();
  });

  function initVideo(){
    setStateAttribute(1, 3, 20);
    setStateAttribute(2, 3, 10);
    console.log('init')

  }

  function playVideo() {
    // if (videoState.vid1 == 1 || videoState.vid1 == 2){
      ctx1.drawImage(video1, 0, 0);
    // }
    // if (videoState.vid2 == 1 || videoState.vid2 == 2){
      ctx2.drawImage(video2, 0, 0);
    // }

    
    if (video1.currentTime >= lastFadeTime) {
      videoState.vid1 = 2 // fadeOUT state
      videoState.vid2 = 4 // fadeIN state
      alpha -= 1 / (fadeOutTime * fps);
    
      console.log(alpha)

      if (alpha <= 0.12) {
        alpha = 0;
        if (videoState.vid1 == 2) {
          videoState.vid1 = 3;
          video1.pause();
          video1.currentTime = 0;
          canvas1.style.zIndex = 10;
          canvas1.style.opacity = 1;

          videoState.vid2 = 1;
          canvas2.style.zIndex = 20;
          playVideo();
        }
        if (videoState.vid2 == 2) {
          videoState.vid2 = 3;
          video2.pause();
          video2.currentTime = 0;
          canvas2.style.zIndex = 10;
          canvas2.style.opacity = 1;

          videoState.vid1 = 1;
          canvas1.style.zIndex = 20;
          playVideo();
        }
        alpha = 1;
      }

      if(videoState.vid1 == 2){
        canvas1.style.opacity = alpha;
        video1.volume = alpha;
        video2.volume = 1 - alpha;
  
        video2.play();
      }
          

    }

    if (!video1.paused && !video1.ended) {
      setTimeout(playVideo, 1000 / fps);
    }
    if (!video2.paused && !video2.ended) {
      setTimeout(playVideo, 1000 / fps);
    }
  }
});

