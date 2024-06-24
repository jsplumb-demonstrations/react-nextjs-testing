import {EVENT_DATA_LOAD_END, jsPlumbToolkitTestHarness} from "@jsplumbtoolkit/browser-ui"
import CanvasComponent from "./canvas-component";
/* eslint-disable */
// Disable ESLint to prevent failing linting inside the Next.js repo.
// If you're using ESLint on your project, we recommend installing the ESLint Cypress plugin instead:
// https://github.com/cypress-io/eslint-plugin-cypress

function getJsPlumbContext(cypressEl) {
    for (let k in cypressEl) {
        if (k.startsWith("__reactFiber")) {
            return cypressEl[k].return.ref.current
        }
    }
}

function createTestHarness(cb) {
    cy.get(".jtk-surface").then(s => {
        const f = getJsPlumbContext(s[0])
        if (f != null) {
            cb(new jsPlumbToolkitTestHarness(f.toolkit, f.surface))
        } else {
            throw new Error("Cannot create JsPlumb test harness")
        }
    })
}


// Cypress Component Test
describe("<CanvasComponent />", () => {
    it("should render and display expected content ", () => {
        // Mount the React component for the canvas
        cy.mount(<CanvasComponent />);

        createTestHarness((testHarness) => {

            cy.get(".jtk-node").should("have.length", 2)
            cy.get(".jtk-surface-selected-element").should("have.length", 0)
            cy.get(".jtk-connector").should("have.length", 0)

            cy.wrap(testHarness.toolkit.getNodes()).should("have.length", 2)
            cy.wrap(testHarness.toolkit.getAllEdges()).should("have.length", 0)


            cy.then(n => {

                const node1 = testHarness.toolkit.getNode("1")
                cy.wrap(node1.data.left).should("equal", 50)
                cy.wrap(node1.data.top).should("equal", 50)
                //
                testHarness.tapOnNode("1")
                cy.then(n => {

                    cy.get(".jtk-surface-selected-element").should("have.length", 1)

                    testHarness.dragConnection(["1", ".connect"], "2")
                    cy.then(() => {

                        cy.get(".jtk-connector").should("have.length", 1)
                        cy.wrap(testHarness.toolkit.getAllEdges()).should("have.length", 1)

                        testHarness.dragVertexBy("1", 250, 300)
                        cy.then(() => {
                            cy.wrap(node1.data.left).should("equal", 300)
                            cy.wrap(node1.data.top).should("equal", 350)
                        })

                    })
                })
            })



        })
    });
});

// Prevent TypeScript from reading file as legacy script
export {};
