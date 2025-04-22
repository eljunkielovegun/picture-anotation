export default function AnnotationPanel({ annotation, onClose }) {
  if (!annotation) return null;
  
  console.log("AnnotationPanel rendering with annotation:", annotation);

  return (
    <div className="relative w-full cursor-pointer" onClick={(e) => {
      console.log("Panel clicked, closing");
      if (onClose) onClose(e);
    }}>
      {/* Panel */}
      <div 
        className="overflow-hidden annotation-panel w-full rounded-2xl"
        style={{ 
          backgroundColor: '#F5F7DC', 
          padding: '20px', 
          paddingRight: '4em',
          borderRadius: '20px',
          filter: 'drop-shadow(0 8px 15px rgba(206, 149, 121, 0.5))'
        }}
      >
        <div className="overflow-y-auto" style={{ paddingTop: '10px' }}>
          <h2 className="text-2xl font-p22-freely mb-4 text-gray-900" style={{ paddingLeft: '1rem', paddingRight: '3em' }}>{annotation.name}</h2>
          <p className="text-base leading-relaxed text-left text-gray-700" style={{ 
            paddingLeft: '1rem', 
            paddingRight: '3em', 
            paddingBottom: '1rem'
          }}>
            {annotation.text}
          </p>
        </div>
      </div>
    </div>
  );
}
