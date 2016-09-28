/* 
    pole, v kt. je ulozeny DOM
    tvaru [[a,b,c],[],[],[],...], kde
    a - html element
    b - hlbka jeho zanorenia v DOM strome
    c - index identifikujuci otvaraci a k nemu prisluchajuci uzatvaraci tag
*/
var html = [];
/* hlbka DOM stromu*/
var hlbka = 0;

(function ()
{
    window.onload = function () {
        vytvor_DOM_obl();
        vytvor_dom2();
        vytvor_strom(document.documentElement, 0);
        spoj_tagy();
        klikanie_v_html();
        kontrola_id_class();
    }
})();

/* vytvori oblast do ktorej sa napise DOM */
function vytvor_DOM_obl() {
    var dom_inspektor = document.createElement("div");

    dom_inspektor.setAttribute("id", "dom_inspektor");
    dom_inspektor.style.position = "fixed";
    dom_inspektor.style.top = "0";
    dom_inspektor.style.right = "0";
    dom_inspektor.style.zIndex = "100";
    dom_inspektor.style.opacity = "0.85";
    dom_inspektor.style.height = "100%";
    dom_inspektor.style.width = "29%";
    dom_inspektor.style.overflowY = "scroll";
    
    /***********************************************************************************************/
    /* !!! CAST FORMUJUCA VZHLAD OBLASTI DOM STROMU !!! */
    /* script sam zmensi sirku stranky tak, aby ho DOM strom neprekryval */
    /* pre pripad potreby sa ale da zmenit zakladny vzhlad tu: */
    dom_inspektor.style.backgroundColor = "#FFFF5C";        // farba pozadia
    dom_inspektor.style.fontFamily = "arial,sans-serif";    // typ pisma, rodina(serif/sans-serif)
    dom_inspektor.style.fontSize = "10px";                  // velkost pisma
    dom_inspektor.style.color = "#000000";                  // farba pisma
    dom_inspektor.style.fontWeight = "bold";                // "hrubka" pisma - nastave na "tucne"
    /* !!! KONIEC CASTI OHLADOM VZHLADU DOM STROMU !!! */
    /***********************************************************************************************/

    document.body.style.width = "70%";

    var dom_1 = document.createElement("div");
    dom_1.style.margin = "10px";
    var dom_2 = document.createElement("div");
    dom_2.style.margin = "10px";

    dom_inspektor.appendChild(dom_2);
    dom_inspektor.appendChild(dom_1);

    document.body.appendChild(dom_inspektor);
}

/* 
    funkcia na kontrolu zmeny id a class
    po dvojklku na element vypise alert so spravou v tvare:
    TAG---ID---CLASS
*/
function kontrola_id_class()
{
    document.addEventListener('dblclick', function (e) {
        e = e || window.event;
        var target = e.target || e.srcElement;
        alert(target.tagName + "---" + target.getAttribute("id") + "---" + target.getAttribute("class"));
    }, false);
}

/*
    funkcia na vybrany element prida eventListener a oznaci dany tag v DOM
*/
function getSelectedElement(e) {
    e = e || window.event;
    var target = e.target || e.srcElement;
    var pozicia = najdi_tag(target);
    var idx_odstavcov = najdi_par(html[pozicia]);
    var dom = document.getElementById("dom_inspektor");
    var x = dom.getElementsByTagName("p");
    var tlacidlo = document.getElementById("potvrdzovacie_tlacidlo");
    tlacidlo.onclick = (function (target) {
        return function (event) {
            var id = document.getElementById("id_elementu");
            var tr = document.getElementById("id_triedy");
                
            if (id.value)
                pridaj_attr(id, "id", target);

            if (tr.value)
                pridaj_attr(tr, "class", target);
        };
    })(target);

    var i;
    for (i = 0; i < x.length; i++)
    {
        if(i == idx_odstavcov[0] || i == idx_odstavcov[1])
        {
            x[idx_odstavcov[0]].style.border = "1px solid red";
            x[idx_odstavcov[1]].style.border = "1px solid red";
        }
        else
            x[i].style.border = "none";
    }
}

/* zachytava kliknutie na element v html stranke */
function klikanie_v_html()
{
    document.addEventListener('click', getSelectedElement, false); 
}

