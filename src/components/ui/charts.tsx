import { ReactNode } from "react";

interface ChartProps {
    children: ReactNode;
    className?: string;
}

export const Chart = ({ children, className = "" }: ChartProps) => {
    return <div className={`relative ${className}`}>{children}</div>;
};

interface BarChartProps {
    data: { name: string; value: number; color?: string }[];
    height?: number;
    showValues?: boolean;
}

export const BarChart = ({ data, height = 200, showValues = true }: BarChartProps) => {
    const maxValue = Math.max(...data.map(item => item.value));

    return (
        <div className="space-y-4">
            <div className="flex items-end justify-between" style={{ height: `${height}px` }}>
                {data.map((item, index) => {
                    const barHeight = (item.value / maxValue) * (height - 40);
                    return (
                        <div key={index} className="flex flex-col items-center flex-1 mx-1">
                            <div className="relative flex flex-col items-center justify-end h-full">
                                {showValues && (
                                    <span className="text-xs font-medium mb-1 text-gray-700">
                                        {item.value}
                                    </span>
                                )}
                                <div
                                    className={`w-full max-w-12 rounded-t transition-all duration-500 ${item.color || 'bg-blue-500'
                                        }`}
                                    style={{ height: `${barHeight}px`, minHeight: '4px' }}
                                />
                            </div>
                            <span className="text-xs text-gray-600 mt-2 text-center">{item.name}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

interface LineChartProps {
    data: { name: string; value: number }[];
    height?: number;
    color?: string;
}

export const LineChart = ({ data, height = 200, color = "blue" }: LineChartProps) => {
    // Handle empty or insufficient data
    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center text-gray-400" style={{ height: `${height}px` }}>
                <div className="text-center">
                    <p>কোনো ডেটা নেই</p>
                </div>
            </div>
        );
    }

    const maxValue = Math.max(...data.map(item => item.value), 1);
    const minValue = Math.min(...data.map(item => item.value), 0);
    const range = maxValue - minValue || 1;

    // Handle single data point case
    const divisor = data.length > 1 ? data.length - 1 : 1;

    const points = data.map((item, index) => {
        const x = data.length > 1 ? (index / divisor) * 100 : 50;
        const y = 100 - ((item.value - minValue) / range) * 80;
        return `${x},${y}`;
    }).join(' ');

    return (
        <div className="space-y-4">
            <div className="relative" style={{ height: `${height}px` }}>
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {/* Grid lines */}
                    <defs>
                        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="0.5" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />

                    {/* Area under curve */}
                    <polygon
                        points={`0,100 ${points} 100,100`}
                        fill={`url(#gradient-${color})`}
                        opacity="0.3"
                    />

                    {/* Line */}
                    <polyline
                        points={points}
                        fill="none"
                        stroke={color === 'blue' ? '#3b82f6' : color === 'green' ? '#10b981' : '#8b5cf6'}
                        strokeWidth="2"
                        vectorEffect="non-scaling-stroke"
                    />

                    {/* Data points */}
                    {data.map((item, index) => {
                        const x = data.length > 1 ? (index / divisor) * 100 : 50;
                        const y = 100 - ((item.value - minValue) / range) * 80;
                        return (
                            <circle
                                key={index}
                                cx={x}
                                cy={y}
                                r="2"
                                fill={color === 'blue' ? '#3b82f6' : color === 'green' ? '#10b981' : '#8b5cf6'}
                                vectorEffect="non-scaling-stroke"
                            />
                        );
                    })}

                    {/* Gradients */}
                    <defs>
                        <linearGradient id="gradient-blue" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
                        </linearGradient>
                        <linearGradient id="gradient-green" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#10b981" stopOpacity="0.1" />
                        </linearGradient>
                        <linearGradient id="gradient-purple" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.1" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>
            <div className="flex justify-between text-xs text-gray-600">
                {data.map((item, index) => (
                    <span key={index} className="text-center">{item.name}</span>
                ))}
            </div>
        </div>
    );
};

interface PieChartProps {
    data: { name: string; value: number; color: string }[];
    size?: number;
    showLabels?: boolean;
}

export const PieChart = ({ data, size = 200, showLabels = true }: PieChartProps) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = 0;

    const radius = size / 2 - 20;
    const centerX = size / 2;
    const centerY = size / 2;

    return (
        <div className="flex flex-col items-center space-y-4">
            <div className="relative" style={{ width: size, height: size }}>
                <svg width={size} height={size} className="transform -rotate-90">
                    {data.map((item, index) => {
                        const angle = (item.value / total) * 360;
                        const startAngle = currentAngle;
                        currentAngle += angle;

                        const startAngleRad = (startAngle * Math.PI) / 180;
                        const endAngleRad = (currentAngle * Math.PI) / 180;

                        const x1 = centerX + radius * Math.cos(startAngleRad);
                        const y1 = centerY + radius * Math.sin(startAngleRad);
                        const x2 = centerX + radius * Math.cos(endAngleRad);
                        const y2 = centerY + radius * Math.sin(endAngleRad);

                        const largeArcFlag = angle > 180 ? 1 : 0;

                        const pathData = [
                            `M ${centerX} ${centerY}`,
                            `L ${x1} ${y1}`,
                            `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                            'Z'
                        ].join(' ');

                        return (
                            <path
                                key={index}
                                d={pathData}
                                fill={item.color.replace('bg-', '#').replace('-500', '')}
                                stroke="white"
                                strokeWidth="2"
                            />
                        );
                    })}
                </svg>
            </div>

            {showLabels && (
                <div className="grid grid-cols-2 gap-2 text-sm">
                    {data.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <div
                                className={`w-3 h-3 rounded ${item.color}`}
                            />
                            <span>{item.name}: {item.value}%</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

interface DonutChartProps {
    data: { name: string; value: number; color: string }[];
    size?: number;
    centerText?: string;
}

export const DonutChart = ({ data, size = 200, centerText }: DonutChartProps) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = 0;

    const outerRadius = size / 2 - 20;
    const innerRadius = outerRadius * 0.6;
    const centerX = size / 2;
    const centerY = size / 2;

    return (
        <div className="flex flex-col items-center space-y-4">
            <div className="relative" style={{ width: size, height: size }}>
                <svg width={size} height={size} className="transform -rotate-90">
                    {data.map((item, index) => {
                        const angle = (item.value / total) * 360;
                        const startAngle = currentAngle;
                        currentAngle += angle;

                        const startAngleRad = (startAngle * Math.PI) / 180;
                        const endAngleRad = (currentAngle * Math.PI) / 180;

                        const x1Outer = centerX + outerRadius * Math.cos(startAngleRad);
                        const y1Outer = centerY + outerRadius * Math.sin(startAngleRad);
                        const x2Outer = centerX + outerRadius * Math.cos(endAngleRad);
                        const y2Outer = centerY + outerRadius * Math.sin(endAngleRad);

                        const x1Inner = centerX + innerRadius * Math.cos(startAngleRad);
                        const y1Inner = centerY + innerRadius * Math.sin(startAngleRad);
                        const x2Inner = centerX + innerRadius * Math.cos(endAngleRad);
                        const y2Inner = centerY + innerRadius * Math.sin(endAngleRad);

                        const largeArcFlag = angle > 180 ? 1 : 0;

                        const pathData = [
                            `M ${x1Outer} ${y1Outer}`,
                            `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2Outer} ${y2Outer}`,
                            `L ${x2Inner} ${y2Inner}`,
                            `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x1Inner} ${y1Inner}`,
                            'Z'
                        ].join(' ');

                        const colorMap: { [key: string]: string } = {
                            'bg-green-500': '#10b981',
                            'bg-yellow-500': '#f59e0b',
                            'bg-red-500': '#ef4444',
                            'bg-blue-500': '#3b82f6',
                            'bg-purple-500': '#8b5cf6',
                            'bg-orange-500': '#f97316',
                            'bg-gray-500': '#6b7280'
                        };

                        return (
                            <path
                                key={index}
                                d={pathData}
                                fill={colorMap[item.color] || item.color}
                                stroke="white"
                                strokeWidth="2"
                            />
                        );
                    })}
                </svg>

                {centerText && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                            <div className="text-2xl font-bold">{centerText}</div>
                            <div className="text-sm text-gray-500">মোট</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
