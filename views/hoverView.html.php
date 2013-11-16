<?php defined("SYSPATH") or die("No direct script access.") ?>
<div id="detailView" onmousemove="showHoverView();">
	<div class="overlay"> </div>
	<div class="content">
  <? if(module::is_active("facebook_like")): ?>
    <div id="fbLike-detail-dv" style="top: 15px; position: absolute; left: 15px;"></div>
  <? endif ?>
		<div class="imageContainer">
			<div class="titleLabel" id="imageTitleLabel" style="bottom: width: 624px;"></div>
			<div id="detailImageView" class=""> <img style="visibility: visible;" src="" alt="" id="img_detail"/> </div>
		</div>
    <div id="hoverView" onmouseover="pear.hovering=true;" onmouseout="pear.hovering=false;">
    <div id="hoverViewMenu">
      <div id="prev" title="<?= t('(P)revious')->for_html_attr() ?>" class="controller"></div>
      <div id="pause_detail" title="<?= t('Pause')->for_html_attr() ?>" class="controller" onclick="togglePlayPause();"> </div>
      <div id="play_detail" title="<?= t('Play')->for_html_attr() ?>" class="controller" onclick="togglePlayPause();"> </div>
      <div id="next" title="<?= t('(N)ext')->for_html_attr() ?>" class="controller"></div>
    </div></div>
    <div class="hoverViewTopMenu">
        <div id="download" title="<?= t('Download this photo')->for_html_attr() ?>" class="controller half" onclick="window.open(pear.sitePath + 'pear/download/' + slideshowImages[pear.currentImg][1])"> </div>
        <div id="info" title="<?= t('Show more information about this photo')->for_html_attr() ?>" class="controller half info_detail g-dialog-link"> </div>
        <? if(module::is_active("comment")): ?><div id="comment" title="<?= t('Comments')->for_html_attr() ?>" class="controller half comments_detail g-dialog-link" onclick=""></div><?endif ?>
        <div id="close" title="<?= t('Close')->for_html_attr() ?>" class="controller half" onclick="hideDetailView();"></div>
    </div>
	</div>
</div>
