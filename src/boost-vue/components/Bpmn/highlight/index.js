import hljs from 'highlight.js';
// import 'highlight.js/styles/atom-one-dark-reasonable.css';
import 'highlight.js/styles/atom-one-dark.css';

function hasValueOrEmptyAttribute(value) {
    return Boolean(value || value === '');
}
function escapeHTML(value) {
    return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;');
}
var highlightjs = {
    props: { language: null, code: null, autodetect: null },
    data() {
        return { detectedLanguage: '', unknownLanguage: false };
    },
    computed: {
        className() {
            if (this.unknownLanguage) return '';

            return 'hljs ' + this.detectedLanguage;
        },
        highlighted() {
            console.log('languagexml', this.language);
            console.log('language', hljs.getLanguage(this.language));
            // no idea what language to use, return raw code
            if (!this.autoDetect && !hljs.getLanguage(this.language)) {
                console.warn(`The language "${this.language}" you specified could not be found.`);
                this.unknownLanguage = true;
                return escapeHTML(this.code);
            }

            let result = {};
            if (this.autoDetect) {
                result = hljs.highlightAuto(this.code);
                this.detectedLanguage = result.language;
            } else {
                result = hljs.highlight(this.code, { language: this.language, ignoreIllegals: this.ignoreIllegals });
                this.detectedLanguage = this.language;
            }
            return result.value;
        },
        autoDetect() {
            return !this.language || hasValueOrEmptyAttribute(this.autodetect);
        },
        ignoreIllegals() {
            return true;
        }
    },
    // this avoids needing to use a whole Vue compilation pipeline just
    // to build Highlight.js
    render(createElement) {
        return createElement('pre', {}, [
            createElement('code', {
                class: this.className,
                domProps: { innerHTML: this.highlighted }
            })
        ]);
    }
};
export { highlightjs };
