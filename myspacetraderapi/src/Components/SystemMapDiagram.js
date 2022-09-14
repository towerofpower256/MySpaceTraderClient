import { useEffect, useRef } from "react"
import { loadSystemsData } from "../Services/LocalStorage";
import calcDistance from "../Utils/calcDistance";
import getLocationName from "../Utils/getLocationName";
import sortCompareNumerically from "../Utils/sortCompareNumerically";

const MAP_MARGIN = 5;
const MAP_PLANET_SIZE = 4;

export default function SystemMapDiagram(props) {
    const canvasRef = useRef(null);
    const wrapperRef = useRef(null);
    const systemId = props.system;
    const canvasWidth = props.width || 400;
    const canvasHeight = props.height || 400;

    useEffect(() => {
        clearCanvas();
        drawBackground();
        drawSystem();
    }, [systemId]);

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

        // Draw crosshair
        
        ctx.lineWidth = 1;

        ctx.moveTo(0 + margin, cMiddleY);
        ctx.lineTo(cHeight - margin, cMiddleY);
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#cdcdcd';
        ctx.stroke();

        ctx.moveTo(cMiddleX, 0 + margin);
        ctx.lineTo(cMiddleX, cWidth - margin);
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#cdcdcd';
        ctx.stroke();

        // Draw big circle
        ctx.beginPath();
        ctx.arc(cMiddleX, cMiddleY, (cMinSize / 2), 0, 2 * Math.PI, false);
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#cdcdcd';
        ctx.stroke();

        // Draw little circle
        ctx.beginPath();
        ctx.arc(cMiddleX, cMiddleY, (cMinSize / 4), 0, 2 * Math.PI, false);
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#cdcdcd';
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

        let scaleFactor = (cMinSize - (MAP_MARGIN + 10)) / (largestNum * 2);
        // reduce by 10% to add some margin
        scaleFactor = scaleFactor * 0.9;

        const systemObjs = [];
        system.locations.forEach((loc, idx) => {
            systemObjs.push({
                //label: getLocationName(loc.symbol),
                label: loc.symbol,
                symbol: loc.symbol,
                type: loc.type,
                x: loc.x * scaleFactor,
                y: loc.y * scaleFactor,
            });
        })

        // Set the order weight of the objects, by lookup table
        const objTypeOrder = {
            "GAS_GIANT": 10,
            "PLANET": 20,
            "MOON": 30,
            "NEBULA": 40,
            "WORMHOLE": 50,
            "ASTEROID": 99
        };
        systemObjs.forEach(obj => {
            obj.sortWeight = objTypeOrder[obj.type] || 99;
        });

        // Cluster objects that are very close together

        let systemObjsClustered = [];
        let systemObjsClusterStartQueue = [...systemObjs];
        let clusterObjsHaveProcessed = [];
        // While there's objects to start cluster checking
        while (systemObjsClusterStartQueue.length > 0) {
            // Get the next object to search for clustering
            let startObj = systemObjsClusterStartQueue.pop();

            // Ignore if we've already identified this object as part of a cluster
            if (clusterObjsHaveProcessed.includes(startObj)) continue;

            // Setup the new cluster
            let thisCluster = []; // The cluster
            let thisClusterQueue = [startObj]; // Queue of objects to check for clustering, starting from the start obj

            // Loop through cluster start queue
            while (thisClusterQueue.length > 0) {
                let nextClusterObj = thisClusterQueue.pop();
                thisCluster.push(nextClusterObj); // Add this object to the cluster

                clusterObjsHaveProcessed.push(nextClusterObj); // Remember that we've processed this object

                // Loop through possible targets
                let objTargetQueue = [...systemObjsClusterStartQueue];
                while (objTargetQueue.length > 0) {
                    // Get the next possible target from the queue
                    let nextTargetObj = objTargetQueue.pop();

                    // Ignore if this object is already a part of the cluster, don't want to infinitely loop
                    if (thisCluster.includes(nextTargetObj)) continue;

                    // Check the distance
                    let distance = calcDistance(nextClusterObj.x, nextClusterObj.y, nextTargetObj.x, nextTargetObj.y);
                    if (distance < 20) {
                        // Target object is close enough to be considered part of the cluster.
                        // Add it to the cluster queue to be processed next
                        // if it's not already in there
                        if (!thisClusterQueue.includes(nextTargetObj))
                            thisClusterQueue.push(nextTargetObj);
                    }
                }
            }

            // Add the cluster to the list
            systemObjsClustered.push(thisCluster);
        }

        // Order the clusters, largest bodies first
        
        
        systemObjsClustered.forEach(cluster => {
            cluster.sort((a, b) => sortCompareNumerically(a.sortWeight, b.sortWeight, false))
        })

        // Draw the clusters

        systemObjsClustered.forEach((cluster) => {
            let clusterMiddleX = cluster.length == 0 ? cluster[0].x : cluster.reduce((prev, next) => prev + next.x, 0) / cluster.length;
            let clusterMiddleY = cluster.length == 0 ? cluster[0].y : cluster.reduce((prev, next) => prev + next.y, 0) / cluster.length;

            let clusterPosX = clusterMiddleX + cMiddleX;
            let clusterPosY = clusterMiddleY + cMiddleY;

            // Draw the centre of the cluster
            ctx.beginPath();
            ctx.arc(clusterPosX, clusterPosY, MAP_PLANET_SIZE, 0, 2 * Math.PI, false);
            ctx.lineWidth = 1;
            ctx.strokeStyle = '#black';
            ctx.fill();

            // Draw the cluster label
            ctx.font = '12px Arial';
            ctx.textBaseline = "top";
            cluster.forEach((obj, idx) => {
                ctx.fillText(obj.label, clusterPosX+10, clusterPosY+(idx * 14));
            });
            
        })
    }

    return (
        <div ref={wrapperRef} className="border w-100">
            <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} {...props} />
        </div>
    )
}