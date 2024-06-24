# Next.js + Cypress + JsPlumb

This example shows how to configure Cypress to work with Next.js and JsPlumb.

## Key Points

- Ensure you have included the app CSS in the Cypress config located at `cypress/support/component.ts`. In this app we have this declaration:

```javascript
import '../../styles/globals.css'  // for JSPLUMB test
```

This is important as `globals.css` itself imports JsPlumb's stylesheet, which contains various sane defaults that JsPlumb requires in order to function correctly.  You may also be able to just import JsPlumb's stylesheet:

```javascript
import '../../node_modules/@jsplumbtoolkit/browser-ui/css/jsplumbtoolkit.css'  // for JSPLUMB test
```

- We wrote a couple of helper functions to access the component under test and create a `jsPlumbToolkitTestHarness` from it. These functions are in `components/canvas-component.cy.tsx`; if you wanted to test multiple components a good approach would be to extract this to a common module.  If there is sufficient interest we could ship these helper functions as a separate `@jsplumbtoolkit/browser-ui-react-cypress` package. Drop us a line if that's something you're interested in.
