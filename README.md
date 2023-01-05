Markdown Notes App
==================

I made this kind of app a long time ago while studying, but now we can make a better version.
The features of this app:

1. Renders a markdown preview of dropbox content
  - Note this should support custom table of contents side nav
2. Markdown is editable in VSCode editor (monaco)
3. Basic functions like clicking checkboxes, may be done without opening markdown source

Step 1: Render a markdown preview of dropbox content
----------------------------------------------------

1. Vite app, client side, service worker, offline first, idb-keyval, recoil, react-router
2. Use dropbox SDK to manage files
  - Choice: Use one directory, read all files, or pick any file from dropbox?
3. Add a markdown to HTML renderer
