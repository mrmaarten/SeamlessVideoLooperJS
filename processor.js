/*  ToDo
*   - canvas scales to window size
*   - video scales to canvas size
*/

document.addEventListener('DOMContentLoaded', function () {
  let canvas1 = document.getElementById('canvas1');
  let ctx1 = canvas1.getContext('2d');
  const video1 = document.querySelector('#video1');

  let canvas2 = document.getElementById('canvas2');
  let ctx2 = canvas2.getContext('2d');
  const video2 = document.querySelector('#video2');
  // video2.src = 'media/1-6.mp4'; // set the video source

  let fadeOutTime = 1; // seconds
  let duration = null;
  let lastFadeTime = null;

  let fps = 25;

  let videoState = {};
  videoState.vid1 = 3;
  videoState.vid1FadeOutBegin = false;
  videoState.vid2 = 3;
  videoState.vid2FadeOutBegin = false;
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
  * vid1 fade out:  2-4
  * vid1 finish:    3-1
  * vid2 plays:     3-1
  * vid2 fade out:  4-2
  * vid2 finish:    1-3
  */

  const toggleCanvas1Button = document.querySelector('#toggle-canvas1');
  const toggleCanvas2Button = document.querySelector('#toggle-canvas2');

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
        video.pause();
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

    // canvas1.width = video1.videoWidth;
    // canvas1.height = video1.videoHeight;

    duration = video1.duration;
    lastFadeTime = video1.duration - fadeOutTime - 0.5;

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

    if (video1.currentTime >= lastFadeTime && !videoState.vid1FadeOutBegin) {
      videoState.vid1FadeOutBegin = true;
      setStateAttribute(1, 2); // fadeOUT state
      setStateAttribute(2, 4); // fadeIN state
      gsap.to(canvas1.style, { duration: fadeOutTime, opacity: 0, onComplete: fadeOutVid1Complete });
      gsap.to(video1, { duration: fadeOutTime, volume: 0 });
    } else if (video2.currentTime >= lastFadeTime && !videoState.vid2FadeOutBegin) {
      videoState.vid2FadeOutBegin = true;
      setStateAttribute(2, 2); // fadeIN state
      setStateAttribute(1, 4); // fadeOUT state

      gsap.to(canvas2.style, { duration: 1, opacity: 0, onComplete: fadeOutVid2Complete });
      gsap.to(video2, { duration: 1, volume: 0 });
    }

    if (!video1.paused && !video1.ended) {
      setTimeout(playVideo, 1000 / fps);
    }
    if (!video2.paused && !video2.ended) {
      setTimeout(playVideo, 1000 / fps);
    }
  }

  function fadeOutVid1Complete() {
    console.log('fadeOutVid1Complete')
      videoState.vid1FadeOutBegin = false;
      setStateAttribute(1, 3);
      setStateAttribute(2, 1);
  }

  function fadeOutVid2Complete() {
    console.log('fadeOutVid2Complete')
        videoState.vid2FadeOutBegin = false;
        setStateAttribute(1, 1);
        setStateAttribute(2, 3);
  }
    
  

});

