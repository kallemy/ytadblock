//This portion is for hiding static ads  //Some of the timeouts may be shortened or removed //The ad is not always muted, this can happen if a function unmutes the video while another ad is loaded
//Listens to changes in title: page refresh or new page
new MutationObserver(function (mutations) {
    hideAds(); 
}).observe(
    document.querySelector('title'),
    { subtree: true, characterData: true, childList: true }
  );

//Searches for ad-related elements in DOM and hides them
function hideAds() {
    const adElements = document.querySelectorAll("[class$='-ad-renderer'], [class$='-ad-slot-renderer'], [class*='-promo-renderer'], [id$='player-ads'], [class$='teaser-wrap']");
    adElements.forEach(adElement => {
      adElement.style.display = "none";
    });
    console.log("ytads: Blocked: " +adElements.length);
}

//This portion is for skipping video ads
//Click the ad skip button
function clickSkipButton() {
    const skipButton = document.querySelector(".ytp-ad-skip-button.ytp-button");
    var video = document.querySelector(".video-stream");
    video.muted = true;
    if (skipButton) {
        setTimeout(() => { 
            console.log("ytAds: click! unmuted")
            skipButton.click(); 
            video.muted = false;
        }, 1000);
    }
}

//Set (ad) video currentTime to 600 so that it can be skipped  
function advance() {
    var video = document.querySelector(".video-stream");
    if (video) {
        video.muted = true;
        console.log("ytAds: skip, muted...")
        setTimeout(() => { 
            var newTime = 600;
            //check if ad still exist to not skip the actual video
            const adOverlay = document.querySelector(".ytp-ad-player-overlay");
            if (adOverlay){
            video.currentTime = newTime;
            video.muted = false;
            console.log("ytAds: skipped, unmuted")
            } else console.log("ytAds: Ad's no more")
        }, 1000);
    } else console.log("ytAds: video not found")
}

//Cooldown so that mutate observer won't trigger multiple times in a row
var coolDown = false
//To be called when new elements appears in the DOM
function handleNewElementAppearance(mutationsList, observer) {
    if (coolDown) return
    for (const mutation of mutationsList) {
        if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
            //Check if a new element with the "ytp-ad-skip-button" class has been added, if so, press it
            const newButton = mutation.target.querySelector(".ytp-ad-skip-button.ytp-button");  
            if (newButton) {
                coolDown = true
                setTimeout(() => {coolDown = false;}, 500);
                console.log("ytAds: Skippable ad found, muted")
            clickSkipButton(); 
            }
            //Check if an ad without skip button is added, if so, advance the video
            const newButton2 = mutation.target.querySelector(".ytp-ad-player-overlay");
            if (newButton2) {
                console.log("ytAds: Non-skippable ad found") 
                coolDown = true
                setTimeout(() => {coolDown = false;}, 500);
                advance();
            }
        }
    }
}

//Create a mutation observer to watch for changes in the DOM
const observer = new MutationObserver(handleNewElementAppearance);
observer.observe(document.body, { childList: true, subtree: true });




