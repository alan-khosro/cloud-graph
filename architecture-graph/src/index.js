import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';
import { CodeJar } from 'codejar'
import { withLineNumbers } from "codejar-linenumbers";

const writer = document.querySelector('#writer')
const viewer = document.querySelector('#viewer')
const download = document.querySelector('#download')
const downloadPng = document.querySelector('#downloadPng')
const draw = document.querySelector('#draw')

mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'loose',
    theme: 'base',
    themeVariables: {
        background: 'transparent',
        mainBkg: 'transparent',
        secondaryColor: 'white',
        tertiaryTextColor: 'white',

        tertiaryTextColor: 'blue',
        tertiaryBorderColor: 'blue',

        primaryColor: 'white',
        primaryTextColor: '#0080ff',
        primaryBorderColor: 'none',
        lineColor: 'blue'
    }
});

const jar = CodeJar(writer, withLineNumbers(x => x))

draw.addEventListener('click', async () => {
    const code = jar.toString()
    console.log(code)
    const { svg } = await mermaid.render('graphDiv', code);
    viewer.innerHTML = svg

    const svgResized = svg.replace(/width=".*?"/, `width="${1000}"`)

    svgToPng(svgResized, png => {
        downloadPng.href = png;
        downloadPng.download = "graph.png";
    })

    var svgBlob = new Blob([svgResized], { type: "image/svg+xml;charset=utf-8" });
    download.href = URL.createObjectURL(svgBlob);
    download.download = "graph.svg";

})

function svgToPng(svg, callback) {
    const img = new Image();
    img.src = 'data:image/svg+xml;base64,' + btoa(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const pngDataUrl = canvas.toDataURL('image/png');
        callback(pngDataUrl)
    }
}

