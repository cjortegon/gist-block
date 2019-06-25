document.write('<link rel="stylesheet" href="https://raw.githubusercontent.com/cjortegon/gist-block/master/src/css/style.css"/>');
document.write('<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Inconsolata" />');
function gistThis(path) {
    let id = guidGenerator();
    document.write(`<div class="gist-block">
        <blockquote id="${id}">
        </blockquote>
    </div>`);
    setupGist(id, path);
}
function guidGenerator() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}
function setupGist(id, path) {
    let element = document.getElementById(id);
    fetch(path)
    .then((response) => response.text())
    .then((source) => {
        let pre = document.createElement('pre');
        let code = document.createElement('code');
        code.innerHTML = setCodeStyle(source);
        pre.appendChild(code);
        element.appendChild(pre);
    })
    .catch((error) => {
        console.warn(error);
    });
}
function setCodeStyle(text) {
    text = text.replaceAll('<', '&#60;');
    text = text.replaceAll('>', '&#62;');
    let strings = /(["'])(?:(?=(\\?))\2.)*?\1/g;
    match(strings, text).forEach(w => {
        text = text.replaceAll(w, `<span kkkkk="code-string">${w}</span>`);
    })
    let properties = /(this.*?\s|self.*?\s)/g;
    match(properties, text).forEach(w => {
        let parts = w.split(/[\(\)\.]+/);
        let s = parts[1];
        let i = text.indexOf(w);
        if(i >= 0) {
            let first = i+parts[0].length+1;
            let last = first+s.length;
            text = text.substring(0, first)+`<span kkkkk="code-property">${s}</span>`+text.substring(last, text.length);
        }
    })
    let reserved = /\bthis\b|\bself\b|\breturn\b|\bvoid\b|\bfinal\b|\bvar\b|\blet\b|\bimport\b|\bclass|\b if|\belse|\b is |\b in |\b new |\b typeof |\b instanceof |\bwhile|\b for/g;
    match(reserved, text).forEach(w => {
        text = text.replaceAll(w, `<span kkkkk="code-reserved-word">${w}</span>`);
    })
    text = text.replaceAll('=&#62;', `<span kkkkk="code-reserved-operator">=&#62;</span>`);
    text = text.replaceAll('===', `<span kkkkk="code-reserved-operator">===</span>`);
    text = text.replaceAll('==', `<span kkkkk="code-reserved-operator">==</span>`);
    let annotations = /^@+[a-z|A-Z]*/gm;
    match(annotations, text).forEach(w => {
        text = text.replaceAll(w, `<span kkkkk="code-annotation">${w}</span>`);
    })
    return text.replaceAll('kkkkk=', 'class=');
}
function match(regex, text) {
    let match = text.match(regex);
    return match == null ? [] : match;
}
String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};