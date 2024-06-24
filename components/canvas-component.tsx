import {ControlsComponent, JsPlumbToolkitSurfaceComponent, newInstance} from "@jsplumbtoolkit/browser-ui-react"
import {MutableRefObject, useEffect, useRef, useState} from "react"
import {createRoot} from "react-dom/client"

import {AbsoluteLayout, EVENT_CANVAS_CLICK, EVENT_TAP, VanillaInspector} from "@jsplumbtoolkit/browser-ui"

export default function() {
    const toolkit = newInstance()

    const [tapCount, setTapCount] = useState(0)
    const initialized = useRef(false)
    const controlsRef:MutableRefObject<HTMLDivElement> = useRef(null as unknown as HTMLDivElement)
    const inspectorRef:MutableRefObject<HTMLDivElement> = useRef(null as unknown as HTMLDivElement)
    const surfaceRef:MutableRefObject<JsPlumbToolkitSurfaceComponent> = useRef(null as unknown as JsPlumbToolkitSurfaceComponent)

    const view = {
        nodes:{
            default:{
                jsx:(ctx) => <div className="test-node" data-jtk-target="true">
                    <h2>{ctx.data.label}</h2>
                    <div className="connect" data-jtk-source="true"/>
                </div>,
                events: {
                    [EVENT_TAP]: (p) => toolkit.setSelection(p.obj)
                }
            }
        }
    }

    const renderParams = {
        layout:{
            type:AbsoluteLayout.type
        },
        events:{
            [EVENT_CANVAS_CLICK]: () => setTapCount(tapCount + 1)
        }
    }

    useEffect(() => {
        if (!initialized.current) {
            initialized.current = true

            const cr = createRoot(controlsRef.current)
            cr.render(<ControlsComponent surface={surfaceRef.current.surface}/>)

            new VanillaInspector({
                container:inspectorRef.current,
                surface:surfaceRef.current.surface,
                templateResolver:(obj) => `<div><label>Label:</label><input type="text" jtk-focus jtk-att="label"/></div>`
            })

            toolkit.load({
                data:{
                    nodes:[
                        { id:"1", left:50, top:50, label:"Node 1" },
                        { id:"2", left:250, top:250, label:"Node 2" }
                    ]
                }
            })
        }
    })

    return <div className="container">
        <div className="controls" ref={controlsRef}/>

        <div className="canvas">
            <JsPlumbToolkitSurfaceComponent toolkit={toolkit} renderParams={renderParams} view={view} ref={surfaceRef}/>
        </div>
        <div className="inspector" ref={inspectorRef}/>
        </div>
}
