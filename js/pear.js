/*jslint browser: true, regexp: true, sub: false, vars: false, white: false, nomen: false, sloppy: true, undef: false, plusplus: true */
/*global jQuery, $, Event, refresh, escape, unescape, slideshowImages, ImageFlow, focusImage, swatchImg  */

var savedHeight = savedWidth = 0;
var pear = {defaultView: "grid",
    detailView: false,
    defaultBg: "black",
    slideshowTimeout: 5000,
    currentImg: 0,
    hovering: false,
    mosaicEffect: "" };

function thumbPadding() {
    var size, width, margin;
    /* Padding on thumbs to make them flow nicer */
    size = Math.ceil((pear.currentView === 'mosaic') ? $('#imgSlider').slider('value') / 2 : $('#imgSlider').slider('value')) + 10;
    width = $('#gridContainer').innerWidth() - 16;
    margin = width / Math.floor(width / size) - size;
    $('.gallery-thumb').css({'margin-left': Math.ceil(margin / 2) + 'px', 'margin-right': Math.floor(margin / 2) + 'px'});
}

function toggleReflex(hide) {
    if (hide) {
        //	$$('.Fer').each(function(s) { cvi_reflex.remove(s); });
        $('mosaicGridContainer').select('img[class="Fer"]').each(function (s, index) { Event.observe(s, 'click', function () { if (pear.currentView === 'mosaic') { swatchImg(index); } else { focusImage(index); } }); });
    } else {
        //	$$('.Fer').each(function(s) { cvi_reflex.add(s, {height: 20, distance: 0 }); });
        $('mosaicGridContainer').select('canvas[class="Fer"]').each(function (s, index) { Event.observe(s, 'click', function () { if (pear.currentView === 'mosaic') { swatchImg(index); } else { focusImage(index); } }); });
    }
}

function scaleIt(v, sliding) {
    // Remap the 0-1 scale to fit the desired range
    //v=.26+(v*(1.0-.26));
    var size = (pear.currentView === 'mosaic') ? v / 2 : v;

    toggleReflex(true);
    $(".p-photo").each(function (i) {
        $(this).attr({height: size + 'px', width: size + 'px'});
        $(this).css({height: size + 'px', width: size + 'px'});
    });
    $(".g-photo").css({width: size + 'px'});
    if (!pear.currentView === 'mosaic' && !sliding) {
        toggleReflex(false);
    }
    thumbPadding();
    $('#gridContainer').trigger('scroll');
}

function thumbLoad(index) {
    //Load non skimming thumbs
    $('.g-thumbnail').each( function() { $(this).attr('src', thumbImages[$(this).attr('id')]); });
    //Load skimming thumbs
    $('.skimm_div').each( function() { $(this).append(thumbImages[$(this).attr('id')]); });

    //Re-initiate all fancyness.
    if (pear.currentView === 'mosaic') { $('p.giTitle,div.giInfo').hide(); } else { $('p.giTitle,div.giInfo').show(); }
    scaleIt($('#imgSlider').slider('value'));
    $('.g-item:not(.g-hover-item)').each(function (index) { $(this).unbind('click'); if ($(this).is('.g-photo')) { $(this).click(function () { if (pear.currentView === 'mosaic') { swatchImg(index); } else { focusImage(index); } }); }});
    // Apply jQuery UI icon and hover styles to context menus
    if ($(".g-context-menu").length) {
        $(".g-context-menu li").addClass("ui-state-default");
        $(".g-context-menu a").addClass("g-button ui-icon-left");
        $(".g-context-menu a:not(:has(span.ui-icon))").prepend("<span class=\"ui-icon\"></span>");
        $(".g-context-menu a span").each(function() {
                /*jslint regexp: false*/
                var iconClass = $(this).parent().attr("class").match(/ui-icon-.[^\s]+/).toString();
                /*jslint regexp: true*/
                $(this).addClass(iconClass);
                });
        $("ul.g-context-menu > li a span").addClass("ui-icon-carat-1-s");
    }
    // Initialize thumbnail hover effect
    $(".g-item").hover(
            function() {
            $(this).addClass("hovering");
            if(pear.currentView === 'mosaic') { return; }
            // Insert a placeholder to hold the item's position in the grid
            var placeHolder = $(this).clone().attr("id", "g-place-holder");
            $(this).after($(placeHolder));
            // Style and position the hover item
            $(this).addClass("g-hover-item");
            // Initialize the contextual menu
            $(this).gallery_context_menu();
            // Set the hover item's height
            $(this).height("auto");
            },
            function() {
            var sib_height;
            $(this).removeClass("hovering");
            if (pear.currentView === 'mosaic') { return; }
            // Remove the placeholder and hover class from the item
            $(this).removeClass("g-hover-item");
            $("#g-place-holder").remove();
            }
            );
    // Initialize button hover effect
    $.fn.gallery_hover_init();
    thumbPadding();

    if(pear.viewMode != 'carousel') {
        pear.pearCarousel = null;
        $("#pearImageFlow").empty();
    }
    //Pre fetch images
    //if ( typeof prefetch === 'undefined') { prefetch = 0; }
    //for ( ; prefetch < slideshowImages.length; prefetch=prefetch+1 ) { $('<img />').attr('src', slideshowImages[prefetch][0]); }
}

