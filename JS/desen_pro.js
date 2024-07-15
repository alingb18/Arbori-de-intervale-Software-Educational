const WIDTH = screen.width;
const HEIGHT = screen.height;

canvas = document.getElementById("board");
canvas.width = 95 * WIDTH / 100;
canvas.height = 75 * HEIGHT / 100;
const ctx = canvas.getContext("2d");

var image = document.getElementById("img");

var found = new Array();
var x1 = 2 * WIDTH / 6;
var y1 = 11 * HEIGHT / 95;
var x2 = 98 * canvas.width / 100;
var y2 = 98 * canvas.height / 100;
var raza = 2.3 * WIDTH / 100;
var yoffset = HEIGHT / 8;
var xoffset = WIDTH / 8;
ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
ctx.fillStyle = "white";
ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
var isred = new Array();
var cnt = new Array();
let redL, redR;

var ops_node = new Array();
var cnt_lines = new Array();
var ops_line = [];
let cntt=0, cnto=0, cntoo=0;
var ops = [];

function vh(percent) {
    var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    return (percent * h) / 100;
}

function vw(percent) {
    var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    return (percent * w) / 100;
}

function vmin(percent) {
    return Math.min(vh(percent), vw(percent));
}

function vmax(percent) {
    return Math.max(vh(percent), vw(percent));
}

console.info(vh(20), Math.max(document.documentElement.clientHeight, window.innerHeight || 0));
console.info(vw(30), Math.max(document.documentElement.clientWidth, window.innerWidth || 0));
console.info(vmin(20));
console.info(vmax(20));

function circle(X, Y, R, st, dr, nod, val) {
    //console.log(X + " " + Y);
    var centerX = X;
    var centerY = Y;
    var radius = R;
    var fillStyle = "white";
    if(isred[nod]) console.log(nod);
    if (isred[nod]) fillStyle = "rgba(244,43,43,0.5)";
    ctx.beginPath();

    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);

    ctx.fillStyle = fillStyle;
    ctx.strokeStyle = "black";
    ctx.linewidth = 3;

    ctx.fill();
    ctx.stroke();
    ctx.closePath();

    let txt = "[" + st.toString() + "," + dr.toString() + "]";
    ctx.font = "1.6vh Arial";
    ctx.fillStyle = "black";
    ctx.fillText(txt, X - R / 3, Y - R / 3);

    txt = val.toString();
    ctx.fillText(txt, X - 6 - 4 * (txt.length - 1), Y + 11);

}

function dist(xa, ya, xb, yb) {
    return (xa - xb) * (xa - xb) + (ya - yb) * (ya - yb);
}
var eps = 0.001;
function line(xs, ys, xj, yj) {
    var a = yj - ys;
    var b = xs - xj;
    var c = -a * xs - b * ys;
    var xa = xs, ya = ys;
    var xb = xj, yb = yj;
    while (dist(xa, ya, xs, ys) < raza * raza) {
        ya += eps;
        xa = (-c - b * ya) / a;
    }

    while (dist(xb, yb, xj, yj) < raza * raza) {
        yb -= eps;
        xb = (-c - b * yb) / a;
    }

    var startPointX = xa;
    var startPointY = ya;
    var endPointX = xb;
    var endPointY = yb;

    ctx.beginPath();

    ctx.moveTo(startPointX, startPointY);

    ctx.lineTo(endPointX, endPointY);

    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.closePath();
}

function wait(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

var S;
var v = new Array();
var arb = new Array();
var n, pos_line=1;
function plsclear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
    ctx.fillStyle = "white";
    ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
}
function build(nod, st, dr, x, y, dist) {
    if (st == dr) {
        arb[nod] = v[st];
        //3e.log(nod);
        circle(x, y, raza, st, dr, nod, arb[nod]);
        return;
    }
    let mij = Math.floor((st + dr) / 2);
    build(nod * 2, st, mij, x - dist, y + yoffset, dist / 2);
    build(nod * 2 + 1, mij + 1, dr, x + dist, y + yoffset, dist / 2);
    arb[nod] = Math.min(arb[nod * 2], arb[nod * 2 + 1]);
    line(x, y, x - dist, y + yoffset);
    line(x, y, x + dist, y + yoffset);
    //console.log(nod);
    circle(x, y, raza, st, dr, nod, arb[nod]);
}

