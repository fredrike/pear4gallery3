<?php defined("SYSPATH") or die("No direct script access.") ?>
<?
if (isset($_GET['ajax'])) {
  if ($theme->page_subtype == "search") {
    $v = new View("thumbs.html");
    $v->children = $content->items;
    print $v;
    die(0);
  }
  echo new View("thumbs.html");
  die(0);
}
?>
<? if ($theme->page_subtype == "photo"):
  foreach (end($parents)->viewable()->children() as $i => $child)
    if(!($child->is_album() || $child->is_movie()))
      if(strpos($_SERVER['REQUEST_URI'], $child->url()) !== false) {
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
          "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" <?= $theme->html_attributes() ?> xml:lang="en" lang="en">
  <head>
    <title><?= t('Photo page') ?></title>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8" />
    <meta http-equiv="refresh" content="1;url=<?=end($parents)->url()?>#img=<?=$i?>&amp;detailView&amp;redirected=true" />
    <?= $theme->head() ?>
  </head>
  <body>Page moved <a href="<?=end($parents)->url()?>#img=<?=$i?>&amp;detailView&amp;redirected=true">here</a>.</body>
</html>
<?
        die(0);
      }?>
<? endif ?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
          "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" <?= $theme->html_attributes() ?> xml:lang="en" lang="en">
  <head>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=Edge" />
    <? $theme->start_combining("script,css") ?>
    <title>
      <? if ($page_title): ?>
        <?= $page_title ?>
      <? else: ?>
        <? if ($theme->item()): ?>
          <?=  html::purify($theme->item()->title) ?>
        <? elseif ($theme->tag()): ?>
          <?= t("Photos tagged with %tag_title", array("tag_title" => $theme->tag()->name)) ?>
        <? else: /* Not an item, not a tag, no page_title specified.  Help! */ ?>
          <?= html::purify(item::root()->title) ?>
        <? endif ?>
      <? endif ?>
    </title>
    <link rel="shortcut icon"
          href="<?= url::file(module::get_var("gallery", "favicon_url")) ?>"
          type="image/x-icon" />

    <? if ($theme->page_type == "collection"): ?>
      <? if ($thumb_proportion != 1): ?>
        <? $new_width = round($thumb_proportion * 213) ?>
        <? $new_height = round($thumb_proportion * 240) ?>
        <style type="text/css">
        .g-view #g-content #g-album-grid .g-item {
          width: <?= $new_width ?>px;
          height: <?= $new_height ?>px;
          /* <?= $thumb_proportion ?> */
        }
        </style>
      <? endif ?>
    <? endif ?>

    <?= $theme->script("json2-min.js") ?>
    <?= $theme->script("jquery-1.7.1.min.js") ?>
    <?= $theme->script("jquery.form.js") ?>
    <?= $theme->script("jquery-ui-1.8.17.custom.min.js") ?>
    <?= $theme->script("gallery.common.js") ?>
    <? /* MSG_CANCEL is required by gallery.dialog.js */ ?>
    <script type="text/javascript">
    var MSG_CANCEL = <?= t('Cancel')->for_js() ?>;
    </script>
    <?= $theme->script("gallery.ajax.js") ?>
    <?= $theme->script("gallery.dialog.js") ?>
    <?= $theme->script("superfish/js/superfish.js") ?>
    <?= $theme->script("jquery.localscroll.js") ?>

    <? /* These are page specific but they get combined */ ?>
    <? if ($theme->page_subtype == "photo"): ?>
    <?= $theme->script("jquery.scrollTo.js") ?>
    <?= $theme->script("gallery.show_full_size.js") ?>
    <? elseif ($theme->page_subtype == "movie"): ?>
    <?= $theme->script("flowplayer.js") ?>
    <? endif ?>

    <?= $theme->head() ?>

    <? /* Theme specific CSS/JS goes last so that it can override module CSS/JS */ ?>
    <?= $theme->script("ui.init.js") ?>
    <?= $theme->script("jquery.parsequery.js") ?>
    <?= $theme->script("imageflow.packed.js") ?>
    <?= $theme->script("jquery.mousewheel.js") ?>
    <?= $theme->script("jquery.jscrollpane.min.js") ?>
    <?= $theme->css("yui/reset-fonts-grids.css") ?>
    <?= $theme->css("superfish/css/superfish.css") ?>
    <?= $theme->css("ui-pear-theme/jquery-ui-1.8.17.custom.css") ?>
    <?= $theme->css("screen.css") ?>
    <?= $theme->css("imageflow.packed.css") ?>
    <?= $theme->css("pear.css") ?>
    <?= $theme->css("jquery.jscrollpane.css") ?>

    <!-- LOOKING FOR YOUR JAVASCRIPT? It's all been combined into the link below -->
    <?= $theme->get_combined("script") ?>

    <!-- LOOKING FOR YOUR CSS? It's all been combined into the link below -->
    <?= $theme->get_combined("css") ?>
    <!--[if lte IE 8]>
    <link rel="stylesheet" type="text/css" href="<?= $theme->url("css/fix-ie.css") ?>"/>
    <![endif]-->

		<script type="text/javascript" src="<?= $theme->url("js/pear.js"); ?>"></script>
		<!-- Google analytics code -->
		<script type="text/javascript">
			var _gaq = _gaq || [];
			_gaq.push(['_setAccount', '<? $account = module::get_var("th_pear4gallery3", "ga_code"); if ((!isset($account)) or ($account == "")) print "UA-23621420-1"; else print $account;?>']);
			_gaq.push(['_setDomainName', 'none']);
			_gaq.push(['_setAllowLinker', true]);
			_gaq.push(['_trackPageview']);
			(function() {
			 var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
			 ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
			 var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
			 })();
		</script>
	</head>

  <body <?= $theme->body_attributes() ?>>
     <?= new View("hoverView.html") ?>
		 <?= $theme->page_top() ?>
      <?= $theme->site_status() ?>
