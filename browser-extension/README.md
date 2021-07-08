## Publish Browser Extension

Tweet Pure Links is available as a Browser Extension via the following marketplaces.

 - [chrome web store](https://chrome.google.com/webstore/detail/tweet-pure-links/aiepfkanoffcoebholplgmjncpdbijdn?hl=en-GB)
 - [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/tweet-pure-links/?src=search)

### Create a release

Run the [`build.sh`](build.sh) script to generate a `release.zip` file to upload into the marketplace.

### Versioning

The [`manifest.json`](manifest.json) file declares the version of the browser extension in its `version` property.

### Testing

Run the [`build_unpacked.sh`](build_unpacked.sh) script to generate a `unpacked` directory containing an unpacked version that can be tested by loading it directly from the browser.
