Markdown Notes App
==================

I made this kind of app a long time ago while studying, but now we can make a better version.
The features of this app:

1. Renders a markdown preview of dropbox content
  - Note this should support custom table of contents side nav
2. Markdown is editable in VSCode editor (monaco) (try vim.wasm first)
3. Basic functions like clicking checkboxes, may be done without opening markdown source

Step 1: Render a markdown preview of dropbox content
----------------------------------------------------

1. Vite app, client side, service worker, offline first, idb-keyval, recoil, react-router
2. Use dropbox SDK to manage files
  - Choice: Use one directory, read all files, or pick any file from dropbox?
3. Add a markdown to HTML renderer

### Auth
Implementing OAuth2 for Dropbox

> https://developers.dropbox.com/oauth-guide

1. Split up "Routes" so that you conditionally show routes based on what state you are in
  - Note that you might want to support "signup and redirect" but in this case we are not a full "login logout" service
2. Set root route as simple button to add Dropbox + message explaining why
3. Clicking button takes you to Dropbox
4. Upon redirecting back to the current page, set auth data in Recoil with an effect that persists it in idb
5. Given some auth token, fetch a list of files from dropbox -> save in Recoil, show on screen

Webapp design
-------------

- Dropbox optional? - notion of "accounts" so rather than "fusing" you retain both the dropbox and the on device storage separately?
- No Dropbox - centered button - Login to Dropbox
- Has dropbox - left nav, split view (only available on desktop), left and right, logout button
