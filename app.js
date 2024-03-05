const canvas = document.getElementById("chart");

const ctx = canvas.getContext("2d");

canvas.width = 660;
canvas.height = 860;
ctx.fillRect(0, 0, canvas.width, canvas.height);
//      1611, 2781, 2849, 2555, 2754, 3058, 3327, 3420, 4377, 3943, 3299, 2792, 2614, 2152, 1664, 920, 604, 287, 118, 32, 3
//      1413, 2585, 2626, 2313, 2483, 2630, 2863, 3388, 4554, 4096, 3229, 2764, 2827, 2408, 1875, 1062, 833, 477, 183, 69, 8
let data = {
    male: [],
    female: [],
    maleCt: 0,
    femaleCt: 0,
    allCt: 0,
    maleRt: [],
    femaleRt: [],
    sexRt: null,
    depRt: null,
    smaCt: 0,
    midCt: 0,
    bigCt: 0
};

function active() {
    data.male = document.getElementById("male_data").value.split(',').map(num => parseInt(num.trim(), 10));
    data.female = document.getElementById("female_data").value.split(',').map(num => parseInt(num.trim(), 10));

    // run function 

    calcData()
    calcGraph()
    generateGraph()
    scrollToBottom()

}



const calcData = () => {
    for (let k in data.male)
        data.maleCt += data.male[k];
    for (let k in data.female)
        data.femaleCt += data.female[k];

    data.allCt = data.maleCt + data.femaleCt;

    for (let k = 0; k < data.male.length; k++) {
        data.maleRt.push((data.male[k] / data.allCt) * 100);
        data.femaleRt.push((data.female[k] / data.allCt) * 100);
    }
    data.sexRt = ((data.maleCt / data.femaleCt) * 100).toFixed(2);
    for (let k = 0; k <= 2; k++) {
        data.smaCt += (data.male[k] + data.female[k]);
    }
    for (let k = 3; k <= 12; k++) {
        data.midCt += (data.male[k] + data.female[k]);
    }
    for (let k = 13; k <= 20; k++) {
        data.bigCt += (data.male[k] + data.female[k]);
    }
    data.depRt = ((data.smaCt + data.bigCt) / data.midCt * 100).toFixed(2);
    console.log(data);
};

// calcData();

let maxRt;
let publicRt;
let finalRt = {
    ma: [],
    fe: []
};
const calcGraph = () => {
    let max = 0;
    for (let k in data.maleRt) {
        if (data.maleRt[k] > max) {
            max = data.maleRt[k];
        }
    }
    for (let k in data.femaleRt) {
        if (data.femaleRt[k] > max) max = data.femaleRt[k];
    }

    if ((parseInt(max.toFixed()) + 1) % 2 == 0) {
        maxRt = (parseInt(max.toFixed()) + 1);
    } else {
        maxRt = (parseInt(max.toFixed()) + 1) + 1;
    }

    publicRt = 300 / maxRt;

    for (let k in data.maleRt) {
        finalRt.ma.push(data.maleRt[k] * publicRt);
    }
    for (let k in data.femaleRt) {
        finalRt.fe.push(data.femaleRt[k] * publicRt);
    }
};


// calcGraph();

let cen = 330;
const generateGraph = () => {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "#0eaaed";
    ctx.lineWidth = 29;
    let top = 680;
    for (let k in finalRt.ma) {
        ctx.beginPath();
        ctx.moveTo(cen, top);
        ctx.lineTo(cen - finalRt.ma[k], top);
        ctx.stroke();
        top -= 30;
    }
    top = 680;
    ctx.strokeStyle = "#f754d7";
    for (let k in finalRt.fe) {
        ctx.beginPath();
        ctx.moveTo(cen, top);
        ctx.lineTo(cen + finalRt.fe[k], top);
        ctx.stroke();
        top -= 30;
    }
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#fff";
    ctx.beginPath();
    ctx.moveTo(cen, 0);
    ctx.lineTo(cen, 840);
    ctx.stroke();
    ctx.fillStyle = "#000";
    ctx.font = "20px Arial"
    ctx.strokeStyle = "#000";
    // for (let k = 0; k <= maxRt; k += 2) {
    //     ctx.fillText(`${k}%`, k * publicRt + cen - 5, 750);
    //     ctx.beginPath();
    //     ctx.moveTo(k * publicRt + cen, 720);
    //     ctx.lineTo(k * publicRt + cen, 700);
    //     ctx.stroke();
    //     console.log(k * publicRt + 305)
    // }
    // for (let k = 0; k >= -maxRt; k -= 2) {
    //     ctx.fillText(`${-k}%`, k * publicRt + cen - 5, 750);
    //     ctx.beginPath();
    //     ctx.moveTo(cen + k * publicRt, 720);
    //     ctx.lineTo(cen + k * publicRt, 700);
    //     ctx.stroke();
    //     console.log(k * publicRt + 305)
    // }
    for (let k = -maxRt; k <= maxRt; k += 2) {
        const x = cen + k * publicRt;
        ctx.fillText(`${Math.abs(k)}%`, x - 5, 750);
        ctx.beginPath();
        ctx.moveTo(x, 720);
        ctx.lineTo(x, 700);
        ctx.stroke();
    }

    ctx.beginPath();
    ctx.moveTo(cen - (publicRt * maxRt), 720);
    ctx.lineTo(cen + (publicRt * maxRt), 720);
    ctx.stroke();


    // render title
    const title = document.getElementById("title").value + "人口金字塔";
    const titleWidth = ctx.measureText(title).width;

    const titlePosX = (660 - titleWidth) / 2;
    ctx.fillText(title, titlePosX, 30);

    // render footer
    const sexR = "性比例 : " + data.sexRt;
    const sexRWidth = ctx.measureText(sexR).width;

    const sexRPosX = (660 - sexRWidth) / 2;
    ctx.fillText(sexR, sexRPosX, 800);

    const depR = "撫養比 : " + data.depRt;
    const depRWidth = ctx.measureText(depR).width;

    const depRPosX = (660 - depRWidth) / 2;
    ctx.fillText(depR, depRPosX, 840);

};



function scrollToBottom() {
    const currentPosition = window.scrollY;
    const targetPosition = document.body.scrollHeight;
    const distance = targetPosition - currentPosition;

    const duration = 1000;
    const startTime = performance.now();

    function scrollAnimation(currentTime) {
        const elapsedTime = currentTime - startTime;
        const progress = elapsedTime / duration;

        if (progress < 1) {
            const ease = easeOutQuad(progress);
            window.scrollTo(0, currentPosition + distance * ease);
            window.requestAnimationFrame(scrollAnimation);
        } else {
            window.scrollTo(0, targetPosition);
        }
    }

    window.requestAnimationFrame(scrollAnimation);
}

function easeOutQuad(t) {
    return t * (2 - t);
}

