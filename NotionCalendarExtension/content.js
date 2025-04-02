// content.js
console.log("Content script loaded!");

// This code will target the last element of the .sc-1qvs4if-4.eJedPm container and set its background color
const parentContainer = document.querySelector(".sc-1qvs4if-4.eJedPm");
if (parentContainer) {
    const targetElement = parentContainer.lastElementChild;

    if(targetElement){
        targetElement.style.backgroundColor = 'rgba(255, 50, 50, 0.1)';
        targetElement.style.transition = 'background-color 0.3s ease';
        console.log("Style applied!");
    }
}
