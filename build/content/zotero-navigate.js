(() => {
  // content/zotero-navigate.ts
  if (!Zotero.Navigate) {
    let patch = function(object, method, patcher) {
      if (object[method][monkey_patch_marker])
        return;
      object[method] = patcher(object[method]);
      object[method][monkey_patch_marker] = true;
    };
    patch2 = patch;
    const monkey_patch_marker = "NavigateMonkeyPatched";
    class Navigate {
      constructor() {
        this.initialized = false;
      }
      async load(globals) {
        this.globals = globals;
        if (this.initialized)
          return;
        this.initialized = true;
        this.strings = globals.document.getElementById("zotero-navigate-strings");
        Zotero.history.setHandlers(globals.document);
      }
    }
    Zotero.Navigate = new Navigate();
  }
  var patch2;
})();