function loadMore() {
    if ( navigation.next !== '') {
        var url = navigation.next;
        navigation.next = '';
        $.get(url,{ ajax: '1'},function (data) {
            $('#gridContainer').append(data);
            thumbLoad();
        });
        return true;
    }
    else { return false; }
}

function setCookie(c_name, value, expiredays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie = c_name + "=" + escape(value) + ((expiredays === null) ? "" : ";expires=" + exdate.toGMTString());
}

function getCookie(c_name) {
    if (document.cookie.length > 0) {
        var c_start, c_end;
        c_start = document.cookie.indexOf(c_name + "=");
        if (c_start !== -1) {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end === -1) {
                c_end = document.cookie.length;
            }
            return unescape(document.cookie.substring(c_start, c_end));
        }
    }
    return "";
}

function mosaicResize() {
    if ($('#gridContainer').length === 0) {
        return; //no element found
    }
    var myWidth = 0, myHeight = 0;
    var iRatio = 0, iWidth = 0, iHeight = 0;
    var siteTop;
    if (typeof slideshowImages[pear.currentImg] !== 'undefined') {
        iWidth = parseFloat(slideshowImages[pear.currentImg][2].replace(/,/gi, "."));
        iHeight = parseFloat(slideshowImages[pear.currentImg][3].replace(/,/gi, "."));
        iRatio = iWidth / iHeight;
        if (isNaN(iRatio)) { iRatio = 1.3333; }
    }
    if (typeof (window.innerWidth) === 'number') {
        //Non-IE
        myWidth = window.innerWidth;
        myHeight = window.innerHeight;
    } else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
        //IE 6+ in 'standards compliant mode'
        myWidth = document.documentElement.clientWidth;
        myHeight = document.documentElement.clientHeight;
    } else if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
        //IE 4 compatible
        myWidth = document.body.clientWidth;
        myHeight = document.body.clientHeight;
    }
    if ($('#imageflow').length !== 0) {
        $('#imageflow').css({'height': (myHeight - 53) + 'px', 'width': (((myWidth * 0.5) < (myHeight - 53)) ? myWidth : ((myHeight - 65) * 2)) + 'px'});
    }
    if (iRatio > (myWidth / (myHeight - 165))) {
        $('#img_detail').css({'height': myWidth / iRatio + "px", 'width': myWidth + "px"});
    } else {
        $('#img_detail').css({'height': myHeight - 165 + "px", 'width': (myHeight - 165) * iRatio + "px"});
    }
    if (iHeight < (myHeight - 165) && iWidth < myWidth) {
        $('#img_detail').css({'height': iHeight + "px", 'width': iWidth + "px"});
    }
    myWidth = myWidth - 7;
    myHeight = myHeight - $('#g-site-status').outerHeight(true) - $('#paginator').outerHeight(true);
    myHeight -= 138;
    $('#g-header').css('top', $('#gsNavBar').outerHeight(true) + $('#g-site-status').outerHeight(true) - 4);

    if ($('#g-movie').length) {
        myHeight += 18;
    }
    /*Sidebar*/
    if ($('#sidebarContainer').is(':visible')) { myWidth = myWidth - $('#sidebarContainer').width(); }
    if (pear.currentView === 'mosaic') {
        //Resize the image..
        myWidth = $('#mosaicDetail').width()-20;
        if (iRatio > (myWidth / myHeight)) {
            $('#mosaicImg').attr({height: myWidth / iRatio, width: myWidth});
        } else {
            $('#mosaicImg').attr({height: myHeight, width: myHeight * iRatio});
        }
        if (iHeight < myHeight && iWidth < myWidth) {
            $('#mosaicImg').attr({height: iHeight, width: iWidth});
        }
    }
    /* Fix for firefox that don't support dimensions on empty img tags */
    $('#mosaicImg').css('display', 'inline-block');
    /* Vertical center of image in mosaicView */
    siteTop = $('#mosaicTable').height() / 2 - ($("#imageTitle").attr("savedH") + $("#mosaicImg").height()) / 2;
    siteTop = siteTop < 0 ? 0 : siteTop;
    $('#mosaicDetailContainer').css('top', siteTop);

    /* Vertical center of content in carousel */
    siteTop = $('#mosaicTable').height() / 2 - $('#pearImageFlow').height() / 2;
    siteTop = siteTop < 0 ? 0 : siteTop;
    $('#pearImageFlow').css('top', siteTop);

    thumbPadding();

    if ($('#conf_imageflow').length) {
        refresh();
    }
}

