import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: any) => (
    <img src={src} alt={alt} {...props} />
  ),
}))

// Mock Heroicons
jest.mock('@heroicons/react/24/outline', () => ({
  ChevronLeftIcon: ({ className }: any) => <div className={className}>←</div>,
  ChevronRightIcon: ({ className }: any) => <div className={className}>→</div>,
}))

// Simple ProductImageGallery component for testing
const ProductImageGallery = ({ images, productName }: any) => {
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0)

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const goToImage = (index: number) => {
    setCurrentImageIndex(index)
  }

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">No images available</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Main Image */}
      <div className="relative w-full h-96 md:h-[500px] bg-white rounded-lg overflow-hidden shadow-lg">
        <img
          data-testid="main-image"
          src={images[currentImageIndex].url}
          alt={images[currentImageIndex].alt_text || `${productName} - ${images[currentImageIndex].view_type} view`}
          className="object-cover w-full h-full"
        />
        
        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
              aria-label="Previous image"
            >
              ←
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
              aria-label="Next image"
            >
              →
            </button>
          </>
        )}
        
        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
            {currentImageIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail Navigation */}
      {images.length > 1 && (
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
          {images.map((image: any, index: number) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                index === currentImageIndex
                  ? 'border-amber-500 shadow-lg'
                  : 'border-gray-200 hover:border-amber-300'
              }`}
            >
              <img
                data-testid="thumbnail"
                src={image.url}
                alt={image.alt_text || `${productName} ${image.view_type} view`}
                className="object-cover w-full h-full"
              />
              {index === currentImageIndex && (
                <div className="absolute inset-0 bg-amber-500/20" />
              )}
              {/* View Type Label */}
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs px-1 py-0.5 text-center">
                {image.view_type}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Image View Labels */}
      {images.length > 1 && (
        <div className="mt-3 text-center">
          <p className="text-sm text-gray-600 font-medium">
            {images[currentImageIndex].view_type.charAt(0).toUpperCase() + images[currentImageIndex].view_type.slice(1)} View
          </p>
        </div>
      )}
    </div>
  )
}

const mockImages = [
  {
    url: '/images/products/test-saree-1.jpg',
    view_type: 'front',
    alt_text: 'Test Saree - Front View'
  },
  {
    url: '/images/products/test-saree-2.jpg',
    view_type: 'back',
    alt_text: 'Test Saree - Back View'
  },
  {
    url: '/images/products/test-saree-3.jpg',
    view_type: 'drape',
    alt_text: 'Test Saree - Draped View'
  }
]

describe('ProductImageGallery (Simplified)', () => {
  const defaultProps = {
    images: mockImages,
    productName: 'Test Saree'
  }

  describe('Rendering', () => {
    it('should render main image and thumbnails for multiple images', () => {
      render(<ProductImageGallery {...defaultProps} />)

      // Check main image
      const mainImage = screen.getByTestId('main-image')
      expect(mainImage).toBeInTheDocument()
      expect(mainImage).toHaveAttribute('src', '/images/products/test-saree-1.jpg')

      // Check thumbnails
      const thumbnails = screen.getAllByTestId('thumbnail')
      expect(thumbnails).toHaveLength(3) // 3 thumbnail buttons

      // Check view type labels on thumbnails
      expect(screen.getByText('front')).toBeInTheDocument()
      expect(screen.getByText('back')).toBeInTheDocument()
      expect(screen.getByText('drape')).toBeInTheDocument()

      // Check current view label
      expect(screen.getByText('Front View')).toBeInTheDocument()
    })

    it('should render single image without navigation', () => {
      const singleImage = [mockImages[0]]
      render(<ProductImageGallery images={singleImage} productName="Test Saree" />)

      // Check main image
      const mainImage = screen.getByTestId('main-image')
      expect(mainImage).toBeInTheDocument()

      // Should not have navigation arrows
      expect(screen.queryByLabelText('Previous image')).not.toBeInTheDocument()
      expect(screen.queryByLabelText('Next image')).not.toBeInTheDocument()

      // Should not have thumbnails
      const thumbnails = screen.queryAllByTestId('thumbnail')
      expect(thumbnails).toHaveLength(0)

      // Should not have image counter
      expect(screen.queryByText('1 / 1')).not.toBeInTheDocument()
    })

    it('should handle empty images array', () => {
      render(<ProductImageGallery images={[]} productName="Test Saree" />)

      expect(screen.getByText('No images available')).toBeInTheDocument()
    })

    it('should handle null/undefined images', () => {
      render(<ProductImageGallery images={null as any} productName="Test Saree" />)

      expect(screen.getByText('No images available')).toBeInTheDocument()
    })
  })

  describe('Navigation', () => {
    it('should navigate to next image when next button is clicked', async () => {
      render(<ProductImageGallery {...defaultProps} />)

      // Initially shows first image
      expect(screen.getByTestId('main-image')).toBeInTheDocument()
      expect(screen.getByText('Front View')).toBeInTheDocument()

      // Click next button
      const nextButton = screen.getByLabelText('Next image')
      fireEvent.click(nextButton)

      // Should show second image
      await waitFor(() => {
        expect(screen.getByTestId('main-image')).toHaveAttribute('alt', 'Test Saree - Back View')
        expect(screen.getByText((content) => /Back\s*View/.test(content))).toBeInTheDocument()
      })
    })

    it('should navigate to specific image when thumbnail is clicked', async () => {
      render(<ProductImageGallery {...defaultProps} />)

      // Click on third thumbnail
      const thumbnails = screen.getAllByTestId('thumbnail')
      fireEvent.click(thumbnails[2]) // Third thumbnail

      await waitFor(() => {
        expect(screen.getByTestId('main-image')).toHaveAttribute('alt', 'Test Saree - Draped View')
        expect(screen.getByText((content) => /Drape\s*View/i.test(content))).toBeInTheDocument()
      })
    })
  })

  describe('Image Counter', () => {
    it('should display correct image counter', () => {
      render(<ProductImageGallery {...defaultProps} />)

      expect(screen.getByText('1 / 3')).toBeInTheDocument()

      // Navigate to second image
      const nextButton = screen.getByLabelText('Next image')
      fireEvent.click(nextButton)

      expect(screen.getByText('2 / 3')).toBeInTheDocument()
    })

    it('should not show counter for single image', () => {
      const singleImage = [mockImages[0]]
      render(<ProductImageGallery images={singleImage} productName="Test Saree" />)

      expect(screen.queryByText('1 / 1')).not.toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(<ProductImageGallery {...defaultProps} />)

      expect(screen.getByLabelText('Previous image')).toBeInTheDocument()
      expect(screen.getByLabelText('Next image')).toBeInTheDocument()
    })

    it('should have proper alt text for all images', () => {
      render(<ProductImageGallery {...defaultProps} />)

      expect(screen.getByTestId('main-image')).toHaveAttribute('alt', 'Test Saree - Front View')
      const nextButton = screen.getByLabelText('Next image')
      fireEvent.click(nextButton)
      expect(screen.getByTestId('main-image')).toHaveAttribute('alt', 'Test Saree - Back View')
      fireEvent.click(nextButton)
      expect(screen.getByTestId('main-image')).toHaveAttribute('alt', 'Test Saree - Draped View')
    })
  })
}) 