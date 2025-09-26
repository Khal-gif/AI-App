const fs = require('fs');

// Test photo editing API
async function testPhotoEdit() {
    // Sample base64 encoded 1x1 pixel image for testing
    const testImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
    
    const requestBody = {
        image: testImage,
        editPrompt: 'make the background purple and add sparkles',
        style: 'artistic',
        strength: 75
    };
    
    try {
        console.log('🎨 Testing Photo Editing API...');
        console.log('✏️ Edit prompt:', requestBody.editPrompt);
        
        const response = await fetch('http://localhost:3000/api/edit-photo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });
        
        const result = await response.json();
        
        if (result.success) {
            console.log('✅ Photo edit successful!');
            console.log('🔍 Original analysis:', result.originalAnalysis);
            console.log('📝 Edit description:', result.editDescription);
            console.log('🖼️ Edited image URL:', result.editedImageUrl);
            console.log('⏱️ Processing time:', result.processingTime + 'ms');
        } else {
            console.log('❌ Photo edit failed:', result.error);
        }
        
    } catch (error) {
        console.log('❌ Test error:', error.message);
    }
}

testPhotoEdit();