$(window).resize(function () {
    if (window.innerHeight === savedHeight && window.innerWidth === savedWidth) { return; }
    savedHeight = window.innerHeight;
    savedWidth = window.innerWidth;
    mosaicResize();
});

function updateHash() {
    window.location.hash = getAlbumHash(pear.currentImg);
}

function swatchSkin(intSkin) {
    if ( pear.currentBg !== pear.defaultBg ) { setCookie('swatchSkin', intSkin, 1); }
    $('#black,#dkgrey,#ltgrey,#white').removeClass().addClass("swatch");
    switch (intSkin) {
        //black
    case 'black':
    case 0:
        $('div.gallery-thumb-round').css('backgroundPosition', "0px 0px");
        $('body,html,#pearFlow').css('backgroundColor', "#000");
        $('p.giTitle').css("color", "#a3a3a3");
        $("#black").addClass("black sel black-with-sel-with-swatch");
        pear.currentBg = "black";
        break;
        // dkgrey
    case 'dkgrey':
    case 1:
        $('div.gallery-thumb-round').css('backgroundPosition', "-200px 0px");
        $('body,html,#pearFlow').css('backgroundColor', "#262626");
        $('p.giTitle').css("color", "#a9a9a9");
        $("#dkgrey").addClass("dkgrey sel dkgrey-with-sel-with-swatch");
        pear.currentBg = "dkgrey";
        break;
        // ltgrey
    case 'ltgrey':
    case 2:
        $('div.gallery-thumb-round').css('backgroundPosition', "-400px 0px");
        $('body,html,#pearFlow').css('backgroundColor', "#d9d9d9");
        $('p.giTitle').css("color", "#333333");
        $("#ltgrey").addClass("ltgrey sel ltgrey-with-sel-with-swatch");
        pear.currentBg = "ltgrey";
        break;
        // white
    case 'white':
    case 3:
        $('div.gallery-thumb-round').css('backgroundPosition', "-600px 0px");
        $('html,body,#pearFlow').css('backgroundColor', "#ffffff");
        $('p.giTitle').css("color", "#444444");
        $("#white").addClass("white sel white-with-sel-with-swatch");
        pear.currentBg = "white";
        break;
    default:
        // Black is default
        if ( typeof pear.defaultBg === "undefined" ) { pear.defaultBg = "black"; }
        swatchSkin(pear.defaultBg);
    }
    updateHash();
}

