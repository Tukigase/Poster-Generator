const htmlBtn = document.querySelector('#codeBtn');

htmlBtn.addEventListener('click', () => {
    // テキストエリアからHTMLコードを取得
    const htmlText = document.querySelector('#htmlArea').value;
    // テキストエリアからCSSコードを取得
    const cssText = document.querySelector('#cssArea').value;
    // CSSのbodyセレクタを:hostに置換
    const modifiedCssText = cssText.replace(/\bbody\b/g, ':host');

    //　テキストエリアから取得したHTMLを仮想DOMでHTMLオブジェクトに変換
    const htmlObject = new DOMParser().parseFromString(htmlText, 'text/html');
    // HTMLオブジェクトをサニタイズ
    const resultHtmlObject = sanitizeHtml(htmlObject);
    // サニタイズ済みのHTMLオブジェクトにスタイルを追加
    resultHtmlObject.body.insertAdjacentHTML('beforeend', `
        <style>
            ${modifiedCssText}
        </style>
    `);

    console.log(resultHtmlObject.body.innerHTML);

    // shadowDOMを開始
    shadowDomStarter(document.querySelector('#previewArea'), resultHtmlObject);
});

/**
 * htmlオブジェクトをサニタイズする関数
 * 
 * @param {*} htmlObject サニタイズ対象のHTMLオブジェクト
 * @returns サニタイズ済みのHTMLオブジェクト
 */
function sanitizeHtml(htmlObject) {
    // HTMLからscriptタグだけサニタイズ
    for (const scriptElement of htmlObject.querySelectorAll('script')) {
        // scriptタグを削除
        scriptElement.remove();
    }

    for (const htmlElement of htmlObject.querySelectorAll('*')) {
        //　属性がない場合は処理をスキップ
        if (htmlElement.attributes.length === 0) continue;
        // スプレッド演算子で属性を配列に格納
        const attrArray = [...htmlElement.attributes];
        // 属性をループ処理
        for (const attr of attrArray) {
            const attrName = attr.name.toLowerCase();
            // 属性名がonで始まる場合は削除
            if (attrName.startsWith('on')) {
                htmlElement.removeAttribute(attr.name);
            }
            // srcまたはhref属性の場合、不正なスキームを削除
            if (attrName === 'src' || attrName === 'href') {
                const attrValue = attr.value.toLowerCase().trim();
                // javascript:またはdata:で始まる場合は削除
                if (attrValue.startsWith('javascript:') || attrValue.startsWith('data:')) {
                    htmlElement.removeAttribute(attr.name);
                }
            }
        }
    }
    return htmlObject;
}

/**
 * shadowDOMを開始する関数
 * 
 * @param {*} hostElement shadowDOMを適用するホスト要素 
 * @param {*} htmlObject hTMLオブジェクト
 */
function shadowDomStarter(hostElement, htmlObject) {
    if (hostElement.shadowRoot == null) {
        // shadowRootが存在しない場合は新規作成
        hostElement.attachShadow({ mode: 'open' });
    } else {
        // 既に存在する場合は内容をクリア
        hostElement.shadowRoot.innerHTML = '';
    }
    hostElement.shadowRoot.innerHTML = htmlObject.body.innerHTML;
}