<? if (($theme->page_subtype == "login") or ($theme->page_subtype == "reauthenticate")): ?>
	<?= $content ?>
<? else: /*not login | reauthenticate */ ?>

<div id="gsNavBar" class="gcBorder1">
    <div class="lNavBar">
    <? if(!empty($parents)): ?>
      <? foreach ($parents as $parent): ?>
      <? if (!module::get_var("th_pear4gallery3", "show_breadcrumbs")) $parent = end($parents); ?>
        <button class="ui-button ui-button-text-only ui-widget ui-state-default ui-corner-all" onclick="window.location='<?= $parent->url() ?>' + getAlbumHash(0);"> <span class="ui-button-text"><?= html::purify(text::limit_chars($parent->title, module::get_var("gallery", "visible_title_length"))) ?></span> </button>
      <? if (!module::get_var("th_pear4gallery3", "show_breadcrumbs")) break; ?>
      <? endforeach ?>
    <? elseif (!($theme->item() && $theme->item()->id == item::root()->id)): ?>
        <button class="ui-button ui-button-text-only ui-widget ui-state-default ui-corner-all" onclick="window.location='<?= item::root()->url() ?>' + getAlbumHash(0);"> <span class="ui-button-text"><?= html::purify(text::limit_chars(item::root()->title, module::get_var("gallery", "visible_title_length"))) ?></span> </button>
    <? endif ?>
    </div>
<? if ($theme->item()): ?>
    <div class="pearTitle" title="<?= $theme->item()->description ?>"> <?= html::purify(text::limit_chars($theme->item()->title, 40)) ?> &nbsp;
      <? if (!module::get_var("th_pear4gallery3", "hide_item_count")): ?>
        <span class="count">(<?= count($theme->item()->children()) ?>)</span>
      <? endif ?>
    </div>
<? else: ?>
    <div class="pearTitle">
      <? if ($page_title): ?>
          <?= html::purify(text::limit_chars($page_title, 40)) ?> &nbsp;
      <? else: ?>
        <? if ($theme->tag()): ?>
          <?= t("Photos tagged with %tag_title", array("tag_title" => $theme->tag()->name)) ?>
        <? else: /* Not an item, not a tag, no page_title specified.  Help! */ ?>
          <?= html::purify(text::limit_chars(item::root()->title, 40)) ?> &nbsp;
        <? endif ?>
      <? endif ?>
    </div>
