var str;
var v = new Array();
var arb = new Array();
var n;
function build(nod, st, dr)
{
    if(st==dr)
    {
        arb[nod]=v[st];
        return;
    }
    let mij = Math.floor((st+dr)/2);
    build(nod*2, st, mij);
    build(nod*2+1, mij+1, dr);
    arb[nod] = Math.min(arb[nod*2], arb[nod*2+1]);
}

function query(nod,st,dr,a,b)
{
    //console.log(a + " " + b);
    if(st>=a&&dr<=b)
        return arb[nod];
    let mij = Math.floor((st+dr)/2);
    var rez=1000000000;
    if(a<=mij)
        rez = Math.min(rez,query(nod*2,st,mij,a,b));
    if(b>mij)
        rez = Math.min(rez,query(nod*2+1,mij+1,dr,a,b));
    return rez;
}

function update(nod, st, dr, poz, val) {
    if (st == dr) {
        isred[nod] = 1;
        arb[nod] = val;
        return;
    }
    let mij = Math.floor((st + dr) / 2);
    if (poz <= mij) update(2 * nod, st, mij, poz, val);
    else update(2 * nod + 1, mij + 1, dr, poz, val);
    arb[nod] = Math.min(arb[2 * nod], arb[2 * nod + 1]);
}

function makequery()
{
    str = document.getElementById("query").value;
    var st=-1;
    var dr=-1;
    var num = 0;
    for(let i in str)
    {
        if(str[i] >= '0' && str[i] <= '9')
            num = num * 10 + Math.floor(str[i]);
        else
        {
            if(st==-1)
                st=num;
            else if(dr==-1)
                dr=num;
            num=0;
        }
    }
    if(dr==-1)
        dr=num;
    num=0;
    //console.log("Asta e intrebarea dom'le: " + st + ' ' + dr);
    //console.log("Asta e intreabarea dom'le: " + str);
    var ans = query(1, 1, n, st, dr);
    document.getElementById("answer").value=ans;
    //console.log("Solutia domnule: " + ans);
}
function makev()
{
    v=[];
    arb=[];
    let num = 0;
    let last = 'a';
    v.push(0);
    for (let i in str)
    {
        last=str[i];
        if(str[i] >= '0' && str[i] <= '9')
            num = num * 10 + Math.floor(str[i]);
        else
        {
            v.push(num);
            num=0;
        }
    }
    if(last >= '0' && last <= '9')
        v.push(num);
    n=v.length;
    while(arb.length < 4*n + 5)
        arb.push(0);
    n--;
    num = 0;
    if(n<=8) build(1, 1, n);
    else
    {
        n=0;
        v.clear();
    }
}
function formdata()
{
    str = document.getElementById("nums").value;
    //console.log("Asta e sirul dom'le: " + str);
    makev();
}