/* vytvori dynamicky cast DOM, kde sa da menit ID a CLASS*/
function vytvor_dom2()
{
    var dom_inspektor = document.getElementById("dom_inspektor");
    var ciel = dom_inspektor.firstElementChild;

    ciel.style.borderBottom = "2px solid #000000";

    var tlacidlo = document.createElement("button");
    tlacidlo.setAttribute("id", "potvrdzovacie_tlacidlo");
    var popis_tlacidla = document.createTextNode("ZMEN");
    tlacidlo.appendChild(popis_tlacidla);
    tlacidlo.style.cssFloat = "right";
    tlacidlo.style.marginTop = "10px";
    ciel.appendChild(tlacidlo);

    var id_label = document.createTextNode("id:");
    ciel.appendChild(id_label);

    var br = document.createElement("br");
    ciel.appendChild(br);

    var id = document.createElement("input");
    id.setAttribute("id", "id_elementu");
    id.setAttribute("type", "text");
    ciel.appendChild(id);

    var br2 = document.createElement("br");
    ciel.appendChild(br2);

    var trieda_label = document.createTextNode("class:");
    ciel.appendChild(trieda_label);

    var br3 = document.createElement("br");
    ciel.appendChild(br3);

    var trieda = document.createElement("input");
    trieda.setAttribute("id", "id_triedy");
    trieda.setAttribute("type", "text");
    trieda.style.marginBottom = "10px";
    ciel.appendChild(trieda);
}

/* vrati poziciu daneho elementu v poli, v ktorom su ulozene elementy html stranky*/
function najdi_tag(elem)
{
    var i;
    for (i = 0; i < html.length; i++)
        if (html[i][0] === elem)
            return i;
}

/* najde uzatvaraci tag k otvaraciemu a prida im rovnaky index (tretia zlozka pola pola html)*/
function spoj_tagy()
{
    var zhoda = 0;
    var i, j, p;
    for (i = 0; i < hlbka; i++)
    {
        for (j = 0; j < html.length; j++)
        {
            if (html[j][1] == i)
            {
                html[j].push(orez_cislo(zhoda));
                zhoda++;
            }
        }
    }
}

/* nieco ako trunc */
function orez_cislo(c)
{
    if (c % 2 == 0)
        return c / 2;
    else
        return (c / 2) - 0.5;
}

/* rekurzivna funkcia na vytvorenie prejdenie a ulozenie DOM */
function vytvor_strom(element, zanorenie)
{
    var dom_inspektor = document.getElementById("dom_inspektor");
    
    if (element && element !== dom_inspektor && element !== document.getElementById("dom_inspektor_script"))
    {
        var meno = element.tagName;
        if (meno)
        {
            meno = meno.toLowerCase();
            dopis(dom_inspektor.lastElementChild, meno, "", zanorenie, html.length);
            html[html.length] = [element, zanorenie];
           
        }

        var i = 0;
        var akt_child = element.childNodes[i];
        while (akt_child)
        {
            vytvor_strom(akt_child, zanorenie + 1)
            i++;
            akt_child = element.childNodes[i];
            if (hlbka <= zanorenie)
                hlbka++;
        }
        if (meno)
        {
            dopis(dom_inspektor.lastElementChild, meno, "/", zanorenie, html.length);
            html[html.length] = [element, zanorenie];
        }
    }
}
/* 
    dopisuje do DOM oblasti tagy 
    zaroven tagom (su to paragraphy) priraduje listenery
*/
function dopis(div, tag, lomitko, pocet_medzier, idx_el) {

    var tlac = document.getElementById("potvrdzovacie_tlacidlo");

    var text = "";
    var i;
    text += "<" + lomitko + tag + ">";
    var text_node = document.createTextNode(text);
    var p = document.createElement("p");
    p.style.paddingLeft = (20 * pocet_medzier) + "px";
    p.addEventListener("mouseover", function () {
        p.style.backgroundColor = "#AAAAFF";
        html[idx_el][0].style.border = "2px solid #AAAAFF";
    });
    p.addEventListener("mouseout", function () {
        p.style.backgroundColor = "#FFFF5C";
        html[idx_el][0].style.border = "none";
    });

    p.addEventListener("click", function () {
        oznac_p(p);
        tlac.onclick = (function (target) {
            return function (event) {
                var id = document.getElementById("id_elementu");
                var tr = document.getElementById("id_triedy");

                if (id.value)
                    pridaj_attr(id, "id", target);

                if (tr.value)
                    pridaj_attr(tr, "class", target);
            };
        })(html[idx_el][0]);
    });

    p.appendChild(text_node);
    div.appendChild(p);
}

/* vrati indexy otvaracie a uzatvaracieho tagu daneho elementu */
function najdi_par(elem)
{
    var i;
    var par = [];
    for (i = 0; i < html.length; i++)
    {
        if (html[i][2] == elem[2])
            par.push(i);
    }
    return par;
}

/* prida border pre oznaceny paragraph*/
function oznac_p(p)
{
    var dom = document.getElementById("dom_inspektor");
    var zoznam = dom.getElementsByTagName("p");
    var i;
    for (i = 0; i < zoznam.length; i++)
        zoznam[i].style.border = "none";
    p.style.border = "1px solid #FF0000";
}

/* nastavi dany atribut pre prvok */
function pridaj_attr(prvok, meno, cielovy_prvok)
{
    var hodnota = '"' + prvok.value + '"';
    cielovy_prvok.setAttribute(meno, hodnota);
    prvok.value = "";
}