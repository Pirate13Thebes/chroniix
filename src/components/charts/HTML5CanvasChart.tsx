/**
 * @file HTML5CanvasChart.tsx
 * @description Custom Native 2D HTML5 Canvas Renderer for Chronix Analytics & Particle Effects.
 * Written entirely using native canvas 2D context (canvas.getContext('2d')) without ANY external charting libraries.
 * Features retina display scaling, interactive tooltip overlays, smooth bezier curves, bar gradients, and an interactive particle network animation.
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';

/** Single data entry representing daily attendance analytics */
export interface CanvasChartDataPoint {
  /** Day label (e.g. 'Mon', 'Tue') */
  label: string;
  /** On-time clock-in count */
  onTime: number;
  /** Late clock-in count */
  late: number;
  /** Total active staff */
  total: number;
}

export interface HTML5CanvasChartProps {
  /** Dataset array for rendering */
  data?: CanvasChartDataPoint[];
  /** Width of the canvas container */
  width?: number;
  /** Height of the canvas container */
  height?: number;
  /** Title of the chart section */
  title?: string;
}

// Default fallback dataset if none provided
const DEFAULT_DATA: CanvasChartDataPoint[] = [
  { label: 'Mon', onTime: 42, late: 4, total: 46 },
  { label: 'Tue', onTime: 45, late: 2, total: 47 },
  { label: 'Wed', onTime: 40, late: 6, total: 46 },
  { label: 'Thu', onTime: 48, late: 1, total: 49 },
  { label: 'Fri', onTime: 44, late: 3, total: 47 },
  { label: 'Sat', onTime: 38, late: 5, total: 43 },
  { label: 'Sun', onTime: 30, late: 2, total: 32 },
];

/** Node structure for particle background physics animation */
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
}

