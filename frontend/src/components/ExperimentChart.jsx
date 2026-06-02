import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts"

// Custom tooltip to show accuracy with % suffix
function CustomTooltip({ active, payload, label }) {
    if (active && payload && payload.length) {
        return (
            <div
                style={{
                    background: "rgba(15,23,42,0.92)",
                    border: "1px solid #334155",
                    borderRadius: "8px",
                    padding: "10px 14px",
                    color: "#f1f5f9",
                    fontSize: "13px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
                }}
            >
                <p style={{ margin: 0, color: "#94a3b8" }}>
                    Round <strong style={{ color: "#f1f5f9" }}>{label}</strong>
                </p>
                <p style={{ margin: "4px 0 0", color: "#38bdf8" }}>
                    Accuracy:{" "}
                    <strong>{payload[0].value.toFixed(2)}%</strong>
                </p>
            </div>
        )
    }
    return null
}

export default function ExperimentChart({ data }) {
    // Guard: nothing to render
    if (!data || data.length === 0) {
        return (
            <div
                style={{
                    height: 300,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#64748b",
                    fontSize: "14px",
                    border: "1px dashed #334155",
                    borderRadius: "12px",
                }}
            >
                No experiment data yet.
            </div>
        )
    }

    // ── FIX 1: Coerce all values to numbers ───────────────────────────────
    // If accuracy ever arrives as a string (e.g. "96.11"), Recharts silently
    // plots it as 0. Explicit parseFloat + parseInt prevents that entirely.
    const chartData = [...data]
        .map((exp) => ({
            round: parseInt(exp.round, 10),
            accuracy: parseFloat(exp.accuracy),
        }))
        // ── FIX 2 (frontend safety net): Sort by round ascending ──────────
        // The backend now sorts too, but this guarantees correct order even if
        // the API is called in a stale/cached state.
        .sort((a, b) => a.round - b.round)

    // ── FIX 3: Compute a tight Y-axis domain ─────────────────────────────
    // Without this, Recharts uses 0–100 as the default domain. Accuracy values
    // of 94–97 then occupy only the top 3% of the chart height → flat line.
    // We add ±1% padding so dots at the extremes aren't clipped.
    const accuracies = chartData.map((d) => d.accuracy)
    const minAcc = Math.min(...accuracies)
    const maxAcc = Math.max(...accuracies)
    const padding = Math.max((maxAcc - minAcc) * 0.3, 0.5) // at least 0.5pp
    const yMin = Math.floor((minAcc - padding) * 10) / 10
    const yMax = Math.ceil((maxAcc + padding) * 10) / 10

    return (
        <div
            style={{
                background: "linear-gradient(135deg,#0f172a 0%,#1e293b 100%)",
                borderRadius: "16px",
                padding: "24px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
            }}
        >
            {/* Chart title */}
            <p
                style={{
                    margin: "0 0 4px 8px",
                    color: "#94a3b8",
                    fontSize: "12px",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                }}
            >
                Training Progress
            </p>
            <h2
                style={{
                    margin: "0 0 20px 8px",
                    color: "#f1f5f9",
                    fontSize: "20px",
                    fontWeight: 600,
                }}
            >
                Accuracy per Round
            </h2>

            <ResponsiveContainer width="100%" height={320}>
                <LineChart
                    data={chartData}
                    margin={{ top: 8, right: 32, left: 8, bottom: 8 }}
                >
                    {/* Subtle grid */}
                    <CartesianGrid
                        strokeDasharray="4 4"
                        stroke="#1e3a5f"
                        vertical={false}
                    />

                    {/* X-axis: round numbers */}
                    <XAxis
                        dataKey="round"
                        type="number"
                        domain={["dataMin", "dataMax"]}
                        tickCount={chartData.length}
                        tick={{ fill: "#64748b", fontSize: 12 }}
                        axisLine={{ stroke: "#334155" }}
                        tickLine={false}
                        label={{
                            value: "Round",
                            position: "insideBottom",
                            offset: -4,
                            fill: "#475569",
                            fontSize: 12,
                        }}
                    />

                    {/* ── FIX 3 applied here ── */}
                    <YAxis
                        domain={[yMin, yMax]}
                        tickFormatter={(v) => `${v.toFixed(1)}%`}
                        tick={{ fill: "#64748b", fontSize: 12 }}
                        axisLine={{ stroke: "#334155" }}
                        tickLine={false}
                        width={60}
                        label={{
                            value: "Accuracy (%)",
                            angle: -90,
                            position: "insideLeft",
                            offset: 10,
                            fill: "#475569",
                            fontSize: 12,
                        }}
                    />

                    <Tooltip content={<CustomTooltip />} />

                    <Legend
                        formatter={() => (
                            <span style={{ color: "#94a3b8", fontSize: 12 }}>
                                Global Accuracy
                            </span>
                        )}
                    />

                    <Line
                        type="monotone"
                        dataKey="accuracy"
                        name="Global Accuracy"
                        stroke="#38bdf8"
                        strokeWidth={2.5}
                        dot={{
                            r: 5,
                            fill: "#38bdf8",
                            stroke: "#0f172a",
                            strokeWidth: 2,
                        }}
                        activeDot={{
                            r: 7,
                            fill: "#7dd3fc",
                            stroke: "#0f172a",
                            strokeWidth: 2,
                        }}
                        isAnimationActive={true}
                        animationDuration={600}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}