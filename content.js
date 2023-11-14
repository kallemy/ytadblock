var element;
var elements;
var parent;
var len = 0;

window.addEventListener("load", ()=>{ 
    if (window.location.href.includes('https://www.youtube.com/results')) {
        setTimeout(()=>{hideAdsWatch(); },500);
    }
});

function handleObserver(){
    if (window.location.href.includes('https://www.youtube.com/results')) {
        setTimeout(()=>{hideAdsWatch(); },1000);
    }
    if (window.location.href=='https://www.youtube.com/') {
        setTimeout(()=>{hideAds(); hideTrash();},700);
        createButton();
    } else deleteButton();
    if (window.location.href.includes('https://www.youtube.com/watch')){
        setTimeout(()=>{hideAdsWatch(); },1000);
    }
}

function buttonExists(){
    var buttonExists = false;
    var center = document.querySelector("#center");
    if(center){
    elements = center.childNodes
        if(elements){
            elements.forEach((el)=>{
                if (el =="[object HTMLButtonElement]"){
                buttonExists = true;
                }
            });
        }
    }
    return buttonExists;
}

function createButton(){
    if (!buttonExists()){
        var button = document.createElement("button");
        button.textContent = "Show only new videos";
        button.style.fontSize = "16px"; 
        button.style.width = "100px"; 
        button.style.height = "40px"; 
        button.style.backgroundColor = "black"; 
        button.style.color = "white"; 
        button.addEventListener("click", function () {
            showNew();
        });
        center.appendChild(button);
    }
}

function deleteButton(){
    if(buttonExists()){
        var center = document.querySelector("#center");
        if(center){
        elements = center.childNodes;
            if(elements){
                elements.forEach((el)=>{
                    if (el =="[object HTMLButtonElement]"){
                    el.remove();
                    }
                });
            }
        }
    }
}

function showNew() {
    loadMoreDone=false;
    loadMore(()=>{
        hideOld();
        window.scrollTo(0, 0);
        hideTrash();
        hideAds();
        hideProgressed();
        rearrangeContents(()=>{
            setTimeout(()=>{
                //Check if trash still exists
            elements = document.querySelectorAll("#title");
            var found =false;
            if(elements) {
                var len = elements.length;
                for(var i=0; i<len ;i++) {
                    if(elements[i].textContent == "Shorts"){
                        found=true;
                        break;
                    }
                }
            }
                if(found) {
                    showNew(); 
                }
            },1000); 
        });
    });
}


var observer1;
var observer1Running = false;
//Assure mutation observer is always running
function setupObserver() {
    if (observer1Running) return;
    try {
      const titleElement = document.querySelector('title');
  
      if (titleElement) {
        observer1 = new MutationObserver(function (mutations) {
            observer1Running = true;
            handleObserver();
        }).observe(titleElement, { subtree: true, characterData: true, childList: true });
      } else {
        setTimeout(()=>{
            observer1Running = false;
            setupObserver();
          }, 2000);
      }
    } catch (error) {
      // Attempt to restart the observer setup after a delay (e.g., 2 seconds)
      if(observer) observer.disconnect();
      setTimeout(()=>{
        observer1Running = false;
        setupObserver();
      }, 2000);
    }
}
  
// Start the observer setup
setupObserver();

//Searches for ad-related elements in DOM and hides them
function hideAds() {
    element = document.querySelector("tp-yt-paper-dialog");
    if(element!=null) element.remove()

    element = document.querySelector("[class$='-ad-slot-renderer'], [class$='-ad-layout-renderer'], [class$='-promo-renderer']");
    if(element!=null){
        parent = element;
            while(parent.id!="content"){
                parent = parent.parentNode;
                if(parent==null) break;
            }
            if(parent.parentNode=!null) {
                if (parent.className!="style-scope ytd-app") parent.parentNode.remove();
            }
    }


    element = document.querySelector(".style-scope.ytd-statement-banner-renderer");
    if(element!=null){
            parent = element;
                while(parent.id!="content"){
                    parent = parent.parentNode;
                    if(parent==null) return;
                }
            if (parent.className!="style-scope ytd-app") parent.parentNode.remove();
    }

    //Remove masthead-ads
    elements = document.querySelectorAll('[id="masthead-ad"]');
    if(elements){
        elements.forEach((el)=>{
            el.remove();
        });
    }

    //Look for Recommended paid movies and hide them 
    elements = document.querySelectorAll(".style-scope.ytd-badge-supported-renderer");
    if(elements){
        var text = ["SUOSITUKSET", "RECOMMENDATIONS"];
        elements.forEach((el) => {
            if(text.includes(el.textContent.trim().toUpperCase())){
                parent = el;
                    while(parent.id!="content"){
                        parent = parent.parentNode;
                        if(parent==null) return;
                    }
                if (parent.className=="style-scope ytd-app") return;
                parent.parentNode.remove();
            }
        })
    } 
}