function update(nod, st, dr, poz, val) 
{
    ops_node[++cntt]=nod;
    cnt_lines[cntt]=0;
    ops_line[cntt]=[];
    ops_line[cntt][++cnt_lines[cntt]]=1;
    ops_line[cntt][++cnt_lines[cntt]]=2;
    ops_line[cntt][++cnt_lines[cntt]]=3;
    if (st == dr) 
    {
        ops_line[cntt][++cnt_lines[cntt]] = 4;
        ops_line[cntt][++cnt_lines[cntt]] = 5;
        ops_line[cntt][++cnt_lines[cntt]] = 6;
        ops_line[cntt][++cnt_lines[cntt]] = 11;
        v[st] = val;
        return;
    }
    ops_line[cntt][++cnt_lines[cntt]] = 8;
    let mij = Math.floor((st + dr) / 2);
    ops_line[cntt][++cnt_lines[cntt]] = 9;
    if (poz <= mij) 
    {
        update(2 * nod, st, mij, poz, val);
    }
    else 
    {
        ops_line[cntt][++cnt_lines[cntt]] = 10;
        update(2 * nod + 1, mij + 1, dr, poz, val);
    }
    arb[nod] = Math.min(arb[2 * nod], arb[2 * nod + 1]);
}

function query(nod, st, dr, a, b) {
    if (st >= a && dr <= b) {
        isred[nod] = 1;
        return arb[nod];
    }
    let mij = Math.floor((st + dr) / 2);
    var rez = 1000000000;
    if (a <= mij)
        rez = Math.min(rez, query(nod * 2, st, mij, a, b));
    if (b > mij)
        rez = Math.min(rez, query(nod * 2 + 1, mij + 1, dr, a, b));
    return rez;
}

async function makeupdate() {
    if (n > 8) return;
    for (let i = 0; i <= 40; i++) {
        isred[i] = 0;
        cnt[i] = 0;
    }
    redL = 0;
    redR = 0;
    S = document.getElementById("upd").value;
    var st = -1;
    var dr = -1;
    var num = 0;
    for (let i in S) {
        if (S[i] >= '0' && S[i] <= '9')
            num = num * 10 + Math.floor(S[i]);
        else if (S[i] == ' ') continue;
        else {
            if (st == -1)
                st = num;
            else if (dr == -1)
                dr = num;
            num = 0;
        }
    }
    if (dr == -1)
        dr = num;
    //console.log(st + " " + dr);
    num = 0;
    update(1, 1, n, st, dr);
    plsclear();
    for(let i=1; i<=cntt; i++)
    {
        console.log(ops_node[i]);
        let nd=ops_node[i];
        ++cnto;
        ops[cnto]=[];
        ops[cnto][1]=1;
        ops[cnto][2]=nd;
        for(let j=1; j<=cnt_lines[i]; j++)
        {
            ++cnto;
            ops[cnto] = [];
            ops[cnto][1] = 2;
            ops[cnto][2] = ops_line[i][j];
        } 
        if(i<cntt) 
        {
            ++cnto;
            ops[cnto]=[];
            ops[cnto][1] = 3;
            ops[cnto][2]=0;
        }
    }
    makemove();
}

