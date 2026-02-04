'use client';

export function AuroraBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Coral blob */}
      <div
        className="aurora-blob absolute w-[600px] h-[600px] rounded-full opacity-40"
        style={{
          background: 'radial-gradient(circle, var(--accent-coral) 0%, transparent 70%)',
          top: '10%',
          left: '20%',
          animation: 'aurora-drift-1 25s ease-in-out infinite',
        }}
      />

      {/* Violet blob */}
      <div
        className="aurora-blob absolute w-[700px] h-[700px] rounded-full opacity-30"
        style={{
          background: 'radial-gradient(circle, var(--accent-violet) 0%, transparent 70%)',
          top: '30%',
          right: '10%',
          animation: 'aurora-drift-2 30s ease-in-out infinite',
        }}
      />

      {/* Blended blob (coral-violet gradient) */}
      <div
        className="aurora-blob absolute w-[500px] h-[500px] rounded-full opacity-25"
        style={{
          background: 'radial-gradient(circle, var(--accent-tangerine) 0%, transparent 70%)',
          bottom: '20%',
          left: '40%',
          animation: 'aurora-drift-3 22s ease-in-out infinite',
        }}
      />
    </div>
  );
}
