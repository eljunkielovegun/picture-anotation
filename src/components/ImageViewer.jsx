import { useState, useRef } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import Hotspot from './Hotspot';
import AnnotationPanel from './AnnotationPanel';
import photoData from '../data/annotations';

export default function ImageViewer({ image, fullViewport = false }) {
  const [selected, setSelected] = useState(null);
  const transformRef = useRef(null);

  const annotations = photoData.annotations.map((a) => ({
    ...a,
    top: a.coords[1] * 100,
    left: a.coords[0] * 100
  }));

  return (
    <div className={`relative ${fullViewport ? 'w-full h-full m-0 p-0' : 'w-full max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-4'}`}>
      <div className={`relative ${fullViewport ? 'w-full h-full m-0 p-0' : ''}`}>
        <TransformWrapper
          initialScale={1}
          minScale={0.5}
          maxScale={3}
          wheel={{ wheelEnabled: true }}
          pinch={{ pinchEnabled: true }}
          doubleClick={{ 
            mode: "reset",
            animationTime: 200
          }}
          ref={transformRef}
          centerOnInit={true}
          alignmentAnimation={{ disabled: true }}
          limitToBounds={false}
        >
          {({ zoomIn, zoomOut, resetTransform }) => (
            <>
              <TransformComponent 
                wrapperStyle={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: 0, padding: 0 }}
                contentStyle={fullViewport ? { height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: 0, padding: 0 } : {}}
              >
                <div className="relative flex justify-center items-center h-full m-0 p-0">
                  <div className="relative m-0 p-0">
                    <img 
                      src={image} 
                      alt="Annotated View" 
                      className={fullViewport ? 'max-h-[100vh] h-auto' : 'w-full h-auto rounded-md'} 
                      style={{ 
                        width: 'auto',
                        objectFit: 'contain',
                        maxWidth: fullViewport ? '100vw' : 'none',
                        margin: 0,
                        padding: 0
                      }}
                    />
                    
                    {/* Hotspots positioned relative to the image */}
                    {annotations.map((a) => (
                      <Hotspot
                        key={a.id}
                        id={a.id}
                        top={a.top}
                        left={a.left}
                        label={a.name}
                        onClick={() => setSelected(a)}
                      />
                    ))}
                  </div>
                </div>
              </TransformComponent>
            </>
          )}
        </TransformWrapper>
      </div>

      <AnnotationPanel annotation={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
