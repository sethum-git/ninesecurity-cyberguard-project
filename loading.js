(function() {
    'use strict';
    
    const LOADING_TIME = 2000; 
    const FADE_TIME = 500; 
    

    class LoadingManager {
        constructor() {
            this.startTime = Date.now();
            this.loader = document.getElementById('logoLoader');
            this.init();
        }
        
        init() {
            if (!this.loader) return;
            

            document.body.style.overflow = 'hidden';
            
            const elapsed = Date.now() - this.startTime;
            const remaining = Math.max(0, LOADING_TIME - elapsed);
            
            setTimeout(() => {
                this.hideLoader();
            }, remaining);
            
            setTimeout(() => {
                if (this.loader && this.loader.style.display !== 'none') {
                    this.forceHideLoader();
                }
            }, 3000);
        }
        
        hideLoader() {
            if (!this.loader) return;
            
            this.loader.classList.add('fade-out');
            
            setTimeout(() => {
                if (this.loader) {
                    this.loader.style.display = 'none';
                    document.body.style.overflow = 'auto'; // Enable scrolling
                }
            }, FADE_TIME);
        }
        
        forceHideLoader() {
            if (!this.loader) return;
            
            this.loader.style.display = 'none';
            this.loader.style.opacity = '0';
            document.body.style.overflow = 'auto';
        }
    }
    
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            new LoadingManager();
        }, 50);
    });
    
    window.LoadingManager = LoadingManager;
    
})();