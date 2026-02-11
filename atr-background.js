class ATRBackground {
    constructor() {
        this.container = null;
        this.nodes = [];
        this.connections = [];
        this.particles = [];
        this.threats = [];
        this.shields = [];
        
        this.config = {
            nodeCount: 150,
            connectionCount: 200,
            particleCount: 50,
            threatCount: 8,
            shieldCount: 12,
            maxConnectionsPerNode: 3,
            particleSpeed: 1,
            threatScanInterval: 5000,
            dataTransmissionInterval: 1000
        };
    }

    init(containerId = 'atrBackground') {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error(`Container #${containerId} not found`);
            return;
        }

        this.createGrid();
        
        this.createNodes();
        this.createConnections();
        this.createThreats();
        this.createShields();
        this.createParticles();
        
        this.startAnimations();
        
        this.addMouseInteraction();
        
        window.addEventListener('resize', () => this.handleResize());
    }

    createGrid() {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute('class', 'network-canvas');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        
        const gridSize = 100;
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        for (let y = 0; y < height; y += gridSize) {
            const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            line.setAttribute('class', 'grid-line');
            line.setAttribute('x1', '0');
            line.setAttribute('y1', y);
            line.setAttribute('x2', width);
            line.setAttribute('y2', y);
            svg.appendChild(line);
        }
        
        for (let x = 0; x < width; x += gridSize) {
            const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            line.setAttribute('class', 'grid-line');
            line.setAttribute('x1', x);
            line.setAttribute('y1', '0');
            line.setAttribute('x2', x);
            line.setAttribute('y2', height);
            svg.appendChild(line);
        }
        
        this.container.appendChild(svg);
    }

    createNodes() {
        for (let i = 0; i < this.config.nodeCount; i++) {
            const node = document.createElement('div');
            node.className = 'network-node';
            
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            
            if (Math.random() > 0.8) {
                node.classList.add('large');
            }
            
            node.style.left = `${x}%`;
            node.style.top = `${y}%`;
            
            node.style.animation = `threatPulse ${3 + Math.random() * 4}s ease-in-out infinite`;
            node.style.animationDelay = `${Math.random() * 5}s`;
            
            this.container.appendChild(node);
            this.nodes.push({ element: node, x, y });
        }
    }

    createConnections() {
        for (let i = 0; i < this.config.connectionCount; i++) {
            const line = document.createElement('div');
            line.className = 'connection-line';
            
            const startNode = this.nodes[Math.floor(Math.random() * this.nodes.length)];
            const endNode = this.nodes[Math.floor(Math.random() * this.nodes.length)];
            
            if (startNode && endNode) {
                const dx = endNode.x - startNode.x;
                const dy = endNode.y - startNode.y;
                const length = Math.sqrt(dx * dx + dy * dy) * window.innerWidth / 100;
                const angle = Math.atan2(dy, dx) * 180 / Math.PI;
                
                line.style.width = `${length}px`;
                line.style.left = `${startNode.x}%`;
                line.style.top = `${startNode.y}%`;
                line.style.transform = `rotate(${angle}deg)`;
                line.style.opacity = 0.1 + Math.random() * 0.2;
                
                this.container.appendChild(line);
                this.connections.push(line);
            }
        }
    }

    createThreats() {
        for (let i = 0; i < this.config.threatCount; i++) {
            const threat = document.createElement('div');
            threat.className = 'threat-indicator';
            
            const x = 10 + Math.random() * 80;
            const y = 10 + Math.random() * 80;
            
            threat.style.left = `${x}%`;
            threat.style.top = `${y}%`;
            threat.style.animationDelay = `${Math.random() * 3}s`;
            
            this.container.appendChild(threat);
            this.threats.push(threat);
        }
    }

    createShields() {
        for (let i = 0; i < this.config.shieldCount; i++) {
            const shield = document.createElement('div');
            shield.className = 'security-shield';
            
            const x = 5 + Math.random() * 90;
            const y = 5 + Math.random() * 90;
            
            shield.style.left = `${x}%`;
            shield.style.top = `${y}%`;
            shield.style.animationDelay = `${Math.random() * 4}s`;
            
            this.container.appendChild(shield);
            this.shields.push(shield);
        }
    }

    createParticles() {
        for (let i = 0; i < this.config.particleCount; i++) {
            this.createParticle();
        }
    }

    createParticle() {
        const particle = document.createElement('div');
        particle.className = 'data-packet';
        
        const startX = Math.random() * 100;
        const startY = Math.random() * 100;
        
        const endX = startX + (Math.random() * 20 - 10);
        const endY = startY + (Math.random() * 20 - 10);
        
        particle.style.left = `${startX}%`;
        particle.style.top = `${startY}%`;
        
        const duration = 2000 + Math.random() * 3000;
        particle.style.animation = `dataFlow ${duration}ms linear infinite`;
        particle.style.animationDelay = `${Math.random() * 2000}ms`;
        
        this.container.appendChild(particle);
        this.particles.push({
            element: particle,
            startX, startY, endX, endY
        });
        
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
            const index = this.particles.findIndex(p => p.element === particle);
            if (index > -1) this.particles.splice(index, 1);
            this.createParticle();
        }, duration);
    }

    addMouseInteraction() {
        document.addEventListener('mousemove', (e) => {
            // Create particles on mouse move
            if (Math.random() > 0.7) {
                this.createMouseParticle(e.clientX, e.clientY);
            }
            
            const mouseX = (e.clientX / window.innerWidth) * 100;
            const mouseY = (e.clientY / window.innerHeight) * 100;
            
            this.nodes.forEach(node => {
                const distance = Math.sqrt(
                    Math.pow(node.x - mouseX, 2) + 
                    Math.pow(node.y - mouseY, 2)
                );
                
                if (distance < 10) {
                    node.element.style.transform = 'scale(1.5)';
                    node.element.style.transition = 'transform 0.3s ease';
                    
                    setTimeout(() => {
                        node.element.style.transform = 'scale(1)';
                    }, 300);
                }
            });
        });
    }

    createMouseParticle(x, y) {
        const particle = document.createElement('div');
        particle.className = 'interactive-particle';
        
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        
        const size = 1 + Math.random() * 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        this.container.appendChild(particle);
        
        const velocityX = (Math.random() - 0.5) * 4;
        const velocityY = (Math.random() - 0.5) * 4;
        let posX = x;
        let posY = y;
        
        const animate = () => {
            posX += velocityX;
            posY += velocityY;
            particle.style.left = `${posX}px`;
            particle.style.top = `${posY}px`;
            particle.style.opacity = parseFloat(particle.style.opacity || 1) - 0.02;
            
            if (parseFloat(particle.style.opacity) > 0) {
                requestAnimationFrame(animate);
            } else {
                particle.remove();
            }
        };
        
        animate();
    }

    startAnimations() {
            for (let i = 0; i < 4; i++) {
            const radar = document.createElement('div');
            radar.className = 'radar-circle';
            
            const x = 50;
            const y = 50;
            
            radar.style.width = '1px';
            radar.style.height = '1px';
            radar.style.left = `${x}%`;
            radar.style.top = `${y}%`;
            
            this.container.appendChild(radar);
        }

        const terminal = document.createElement('div');
        terminal.className = 'terminal-effect';
        this.container.appendChild(terminal);
    }

    handleResize() {
        this.connections.forEach(conn => {
            if (conn.parentNode) {
                conn.parentNode.removeChild(conn);
            }
        });
        this.connections = [];
        
        this.createConnections();
    }

    destroy() {
        while (this.container.firstChild) {
            this.container.removeChild(this.container.firstChild);
        }
        
        this.nodes = [];
        this.connections = [];
        this.particles = [];
        this.threats = [];
        this.shields = [];
        
        window.removeEventListener('resize', () => this.handleResize());
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const atrBackground = new ATRBackground();
    atrBackground.init();
    
    window.atrBackground = atrBackground;
});