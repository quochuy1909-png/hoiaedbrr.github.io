let numbers = [1, 2, 3, 4, 5, 6, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
let scratchCount = 0;
let isScratching = false;

// Hàm cập nhật tiêu đề
function updateTitle() {
    const titleElement = document.getElementById('title');
    titleElement.textContent = `NGƯỜI TRÚNG QUÀ SỐ ${scratchCount + 1} LÀ`;
}

// Hàm tạo hiệu ứng pháo giấy
function createConfetti() {
    const confettiContainer = document.getElementById('confetti-container');
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.animationDuration = Math.random() * 3 + 2 + 's';
        confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
        confettiContainer.appendChild(confetti);
    }
}

// Hàm xóa pháo giấy
function clearConfetti() {
    const confettiContainer = document.getElementById('confetti-container');
    confettiContainer.innerHTML = '';
}

// Hàm tạo lớp cào
function setupScratchLayer() {
    const canvas = document.getElementById('scratch-layer');
    const ctx = canvas.getContext('2d');
    const cardNumberElement = document.getElementById('card-number');

    // Đặt kích thước canvas
    canvas.width = 200;
    canvas.height = 200;

    // Vẽ lớp bạc phủ
    ctx.fillStyle = 'silver';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    canvas.addEventListener('mousedown', startScratch);
    canvas.addEventListener('touchstart', startScratch);

    canvas.addEventListener('mouseup', stopScratch);
    canvas.addEventListener('touchend', stopScratch);

    canvas.addEventListener('mousemove', scratch);
    canvas.addEventListener('touchmove', scratch);

    function startScratch(e) {
        isScratching = true;
        cardNumberElement.style.display = 'block';  // Hiển thị số khi bắt đầu cào
    }

    function stopScratch() {
        isScratching = false;
        if (isCanvasCleared()) {
            document.getElementById('next-card-btn').disabled = false;  // Mở khóa nút "Thẻ kế tiếp"
        }
    }

    function scratch(e) {
        if (!isScratching) return;

        const rect = canvas.getBoundingClientRect();
        const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
        const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
        
        ctx.globalCompositeOperation = 'destination-out';  // Cho phép xóa lớp phủ
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2, false);
        ctx.fill();
    }

    function isCanvasCleared() {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        let cleared = 0;
        for (let i = 3; i < pixels.length; i += 4) {
            if (pixels[i] === 0) cleared++;
        }
        return cleared > pixels.length * 0.5;  // Kiểm tra 50% lớp phủ đã bị xóa
    }
}

// Hàm xử lý cào thẻ
function scratchCard() {
    const cardNumberElement = document.getElementById('card-number');

    // Nếu đây là lần cào thứ 7, chọn số 7
    if (scratchCount === 6) {
        cardNumberElement.textContent = 7;
    } else {
        const randomIndex = Math.floor(Math.random() * numbers.length);
        const scratchedNumber = numbers[randomIndex];
        cardNumberElement.textContent = scratchedNumber;
        numbers.splice(randomIndex, 1);
    }

    createConfetti();
    scratchCount++;

    if (scratchCount >= 7) {
        document.getElementById('next-card-btn').disabled = true;
    }
}

// Lắng nghe sự kiện nhấn nút "Thẻ kế tiếp"
document.getElementById('next-card-btn').addEventListener('click', () => {
    clearConfetti();
    document.getElementById('card-number').style.display = 'none';
    document.getElementById('next-card-btn').disabled = true;
    setupScratchLayer();  // Tạo lại lớp cào
    scratchCard();
    updateTitle();
});

// Khởi tạo lớp cào ngay từ đầu
setupScratchLayer();
updateTitle();

// Tạo pháo giấy (CSS)
const style = document.createElement('style');
style.innerHTML = `
.confetti {
    position: absolute;
    width: 10px;
    height: 10px;
    background-color: red;
    opacity: 0.7;
    animation: fall 5s linear infinite;
}

@keyframes fall {
    0% {
        transform: translateY(-100vh);
    }
    100% {
        transform: translateY(100vh);
        opacity: 0;
    }
}
`;
document.head.appendChild(style);
