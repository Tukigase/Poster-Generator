const htmlBtn = document.querySelector('#htmlBtn');

htmlBtn.addEventListener('click',() => {
    // テキストエリアからHTMLコードを取得
    const htmlText = document.querySelector('#htmlArea').value;
    //　テキストエリアから取得したHTMLを仮想DOMでHTMLオブジェクトに変換
    const htmlObject = new DOMParser().parseFromString(htmlText, 'text/html');

    // HTMLからscriptタグだけサニタイズ
    for (const scriptElement of htmlObject.querySelectorAll('script')){
        scriptElement.remove();
    }

    for (const htmlElement of htmlObject.querySelectorAll('*')) {
        //　属性がない場合は処理をスキップ
        if(htmlElement.attributes.length === 0) continue;
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

    document.querySelector('#previewArea').innerHTML = htmlObject.body.innerHTML;
});