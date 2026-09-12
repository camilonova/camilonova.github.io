// Adapted from ThreeUI ConstellationField, source revision 1920ad4fe34f.
// https://threeui.com/source-code/constellation-field.json
(() => {
    const canvas = document.getElementById('constellationCanvas');
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    const pointer = { x: -1000, y: -1000 };
    let width, height, nodes, frame, lastTime;

    function resize() {
        width = innerWidth;
        height = innerHeight;
        const dpr = Math.min(devicePixelRatio || 1, 2);
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        nodes = Array.from({ length: width < 768 ? 40 : 85 }, () => ({
            x: Math.random() * width, y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
            radius: Math.random() * 2.4 + 1.8,
        }));
        draw(0, 0);
    }

    function draw(step, time) {
        ctx.clearRect(0, 0, width, height);
        ctx.strokeStyle = ctx.fillStyle = '#FFFFFF';
        ctx.lineWidth = 1;
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const a = nodes[i], b = nodes[j];
                const distance = Math.hypot(a.x - b.x, a.y - b.y);
                if (distance >= 160) continue;
                ctx.globalAlpha = 0.22 + (1 - distance / 160) * 0.55;
                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);
                ctx.stroke();
            }
        }
        for (const node of nodes) {
            node.x += node.vx * step;
            node.y += node.vy * step;
            if (node.x < 0 || node.x > width) node.vx *= -1;
            if (node.y < 0 || node.y > height) node.vy *= -1;
            if (Math.hypot(node.x - pointer.x, node.y - pointer.y) < 220) {
                const pull = 1 - Math.pow(0.995, step);
                node.x += (pointer.x - node.x) * pull;
                node.y += (pointer.y - node.y) * pull;
            }
            const pulse = 0.78 + Math.sin(time * 0.001 + node.x) * 0.22;
            ctx.globalAlpha = pulse * 0.28;
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.radius * 2.4, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = pulse;
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;
    }

    function animate(time) {
        const step = lastTime == null ? 1 : Math.min((time - lastTime) / (1000 / 60), 3);
        lastTime = time;
        draw(step, time);
        frame = requestAnimationFrame(animate);
    }

    function start() {
        cancelAnimationFrame(frame);
        lastTime = null;
        if (!document.hidden && !reducedMotion.matches) frame = requestAnimationFrame(animate);
    }

    const clearPointer = () => { pointer.x = pointer.y = -1000; };
    document.addEventListener('pointermove', event => {
        pointer.x = event.clientX;
        pointer.y = event.clientY;
    }, { passive: true });
    document.addEventListener('pointerleave', clearPointer);
    document.addEventListener('pointercancel', clearPointer);
    document.addEventListener('pointerup', event => {
        if (event.pointerType !== 'mouse') clearPointer();
    });
    window.addEventListener('blur', clearPointer);
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', start);
    reducedMotion.addEventListener('change', start);
    resize();
    start();
})();
