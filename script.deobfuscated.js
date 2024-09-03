document.addEventListener('DOMContentLoaded', () => {
    const changeColorBtn = document.getElementById('changeColorBtn');
    const body = document.body;
    
    function throwError() {
        throw new Error("This is a deliberate error");
    }

    changeColorBtn.addEventListener('click', () => {
        const randomColor = Math.floor(Math.random()*16777215).toString(16);
        body.style.backgroundColor = "#" + randomColor;
        throwError(); // This will cause an error when the button is clicked
    });
});