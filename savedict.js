const fs = require("fs")
const dict = { glb: { eng: {}, spa: {}, tur: {}, bul: {}, epo: {} }, eng: { glb: {} }, spa: { glb: {} }, tur: { glb: {} }, bul: { glb: {} }, epo: { glb: {} } }
const f = (word, lang, rev) => {
	if (word.term.startsWith("-")) { return }
	if (word.term.startsWith("(fe) ")) { word.term = word.term.substring(5) }
	if (!dict.glb[lang].hasOwnProperty(word.term)) {
		dict.glb[lang][word.term] = {}
	}
	dict.glb[lang][word.term] = word.trans[lang].flat(1)
	if (!rev) { return }
	word.trans[lang].forEach(meanings => {
		meanings.forEach(meaning => {
			if (meaning.startsWith("-")) { return }
			if (meaning.indexOf(": ") > -1) {
				meaning = meaning.substring(meaning.indexOf(": ") + 2)
			}
			if (meaning.indexOf("(") > -1 || meaning.indexOf(")") > -1) {
				if (meaning.indexOf("(") > 0 && meaning.indexOf(")") < meaning.length - 1) {
					meaning = meaning.replace(/\s*\(.*?\)/g, "")
				} else {
					meaning = meaning.replace(/\s*\(.*?\)\s*/g, "")
				}
			}
			if (meaning.indexOf("<em>") > -1 || meaning.indexOf("</em>") > -1) {
				meaning = meaning.replaceAll("<em>", "").replaceAll("</em>", "")
			}
			if (meaning.length === 0) { return }
			if (!dict[lang].glb.hasOwnProperty(meaning)) {
				dict[lang].glb[meaning] = []
			}
			if (dict[lang].glb[meaning].indexOf(word.term) === -1) {
				dict[lang].glb[meaning].push(word.term)
			}
		})
	})
}
Object.values(JSON.parse(fs.readFileSync("/tmp/standard-eng.json", "utf-8"))).forEach(e => { f(e, "eng", true) })
Object.values(JSON.parse(fs.readFileSync("/tmp/standard-spa.json", "utf-8"))).forEach(e => { f(e, "spa", true) })
Object.values(JSON.parse(fs.readFileSync("/tmp/standard-tur.json", "utf-8"))).forEach(e => { f(e, "tur", true) })
Object.values(JSON.parse(fs.readFileSync("/tmp/standard-bul.json", "utf-8"))).forEach(e => { f(e, "bul", true) })
Object.values(JSON.parse(fs.readFileSync("/tmp/standard-epo.json", "utf-8"))).forEach(e => { f(e, "epo", true) })
Object.entries(JSON.parse(fs.readFileSync("del.json", "utf-8"))).forEach(en => {
	Object.entries(en[1]).forEach(e => {
		const o = { term: e[0], trans: {} }
		o.trans[en[0]] = e[1]
		f(o, en[0], false)
	})
})
fs.writeFileSync("dict.min.js", "var dict=" + JSON.stringify(dict))
