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

    let currentImageName = ''; // 保存当前选择的图片名
    let xOffset = 0;
    let yOffset = 20; // 默认 Y 偏移量
    let rotation = 20; // 默认旋转角度
    let scale = 1;
    let hFlip = false;
    let vFlip = false;

    // 默认背景图片
    const defaultImage = './img/bbby.png';
    const backgroundImage = new Image();
    backgroundImage.src = defaultImage;

    backgroundImage.onload = function() {
        drawImageOnCanvas(defaultImage, null); // 默认背景图
    };

    // 显示图片选择器
    changeBtn.addEventListener('click', function() {
        if (fileViewer.style.display === 'none' || fileViewer.style.display === '') {
            fileViewer.style.display = 'block';
            advancedPanel.style.display = 'none'; // 隐藏高级面板
            loadImageList();
        } else {
            fileViewer.style.display = 'none';
        }
    });

    // 显示高级面板
    advancedBtn.addEventListener('click', function() {
        if (advancedPanel.style.display === 'none' || advancedPanel.style.display === '') {
            advancedPanel.style.display = 'block';
            fileViewer.style.display = 'none'; // 隐藏图片选择器
        } else {
            advancedPanel.style.display = 'none';
        }
    });

    // 清空 canvas
    resetBtn.addEventListener('click', function() {
        drawImageOnCanvas(defaultImage, null); // 重新绘制默认背景图
    });

    // 保存 canvas 图片
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

    // 从 JSON 文件加载图片列表并显示
    function loadImageList() {
        fetch('./gun.json')
            .then(response => response.json())
            .then(imagePaths => {
                imageSelector.innerHTML = '';
                imagePaths.forEach(imagePath => {
                    const imgElement = document.createElement('img');
                    imgElement.src = `./img/gun/${imagePath}`;
                    imgElement.alt = imagePath;

                    const fileName = imagePath.split('.')[0]; // 去掉文件扩展名

                    const imgContainer = document.createElement('div');
                    imgContainer.classList.add('image-container');

                    const caption = document.createElement('div');
                    caption.classList.add('image-caption');
                    caption.textContent = fileName;

                    imgElement.classList.add('image-item'); // 添加 class 以便旋转
                    imgElement.addEventListener('click', () => {
                        // 添加旋转效果并将图像渲染到 canvas
                        imgElement.style.transform = 'rotate(35deg)';
                        setTimeout(() => {
                            imgElement.style.transform = 'none'; // 恢复原状以避免影响其他图像
                        }, 300); // 旋转持续时间后恢复
                        currentImageName = imagePath; // 保存当前图片名
                        drawImageOnCanvas(defaultImage, `./img/gun/${imagePath}`); // 保留背景图，绘制选择的图
                        fileViewer.style.display = 'none';
                    });

                    imgContainer.appendChild(imgElement);
                    imgContainer.appendChild(caption);
                    imageSelector.appendChild(imgContainer);
                });
            })
            .catch(error => console.error('Error loading image list:', error));
    }

    // 在 canvas 上绘制图片
    function drawImageOnCanvas(backgroundSrc, overlaySrc) {
        const backgroundImg = new Image();
        backgroundImg.src = backgroundSrc;

        backgroundImg.onload = function() {
            // 设置 canvas 尺寸为背景图尺寸
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
                    const y = (canvasHeight - scaledHeight) / 2 + yOffset; // 使用偏移量

                    ctx.save(); // 保存当前状态
                    ctx.translate(x + scaledWidth / 2, y + scaledHeight / 2); // 移动到图片中心
                    ctx.rotate(rotation * Math.PI / 180); // 旋转
                    if (hFlip) ctx.scale(-1, 1); // 水平翻转
                    if (vFlip) ctx.scale(1, -1); // 垂直翻转
                    ctx.drawImage(overlayImg, -scaledWidth / 2, -scaledHeight / 2, scaledWidth, scaledHeight); // 绘制图片
                    ctx.restore(); // 恢复到原来的状态
                };
            }
        };
    }

    // 初始化控件值
    document.getElementById('xOffset').value = xOffset;
    document.getElementById('yOffset').value = yOffset;
    document.getElementById('rotation').value = rotation;

    // 调整偏移量
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

    // 调整旋转角度
    document.getElementById('rotation').addEventListener('input', function() {
        rotation = parseFloat(this.value);
        if (currentImageName) {
            drawImageOnCanvas(defaultImage, `./img/gun/${currentImageName}`);
        }
    });

    // 调整缩放
    document.getElementById('scale').addEventListener('input', function() {
        scale = parseFloat(this.value);
        if (currentImageName) {
            drawImageOnCanvas(defaultImage, `./img/gun/${currentImageName}`);
        }
    });

    // 水平翻转
    document.getElementById('hFlip').addEventListener('change', function() {
        hFlip = this.checked;
        if (currentImageName) {
            drawImageOnCanvas(defaultImage, `./img/gun/${currentImageName}`);
        }
    });

    // 垂直翻转
    document.getElementById('vFlip').addEventListener('change', function() {
        vFlip = this.checked;
        if (currentImageName) {
            drawImageOnCanvas(defaultImage, `./img/gun/${currentImageName}`);
        }
    });

    // 处理图片上传
    document.getElementById('uploadImage').addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const uploadedImageSrc = e.target.result;
                drawImageOnCanvas(defaultImage, uploadedImageSrc); // 用上传的图片替换当前图片
            };
            reader.readAsDataURL(file);
        }
    });
});
