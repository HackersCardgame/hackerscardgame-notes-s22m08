(window.webpackJsonp=window.webpackJsonp||[]).push([[26],{280:function(e,t){!function(e){"use strict";var t={selectors:{placeholder:".show-recommended-placeholder"},init:function init(){$(t.selectors.placeholder).each((function(e,n){t.getContent(n)}))},getContent:function getContent(e){var n=$(e);n.load(n.attr("data-ajaxurl"),(function(){t.truncate(n),setTimeout((function(){t.checkIfClosed(n),t.hideSkeletons(n),$(document).trigger("showRecommended:loaded")}),10)}))},truncate:function truncate(e){$(".creative-work__title",e).not("[data-truncate='none']").truncate({lines:3,addClass:"min-height"}),$(".creative-work .loa",e).not("[data-truncate='none']").truncate({lines:2,type:"list",addClass:"loa-height"})},checkIfClosed:function checkIfClosed(e){var t=e.closest(".accordion-tabbed__tab");t.hasClass("js--open")||(t.find(".accordion-tabbed__control").attr("aria-expanded","false"),t.find(".accordion-tabbed__content").hide())},hideSkeletons:function hideSkeletons(e){$(".lazy-load",e).remove(),$(".delayLoad",e).removeClass("delayLoad").addClass("delayedLoad"),e.replaceWith(e.children())}};e.showRecommended=t}(UX)}}]);
//# sourceMappingURL=showRecommended-e1aa26daa2b635d516f6.js.map