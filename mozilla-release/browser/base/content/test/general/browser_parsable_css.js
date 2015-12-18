/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

/* This list allows pre-existing or 'unfixable' CSS issues to remain, while we
 * detect newly occurring issues in shipping CSS. It is a list of objects
 * specifying conditions under which an error should be ignored.
 *
 * Every property of the objects in it needs to consist of a regular expression
 * matching the offending error. If an object has multiple regex criteria, they
 * ALL need to match an error in order for that error not to cause a test
 * failure. */
const kWhitelist = [
  // CodeMirror is imported as-is, see bug 1004423.
  {sourceName: /codemirror\.css/i},
  // PDFjs is futureproofing its pseudoselectors, and those rules are dropped.
  {sourceName: /web\/viewer\.css/i,
   errorMessage: /Unknown pseudo-class.*(fullscreen|selection)/i},
  // Tracked in bug 1004428.
  {sourceName: /aboutaccounts\/(main|normalize)\.css/i},
  // TokBox SDK assets, see bug 1032469.
  {sourceName: /loop\/.*sdk-content\/.*\.css$/i},
  // Loop standalone client CSS uses placeholder cross browser pseudo-element
  {sourceName: /loop\/.*\.css/i,
   errorMessage: /Unknown pseudo-class.*placeholder/i},
  {sourceName: /loop\/.*shared\/css\/common.css/i,
   errorMessage: /Unknown property 'user-select'/i},
  // Highlighter CSS uses chrome-only pseudo-class, see bug 985597.
  {sourceName: /highlighter\.css/i,
   errorMessage: /Unknown pseudo-class.*moz-native-anonymous/i},
];

var moduleLocation = gTestPath.replace(/\/[^\/]*$/i, "/parsingTestHelpers.jsm");
var {generateURIsFromDirTree} = Cu.import(moduleLocation, {});

/**
 * Check if an error should be ignored due to matching one of the whitelist
 * objects defined in kWhitelist
 *
 * @param aErrorObject the error to check
 * @return true if the error should be ignored, false otherwise.
 */
function ignoredError(aErrorObject) {
  for (let whitelistItem of kWhitelist) {
    let matches = true;
    for (let prop in whitelistItem) {
      if (!whitelistItem[prop].test(aErrorObject[prop] || "")) {
        matches = false;
        break;
      }
    }
    if (matches) {
      return true;
    }
  }
  return false;
}

function once(target, name) {
  return new Promise((resolve, reject) => {
    let cb = () => {
      target.removeEventListener(name, cb);
      resolve();
    };
    target.addEventListener(name, cb);
  });
}

function messageIsCSSError(msg, innerWindowID, outerWindowID) {
  // Only care about CSS errors generated by our iframe:
  if ((msg instanceof Ci.nsIScriptError) &&
      msg.category.includes("CSS") &&
      msg.innerWindowID === innerWindowID && msg.outerWindowID === outerWindowID) {
    // Check if this error is whitelisted in kWhitelist
    if (!ignoredError(msg)) {
      ok(false, "Got error message for " + msg.sourceName + ": " + msg.errorMessage);
      return true;
    }
    info("Ignored error for " + msg.sourceName + " because of filter.");
  }
  return false;
}

add_task(function checkAllTheCSS() {
  let appDir = Services.dirsvc.get("XCurProcD", Ci.nsIFile);
  // This asynchronously produces a list of URLs (sadly, mostly sync on our
  // test infrastructure because it runs against jarfiles there, and
  // our zipreader APIs are all sync)
  let uris = yield generateURIsFromDirTree(appDir, ".css");

  // Create a clean iframe to load all the files into. This needs to live at a
  // file or jar URI (depending on whether we're using a packaged build or not)
  // so that it's allowed to load other same-scheme URIs (i.e. the browser css).
  let resHandler = Services.io.getProtocolHandler("resource")
                           .QueryInterface(Ci.nsISubstitutingProtocolHandler);
  let resURI = Services.io.newURI('resource://testing-common/resource_test_file.html', null, null);
  let testFile = resHandler.resolveURI(resURI);
  let windowless = Services.appShell.createWindowlessBrowser();
  let iframe = windowless.document.createElementNS("http://www.w3.org/1999/xhtml", "html:iframe");
  windowless.document.documentElement.appendChild(iframe);
  let iframeLoaded = once(iframe, 'load');
  iframe.contentWindow.location = testFile;
  yield iframeLoaded;
  let doc = iframe.contentWindow.document;
  let windowUtils = iframe.contentWindow.QueryInterface(Ci.nsIInterfaceRequestor)
                                        .getInterface(Ci.nsIDOMWindowUtils);
  let innerWindowID = windowUtils.currentInnerWindowID;
  let outerWindowID = windowUtils.outerWindowID;

  // We build a list of promises that get resolved when their respective
  // files have loaded and produced no errors.
  let allPromises = [];

  // filter out either the devtools paths or the non-devtools paths:
  let isDevtools = SimpleTest.harnessParameters.subsuite == "devtools";
  let devtoolsPathBits = ["webide", "devtools"];
  uris = uris.filter(uri => isDevtools == devtoolsPathBits.some(path => uri.spec.includes(path)));

  for (let uri of uris) {
    let linkEl = doc.createElement("link");
    linkEl.setAttribute("rel", "stylesheet");
    let promiseForThisSpec = Promise.defer();
    let onLoad = (e) => {
      promiseForThisSpec.resolve();
      linkEl.removeEventListener("load", onLoad);
      linkEl.removeEventListener("error", onError);
    };
    let onError = (e) => {
      ok(false, "Loading " + linkEl.getAttribute("href") + " threw an error!");
      promiseForThisSpec.resolve();
      linkEl.removeEventListener("load", onLoad);
      linkEl.removeEventListener("error", onError);
    };
    linkEl.addEventListener("load", onLoad);
    linkEl.addEventListener("error", onError);
    linkEl.setAttribute("type", "text/css");
    linkEl.setAttribute("href", uri.spec);
    allPromises.push(promiseForThisSpec.promise);
    doc.head.appendChild(linkEl);
  }

  // Wait for all the files to have actually loaded:
  yield Promise.all(allPromises);

  let messages = Services.console.getMessageArray();
  // Count errors (the test output will list actual issues for us, as well
  // as the ok(false) in messageIsCSSError.
  let errors = messages.filter(m => messageIsCSSError(m, innerWindowID, outerWindowID));
  is(errors.length, 0, "All the styles (" + allPromises.length + ") loaded without errors.");

  // Clean up to avoid leaks:
  iframe.remove();
  doc.head.innerHTML = '';
  doc = null;
  iframe = null;
});