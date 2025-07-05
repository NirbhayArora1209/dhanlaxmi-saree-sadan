'use client';

export default function TestImagesPage() {
  const testImages = [
    '/images/products/banarasi-silk-1.jpg',
    '/images/products/cotton-handloom-1.jpg',
    '/images/products/designer-emerald-1.jpg',
    '/images/products/wedding-lehenga-1.jpg',
    '/images/products/party-georgette-1.jpg',
  ];

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Image Test Page</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testImages.map((imagePath, index) => (
          <div key={index} className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">Test Image {index + 1}</h3>
            <p className="text-sm text-gray-600 mb-2">{imagePath}</p>
            <div className="relative w-full h-64 bg-gray-100 rounded">
              <img
                src={imagePath}
                alt={`Test image ${index + 1}`}
                className="w-full h-full object-cover rounded"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 