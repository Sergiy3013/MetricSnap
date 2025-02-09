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

        ctx.fillStyle = '#f5f5f5';
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = '#2c3e50';
        ctx.font = 'bold 24px Arial';
        ctx.fillText(data.title, padding, padding + 25);

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

            const barY = yOffset + 10;
            const barWidth = width - (padding * 2);
            ctx.fillStyle = '#ecf0f1';
            ctx.fillRect(padding, barY, barWidth, 20);

            const fillWidth = (barWidth * stat.usedPercent) / 100;
            ctx.fillStyle = '#63b3ed';
            ctx.fillRect(padding, barY, fillWidth, 20);

            ctx.fillStyle = '#2c3e50';
            ctx.font = 'bold 14px Arial';
            const percentText = `${stat.usedPercent}%`;
            const percentWidth = ctx.measureText(percentText).width;
            const percentX = padding + (barWidth / 2) - (percentWidth / 2);
            ctx.fillText(percentText, percentX, barY + 15);

            ctx.strokeStyle = '#bdc3c7';
            ctx.strokeRect(padding, barY, barWidth, 20);

            yOffset += itemHeight;
        });

        const buffer = canvas.toBuffer('image/png');
        resolve(buffer);
    });
};

const drawWarning = (ctx, x, y) => {
    const size = 14;

    ctx.save();

    ctx.beginPath();
    ctx.moveTo(x, y - size / 2 + 2);
    ctx.lineTo(x - size / 2 - 2, y + size / 2 + 4);
    ctx.lineTo(x + size / 2 + 2, y + size / 2 + 4);
    ctx.closePath();

    ctx.fillStyle = '#f39c12';
    ctx.fill();

    ctx.strokeStyle = '#000';
    ctx.fillStyle = '#000';
    ctx.beginPath();

    ctx.moveTo(x, y - size / 4 + 3);
    ctx.lineTo(x, y + size / 6 + 4);
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(x, y + size / 3 + 4, 1, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
};

const generateProjectImage = (data) => {
    return new Promise((resolve, reject) => {
        const padding = 30;
        const titleHeight = data.title ? 30 : 0;
        const subtitleHeight = data.subtitle ? 25 : 0;
        const titleSpacing = (data.title && data.subtitle) ? 10 : 0;
        const headerSpacing = (data.title || data.subtitle) ? 20 : 0;
        const rowHeight = 40;

        const hasBothUITypes = data.dataSource.some(project =>
            project.interface &&
            typeof project.interface === 'object' &&
            project.interface.local !== undefined &&
            project.interface.global !== undefined
        );

        const columns = [
            { width: 250, title: "Project" },
            { width: 100, title: "Container" }
        ];

        if (hasBothUITypes) {
            columns.push({ width: 100, title: "Local UI" });
            columns.push({ width: 100, title: "Global UI" });
        } else {
            columns.push({ width: 100, title: "UI" });
        }

        // Вычисляем общую ширину на основе колонок
        const width = columns.reduce((sum, col) => sum + col.width, 0) + (padding * 2);

        // Добавляем высоту для легенды
        const legendHeight = 50;
        const height = padding +
            titleHeight +
            subtitleHeight +
            titleSpacing +
            headerSpacing +
            (data.dataSource.length * rowHeight) +
            legendHeight +  // Добавляем высоту легенды
            padding;

        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');

        // Фон
        ctx.fillStyle = '#f5f5f5';
        ctx.fillRect(0, 0, width, height);

        let currentY = padding;

        if (data.title) {
            ctx.fillStyle = '#2c3e50';
            ctx.font = 'bold 24px Arial';
            ctx.fillText(data.title, padding, currentY + 22);
            currentY += titleHeight;
        }

        if (data.subtitle) {
            currentY += titleSpacing;
            ctx.fillStyle = '#7f8c8d';
            ctx.font = '16px Arial';
            ctx.fillText(data.subtitle, padding, currentY + 16);
            currentY += subtitleHeight;
        }

        currentY += headerSpacing;

        ctx.fillStyle = '#7f8c8d';
        ctx.font = '14px Arial';
        let xOffset = padding;
        columns.forEach(column => {
            const textWidth = ctx.measureText(column.title).width;
            const x = xOffset + (column.width - textWidth) / 2;
            ctx.fillText(column.title, x, currentY);
            xOffset += column.width;
        });

        currentY += 20;

        const drawStatus = (status, x, y) => {
            const size = 14;
            const halfSize = size / 2;

            if (status === "true" || status === true) {
                ctx.strokeStyle = '#27ae60';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(x - halfSize + 3, y - halfSize + 2);
                ctx.lineTo(x - 2, y + halfSize - 3);
                ctx.lineTo(x + halfSize, y - halfSize - 1);
                ctx.stroke();
            } else if (status === "false" || status === false) {
                ctx.strokeStyle = '#c0392b';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(x - halfSize + 2, y - halfSize + 2);
                ctx.lineTo(x + halfSize - 2, y + halfSize - 2);
                ctx.moveTo(x + halfSize - 2, y - halfSize + 2);
                ctx.lineTo(x - halfSize + 2, y + halfSize - 2);
                ctx.stroke();
            } else {
                ctx.strokeStyle = '#7f8c8d';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(x - halfSize + 2, y);
                ctx.lineTo(x + halfSize - 2, y);
                ctx.stroke();
            }
        };

        data.dataSource.forEach((project) => {
            xOffset = padding;

            ctx.fillStyle = '#2c3e50';
            ctx.font = '16px Arial';
            ctx.fillText(project.name, xOffset + 10, currentY + 20);
            xOffset += columns[0].width;

            const containerX = xOffset + columns[1].width / 2;
            drawStatus(project.container, containerX, currentY + 20);
            xOffset += columns[1].width;

            if (project.interface !== undefined) {
                if (hasBothUITypes) {
                    if (typeof project.interface == 'object') {
                        const localX = xOffset + 50;
                        drawStatus(project.interface.local, localX, currentY + 20);
                        xOffset += 100;
                        const globalX = xOffset + 50;
                        drawStatus(project.interface.global || "-", globalX, currentY + 20);
                    } else {
                        const localX = xOffset + 50;
                        drawWarning(ctx, localX, currentY + 15);
                        xOffset += 100;
                        const globalX = xOffset + 50;
                        drawWarning(ctx, globalX, currentY + 15);
                    }
                } else {
                    const interfaceX = xOffset + 50;
                    if (typeof project.interface === 'object') {
                        drawStatus(project.interface.local || project.interface.global, interfaceX, currentY + 20);
                    } else {
                        drawStatus(project.interface, interfaceX, currentY + 20);
                    }
                }
            } else {
                if (hasBothUITypes) {
                    const localX = xOffset + 50;
                    drawStatus("-", localX, currentY + 20);
                    xOffset += 100;
                    const globalX = xOffset + 50;
                    drawStatus("-", globalX, currentY + 20);
                } else {
                    const interfaceX = xOffset + 50;
                    drawStatus("-", interfaceX, currentY + 20);
                }
            }

            currentY += rowHeight;
        });

        // После отрисовки всех данных добавляем легенду
        currentY += 10;
        ctx.strokeStyle = '#bdc3c7';
        ctx.beginPath();
        ctx.moveTo(padding, currentY);
        ctx.lineTo(width - padding, currentY);
        ctx.stroke();
        currentY += 15;

        // Настройки для легенды
        ctx.fillStyle = '#7f8c8d';
        ctx.font = '12px Arial';

        // Рассчитываем позиции элементов легенды
        const legendItems = 4; // Количество элементов в легенде
        const legendPadding = 40; // Отступ от краев для легенды
        const legendSpacing = (width - (legendPadding * 2)) / legendItems; // Равномерное распределение

        let legendX = legendPadding;

        // Галочка
        drawStatus("true", legendX + 17, currentY + 7);
        ctx.fillText("Active", legendX + 30, currentY + 10);

        // Крестик
        legendX += legendSpacing;
        drawStatus("false", legendX, currentY + 7);
        ctx.fillText("Inactive", legendX + 15, currentY + 10);

        // Прочерк
        legendX += legendSpacing;
        drawStatus("-", legendX-10, currentY + 7);
        ctx.fillText("No data", legendX + 5, currentY + 10);

        // Варнинг
        legendX += legendSpacing;
        drawWarning(ctx, legendX-7, currentY + 3);
        ctx.fillText("Invalid Format", legendX + 8, currentY + 10);

        const buffer = canvas.toBuffer('image/png');
        resolve(buffer);
    });
};

module.exports = { generateImage, generateProjectImage };
