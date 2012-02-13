<?php defined("SYSPATH") or die("No direct script access.") ?>
<? /* Placeholder for infromation in mosaic view. */ ?>
<script type="text/javascript">
var slideshowImages = new Array();
var thumbImages = new Array();
$(function() {
  sidebarInit('<?=module::get_var("th_pear4gallery3", "sidebar_view")?>');
  pearInit( {
    defaultView: "<?=module::get_var("th_pear4gallery3", "mainmenu_view")?>",
    defaultBg: "<?=module::get_var("th_pear4gallery3", "background", "black")?>",
    mosaicEffect: "<? $mosaic_effect = module::get_var("th_pear4gallery3", "mosaic_effect", "blind"); if ($mosaic_effect == "none") print ""; else print $mosaic_effect; ?>",
    slideshowTimeout: <?=module::get_var("th_pear4gallery3", "slideshow_time", "5000")?> });
});
</script>
<div id="mosaicTable">
  <div id="mosaicDetail">
    <div id="mosaicHover" class="hoverViewTopMenu">
        <div id="detail_download" title="Download this photo" class="controller half" onclick="window.open(slideshowImages[pear.currentImg][5])"> </div>
        <div id="detail_info" title="Show more information about this photo" class="controller half info_detail g-dialog-link"> </div>
        <div id="detail_comment" title="Comments" class="detail controller half disable" onclick=""></div>
    </div>
    <div id="mosaicDetailContainer">
      <img id="mosaicImg" src="" alt="Main image"/>
        <div class="gsContentDetail" style="width: 100%;">
            <div class="gbBlock gcBorder1" id="imageTitle"> </div>
        </div>
    </div>
  </div>
  <div id="gridContainer" class="gallery-album">
    <?= new View("thumbs.html") ?>
  </div>
  <div id="pearFlow"><div id="pearImageFlow" class="imageflow"></div></div>
</div>
<? if (module::get_var("th_pear4gallery3", "sidebar_view") != ''): ?>
  <div id="sidebarContainer">
    <div id="sidebarBorder"></div>
    <div id="sidebar">
    <? if ($theme->page_subtype != "login"): ?>
      <?= new View("sidebar.html") ?>
    <? endif ?>
    </div>
  </div>
<? endif ?>
<?= $theme->album_bottom() ?>