function hideAdsWatch(){
    element = document.querySelector("tp-yt-paper-dialog");
    if(element!=null) element.remove()

    element = document.querySelector("[class$='-ad-slot-renderer']");
    if(element!=null){
        parent = element;
            while(parent.id!="fulfilled-layout"){
                parent = parent.parentNode;
            }
        parent.parentNode.remove();
    }

    //Hide website-text
    elements = document.querySelectorAll("#website-text");
    if(elements) {
        elements.forEach((el) => {
            parent = el;
                while(parent.id!="fulfilled-layout"){
                    parent = parent.parentNode;
                }
            parent.remove();
        })
    }

    //Remove player-ads
    element = document.querySelector("#player-ads");
    if(element!=null){
        element.remove();
    }
    
    //Hide itemlists
    elements = document.querySelectorAll("#item-list");
    if(elements) {
        elements.forEach((el) => {
            parent = el;
                while(parent.id!="main"){
                    parent = parent.parentNode;
                    if(parent==null) return;
                }
            parent.style.display = "none";
        })
    }
}

function hideTrash(){
    //Hide shorts
    elements = document.querySelectorAll("#title");
    if(elements) {
        elements.forEach((el) => {
            if(el.textContent == "Shorts"){
                parent = el;
                    while(parent.id!="content"){
                        parent = parent.parentNode;
                        if(parent==null) return;
                    }
                if (parent.className=="style-scope ytd-app") return;
                parent.parentNode.remove();
            }
        })
    }


    //Hide mixes
    elements = document.querySelectorAll(".style-scope.ytd-thumbnail-overlay-bottom-panel-renderer");
    if(elements) {
        var i = 0;
        elements.forEach((el) => {
            if(el.textContent=="Mix"){
                parent = el;
                    while(parent.id!="content"){
                        parent = parent.parentNode;
                        if(parent==null) return;
                    }
                if (parent.className=="style-scope ytd-app") return;
                parent.parentNode.remove();
                i++;
            }
        })
        if(i>0)
    }

    //Hide ghost grids
    elements = document.querySelectorAll("ytd-ghost-grid-renderer")
    if(elements){
        elements.forEach((el)=>{
            el.remove();
        });
    }
}

//Click the ad skip button
function clickSkipButton() {
    const skipButton = document.querySelector(".ytp-ad-skip-button.ytp-button");
    var video = document.querySelector(".video-stream");
    video.muted = true;
    if (skipButton!=null) {
        setTimeout(() => { 
            skipButton.click(); 
            video.muted = false;
        }, 300);
    }
}

//Set video currentTime to 600 so that ad can be skipped  
function advance() {
    var video = document.querySelector(".video-stream");
    if (video!=null) {
        video.muted = true;
        setTimeout(() => { 
            var newTime = 600;
            //check if ad still exist to not skip the actual video
            const adOverlay = document.querySelector(".ytp-ad-player-overlay");
            if (adOverlay!=null){
            video.currentTime = newTime;
            video.muted = false;
            } 
        }, 300);
    } 
}

