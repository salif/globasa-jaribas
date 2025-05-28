const fs = require("fs")
const eng = JSON.parse(fs.readFileSync("/tmp/standard-eng.json", "utf-8"))
const spa = JSON.parse(fs.readFileSync("/tmp/standard-spa.json", "utf-8"))
const bul = JSON.parse(fs.readFileSync("/tmp/standard-bul.json", "utf-8"))
const dict = { glb: { eng: {}, spa: {}, bul: {} }, eng: { glb: {} }, spa: { glb: {} }, bul: { glb: {} } }
const f = (word, lang) => {
	if (word.term.startsWith("-")) { return }
	if (word.term.startsWith("(fe) ")) { word.term = word.term.substring(5) }
	if (!dict.glb[lang].hasOwnProperty(word.term)) {
		dict.glb[lang][word.term] = {}
	}
	dict.glb[lang][word.term] = word.trans[lang].flat(1)
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
Object.values(eng).forEach(e => { f(e, "eng") })
Object.values(spa).forEach(e => { f(e, "spa") })
Object.values(bul).forEach(e => { f(e, "bul") })
fs.writeFileSync("dict.js", "var dict=" + JSON.stringify(dict))