export const HTML5CanvasChart: React.FC<HTML5CanvasChartProps> = ({
  data = DEFAULT_DATA,
  width = 750,
  height = 360,
  title = 'Native 2D Canvas Attendance & Punctuality Engine',
}) => {
  // Line-by-line DOM reference to the native <canvas> element
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Active view mode: 'chart' (Bar + Curved Line Analytics) or 'particles' (Interactive Flow Physics)
  const [viewMode, setViewMode] = useState<'chart' | 'particles'>('chart');
  
  // Track hovered mouse coordinate for interactive dynamic tooltips
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: -100, y: -100 });

  // Animation frame request ID reference for clean teardown
  const animFrameIdRef = useRef<number | null>(null);

  /**
   * Main Native 2D Canvas Chart Drawing Algorithm
   * Rendered using native canvas API: getContext('2d')
   */
  const drawChart = useCallback(
    (ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) => {
      // 1. Clear Canvas background frame
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      // Define chart layout paddings
      const padding = { top: 50, right: 30, bottom: 50, left: 50 };
      const chartWidth = canvasWidth - padding.left - padding.right;
      const chartHeight = canvasHeight - padding.top - padding.bottom;

      // Calculate data bounds
      const maxVal = Math.max(...data.map((d) => Math.max(d.onTime + d.late, d.total)), 50);

      // 2. Draw Background Grid Lines & Y-Axis Labels
      const gridTicks = 5;
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(150, 150, 150, 0.15)';
      ctx.fillStyle = '#64748b';
      ctx.font = '11px Inter, sans-serif';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';

      for (let i = 0; i <= gridTicks; i++) {
        const val = Math.round((maxVal / gridTicks) * i);
        const y = padding.top + chartHeight - (i / gridTicks) * chartHeight;

        // Draw horizontal gridline
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(padding.left + chartWidth, y);
        ctx.stroke();

        // Render Y-axis text tick label
        ctx.fillText(val.toString(), padding.left - 10, y);
      }

      // 3. Render X-Axis Labels & Bars
      const stepX = chartWidth / data.length;
      const barWidth = Math.min(stepX * 0.45, 36);

      data.forEach((pt, idx) => {
        const centerX = padding.left + idx * stepX + stepX / 2;
        const barLeft = centerX - barWidth / 2;

        // Calculate bar heights
        const onTimeHeight = (pt.onTime / maxVal) * chartHeight;
        const lateHeight = (pt.late / maxVal) * chartHeight;

        const onTimeY = padding.top + chartHeight - onTimeHeight;
        const lateY = onTimeY - lateHeight;

        // Draw On-Time Gradient Bar (Green Gradient)
        const onTimeGradient = ctx.createLinearGradient(0, onTimeY, 0, onTimeY + onTimeHeight);
        onTimeGradient.addColorStop(0, '#10b981');
        onTimeGradient.addColorStop(1, '#059669');

        ctx.fillStyle = onTimeGradient;
        ctx.beginPath();
        ctx.roundRect(barLeft, onTimeY, barWidth, onTimeHeight, [0, 0, 4, 4]);
        ctx.fill();

        // Draw Late Gradient Bar (Amber Gradient on top)
        if (lateHeight > 0) {
          const lateGradient = ctx.createLinearGradient(0, lateY, 0, lateY + lateHeight);
          lateGradient.addColorStop(0, '#f59e0b');
          lateGradient.addColorStop(1, '#d97706');

          ctx.fillStyle = lateGradient;
          ctx.beginPath();
          ctx.roundRect(barLeft, lateY, barWidth, lateHeight, [4, 4, 0, 0]);
          ctx.fill();
        }

        // Highlight bar hover state
        if (hoverIndex === idx) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
          ctx.beginPath();
          ctx.roundRect(barLeft - 2, lateY - 2, barWidth + 4, onTimeHeight + lateHeight + 4, 6);
          ctx.fill();
        }

        // Render X-Axis Day Label Text
        ctx.fillStyle = hoverIndex === idx ? '#0f172a' : '#64748b';
        ctx.font = hoverIndex === idx ? 'bold 12px Inter, sans-serif' : '11px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(pt.label, centerX, padding.top + chartHeight + 12);
      });

      // 4. Render Dynamic Bezier Curve Trendline (Total Staff Capacity)
      ctx.beginPath();
      data.forEach((pt, idx) => {
        const x = padding.left + idx * stepX + stepX / 2;
        const y = padding.top + chartHeight - (pt.total / maxVal) * chartHeight;

        if (idx === 0) {
          ctx.moveTo(x, y);
        } else {
          const prevX = padding.left + (idx - 1) * stepX + stepX / 2;
          const prevY = padding.top + chartHeight - (data[idx - 1].total / maxVal) * chartHeight;
          const cpX1 = prevX + (x - prevX) / 2;
          const cpX2 = cpX1;
          ctx.bezierCurveTo(cpX1, prevY, cpX2, y, x, y);
        }
      });

      // Stroke Trendline
      ctx.strokeStyle = '#6366f1';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Render Trendline Control Points
      data.forEach((pt, idx) => {
        const x = padding.left + idx * stepX + stepX / 2;
        const y = padding.top + chartHeight - (pt.total / maxVal) * chartHeight;

        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#6366f1';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(x, y, hoverIndex === idx ? 6 : 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      });

      // 5. Render Interactive Canvas Tooltip on Hover
      if (hoverIndex !== null && data[hoverIndex]) {
        const pt = data[hoverIndex];
        const hoverX = padding.left + hoverIndex * stepX + stepX / 2;
        const hoverY = padding.top + chartHeight - (pt.total / maxVal) * chartHeight - 10;

        const tooltipWidth = 140;
        const tooltipHeight = 74;
        let boxX = hoverX - tooltipWidth / 2;
        let boxY = hoverY - tooltipHeight - 10;

        // Contain tooltip inside canvas bounds
        if (boxX < 10) boxX = 10;
        if (boxX + tooltipWidth > canvasWidth - 10) boxX = canvasWidth - tooltipWidth - 10;
        if (boxY < 10) boxY = hoverY + 20;

        // Draw Tooltip Shadow & Background Box
        ctx.save();
        ctx.shadowColor = 'rgba(15, 23, 42, 0.2)';
        ctx.shadowBlur = 12;
        ctx.shadowOffsetY = 4;

        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.roundRect(boxX, boxY, tooltipWidth, tooltipHeight, 8);
        ctx.fill();
        ctx.restore();

        // Draw Tooltip Text Lines
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px Inter, sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText(`${pt.label} Attendance`, boxX + 12, boxY + 10);

        ctx.font = '11px Inter, sans-serif';
        ctx.fillStyle = '#34d399';
        ctx.fillText(`✓ On-time: ${pt.onTime}`, boxX + 12, boxY + 30);

        ctx.fillStyle = '#fbbf24';
        ctx.fillText(`⚠ Late: ${pt.late}`, boxX + 12, boxY + 48);
      }
    },
    [data, hoverIndex]
  );

  /**
   * Interactive Particle Network Background Physics Engine
   */
  const drawParticles = useCallback(
    (ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) => {
      // Create static particle array reference
      if (!(drawParticles as any).particles) {
        const colors = ['#10b981', '#6366f1', '#f59e0b', '#3b82f6'];
        const particles: Particle[] = [];
        for (let i = 0; i < 45; i++) {
          particles.push({
            x: Math.random() * canvasWidth,
            y: Math.random() * canvasHeight,
            vx: (Math.random() - 0.5) * 1.2,
            vy: (Math.random() - 0.5) * 1.2,
            radius: Math.random() * 2.5 + 1.5,
            color: colors[Math.floor(Math.random() * colors.length)],
          });
        }
        (drawParticles as any).particles = particles;
      }

      const particles: Particle[] = (drawParticles as any).particles;

      // Clear frame
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      // Update and draw particles
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off canvas boundaries
        if (p.x < 0 || p.x > canvasWidth) p.vx *= -1;
        if (p.y < 0 || p.y > canvasHeight) p.vy *= -1;

        // Mouse repulsion physics
        const dxMouse = mousePos.x - p.x;
        const dyMouse = mousePos.y - p.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
        if (distMouse < 100) {
          p.x -= (dxMouse / distMouse) * 2;
          p.y -= (dyMouse / distMouse) * 2;
        }

        // Draw particle dot
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        // Connect neighboring particles with dynamic opacity lines
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(99, 102, 241, ${1 - dist / 110})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });

      // Overlay title on particle canvas
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('⚡ Real-time Dynamic Attendance Mesh Physics', canvasWidth / 2, 30);
    },
    [mousePos]
  );

  /**
   * Continuous Canvas Render & Animation Loop Hook
   */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle High-DPI / Retina Screen Pixel Ratios
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Continuous Animation Frame Callback
    const renderFrame = () => {
      if (viewMode === 'chart') {
        drawChart(ctx, width, height);
      } else {
        drawParticles(ctx, width, height);
      }
      animFrameIdRef.current = requestAnimationFrame(renderFrame);
    };

    renderFrame();

    // Clean up animation frame request on component unmount or state change
    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [width, height, viewMode, drawChart, drawParticles]);

  /**
   * Handle Mouse Movement over Canvas to calculate hover index for interactive tooltips
   */
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMousePos({ x, y });

    if (viewMode === 'chart') {
      const padding = { left: 50, right: 30 };
      const chartWidth = width - padding.left - padding.right;
      const stepX = chartWidth / data.length;

      const idx = Math.floor((x - padding.left) / stepX);
      if (idx >= 0 && idx < data.length) {
        setHoverIndex(idx);
      } else {
        setHoverIndex(null);
      }
    }
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
    setMousePos({ x: -100, y: -100 });
  };

  return (
    <div
      className="card"
      style={{
        padding: '1.5rem',
        borderRadius: '16px',
        border: '1px solid var(--border)',
        background: 'var(--bg-card)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
      }}
    >
      {/* Header Controls */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--chronix-navy)', margin: 0 }}>
            {title}
          </h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Rendered via HTML5 2D Canvas context (`canvas.getContext('2d')`) without external dependencies
          </span>
        </div>

        {/* View Mode Switcher Toggle */}
        <div style={{ display: 'flex', gap: '0.4rem', background: 'var(--bg-page)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border)' }}>
          <button
            onClick={() => setViewMode('chart')}
            style={{
              padding: '6px 12px',
              fontSize: '0.8rem',
              fontWeight: 600,
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              background: viewMode === 'chart' ? 'var(--chronix-navy)' : 'transparent',
              color: viewMode === 'chart' ? '#ffffff' : 'var(--text-secondary)',
              transition: 'all 0.2s ease',
            }}
          >
            📊 Analytics Chart
          </button>
          <button
            onClick={() => setViewMode('particles')}
            style={{
              padding: '6px 12px',
              fontSize: '0.8rem',
              fontWeight: 600,
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              background: viewMode === 'particles' ? 'var(--chronix-navy)' : 'transparent',
              color: viewMode === 'particles' ? '#ffffff' : 'var(--text-secondary)',
              transition: 'all 0.2s ease',
            }}
          >
            ⚡ Particle Mesh
          </button>
        </div>
      </div>

      {/* HTML5 Canvas Element */}
      <div style={{ width: '100%', overflowX: 'auto', textAlign: 'center' }}>
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            width: `${width}px`,
            height: `${height}px`,
            maxWidth: '100%',
            display: 'block',
            margin: '0 auto',
            borderRadius: '12px',
            cursor: viewMode === 'chart' ? 'pointer' : 'default',
          }}
        />
      </div>

      {/* Canvas Legend Footer */}
      {viewMode === 'chart' && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1.75rem',
            marginTop: '1rem',
            fontSize: '0.82rem',
            fontWeight: 600,
            color: 'var(--text-secondary)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#10b981' }} />
            On-Time Clock-Ins
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#f59e0b' }} />
            Late Shifts
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '14px', height: '3px', borderRadius: '2px', background: '#6366f1' }} />
            Total Capacity Bezier Curve
          </div>
        </div>
      )}
    </div>
  );
};
