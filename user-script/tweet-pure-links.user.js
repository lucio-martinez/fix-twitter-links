// ==UserScript==
// @name        Tweet Pure Links
// @description Tweet Pure Links and say goodbye to the URL shorten system!
// @author      Lucio Martinez
// @license     MIT
// @copyright   2014-2020, Lucio Martinez (https://openuserjs.org/users/lucio-martinez)
// @downloadURL https://openuserjs.org/install/lucio-martinez/Tweet_Pure_Links.user.js
// @updateURL   https://openuserjs.org/meta/lucio-martinez/Tweet_Pure_Links.meta.js
// @supportURL  https://github.com/luciomartinez/tweet-pure-links/issues
// @namespace   https://github.com/luciomartinez/tweet-pure-links
// @version     3.0
// @grant       none
// @match       https://twitter.com/*
// @match       https://mobile.twitter.com/*
// @match       https://tweetdeck.twitter.com/*
// ==/UserScript==

fixLinks();

formatCopyLinkToTweet();

function fixLinks() {
  const domain = window.location.hostname;
  if (domain === 'tweetdeck.twitter.com') {
    fixLinksInTweetDeck();
  } else {
    fixLinksInTwitter();
  }
}

function fixLinksInTwitter() {
  startObservingWithCallback(parseLinksAtTwitter);
}

function fixLinksInTweetDeck() {
  startObservingWithCallback(parseLinksAtTweetDeck);
}

function startObservingWithCallback(callback) {
  const observer = createObserverWithCallbackBounced(callback);
  configureObserver(observer);
}

function createObserverWithCallbackBounced(callback) {
  const callbackDebounced = debounce(callback);
  return createObserver(callbackDebounced);
}

function createObserver(callback) {
  return new MutationObserver(callback);
}

function configureObserver(observer) {
  const observedNode = getNodeToObserve();
  observer.observe(observedNode, { subtree: true, childList: true });
}

function getNodeToObserve() {
  return document.getElementById('react-root');
}

/**
 * Thanks to Chris Boakes!
 * https://chrisboakes.com/how-a-javascript-debounce-function-works/
 * @param {function} callback - Function to be debounced
 * @param {number} [wait=250] - Specifies the milliseconds to debounce
 * @returns {function} Debounced function
 */
function debounce(callback, wait = 250) {
  let timeout;
  return (...args) => {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => callback.apply(context, args), wait);
  };
}

function parseLinksAtTwitter() {
  const selectShortLinks = 'a[href^="https://t.co/"][title]:not([data-link-fixed])';
  const links = document.querySelectorAll(selectShortLinks);
  links.forEach((link) => {
    updateLinkAndMarkAsFixed(link, link.title);
  });
}

function parseLinksAtTweetDeck() {
  const selectFromTweets = '.tweet-text > .url-ext[href^="https://t.co/"][data-full-url]:not([data-link-fixed], .is-vishidden)';
  const selectFromQuotedTweets = '.quoted-tweet .url-ext[href^="https://t.co/"][data-full-url]:not([data-link-fixed])';
  const selectFromTweetDetail = '.tweet-detail .url-ext[href^="https://t.co/"][data-full-url]:not([data-link-fixed])';
  const multipleSelects = `${selectFromTweets}, ${selectFromQuotedTweets}, ${selectFromTweetDetail}`;
  const links = document.querySelectorAll(multipleSelects);
  links.forEach((link) => {
    updateLinkAndMarkAsFixed(link, link.dataset.fullUrl);
  });
}

function updateLinkAndMarkAsFixed(anchorEl, fixedUrl) {
  console.info('Fix Twitter links: URL parsed', fixedUrl);
  setHrefTo(anchorEl, fixedUrl);
  markAsFixed(anchorEl);
}

function setHrefTo(el, url) {
  el.href = url;
}

function markAsFixed(el) {
  el.dataset.linkFixed = '1';
}

function formatCopyLinkToTweet() {
  findShareTweetBtnsAndAttachListener().catch(() => console.error('Format Copy Link to Tweet failed unexpectedly.'));
}

async function findShareTweetBtnsAndAttachListener() {
  const shareTweetBtns = await findShareTweetBtns();
  attachListenersToShareTweetBtns(shareTweetBtns);
}

async function findShareTweetBtns() {
  const SELECTOR_SHARE_TWEET_BTNS = '[aria-label="Share Tweet"]';
  await waitFor(750);
  return document.querySelectorAll(SELECTOR_SHARE_TWEET_BTNS);
}

function attachListenersToShareTweetBtns(shareTweetBtns) {
  shareTweetBtns.forEach((btn) => {
    btn.onclick = findCopyLinkToTweetBtnAndAttachListener;
  });
}

async function findCopyLinkToTweetBtnAndAttachListener() {
  const copyLinkToTweetBtn = await findCopyLinkToTweetBtn();
  copyLinkToTweetBtn.onclick = formatLinkValueOnClipboard;
}

async function findCopyLinkToTweetBtn() {
  const shareTweetOptions = await findShareTweetOptions();
  return getCopyLinkToTweetBtnFromShareTweetOptions(shareTweetOptions);
}

async function findShareTweetOptions() {
  const SELECTOR_SHARE_TWEET_OPTIONS = '[role="menuitem"]';
  await waitFor(250);
  return document.querySelectorAll(SELECTOR_SHARE_TWEET_OPTIONS);
}

function getCopyLinkToTweetBtnFromShareTweetOptions(shareTweetOptions) {
  const ZERO_INDEX_BTN_COPY_LINK_TO_TWEET = 2;
  return shareTweetOptions[ ZERO_INDEX_BTN_COPY_LINK_TO_TWEET ];
}

async function formatLinkValueOnClipboard() {
  const originalLink = await getLinkValueFromClipboard();
  const newLink = originalLink.replace('?s=20', '');
  await saveValueOnClipboard(newLink);
}

async function getLinkValueFromClipboard() {
  await waitFor(1);
  return await navigator.clipboard.readText();
}

function saveValueOnClipboard(value) {
  return navigator.clipboard.writeText(value);
}

/**
 * Thanks to SLaks!
 * https://stackoverflow.com/a/51200649/1505348
 * @param delay Milliseconds
 * @returns {Promise<void>}
 */
function waitFor(delay) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}
