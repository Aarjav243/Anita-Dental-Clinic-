import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

export const HeroLoop: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, height, width } = useVideoConfig();

  const progress = spring({
    frame,
    fps,
    config: {
      damping: 200,
    },
  });

  const backgroundScale = interpolate(
    Math.sin(frame / 60),
    [-1, 1],
    [1, 1.1]
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0B4F6C',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle at 30% 30%, #B8860B33, transparent 70%)',
          transform: `scale(${backgroundScale})`,
        }}
      />
      
      <div style={{ opacity: progress, transform: `translateY(${interpolate(progress, [0, 1], [20, 0])}px)` }}>
        <h1 style={{ 
          fontFamily: 'Cormorant Garamond, serif', 
          color: 'white', 
          fontSize: 80, 
          textAlign: 'center',
          textShadow: '0 4px 20px rgba(0,0,0,0.3)'
        }}>
          Exceptional Care <br />
          <span style={{ color: '#B8860B' }}>Authentic Kerala</span>
        </h1>
      </div>

      <AbsoluteFill style={{ opacity: 0.1 }}>
        <div style={{
          position: 'absolute',
          bottom: -100,
          right: -100,
          width: 500,
          height: 500,
          borderRadius: '50%',
          border: '2px solid white',
        }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
