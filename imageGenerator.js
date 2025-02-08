const { createCanvas } = require('canvas');

const formatUptime = (uptime) => {
    const days = Math.floor(uptime / (24 * 60 * 60));
    const hours = Math.floor((uptime % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((uptime % (60 * 60)) / 60);
    return `Uptime: ${days}d ${hours}h ${minutes}m`;
};

const generateImage = (data) => {
    return new Promise((resolve, reject) => {
        const padding = 30;
        const headerHeight = data.subtitle ? 90 : 60;
        const itemHeight = 70;
        const width = 500;
        const height = headerHeight + (data.dataSource.length * itemHeight) + (padding * 2);

        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');

        // Фон
        ctx.fillStyle = '#f5f5f5';
        ctx.fillRect(0, 0, width, height);

        // Заголовок
        ctx.fillStyle = '#2c3e50';
        ctx.font = 'bold 24px Arial';
        ctx.fillText(data.title, padding, padding + 25);

        // Аптайм справа от заголовка
        if (data.uptime) {
            ctx.fillStyle = '#34495e';
            ctx.font = '14px Arial';
            const uptimeText = data.uptime;
            
            const uptimeWidth = ctx.measureText(uptimeText).width;
            ctx.fillText(uptimeText, width - padding - uptimeWidth, padding + 25);
        }
        
        if (data.subtitle) {
            ctx.fillStyle = '#7f8c8d';
            ctx.font = '16px Arial';
            ctx.fillText(data.subtitle, padding, padding + 50);
        }

        // Статистика
        let yOffset = headerHeight + padding;
        data.dataSource.forEach((stat) => {
            ctx.fillStyle = '#2c3e50';
            ctx.font = 'bold 18px Arial';
            ctx.fillText(stat.name, padding, yOffset);

            if (stat.total && stat.used) {
                ctx.fillStyle = '#7f8c8d';
                ctx.font = '14px Arial';
                const usageText = `${stat.used} / ${stat.total}`;
                ctx.fillText(usageText, width - padding - ctx.measureText(usageText).width, yOffset);
            }

            // Прогрес-бар фон
            const barY = yOffset + 10;
            const barWidth = width - (padding * 2);
            ctx.fillStyle = '#ecf0f1';
            ctx.fillRect(padding, barY, barWidth, 20);

            // Прогрес-бар заповнення
            const fillWidth = (barWidth * stat.usedPercent) / 100;
            ctx.fillStyle = '#63b3ed'; // Светлый синий цвет
            ctx.fillRect(padding, barY, fillWidth, 20);

            // Відсоток по центру всієї шкали
            ctx.fillStyle = '#2c3e50';
            ctx.font = 'bold 14px Arial';
            const percentText = `${stat.usedPercent}%`;
            const percentWidth = ctx.measureText(percentText).width;
            const percentX = padding + (barWidth / 2) - (percentWidth / 2);
            ctx.fillText(percentText, percentX, barY + 15);

            // Рамка прогрес-бару
            ctx.strokeStyle = '#bdc3c7';
            ctx.strokeRect(padding, barY, barWidth, 20);

            yOffset += itemHeight;
        });

        const buffer = canvas.toBuffer('image/png');
        resolve(buffer);
    });
};

module.exports = { generateImage };