var coolDown = false //Cooldown so that mutate observer won't trigger multiple times in a row
//To be called when new elements appears in the DOM
function handleNewElementAppearance(mutationsList, observer) {
    if (coolDown) return
    for (const mutation of mutationsList) {
        if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
            //Check if a new element with the "ytp-ad-skip-button" class has been added, if so, press it
            const newButton = mutation.target.querySelector(".ytp-ad-skip-button.ytp-button");  
            if (newButton!=null) {
                coolDown = true
                setTimeout(() => {coolDown = false;}, 300);
                clickSkipButton(); 
            }
            //Check if an ad without skip button is added, if so, advance the video
            const newButton2 = mutation.target.querySelector(".ytp-ad-player-overlay");
            if (newButton2!=null) {
                coolDown = true
                setTimeout(() => {coolDown = false;}, 300);
                advance();
            }
            
            //Ignore promo pop-ups
            const newButtons = mutation.target.querySelectorAll("button");
            var len = newButtons.length;
            var text = ["NO THANKS", "EI KIITOS"];
            for(var i = 0; i<len ; i++) {
                var button = newButtons[i];
                if(text.includes(button.textContent.trim().toUpperCase())) {
                    coolDown = true
                    setTimeout(() => {coolDown = false;}, 300);
                    button.click();
                    break;
                }
            }
        }
    }
}

function hideProgressed(){
elements = document.querySelectorAll("#progress");
    if(elements) {
        var i = 0;
        elements.forEach((el) => {
                parent = el;
                while(parent.id!="content"){
                    parent = parent.parentNode;
                    if(parent==null) return;
                }
                if (parent.className=="style-scope ytd-app") return;
                parent.parentNode.remove();
                i++;
        });
    }
}

//Create a mutation observer to watch for changes in the DOM
const observer = new MutationObserver(handleNewElementAppearance);
observer.observe(document.body, { childList: true, subtree: true });

var loadMoreDone = false;

function loadMore(cb) {
    if(loadMoreDone) {
        loadMoreDone=false;
        return;
    }
      window.scrollBy(0, 999999);
      setTimeout(function() {
        var vids = document.querySelectorAll('.style-scope.ytd-rich-grid-renderer');
        if (vids.length > len) {
          len = vids.length;
          loadMore(cb);
        } else {
            loadMoreDone = true;
            cb();
        }
      }, 700);
  }
  

function hideOld(){
    elements = document.querySelectorAll(".inline-metadata-item.style-scope.ytd-video-meta-block");
    if(elements) {
        var i = 0;
        elements.forEach((el) => {
            const words = ["VUOTTA", "VUOSI", "KUUKAUSI", "KUUKAUTTA", "VIIKKO", "PÄIVÄÄ", "YEAR", "WEEK", "DAYS",]
            if(words.some(x => el.textContent.trim().toUpperCase().includes(x))){
                parent = el;
                    while(parent.id!="content"){
                        parent = parent.parentNode;
                        if(parent==null) return;
                    }
                if (parent.className=="style-scope ytd-app") return;
                parent.parentNode.remove();
                i++;
            }
        })
    }
}

var totalGridRowsRemoved= 0;
var totalChildsAppended = 0;
var itemsPerRow = 3;

function rearrangeContents(cb){
    element = document.querySelector('[items-per-row]');
    if(element) itemsPerRow = element.getAttribute('items-per-row');
    var contents1 = document.querySelector("#contents");
    if (contents1==null) {
        return;
    }
    var gridRows = contents1.childNodes;
    var gridRowsRemoved= 0;
    var childsAppended = 0;
    gridRows.forEach((gridRow)=> {  
        var contents2 = gridRow.childNodes[2];  
        var c2childCount = contents2.childElementCount;
        if(c2childCount==0) {
            gridRow.remove(); 
            gridRowsRemoved++;
            totalGridRowsRemoved++;
            return;
        }
        var abort = false;
        while(c2childCount<itemsPerRow) {
            if (abort) break;
            var nextNonEmptySiblingGridRow=gridRow.nextElementSibling; 
            var contentToMove;
            var i=1;
            while(1){
                if (nextNonEmptySiblingGridRow==null) {
                    abort = true;
                    break;
                }
                var cousinContent2 = nextNonEmptySiblingGridRow.childNodes[2];
                if(cousinContent2.childElementCount==0) {
                    nextNonEmptySiblingGridRow = nextNonEmptySiblingGridRow.nextElementSibling;
                    continue;
                } else {
                    childsAppended++;
                    totalChildsAppended++;
                    elementToMove = cousinContent2.childNodes[0];
                    contents2.appendChild(elementToMove);
                    c2childCount = contents2.childElementCount;
                    break;
                }
            }     
        }
    });
    if(childsAppended>0){
        setTimeout(()=>{
            rearrangeContents(cb);
        },500);
    } else {
        cb();
    }
}


