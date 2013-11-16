<?php defined("SYSPATH") or die("No direct script access.") ?>
<? /* Placeholder for infromation in mosaic view. */ ?>
<script type="text/javascript">
var slideshowImages = new Array();
var thumbImages = new Array();
<?
$defaultView = module::get_var("th_pear4gallery3", "mainmenu_view", "grid");
try {
  $result = ORM::factory("pear_album_view")->where("album_id", "=", $item->id)->find();
  if($result->loaded()) {
    $defaultView = $result->view_mode;
  }
} catch (Exception $e) {
  unset($e);
}
?>
$(window).load(function () {
  pearInit( {
    sitePath: "<?= url::site("/") ?>",
    defaultView: "<?=$defaultView?>",
    defaultBg: "<?=module::get_var("th_pear4gallery3", "background", "black")?>",
    mosaicEffect: "<? $mosaic_effect = module::get_var("th_pear4gallery3", "mosaic_effect", "blind"); if ($mosaic_effect == "none") print ""; else print $mosaic_effect; ?>",
    slideshowTimeout: <?=module::get_var("th_pear4gallery3", "slideshow_time", "5000")?> });
  sidebarInit('<?=module::get_var("th_pear4gallery3", "sidebar_view")?>');
});
</script>
<div id="loading"></div>
<div id="mosaicTable">
  <div id="mosaicDetail">
    <div id="mosaicHover" class="hoverViewTopMenu">
        <div id="detail_download" title="<?= t('Download this photo')->for_html_attr() ?>" class="controller half" onclick="window.open(pear.sitePath + 'pear/download/' + slideshowImages[pear.currentImg][1])"> </div>
        <div id="detail_info" title="<?= t('Show more information about this photo')->for_html_attr() ?>" class="controller half info_detail g-dialog-link"> </div>
        <? if(module::is_active("comment")): ?>
        <div id="detail_comment" title="<?= t('Comments')->for_html_attr() ?>" class="detail controller half comments_detail g-dialog-link"></div>
        <? endif ?>
    </div>
    <div id="mosaicDetailContainer">
      <img id="mosaicImg" src="" alt="<?= t('Main image')->for_html_attr() ?>"/>
        <div class="gsContentDetail" style="width: 100%;">
            <div class="gbBlock gcBorder1" id="imageTitle"> </div>
        </div>
    </div>
  <? if(module::is_active("facebook_like")): ?>
<div id="fb-root"></div>
<script>(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_US/all.js#xfbml=1&appId=<?=module::get_var("facebook_like", "appId");?>";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));</script>
    <div id="fbLike-detail" style="top: 15px; position: absolute; left: 15px;" data-layout="<?= module::get_var("facebook_like", "layout", "standard")?>" data-send="<?= module::get_var("facebook_like", "send", "false")?>" data-faces="<?= module::get_var("facebook_like", "show_faces", "false")?>"></div>
  <? endif ?>
  </div>
  <div id="gridContainer" class="gallery-album">
    <?= new View("thumbs.html") ?>
  </div>
  <div id="pearFlow"><div id="pearImageFlow" class="imageflow"></div></div>
</div>
<? if (module::get_var("th_pear4gallery3", "sidebar_view") != ''): ?>
  <div id="sidebarContainer">
    <span id="toggleSidebar" class="ui-icon ui-icon-plusthick ui-state-default ui-helper-clearfix ui-widget ui-corner-all" title="<?= t('Toggle Sidebar')->for_html_attr() ?>"></span>
    <div id="sidebar">
    <? if ($theme->page_subtype != "login"): ?>
      <?= new View("sidebar.html") ?>
    <? endif ?>
    </div>
  </div>
<? endif ?>
<? if(($theme->item())): ?>
<?= $theme->album_bottom() ?>
<? endif ?>