async function makequery() {
    if (n > 8) return;
    for (let i = 0; i <= 40; i++) {
        isred[i] = 0;
        cnt[i] = 0;
    }
    redL = 0;
    redR = 0;
    S = document.getElementById("query").value;
    var st = -1;
    var dr = -1;
    var num = 0;
    for (let i in S) {
        if (S[i] >= '0' && S[i] <= '9')
            num = num * 10 + Math.floor(S[i]);
        else if (S[i] == ' ') continue;
        else {
            if (st == -1)
                st = num;
            else if (dr == -1)
                dr = num;
            num = 0;
        }
    }
    if (dr == -1)
        dr = num;
    //console.log(st + " " + dr);
    num = 0;
    var ans = query(1, 1, n, st, dr);
    plsclear();
    for (let i = 15; i >= 1; i--)
        cnt[i] = cnt[i * 2] + cnt[i * 2 + 1] + isred[i];
    redL = 1;
    redR = 1;
    plsclear();
    build(1, 1, n, (x1 + x2) / 2, y1 + 3 * raza, xoffset);

    await wait(800);
    redL = 2;
    redR = 3;
    plsclear();
    build(1, 1, n, (x1 + x2) / 2, y1 + 3 * raza, xoffset);

    await wait(800);
    redL = 4;
    redR = 7;
    plsclear();
    build(1, 1, n, (x1 + x2) / 2, y1 + 3 * raza, xoffset);

    await wait(800);
    redL = 8;
    redR = 15;
    plsclear();
    build(1, 1, n, (x1 + x2) / 2, y1 + 3 * raza, xoffset);
    document.getElementById("answer").value = ans;
}
function makev() {
    for (let i = 0; i <= 40; i++) {
        isred[i] = 0;
        cnt[i] = 0;
    }
    redL = 0;
    redR = 0;
    v = [];
    arb = [];
    let num = -1;
    let last = 'a';
    v.push(0);
    for (let i in S) {
        last = S[i];
        if (S[i] >= '0' && S[i] <= '9') {
            if (num == -1) num = 0;
            num = num * 10 + Math.floor(S[i]);
        }
        else if (S[i] == ' ') continue;
        else {
            if (num != -1) v.push(num);
            num = -1;
        }
    }
    if (last >= '0' && last <= '9')
        v.push(num);
    n = v.length;
    while (arb.length < 4 * n + 5)
        arb.push(0);
    n--;
    num = 0;
    if (n <= 8) build(1, 1, n, (x1 + x2) / 2, y1 + 3 * raza, xoffset);
}
function formdata() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
    ctx.fillStyle = "white";
    ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
    S = document.getElementById("nums").value;
    if (isred.length == 0) {
        for (let i = 0; i <= 40; i++) {
            isred.push(0);
            cnt.push(0);
        }
    }
    else {
        for (let i = 0; i <= 30; i++) {
            cnt[i] = 0;
            isred[i] = 0;
        }
    }
    if (found.length == 0) {
        for (let i = 0; i <= 30; i++)
            found.push(0);
    }
    else {
        for (let i = 1; i <= 30; i++)
            if (found[i]) {
                found[i] = 0;
                let nod = i;
                let mydiv = "div";
                mydiv += nod.toString();
                let element = document.getElementById(mydiv);

                element.removeChild(element.firstElementChild);
                element.removeChild(element.firstElementChild);
            }
    }
    makev();
}

async function move_line(where)
{
    image.src ="../PICTURES/linia"+where+".png";
    await wait(8000);
}

async function make_node(val, nod)
{
    if(val==3) plsclear();
    else
    {
        isred[nod] = 1;
        build(1, 1, n, (x1 + x2) / 2, y1 + 3 * raza, xoffset);
        isred[nod] = 0;
    }
    makemove();
}

async function makemove()
{
    ++cntoo;
    if(cntoo>cnto) return;
    //1 e pt nod si 3 e pt sters
    if(ops[cntoo][1]==1 || ops[cntoo][1]==3) make_node(ops[cntoo][1], ops[cntoo][2]);
    else move_line(ops[cntoo][2]);
    await wait(800);
}