//Set a updating timer so users can't update before the image has appeard..
function swatchImg(imageId) {
    if (imageId < 0 || imageId >= slideshowImages.length) {
        if ( navigation.next !== '') {
            $.get(navigation.next,{ ajax: '1'},function (data) {
                    $('#gridContainer').append(data);
                    thumbLoad();
                    swatchImg(imageId);
                    });
        }
        return;
    }

    if ( typeof slideshowImages[imageId] === 'undefined' ) {
        imageId += 1;
        if ( imageId >= slideshowImages.length ) { swatchImg(0); } else { swatchImg(imageId); }
        return;
    }

    pear.currentImg = imageId;

    if (pear.currentView === 'mosaic') {
        $('#imageTitle').each(function (i) {$(this).html("<h2></h2>"); $(this).attr("savedH", $(this).height()); });
        if ( pear.mosaicEffect === "" ) {
            $('#mosaicDetail').hide(0, function () {
                $('#imageTitle').html("<h2>" + slideshowImages[imageId][4] + "</h2>");
                $('#mosaicImg').attr('src',  slideshowImages[imageId][0]);
                $('#mosaicImg').css('cursor', "pointer");
                mosaicResize();
                $('#mosaicDetail').show();
            });
        }
        else {
            var options = {};
            if ( pear.mosaicEffect === "scale" ) { options = { percent: 0 }; }
            $('#mosaicDetail').hide(pear.mosaicEffect, options, "fast", function () {
                $('#imageTitle').html("<h2>" + slideshowImages[imageId][4] + "</h2>");
                $('#mosaicImg').attr('src',  slideshowImages[imageId][0]);
                $('#mosaicImg').css('cursor', "pointer");
                mosaicResize();
                $('#mosaicDetail').show(pear.mosaicEffect, options, "slow");
            });
        }
    }

    /* Set controls for hover view. */
    if (pear.currentImg === 0) {
        $('#prev').addClass('disabled');
    } else {
        $('#prev').removeClass('disabled');
    }
    if (pear.currentImg === slideshowImages.length - 1) {
        $('#next').addClass('disabled');
    } else {
        $('#next').removeClass('disabled');
    }
    $('#img_detail').hide();
    /* Update image and title in focus view */
    $('#img_detail').attr('src', slideshowImages[pear.currentImg][0]);
    $('.info_detail').attr('href', slideshowImages[pear.currentImg][1][0] + "pear/about/" + slideshowImages[pear.currentImg][1][1]);
    $('.comments_detail').attr('href', slideshowImages[pear.currentImg][1][0] + "pear/show_comments/" + slideshowImages[pear.currentImg][1][1]);
    $('#imageTitleLabel').html("<h2>" + slideshowImages[pear.currentImg][4] + "</h2>");
    if ( slideshowImages[pear.currentImg][5] === '' ) {
        $('#download, #detail_download').hide();
    } else {
        $('#download, #detail_download').show();
    }
    updateHash();
    mosaicResize();
    $('#img_detail').fadeIn();
}

function hideHoverView() {
    if (!pear.hovering) { $('#hoverView').fadeOut(); }
    pear.hideHoverViewHandler = null;
}

function showHoverView() {
    if (pear.hideHoverViewHandler !== null) { clearTimeout(pear.hideHoverViewHandler); }
    $('#hoverView').show();
    pear.hideHoverViewHandler = setTimeout(hideHoverView, 3000);
}

function focusImage(id, redirected) {
    if (id < 0 || id >= slideshowImages.length) {
        if ( navigation.next !== '') {
            $.get(navigation.next,{ ajax: '1'},function (data) {
                    $('#mosaicGridContainer').append(data);
                    thumbLoad();
                    focusImage(id);
                    });
        }
        return;
    }
    pear.currentImg = id;
    pear.detailView = true;
    swatchImg(id);
    $('#play_detail').hide();
    $('#pause_detail').hide();
    $('#detailView').fadeIn('slow');
    showHoverView();
    //Image count.
    //if (!redirected) { $.get(slideshowImages[pear.currentImg][6]); }
}

function checkCookie() {
    var co = getCookie('slider');
    if (co !== null && co !== "") {
        $('#imgSlider').slider("value", co);
    }
    co = getCookie('swatchSkin');
    if (co !== null && co !== "") {
        swatchSkin(co);
    } else {
        swatchSkin(pear.defaultBg);
    }
}

function getAlbumHash(img) {
    var hash = "#";
    if (img !== 0) {
        hash += "img=" + img;
    }
    if ( pear.defaultView !== pear.currentView ) {
        hash += "&viewMode=" + pear.currentView;
    }
    if ( pear.detailView ) {
        hash += "&detailView";
    }
    if ( pear.defaultBg !== pear.currentBg ) {
        hash += "&bgcolor=" + pear.currentBg;
    }
    return hash;
}

function slideShowUpdate() {
    pear.slideShowId = pear.slideShowId + 1;
    if (pear.slideShowId > slideshowImages.length) {
        slideShowId = 0;
    }
    swatchImg(pear.slideShowId);
    pear.slideShowHandler = setTimeout(slideShowUpdate, pear.slideshowTimeout);
}

function togglePlayPause() {
    //We are paused
    if (pear.slideShowHandler === null) {
        $('#play_detail').hide();
        $('#pause_detail').show();
        pear.slideShowHandler = setTimeout(slideShowUpdate, pear.slideshowTimeout);
    } else { //We are playing
        $('#pause_detail').hide();
        $('#play_detail').show();
        clearTimeout(pear.slideShowHandler);
        pear.slideShowHandler = null;
    }
}

function startSlideshow() {
    slideShowMode = true;
    $('#play_detail').hide();
    $('#pause_detail').show();
    $('#detailView').fadeIn('slow');
    showHoverView();
    pear.slideShowId = pear.currentImg;
    swatchImg(pear.slideShowId);
    togglePlayPause();
}

