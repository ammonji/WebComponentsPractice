const template = document.createElement('template');
template.innerHTML = `
    <link rel="stylesheet" href="live-editor.css">
    <style></style>
    <slot id="src" name="src"></slot>
    <div id="container">
        <iframe id="viewer" name="viewer"></iframe>
        <textarea id="editor" name="editor">
        </textarea>
    </div>
`;

class LiveEditor extends HTMLElement {
    constructor(){
        super();
        this._keyup = this._keyup.bind(this);

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this._viewer = this.shadowRoot.querySelector('iframe[name=viewer]');
        this._editor = this.shadowRoot.querySelector('textarea[name=editor]');
        this._editor.addEventListener('keyup', this._keyup);
        const slot = this.shadowRoot.querySelector('#src');
        this._editor.value = this.innerHTML;
    }

    
    static get observedAttributes() {
        return ['file'];
    }

    attributeChangedCallback(name, oldVal, newVal) {
        console.info(`AttributeChangedCallback called for | ${name} |.`)
       
        switch (name) {
            case 'file':
                fetch(newVal)
                .then(response => response.text())
                .then(text => {
                    this._editor.value = text
                    this._keyup();
                });
                break;
        }
    }

    connectedCallback(){
        this._keyup();

    }

    _keyup(){
        console.info("_keyup: editor changed");
        this._viewer.srcdoc = this._editor.value;
    }


}
window.customElements.define('live-editor', LiveEditor);
