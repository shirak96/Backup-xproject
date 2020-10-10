import { useEffect, useState } from 'react';

const addBodyClass = className => {
  return  document.body.classList.add(className);
}
const removeBodyClass = className => {
    return document.body.classList.remove(className);
    // return  document.body.classList.add(className);
    
}

export const useBodyClass = (className) => {
    useEffect(
        () => {
            // Set up
            className instanceof Array ? className.map(addBodyClass) : addBodyClass(className);

            // Clean up
            return () => {
                className instanceof Array
                    ? className.map(removeBodyClass)
                    : removeBodyClass(className);
            };
        },
        [className]
    );
}
// Hook
const cachedScripts = [];
export const useScript = (src) => {
    // Keeping track of script loaded and error state
    const [state, setState] = useState({
        loaded: false,
        error: false
    });

    useEffect(
        () => {
            // If cachedScripts array already includes src that means another instance ...
            // ... of this hook already loaded this script, so no need to load again.
            if (cachedScripts.includes(src)) {
                setState({
                    loaded: true,
                    error: false
                });
            } else {
                cachedScripts.push(src);

                // Create script
                let script = document.createElement('script');
                script.src = src;
                script.async = true;

                // Script event listener callbacks for load and error
                const onScriptLoad = () => {
                    setState({
                        loaded: true,
                        error: false
                    });
                };

                const onScriptError = () => {
                    // Remove from cachedScripts we can try loading again
                    const index = cachedScripts.indexOf(src);
                    if (index >= 0) cachedScripts.splice(index, 1);
                    script.remove();

                    setState({
                        loaded: true,
                        error: true
                    });
                };

                script.addEventListener('load', onScriptLoad);
                script.addEventListener('error', onScriptError);

                // Add script to document body
                document.body.appendChild(script);

                // Remove event listeners on cleanup
                return () => {
                    script.removeEventListener('load', onScriptLoad);
                    script.removeEventListener('error', onScriptError);
                };
            }
        },
        [src] // Only re-run effect if script src changes
    );

    return [state.loaded, state.error];
}

const cachedStyles = [];
export const useStyles = (src) => {
    // Keeping track of script loaded and error state
    const [state, setState] = useState({
        loaded: false,
        error: false
    });

    useEffect(
        () => {
            // If cachedScripts array already includes src that means another instance ...
            // ... of this hook already loaded this script, so no need to load again.
            if (cachedStyles.includes(src)) {
                setState({
                    loaded: true,
                    error: false
                });
            } else {
                cachedStyles.push(src);

                // Create style
                let style = document.createElement('link');
                style.rel = 'stylesheet';
                style.type = 'text/css';
                style.href = src;
                style.media = 'all';
                style.async = true;
                //
                // let style = document.createElement('link');
                // style.rel = 'stylesheet';
                // style.type = 'text/css';
                // style.media = 'all';
                // style.async = true;

                // Script event listener callbacks for load and error
                const onStyleLoad = () => {
                    setState({
                        loaded: true,
                        error: false
                    });
                };

                const onStyleError = () => {
                    // Remove from cachedScripts we can try loading again
                    const index = cachedScripts.indexOf(src);
                    if (index >= 0) cachedScripts.splice(index, 1);
                    style.remove();

                    setState({
                        loaded: true,
                        error: true
                    });
                };

                style.addEventListener('load', onStyleLoad);
                style.addEventListener('error', onStyleError);

                // Add style to document body
                // document.head.appendChild(style);
                document.head.insertBefore(style, document.head.childNodes[0]);

                // Remove event listeners on cleanup
                return () => {
                    style.removeEventListener('load', onStyleLoad);
                    style.removeEventListener('error', onStyleError);
                };
            }
        },
        [src] // Only re-run effect if style src changes
    );

    return [state.loaded, state.error];
}
