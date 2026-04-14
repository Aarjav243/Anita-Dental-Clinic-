import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
} from 'remotion';

export const PatientJourney: React.FC = () => {
  const frame = useCurrentFrame();
  const sceneDuration = 180; // 6 seconds at 30fps

  const scenes = [
    { title: "01. Book Your Visit", color: "#0B4F6C" },
    { title: "02. Expert Consultation", color: "#083D56" },
    { title: "03. Gentle Treatment", color: "#B8860B" },
    { title: "04. Lasting Follow-up", color: "#0B4F6C" }
  ];

  const sceneIndex = Math.min(Math.floor(frame / sceneDuration), scenes.length - 1);
  const currentScene = scenes[sceneIndex];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: currentScene.color,
        justifyContent: 'center',
        alignItems: 'center',
        transition: 'background-color 0.5s ease'
      }}
    >
      <div style={{
        transform: `scale(${interpolate(frame % sceneDuration, [0, sceneDuration], [0.95, 1.05])})`,
        textAlign: 'center'
      }}>
        <h2 style={{ 
          fontFamily: 'Cormorant Garamond, serif', 
          color: 'white', 
          fontSize: 60,
          marginBottom: 20
        }}>
          {currentScene.title}
        </h2>
        <div style={{
          width: 300,
          height: 10,
          backgroundColor: 'white',
          borderRadius: 5,
          margin: '0 auto',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            left: 0,
            top: 0,
            height: '100%',
            width: `${((frame % sceneDuration) / sceneDuration) * 100}%`,
            backgroundColor: '#F5EDD3'
          }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
