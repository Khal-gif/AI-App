class NanoBananaApp {
    constructor() {
        this.currentImage = null;
        this.initializeElements();
        this.attachEventListeners();
    }

    initializeElements() {
        this.uploadArea = document.getElementById('uploadArea');
        this.fileInput = document.getElementById('fileInput');
        this.driveLink = document.getElementById('driveLink');
        this.editInterface = document.getElementById('editInterface');
        this.thumbnailImage = document.getElementById('thumbnailImage');
        this.editPrompt = document.getElementById('editPrompt');
        this.sampleCount = document.getElementById('sampleCount');
        this.generateBtn = document.getElementById('generateBtn');
    }

    attachEventListeners() {
        // Click to upload
        this.uploadArea.addEventListener('click', () => {
            this.fileInput.click();
        });

        // File input change
        this.fileInput.addEventListener('change', (e) => {
            if (e.target.files[0]) {
                this.driveLink.value = '';
                this.displayImageFromFile(e.target.files[0]);
            }
        });

        // Drag and drop events
        this.uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.uploadArea.classList.add('dragover');
        });

        this.uploadArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            this.uploadArea.classList.remove('dragover');
        });

        this.uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            this.uploadArea.classList.remove('dragover');
            
            const files = e.dataTransfer.files;
            if (files.length > 0 && files[0].type.startsWith('image/')) {
                this.driveLink.value = '';
                this.displayImageFromFile(files[0]);
            }
        });

        // Drive link input
        this.driveLink.addEventListener('paste', (e) => {
            setTimeout(() => {
                const driveUrl = this.driveLink.value.trim();
                if (driveUrl) {
                    this.fileInput.value = '';
                    this.displayImageFromDriveLink(driveUrl);
                }
            }, 100);
        });

        this.driveLink.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const driveUrl = this.driveLink.value.trim();
                if (driveUrl) {
                    this.fileInput.value = '';
                    this.displayImageFromDriveLink(driveUrl);
                }
            }
        });

        // Generate button
        this.generateBtn.addEventListener('click', () => {
            this.handleGenerateEdits();
        });

        // Sample count validation
        this.sampleCount.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            if (value < 1) e.target.value = 1;
            if (value > 8) e.target.value = 8;
        });
    }

    displayImageFromFile(file) {
        if (!file.type.startsWith('image/')) {
            alert('Please select a valid image file.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            this.showEditInterface(e.target.result);
        };
        reader.readAsDataURL(file);
    }

    displayImageFromDriveLink(driveUrl) {
        // Convert Google Drive share link to direct image URL
        const fileId = this.extractDriveFileId(driveUrl);
        
        if (!fileId) {
            alert('Please enter a valid Google Drive link.');
            return;
        }

        const directUrl = `https://drive.google.com/uc?id=${fileId}`;
        
        // Test if the image loads
        const img = new Image();
        img.onload = () => {
            this.showEditInterface(directUrl);
        };
        img.onerror = () => {
            alert('Unable to load image from Google Drive link. Make sure the file is publicly accessible.');
        };
        img.src = directUrl;
    }

    extractDriveFileId(url) {
        // Extract file ID from various Google Drive URL formats
        const patterns = [
            /\/file\/d\/([a-zA-Z0-9-_]+)/,
            /id=([a-zA-Z0-9-_]+)/,
            /\/d\/([a-zA-Z0-9-_]+)\//
        ];

        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match) {
                return match[1];
            }
        }
        return null;
    }

    showEditInterface(imageSrc) {
        this.currentImage = imageSrc;
        this.thumbnailImage.src = imageSrc;
        
        // Hide upload area and show edit interface
        this.uploadArea.style.display = 'none';
        this.editInterface.style.display = 'block';
        
        // Scroll to edit interface
        this.editInterface.scrollIntoView({ behavior: 'smooth' });
    }

    async handleGenerateEdits() {
        const prompt = this.editPrompt.value.trim();
        const samples = parseInt(this.sampleCount.value);

        if (!prompt) {
            alert('Please enter an edit prompt.');
            return;
        }

        if (!this.currentImage) {
            alert('No image loaded.');
            return;
        }

        // Disable button and show loading state
        this.generateBtn.disabled = true;
        this.generateBtn.textContent = 'Generating...';

        try {
            // Simulate API call (replace with actual Nano Banana API)
            await this.simulateGeneration(prompt, samples);
            
            alert(`Generated ${samples} sample(s) with prompt: "${prompt}"`);
        } catch (error) {
            console.error('Generation failed:', error);
            alert('Failed to generate edits. Please try again.');
        } finally {
            // Re-enable button
            this.generateBtn.disabled = false;
            this.generateBtn.textContent = 'Generate Edits';
        }
    }

    async simulateGeneration(prompt, samples) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // In real implementation, this would call the Nano Banana API
        console.log(`Generating ${samples} samples with prompt: "${prompt}"`);
        console.log('Image data:', this.currentImage.substring(0, 50) + '...');
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new NanoBananaApp();
});