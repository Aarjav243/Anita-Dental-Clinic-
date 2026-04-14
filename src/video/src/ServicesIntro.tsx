import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  spring,
} from 'remotion';

export const ServicesIntro: React.FC = () => {
  const frame = useCurrentFrame();
  
  const services = [
    "General Dentistry",
    "Cosmetic Surgery",
    "Dental Implants",
    "Orthodontics"
  ];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#FAFAF7',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div style={{ padding: 40, width: '100%' }}>
        {services.map((service, i) => {
          const s = spring({
            frame: frame - (i * 15),
            fps: 30,
            config: {
              stiffness: 100,
            },
          });

          return (
            <div
              key={i}
              style={{
                opacity: s,
                transform: `translateX(${interpolate(s, [0, 1], [-50, 0])}px)`,
                fontSize: 48,
                fontFamily: 'Cormorant Garamond, serif',
                color: '#0B4F6C',
                padding: '10px 0',
                borderBottom: '1px solid #D6E4EC',
                display: 'flex',
                alignItems: 'center',
                gap: 20
              }}
            >
              <div style={{
                width: 20,
                height: 20,
                backgroundColor: '#B8860B',
                borderRadius: '50%'
              }} />
              {service}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
