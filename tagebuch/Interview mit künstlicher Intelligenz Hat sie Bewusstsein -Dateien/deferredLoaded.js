// This is needed to mark deferred script loading finish
if (typeof deferredLoaded === 'undefined') {
  window.addEventListener('load', function() {
    window.deferredLoaded = true
  })

  //Fallback in case load never happens.
  setTimeout(function() {
    if (window.deferredLoaded === 'undefined') {
      window.deferredLoaded = true
    }
  }, 1000)
}
