// ==UserScript==
// @name Loqor's amazing Imgur fix for UK users (Originally by DrTheo!!)
// @description Fixes Imgur for UK users by redirecting to the DuckDuckGo proxy
// @namespace http://loqor.dev/
// @version 2025.10.09
// @author DrTheo, Loqor (copied because he's Russian)
// @match https://*/*
// icon data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant none
// ==/UserScript==

(function() {
    'use strict';

    const allATags = document.querySelectorAll('img');
    allATags.forEach((el) => {
        console.log(el);
        el.src = el.src.replace('i.imgur.com', 
            'external-content.duckduckgo.com/iu/?u=https://i.imgur.com');
    });
})();