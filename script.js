const htmlBtn = document.getElementById('htmlBtn');
const htmlArea = document.getElementById('htmlArea');
const previewArea = document.getElementById('previewArea');

htmlBtn.addEventListener('click',() => {
    alert(htmlArea.value);
    previewArea.innerHTML = htmlArea.value;
});