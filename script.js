document.addEventListener('DOMContentLoaded', function() {
    const saveBtn = document.getElementById('saveBtn');
    const resetBtn = document.getElementById('resetBtn');
    const changeBtn = document.getElementById('changeBtn');
    const advancedBtn = document.getElementById('advancedBtn');
    const fileViewer = document.querySelector('.file-viewer');
    const advancedPanel = document.getElementById('advancedPanel');
    const imageSelector = document.querySelector('.image-selector');
    const canvas = document.getElementById('myCanvas');
    const ctx = canvas.getContext('2d');

    let currentImageName = ''; 
    let xOffset = 0;
    let yOffset = 20; 
    let rotation = 20; 
    let scale = 1;
    let hFlip = false;
    let vFlip = false;

    const defaultImage = './img/bbby.png';
    const backgroundImage = new Image();
    backgroundImage.src = defaultImage;

    backgroundImage.onload = function() {
        drawImageOnCanvas(defaultImage, null); 
    };

    changeBtn.addEventListener('click', function() {
        if (fileViewer.style.display === 'none' || fileViewer.style.display === '') {
            fileViewer.style.display = 'block';
            advancedPanel.style.display = 'none'; 
            loadImageList();
        } else {
            fileViewer.style.display = 'none';
        }
    });

    advancedBtn.addEventListener('click', function() {
        if (advancedPanel.style.display === 'none' || advancedPanel.style.display === '') {
            advancedPanel.style.display = 'block';
            fileViewer.style.display = 'none'; 
        } else {
            advancedPanel.style.display = 'none';
        }
    });

    resetBtn.addEventListener('click', function() {
        drawImageOnCanvas(defaultImage, null); 
    });

    saveBtn.addEventListener('click', function() {
        if (currentImageName) {
            const link = document.createElement('a');
            link.download = `巴巴博一-${currentImageName}.png`;
            link.href = canvas.toDataURL();
            link.click();
        } else {
            alert('请先选择一张图片');
        }
    });

    function loadImageList() {
        fetch('./gun.json')
            .then(response => response.json())
            .then(imagePaths => {
                imageSelector.innerHTML = '';
                imagePaths.forEach(imagePath => {
                    const imgElement = document.createElement('img');
                    imgElement.src = `./img/gun/${imagePath}`;
                    imgElement.alt = imagePath;

                    const fileName = imagePath.split('.')[0]; 
                    const imgContainer = document.createElement('div');
                    imgContainer.classList.add('image-container');

                    const caption = document.createElement('div');
                    caption.classList.add('image-caption');
                    caption.textContent = fileName;

                    imgElement.classList.add('image-item'); 
                    imgElement.addEventListener('click', () => {
                        imgElement.style.transform = 'rotate(35deg)';
                        setTimeout(() => {
                            imgElement.style.transform = 'none'; 
                        }, 300); 
                        currentImageName = imagePath; 
                        drawImageOnCanvas(defaultImage, `./img/gun/${imagePath}`); 
                        fileViewer.style.display = 'none';
                    });

                    imgContainer.appendChild(imgElement);
                    imgContainer.appendChild(caption);
                    imageSelector.appendChild(imgContainer);
                });
            })
            .catch(error => console.error('Error loading image list:', error));
    }

    function drawImageOnCanvas(backgroundSrc, overlaySrc) {
        const backgroundImg = new Image();
        backgroundImg.src = backgroundSrc;

        backgroundImg.onload = function() {
            canvas.width = backgroundImg.width;
            canvas.height = backgroundImg.height;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);

            if (overlaySrc) {
                const overlayImg = new Image();
                overlayImg.src = overlaySrc;
                overlayImg.onload = function() {
                    const canvasWidth = canvas.width;
                    const canvasHeight = canvas.height;
                    const imgWidth = overlayImg.width;
                    const imgHeight = overlayImg.height;

                    const scaleValue = scale;
                    const scaledWidth = imgWidth * scaleValue;
                    const scaledHeight = imgHeight * scaleValue;
                    const x = (canvasWidth - scaledWidth) / 2 + xOffset;
                    const y = (canvasHeight - scaledHeight) / 2 + yOffset; 

                    ctx.save(); 
                    ctx.translate(x + scaledWidth / 2, y + scaledHeight / 2); 
                    ctx.rotate(rotation * Math.PI / 180); 
                    if (hFlip) ctx.scale(-1, 1); 
                    if (vFlip) ctx.scale(1, -1); 
                    ctx.drawImage(overlayImg, -scaledWidth / 2, -scaledHeight / 2, scaledWidth, scaledHeight); 
                    ctx.restore(); 
                };
            }
        };
    }

    document.getElementById('xOffset').value = xOffset;
    document.getElementById('yOffset').value = yOffset;
    document.getElementById('rotation').value = rotation;

    document.getElementById('xOffset').addEventListener('input', function() {
        xOffset = parseInt(this.value, 10);
        if (currentImageName) {
            drawImageOnCanvas(defaultImage, `./img/gun/${currentImageName}`);
        }
    });

    document.getElementById('yOffset').addEventListener('input', function() {
        yOffset = parseInt(this.value, 10);
        if (currentImageName) {
            drawImageOnCanvas(defaultImage, `./img/gun/${currentImageName}`);
        }
    });

    document.getElementById('rotation').addEventListener('input', function() {
        rotation = parseFloat(this.value);
        if (currentImageName) {
            drawImageOnCanvas(defaultImage, `./img/gun/${currentImageName}`);
        }
    });

    document.getElementById('scale').addEventListener('input', function() {
        scale = parseFloat(this.value);
        if (currentImageName) {
            drawImageOnCanvas(defaultImage, `./img/gun/${currentImageName}`);
        }
    });

    document.getElementById('hFlip').addEventListener('change', function() {
        hFlip = this.checked;
        if (currentImageName) {
            drawImageOnCanvas(defaultImage, `./img/gun/${currentImageName}`);
        }
    });

    document.getElementById('vFlip').addEventListener('change', function() {
        vFlip = this.checked;
        if (currentImageName) {
            drawImageOnCanvas(defaultImage, `./img/gun/${currentImageName}`);
        }
    });

    document.getElementById('uploadImage').addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const uploadedImageSrc = e.target.result;
                drawImageOnCanvas(defaultImage, uploadedImageSrc); 
            };
            reader.readAsDataURL(file);
        }
    });
});
