export default function AnnotationPanel({ annotation, onClose }) {
  if (!annotation) return null;
  
  console.log("AnnotationPanel rendering with annotation:", annotation);

  // Prevent click inside the panel from closing
  const handlePanelClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="relative w-full ml-6" onClick={handlePanelClick}>
      {/* Panel */}
      <div 
        className="bg-white rounded-lg shadow-xl overflow-hidden annotation-panel w-full max-w-md"
        style={{
          maxHeight: '85vh',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
        }}
      >
        <div className="p-8 max-h-[85vh] overflow-y-auto">
          <button 
            onClick={(e) => {
              console.log("Close button clicked");
              if (onClose) onClose(e);
            }} 
            className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center text-3xl text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
            aria-label="Close annotation"
          >
            ×
          </button>
          <h2 className="text-3xl font-p22-freely mb-6 pt-2 text-gray-900 pb-4">{annotation.name}</h2>
          <p className="text-lg leading-relaxed text-left  m-[2vw] text-gray-700">{annotation.text}</p>
        </div>
      </div>
    </div>
  );
}