function switchMode(mode) {
    $('#mosaic,#grid,#carousel').removeClass("sel sel-with-viewSwitcher");
    $('#' + mode).addClass("sel sel-with-viewSwitcher");
    updateHash();
}

function switchToGrid() {
    pear.currentView = "grid";
    toggleReflex(true);
    $('#pearFlow').hide();
    if (!$('#gridContainer').length) { return; }
    scaleIt($('#imgSlider').slider('value'));
    checkCookie();
    $('#mosaicDetail').hide();
    $('#gridContainer').css('width', "100%");
    $('p.giTitle,div.giInfo').each(function (s) { $(this).show(); });
    switchMode('grid');
    mosaicResize();
}

function switchToMosaic() {
    pear.currentView = "mosaic";
    toggleReflex(false);
    $('#pearFlow').hide();
    if (!$('#gridContainer').length) { return; }
    scaleIt($('#imgSlider').slider('value'));
    checkCookie();
    $('#mosaicDetail').show();
    $('#gridContainer').css('width', "35%");
    $('p.giTitle,div.giInfo').each(function (s) { $(this).hide(); });
    switchMode('mosaic');
    swatchImg(pear.currentImg);
    mosaicResize();
    $(".controller").css("display","inline-block");
}

function startImageFlow() {
    var i, img;
    pear.currentView = 'carousel';
    $('#pearFlow').show();

    if (!pear.pearCarousel) {
        for (i = 0; i < slideshowImages.length; i++) {
            //var img = '<div class="item"><img class="content" src="' + slideshowImages[i][0] + '"/><div class="caption">' + $('#mosaicGridContainer img').eq(i).attr('alt') + '"</div></div>';
        if ( typeof slideshowImages[i] === 'undefined' ) { continue; }
            img = '<img src="' + slideshowImages[i][0] + '" longdesc="' + i + '" width="' + slideshowImages[i][2] + '" height="' + slideshowImages[i][3] + '" alt="' + slideshowImages[i][4] + '" style="display: none;">';
            //		console.log(img);
            $('#pearImageFlow').append(img);
        }
        pear.pearCarousel = new ImageFlow();
        pear.pearCarousel.init({ImageFlowID: 'pearImageFlow', aspectRatio: 2.4, imagesHeight: 0.6, opacity: true, reflections: false, startID: pear.currentImg + 1, onClick: function () { focusImage($(this).attr('longdesc')); }, startAnimation: true, xStep: 200, imageFocusM: 1.7, imageFocusMax: 4, opacityArray: [10, 9, 6, 2], percentOther: 130, captions: false, slider: false});
    }
    switchMode('carousel');
    mosaicResize();
}

function hideDetailView() {
    $('#detailView').hide();
    pear.slideShowMode = pear.detailView = false;
    if (pear.slideShowHandler !== null) { clearTimeout(pear.slideShowHandler); }
    pear.slideShowHandler = null;
    updateHash();
}

function setKeys() {
/* Fixes the back button issue */
/*	window.onunload = function()
{
document = null;
}
*/
    $(document).keydown(function (e) {
        var charCode = e.keyCode || e.which;
        if ($( document.activeElement ).is("input:text,input:password,textarea")) { return; }
        switch (charCode) {
        case 32: /* Space */
            if (pear.slideShowMode) { togglePlayPause(); }
            break;
        case 39: /* Right arrow key */
        case 78: /* N */
            swatchImg(pear.currentImg + 1);
            //	if($('imageflow')) handle(-1);
            break;
        case 80: /* P */
        case 37: /* Left arrow key */
            swatchImg(pear.currentImg - 1);
            //	if($('imageflow')) handle(1);
            break;
        case 27: /* Esc-key */
            hideDetailView();
            break;
        }
    });
}

