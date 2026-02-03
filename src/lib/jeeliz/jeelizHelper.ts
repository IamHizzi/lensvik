export const loadJeelizScripts = (): Promise<void> => {
    return new Promise((resolve, reject) => {
        if ((window as any).JEELIZFACEFILTER) {
            resolve();
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/jeelizfacefilter/dist/jeelizFaceFilter.js';
        script.async = true;
        script.onload = () => {
            resolve();
        };
        script.onerror = (err) => {
            reject(err);
        };
        document.body.appendChild(script);
    });
};

export const initFaceFilter = (canvasId: string, videoId: string, callbackReady: (err: any, spec: any) => void) => {
    if (!(window as any).JEELIZFACEFILTER) {
        console.error('Jeeliz FaceFilter not loaded');
        return;
    }

    (window as any).JEELIZFACEFILTER.init({
        canvasId: canvasId,
        NNCPath: 'https://cdn.jsdelivr.net/npm/jeelizfacefilter/dist/', // Neural Network model path
        callbackReady: callbackReady,
        callbackTrack: (detectState: any) => {
            // Custom tracking logic here
        }
    });
};
