export default function AnnotationPanel({ annotation, onClose }) {
  if (!annotation) return null;

  return (
    <div className="absolute bottom-0 left-0 right-0 z-20 bg-black/80 p-5 backdrop-blur-sm text-white">
      <button 
        onClick={onClose} 
        className="absolute top-3 right-4 text-2xl text-white/80 hover:text-white"
        aria-label="Close annotation"
      >
        ×
      </button>
      <h2 className="text-xl font-p22-freely mb-3">{annotation.name}</h2>
      <p className="text-sm mb-4 leading-relaxed max-h-[30vh] overflow-y-auto pr-2">{annotation.text}</p>
    </div>
  );
}