function pearInit(options) {
    pear = $.extend({}, pear, options, { currentView: '', currentImg: 0, slideShowId: 0, slideShowHandler: null, hideHoverViewHandler: null });
    pear.currentView = pear.defaultView;
    var h, co;

    co = getCookie('swatchSkin');
    if (co === null || co === "") { pear.currentBg = co; }

    /* Parse hash */
    h = $.parseQuery(window.location.hash.substring(1));
    if (h.img !== undefined) {
        pear.currentImg = parseInt(h.img, 10);
    }
    if (h.bgcolor !== undefined) {
        pear.currentBg = h.bgcolor;
    }
    if (h.viewMode !== undefined) {
        if (h.viewMode === 'detail') { 
            pear.currentView = pear.defaultView; 
            focusImage(pear.currentImg, h.redirected);
        }
        pear.currentView = h.viewMode;
    }
    /* end parse hash */

    swatchSkin(pear.currentBg);

    if (navigator.appVersion.search(/MSIE [0-7]/i) !== -1) {
        $('.track').each(function (s) {$(this).css('top', '-16px'); }); //Fix for IE's poor page rendering. 
    }
    /* 58.5 225 32.5 125 */
    $('#imgSlider').slider({ min: 75, max: 250, step: 2, value: 125,
        slide: function (event, ui) { scaleIt(ui.value); },
        change: function (event, ui) { scaleIt(ui.value); setCookie('slider', ui.value, '1'); } });

    //Set event for Thumb Click.
    $('.g-item').each(function (index) { $(this).click(function () { if (pear.currentView === 'mosaic') { swatchImg(index); } else { focusImage(index); } }); });
    $('#mosaicDetailContainer').click(function () { focusImage(pear.currentImg); });
    $('#prev').click(function () { swatchImg(pear.currentImg - 1); });
    $('#next').click(function () { swatchImg(pear.currentImg + 1); });
    $('#img_detail').click(function () { hideDetailView(); });

    if (typeof slideshowImages !== 'undefined' && !slideshowImages.length) {
        pear.currentView = pear.defaultView = 'grid';
    }

    setKeys();
    thumbLoad();
    $('#gridContainer').endlessScroll({ fireOnce: true, fireDelay: 500, callback: function(p) { loadMore(); } });
    $('#gridContainer').trigger('scroll');

    $('#mosaicDetailContainer').hover(function () {
        $(this).addClass("g-photo hovering");
        $(this).prepend($('.g-item:not(.g-hover-item)>ul').slice(pear.currentImg, pear.currentImg+1).clone().attr("id", "imgMenu").removeAttr("context_menu_initialized"));
        $(this).gallery_context_menu();
        $.fn.gallery_hover_init();},
        function () {
            $(this).removeClass("g-photo hovering"); 
            $('#imgMenu').remove();});

    $('#loading').hide();

    if (slideshowImages.length !== 0) {
        $(".viewSwitcher").hover( function() { $(this).addClass("hover-with-viewSwitcher"); }, function() { $(this).removeClass("hover-with-viewSwitcher"); });
        $("#grid").click(function () { switchToGrid(true); });
        $("#mosaic").click(function () { switchToMosaic(true); });
        $("#carousel").click(function () { startImageFlow(true); });
        $('#slideshow').click(function () { startSlideshow(); });
    } else {
        $("#grid, #mosaic, #carousel, #slideshow").addClass("disabled");
    }
    /* Go to detailView */
    if (h.detailView !== undefined) {
        focusImage(pear.currentImg);
    }

    switch (pear.currentView) {
    case 'carousel':
        startImageFlow();
        break;
    case 'grid':
        switchToGrid();
        break;
    case 'mosaic':
        switchToMosaic();
        break;
    default:
        mosaicResize();
        checkCookie();
    }

}

function sidebarInit(mode) {
    switch (mode) {
        case 'toggle':
            $('#sidebarContainer').width(5);
            $('#mosaicTable').css('right', '5px');
            $('#sidebarContainer').hover(function () {
                    $('#sidebarContainer').stop(true,true).animate( { width: '225' }, 500);
                    //$('#sidebar').show('slide', { direction: 'right'}, 1000);
                    $('#mosaicTable').stop(true,true).animate( { right: '225'}, 500, function () { mosaicResize(); }); },
                function () {
                    $('#sidebarContainer').stop(true,true).animate( { width: '5' }, 500);
                    //$('#sidebar').hide('slide', { direction: 'right'}, 1000);
                    $('#mosaicTable').stop(true.true).animate( { right: '5' }, 500, function () { mosaicResize(); });
                });
            break;
        case 'static':
            $('#sidebarContainer').width(225);
            $('#mosaicTable').css('right', '225px');
            break;
        //case 'hidden':
        default:
            $('#sidebarContainer').hide();
            break;
    }
}

(function($){
$.gallery_replace_image = function(data, img_selector) {
    $(img_selector).attr({src: data.src});
    // Update geometrics in slideshowImages[INDEX].
    // Reload the focused image.
    $(img_selector).trigger("gallery.change");
  };
})(jQuery);
