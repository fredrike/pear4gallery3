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
<table id="mosaicTable" style="width: 100%; margin: -2px -2px 0px 0px; overflow: hidden">
<tr>
<td  class="left" style="	width: 65%; vertical-align: middle; padding: 0px;">
  <div id="gsImageView" class="gbBlock gcBorder1" style="padding: 0px !important; text-align: center;">
    <div style="padding: 0px; width: 0px; margin-top: 0px; opacity: 0.999999; display: none;" id="mosaicDetail">
      <div id="photo"> <img id="mosaicImg" src="" alt="Main image"/> </div>
        <div class="gsContentDetail" style="width: 100%;">
            <div class="gbBlock gcBorder1" id="imageTitle"> </div>
        </div>
    </div>
  </div>
</td>
<td class="right" style="margin: 0px; padding: 0px; width: 35%; vertical-align: top;">
  <div class="gallery-album" id="mosaicGridContainer" style="display: block;">
    <?= new View("thumbs.html") ?>
  </div>
<? if (module::get_var("th_pear4gallery3", "sidebar_view") != ''): ?>
</td><td>
  <div id="sidebarContainer" style="overflow-y: auto;">
    <div id="sidebarBorder" style="background-color: darkGrey; width: 5px; height: 100%; position: absolute;"></div>
    <div id="sidebar" class="sidebar" style="width: 220px; position: aboslute; padding-left: 5px;">
    <? if ($theme->page_subtype != "login"): ?>
      <?= new View("sidebar.html") ?>
    <? endif ?>
    </div>
  </div>
<? endif ?>
</td></tr></table>
<div id="pearFlowPadd" class="imageflow" style="display: none;"></div>
<div id="pearImageFlow" class="imageflow" style="display: none;"> </div>
<?= $theme->album_bottom() ?>

