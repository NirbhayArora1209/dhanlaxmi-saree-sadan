import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import ProductImageGallery from '@/components/products/ProductImageGallery'
import { ProductImage } from '@/types'

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: any) => {
    // Remove fill and priority props for the mock
    const { fill, priority, ...rest } = props;
    return <img src={src} alt={alt} {...rest} />;
  },
}))

const mockImages: ProductImage[] = [
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

describe('ProductImageGallery', () => {
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
      expect(mainImage).toHaveAttribute('alt', 'Test Saree - Front View')
      expect(mainImage).toHaveAttribute('src', '/images/products/test-saree-1.jpg')

      // Check thumbnails
      const thumbnails = screen.getAllByTestId('thumbnail')
      expect(thumbnails[0].querySelector('img')).toHaveAttribute('alt', 'Test Saree - Front View (thumbnail)')
      expect(thumbnails[1].querySelector('img')).toHaveAttribute('alt', 'Test Saree - Back View (thumbnail)')
      expect(thumbnails[2].querySelector('img')).toHaveAttribute('alt', 'Test Saree - Draped View (thumbnail)')

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
      const mainImage = screen.getByAltText('Test Saree - Front View')
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

    it('should use fallback alt text when not provided', () => {
      const imagesWithoutAlt = [
        {
          url: '/images/products/test-saree-1.jpg',
          view_type: 'front' as const
        }
      ]
      render(<ProductImageGallery images={imagesWithoutAlt} productName="Test Saree" />)

      const mainImage = screen.getByAltText('Test Saree - front view')
      expect(mainImage).toBeInTheDocument()
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
        expect(screen.getByText('Back View')).toBeInTheDocument()
      })
    })

    it('should navigate to previous image when previous button is clicked', async () => {
      render(<ProductImageGallery {...defaultProps} />)

      // Go to second image first
      const nextButton = screen.getByLabelText('Next image')
      fireEvent.click(nextButton)

      await waitFor(() => {
        expect(screen.getByText('Back View')).toBeInTheDocument()
      })

      // Click previous button
      const prevButton = screen.getByLabelText('Previous image')
      fireEvent.click(prevButton)

      // Should show first image
      await waitFor(() => {
        expect(screen.getByText('Front View')).toBeInTheDocument()
      })
    })

    it('should wrap around when navigating past last image', async () => {
      render(<ProductImageGallery {...defaultProps} />)

      // Go to last image
      const nextButton = screen.getByLabelText('Next image')
      fireEvent.click(nextButton) // Go to second
      fireEvent.click(nextButton) // Go to third

      await waitFor(() => {
        expect(screen.getByText('Draped View')).toBeInTheDocument()
      })

      // Click next again (should wrap to first)
      fireEvent.click(nextButton)

      await waitFor(() => {
        expect(screen.getByText('Front View')).toBeInTheDocument()
      })
    })

    it('should wrap around when navigating before first image', async () => {
      render(<ProductImageGallery {...defaultProps} />)

      // Click previous button (should wrap to last)
      const prevButton = screen.getByLabelText('Previous image')
      fireEvent.click(prevButton)

      await waitFor(() => {
        expect(screen.getByText('Draped View')).toBeInTheDocument()
      })
    })

    it('should navigate to specific image when thumbnail is clicked', async () => {
      render(<ProductImageGallery {...defaultProps} />)

      // Click on third thumbnail
      const thumbnails = screen.getAllByTestId('thumbnail')
      fireEvent.click(thumbnails[2]) // Third thumbnail

      await waitFor(() => {
        expect(screen.getByTestId('main-image')).toHaveAttribute('alt', 'Test Saree - Draped View')
        expect(screen.getByText('Draped View')).toBeInTheDocument()
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

  describe('Thumbnail States', () => {
    it('should highlight current thumbnail', () => {
      render(<ProductImageGallery {...defaultProps} />)

      const thumbnails = screen.getAllByTestId('thumbnail')
      
      // First thumbnail should be highlighted
      expect(thumbnails[0]).toHaveClass('border-amber-500')
      expect(thumbnails[1]).toHaveClass('border-gray-200')
      expect(thumbnails[2]).toHaveClass('border-gray-200')
    })

    it('should update thumbnail highlighting when navigating', async () => {
      render(<ProductImageGallery {...defaultProps} />)

      const thumbnails = screen.getAllByTestId('thumbnail')
      const nextButton = screen.getByLabelText('Next image')
      
      fireEvent.click(nextButton)

      await waitFor(() => {
        expect(thumbnails[0]).toHaveClass('border-gray-200')
        expect(thumbnails[1]).toHaveClass('border-amber-500')
        expect(thumbnails[2]).toHaveClass('border-gray-200')
      })
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
      const thumbnails = screen.getAllByTestId('thumbnail')
      expect(thumbnails[0].querySelector('img')).toHaveAttribute('alt', 'Test Saree - Front View (thumbnail)')
      expect(thumbnails[1].querySelector('img')).toHaveAttribute('alt', 'Test Saree - Back View (thumbnail)')
      expect(thumbnails[2].querySelector('img')).toHaveAttribute('alt', 'Test Saree - Draped View (thumbnail)')
    })
  })

  describe('Edge Cases', () => {
    it('should handle images with missing url', () => {
      const invalidImages = [
        {
          url: '',
          view_type: 'front' as const,
          alt_text: 'Invalid Image'
        }
      ]
      render(<ProductImageGallery images={invalidImages} productName="Test Saree" />)

      const mainImage = screen.getByAltText('Invalid Image')
      expect(mainImage).toHaveAttribute('src', '')
    })

    it('should handle different view types', () => {
      const mixedViewTypes = [
        {
          url: '/images/products/test-saree-1.jpg',
          view_type: 'flat' as const,
          alt_text: 'Flat View'
        },
        {
          url: '/images/products/test-saree-2.jpg',
          view_type: 'mannequin' as const,
          alt_text: 'Mannequin View'
        }
      ]
      render(<ProductImageGallery images={mixedViewTypes} productName="Test Saree" />)

      expect(screen.getByText('flat')).toBeInTheDocument()
      expect(screen.getByText('mannequin')).toBeInTheDocument()
      expect(screen.getByText('Flat View')).toBeInTheDocument()
    })
  })
}) 