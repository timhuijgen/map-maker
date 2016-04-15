// Fake electron to run the project in a regular browser.
// Electron wont be available so to prevent require errors from webpack
// we fake an empty electron
window.electron = {
    remote: {
        Menu: {},
        MenuItem: {}
    }
};