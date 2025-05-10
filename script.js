let options = [];
let selectedIndex = -1;
const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
const spinButton = document.getElementById('spin-button');
const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#A133FF', '#33FFA1'];

function drawWheel() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (options.length === 0) return;

    const N = options.length;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 200;

    for (let K = 0; K < N; K++) {
        const startAngle = K * (2 * Math.PI / N);
        const endAngle = (K + 1) * (2 * Math.PI / N);

        // Draw segment
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = colors[K % colors.length];
        ctx.fill();
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw text
        const midAngle = (startAngle + endAngle) / 2;
        const textX = centerX + (radius / 2) * Math.cos(midAngle);
        const textY = centerY + (radius / 2) * Math.sin(midAngle);
        ctx.save();
        ctx.translate(textX, textY);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'black';
        ctx.fillText(options[K], 0, 0);
        ctx.restore();
    }
}

document.getElementById('add-button').addEventListener('click', () => {
    const option = document.getElementById('option-input').value.trim();
    if (option) {
        options.push(option);
        const li = document.createElement('li');
        li.textContent = option;
        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove';
        removeBtn.onclick = () => {
            options = options.filter(opt => opt !== option);
            li.remove();
            drawWheel();
        };
        li.appendChild(removeBtn);
        document.getElementById('options-list').appendChild(li);
        drawWheel();
        document.getElementById('option-input').value = '';
    }
});

document.getElementById('option-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        document.getElementById('add-button').click();
    }
});

spinButton.addEventListener('click', () => {
    if (options.length < 2) {
        alert('Please add at least two options.');
        return;
    }

    spinButton.disabled = true;
    canvas.style.transition = 'none';
    canvas.style.transform = 'rotate(0deg)';
    canvas.offsetHeight; // Force reflow

    const N = options.length;
    const K = Math.floor(Math.random() * N);
    selectedIndex = K;
    const theta = (K + 0.5) * (360 / N);
    const M = Math.floor(Math.random() * 3) + 3; // 3 to 5 full rotations
    const totalRotation = 360 * M + theta;

    canvas.style.transition = 'transform 5s ease-out';
    canvas.style.transform = `rotate(${totalRotation}deg)`;
});

canvas.addEventListener('transitionend', () => {
    if (selectedIndex >= 0) {
        alert(`You should choose: ${options[selectedIndex]}`);
        selectedIndex = -1;
    }
    spinButton.disabled = false;
});

// Initial draw
drawWheel();