<? endif ?>
    <div class="rNavBar">
        <button class="ui-button ui-button-text-only ui-widget ui-state-default ui-corner-all" onclick="$('#g-header').slideToggle('normal', function(){$('#g-header').is(':hidden') ? $('#sidebarButton').text(<?= strtr(t('Show Options')->for_js(), array('"'=>'&quot;')) ?>) : $('#sidebarButton').text(<?= strtr(t('Hide Options')->for_js(), array('"'=>'&quot;')) ?>)});"> <span class="ui-button-text" id="sidebarButton"><?= t('Show Options') ?></span> </button>
    </div>
</div>
<div id="g-header" class="ui-helper-clearfix" style="display: none;">
	<div id="g-banner">
		<?= $theme->user_menu() ?>
		<?= $theme->header_top() ?>

		<!-- hide the menu until after the page has loaded, to minimize menu flicker -->
		<div id="g-site-menu" style="visibility: hidden">
			<?= $theme->site_menu($theme->item() ? "#g-item-id-{$theme->item()->id}" : "") ?>
		</div>
		<script type="text/javascript"> $(document).ready(function() { $("#g-site-menu").css("visibility", "visible"); }) </script>

		<?= $theme->header_bottom() ?>
	</div>
</div>
<?= $theme->messages() ?>

<?= $content ?>

<div id="footerWrapper">
	<div title="<?= t('Change size of photos')->for_html_attr() ?>" id="sliderView" class="sliderView">
		<div title="<?= t('View at smallest photo size')->for_html_attr() ?>" class="smaller" onclick="$('#imgSlider').slider('value', 0);"></div>
		<div title="<?= t('View at largest photo size')->for_html_attr() ?>" class="larger" onclick="$('#imgSlider').slider('value', 250);"></div>
		<div id="imgSlider" class="track">
		</div>
	</div>

	<div style="" class="" id="colorPicker">
		<div class="label"><?= t('Color:') ?></div>
		<div title="<?= t('View this album with a black background')->for_html_attr() ?>" id="black" class="swatch" onclick="swatchSkin('black');return false;"> </div>
		<div title="<?= t('View this album with a dark gray background')->for_html_attr() ?>" id="dkgrey" class="swatch" onclick="swatchSkin('dkgrey');return false;"> </div>
		<div title="<?= t('View this album with a light gray background')->for_html_attr() ?>" id="ltgrey" class="swatch" onclick="swatchSkin('ltgrey');return false;"> </div>
		<div title="<?= t('View this album with a white background')->for_html_attr() ?>" id="white" class="swatch" onclick="swatchSkin('white');return false;"> </div>
	</div>

	<div class="" style="" id="viewControls">
<? if ($theme->page_subtype != "movie"): ?>
		<div title="<?= t('Display this album in a grid view')->for_html_attr() ?>" id="grid" class="grid viewSwitcher sel sel-with-viewSwitcher viewSwitcher-icon">
		        <span class="vs-icon vs-icon-grid"></span><?= t('Grid') ?>
		</div>
		<div title="<?= t('Display this album in a mosaic view')->for_html_attr() ?>" id="mosaic" class="viewSwitcher mosaic">
			<span class="vs-icon vs-icon-mosaic"></span><?= t('Mosaic') ?>
		</div>
		<div title="<?= t('Display this album in a carousel view')->for_html_attr() ?>" id="carousel" class="carousel viewSwitcher">
			<span class="vs-icon vs-icon-carousel"></span><?= t('Carousel') ?>
		</div>
		<div title="<?= t('Play a slideshow of this album')->for_html_attr() ?>" id="slideshow" class="viewSwitcher slideshow slideshow-with-viewSwitcher">
			<span class="vs-icon vs-icon-slideshow"></span><?= t('Slideshow') ?>
		</div>
        <div class="clear"></div>
<? endif ?>
  </div>
    <? if (!module::get_var("th_pear4gallery3", "hide_logo")): ?>
    <? if (module::get_var("gallery", "logo_path")) {
      $logo_url = url::file(module::get_var("th_pear4gallery3", "logo_path"));
    } else {
      $logo_url = $theme->url("icons/pear_logo_sml.png");
    } ?>
      <button id="logoButton" style="background-image: url('<?= $logo_url ?>') !important"></button>
    <? endif ?>
</div>
<? endif ?>
  </body>
</html>
