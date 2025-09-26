async function testImageFormats() {
    try {
        console.log('🖼️ Testing Universal Image Processing API...\n');
        
        // Test with the simple image first
        const testImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
        
        const response = await fetch('http://localhost:3000/api/process-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                image: testImage,
                format: 'jpeg',
                quality: 85,
                maxWidth: 1024,
                maxHeight: 1024,
                optimize: true
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            console.log('✅ Image processing successful!');
            console.log('📄 Original format:', result.originalFormat);
            console.log('🎯 Processed format:', result.processedFormat);
            console.log('📊 Original size:', result.originalSize, 'bytes');
            console.log('📉 Processed size:', result.processedSize, 'bytes');
            console.log('📈 Compression:', Math.round((1 - result.processedSize/result.originalSize) * 100) + '%');
            console.log('⏱️ Processing time:', result.processingTime + 'ms');
            console.log('🔗 Processed image length:', result.processedImage?.length || 0, 'chars');
        } else {
            console.log('❌ Processing failed:', result.error);
        }
        
        // Test supported formats endpoint
        console.log('\n🔍 Checking supported formats...');
        const formatsResponse = await fetch('http://localhost:3000/api/process-image');
        const formatsData = await formatsResponse.json();
        
        if (formatsData.supportedFormats) {
            console.log('✅ Supported formats:', formatsData.supportedFormats.length);
            console.log('📋 Some examples:', formatsData.supportedFormats.slice(0, 10));
        }
        
    } catch (error) {
        console.log('❌ Test error:', error.message);
    }
}

testImageFormats();