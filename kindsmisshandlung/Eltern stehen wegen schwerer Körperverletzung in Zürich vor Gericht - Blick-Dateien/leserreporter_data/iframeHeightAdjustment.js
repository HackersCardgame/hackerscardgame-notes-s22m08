;(function () {
  let resizeObserver

  let currentObservedWidth
  let currentObservedHeight

  const isFacebookIFrame = () =>
    ['facebook', 'facebook.html'].some((pathEnding) =>
      window.location.pathname.endsWith(pathEnding)
    )

  const getCorrectUniqueIframeId = (customIframeId) => {
    // First check if the unique id is a custom iframe id set on the body tag
    if (typeof customIframeId === 'string' && customIframeId !== '') {
      return customIframeId
    }

    // Then check if the unique id is an id set on the iframe element
    if (window?.frameElement?.id) {
      return window.frameElement.id
    }

    // As a fallback return the url as a unique identifier
    return window.location.href
  }

  // This is needed for react-native android to work,
  // because there are timing issues with the Android Webview
  // TODO: Remove when RN-Apps are phased out
  const sendHeightToParent = (iframeId, measurementSource) => {
    if (document?.body) {
      window?.blickIframeUtils?.sendDimensionsToParent?.(
        document.body.offsetWidth,
        document.body.offsetHeight
      )
    }
  }

  const sendDimensionsToParent = (width, height, customIframeId) => {
    const data = {
      height,
      width,
      iframeId: getCorrectUniqueIframeId(customIframeId),
    }
    if (
      typeof window?.webkit?.messageHandlers?.postMessageListener
        ?.postMessage === 'function'
    ) {
      // Post message listener for iOS native (Baby Yoda)
      window.webkit.messageHandlers.postMessageListener.postMessage(
        JSON.stringify(data)
      )
    } else if (typeof isRNWebView !== 'undefined' && isRNWebView) {
      reactNativePostMessage(JSON.stringify(data))
    } else if (window.parent) {
      window.parent.postMessage(data, '*')
    }
  }

  // TODO: Remove when RN-Apps are phased out
  const reactNativePostMessage = (message) => {
    // The react native post message is sometimes too fast,
    // that's why we need a setTimeout here
    if (window.postMessage.length === 1) {
      window.postMessage(message)
    } else {
      setTimeout(reactNativePostMessage.bind(null, message), 100)
    }
  }

  const onResize = (entries) => {
    entries.forEach((entry) => {
      //! We avoid sending invalid width / height (it happens sometimes),
      //! like 0 height or width, or re-sending the same height & width
      //! as we have already done.
      const entryWidth = entry.contentRect.width
      const entryHeight = entry.contentRect.height

      if (
        typeof entryWidth === 'number' &&
        typeof entryHeight === 'number' &&
        entryWidth > 0 &&
        entryHeight > 0 &&
        //! Guard because facebook iframes sometimes send extremely small / great heights (e.g. 19 / 6600)
        //! and this would cause an extra layout shift when we set initial height in the iframes.
        (!isFacebookIFrame() || (entryHeight > 100 && entryHeight < 1000))
      ) {
        const intWidth = Math.ceil(entryWidth)
        const intHeight = Math.ceil(entryHeight)

        if (
          currentObservedWidth !== intWidth ||
          currentObservedHeight !== intHeight
        ) {
          const customIframeId = entry.target.id

          currentObservedWidth = intWidth
          currentObservedHeight = intHeight

          sendDimensionsToParent(intWidth, intHeight, customIframeId)
        }
      }
    })
  }

  const addResizeObserver = () => {
    if (!resizeObserver) {
      try {
        resizeObserver = new ResizeObserver(onResize)
        heightAdjustmentId = Math.floor(Math.random() * 1000) + 1
        resizeObserver.observe(document.body)
      } catch (err) {
        //Do nothing. ResizeObserver is not supported in this browser.
      }
    }
  }

  // react-native-webview only supports checking for the readyState and not
  // the load event listener
  // TODO: Remove when RN-Apps are phased out
  if (typeof isRNWebView !== 'undefined' && isRNWebView) {
    if (document.readyState === 'complete') {
      addResizeObserver()
    }
  } else {
    // TODO: Leave only code below when RN-Apps are phased out
    if (document.readyState === 'complete') {
      addResizeObserver()
    }
  }

  window.addEventListener('load', () => {
    addResizeObserver()
  })

  window.blickIframeUtils = {
    sendDimensionsToParent,
    sendHeightToParent,
  }
})()
