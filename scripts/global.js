//global event tracking
var isTouch = "ontouchstart" in window || navigator.msMaxTouchPoints > 0;

//old IE event shim function
function addListener(el, e, func) {
	if(el.attachEvent) {
		return el.attachEvent("on"+e, func);
	} else {
		return el.addEventListener(e, func, false);
	}
}

//with some friendly help/stealing to get back to vanilla and away from jquery care of http://youmightnotneedjquery.com/
function addClass(el, className) {
    if (el.classList) {
        el.classList.add(className);
    } else {
        el.className += ' ' + className;
    }
}
function removeClass(el, className) {
    if (el.classList) {
        el.classList.remove(className);
    } else {
        el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }
}
function toggleClass(el, className) {
    if (el.classList) {
        el.classList.toggle(className);
    } else {
        var classes = el.className.split(' ');
        var existingIndex = classes.indexOf(className);

        if (existingIndex >= 0) {
            classes.splice(existingIndex, 1);
        } else {
            classes.push(className);
        }

        el.className = classes.join(' ');
    }
}
function hasClass(el, className) {
    if (el.classList) {
        return el.classList.contains(className);
    } else {
        return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
    }
}

window.onload = function() {
	if(isTouch) {
		document.getElementsByTagName('body')[0].className+=" istouch";
	} else {
		document.getElementsByTagName('body')[0].className+=" allowhover";
	}
	if("backgroundSize" in document.body.style) {
		document.getElementsByTagName('body')[0].className+=" bgsize";
	}
	if(isIE8) {
		//put any fixes here
	}
	addListener(document.getElementById("showHeader"), "click", function () {
	    document.getElementById("headerScroll").scrollTop = 0;
	    removeClass(document.getElementById("header"), "hidden");
	});
	addListener(document.getElementById("hideHeader"), "click", function () {
	    addClass(document.getElementById("header"), "hidden");
	});
    //show at first? then hide after a couple seconds
	if (!hasClass(document.getElementById("header"), "hidden")) {
	    setTimeout(function () {
	        addClass(document.getElementById("header"), "hidden")
	    }, 2000);
	}
	var elList = document.getElementById("content").getElementsByClassName("section-head");
	for (var i = 0; i < elList.length; i++) {
	    addClass(elList[i], "text-reverse");
	}
	document.getElementById("sectionNav").style.display = "block";
	positionSectionHeaders();
	elList = document.getElementById("sectionNav").getElementsByClassName("section-head");
	for (var i = 0; i < elList.length; i++) {
	    addListener(elList[i], "click", function () {
	        var sectionID = this.id.replace("head", "");
	        var getSectionNum = sectionID.replace("section", "");
	        window.scrollTo(0, document.getElementById(sectionID).getElementsByClassName("section-head")[0].offsetTop - (this.offsetHeight * (getSectionNum - 1)));
	    });
	}
};

window.onresize = function() {
    positionSectionHeaders();
};

window.onscroll = function () {
    positionSectionHeaders();
};

function positionSectionHeaders() {
    var winHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    var elList = document.getElementById("sectionNav").getElementsByClassName("section-head");
    document.getElementById("content").style.paddingTop = (winHeight - (elList[0].offsetHeight * (elList.length - 1))) + "px";
    for (var i = 0; i < elList.length; i++) {
        var sectionID = elList[i].id.replace("head", "");
        var getSectionNum = sectionID.replace("section", "");
        var sectionEl = document.getElementById(sectionID).getElementsByClassName("section-head")[0];
        var getTop = sectionEl.offsetTop - window.scrollY;
        var minTop = elList[i].offsetHeight * (getSectionNum - 1);
        var maxTop = winHeight - (elList[i].offsetHeight * (elList.length - (getSectionNum - 1)));
        if (getTop < minTop) {
            getTop = minTop;
        }
        if (getTop > maxTop) {
            getTop = maxTop;
        }
        elList[i].style.top = getTop + "px";
        elList[i].style.left = sectionEl.offsetLeft + "px";
        elList[i].style.width = sectionEl.offsetWidth + "px";
    }
}