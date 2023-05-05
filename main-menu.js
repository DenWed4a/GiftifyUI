const mainMenu = document.querySelector('.main-menu');
const categoryContainers = mainMenu.querySelectorAll('.category-container');
categoryContainers.forEach(element => {
    element.addEventListener('mouseenter', function(e){
        e.target.lastElementChild.style.display = 'block';
        e.target.firstElementChild.style.transition = 'opacity 0.7s';
        e.target.firstElementChild.style.opacity = '0.3';
    })
})

categoryContainers.forEach(element => {
    element.addEventListener('mouseleave', function(e){
        e.target.lastElementChild.style.display = 'none';
        e.target.firstElementChild.style.opacity = '1';
        
    })
})