import { useEffect, useRef } from "react"
import { loadSystemsData } from "../Services/LocalStorage";

const MAP_MARGIN = 5;
const MAP_PLANET_SIZE = 4;

export default function SystemMapDiagram(props) {
    const canvasRef = useRef(null);
    const systemId = props.system;

    useEffect(() => {
        clearCanvas();
        drawBackground();
        drawSystem();
    }, []);

    function clearCanvas() {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        // Store the current transformation matrix
        context.save();

        // Use the identity matrix while clearing the canvas
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Restore the transform
        context.restore();
    }

    function drawBackground() {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const margin = MAP_MARGIN;
        const cWidth = canvas.clientWidth;
        const cHeight = canvas.clientHeight;
        const cMiddleX = cWidth / 2;
        const cMiddleY = cHeight / 2;
        const cMinSize = Math.min(cWidth, cHeight) - (margin * 2);

        ctx.moveTo(0 + margin, cMiddleY);
        ctx.lineTo(cHeight - margin, cMiddleY);
        ctx.stroke();

        ctx.moveTo(cMiddleX, 0 + margin);
        ctx.lineTo(cMiddleX, cWidth - margin);
        ctx.stroke();

        // Draw big circle
        ctx.beginPath();
        ctx.arc(cMiddleX, cMiddleY, (cMinSize / 2), 0, 2 * Math.PI, false);
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#black';
        ctx.stroke();

        // Draw little circle
        ctx.beginPath();
        ctx.arc(cMiddleX, cMiddleY, (cMinSize / 4), 0, 2 * Math.PI, false);
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#black';
        ctx.stroke();
    }

    function drawSystem() {
        const systemData = loadSystemsData()
        if (!Array.isArray(systemData.systems)) return; // TODO handle missing system
        const system = systemData.systems.find(s => s.symbol === systemId);
        if (!system) return; // TODO handle missing system

        let largestNum = 0;
        system.locations.forEach((loc, idx) => {
            largestNum = Math.max(Math.abs(loc.x), Math.abs(loc.y), largestNum);
        })

        // TODO this shouldn't be here
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const margin = MAP_MARGIN;
        const cWidth = canvas.clientWidth;
        const cHeight = canvas.clientHeight;
        const cMiddleX = cWidth / 2;
        const cMiddleY = cHeight / 2;
        const cMinSize = Math.min(cWidth, cHeight);

        let scaleFactor = (cMinSize-(MAP_MARGIN+10)) / (largestNum*2);

        const systemObjs = [];
        system.locations.forEach((loc, idx) => {
            systemObjs.push({
                x: loc.x*scaleFactor,
                y: loc.y*scaleFactor,
            });
        })

        systemObjs.forEach((loc, idx) => {
            // Draw big circle
            ctx.beginPath();
            ctx.arc(loc.x+cMiddleX, loc.y+cMiddleY, MAP_PLANET_SIZE, 0, 2 * Math.PI, false);
            ctx.lineWidth = 1;
            ctx.strokeStyle = '#black';
            ctx.fill();
        })
    }

    return (
        <div className="border">
            <canvas ref={canvasRef} {...props} width="400" height="400" />
        </div>
    )
}